export default class ShopScene extends Phaser.Scene {
    constructor() {
        super("ShopScene");
    }

    create() {
        // === Datos base ===
        this.categories = {
            "Pociones curación": [
                { name: "Poción Roja", texture: "pocion_roja", description: "Restaura una pequeña cantidad de salud.", coins: 25, id: 0},
                { name: "Poción Azul", texture: "pocion_azul", description: "Recupera una cantidad decente de salud.", coins:  25, id: 2},
            ],
            "Pociones daño": [
                { name: "Poción Daño Área", texture: "pocion_daño_area", description: "Inflinge daño en área al equipo rival", coins: 40, id: 4},
                { name: "Poción Daño Pequeña", texture: "pocion_daño_pequeña", description: "Inflinge daño a un objetivo", coins: 25, id: 5},
                { name: "Poción Daño Grande", texture: "pocion_daño_grande", description: "Inflinge una gran cantidad de daño a un objetivo", coins: 50, id: 6},
            ],
            "Pociones utilidad": [
                { name: "Poción De Ataque", texture: "pocion_ataque", description: "Sube el ataque", coins: 15, id: 8},
                { name: "Poción De Defensa", texture: "pocion_defensa", description: "Aumenta la defensa del equipo aliado", coins: 15, id: 9},
            ],
            "Personajes": [
                { name: "Wizard", texture: "wizard_image", description: "Magic", coins: 100 },
            ],
        };

        this.inventory = this.registry.get('inventory'); // Coge el objeto que maneja el inventario del registro de escenas

        this.currentCoins = 1000;
        this.availableCharacters =[
        { texture: 'wizard', name: 'Wizard', hp: 100, atk: 20 },
        { texture: 'goblin', name: 'Goblin', hp: 120, atk: 15 },
        { texture: 'ghost', name: 'Ghost', hp: 120, atk: 15 },
        { texture: 'mushroom', name: 'Mushroom', hp: 120, atk: 15 },
        { texture: 'flying_eye', name: 'Flying Eye', hp: 120, atk: 15 },
        { texture: 'pharaoh', name: 'Pharaoh', hp: 120, atk: 15 },
        { texture: 'scarab', name: 'Scarab', hp: 120, atk: 15 },
        { texture: 'jester', name: 'Jester', hp: 120, atk: 15 },
        ];

        this.characterDict = Object.fromEntries(
        this.availableCharacters.map(c => [c.name, c])
        );

        this.boughtCharacters = [];
        
        this.resetShop();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.moveSelection(-1, 0);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.moveSelection(1, 0);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.moveSelection(0, -1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.moveSelection(0, 1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.space)){
            this.buyItem();
        }

        // === Volver al menú con ESC ===
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
            this.scene.switch('MenuScene');
        }
    }

    moveSelection(deltaX, deltaY) {
        let newCategoryIndex = this.selectedCategoryIndex;
        let newItemIndex = this.selectedItemIndex;

        const maxCategories = this.categoryGroups.length;

        // === Movimiento vertical ===
        if (deltaY !== 0) {
            let nextCategory = newCategoryIndex + deltaY;

            // Buscar siguiente categoría con ítems disponibles
            while (
                nextCategory >= 0 &&
                nextCategory < maxCategories &&
                this.categoryGroups[nextCategory].itemSlots.length === 0
            ) {
                nextCategory += deltaY; // sigue buscando en la misma dirección
            }

            // Si hay una categoría válida
            if (
                nextCategory >= 0 &&
                nextCategory < maxCategories &&
                this.categoryGroups[nextCategory].itemSlots.length > 0
            ) {
                newCategoryIndex = nextCategory;

                // Mantener la posición horizontal si existe ese índice
                const maxItemsInNew = this.categoryGroups[newCategoryIndex].itemSlots.length;
                newItemIndex = Math.min(this.selectedItemIndex, maxItemsInNew - 1);
            }
        }

        // === Movimiento horizontal ===
        if (deltaX !== 0) {
            const currentGroup = this.categoryGroups[newCategoryIndex];
            const maxItems = currentGroup.itemSlots.length;

            if (maxItems > 0) {
                newItemIndex = Phaser.Math.Clamp(newItemIndex + deltaX, 0, maxItems - 1);
            }
        }

        this.updateSelection(newItemIndex, newCategoryIndex);
    }


   updateSelection(itemIndex, categoryIndex) {
        // Quitar resaltado anterior
        const prevGroup = this.categoryGroups[this.selectedCategoryIndex];
        if (prevGroup && prevGroup.itemSlots[this.selectedItemIndex]) {
            prevGroup.itemSlots[this.selectedItemIndex].rect.setFillStyle(0x333333);
        }

        // Actualizar índices
        this.selectedCategoryIndex = categoryIndex;
        this.selectedItemIndex = itemIndex;

        // Resaltar nuevo
        const newGroup = this.categoryGroups[this.selectedCategoryIndex];
        const selected = newGroup.itemSlots[this.selectedItemIndex];
        selected.rect.setFillStyle(0xffff00);

        const item = selected.item;

        // === Actualizar imagen de vista previa ===
        this.preview.setTexture(item.texture).setDisplaySize(100, 100);

        // === Nombre ===
        this.previewName.setText(item.name);
        this.previewPrice.setText(`Price: ${item.coins}`);

        // === Crear texto de descripción si no existe ===
        if (!this.previewDescription) {
            this.previewDescription = this.add.text(this.previewName.x, this.previewName.y, "", {
                fontSize: "14px",
                color: "#ffffff",
                align: "center",
                wordWrap: { width: 180 }
            }).setOrigin(0.5);
        }

        // Actualizar texto de descripción
        this.previewDescription.setText(item.description);

        const nameBounds = this.previewName.getBounds();
        const priceY = nameBounds.bottom + 20;
        this.previewDescription.setPosition(this.previewName.x, priceY);
    }


    addNewItems(unlockedBooks)
    {
        if(unlockedBooks == 2){

            // const greenPotion = {
            // name: "Poción Verde", texture: "pocion_verde", description: "Aumenta la velocidad temporalmente.", coins: 25, id: 10 };
            // this.categories["Pociones curación"].push(greenPotion);
            
            // const stunPotion ={
            // name: "Poción Aturdidora", texture: "pocion_aturdidora", description: "Evita el ataque del próximo turno del enemigo", coins: 25, id: 11 };
            // this.categories["Pociones utilidad"].push(stunPotion);

            const goblin = {
            name: "Goblin", texture: "goblin_image", description: "Bicho verde agresivo", coins: 125}
            this.categories["Personajes"].push(goblin);
            
            const ghost = {
            name: "Ghost", texture: "ghost_image", description: "BOOOOOOOOOOO!", coins: 125 }
            this.categories["Personajes"].push(ghost);

        }
        else if(unlockedBooks == 3)
        {
            // const goldenPotion = {
            // name: "Poción Dorada", texture: "pocion_dorada", description: "Otorga invulnerabilidad por unos segundos.", coins: 25 , id:12};
            // this.categories["Pociones curación"].push(goldenPotion);

            // const cataclismPotion = {
            // name: "Poción Cataclismo", texture: "pocion_cataclismo", description: "Inflinge una gran cantidad de daño a todos los personajes del campo de batalla", coins: 100, id:13 };
            // this.categories["Pociones daño"].push(cataclismPotion);

            const mushroom = {
            name: "Mushroom", texture: "mushroom", description: "Room Room", coins: 200};
            this.categories["Personajes"].push(mushroom);

            const flyingeye = {
            name: "Flying Eye", texture: "flying_eye", description: "Flap flap", coins: 200 };
            this.categories["Personajes"].push(flyingeye);

        }else if(unlockedBooks == 4)
        {
            const pharaoh = {
            name: "Pharaoh", texture: "pharaoh", description: "𓀅𓂯𓄠𓃼𓁵𓁥𓁾𓁴𓂋𓐑𓐔𓀗𓐗𓀳", coins: 250 };
            this.categories["Personajes"].push(pharaoh);

            const scarab = {
            name: "Scarab", texture: "scarab", description: "𓂯𓁾𓄠𓃼𓁴𓂋𓐑𓐔𓀗𓐗𓀅𓀳𓁵𓁥", coins: 250 };
            this.categories["Personajes"].push(scarab);

        }else if(unlockedBooks == 5)
        {
            const jester = {
            name: "Jester", texture: "jester", description: "JIJIJIJIJIJIJIJI", coins: 300 };
            this.categories["Personajes"].push(jester);

        }
    }

    buyItem() {
        const selectedGroup = this.categoryGroups[this.selectedCategoryIndex];
        const selectedSlot = selectedGroup.itemSlots[this.selectedItemIndex];
        const objeto = selectedSlot.item;

        if(selectedGroup.name === 'Personajes')
        {
            this.boughtCharacters.push(this.characterDict[objeto.name]);
            console.log("Comprados:", this.boughtCharacters);
        }else if(selectedGroup.name === 'Pociones curación'){
            this.inventory.insertItem(objeto.id);
        }


        if (this.currentCoins >= objeto.coins) {
            // Restar monedas
            this.updateCoins(-objeto.coins);
            console.log(`Compraste ${objeto.name} por ${objeto.coins} monedas.`);
            console.log(`Te quedan ${this.currentCoins} monedas.`);

            // Destruir elementos visuales
            selectedSlot.rect.destroy();
            selectedSlot.icon.destroy();

            // Eliminar el slot del grupo
            selectedGroup.itemSlots.splice(this.selectedItemIndex, 1);

            // === Si la categoría aún tiene ítems ===
            if (selectedGroup.itemSlots.length > 0) {
                // Ajustar el índice si el actual ya no existe
                this.selectedItemIndex = Math.min(this.selectedItemIndex, selectedGroup.itemSlots.length - 1);
                this.updateSelection(this.selectedItemIndex, this.selectedCategoryIndex);
            }
            // === Si la categoría se queda vacía ===
            else {
                console.log(`Categoría "${selectedGroup.name}" vacía, buscando otra...`);

                const totalCats = this.categoryGroups.length;
                let newCatIndex = this.selectedCategoryIndex;
                let found = false;

                // Buscar hacia abajo primero
                for (let i = newCatIndex + 1; i < totalCats; i++) {
                    if (this.categoryGroups[i].itemSlots.length > 0) {
                        newCatIndex = i;
                        found = true;
                        break;
                    }
                }

                // Si no encontró hacia abajo, busca hacia arriba
                if (!found) {
                    for (let i = newCatIndex - 1; i >= 0; i--) {
                        if (this.categoryGroups[i].itemSlots.length > 0) {
                            newCatIndex = i;
                            found = true;
                            break;
                        }
                    }
                }

                if (found) {
                    // Mantener el índice horizontal si es posible
                    const maxItemsInNew = this.categoryGroups[newCatIndex].itemSlots.length;
                    this.selectedCategoryIndex = newCatIndex;
                    this.selectedItemIndex = Math.min(this.selectedItemIndex, maxItemsInNew - 1);
                    this.updateSelection(this.selectedItemIndex, this.selectedCategoryIndex);
                } else {
                    // Si no hay categorías con ítems, limpiar vista previa
                    console.log("¡Has comprado todos los objetos de la tienda!");
                    this.preview.setVisible(false);
                    this.previewName.setText("");
                    this.previewDescription.setText("");
                    this.previewPrice.setText("");
                }
            }

        } else {
            console.log(`No tienes suficientes monedas para comprar ${objeto.name}.`);
        }
    }



    resetShop()
    {
        // 🔹 1. Si ya existen elementos anteriores, destruirlos
        if (this.categoryGroups) {
            this.categoryGroups.forEach(group => {
                // Eliminar el texto de la categoría
                group.categoryText.destroy();

                // Eliminar los ítems (rectángulos e iconos)
                group.itemSlots.forEach(slot => {
                    slot.rect.destroy();
                    slot.icon.destroy();
                });
            });
        }

        // 🔹 2. Eliminar vista previa si existía
        if (this.preview) this.preview.destroy();
        if (this.previewName) this.previewName.destroy();
        if (this.previewPrice) this.previewPrice.destroy();
        if (this.previewDescription) this.previewDescription.destroy();
        if (this.coinsText) this.coinsText.destroy();

        // 🔹 3. Reiniciar arrays y propiedades
        this.categoryNames = Object.keys(this.categories);
        this.selectedCategoryIndex = 0;
        this.selectedItemIndex = 0;
        this.categoryGroups = [];

        const { width, height } = this.scale;

        const categorySpacingY = 50; // separación vertical entre categorías
        const startY = 15;

        this.categoryNames.forEach((categoryName, categoryIndex) => {
            const items = this.categories[categoryName];
            const categoryY = startY + categoryIndex * categorySpacingY;

            // Texto del nombre de la categoría
            const categoryText = this.add.text(width * 0.25, categoryY + 15, categoryName, {
                fontSize: "11px",
                color: "#ffffff",
                fontFamily: "Arial",
            }).setOrigin(0.5);

            // Crear los ítems en una fila
            const itemSlots = [];
            const spacingX = 30;
            const totalWidth = 3 * spacingX;
            const startX = width * 0.25 - totalWidth / 2;
            const y = categoryY + 40;

            let itemsIndex = [];

            for(let i = 0; i < items.length; i++)
                    itemsIndex.push(i);

            while (itemsIndex.length < 4) {
                const randomIndex = Math.floor(Math.random() * items.length);
                itemsIndex.push(randomIndex);
            }


            for(let i = 0; i < 4; i++)
            {
                const randomIndex = Math.floor(Math.random() * itemsIndex.length);
                const actualItemIndex = itemsIndex[randomIndex];
                itemsIndex.splice(randomIndex, 1);
                const item = items[actualItemIndex];

                const x = startX + i * spacingX;
                const size = 25;

                const rect = this.add.rectangle(x, y, size, size, 0x333333).setOrigin(0.5);
                const icon = this.add.image(x, y, item.texture)
                    .setOrigin(0.5)
                    .setDisplaySize(size * 0.8, size * 0.8);

                itemSlots.push({ rect, icon, item});
            }

            this.categoryGroups.push({ name: categoryName, itemSlots, categoryText });
        });

        this.coinsText = this.add.text(80, 15, "Coins: " + this.currentCoins, {
            fontSize: "16px",
            color: "#ffff00",
            wordWrap: { width: 150, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);

        // === Vista previa (lado derecho) ===
        const firstItem = this.categories[this.categoryNames[0]][0];

        const previewSize = 100; 
        this.preview = this.add.image(width * 0.75, height * 0.4, firstItem.texture)
            .setOrigin(0.5)
            .setDisplaySize(previewSize, previewSize);

        this.previewName = this.add.text(width * 0.75, height * 0.7, firstItem.name, {
            fontSize: "20px",
            color: "#ffff00",
            wordWrap: { width: 150, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);

        this.previewPrice = this.add.text(width * 0.75, height * 0.1, "Price: " + firstItem.coins, {
            fontSize: "20px",
            color: "#ffff00",
            wordWrap: { width: 150, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);

        this.previewDescription = this.add.text(width * 0.75, height * 0.85, firstItem.description, {
            fontSize: "10px",
            color: "#ffffff",
            wordWrap: { width: 150, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);

        // === Teclas ===
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // === Selección inicial ===
        this.updateSelection(0, 0);
        this.updateCoins(0);
    }

    updateCoins(amount)
    {
        this.currentCoins += amount;
        this.coinsText.setText("Coins: " + this.currentCoins);
    }
}

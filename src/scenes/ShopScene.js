import Message from "../ui/Message.js";

export default class ShopScene extends Phaser.Scene {
    constructor() {
        super("ShopScene");
    }

    create() {
        
        this.add.image(this.scale.width / 2, this.scale.height / 2, "shop_background")
        .setOrigin(0.5, 0.58)
        .setDisplaySize(this.scale.width+150, this.scale.height+300); 

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

        this.currentCoins = 250;
        this.availableCharacters =[
        { texture: 'wizard', name: 'Wizard', hp: 140, atk: 22, def: 10 },

        { texture: 'goblin', name: 'Goblin', hp: 110, atk: 14, def: 4 },
        { texture: 'ghost', name: 'Ghost', hp: 105, atk: 13, def: 6 },
        { texture: 'dragon', name: 'Dragon', hp: 220, atk: 28, def: 14 },

        { texture: 'mushroom', name: 'Mushroom', hp: 150, atk: 10, def: 18 },
        { texture: 'flying_eye', name: 'Flying Eye', hp: 90, atk: 20, def: 3 },
        { texture: 'cacodaemon', name: 'Cacodaemon', hp: 180, atk: 30, def: 20 },

        { texture: 'pharaoh', name: 'Pharaoh', hp: 150, atk: 18, def: 12 },
        { texture: 'scarab', name: 'Scarab', hp: 100, atk: 20, def: 6 },
        { texture: 'medusa', name: 'Medusa', hp: 260, atk: 22, def: 16 },

        { texture: 'jester', name: 'Jester', hp: 90, atk: 25, def: 4 },
        { texture: 'king', name: 'King', hp: 320, atk: 8, def: 20 },
        ];

        this.characterDict = Object.fromEntries(
        this.availableCharacters.map(c => [c.name, c])
        );

        this.boughtCharacters = [];

        this.message = new Message(this, this.events);
        
        this.resetShop();
        this.createInventory();

        this.input.keyboard.on("keydown-K", () => {
            for(let i = 0; i < 14; i++)
            this.inventory.insertItem(7);

            console.log("INVENTORY SIZE " + this.inventory.currentItems)
        });

        this.input.keyboard.on("keydown-L", () => {
            this.updateCoins(5000);
        });
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

    // 🟠 Restaurar anterior
    const prevGroup = this.categoryGroups[this.selectedCategoryIndex];
    if (prevGroup && prevGroup.itemSlots[this.selectedItemIndex]) {
        const prev = prevGroup.itemSlots[this.selectedItemIndex];

        // Fondo normal
        prev.rect.setFillStyle(0x333333);
        prev.rect.setStrokeStyle(2, 0x3a3a3a);

        // Reset flotación
        if (prev.icon.floatTween) {
            prev.icon.floatTween.stop();
            prev.icon.floatTween = null;
        }

        // Desactivar brillo
        if (prev.rect.glowTween) {
            prev.rect.glowTween.stop();
            prev.rect.glowTween = null;
        }

        prev.icon.setY(prev.icon.originalY || prev.icon.y);
        prev.rect.isGlowing = false;
    }

    // Actualizar índices
    this.selectedCategoryIndex = categoryIndex;
    this.selectedItemIndex = itemIndex;

    const newGroup = this.categoryGroups[this.selectedCategoryIndex];
    const selected = newGroup.itemSlots[this.selectedItemIndex];

    // 🟡 Fondo seleccionado
    selected.rect.setFillStyle(0xffffaa);
    selected.rect.setStrokeStyle(2, 0xffaa00);

    // Guardar posición original solo una vez
    if (selected.icon.originalY === undefined)
        selected.icon.originalY = selected.icon.y;

    // ⭐ FLOTACIÓN SUPER SUAVE SIN CAMBIAR ESCALA
    selected.icon.floatTween = this.tweens.add({
        targets: selected.icon,
        y: selected.icon.originalY - 3,
        duration: 650,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
    });

    // 🟢 PREVIEW
    const item = selected.item;
    this.preview.setTexture(item.texture).setDisplaySize(100, 100);
    this.previewName.setText(item.name);
    this.previewPrice.setText(`Price: ${item.coins}`);
    if (this.previewDescription) this.previewDescription.setText(item.description);
}




    addNewItems(unlockedBooks)
    {
        if(unlockedBooks == 2){

            const greenPotion = {
            name: "Poción Verde", texture: "pocion_verde", description: "Cura una cantidad mediana de vida", coins: 25, id:1 };
            this.categories["Pociones curación"].push(greenPotion);
            
            // const stunPotion ={
            // name: "Poción Aturdidora", texture: "pocion_aturdidora", description: "Evita el ataque del próximo turno del enemigo", coins: 25, id: 11 };
            // this.categories["Pociones utilidad"].push(stunPotion);

            const goblin = {
            name: "Goblin", texture: "goblin_image", description: "Bicho verde agresivo", coins: 125}
            this.categories["Personajes"].push(goblin);
            
            const ghost = {
            name: "Ghost", texture: "ghost_image", description: "BOOOOOOOOOOO!", coins: 125 }
            this.categories["Personajes"].push(ghost);

            const dragon = {
            name: "Dragon", texture: "dragon", description: "Grrrrraaaaaahhhhhh", coins: 250 };
            this.categories["Personajes"].push(dragon);

        }
        else if(unlockedBooks == 3)
        {
            const goldenPotion = {
            name: "Poción Dorada", texture: "pocion_dorada", description: "Cura una gran cantidad de vida", coins: 25 , id:3};
            this.categories["Pociones curación"].push(goldenPotion);

            const cataclismPotion = {
            name: "Poción Cataclismo", texture: "pocion_cataclismo", description: "Inflinge una gran cantidad de daño a todos los personajes del campo de batalla", coins: 350, id:7 };
            this.categories["Pociones daño"].push(cataclismPotion);

            const mushroom = {
            name: "Mushroom", texture: "mushroom", description: "Room Room", coins: 200};
            this.categories["Personajes"].push(mushroom);

            const flyingeye = {
            name: "Flying Eye", texture: "flying_eye", description: "Flap flap", coins: 200 };
            this.categories["Personajes"].push(flyingeye);

            const cacodaemon = {
            name: "Cacodaemon", texture: "cacodaemon", description: "SEEEEE YOUUU", coins: 350 };
            this.categories["Personajes"].push(cacodaemon);

        }else if(unlockedBooks == 4)
        {
            const pharaoh = {
            name: "Pharaoh", texture: "pharaoh", description: "𓀅𓂯𓄠𓃼𓁵𓁥𓁾𓁴𓂋𓐑𓐔𓀗𓐗𓀳", coins: 250 };
            this.categories["Personajes"].push(pharaoh);

            const scarab = {
            name: "Scarab", texture: "scarab", description: "𓂯𓁾𓄠𓃼𓁴𓂋𓐑𓐔𓀗𓐗𓀅𓀳𓁵𓁥", coins: 250 };
            this.categories["Personajes"].push(scarab);

            const medusa = {
            name: "Medusa", texture: "medusa", description: "SSSSSSSSSSSSSSSS", coins: 450 };
            this.categories["Personajes"].push(medusa);

        }else if(unlockedBooks == 5)
        {
            const jester = {
            name: "Jester", texture: "jester", description: "JIJIJIJIJIJIJIJI", coins: 250 };
            this.categories["Personajes"].push(jester);

            const king = {
            name: "King", texture: "king", description: "HAHAHAHAHAHAHA", coins: 500 };
            this.categories["Personajes"].push(king);

        }
    }

    buyItem() {
        const selectedGroup = this.categoryGroups[this.selectedCategoryIndex];
        const selectedSlot = selectedGroup.itemSlots[this.selectedItemIndex];
        const objeto = selectedSlot.item;

        if(selectedGroup.name === 'Personajes')
        {
            this.boughtCharacters.push(this.characterDict[objeto.name]);
            //console.log("Comprados:", this.boughtCharacters);

            // Eliminar del array base de categorías
            const personajesArray = this.categories["Personajes"];
            const indexToRemove = personajesArray.findIndex(item => item.name === objeto.name);
            if (indexToRemove !== -1) {
                personajesArray.splice(indexToRemove, 1);
                //console.log(`${objeto.name} eliminado permanentemente de la tienda.`);
            }

        }else if(this.inv.getLimit() <= this.inventory.currentItems){
            console.log("Numero maximo de objetos");
            this.events.emit("Message", "Inventory full.\nYou can't hold more than 6 types of potions.");
            return;
        }
        else if(selectedGroup.name === 'Pociones curación' || selectedGroup.name === 'Pociones utilidad' || selectedGroup.name === 'Pociones daño'){
            this.inventory.insertItem(objeto.id);
            console.log("INVENTORY SIZE " + this.inventory.currentItems)
        }


        if (this.currentCoins >= objeto.coins) {
            // Restar monedas
            this.updateCoins(-objeto.coins);
            //console.log(`Compraste ${objeto.name} por ${objeto.coins} monedas.`);
            //console.log(`Te quedan ${this.currentCoins} monedas.`);

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



    resetShop() {
        // 🔹 1. Si ya existen elementos anteriores, destruirlos
        if (this.categoryGroups) {
            this.categoryGroups.forEach(group => {
                group.categoryText.destroy();
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
        const categorySpacingY = 40;
        const startY = 30;

        this.categoryNames.forEach((categoryName, categoryIndex) => {
            const items = this.categories[categoryName];
            const categoryY = startY + categoryIndex * categorySpacingY;

            // Texto de la categoría
            const categoryText = this.add.text(width * 0.25 + 10, categoryY + 10, categoryName, {
                fontSize: "11px",
                color: "#000000ff",
                fontFamily: "Arial",
            }).setOrigin(0.5);

            // Crear ítems
            const itemSlots = [];
            const spacingX = 30;
            const totalWidth = 3 * spacingX;
            const startX = width * 0.25 - totalWidth / 2;
            const y = categoryY + 30;

            let itemsIndex = [];
            for (let i = 0; i < items.length; i++) itemsIndex.push(i);

            if (categoryName !== 'Personajes') {
                while (itemsIndex.length < 4) {
                    const randomIndex = Math.floor(Math.random() * items.length);
                    itemsIndex.push(randomIndex);
                }
            }

            const max = categoryName !== 'Personajes' ? 4 : Math.min(items.length, 4);
            for (let i = 0; i < max; i++) {
                const randomIndex = Math.floor(Math.random() * itemsIndex.length);
                const actualItemIndex = itemsIndex[randomIndex];
                itemsIndex.splice(randomIndex, 1);
                const item = items[actualItemIndex];

                const x = startX + i * spacingX+10;
                const size = 20;

                const rect = this.add.rectangle(x, y, size, size, 0x333333).setOrigin(0.5);
                const icon = this.add.image(x, y, item.texture)
                    .setOrigin(0.5)
                    .setDisplaySize(size * 0.8, size * 0.8);

                // Guardar escala y posición original
                rect.originalScale = rect.scale;
                icon.originalScaleX = icon.scaleX;
                icon.originalScaleY = icon.scaleY;
                icon.originalY = icon.y;

                itemSlots.push({ rect, icon, item });
            }

            this.categoryGroups.push({ name: categoryName, itemSlots, categoryText });
        });

        // Monedas
        this.coinsText = this.add.text(90, 25, "Coins: " + this.currentCoins, {
            fontSize: "16px",
            color: "#000000ff",
            wordWrap: { width: 150, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);

        // Vista previa
        const firstItem = this.categories[this.categoryNames[0]][0];
        const previewSize = 100;
        this.preview = this.add.image(width * 0.75-5, height * 0.35, firstItem.texture)
            .setOrigin(0.5)
            .setDisplaySize(previewSize, previewSize);

        this.previewName = this.add.text(width * 0.75-5, height * 0.63, firstItem.name, {
            fontSize: "20px",
            color: "#000000ff",
            wordWrap: { width: 150, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);

        this.previewPrice = this.add.text(width * 0.75-5, height * 0.1, "Price: " + firstItem.coins, {
            fontSize: "20px",
            color: "#000000ff",
            wordWrap: { width: 150, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);

        this.previewDescription = this.add.text(width * 0.75-5, height * 0.77, firstItem.description, {
            fontSize: "10px",
            color: "#000000ff",
            wordWrap: { width: 150, useAdvancedWrap: true },
            align: "center"
        }).setOrigin(0.5);

        // Teclas
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Selección inicial
        this.updateSelection(0, 0);
        this.updateCoins(0);
    }


    updateCoins(amount)
    {
        this.currentCoins += amount;
        this.coinsText.setText("Coins: " + this.currentCoins);
    }

    createInventory(){
        this.inv = this.registry.get('inventory');
        this.inventoryLocal = [];
        for(let i = 0; i < this.inv.size(); i++){
            if(this.inv.getNum(i) > 0){
                this.inventoryLocal.push(this.inv.getItem(i));
            }
        }
        console.log('tamaño inventario: ' + this.inventoryLocal.length);
    }
}

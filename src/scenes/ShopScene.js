export default class ShopScene extends Phaser.Scene {
    constructor() {
        super("ShopScene");
    }

    create() {
        // === Datos base ===
        this.categories = {
            "Pociones curación": [
                { name: "Poción Roja", texture: "pocion_roja", description: "Restaura una pequeña cantidad de salud." },
                { name: "Poción Azul", texture: "pocion_azul", description: "Recupera energía mágica o maná." },
            ],
            "Pociones daño": [
                { name: "Poción Daño Área", texture: "pocion_daño_area", description: "Inflinge daño en área al equipo rival" },
                { name: "Poción Daño Pequeña", texture: "pocion_daño_pequeña", description: "Inflinge daño a un objetivo" },
                { name: "Poción Daño Grande", texture: "pocion_daño_grande", description: "Inflinge una gran cantidad de daño a un objetivo" },
            ],
            "Pociones utilidad": [
                { name: "Poción Ataque", texture: "pocion_ataque", description: "Sube el ataque" },
                { name: "Poción Defensa", texture: "pocion_defensa", description: "Aumenta la defensa del equipo aliado" },
            ],
            "Personajes": [
                { name: "Wizard", texture: "wizard_image", description: "Magic" },
            ],
        };

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
        }

        // === Volver al menú con ESC ===
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
            this.scene.switch('MenuScene');
        }
    }

    moveSelection(deltaX, deltaY) {
        const maxCategories = this.categoryGroups.length;
        const newCategoryIndex = Phaser.Math.Clamp(this.selectedCategoryIndex + deltaY, 0, maxCategories - 1);

        const currentCategory = this.categories[this.categoryNames[newCategoryIndex]];
        const maxItems = 4;

        let newItemIndex = this.selectedItemIndex;
        if (deltaX !== 0) {
            newItemIndex = Phaser.Math.Clamp(this.selectedItemIndex + deltaX, 0, maxItems - 1);
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

        // Actualizar vista previa
        this.preview.setTexture(selected.item.texture).setDisplaySize(100, 100);
        this.previewName.setText(selected.item.name);
        this.previewDescription.setText(selected.item.description);
    }

    addNewItems(unlockedBooks)
    {
        if(unlockedBooks == 2){

            const greenPotion = {
            name: "Poción Verde", texture: "pocion_verde", description: "Aumenta la velocidad temporalmente." };
            this.categories["Pociones curación"].push(greenPotion);
            
            const stunPotion ={
            name: "Poción Aturdidora", texture: "pocion_aturdidora", description: "Evita el ataque del próximo turno del enemigo" };
            this.categories["Pociones utilidad"].push(stunPotion);

            const goblin = {
            name: "Goblin", texture: "goblin_image", description: "Bicho verde agresivo" }
            this.categories["Personajes"].push(goblin);
            
            const ghost = {
            name: "Ghost", texture: "ghost_image", description: "BOOOOOOOOOOO!" }
            this.categories["Personajes"].push(ghost);

        }
        else if(unlockedBooks == 3)
        {
            const goldenPotion = {
            name: "Poción Dorada", texture: "pocion_dorada", description: "Otorga invulnerabilidad por unos segundos." };
            this.categories["Pociones curación"].push(goldenPotion);

            const cataclismPotion = {
            name: "Poción Cataclismo", texture: "pocion_cataclismo", description: "Inflinge una gran cantidad de daño a todos los personajes del campo de batalla" };
            this.categories["Pociones daño"].push(cataclismPotion);

        }else if(unlockedBooks == 4)
        {
            const pharaoh = {
            name: "Pharaoh", texture: "pharaoh", description: "𓀅𓂯𓄠𓃼𓁵𓁥𓁾𓁴𓂋𓐑𓐔𓀗𓐗𓀳" };
            this.categories["Personajes"].push(pharaoh);

            const scarab = {
            name: "Scarab", texture: "scarab", description: "𓂯𓁾𓄠𓃼𓁴𓂋𓐑𓐔𓀗𓐗𓀅𓀳𓁵𓁥" };
            this.categories["Personajes"].push(scarab);

        }else if(unlockedBooks == 5)
        {
            const jester = {
            name: "Jester", texture: "jester", description: "JIJIJIJIJIJIJIJI" };
            this.categories["Personajes"].push(jester);

        }else if(unclockedBooks == 6)
        {
            const mushroom = {
            name: "Mushroom", texture: "mushroom", description: "Room Room" };
            this.categories["Personajes"].push(mushroom);

            const flyingeye = {
            name: "Flying Eye", texture: "flying_eye", description: "Flap flap" };
            this.categories["Personajes"].push(flyingeye);
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
        if (this.previewDescription) this.previewDescription.destroy();

        // 🔹 3. Reiniciar arrays y propiedades
        this.categoryNames = Object.keys(this.categories);
        this.selectedCategoryIndex = 0;
        this.selectedItemIndex = 0;
        this.categoryGroups = [];

        const { width, height } = this.scale;

        const categorySpacingY = 50; // separación vertical entre categorías
        const startY = 5;

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
    }
}

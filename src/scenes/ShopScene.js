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
                { name: "Poción Verde", texture: "pocion_verde", description: "Aumenta la velocidad temporalmente." },
                { name: "Poción Dorada", texture: "pocion_dorada", description: "Otorga invulnerabilidad por unos segundos." }
            ],
            "Poción daño": [
                { name: "Espada de Hierro", texture: "espada_hierro", description: "Una espada simple pero confiable." },
                { name: "Hacha de Batalla", texture: "hacha_batalla", description: "Inflige gran daño a corta distancia." },
                { name: "Arco de Roble", texture: "arco_roble", description: "Permite atacar desde lejos." },
                { name: "Daga Envenenada", texture: "daga_veneno", description: "Causa daño prolongado al enemigo." }
            ],
            "Poción utilidad": [
                { name: "Pan", texture: "pan", description: "Recupera un poco de energía." },
                { name: "Carne Asada", texture: "carne_asada", description: "Restablece gran parte de tu salud." },
                { name: "Manzana", texture: "manzana", description: "Una opción ligera y nutritiva." },
                { name: "Queso", texture: "queso", description: "Aumenta tu defensa durante unos segundos." }
            ],
            "Personajes": [
                { name: "Pan", texture: "pan", description: "Recupera un poco de energía." },
                { name: "Carne Asada", texture: "carne_asada", description: "Restablece gran parte de tu salud." },
                { name: "Manzana", texture: "manzana", description: "Una opción ligera y nutritiva." },
                { name: "Queso", texture: "queso", description: "Aumenta tu defensa durante unos segundos." }
            ],
            // "Mejoras Personajes": [
            //     { name: "Pan", texture: "pan", description: "Recupera un poco de energía." },
            //     { name: "Carne Asada", texture: "carne_asada", description: "Restablece gran parte de tu salud." },
            //     { name: "Manzana", texture: "manzana", description: "Una opción ligera y nutritiva." },
            //     { name: "Queso", texture: "queso", description: "Aumenta tu defensa durante unos segundos." }
            // ]
        };

        this.categoryNames = Object.keys(this.categories);
        this.selectedCategoryIndex = 0;
        this.selectedItemIndex = 0;

        const { width, height } = this.scale;

        // === Contenedor de categorías e ítems ===
        this.categoryGroups = [];

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
            const totalWidth = (items.length - 1) * spacingX;
            const startX = width * 0.25 - totalWidth / 2;
            const y = categoryY + 40;

            items.forEach((item, i) => {
                const x = startX + i * spacingX;
                const size = 25;

                const rect = this.add.rectangle(x, y, size, size, 0x333333).setOrigin(0.5);
                const icon = this.add.image(x, y, item.texture)
                    .setOrigin(0.5)
                    .setDisplaySize(size * 0.8, size * 0.8);

                itemSlots.push({ rect, icon, item });
            });

            this.categoryGroups.push({ name: categoryName, itemSlots, categoryText });
        });

        // === Vista previa (lado derecho) ===
        const firstItem = this.categories[this.categoryNames[0]][0];
        this.preview = this.add.image(width * 0.75, height * 0.4, firstItem.texture)
            .setScale(3.5)
            .setOrigin(0.5);

        this.previewName = this.add.text(width * 0.75, height * 0.7, firstItem.name, {
            fontSize: "20px",
            color: "#ffff00",
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
            this.scene.start('MenuScene');
        }
    }

    moveSelection(deltaX, deltaY) {
        const maxCategories = this.categoryGroups.length;
        const newCategoryIndex = Phaser.Math.Clamp(this.selectedCategoryIndex + deltaY, 0, maxCategories - 1);

        const currentCategory = this.categories[this.categoryNames[newCategoryIndex]];
        const maxItems = currentCategory.length;

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
        this.preview.setTexture(selected.item.texture);
        this.previewName.setText(selected.item.name);
        this.previewDescription.setText(selected.item.description);
    }
}

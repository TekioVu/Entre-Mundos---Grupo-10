import Inventory from "../characters/Inventory.js";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
        this.opciones = [
            "FANTASÍA",
            "TERROR",
            "HISTORIA",
            "COMEDIA",
            "THE END",
            "TIENDA"
        ];

        this.selectedIndex = 0;
        this.unlockedbooks = 1;
        this.optionObjects = [];

        const { width, height } = this.scale;
        this.width = width;
        this.height = height;

        // Fondo
        this.cameras.main.setBackgroundColor("#1a1a1a");

        // --------------------------
        // ESTANTERÍA PRINCIPAL
        // --------------------------
        const mainShelfY = height * 0.75;
        this.shelf = this.add.rectangle(width / 2, mainShelfY, width, 20, 0x5c3a21).setOrigin(0.5);
        this.shelfBorder = this.add.rectangle(width / 2, mainShelfY - 10, width, 5, 0x3a2a1f).setOrigin(0.5);

        // --------------------------
        // LIBROS PRINCIPALES
        // --------------------------
        this.updateText();
        this.updateSelection();

        // --------------------------
        // LIBROS DECORATIVOS ENCIMA Y DEBAJO
        // --------------------------
        const shelfSpacing = 150; // distancia vertical desde la principal
        this.createDecorativeShelf(mainShelfY - shelfSpacing); // encima

        const lowerShelfY = Math.min(mainShelfY + shelfSpacing, this.height + 45); // 60 px margen inferior
        this.createDecorativeShelf(lowerShelfY);

        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT,
            Phaser.Input.Keyboard.KeyCodes.SPACE,
            Phaser.Input.Keyboard.KeyCodes.ENTER
        ]);

        // Controles
        this.input.keyboard.on("keydown-LEFT", () => {
            this.selectedIndex -= 1;
            if (this.selectedIndex < 0) this.selectedIndex = this.opciones.length - 1;
            else if (this.selectedIndex > this.unlockedbooks - 1) this.selectedIndex = this.unlockedbooks - 1;
            this.updateSelection();
        });

        this.input.keyboard.on("keydown-RIGHT", () => {
            this.selectedIndex += 1;
            if (this.selectedIndex >= this.opciones.length) this.selectedIndex = 0;
            else if (this.selectedIndex > this.unlockedbooks - 1) this.selectedIndex = this.opciones.length - 1;
            this.updateSelection();
        });

        this.input.keyboard.on("keydown-SPACE", () => {
            const seleccion = this.opciones[this.selectedIndex];
            if (seleccion !== "TIENDA") this.scene.switch("BattleScene");
            else this.scene.switch("ShopScene");
        });

        // Crear la tienda
        this.scene.launch("ShopScene");
        this.scene.sleep("ShopScene");

        // Inventario
        this.inventory = new Inventory();
        this.inventory.createItem('pocion_roja', 'Poción Roja', 'HealPot', undefined, undefined, 15);
        this.inventory.createItem('pocion_verde', 'Poción Verde', 'HealPot', undefined, undefined, 25);
        this.inventory.createItem('pocion_azul', 'Poción Azul', 'HealPot', undefined, undefined, 50);
        this.inventory.createItem('pocion_dorada', 'Poción Dorada', 'HealPot', undefined, undefined, 90);
        this.inventory.createItem('pocion_daño_area', 'Poción Daño Área', 'AreaPot', undefined, undefined, 10);
        this.inventory.createItem('pocion_daño_pequeña', 'Poción Daño Pequeña', 'DmgPot', undefined, undefined, 20);
        this.inventory.createItem('pocion_daño_grande', 'Poción Daño Grande', 'DmgPot', undefined, undefined, 35);
        this.inventory.createItem('pocion_cataclismo', 'Poción Cataclismo', 'CatPot', undefined, undefined, 1000);

        this.inventory.createItem('pocion_ataque', 'Poción De Ataque', 'StrPot', 15, undefined, undefined);
        this.inventory.createItem('pocion_defensa', 'Poción De Defensa', 'DefPot', undefined, 10, undefined);
        this.inventory.createItem('pocion_aturdidora', 'Poción aturdidora', 'MiscPot', undefined, undefined, undefined);

        this.inventory.insertItem(0);
        this.inventory.insertItem(1);
        this.inventory.insertItem(2);
        this.inventory.insertItem(3);
        this.inventory.insertItem(4);
        this.inventory.insertItem(7);

        this.registry.set('inventory', this.inventory);
    }

    // ------------------------------------------------------
    // CREAR ESTANTERÍAS DECORATIVAS
    // ------------------------------------------------------
    // ------------------------------------------------------
// CREAR ESTANTERÍAS DECORATIVAS
// ------------------------------------------------------
createDecorativeShelf(yPosition) {
    const shelfWidth = this.width;
    const shelfHeight = 20;

    // Dibujar estantería principal
    const shelf = this.add.rectangle(this.width / 2, yPosition, shelfWidth, shelfHeight, 0x5c3a21).setOrigin(0.5);

    // Borde de la estantería
    const shelfBorder = this.add.rectangle(this.width / 2, yPosition - 10, shelfWidth, 5, 0x3a2a1f).setOrigin(0.5);

    // Sombra de la estantería
    const shelfShadow = this.add.rectangle(this.width / 2 + 3, yPosition + 3, shelfWidth, shelfHeight, 0x000000, 0.3).setOrigin(0.5);

    // Libros decorativos
    const numBooks = Phaser.Math.Between(8, 12);
    for (let i = 0; i < numBooks; i++) {
        const x = i * (shelfWidth / numBooks) + (shelfWidth / numBooks) / 2;
        const bookWidth = Phaser.Math.Between(20, 35);
        const bookHeight = Phaser.Math.Between(50, 90);

        const bookColor = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(58, 46, 31),
            new Phaser.Display.Color(107, 75, 43),
            numBooks,
            i
        );
        const colorHex = Phaser.Display.Color.GetColor(bookColor.r, bookColor.g, bookColor.b);

        // Sombra del libro
        const shadow = this.add.rectangle(x + 3, yPosition - bookHeight / 2 + 3, bookWidth, bookHeight, 0x000000, 0.3).setOrigin(0.5);
        shadow.setAngle(Phaser.Math.Between(-8, 8));

        // Libro principal
        const book = this.add.rectangle(x, yPosition - bookHeight / 2, bookWidth, bookHeight, colorHex).setOrigin(0.5);
        book.setStrokeStyle(4, 0x1d120a);
        book.setAngle(Phaser.Math.Between(-8, 8));
    }
}


    // ------------------------------------------------------
    // LIBROS SELECCIONADOS
    // ------------------------------------------------------
    updateSelection() {
        this.optionObjects.forEach((obj, i) => {
            if (!obj.book || !obj.spine || !obj.text) return;

            if (i === this.selectedIndex) {
                obj.book.setFillStyle(0x6b4b2b);
                obj.book.setStrokeStyle(5, 0xf8e7c0);
                obj.text.setColor("#fff2d6");
                obj.text.setStyle({ fontSize: 22, fontStyle: "bold" });
                obj.text.setScale(1);
                obj.book.setScale(1.2);
                obj.spine.setScale(1.2);
            } else {
                obj.book.setFillStyle(0x3a2e1f);
                obj.book.setStrokeStyle(4, 0x1d120a);
                obj.text.setColor("#c2b29d");
                obj.text.setStyle({ fontSize: 20, fontStyle: "normal" });
                obj.book.setScale(1);
                obj.spine.setScale(1);
                obj.text.setScale(1);
            }
        });
    }

    // ------------------------------------------------------
    // CREAR LIBROS PRINCIPALES
    // ------------------------------------------------------
    updateText() {
        this.optionObjects.forEach(obj => {
            if (obj.book) obj.book.destroy();
            if (obj.spine) obj.spine.destroy();
            if (obj.shadow) obj.shadow.destroy();
            if (obj.text) obj.text.destroy();
        });
        this.optionObjects = [];

        const rectWidth = this.width / this.opciones.length;
        const baseBookWidth = rectWidth * 0.7;
        const baseBookHeight = this.height * 0.5;
        const shelfY = this.height * 0.75;

        for (let i = 0; i < this.opciones.length; i++) {
            const x = i * rectWidth + rectWidth / 2;
            const y = shelfY - baseBookHeight / 2;
            const angle = Phaser.Math.Between(-8, 8);
            const bookWidth = baseBookWidth * Phaser.Math.FloatBetween(0.95, 1.1);
            const bookHeight = baseBookHeight;

            const bookColor = Phaser.Display.Color.Interpolate.ColorWithColor(
                new Phaser.Display.Color(58, 46, 31),
                new Phaser.Display.Color(107, 75, 43),
                this.opciones.length,
                i
            );
            const colorHex = Phaser.Display.Color.GetColor(bookColor.r, bookColor.g, bookColor.b);

            const shadow = this.add.rectangle(x + 5, y + 5, bookWidth, bookHeight, 0x000000, 0.3).setOrigin(0.5);
            shadow.setAngle(angle);

            const spine = this.add.rectangle(x - bookWidth * 0.45, y, bookWidth * 0.1, bookHeight, 0x2a2a2a).setOrigin(0.5);
            spine.setAngle(angle);

            const book = this.add.rectangle(x, y, bookWidth, bookHeight, colorHex).setOrigin(0.5);
            book.setStrokeStyle(4, 0x1d120a);
            book.setAngle(angle);

            let txt = "LOCKED";
            if (i < this.unlockedbooks || i === this.opciones.length - 1) {
                txt = this.opciones[i];
                if (txt === "THE END") txt = "THE END";
            }

            const fontSize = Math.min(28, bookHeight / 6);
            const text = this.add.text(x, y, txt, {
                fontFamily: "Georgia",
                fontSize: fontSize,
                color: "#f5e6c8",
                fontStyle: "bold",
                align: "center",
                wordWrap: { width: bookWidth * 0.8, useAdvancedWrap: false }
            }).setOrigin(0.5);
            text.setAngle(angle - 90);

            this.optionObjects.push({ shadow, book, spine, text });
        }

        this.updateSelection();
    }

    getSelectedScene() {
        return this.opciones[this.selectedIndex];
    }

    getInventory() {
        return this.inventory;
    }

    unlockBook() {
        if (this.selectedIndex == this.unlockedbooks - 1) {
            this.unlockedbooks++;
            this.updateText();
            this.updateSelection();
        }
    }
}

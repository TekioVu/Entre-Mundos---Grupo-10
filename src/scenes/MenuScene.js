export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
        const opciones = [
            "Fantasía",
            "Romance",
            "Historia",
            "Comedia",
            "Terror",
            "Tienda"
        ];

        this.selectedIndex = 0;
        this.optionObjects = [];

        const { width, height } = this.scale;

        // Fondo
        this.cameras.main.setBackgroundColor("#1a1a1a");

        const rectWidth = width / opciones.length;

        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT,
            Phaser.Input.Keyboard.KeyCodes.SPACE,
            Phaser.Input.Keyboard.KeyCodes.ENTER
        ]);

        // Crear rectángulos y textos (en horizontal)
        for (let i = 0; i < opciones.length; i++) {
            const x = i * rectWidth + rectWidth / 2;

            const rect = this.add.rectangle(
                x,
                height / 2,
                rectWidth * 0.9,
                height * 0.8,
                0x333333
            ).setOrigin(0.5);

            const text = this.add.text(x, height / 2, opciones[i], {
                fontFamily: "Arial",
                fontSize: 20,
                color: "#ffffff",
                wordWrap: { width: rectWidth * 0.8 }
            }).setOrigin(0.5);
            text.setRotation(- Math.PI / 2); 

            this.optionObjects.push({ rect, text });
        }

        // Resaltar la opción inicial
        this.updateSelection();

        // Controles izquierda/derecha
        this.input.keyboard.on("keydown-LEFT", () => {
            this.selectedIndex = (this.selectedIndex - 1 + opciones.length) % opciones.length;
            this.updateSelection();
        });

        this.input.keyboard.on("keydown-RIGHT", () => {
            this.selectedIndex = (this.selectedIndex + 1) % opciones.length;
            this.updateSelection();
        });

        this.input.keyboard.on("keydown-SPACE", () => {
            const seleccion = opciones[this.selectedIndex];
            console.log("Seleccionado:", seleccion);

            if (seleccion === "Fantasía") this.scene.start("BattleScene");
            else if (seleccion === "Romance") this.scene.start("BattleScene");
            else if (seleccion === "Historia") this.scene.start("BattleScene");
            else if (seleccion === "Comedia") this.scene.start("BattleScene");
            else if (seleccion === "Terror") this.scene.start("BattleScene");
            else if (seleccion === "Tienda") this.scene.start("ShopScene");

        });
    }

    updateSelection() {
        this.optionObjects.forEach((obj, i) => {
            if (i === this.selectedIndex) {
                obj.rect.setFillStyle(0x6666ff); // azul al seleccionar
                obj.text.setColor("#ffff00"); // texto amarillo
                obj.text.setStyle({ fontSize: 24 });
            } else {
                obj.rect.setFillStyle(0x333333);
                obj.text.setColor("#ffffff");
                obj.text.setStyle({ fontSize: 20 });
            }
        });
    }
}

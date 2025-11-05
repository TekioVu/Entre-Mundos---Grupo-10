export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
        this.opciones = [
            "Fantasía",
            "Terror",
            "Historia",
            "Comedia",
            "The End",
            "Tienda"
        ];

        this.selectedIndex = 0;
        this.unlockedbooks = 1;
        this.optionObjects = [];

        const { width, height } = this.scale;
        this.width = width;
        this.height = height;

        // Fondo
        this.cameras.main.setBackgroundColor("#1a1a1a");

        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT,
            Phaser.Input.Keyboard.KeyCodes.SPACE,
            Phaser.Input.Keyboard.KeyCodes.ENTER
        ]);

        this.updateText();

        // Resaltar la opción inicial
        this.updateSelection();

        // Controles izquierda/derecha
        this.input.keyboard.on("keydown-LEFT", () => {

            this.selectedIndex = (this.selectedIndex - 1);

            if(this.selectedIndex < 0) this.selectedIndex = this.opciones.length - 1;
            else if(this.selectedIndex > this.unlockedbooks - 1) this.selectedIndex = this.unlockedbooks - 1;

            this.updateSelection();
        });

        this.input.keyboard.on("keydown-RIGHT", () => {
            this.selectedIndex = (this.selectedIndex + 1);

            if(this.selectedIndex >= this.opciones.length) this.selectedIndex = 0;
            else if(this.selectedIndex > this.unlockedbooks - 1) this.selectedIndex = this.opciones.length - 1;

            this.updateSelection();
        });

        this.input.keyboard.on("keydown-SPACE", () => {
            const seleccion = this.opciones[this.selectedIndex];
            console.log("Seleccionado:", seleccion);

            if (seleccion !== "Tienda") this.scene.switch("BattleScene");
            else this.scene.switch("ShopScene");

        });

        //Crear la tienda por primera vez
        this.scene.launch("ShopScene");
        this.scene.sleep("ShopScene");
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

    updateText()
    {
        // Limpiar los objetos anteriores
        this.optionObjects.forEach(obj => {
            obj.rect.destroy();
            obj.text.destroy();
        });
        this.optionObjects = [];

        const rectWidth = this.width / this.opciones.length;
        // Crear rectángulos y textos (en horizontal)
        for (let i = 0; i < this.opciones.length; i++) {
            const x = i * rectWidth + rectWidth / 2;

            const rect = this.add.rectangle(
                x,
                this.height / 2,
                rectWidth * 0.9,
                this.height * 0.8,
                0x333333
            ).setOrigin(0.5);

            let txt = "LOCKED";
            if(i < this.unlockedbooks || i == this.opciones.length - 1){
                txt = this.opciones[i];
            }

            const text = this.add.text(x, this.height / 2, txt, {
                fontFamily: "Arial",
                fontSize: 20,
                color: "#ffffff",
            }).setOrigin(0.5);
            text.setRotation(- Math.PI / 2); 

            this.optionObjects.push({ rect, text });
        }
    }
    getSelectedScene()
    {
        const seleccion = this.opciones[this.selectedIndex];
        return seleccion;
    }

    unlockBook()
    {
        if(this.selectedIndex == this.unlockedbooks - 1)
        {
            this.unlockedbooks++;
            this.updateText();
            this.updateSelection();
        }
    }
}

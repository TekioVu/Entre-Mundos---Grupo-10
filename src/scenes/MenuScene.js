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
        this.unlockedbooks = 3;
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

            if (seleccion !== "TIENDA") this.scene.switch("BattleScene");
            else this.scene.switch("ShopScene");

        });

        //Crear la tienda por primera vez
        this.scene.launch("ShopScene");
        this.scene.sleep("ShopScene");

        //Crea todos los objetos
        this.inventory = new Inventory();

        this.inventory.createItem('pocion_roja', 'Poción Roja', 'HealPot', undefined, undefined, 15);
        this.inventory.createItem('pocion_verde', 'Poción Verde', 'HealPot', undefined, undefined, 25);
        this.inventory.createItem('pocion_azul', 'Poción Azul', 'HealPot', undefined, undefined, 50);
        this.inventory.createItem('pocion_dorada', 'Poción Dorada', 'HealPot', undefined, undefined, 90);

        this.inventory.createItem('pocion_daño_area', 'Poción Daño Área', 'DmgPot', undefined, undefined, -10);
        this.inventory.createItem('pocion_daño_pequeña', 'Poción Daño Pequeña', 'DmgPot', undefined, undefined, -20);
        this.inventory.createItem('pocion_daño_grande', 'Poción Daño Grande', 'DmgPot', undefined, undefined, -35);
        this.inventory.createItem('pocion_cataclismo', 'Poción Cataclismo', 'DmgPot', undefined, undefined, -1000);

        this.inventory.createItem('pocion_ataque', 'Poción De Ataque', 'StrPot', 20, undefined, undefined);
        this.inventory.createItem('pocion_defensa', 'Poción De Defensa', 'DefPot', undefined, 20, undefined);
        this.inventory.createItem('pocion_aturdidora','Poción aturdidora', 'MiscPot', undefined, undefined, undefined);
        
        this.inventory.insertItem(0);
        this.inventory.insertItem(1);

        this.registry.set('inventory', this.inventory);
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

    getInventory(){
        return this.inventory;
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

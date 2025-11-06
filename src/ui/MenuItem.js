export default class MenuItem extends Phaser.GameObjects.Container {
    constructor(x, y, dato, scene) {
        super(scene, x, y);
        this.scene = scene;

        const bgColor = 0x000000;
        const bgAlpha = 0.6;
        this.bg = scene.add.graphics();

        this.dato = dato;

        this.bg.fillStyle(bgColor, bgAlpha);

        if (dato.type === "icon") {
            this.boxWidth = 25;
            this.boxHeight = 25;
            this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);
            this.add(this.bg);

            this.sprite = scene.add.sprite(0, 0, dato.key).setDisplaySize(40, 40);
            if(dato.key === 'ghost') this.sprite.setScale(0.15)
            else if(dato.key === 'goblin') this.sprite.setScale(0.5)
            else if(dato.key === 'wizard') this.sprite.setScale(0.2)
            else if(dato.key === 'timmy') this.sprite.setScale(0.45)
            this.add(this.sprite);
        } else {
            this.boxWidth = 70;
            this.boxHeight = 20;
            this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);
            this.add(this.bg);

            this.text = scene.add.text(0, 0, dato.key, {
                color: "#ffffff",
                align: "center",
                fontSize: "14px"
            }).setOrigin(0.5);
            this.add(this.text);
        }
    }


    select() {
        this.bg.clear();
        this.bg.fillStyle(0xf8ff38, 0.8);
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);
        if (this.text) this.text.setColor("#000000");    
    }

    deselect() { 
        this.bg.clear();
        this.bg.fillStyle(0x000000, 0.6);
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);
        if (this.text) this.text.setColor("#ffffff");
    }

    getDataKey(){
    return this.dato.key;
    }
}

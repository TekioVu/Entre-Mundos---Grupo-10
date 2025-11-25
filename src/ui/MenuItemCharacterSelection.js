export default class MenuItemCharacterSelection extends Phaser.GameObjects.Container {
    constructor(x, y, item, scene) {
        super(scene, x, y);

        let boxWidth;
        let boxHeight;
        const bgColor = 0x1a1a1a;      // gris muy oscuro
        const bgAlpha = 1;              // opacidad completa
        const borderColor = 0x3a3a3a;   // gris medio para borde
        const textColor = "#cccccc";    // gris claro para texto

        this.bg = scene.add.graphics();

        if (typeof item === "string") {
            boxHeight = 20;
            boxWidth = 50;

            // Fondo gris oscuro
            this.bg.fillStyle(bgColor, bgAlpha);
            this.bg.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);

            // Borde gris medio
            this.bg.lineStyle(2, borderColor, 1);
            this.bg.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);

            this.add(this.bg);

            // Texto gris claro
            this.text = scene.add.text(0, 0, item, {
                color: textColor,
                align: "center",
                fontSize: "14px"
            }).setOrigin(0.5);
            this.add(this.text);
        } else {
            boxHeight = 20;
            boxWidth = 20;

            // Fondo gris oscuro
            this.bg.fillStyle(bgColor, bgAlpha);
            this.bg.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);

            // Borde gris medio
            this.bg.lineStyle(2, borderColor, 1);
            this.bg.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);

            this.add(this.bg);

            if (item.texture === 'ghost') {
                this.sprite = scene.add.sprite(0, 0, item.texture).setDisplaySize(20, 20);
            }else if (item.texture === 'jester') {
                this.sprite = scene.add.sprite(0, 0, item.texture).setDisplaySize(18, 18);
            }
            else {
                this.sprite = scene.add.sprite(0, 0, item.texture).setDisplaySize(40, 40);
            }
            this.add(this.sprite);
        }

        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
    }

    select() {
        const hoverBg = 0x3a3a3a;      // gris más claro para hover
        const borderColor = 0xffffff;  // borde blanco elegante

        this.bg.clear();

        // Fondo hover
        this.bg.fillStyle(hoverBg, 1);
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);

        // Borde más definido
        this.bg.lineStyle(3, borderColor, 1);
        this.bg.strokeRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);

        // Texto elegante
        if (this.text) {
            this.text.setColor("#ffffff"); // blanco puro
            this.text.setFontStyle("bold");
        }
    }

    deselect() {
        const bgColor = 0x1a1a1a;     // gris muy oscuro
        const borderColor = 0x3a3a3a; // gris medio

        this.bg.clear();

        // Fondo normal
        this.bg.fillStyle(bgColor, 1);
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);

        // Borde normal
        this.bg.lineStyle(2, borderColor, 1);
        this.bg.strokeRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);

        // Texto normal
        if (this.text) {
            this.text.setColor("#cccccc"); // gris claro
            this.text.setFontStyle("normal");
        }
    }
}

export default class MenuItemCharacterSelection extends Phaser.GameObjects.Container {
    constructor(x, y, item, scene) {
        super(scene, x, y);

        let boxWidth;
        let boxHeight;
        const bgColor = 0x000000;
        const bgAlpha = 0.6;
        const goldColor = 0xFFD700; // dorado para borde y texto

        this.bg = scene.add.graphics();

        if (typeof item === "string") {
            boxHeight = 20;
            boxWidth = 50;

            // Fondo oscuro
            this.bg.fillStyle(bgColor, bgAlpha);
            this.bg.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);

            // Borde dorado
            this.bg.lineStyle(2, goldColor, 1);
            this.bg.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);

            this.add(this.bg);

            // Texto dorado
            this.text = scene.add.text(0, 0, item, {
                color: "#FFD700",
                align: "center",
                fontSize: "14px"
            }).setOrigin(0.5);
            this.add(this.text);
        } else {
            boxHeight = 20;
            boxWidth = 20;

            // Fondo oscuro
            this.bg.fillStyle(bgColor, bgAlpha);
            this.bg.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);

            // Borde dorado
            this.bg.lineStyle(2, goldColor, 1);
            this.bg.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);

            this.add(this.bg);

            if (item.texture === 'ghost') {
                this.sprite = scene.add.sprite(0, 0, item.texture).setDisplaySize(20, 20);
            } else {
                this.sprite = scene.add.sprite(0, 0, item.texture).setDisplaySize(40, 40);
            }
            this.add(this.sprite);
        }

        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
    }

    select() {
        const goldColor = 0xFFD700;

        this.bg.clear();

        // Fondo dorado translúcido para el hover
        this.bg.fillStyle(0xFFD700, 0.4);  // dorado con transparencia
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);

        // Borde dorado
        this.bg.lineStyle(2, goldColor, 1);
        this.bg.strokeRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);

        // Texto dorado
        if (this.text) this.text.setColor("#FFD700");
    }

    deselect() {
        const goldColor = 0xFFD700;

        this.bg.clear();

        // Fondo gris oscuro normal
        this.bg.fillStyle(0x000000, 0.6);
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);

        // Borde dorado
        this.bg.lineStyle(2, goldColor, 1);
        this.bg.strokeRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);

        // Texto dorado
        if (this.text) this.text.setColor("#FFD700");
    }
}

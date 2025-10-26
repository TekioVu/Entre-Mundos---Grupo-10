export default class MenuItem extends Phaser.GameObjects.Container {
    constructor(x, y, text, scene) {
        super(scene, x, y);

        const boxWidth = 90;
        const boxHeight = 20;
        const bgColor = 0x000000;
        const bgAlpha = 0.6;

        this.bg = scene.add.graphics();
        this.bg.fillStyle(bgColor, bgAlpha);
        this.bg.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);
        this.add(this.bg);

        this.text = scene.add.text(0, 0, text, {
            color: "#ffffff",
            align: "center",
            fontSize: "14px"
        }).setOrigin(0.5);
        this.add(this.text);

        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
    }

    select() {
        this.bg.clear();
        this.bg.fillStyle(0xf8ff38, 0.8);
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);
        this.text.setColor("#000000");
    }

    deselect() {
        this.bg.clear();
        this.bg.fillStyle(0x000000, 0.6);
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 4);
        this.text.setColor("#ffffff");
    }
}

export default class MenuItemCharacterSelection extends Phaser.GameObjects.Container {
    constructor(x, y, item, scene) {
        super(scene, x, y);

        let boxWidth;
        let boxHeight;
        const bgColor = 0x000000;
        const bgAlpha = 0.6;

        this.bg = scene.add.graphics();

        if (typeof item === "string") {
            boxHeight = 20;
            boxWidth = 50;
            this.bg.fillStyle(bgColor, bgAlpha);
            this.bg.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);
            this.add(this.bg);

            this.text = scene.add.text(0, 0, item, {
                color: "#ffffff",
                align: "center",
                fontSize: "14px"
            }).setOrigin(0.5);
            this.add(this.text);
        } else {
            boxHeight = 20;
            boxWidth = 20;
            this.bg.fillStyle(bgColor, bgAlpha);
            this.bg.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 4);
            this.add(this.bg);

            this.sprite = scene.add.sprite(0, 0, item.texture).setDisplaySize(40, 40);
            this.add(this.sprite);
        }

        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
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
}

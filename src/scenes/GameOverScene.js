export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        this.add.text(160, 120, "Game over", {
            font: "20px Arial",
            fill: "#ff0000"
        }).setOrigin(0.5);

        this.add.text(160, 150, "Presiona ESPACIO para reiniciar", {
            font: "12px Arial",
            fill: "#ffffff"
        }).setOrigin(0.5);

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.switch("MenuStart");
        });
    }
}
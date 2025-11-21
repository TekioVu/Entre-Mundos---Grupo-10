export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        this.add.text(160, 80 , "Game over", {
            font: "40px Arial",
            fill: "#ff0000"
        }).setOrigin(0.5);

        this.button = this.add.rectangle(160, 170, 100, 30,  0x000000)
            .setStrokeStyle(2, 0xffffff);

        this.btnText = this.add.text(160, 170, "Reiniciar", {
            font: "14px Arial",
            fill: "#ffffffab"
        }).setOrigin(0.5);

        
        this.input.keyboard.once("keydown-SPACE", () => {
           
            this.button.setFillStyle(0x555555);
            this.scene.start("MenuScene");
        });
    }
}

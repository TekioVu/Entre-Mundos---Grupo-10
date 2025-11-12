export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super("VictoryScene");
    }

    create() {
        this.add.text(160, 120, "Victory", {
            font: "20px Arial",
            fill: "#ff0000"
        }).setOrigin(0.5);

        this.add.text(160, 150, "Presiona ESPACIO para continuar", {
            font: "12px Arial",
            fill: "#ffffff"
        }).setOrigin(0.5);

        this.input.keyboard.once("keydown-SPACE", () => {
            
            this.unlockNewBook();
            this.scene.switch("MenuScene");
        });
    }

    unlockNewBook() {
        const menuScene = this.scene.get('MenuScene');
        menuScene.unlockBook();

        const shopScene = this.scene.get('ShopScene');
        shopScene.addNewItems(menuScene.unlockedbooks);
        shopScene.updateCoins(250);
        shopScene.resetShop();
    }
}
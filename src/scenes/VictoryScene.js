export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super("VictoryScene");
    }

    create() {
        this.add.text(160, 60, "Victory", {
            font: "30px Arial",
            fill: "#ff0000"
        }).setOrigin(0.5);

        this.button = this.add.rectangle(160, 170, 100, 30,  0x000000)
            .setStrokeStyle(2, 0xffffff);

        this.btnText = this.add.text(160, 170, "Continuar", {
            font: "14px Arial",
            fill: "#ffffffab"
        }).setOrigin(0.5);

        
        this.input.keyboard.once("keydown-SPACE", () => {
            
            this.button.setFillStyle(0x555555);

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
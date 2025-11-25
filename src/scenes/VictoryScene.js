export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super("VictoryScene");
    }

    create() {

        const bgColor = 0x202020;
        const borderColor = 0x888888;
        const textColor = "#ffffffab";

      const victoryText = this.add.text(160, 60, "VICTORY", {
    fontFamily: "Arial",
    fontSize: "36px",
    fontStyle: "bold",
    color: "#f2d675",        // blanco suave elegante
    stroke: "#7a6a32",        // gris oscuro muy sutil
    strokeThickness: 2,
    shadow: {
        offsetX: 1,
        offsetY: 1,
        color: "#00000040",   // sombra discreta
        blur: 2,
        fill: true
    }
}).setOrigin(0.5);

// Animación suave de aparición
victoryText.setAlpha(0);
this.tweens.add({
    targets: victoryText,
    alpha: 1,
    duration: 600,
    ease: "Quad.Out"
});

        const boxWidth = 100;
        const boxHeight = 30;
        this.coinsWon = Phaser.Math.Between(180,300);
        // --- BOTÓN ---
        this.button = this.add.container(160, 170);

        const bg = this.add.graphics();
        this.drawNormal(bg, boxWidth, boxHeight, bgColor, borderColor);

        const btnText = this.add.text(0, 0, "Continuar", {
            fontSize: "14px",
            color: textColor
        }).setOrigin(0.5);

        this.button.add(bg);
        this.button.add(btnText);

        this.button.setSize(boxWidth, boxHeight);
        this.button.setInteractive({ useHandCursor: true });

        // === ANIMACIONES COMO MenuItem ===
        this.button.on("pointerover", () => {
            this.drawHover(bg, boxWidth, boxHeight);
            btnText.setColor("#ffffff");
            btnText.setFontStyle("bold");
        });

        this.button.on("pointerout", () => {
            this.drawNormal(bg, boxWidth, boxHeight, bgColor, borderColor);
            btnText.setColor(textColor);
            btnText.setFontStyle("normal");
        });

        // === ACTIVAR CLIC ===
        const activate = () => {
            this.drawPressed(bg, boxWidth, boxHeight);
            this.unlockNewBook();
            this.scene.switch("MenuScene");
        };

        this.input.keyboard.once("keydown-SPACE", activate);
        this.button.on("pointerdown", activate);

     this.add.image(160, 100, "coins_won").setDisplaySize(50, 50);

    const coinsText = this.add.text(160, 140, `+ ${this.coinsWon} coins`, {
        fontFamily: "Arial",
        fontSize: "8px",
        color: "#ffd45c",         // dorado suave
        stroke: "#543d10",        // borde dorado oscuro
        strokeThickness: 2,
        shadow: {
            offsetX: 1,
            offsetY: 1,
            color: "#00000050",
            blur: 2,
            fill: true
        }
    }).setOrigin(0.5);

    }   
    
    // --- ESTILOS COMO MenuItem ---

    drawNormal(bg, w, h, bgColor, borderColor) {
        bg.clear();
        bg.fillStyle(bgColor, 1);
        bg.fillRoundedRect(-w/2, -h/2, w, h, 6);
        bg.lineStyle(2, borderColor, 1);
        bg.strokeRoundedRect(-w/2, -h/2, w, h, 6);
    }

    drawHover(bg, w, h) {
        const hoverBg = 0x3a3a3a;
        bg.clear();
        bg.fillStyle(hoverBg, 1);
        bg.fillRoundedRect(-w/2, -h/2, w, h, 6);
        bg.lineStyle(3, 0xffffff, 1);
        bg.strokeRoundedRect(-w/2, -h/2, w, h, 6);
    }

    drawPressed(bg, w, h) {
        bg.clear();
        bg.fillStyle(0x555555, 1);
        bg.fillRoundedRect(-w/2, -h/2, w, h, 6);
        bg.lineStyle(3, 0xffffff, 1);
        bg.strokeRoundedRect(-w/2, -h/2, w, h, 6);
    }
    
    unlockNewBook() {
        const menuScene = this.scene.get('MenuScene');
        menuScene.unlockBook();

        const shopScene = this.scene.get('ShopScene');
        shopScene.addNewItems(menuScene.unlockedbooks);
        shopScene.updateCoins(this.coinsWon);
        shopScene.resetShop();
    }
}

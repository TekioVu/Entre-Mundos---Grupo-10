import PlayerCharacter from "../characters/PlayerCharacter.js";

export default class EndScene extends Phaser.Scene {
    constructor() {
        super("EndScene");
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


const victoryText2 = this.add.text(160, 100, "You saved Timmy's cat!", {
    fontFamily: "Arial",
    fontSize: "15px",
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

victoryText2.setAlpha(0);
this.tweens.add({
    targets: victoryText2,
    alpha: 1,
    duration: 600,
    ease: "Quad.Out"
});

        const boxWidth = 100;
        const boxHeight = 30;
        this.button = this.add.container(160, 170);

        const bg = this.add.graphics();
        this.drawNormal(bg, boxWidth, boxHeight, bgColor, borderColor);

        const btnText = this.add.text(0, 0, "Play again", {
            fontSize: "14px",
            color: textColor
        }).setOrigin(0.5);

        this.button.add(bg);
        this.button.add(btnText);

        this.button.setSize(boxWidth, boxHeight);
        this.button.setInteractive({ useHandCursor: true });

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

         const activate = () => {
            this.drawPressed(bg, boxWidth, boxHeight);
            this.scene.get("UIScene").cleanEvents();
            this.scene.get("CharacterSelectionScene").cleanEvents();
            this.scene.get("BattleScene").cleanEvents;
            this.scene.stop("UIScene");
            this.scene.stop("BattleScene");
            this.scene.stop("GameOverScene");
            this.scene.stop("MenuScene");
            this.scene.start("MenuScene");
        };

        this.input.keyboard.once("keydown-SPACE", activate);
        this.button.on("pointerdown", activate);

        this._createIdleAnim('timmy_idle', 0, 6, 'timmy-idle');
        this._createIdleAnim('cat_idle', 0, 7, 'cat-idle');

            const timmy = this.add.sprite(140, 130, 'timmy_idle');
            timmy.play('timmy-idle');

            const cat = this.add.sprite(180, 130, 'cat_idle');
            cat.play('cat-idle');


    }   

    _createIdleAnim(key, start, end, animKey = `${key}-idle`) {
        if (this.anims.exists(animKey)) return;
        this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(key, { start, end }),
            frameRate: 5,
            repeat: -1,
        });
    }
    


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
}

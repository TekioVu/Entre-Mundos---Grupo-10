export default class KidnapScene extends Phaser.Scene {
    constructor() {
        super({ key: "KidnapScene" });
        console.log("1");
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const enemySprites = ["boss2", "boss3", "boss1"];

        // Fondo
        this.add.rectangle(0, 0, width, height, 0x1e1e2f).setOrigin(0);

        // Timmy
        this.cat = this.add.sprite(centerX, centerY, 'cat_idle').setOrigin(0.5);

        this.anims.create({
            key: "cat_walk",
            frames: this.anims.generateFrameNumbers("cat_idle", {
                start: 0,
                end: 11
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.cat.anims.play("cat_walk");

        // Enemigos
        this.enemies = [];
        const enemyPositions = [
            { x: -100, y: centerY - 50 },
            { x: -100, y: centerY },
            { x: -100, y: centerY + 50 }
        ];

        enemyPositions.forEach((pos, index) => {
            const enemy = this.add.sprite(pos.x, pos.y, enemySprites[index]).setOrigin(0.5);
            this.enemies.push(enemy);

            // Animación de entrada
            this.tweens.add({
                targets: enemy,
                x: centerX - 100,
                duration: 1000 + index * 300,
                ease: 'Power2'
            });
        });

        // Después de un tiempo, secuestro
        this.time.delayedCall(2000, () => {
            this.kidnapTimmy();
        });

        this.input.keyboard.on('keydown-ENTER', (event) => {
            this.scene.start("IntroScene", { firstTime: true, parent: this });
        });

        this.add.text(centerX + 120, centerY + 100, "⏎ Omitir", {
            fontSize: "16px",
            fontFamily: "Arial",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.input.keyboard.addCapture('SPACE');
    }

    kidnapTimmy() {
        // Todos los enemigos se mueven juntos arrastrando a Timmy
        const targetX = this.cameras.main.width + 100;

        this.enemies.forEach((enemy, index) => {
            this.tweens.add({
                targets: [enemy, this.cat],
                x: targetX,
                y: enemy.y,
                duration: 2000,
                ease: 'Power1',
                onComplete: () => {
                    if (index === this.enemies.length - 1) {
                        // Termina la escena y pasa a la intro del juego
                        this.scene.start("IntroScene");
                    }
                }
            });
        });
    }
    

    
}

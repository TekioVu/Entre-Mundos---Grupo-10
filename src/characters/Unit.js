export default class Unit extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, type, hp, damage) {
        super(scene, x, y, texture, frame);
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage;
        this.textureKey = texture;

        const offsets = {
            "Timmy": 40,
            "Wizard": 40,
            
            "Goblin": 25,
            "Ghost": 25,
            "Pharaoh": 25,
            "Scarab": 25,
            "Clown": 25,
            "Jester": 25,
            "Dragon": 25,
        };

        this.isEnemy = (this.type === "Goblin" || this.type === "Ghost" || this.type === "Pharaoh" || this.type === "Dragon" ||
                        this.type === "Scarab" || this.type === "Clown" || this.type === "Jester");

        this.hpOffsetY = offsets[this.type] || 30;

        this.hpText = scene.add.text(this.x, this.y - this.hpOffsetY, this.hp, {
            font: "14px Arial",
            fill: "#ff0000",
            stroke: "#000000",
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    updateHpText() {
        this.hpText.setPosition(this.x, this.y - this.hpOffsetY);
        this.hpText.setText(this.hp);
    }

    attack(target) {
        target.takeDamage(this.damage);
        this.scene.events.emit("Message", `${this.type} attacks ${target.type} for ${this.damage} damage`);
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;

            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 600,
                onComplete: () => this.setVisible(false)
            });

            this.hpText.setVisible(false);

            this.scene.units = this.scene.units.filter(u => u !== this);
            if (this.isEnemy) {
            this.scene.enemies = this.scene.enemies.filter(e => e !== this);
        } else {
            this.scene.heroes = this.scene.heroes.filter(h => h !== this);
        }
            if (this.isEnemy) {
                const uiScene = this.scene.scene.get("UIScene");
                uiScene.remapEnemies();
            }

            if (this.scene.enemies.length === 0){
                this.scene.time.addEvent({
                    delay: 1000,
                    callback: () => {

                        const uiScene = this.scene.scene.get("UIScene");
                        uiScene.cleanEvents();

                        this.scene.scene.stop("UIScene");
                        this.scene.scene.stop("BattleScene");
                        this.scene.scene.start("VictoryScene");
                    }
                });
            }

            
            if (this.scene.heroes.length === 0){
                this.scene.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.scene.scene.stop("BattleScene");
                        this.scene.scene.stop("UIScene");
                        this.scene.scene.start("GameOverScene");
                    }
                });
            }
        }   
        }
}

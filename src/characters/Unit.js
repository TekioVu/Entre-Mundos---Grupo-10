export default class Unit extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, type, hp, damage) {
        super(scene, x, y, texture, frame);
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage;

        const offsets = {
            "Timmy": 40,
            "Goblin": 25,
            "Ghost": 25
        };
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
            if (this.type === "Goblin" || this.type === "Ghost") {
    this.scene.enemies = this.scene.enemies.filter(e => e !== this);
} else {
    this.scene.heroes = this.scene.heroes.filter(h => h !== this);
}


            if (this.type === "Goblin" || this.type === "Ghost") {
                const uiScene = this.scene.scene.get("UIScene");
                uiScene.remapEnemies();
            }

            if (this.scene.enemies.length === 0){
                this.scene.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.scene.scene.stop("UIScene");
                        this.scene.scene.start("VictoryScene");
                        this.scene.events.removeAllListeners();
                    }
                });
            }

            
            if (this.scene.heroes.length === 0){
                this.scene.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.scene.scene.stop("UIScene");
                        this.scene.scene.start("GameOverScene");
                        this.scene.events.removeAllListeners();
                    }
                });
            }
        }
    }
}

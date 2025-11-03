import PlayerCharacter from "../characters/PlayerCharacter.js";
import Enemy from "../characters/Enemy.js";

export default class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: "BattleScene" });
    }

    create() {

        const menuScene = this.scene.get("MenuScene");
        const selectedScene = menuScene.getSelectedScene();

        this.cameras.main.setBackgroundColor("#1a1f2b");
        this.createEnemies(selectedScene);

        this.scene.launch("CharacterSelectionScene");
        this.index = -1;  
    }

    nextTurn() {
        this.index = (this.index + 1) % this.units.length;
        const unit = this.units[this.index];

        if (unit instanceof PlayerCharacter) {
            this.events.emit("PlayerSelect", this.index);
        } else {
            const r = Math.floor(Math.random() * this.heroes.length);
            unit.attack(this.heroes[r]);
            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
        }
    }

    receivePlayerSelection(action, target) {
        if (action === "attack") {
            this.units[this.index].attack(this.enemies[target]);
        }
        else if (action === "item"){

        }
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
    }

    update() {
        this.units.forEach(unit => {
            if (unit.hpText && unit.alive !== false) unit.updateHpText();
        });
    }

    createEnemies(combatScene)
    {
        if(combatScene === 'Fantasía')
        {
            this.add.image(0, 0, 'fantasy_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'ghost-idle', frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 11 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'goblin-idle', frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });

            const timmy = new PlayerCharacter(this, 250, 75, 'player', 6, 'Timmy', 100, 20);
            this.add.existing(timmy).anims.play('timmy-idle');

            const goblin1 = new Enemy(this, 50, 100, "goblin", 4, "Goblin", 3, 3);
            goblin1.setScale(1.2);
            this.add.existing(goblin1).anims.play('goblin-idle');

            const ghost1 = new Enemy(this, 50, 50, "ghost", 11, "Ghost", 3, 3);
            ghost1.setScale(0.3);
            this.add.existing(ghost1).anims.play('ghost-idle');

            this.heroes = [timmy];
            this.enemies = [goblin1, ghost1];
            this.units = this.heroes.concat(this.enemies);

        }else if(combatScene === 'Romance')
        {
            this.add.image(0, 0, 'romance_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'ghost-idle', frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 11 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'goblin-idle', frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });

            const timmy = new PlayerCharacter(this, 250, 75, 'player', 6, 'Timmy', 100, 20);
            this.add.existing(timmy).anims.play('timmy-idle');

            const goblin1 = new Enemy(this, 50, 100, "goblin", 4, "Goblin", 3, 3);
            goblin1.setScale(1.2);
            this.add.existing(goblin1).anims.play('goblin-idle');

            const ghost1 = new Enemy(this, 50, 50, "ghost", 11, "Ghost", 3, 3);
            ghost1.setScale(0.3);
            this.add.existing(ghost1).anims.play('ghost-idle');

            this.heroes = [timmy];
            this.enemies = [goblin1, ghost1];
            this.units = this.heroes.concat(this.enemies);
        }else if(combatScene === 'Historia')
        {
            this.add.image(0, 0, 'history_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'ghost-idle', frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 11 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'goblin-idle', frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });

            const timmy = new PlayerCharacter(this, 250, 75, 'player', 6, 'Timmy', 100, 20);
            this.add.existing(timmy).anims.play('timmy-idle');

            const goblin1 = new Enemy(this, 50, 100, "goblin", 4, "Goblin", 3, 3);
            goblin1.setScale(1.2);
            this.add.existing(goblin1).anims.play('goblin-idle');

            const ghost1 = new Enemy(this, 50, 50, "ghost", 11, "Ghost", 3, 3);
            ghost1.setScale(0.3);
            this.add.existing(ghost1).anims.play('ghost-idle');

            this.heroes = [timmy];
            this.enemies = [goblin1, ghost1];
            this.units = this.heroes.concat(this.enemies);
        }else if(combatScene === 'Comedia')
        {
            this.add.image(0, 0, 'comedy_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'ghost-idle', frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 11 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'goblin-idle', frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });

            const timmy = new PlayerCharacter(this, 250, 75, 'player', 6, 'Timmy', 100, 20);
            this.add.existing(timmy).anims.play('timmy-idle');

            const goblin1 = new Enemy(this, 50, 100, "goblin", 4, "Goblin", 3, 3);
            goblin1.setScale(1.2);
            this.add.existing(goblin1).anims.play('goblin-idle');

            const ghost1 = new Enemy(this, 50, 50, "ghost", 11, "Ghost", 3, 3);
            ghost1.setScale(0.3);
            this.add.existing(ghost1).anims.play('ghost-idle');

            this.heroes = [timmy];
            this.enemies = [goblin1, ghost1];
            this.units = this.heroes.concat(this.enemies);
        }else if(combatScene === 'Terror')
        {
            this.add.image(0, 0, 'horror_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'ghost-idle', frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 11 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'goblin-idle', frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });

            const timmy = new PlayerCharacter(this, 250, 75, 'player', 6, 'Timmy', 100, 20);
            this.add.existing(timmy).anims.play('timmy-idle');

            const goblin1 = new Enemy(this, 50, 100, "goblin", 4, "Goblin", 3, 3);
            goblin1.setScale(1.2);
            this.add.existing(goblin1).anims.play('goblin-idle');

            const ghost1 = new Enemy(this, 50, 50, "ghost", 11, "Ghost", 3, 3);
            ghost1.setScale(0.3);
            this.add.existing(ghost1).anims.play('ghost-idle');

            this.heroes = [timmy];
            this.enemies = [goblin1, ghost1];
            this.units = this.heroes.concat(this.enemies);
        }
        
    }
}

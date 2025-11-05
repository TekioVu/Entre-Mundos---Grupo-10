import PlayerCharacter from "../characters/PlayerCharacter.js";
import Enemy from "../characters/Enemy.js";

export default class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: "BattleScene" });
    }

    create() {

        this.enemyPosX = [60, 50, 40, 110, 100, 90];
        this.enemyPosY = [100, 75, 50];

        const menuScene = this.scene.get("MenuScene");
        const selectedScene = menuScene.getSelectedScene();

        this.cameras.main.setBackgroundColor("#1a1f2b");
        this.createEnemies(selectedScene);
        this.scene.launch("CharacterSelectionScene");

        this.heroes = new Array(6).fill(null);
        this.units = [];
    this.units = [];
    this.availableHeroes = [
  { texture: 'wizard', name: 'Wizard', hp: 100, atk: 20 },
  { texture: 'timmy', name: 'Timmy', hp: 100, atk: 20 }
];

this.events.on("removeHero", (positionIndex) => {
    if (this.heroes && this.heroes[positionIndex]) {
        this.heroes[positionIndex].destroy();
        this.heroes[positionIndex] = null;
    }
    this.units = this.heroes.filter(h => h !== null).concat(this.enemies);
});



        this.events.on("heroesSelected", this.onHeroSelected, this);
        this.scene.get("CharacterSelectionScene").events.on('selectionComplete', (placedHeroes) => {
        this.setSelectedHeroes(placedHeroes);
        this.units = this.heroes.concat(this.enemies);
        this.nextTurn();
        });
            this.index = -1;  

            this.normalCombatCompleted = false; 
            this.currentbook;
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
        this.currentbook = combatScene;

        if(combatScene === 'FANTASÍA')
        {
            this.add.image(0, 0, 'fantasy_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('timmy', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'wizard-idle', frames: this.anims.generateFrameNumbers('wizard', { start: 0, end: 5 }), frameRate: 5, repeat: -1 });

            this.anims.create({ key: 'ghost-idle', frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 11 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'goblin-idle', frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 3 }), frameRate: 5, repeat: -1 });

            // const wizard = new PlayerCharacter(this, 250, 55, 'wizard', 5, 'Wizard', 100, 20);
            // wizard.setScale(0.8);

            // const timmy = new PlayerCharacter(this, 280, 85, 'player', 6, 'Timmy', 100, 20);

            const goblin1 = new Enemy(this, this.enemyPosX[3], this.enemyPosY[2], "goblin", 3, "Goblin", 3, 3);
            goblin1.setScale(1.2);
            this.add.existing(goblin1).anims.play('goblin-idle');

            const goblin2 = new Enemy(this, this.enemyPosX[4], this.enemyPosY[1], "goblin", 3, "Goblin", 3, 3);
            goblin2.setScale(1.2);
            this.add.existing(goblin2).anims.play('goblin-idle');

            const goblin3 = new Enemy(this, this.enemyPosX[5], this.enemyPosY[0], "goblin", 3, "Goblin", 3, 3);
            goblin3.setScale(1.2);
            this.add.existing(goblin3).anims.play('goblin-idle');

            const ghost1 = new Enemy(this, this.enemyPosX[0], this.enemyPosY[2], "ghost", 11, "Ghost", 3, 3);
            ghost1.setScale(0.3);
            this.add.existing(ghost1).anims.play('ghost-idle');

            //this.availableHeroes = [timmy, wizard];
            const ghost2 = new Enemy(this, this.enemyPosX[1], this.enemyPosY[1], "ghost", 11, "Ghost", 3, 3);
            ghost2.setScale(0.3);
            this.add.existing(ghost2).anims.play('ghost-idle');

            const ghost3 = new Enemy(this, this.enemyPosX[2], this.enemyPosY[0], "ghost", 11, "Ghost", 3, 3);
            ghost3.setScale(0.3);
            this.add.existing(ghost3).anims.play('ghost-idle');

            //this.heroes = [timmy, wizard];
            this.enemies = [goblin1, goblin2, goblin3, ghost1, ghost2, ghost3];
            this.units = (this.enemies);

        }
       
        else if(combatScene === 'TERROR')
        {
            this.add.image(0, 0, 'horror_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('timmy', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'wizard-idle', frames: this.anims.generateFrameNumbers('wizard', { start: 0, end: 5 }), frameRate: 5, repeat: -1 });

            this.anims.create({ key: 'mushroom-idle', frames: this.anims.generateFrameNumbers('mushroom', { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'eye-idle', frames: this.anims.generateFrameNumbers('flying_eye', { start: 0, end: 7 }), frameRate: 5, repeat: -1 });

            
            const mushroom1 = new Enemy(this, this.enemyPosX[3], this.enemyPosY[1], "mushroom", 3, "Mushroom", 3, 3);
            mushroom1.setScale(1.2);
            this.add.existing(mushroom1).anims.play('mushroom-idle');

            const mushroom2 = new Enemy(this, this.enemyPosX[4], this.enemyPosY[0], "mushroom", 3, "Mushroom", 3, 3);
            mushroom2.setScale(1.2);
            this.add.existing(mushroom2).anims.play('mushroom-idle');

            const eye1 = new Enemy(this, this.enemyPosX[1], this.enemyPosY[1], "flying_eye", 7, "Flying Eye", 3, 3);
            eye1.setScale(1.2);
            this.add.existing(eye1).anims.play('eye-idle');

            const eye2 = new Enemy(this, this.enemyPosX[2], this.enemyPosY[0], "flying_eye", 7, "Flying Eye", 3, 3);
            eye2.setScale(1.2);
            this.add.existing(eye2).anims.play('eye-idle');

            this.enemies = [mushroom1, mushroom2, eye1, eye2];
            this.units = (this.enemies);
            
        }else if(combatScene === 'HISTORIA')
        {
            this.add.image(0, 0, 'history_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('timmy', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'wizard-idle', frames: this.anims.generateFrameNumbers('wizard', { start: 0, end: 5 }), frameRate: 5, repeat: -1 });

            this.anims.create({ key: 'pharaoh-idle', frames: this.anims.generateFrameNumbers('pharaoh', { start: 0, end: 2 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'scarab-idle', frames: this.anims.generateFrameNumbers('scarab', { start: 0, end: 1 }), frameRate: 5, repeat: -1 });

            
            const scarab = new Enemy(this, this.enemyPosX[3], this.enemyPosY[1], "scarab", 1, "Scarab", 3, 3);
            scarab.setScale(0.6);
            this.add.existing(scarab).anims.play('scarab-idle');

            const scarab1 = new Enemy(this, this.enemyPosX[4], this.enemyPosY[0], "scarab", 1, "Scarab", 3, 3);
            scarab1.setScale(0.6);
            this.add.existing(scarab1).anims.play('scarab-idle');

            const pharaoh = new Enemy(this, this.enemyPosX[1], this.enemyPosY[1], "pharaoh", 2, "Pharaoh", 3, 3);
            pharaoh.setScale(0.6);
            this.add.existing(pharaoh).anims.play('pharaoh-idle');

            const pharaoh1 = new Enemy(this, this.enemyPosX[2], this.enemyPosY[0], "pharaoh", 2, "Pharaoh", 3, 3);
            pharaoh1.setScale(0.6);
            this.add.existing(pharaoh1).anims.play('pharaoh-idle');

            this.enemies = [pharaoh, pharaoh1, scarab, scarab1];
            this.units = (this.enemies);
        }else if(combatScene === 'COMEDIA')
        {
            this.add.image(0, 0, 'comedy_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'wizard-idle', frames: this.anims.generateFrameNumbers('wizard', { start: 0, end: 5 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('timmy', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });

            this.anims.create({ key: 'clown-idle', frames: this.anims.generateFrameNumbers('clown', { start: 0, end: 8 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'jester-idle', frames: this.anims.generateFrameNumbers('jester', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });

            
            const jester = new Enemy(this, 50, 100, "jester", 4, "Jester", 3, 3);
            this.add.existing(jester).anims.play('jester-idle');

            const clown = new Enemy(this, 50, 50, "clown", 11, "Clown", 3, 3);
            clown.setScale(2);
            this.add.existing(clown).anims.play('clown-idle');

            this.enemies = [jester, clown];
            this.units =(this.enemies);
        }else if(combatScene === 'THE END')
        {
            this.add.image(0, 0, 'horror_background').setOrigin(0, 0.3).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            this.anims.create({ key: 'timmy-idle', frames: this.anims.generateFrameNumbers('timmy', { start: 0, end: 6 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'wizard-idle', frames: this.anims.generateFrameNumbers('wizard', { start: 0, end: 5 }), frameRate: 5, repeat: -1 });

            this.anims.create({ key: 'mushroom-idle', frames: this.anims.generateFrameNumbers('mushroom', { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
            this.anims.create({ key: 'eye-idle', frames: this.anims.generateFrameNumbers('flying_eye', { start: 0, end: 7 }), frameRate: 5, repeat: -1 });

            
            const mushroom1 = new Enemy(this, this.enemyPosX[3], this.enemyPosY[1], "mushroom", 3, "Mushroom", 3, 3);
            mushroom1.setScale(1.2);
            this.add.existing(mushroom1).anims.play('mushroom-idle');

            const mushroom2 = new Enemy(this, this.enemyPosX[4], this.enemyPosY[0], "mushroom", 3, "Mushroom", 3, 3);
            mushroom2.setScale(1.2);
            this.add.existing(mushroom2).anims.play('mushroom-idle');

            const eye1 = new Enemy(this, this.enemyPosX[1], this.enemyPosY[1], "flying_eye", 7, "Flying Eye", 3, 3);
            eye1.setScale(1.2);
            this.add.existing(eye1).anims.play('eye-idle');

            const eye2 = new Enemy(this, this.enemyPosX[2], this.enemyPosY[0], "flying_eye", 7, "Flying Eye", 3, 3);
            eye2.setScale(1.2);
            this.add.existing(eye2).anims.play('eye-idle');

            this.enemies = [mushroom1, mushroom2, eye1, eye2];
            this.units = (this.enemies);
            
        }
        
    }

    
    onHeroSelected(heroData) {
    const { texture, x, y, name, hp, atk, positionKey } = heroData;

     if (this.heroes[positionKey]) {
        this.heroes[positionKey].destroy();
        this.heroes[positionKey] = null;
     }
    const hero = new PlayerCharacter(this, x, y, texture, 0, name, hp, atk);
    this.add.existing(hero).anims.play(hero.texture.key + "-idle");
        if (hero.texture.key === 'wizard') {
    hero.setScale(0.7);
} else if (hero.texture.key === 'timmy') {
    hero.setScale(1.2);
}

    this.heroes[positionKey] = hero;
    this.units = this.heroes.filter(h => h !== null).concat(this.enemies);
}

    createMiniBoss()
    {
        if(this.currentbook === 'FANTASÍA')
        {
            this.anims.create({ key: 'dragon-idle', frames: this.anims.generateFrameNumbers('dragon', { start: 11, end: 13 }), frameRate: 5, repeat: -1 });

            const dragon = new Enemy(this, this.enemyPosX[1], this.enemyPosY[1], "dragon", 2, "Dragon", 150, 30);
            dragon.setScale(0.7);
            this.add.existing(dragon).anims.play('dragon-idle');

            this.enemies = [dragon];
            this.units = this.heroes.concat(this.enemies);

        }else if(this.currentbook === 'TERROR')
        {
            this.anims.create({ key: 'dragon-idle', frames: this.anims.generateFrameNumbers('dragon', { start: 11, end: 13 }), frameRate: 5, repeat: -1 });

            const dragon = new Enemy(this, 50, 75, "dragon", 2, "Dragon", 1, 25);
            dragon.setScale(0.7);
            this.add.existing(dragon).anims.play('dragon-idle');

            this.enemies = [dragon];
            this.units = this.heroes.concat(this.enemies);
           
        }else if(this.currentbook === 'HISTORIA')
        {
            this.anims.create({ key: 'medusa-idle', frames: this.anims.generateFrameNumbers('medusa', { start: 14, end: 16 }), frameRate: 5, repeat: -1 });

            const medusa = new Enemy(this, 50, 75, "medusa", 2, "Medusa", 1, 25);
            medusa.setScale(0.7);
            this.add.existing(medusa).anims.play('medusa-idle');

            this.enemies = [medusa];
            this.units = this.heroes.concat(this.enemies);
           
        }else if(this.currentbook === 'COMEDIA')
        {
            this.anims.create({ key: 'dragon-idle', frames: this.anims.generateFrameNumbers('dragon', { start: 11, end: 13 }), frameRate: 5, repeat: -1 });

            const dragon = new Enemy(this, 50, 75, "dragon", 2, "Dragon", 1, 25);
            dragon.setScale(0.7);
            this.add.existing(dragon).anims.play('dragon-idle');

            this.enemies = [dragon];
            this.units = this.heroes.concat(this.enemies);
           
        }else if(this.currentbook === 'THE END')

            {
            this.anims.create({ key: 'dragon-idle', frames: this.anims.generateFrameNumbers('dragon', { start: 11, end: 13 }), frameRate: 5, repeat: -1 });

            const dragon = new Enemy(this, 50, 75, "dragon", 2, "Dragon", 1, 25);
            dragon.setScale(0.7);
            this.add.existing(dragon).anims.play('dragon-idle');

            this.enemies = [dragon];
            this.units = this.heroes.concat(this.enemies);
           
        }
        
    }

    setSelectedHeroes(placedHeroes) {
    this.placedHeroes = placedHeroes;
    this.heroes = this.heroes.filter(h => h !== null);

    }
}






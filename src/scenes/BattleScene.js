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

        this.itemsArray = this.registry.get('inventory');

        this.cameras.main.setBackgroundColor("#1a1f2b");
        this.createEnemies(selectedScene);
        this.createInventory();
        this.scene.launch("CharacterSelectionScene");

        this.heroes = new Array(6).fill(null);
        this.units = [];

        this.availableHeroes = [
        { texture: 'timmy', name: 'Timmy', hp: 100, atk: 20, def: 5 }
        ];

        const shopScene = this.scene.get("ShopScene");
        shopScene.boughtCharacters.forEach(c =>{
            this.availableHeroes.push(c);
        });

        this.events.on("removeHero", (positionIndex) => {
            if (this.heroes && this.heroes[positionIndex]) {
                this.heroes[positionIndex].hpText.destroy();
                this.heroes[positionIndex].destroy();
                this.heroes[positionIndex] = null;
            }
            this.units = this.heroes.filter(h => h !== null).concat(this.enemies);
        });



        this.events.on("heroesSelected", this.onHeroSelected, this);
        this.scene.get("CharacterSelectionScene").events.on('selectionComplete', (placedHeroes) => {
        this.setSelectedHeroes(placedHeroes);
        this.units = this.heroes.concat(this.enemies);
        });
            this.index = -1;  

            this.normalCombatCompleted = false; 
            this.currentbook;
        }

    nextTurn() {
        this.index = (this.index + 1) % this.units.length;
        const unit = this.units[this.index];

        if (unit instanceof PlayerCharacter) {
            unit.restoreDef();
            unit.restoreDmg();
            this.events.emit("PlayerSelect", this.index);
        } else {
            const r = Math.floor(Math.random() * this.heroes.length);
            unit.attack(this.heroes[r]);
            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
        }
    }
    
    // === Manager de acciones ===
    receivePlayerSelection(action, targetIndex, itemIndex) {
        if (action === "attack") {
            this.units[this.index].attack(this.enemies[targetIndex]);
            

        }
        else if (action === "heal"){
            this.units[this.index].heal(this.itemsArray.getItem(itemIndex).getStat());
            this.itemsArray.useItem(itemIndex);
            this.createInventory();
        }
        else if (action === "strPot"){
            console.log("Aumento de ataque: " + this.itemsArray.getItem(itemIndex).getStat());
            this.units[this.index].dmgUp(this.itemsArray.getItem(itemIndex).getStat());
            this.itemsArray.useItem(itemIndex);
            this.createInventory();
        }
        else if (action === "defPot"){
            this.units[this.index].defUp(this.itemsArray.getItem(itemIndex).getStat());
            this.itemsArray.useItem(itemIndex);
            this.createInventory();
        }

        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
    }

    update() {
        this.units.forEach(unit => {
            if (unit.hpText && unit.alive !== false) unit.updateHpText();
        });
    }

   createEnemies(combatScene) {
        this.currentbook = combatScene;
        this.enemies = [];

        const sceneData = {
            'FANTASÍA': {
                background: 'fantasy_background',
                enemyDefs: [
                    { 
                        key: 'goblin', idleKey: 'goblin_idle', attackKey: 'goblin_attack', damageKey: 'goblin_damage', deathKey: 'goblin_death', 
                        idle: [0, 3], attack: [0, 7], damage: [0, 3], death: [0, 3],  scale: 1.2, name: 'Goblin',
                        hp: 30/*25*/, atk: 6,
                        positions: [[4, 1], [5, 0]],
                    },
                    { 
                        key: 'ghost', idleKey: 'ghost_idle', attackKey: 'ghost_attack', damageKey: 'ghost_damage', deathKey: 'ghost_death',
                        idle: [0, 11], attack: [0, 7], damage: [0, 9], death: [0, 9], scale: 0.3, name: 'Ghost',
                        hp: 28/*18*/, atk: 9,
                        positions: [[1, 1], [2, 0]],
                    },
                ],
            },
            'TERROR': {
                background: 'horror_background',
                enemyDefs: [
                    { 
                        key: 'mushroom', anim: [0, 3], scale: 1.2, name: 'Mushroom',
                        hp: 1, atk: 5,
                        positions: [[3, 1], [4, 0]],
                    },
                    { 
                        key: 'flying_eye', anim: [0, 7], scale: 1.2, name: 'Flying Eye',
                        hp: 1, atk: 11,
                        positions: [[1, 1], [2, 0]],
                    },
                ],
            },
            'HISTORIA': {
                background: 'history_background',
                enemyDefs: [
                    { 
                        key: 'pharaoh', anim: [0, 2], scale: 0.6, name: 'Pharaoh',
                        hp: 2, atk: 8,
                        positions: [[1, 1], [2, 0]],
                    },
                    { 
                        key: 'scarab', anim: [0, 1], scale: 0.6, name: 'Scarab',
                        hp: 2, atk: 5,
                        positions: [[3, 1], [4, 0]],
                    },
                ],
            },
            'COMEDIA': {
                background: 'comedy_background',
                enemyDefs: [
                    { 
                        key: 'jester', anim: [11, 17], scale: 1, name: 'Jester',
                        hp: 18, atk: 7,
                        positions: [[0, 1], [1, 0]],
                    },
                    // { 
                    //     key: 'clown', anim: [0, 8], scale: 2, name: 'Clown',
                    //     hp: 35, atk: 9,
                    //     positions: [[1, 0]],
                    // },
                ],
            },
            'THE END': {
                background: 'horror_background',
                enemyDefs: [
                    { 
                        key: 'boss2', anim: [0, 7], scale: 1, name: 'Scared Wizard',
                        hp: 500, atk: 22,
                        positions: [[0, 2]],
                    },
                    { 
                        key: 'boss3', anim: [0, 9], scale: 1, name: 'Sad Wizard',
                        hp: 500, atk: 22,
                        positions: [[4, 1]],
                    },
                    { 
                        key: 'boss1', anim: [0, 7], scale: 1, name: 'Angry Wizard',
                        hp: 500, atk: 22,
                        positions: [[2, 0]],
                    },
                ],
            },
        };

        const config = sceneData[combatScene];
        if (!config) {
            console.error(`No se encontró configuración para ${combatScene}`);
            return;
        }

        // Fondo
        this.add.image(0, 0, config.background)
            .setOrigin(0, 0.28)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Animaciones base de los héroes
        this._createIdleAnim('timmy_idle', 0, 6, 'timmy-idle');
        this._createAttackAnim('timmy_attack', 0, 4, 'timmy-attack');
        this._createDamageAnim('timmy_damage', 0, 3, 'timmy-damage');
        this._createDeathAnim('timmy_death', 0, 11, 'timmy-death');

        this._createIdleAnim('wizard_idle', 0, 5, 'wizard-idle');
        this._createAttackAnim('wizard_attack', 0, 7, 'wizard-attack');
        this._createDamageAnim('wizard_damage', 0, 3, 'wizard-damage');
        this._createDeathAnim('wizard_death', 0, 6, 'wizard-death');


        // Crear enemigos
        config.enemyDefs.forEach(def => {
            if (!this.anims.exists(`${def.key}-idle`)) {
                this._createIdleAnim(def.idleKey, def.idle[0], def.idle[1], `${def.key}-idle`);
            }
            if (!this.anims.exists(`${def.key}-attack`)) {
                this._createAttackAnim(def.attackKey, def.attack[0], def.attack[1], `${def.key}-attack`);
            }
            if (!this.anims.exists(`${def.key}-death`)) {
                this._createDeathAnim(def.deathKey, def.death[0], def.death[1], `${def.key}-death`);
            }
            if (!this.anims.exists(`${def.key}-damage`)) {
                this._createDamageAnim(def.damageKey, def.damage[0], def.damage[1], `${def.key}-damage`);
            }

            def.positions.forEach(([xIdx, yIdx]) => {
                const posX = this.enemyPosX[xIdx];
                const posY = this.enemyPosY[yIdx];
                let pos = (posX > 70) ? 'v' : 'r';

                const enemy = new Enemy(this, posX, posY, def.key, def.idle[1], def.name, def.hp, def.atk, pos);
                enemy.setScale(def.scale);
                this.add.existing(enemy).anims.play(`${def.key}-idle`);
                this.enemies.push(enemy);
            });
        });

        this.units = this.enemies;
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

    _createAttackAnim(key, start, end, animKey = `${key}-attack`) {
        if (this.anims.exists(animKey)) return;
        this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(key, { start, end }),
            frameRate: 5,
            repeat: 0,
        });
    }
     _createDeathAnim(key, start, end, animKey = `${key}-death`) {
        if (this.anims.exists(animKey)) return;
        this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(key, { start, end }),
            frameRate: 5,
            repeat: 0,
        });
    }

    _createDamageAnim(key, start, end, animKey = `${key}-damage`) {
        if (this.anims.exists(animKey)) return;
        this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(key, { start, end }),
            frameRate: 5,
            repeat: 0,
        });
    }

    // Actualiza el inventario
    createInventory(){
        this.inventory = [];
        for(let i = 0; i < this.itemsArray.size(); i++){
            if(this.itemsArray.getNum(i) > 0){
                this.inventory.push(this.itemsArray.getItem(i));
            }
        }
        console.log('tamaño inventario: ' + this.inventory.length);
    }

    
    onHeroSelected(heroData) {
        const { texture, x, y, name, hp, atk, def, positionKey } = heroData;
        console.log("esta es la defensa: " + def);
        if (this.heroes[positionKey]) {
            this.heroes[positionKey].destroy();
            this.heroes[positionKey] = null;
        }

        let pos = (positionKey === 0 || positionKey === 2 || positionKey === 4) ? 'v' : 'r';

        const hero = new PlayerCharacter(this, x, y, texture, 0, name, hp, atk, def, pos);
        this.add.existing(hero).anims.play(hero.texture.key + "-idle");
        if (positionKey=== 0 || positionKey === 1) { hero.setDepth(1); hero.hpText.setDepth(1);}
        if (positionKey=== 2 || positionKey === 3) { hero.setDepth(2); hero.hpText.setDepth(2);}
        if (positionKey=== 4 || positionKey === 5) { hero.setDepth(3); hero.hpText.setDepth(3);}
        

        if (hero.name === 'Wizard') {
            hero.setScale(0.2);
        } else if (hero.name === 'Timmy') {
            hero.setScale(1.2);
        }else if (hero.texture.key === 'ghost') {
            hero.setScale(0.3);
        }else if (hero.texture.key === 'scarab') {
            hero.setScale(0.4);
        }else if (hero.texture.key === 'pharaoh') {
            hero.setScale(0.4);
        }

        this.heroes[positionKey] = hero;
        this.units = this.heroes.filter(h => h !== null).concat(this.enemies);
        this.setDamage(this.units);
    }

    createMiniBoss() {
        const bossConfig = {
            'FANTASÍA': { key: 'dragon', anim: [11, 13], name: 'Dragon', pos: [1, 1], scale: 1, hp: 1, atk: 5 },
            'TERROR':   { key: 'cacodaemon', anim: [0, 5], name: 'Cacodaemon', pos: [50, 75], scale: 1, hp: 150, atk: 25 },
            'HISTORIA': { key: 'medusa', anim: [14, 16], name: 'Medusa', pos: [50, 75], scale: 1, hp: 150, atk: 25 },
            'COMEDIA':  { key: 'king', anim: [0, 7], name: 'King', pos: [50, 75], scale: 1, hp: 1, atk: 25 },
            'THE END':  { key: 'dragon', anim: [11, 13], name: 'Dragon', pos: [50, 75], scale: 1, hp: 1, atk: 25 },
        };

        const config = bossConfig[this.currentbook];
        if (!config) {
            console.error(`No se encontró configuración para mini boss en ${this.currentbook}`);
            return;
        }

        const animKey = `${config.key}-idle`;

        // Crear animación si no existe
        if (!this.anims.exists(animKey)) {
            this.anims.create({
                key: animKey,
                frames: this.anims.generateFrameNumbers(config.key, { start: config.anim[0], end: config.anim[1] }),
                frameRate: 5,
                repeat: -1,
            });
        }

        // Posición (si usa índices del array o coordenadas absolutas)
        const [x, y] = typeof config.pos[0] === "number" && config.pos[0] < 10
            ? [this.enemyPosX[config.pos[0]], this.enemyPosY[config.pos[1]]]
            : config.pos;

        const boss = new Enemy(this, x, y, config.key, config.anim[1], config.name, config.hp, config.atk);
        boss.setScale(config.scale);
        this.add.existing(boss).anims.play(animKey);

        this.enemies = [boss];
        this.units = this.heroes.concat(this.enemies);
    }


    setSelectedHeroes(placedHeroes) {
        this.placedHeroes = placedHeroes;
        this.heroes = this.heroes.filter(h => h !== null);

    }

    setDamage(character)
    {
        for (let i = 0; i<character.length; i++)
        if (character[i].pos == 'r'){character[i].damage += 5;

        }
    }

    cleanEvents() {
        // 🔹 Limpia todos los eventos de la propia escena
        this.events.off("removeHero");
        this.events.off("heroesSelected");

        // 🔹 Si hay otros listeners o escenas conectadas, límpialos aquí también
        const uiScene = this.scene.get("UIScene");
        if (uiScene && uiScene.events) {
            uiScene.events.off("PlayerSelect");
        }
        
    }

}






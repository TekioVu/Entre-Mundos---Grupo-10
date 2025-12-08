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

        //Inicialización de los arrays de personajes
        this.heroes = new Array(6).fill(null);
        this.units = [];

        //Héroes disponibles al inicio de la partida
        this.availableHeroes = [
        { texture: 'timmy', name: 'Timmy', hp: 100, atk: 20, def: 5 }
        ];

        //Añadir los personajes comprados en la tienda los héroes disponibles
        const shopScene = this.scene.get("ShopScene");
        shopScene.boughtCharacters.forEach(c =>{
            this.availableHeroes.push(c);
        });

        //Eventos de la escena
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

            this.firstTimeFantasyMinigame = true;
        }

    //Gestión de los turnos
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
        this.createInventory();
        if (action === "attack") { //Ataque
            this.units[this.index].attack(this.enemies[targetIndex]);
            
            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
        }
        else if (action === "heal"){ // Curar
            this.units[this.index].heal(this.itemsArray.getItem(itemIndex).getStat());
            this.itemsArray.useItem(itemIndex);
            this.createInventory();
        }
        else if (action === "strPot"){ // Aumentar Daño
            console.log("Aumento de ataque: " + this.itemsArray.getItem(itemIndex).getStat());
            this.units[this.index].dmgUp(this.itemsArray.getItem(itemIndex).getStat());
            this.itemsArray.useItem(itemIndex);
            this.createInventory();
        }
        else if (action === "defPot"){ // Aumentar Defensa
            this.units[this.index].defUp(this.itemsArray.getItem(itemIndex).getStat());
            this.itemsArray.useItem(itemIndex);
            this.createInventory();
        }
        else if (action === "areaPot"){ // Daño en Area (vanguardia o retaguardia)
            // Comprueba si el daño se hace a la vanguardia o retaguardia
            console.log("llega");

            this.events.emit("Message", `Area Potion deals ${this.itemsArray.getItem(itemIndex).getStat()} damage to the ${this.enemies[targetIndex].pos === "v" ? "vanguard" : "rearguard"}`);
            if(this.enemies[targetIndex].pos === "v"){
                for(let i = 0; i < this.enemies.length; i++){
                    if(this.enemies[i].pos === "v"){
                        this.enemies[i].areaPot(this.itemsArray.getItem(itemIndex).getStat(), this.enemies[targetIndex].pos);
                    }
                }
            }
            else{
                for(let i = 0; i < this.enemies.length; i++){
                    if(this.enemies[i].pos === "r"){
                        this.enemies[i].areaPot(this.itemsArray.getItem(itemIndex).getStat(), this.enemies[targetIndex].pos);
                    }
                }
            }
            this.itemsArray.useItem(itemIndex);

            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
        }
        else if (action === "dmgPot"){
            this.enemies[targetIndex].takeDamage(this.itemsArray.getItem(itemIndex).getStat());
            this.itemsArray.useItem(itemIndex);

            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
        }
        else if (action === "catPot"){
            for(let e of this.enemies){
                e.takeDamage(this.itemsArray.getItem(itemIndex).getStat(), this.units[this.index])
            }
            this.itemsArray.useItem(itemIndex);
        }
    }

    update() {
        //Actualización de las barras de vida
        this.units.forEach(unit => {
            if (unit.hpText && unit.alive !== false) unit.updateHpText();
        });
    }

    //Creación de los enemigos de cada libro
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
                        hp: 1/*25*/, atk: 6,
                        positions: [[4, 1], [5, 0]],
                    },
                    { 
                        key: 'ghost', idleKey: 'ghost_idle', attackKey: 'ghost_attack', damageKey: 'ghost_damage', deathKey: 'ghost_death',
                        idle: [0, 11], attack: [0, 7], damage: [0, 9], death: [0, 9], scale: 0.3, name: 'Ghost',
                        hp: 1/*18*/, atk: 9,
                        positions: [[1, 1], [2, 0]],
                    },
                ],
            },
            'TERROR': {
                background: 'horror_background',
                enemyDefs: [
                    { 
                        key: 'mushroom', idleKey: 'mushroom_idle', attackKey: 'mushroom_attack', damageKey: 'mushroom_damage', deathKey: 'mushroom_death', 
                        idle: [0, 3], attack: [0,7], damage: [0, 3], death: [0,3], scale: 1.2, name: 'Mushroom',
                        hp: 2, atk: 5,
                        positions: [[3, 1], [4, 0]],
                    },
                    { 
                        key: 'flying_eye', idleKey: 'flying_eye_idle', attackKey: 'flying_eye_attack', damageKey: 'flying_eye_damage', deathKey: 'flying_eye_death',
                        idle: [0, 7], attack: [0, 7], damage: [0, 3], death: [0,3], scale: 1.2, name: 'Flying Eye',
                        hp: 2, atk: 11,
                        positions: [[1, 1], [2, 0]],
                    },
                ],
            },
            'HISTORIA': {
                background: 'history_background',
                enemyDefs: [
                    { 
                        key: 'pharaoh', idleKey: 'pharaoh_idle', attackKey: 'pharaoh_attack', damageKey: 'pharaoh_damage', deathKey: 'pharaoh_death',
                        idle: [0, 2], attack: [0, 4], damage: [0, 2], death: [0, 2], scale: 0.6, name: 'Pharaoh',
                        hp: 200, atk: 8,
                        positions: [[1, 1], [2, 0]],
                    },
                    { 
                        key: 'scarab', idleKey: 'scarab_idle', attackKey: 'scarab_attack', damageKey: 'scarab_damage', deathKey: 'scarab_death',
                        idle: [0, 1], attack: [0, 1], damage: [0, 2], death: [0, 2], scale: 0.6, name: 'Scarab',
                        hp: 200, atk: 5,
                        positions: [[4, 1], [5, 0]],
                    },
                ],
            },
            'COMEDIA': {
                background: 'comedy_background',
                enemyDefs: [
                    { 
                        key: 'jester', idleKey: 'jester_idle', attackKey: 'jester_attack', damageKey: 'jester_damage', deathKey: 'jester_death',
                        idle: [11, 17], attack: [89, 72], damage: [107, 104], death: [125, 117], scale: 1, name: 'Jester',
                        hp: 4, atk: 7,
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
                        key: 'boss2', idleKey: 'boss2_idle', attackKey: 'boss2_attack', damageKey: 'boss2_damage', deathKey: 'boss2_death',
                        idle: [0, 7], attack: [0, 7], damage: [0, 2], death: [0, 6], scale: 1, name: 'Sad Wizard',
                        hp: 40, atk: 22,
                        positions: [[0, 2]],
                    },
                    { 
                        key: 'boss3', idleKey: 'boss3_idle', attackKey: 'boss3_attack', damageKey: 'boss3_damage', deathKey: 'boss3_death',
                        idle: [0, 9], attack: [0, 12], damage: [0, 2], death: [0, 17], scale: 1, name: 'Scared Wizard',
                        hp: 40, atk: 22,
                        positions: [[4, 1]],
                    },
                    { 
                        key: 'boss1', idleKey: 'boss1_idle', attackKey: 'boss1_attack', damageKey: 'boss1_damage', deathKey: 'boss1_death',
                        idle: [0, 7], attack: [0, 7], damage: [0, 3], death: [0, 4], scale: 1, name: 'Angry Wizard',
                        hp: 40, atk: 22,
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

        this._createIdleAnim('dragon_idle', 11, 13, 'dragon-idle');
        this._createAttackAnim('dragon_attack', 0, 3, 'dragon-attack');
        this._createDamageAnim('dragon_damage', 9, 10, 'dragon-damage');
        this._createDeathAnim('dragon_death', 4, 8, 'dragon-death');

        this._createIdleAnim('cacodaemon_idle', 0, 5, 'cacodaemon-idle');
        this._createAttackAnim('cacodaemon_attack', 8, 13, 'cacodaemon-attack');
        this._createDamageAnim('cacodaemon_damage', 16, 19, 'cacodaemon-damage');
        this._createDeathAnim('cacodaemon_death', 24, 31, 'cacodaemon-death');

        this._createIdleAnim('king_idle', 0, 3, 'king-idle');
        this._createAttackAnim('king_attack', 0, 3, 'king-attack');
        this._createDamageAnim('king_damage', 0, 3, 'king-damage');
        this._createDeathAnim('king_death', 0, 5, 'king-death');

        this._createIdleAnim('medusa_idle', 14, 16, 'medusa-idle');
        this._createAttackAnim('medusa_attack', 0, 5, 'medusa-attack');
        this._createDamageAnim('medusa_damage', 12, 13, 'medusa-damage');
        this._createDeathAnim('medusa_death', 6, 11, 'medusa-death');

         


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

    //Creaación de las animaciones idle de los personajes
    _createIdleAnim(key, start, end, animKey = `${key}-idle`) {
        if (this.anims.exists(animKey)) return;
        this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(key, { start, end }),
            frameRate: 5,
            repeat: -1,
        });
    }

    //Creaación de las animaciones attack de los personajes
    _createAttackAnim(key, start, end, animKey = `${key}-attack`) {
        if (this.anims.exists(animKey)) return;
        this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(key, { start, end }),
            frameRate: 5,
            repeat: 0,
        });
    }

    
    //Creaación de las animaciones death de los personajes
     _createDeathAnim(key, start, end, animKey = `${key}-death`) {
        if (this.anims.exists(animKey)) return;
        this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(key, { start, end }),
            frameRate: 5,
            repeat: 0,
        });
    }

    //Creaación de las animaciones damage de los personajes
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

    //Guarda los héroes que han sido seleccionados en CharacterSelectionScene
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

        if (hero.type === 'Wizard') {
            hero.setScale(0.7);
        } else if (hero.name === 'Timmy') {
            hero.setScale(1.2);
        }else if (hero.type === 'Ghost') {
            hero.setScale(0.3);
        }else if (hero.texture.key === 'scarab') {
            hero.setScale(0.4);
        }else if (hero.texture.key === 'pharaoh') {
            hero.setScale(0.4);
        }else if (hero.type === 'Dragon') {
            hero.setScale(0.7);
        }

        this.heroes[positionKey] = hero;
        this.units = this.heroes.filter(h => h !== null).concat(this.enemies);
        this.setDamage(this.units);

        hero.isEnemy = false;
        
    }

    //Creación de los bosses de cada libro
    createMiniBoss() {
        this.normalCombatCompleted = true;

        const bossConfig = {
            'FANTASÍA': { key: 'dragon', idleKey: 'dragon_idle', attackKey: 'dragon_attack', damageKey: 'dragon_damage', deathKey: 'dragon_death',
            idle: [0, 3], attack: [11, 13], damage: [9, 10], death: [4, 8], name: 'Dragon', pos: [0, 1], scale: 1, hp: 10, atk: 15 },

            'TERROR':   { key: 'cacodaemon', idleKey: 'cacodaemon_idle', attackKey: 'cacodaemon_attack', damageKey: 'cacodaemon_damage', deathKey: 'cacodaemon_death',
                idle: [0, 5], attack: [8, 13], damage: [16, 19], death: [24, 31], name: 'Cacodaemon', pos: [1, 1], scale: 1, hp: 150, atk: 25 },
            'HISTORIA': { key: 'medusa', idleKey: 'medusa_idle', attackKey: 'medusa_attack', damageKey: 'medusa_damage', deathKey: 'medusa_death',
                idle: [0, 2],  attack: [11, 16], damage: [12, 13], death: [6, 11],name: 'Medusa', pos: [1, 1], scale: 1, hp: 10, atk: 25 },
            'COMEDIA':  { key: 'king', idleKey: 'king_idle', attackKey: 'king_attack', damageKey: 'king_damage',  deathKey: 'king_death',
            idle: [0, 3], attack: [0, 3], damage: [0, 3], death: [0, 5], name: 'King', pos: [1, 1], scale: 1, hp: 350, atk: 10 },
        };

        const config = bossConfig[this.currentbook];
        if (!config) {
            console.error(`No se encontró configuración para mini boss en ${this.currentbook}`);
            return;
        }

        const animKey = `${config.key}-idle`;

        // Crear animación si no existe
        if (!this.anims.exists(`${config.key}-idle`)) {
                this._createIdleAnim(config.idleKey, config.idle[0], config.idle[1], `${config.key}-idle`);
            }
        if (!this.anims.exists(`${config.key}-attack`)) {
                this._createAttackAnim(config.attackKey, config.attack[0], config.attack[1], `${config.key}-attack`);
            }
            if (!this.anims.exists(`${config.key}-death`)) {
                this._createDeathAnim(config.deathKey, config.death[0], config.death[1], `${config.key}-death`);
            }
            if (!this.anims.exists(`${config.key}-damage`)) {
                this._createDamageAnim(config.damageKey, config.damage[0], config.damage[1], `${config.key}-damage`);
            }

        // Posición (si usa índices del array o coordenadas absolutas)
        const [x, y] = typeof config.pos[0] === "number" && config.pos[0] < 10
            ? [this.enemyPosX[config.pos[0]], this.enemyPosY[config.pos[1]]]
            : config.pos;

        const boss = new Enemy(this, x, y, config.key, config.idle[1], config.name, config.hp, config.atk);
        boss.setScale(config.scale);
        this.add.existing(boss).anims.play(animKey);

        this.enemies = [boss];
        this.units = this.heroes.concat(this.enemies);
    }

    //Limpia las posiciones vacías del array de héroes cuando ha terminado la selección
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
    //Limpia todos los eventos de la escena
    cleanEvents() {
        this.events.off("removeHero");
        this.events.off("heroesSelected");

        const uiScene = this.scene.get("UIScene");
        if (uiScene && uiScene.events) {
            uiScene.events.off("PlayerSelect");
        }
        
    }

    //El rey enemigo usa su habilidad para invocar tres Jesters
   invokeJester() {
        // Posiciones donde quieres que aparezca el Jester (por ejemplo)
        const positions = [
            [3, 2],
            [4, 1],
            [5, 0],
        ];

        // Datos específicos de Jester
        const def = {
            key: 'jester',
            idleKey: 'jester_idle',
            idle: [11, 17],
            scale: 1,
            name: 'Jester',
            hp: 25,
            atk: 15,
        };

        // Iteramos solo sobre las posiciones de Jester
        positions.forEach(([xIdx, yIdx]) => {
            const posX = this.enemyPosX[xIdx];
            const posY = this.enemyPosY[yIdx];
            let pos = (posX > 70) ? 'v' : 'r'; // lógica de orientación

            const enemy = new Enemy(
                this,
                posX,
                posY,
                def.key,
                def.idle[1],
                def.name,
                def.hp,
                def.atk,
                pos
            );

            enemy.setScale(def.scale);
            this.add.existing(enemy).anims.play(`${def.key}-idle`);
            this.enemies.push(enemy);
            this.units = this.heroes.concat(this.enemies);
        });
    }

    //El rey aliado usa su habilidad para invocar Jesters en todas las posiciones vacías
    invokeJesterHero() {
    const def = {
        key: 'jester',
        idleKey: 'jester_idle',
        attackKey: 'jester_attack',
        damageKey: 'jester_damage',
        deathKey: 'jester_death',
        idle: [11, 17],
        attack: [89, 72],
        damage: [107, 104],
        death: [125, 117],
        scale: 1,
        name: 'Jester',
        hp: 100,
        atk: 15,
    };

    if (!this.anims.exists('jester-idle')) this._createIdleAnim(def.idleKey, def.idle[0], def.idle[1], 'jester-idle');
    if (!this.anims.exists('jester-attack')) this._createAttackAnim(def.attackKey, def.attack[0], def.attack[1], 'jester-attack');
    if (!this.anims.exists('jester-damage')) this._createDamageAnim(def.damageKey, def.damage[0], def.damage[1], 'jester-damage');
    if (!this.anims.exists('jester-death')) this._createDeathAnim(def.deathKey, def.death[0], def.death[1], 'jester-death');

    const positionCoords = [
        { x: 200, y: 50, pos: 'v' },
        { x: 250, y: 50, pos: 'r' },
        { x: 220, y: 75, pos: 'v' },
        { x: 270, y: 75, pos: 'r' },
        { x: 240, y: 100, pos: 'v' },
        { x: 290, y: 100, pos: 'r' },
    ];

    const usedPositions = this.heroes.map(h => `${h.x},${h.y}`);
    const freePositions = positionCoords.filter(pos => !usedPositions.includes(`${pos.x},${pos.y}`));

    freePositions.forEach(pos => {
        const hero = new PlayerCharacter(this, pos.x, pos.y, def.key, 0, def.name, def.hp, def.atk, pos.pos);
        hero.setScale(def.scale);
        this.add.existing(hero).anims.play('jester-idle');

        this.heroes.push(hero); 
    });

    this.units = this.heroes.concat(this.enemies);
    this.uiscene = this.scene.get("UIScene");
    this.uiscene.remapHeroes();

}

//Lanzamiento del minijuego de Fantasía
    launchMagicMinigame(attacker, target) {
        this.currentAttacker = attacker;  // guardamos referencias
        this.currentTarget = target;

        // Lanza el minijuego y lo lleva al frente
        this.scene.launch("MiniGame_Fantasy", {
            attacker: attacker,
            target: target,
            parent: this,
            firstTime: this.firstTimeFantasyMinigame
        });

        this.firstTimeFantasyMinigame = false;

        this.scene.bringToTop("MiniGame_Fantasy");
        this.scene.pause("BattleScene");
    }

//Lanzamiento del minijuego de Terror
    launchTerrorMinigame(attacker, target) {
        this.currentAttacker = attacker;  // guardamos referencias
        this.currentTarget = target;

        // Lanza el minijuego y lo lleva al frente
        this.scene.launch("MiniGame_Terror", {
            attacker: attacker,
            target: target,
            parent: this,
            firstTime: this.firstTimeFantasyMinigame
        });

        this.firstTimeFantasyMinigame = false;

        this.scene.bringToTop("MiniGame_Terror");
        this.scene.pause("BattleScene");
    }

    //Consecuencias del resultado del minijuego en la partida
    minigameResult(result) {

        this.scene.resume("BattleScene");

        let attacker = this.currentAttacker;
        let target = this.currentTarget;
        let damage = attacker.damage;

        if (result === "perfect") damage += 10;
        else if (result === "fail") damage -= 5;

        target.takeDamage(damage);
        this.events.emit("Message", `${attacker.type} attacks ${target.type} for ${damage} damage (${result})`);

        // Limpieza
        this.currentAttacker = null;
        this.currentTarget = null;

        //this.nextTurn?.();
    }
}






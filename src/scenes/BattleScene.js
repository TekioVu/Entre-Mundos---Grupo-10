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
        this.createInventory(menuScene.getInventory());
        this.scene.launch("CharacterSelectionScene");

        this.heroes = new Array(6).fill(null);
        this.units = [];
        this.units = [];

        this.availableHeroes = [
        { texture: 'timmy', name: 'Timmy', hp: 100, atk: 20 }
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

        this.events.on("enemyRemoved", (index) => {
    console.log("Índice de enemigo eliminado:", index);

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

    createEnemies(combatScene) {
        this.currentbook = combatScene;
        this.enemies = [];

        const sceneData = {
            'FANTASÍA': {
                background: 'fantasy_background',
                enemyDefs: [
                    { key: 'goblin', anim: [0, 3], scale: 1.2, positions: [[3, 2], [4, 1], [5, 0]], name: 'Goblin' },
                    { key: 'ghost', anim: [0, 11], scale: 0.3, positions: [[0, 2], [1, 1], [2, 0]], name: 'Ghost' },
                ],
            },
            'TERROR': {
                background: 'horror_background',
                enemyDefs: [
                    { key: 'mushroom', anim: [0, 3], scale: 1.2, positions: [[3, 1], [4, 0]], name: 'Mushroom' },
                    { key: 'flying_eye', anim: [0, 7], scale: 1.2, positions: [[1, 1], [2, 0]], name: 'Flying Eye' },
                ],
            },
            'HISTORIA': {
                background: 'history_background',
                enemyDefs: [
                    { key: 'pharaoh', anim: [0, 2], scale: 0.6, positions: [[1, 1], [2, 0]], name: 'Pharaoh' },
                    { key: 'scarab', anim: [0, 1], scale: 0.6, positions: [[3, 1], [4, 0]], name: 'Scarab' },
                ],
            },
            'COMEDIA': {
                background: 'comedy_background',
                enemyDefs: [
                    { key: 'jester', anim: [0, 6], scale: 1, positions: [[0, 1]], name: 'Jester' },
                    { key: 'clown', anim: [0, 8], scale: 2, positions: [[1, 0]], name: 'Clown' },
                ],
            },
            'THE END': {
                background: 'horror_background',
                enemyDefs: [
                    { key: 'mushroom', anim: [0, 3], scale: 1.2, positions: [[3, 1], [4, 0]], name: 'Mushroom' },
                    { key: 'flying_eye', anim: [0, 7], scale: 1.2, positions: [[1, 1], [2, 0]], name: 'Flying Eye' },
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
            .setOrigin(0, 0.3)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Animaciones base del jugador
        this._createIdleAnim('timmy', 0, 6);
        this._createIdleAnim('wizard', 0, 5);

        // Crear enemigos
        config.enemyDefs.forEach(def => {
            // Crear animación si no existe
            if (!this.anims.exists(`${def.key}-idle`)) {
                this._createIdleAnim(def.key, def.anim[0], def.anim[1], `${def.key}-idle`);
            }

            // Crear instancias de enemigos
            def.positions.forEach(([xIdx, yIdx]) => {
                const posX = this.enemyPosX[xIdx];
                const posY = this.enemyPosY[yIdx];
                const enemy = new Enemy(this, posX, posY, def.key, def.anim[1], def.name, 3, 3);

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

    createInventory(inventory){
        this.inventory = [];
        for(let i = 0; i < inventory.size(); i++){
            if(inventory.getNum(i) > 0){
                this.inventory.push(inventory.getItem(i));
            }
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
        if (positionKey=== 0 || positionKey === 1) { hero.setDepth(1); hero.hpText.setDepth(1);}
        if (positionKey=== 2 || positionKey === 3) { hero.setDepth(2); hero.hpText.setDepth(2);}
        if (positionKey=== 4 || positionKey === 5) { hero.setDepth(3); hero.hpText.setDepth(3);}
                if (hero.texture.key === 'wizard') {
            hero.setScale(0.7);
        } else if (hero.texture.key === 'timmy') {
            hero.setScale(1.2);
        }

        this.heroes[positionKey] = hero;
        this.units = this.heroes.filter(h => h !== null).concat(this.enemies);
    }

    createMiniBoss() {
        const bossConfig = {
            'FANTASÍA': { key: 'dragon', anim: [11, 13], name: 'Dragon', pos: [1, 1], scale: 0.7, atk: 1, hp: 30 },
            'TERROR':   { key: 'dragon', anim: [11, 13], name: 'Dragon', pos: [50, 75], scale: 0.7, atk: 1, hp: 25 },
            'HISTORIA': { key: 'medusa', anim: [14, 16], name: 'Medusa', pos: [50, 75], scale: 0.7, atk: 1, hp: 25 },
            'COMEDIA':  { key: 'dragon', anim: [11, 13], name: 'Dragon', pos: [50, 75], scale: 0.7, atk: 1, hp: 25 },
            'THE END':  { key: 'dragon', anim: [11, 13], name: 'Dragon', pos: [50, 75], scale: 0.7, atk: 1, hp: 25 },
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

        const boss = new Enemy(this, x, y, config.key, config.anim[1], config.name, config.atk, config.hp);
        boss.setScale(config.scale);
        this.add.existing(boss).anims.play(animKey);

        this.enemies = [boss];
        this.units = this.heroes.concat(this.enemies);
    }


    setSelectedHeroes(placedHeroes) {
    this.placedHeroes = placedHeroes;
    this.heroes = this.heroes.filter(h => h !== null);

    }

    cleanEvents() {
        // 🔹 Limpia todos los eventos de la propia escena
        this.events.off("removeHero");
        this.events.off("heroesSelected");
        this.events.off("enemyRemoved");

        // 🔹 Limpia los eventos de CharacterSelectionScene si existe
        const charScene = this.scene.get("CharacterSelectionScene");
        if (charScene && charScene.events) {
            charScene.events.off("selectionComplete");
        }

        // 🔹 Si hay otros listeners o escenas conectadas, límpialos aquí también
        const uiScene = this.scene.get("UIScene");
        if (uiScene && uiScene.events) {
            uiScene.events.off("PlayerSelect");
        }
        
        console.log("🧹 Eventos de BattleScene limpiados correctamente");
    }

}






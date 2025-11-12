import HeroesMenu from "../ui/HeroesMenu.js";
import ActionsMenu from "../ui/ActionsMenu.js";
import EnemiesMenu from "../ui/EnemiesMenu.js";
import ItemsMenu from "../ui/ItemsMenu.js";
import Message from "../ui/Message.js";

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: "UIScene" });
    }

    create() {
        this.id = 0;
        this.inventory = this.registry.get('inventory');

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.graphics.fillRect(0, 170, 130, 100);
        this.graphics.strokeRect(105, 170, 90, 90);
        this.graphics.fillRect(105, 170, 190, 90);
        this.graphics.strokeRect(205, 170, 130, 100);
        this.graphics.fillRect(205, 170, 130, 100);

        this.menus = this.add.container();
        this.heroesMenu = new HeroesMenu(220, 180, this, true);
        this.actionsMenu = new ActionsMenu(145, 180, this, false);
        this.enemiesMenu = new EnemiesMenu(10, 180, this, true);
        this.itemsMenu = new ItemsMenu(10, 180, this, this.inventory);

        this.currentMenu = this.actionsMenu;
        this.menus.add([this.heroesMenu, this.actionsMenu, this.enemiesMenu, this.itemsMenu]);

        this.battleScene = this.scene.get("BattleScene");

        this.markerEnemies = [
        //{ x: 110, y: 50, d: 1 }, 
        { x: 100, y: 75, d: 2 }, 
        { x: 90, y: 100, d: 3 } , 
        //{ x: 60, y: 50, d: 1},
        { x: 50, y: 75, d: 2 }, 
        { x: 40, y: 100, d: 3 }, 
        ];

        this.enemiesMarker = this.add.graphics();
        this.enemiesMarker.lineStyle(4, 0xffffff, 0.8); 
        
        this.scene.get("BattleScene").events.on("enemyRemoved", (index) => {
            this.removeEnemyMarker(index);
        });


        this.remapHeroes();
        this.heroesMenu.select(0);
        this.actionsMenu.select(0);

        this.input.keyboard.on("keydown", this.onKeyInput, this);

        this.battleScene.events.on("PlayerSelect", this.onFirstPlayerSelect, this); // Para dejar el primer personaje de la lista al empezar cada turno
        this.events.on("PlayerSelect", this.onPlayerSelect, this);                  // Cuando se selecciona el personaje con el que actuar
        this.events.on("Select", this.onSelect, this);                              // Cuando se escoje la accion que se quiere realizar
        this.events.on("Enemy", this.onEnemy, this);                                // Al escojer a que enemigo atacar
        this.events.on("Item", this.onItem, this);                                  // Al escojer que item usar
        this.events.on("Back", this.onBack, this);                                  // Cuando el jugador quiere retirar que ha seleccionado (a excepcion de "Enemy" e "Item")

        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);

        this.battleScene.nextTurn();
    }

    // Cuando se ha seleccionado un enemigo al que atacar
    onEnemy(enemyIndex) {
        this.enemiesMenu.clear();   
        this.actionsMenu.deselect();
        this.currentMenu = null;
        this.battleScene.receivePlayerSelection("attack", enemyIndex, undefined);
    }

    // Cuando se ha seleccionado un item para usar (Sin terminar)
    onItem(itemIndex){
        this.itemsMenu .clear();
        this.currentMenu = null;
        this.battleScene.receivePlayerSelection("heal", undefined, itemIndex);
    }

    onFirstPlayerSelect() {
        this.currentMenu = this.actionsMenu;
        this.heroesMenu.select(0);
    }

    onPlayerSelect(){
        this.actionsMenu.select(0);
        this.currentMenu = this.actionsMenu;
    }

    onSelect() {
        if(this.currentMenu.getMenuItemIndex() === 0){ // En caso de que se escoja "Attack"
            this.remapEnemies();
            this.currentMenu = this.enemiesMenu;
            this.enemiesMenu.select(0);
        }
        else if (this.currentMenu.getMenuItemIndex() === 1){ // en caso de que se escoja "Item"
            this.remapItems();
            this.currentMenu = this.itemsMenu;
            this.itemsMenu.select(0);
        }
    }

    // Retroceder
    onBack() {
        if(this.currentMenu === this.enemiesMenu){ // En caso de estar en el menu de enemigos
            this.enemiesMenu.clear()
            this.enemiesMenu.deselect();
            this.currentMenu = this.actionsMenu;
            this.actionsMenu.select(0);
        }else if(this.currentMenu === this.itemsMenu){ // En caso de estar en el menu de items
            this.itemsMenu.clear();
            this.itemsMenu.deselect();
            this.currentMenu = this.actionsMenu;
            this.actionsMenu.select(1);
        }else if(this.currentMenu === this.actionsMenu){ // En caso de estar en el menu de acciones
            this.actionsMenu.deselect();
            this.currentMenu = this.heroesMenu;
            this.heroesMenu.select(this.id);
        }
        
    }

    updateEnemiesMarker() {
        if (this.currentMenu !== this.enemiesMenu) {
        this.enemiesMarker.setVisible(false);
            return;
        }

        const index = this.enemiesMenu.menuItemIndex; 
        const coords = this.markerEnemies[index];

        if (!coords) {
            this.enemiesMarker.clear();
            this.enemiesMarker.setVisible(false);
            return;
        }

        this.enemiesMarker.clear();
        this.enemiesMarker.lineStyle(4, 0xffffff, 0.8); 
        // this.enemiesMarker.strokeRect(coords.x-25, coords.y-25, 50, 50);
       
const width = 50;
const height = 50;
const cornerLength = 10;


//Cuadro que enmarca al enemigo seleccionado
this.enemiesMarker.beginPath();
this.enemiesMarker.moveTo(coords.x-25, coords.y-25);
this.enemiesMarker.lineTo(coords.x + cornerLength-25, coords.y-25);
this.enemiesMarker.moveTo(coords.x-25, coords.y-25);
this.enemiesMarker.lineTo(coords.x-25, coords.y + cornerLength-25);

this.enemiesMarker.moveTo(coords.x-25 + width, coords.y-25);
this.enemiesMarker.lineTo(coords.x + width - cornerLength-25, coords.y-25);
this.enemiesMarker.moveTo(coords.x + width-25, coords.y-25);
this.enemiesMarker.lineTo(coords.x + width-25, coords.y + cornerLength-25);

this.enemiesMarker.moveTo(coords.x-25, coords.y + height-25);
this.enemiesMarker.lineTo(coords.x + cornerLength-25, coords.y + height-25);
this.enemiesMarker.moveTo(coords.x-25, coords.y + height-25);
this.enemiesMarker.lineTo(coords.x-25, coords.y + height - cornerLength-25);

this.enemiesMarker.moveTo(coords.x + width-25, coords.y + height-25);
this.enemiesMarker.lineTo(coords.x + width - cornerLength-25, coords.y + height-25);
this.enemiesMarker.moveTo(coords.x + width-25, coords.y + height-25);
this.enemiesMarker.lineTo(coords.x + width-25, coords.y + height - cornerLength-25);

this.enemiesMarker.strokePath();
        this.enemiesMarker.setDepth(coords.d)
        this.enemiesMarker.setVisible(true);
    }
    removeEnemyMarker(index) {
        if (index >= 0 && index < this.markerEnemies.length) {
            this.markerEnemies.splice(index, 1);
        }

        this.enemiesMarker.clear();
        this.enemiesMarker.setVisible(false);

        if (this.enemiesMenu.menuItemIndex >= this.markerEnemies.length) {
            this.enemiesMenu.select(0);
        }
    }



    remapHeroes() { //Crea los botones de los aliados
        this.heroesMenu.remap(this.battleScene.heroes);
    }

    remapEnemies() { // Crea los botones de los enemigos
        this.enemiesMenu.remap(this.battleScene.enemies);
    }

    remapItems(){ // Crea los botones de los items
        this.itemsMenu.remap(this.battleScene.inventory);
    }

    // === Imput Manager ===
    onKeyInput(event) {
        const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];
        if (keysToPrevent.includes(event.code)) event.preventDefault();

        if (this.currentMenu) {
            if (event.code === "ArrowUp") this.currentMenu.moveSelectionUp();
            else if (event.code === "ArrowDown") this.currentMenu.moveSelectionDown();
            else if (event.code === "ArrowRight" || event.code === "Shift") { 
                if (this.currentMenu === this.enemiesMenu) this.enemiesMarker.setVisible(false);

                if(this.currentMenu !== this.heroesMenu) { this.currentMenu.back(); } 
        }
            else if (event.code === "Space" || (event.code === "ArrowLeft" && this.currentMenu !== this.enemiesMenu)) this.currentMenu.confirm();
        }
        this.updateEnemiesMarker();

    }

    cleanEvents() {
        this.events.off("PlayerSelect", this.onPlayerSelect, this);
        this.events.off("SelectEnemies", this.onSelectEnemies, this);
        this.events.off("Enemy", this.onEnemy, this);
        this.events.off("Item", this.onItem, this);
        this.events.off("Back", this.onBack, this);

    }
}

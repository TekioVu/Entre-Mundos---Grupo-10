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

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.graphics.strokeRect(1, 150, 90, 100);
        this.graphics.fillRect(1, 150, 130, 100);
        this.graphics.strokeRect(105, 150, 90, 90);
        this.graphics.fillRect(105, 150, 190, 90);
        this.graphics.strokeRect(205, 150, 130, 100);
        this.graphics.fillRect(205, 150, 130, 100);

        this.menus = this.add.container();
        this.heroesMenu = new HeroesMenu(220, 170, this, true);
        this.actionsMenu = new ActionsMenu(145, 170, this, false);
        this.enemiesMenu = new EnemiesMenu(10, 170, this, true);
        this.itemsMenu = new ItemsMenu(8, 155, this, false);

        this.currentMenu = this.actionsMenu;
        this.menus.add([this.heroesMenu, this.actionsMenu, this.enemiesMenu]);

        this.battleScene = this.scene.get("BattleScene");

        this.remapHeroes();
        this.heroesMenu.select(0);
        this.actionsMenu.select(0);

        this.input.keyboard.on("keydown", this.onKeyInput, this);

        this.battleScene.events.on("PlayerSelect", this.onFirstPlayerSelect, this); // Para dejar el primer personaje de la lista al empezar cada turno
        this.events.on("PlayerSelect", this.onPlayerSelect, this);                  // Cuando se selecciona el personaje con el que actuar
        this.events.on("Select", this.onSelect, this);
        this.events.on("Enemy", this.onEnemy, this);
        this.events.on("Item", this.onItem, this);
        this.events.on("Back", this.onBack, this);

        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);

        this.battleScene.nextTurn();
    }

    onEnemy(index) {
        this.currentMenu = null;
        this.battleScene.receivePlayerSelection("attack", index);
    }

    onItem(index){

    }

    onFirstPlayerSelect() {
        this.currentMenu = this.heroesMenu;
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
            this.actionsMenu.select(0);
        }else if(this.currentMenu === this.actionsMenu){ // En caso de estar en el menu de acciones
            this.actionsMenu.deselect();
            this.currentMenu = this.heroesMenu;
            this.heroesMenu.select(this.id);
        }
        
    }

    remapHeroes() { //Crea los botones de los aliados
        this.heroesMenu.remap(this.battleScene.heroes);
    }

    remapEnemies() { // Crea los botones de los enemigos
        this.enemiesMenu.remap(this.battleScene.enemies);
    }

    remapItems(){ // Crea los botones de los objetos
        this.itemsMenu.remap(this.battleScene.inventory);
    }

    onKeyInput(event) {
        const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];
        if (keysToPrevent.includes(event.code)) event.preventDefault();

        if (this.currentMenu) {
            if (event.code === "ArrowUp") this.currentMenu.moveSelectionUp();
            else if (event.code === "ArrowDown") this.currentMenu.moveSelectionDown();
            else if (event.code === "ArrowRight" || event.code === "Shift") { if(this.currentMenu !== this.heroesMenu) { this.currentMenu.back(); } }
            else if (event.code === "Space" || event.code === "ArrowLeft") this.currentMenu.confirm();
        }
    }

    cleanEvents() {
        this.events.off("PlayerSelect", this.onPlayerSelect, this);
        this.events.off("SelectEnemies", this.onSelectEnemies, this);
        this.events.off("Enemy", this.onEnemy, this);
        this.events.off("Item", this.onItem, this);
        this.events.off("Back", this.onBack, this);
    }
}

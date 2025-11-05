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
        this.heroesMenu = new HeroesMenu(240, 155, this, true);
        this.actionsMenu = new ActionsMenu(140, 155, this, false);
        this.enemiesMenu = new EnemiesMenu(40, 155, this, true);
        this.itemsMenu = new ItemsMenu(8, 155, this, false);

        this.currentMenu = this.actionsMenu;
        this.menus.add([this.heroesMenu, this.actionsMenu, this.enemiesMenu]);

        this.battleScene = this.scene.get("BattleScene");

        this.remapHeroes();
        this.remapEnemies();

        this.input.keyboard.on("keydown", this.onKeyInput, this);

        this.battleScene.events.on("PlayerSelect", this.onFirstPlayerSelect, this); // Para dejar el primer personaje de la lista al empezar cada turno
        this.events.on("PlayerSelect", this.onPlayerSelect, this);                  // Cuando se selecciona el personaje con el que actuar
        this.events.on("SelectEnemies", this.onSelectEnemies, this);
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

    onSelectEnemies() {
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    }

    onBack() {
        if(this.currentMenu === this.enemiesMenu){
            this.enemiesMenu.deselect();
            this.currentMenu = this.actionsMenu;
            this.actionsMenu.select(0);
        }
        else if(this.currentMenu === this.actionsMenu){
            this.actionsMenu.deselect();
            this.currentMenu = this.heroesMenu;
            this.heroesMenu.select(this.id);
        }
    }

    remapHeroes() {
        this.heroesMenu.remap(this.battleScene.heroes);
    }

    remapEnemies() {
        this.enemiesMenu.remap(this.battleScene.enemies);
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

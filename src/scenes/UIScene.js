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

        const g = this.add.graphics();

        const background = 0x1a1a1a;      // gris muy oscuro
        const border = 0xffffff;          // blanco para borde
        const innerHighlight = 0x2a2a2a;  // ligero contraste

        // --- PANEL PRINCIPAL (fondo grande) ---
        g.lineStyle(1, border, 1);  // borde más fino y blanco
        g.fillStyle(background, 1);
        g.fillRect(0, 170, 335, 100);
        g.strokeRect(0, 170, 335, 100);

        // --- SUTIL CAPA SUPERIOR (efecto elegante sin imágenes) ---
        g.fillStyle(innerHighlight, 0.25);
        g.fillRect(0, 170, 335, 40); // franja superior para relieve

        // --- LÍNEAS VERTICALES ---
        g.lineStyle(1, border, 0.7); // líneas verticales más finas y blancas

        // Línea 1
        g.beginPath();
        g.moveTo(105, 170);
        g.lineTo(105, 270);
        g.strokePath();

        // Línea 2
        g.beginPath();
        g.moveTo(205, 170);
        g.lineTo(205, 270);
        g.strokePath();



        this.menus = this.add.container();
        this.heroesMenu = new HeroesMenu(220, 180, this, true);
        this.actionsMenu = new ActionsMenu(145, 180, this, false);
        this.enemiesMenu = new EnemiesMenu(10, 180, this, true);
        this.itemsMenu = new ItemsMenu(10, 180, this, this.inventory);

        this.currentMenu = this.actionsMenu;
        this.menus.add([this.heroesMenu, this.actionsMenu, this.enemiesMenu, this.itemsMenu]);

        this.battleScene = this.scene.get("BattleScene");



        this.enemiesMarker = this.add.graphics();
        this.enemiesMarker.lineStyle(4, 0xffffff, 0.8); 
        
        


        this.remapHeroes();
        this.heroesMenu.select(0);
        this.actionsMenu.select(0);

        this.input.keyboard.on("keydown", this.onKeyInput, this);

        this.battleScene.events.on("PlayerSelect", this.onFirstPlayerSelect, this); // Para dejar el primer personaje de la lista al empezar cada turno
        //this.events.on("PlayerSelect", this.onPlayerSelect, this);                  // Cuando se selecciona el personaje con el que actuar
        this.events.on("Select", this.onSelect, this);                              // Cuando se escoje la accion que se quiere realizar
        this.events.on("Enemy", this.onEnemy, this);                                // Al escojer a que enemigo atacar
        this.events.on("Item", this.onItem, this);                                  // Al escojer que item usar
        this.events.on("Back", this.onBack, this);        
        this.battleScene.events.on("PlayerSelect", (index) => {
        this.heroesMenu.select(index);
        }, this);                        

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
        // Seleccion la accion en base al tipo de objeto usado
        switch(this.inventory.getItem(itemIndex).getType()){
            case('HealPot'): this.battleScene.receivePlayerSelection("heal", undefined, itemIndex); break;
            case('DmgPot'): this.battleScene.receivePlayerSelection("dmgPot", undefined, itemIndex); break;
            case('StrPot'): this.battleScene.receivePlayerSelection("strPot", undefined, itemIndex); break;
            case('DefPot'): this.battleScene.receivePlayerSelection("defPot", undefined, itemIndex); break;
        }
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
        const coords = {x: this.battleScene.enemies[index].x, y: this.battleScene.enemies[index].y}


        if (!coords) {
            this.enemiesMarker.clear();
            this.enemiesMarker.setVisible(false);
            return;
        }

        this.enemiesMarker.clear();
        this.enemiesMarker.lineStyle(4, 0xffffff, 0.8); 
       
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
        this.enemiesMarker.setVisible(true);
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

    onKeyInput(event) {
const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyB"];
if (keysToPrevent.includes(event.code)) event.preventDefault();

if (!this.currentMenu) return;

//Cambiar entre actions y enemies menus
switch(event.code) { 
    case "KeyB": 
    if (this.currentMenu === this.enemiesMenu || this.currentMenu === this.itemsMenu)
        {this.currentMenu?.deselect(); 
        this.currentMenu.clear();
        this.currentMenu = this.actionsMenu; 
        this.currentMenu.select(0);} 
        return; 
}

switch (event.code) {
    case "ArrowUp":
        this.currentMenu.moveSelectionUp();
        break;
    case "ArrowDown":
        this.currentMenu.moveSelectionDown();
        break;
    case "ArrowLeft":
        this.currentMenu.moveSelectionLeft();
    break;
    case "ArrowRight":
        this.currentMenu.moveSelectionRight();
        break;
    case "Space":
        this.currentMenu.confirm();
        break;
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

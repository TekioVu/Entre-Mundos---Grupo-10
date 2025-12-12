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
        this.itemId = undefined;
        this.itemUsed = false;
        this.inventory = this.registry.get('inventory');
        this.createInventory();

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


        this.battleScene = this.scene.get("BattleScene");

        this.menus = this.add.container();
        this.heroesMenu = new HeroesMenu(220, 180, this, true);
        this.actionsMenu = new ActionsMenu(145, 180, this, this.battleScene.heroes[0]);
        this.enemiesMenu = new EnemiesMenu(10, 180, this, true);
        this.itemsMenu = new ItemsMenu(10, 180, this, this.inventory);

        this.enemiesMenu.clear();

        this.currentMenu = this.actionsMenu;
        this.menus.add([this.heroesMenu, this.actionsMenu, this.enemiesMenu, this.itemsMenu]);

        this.battleScene = this.scene.get("BattleScene");



        this.enemiesMarker = this.add.graphics();
        this.enemiesMarker.lineStyle(4, 0xffffff, 0.8); 
        
        


        this.remapHeroes();
        this.heroesMenu.select(0);

        this.input.keyboard.on("keydown", this.onKeyInput, this);

        // --- Handlers en BattleScene ---
        this._onFirstPlayerSelect = this.onFirstPlayerSelect.bind(this);
        this.battleScene.events.on("PlayerSelect", this._onFirstPlayerSelect);

        // --- Handlers locales en esta escena ---
        this._onPlayerSelect = this.onPlayerSelect.bind(this);
        this.events.on("PlayerSelect", this._onPlayerSelect);        

        this.events.on("Select", this.onSelect, this);                              // Cuando se escoje la accion que se quiere realizar
        this.events.on("Enemy", this.onEnemy, this);                                // Al escojer a que enemigo atacar
        this.events.on("Item", this.onItem, this);                                  // Al escojer que item usar
        this.events.on("Back", this.onBack, this);      
        this._onPlayerSelectFromBattle = (index) => {
            this.heroesMenu.select(index);
            const hero = this.battleScene.heroes[this.heroesMenu.menuItemIndex];
            this.actionsMenu.setHero(hero);
            this.actionsMenu.refreshMenu();
            this.actionsMenu.select(0);
        };
        this.battleScene.events.on("PlayerSelect", this._onPlayerSelectFromBattle);

        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);

        this.battleScene.nextTurn();
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
        else if (this.currentMenu.getMenuItemIndex() === 2){// en caso de que se escoja "Hability"
            const hero = this.battleScene.heroes[this.heroesMenu.menuItemIndex];
            if (!hero) return;

            const target = this.battleScene.enemies[0];
            hero.checkSpecialAttackHeroes(target);

            this.actionsMenu.deselect();
        }
    }

    // Cuando se ha seleccionado un enemigo al que atacar
    onEnemy(enemyIndex) {
        this.enemiesMenu.clear();   
        this.actionsMenu.deselect();
        this.currentMenu = null;
        if(this.itemId){
            let type = this.inventory.getItem(this.itemId).getType();
        
            if(type === "AreaPot"){ // Comprueba si lo que quiere es usar un objeto en un enemigo
                this.battleScene.receivePlayerSelection("areaPot", enemyIndex, this.itemId);
                this.itemId = undefined;
            }
            else if(type === "DmgPot"){
                this.battleScene.receivePlayerSelection("dmgPot", enemyIndex, this.itemId);
                this.itemId = undefined;
            }
        }
        else{
            this.battleScene.receivePlayerSelection("attack", enemyIndex, undefined);
        }
    }

    // Cuando se ha seleccionado un item para usar (Sin terminar)
    onItem(itemIndex){
        this.itemsMenu.clear();
        this.enemiesMenu.clear();

        this.currentMenu = this.actionsMenu;
        this.actionsMenu.select(0);
        // Seleccion la accion en base al tipo de objeto usado
        switch(this.inventory.getItem(itemIndex).getType()){
            case('HealPot'): this.battleScene.receivePlayerSelection("heal", undefined, itemIndex); break;
            case('DmgPot'): { // Tiene que seleccionar el enemigo en el que usarla
                this.currentMenu = this.enemiesMenu; 
                this.remapEnemies();
                this.enemiesMenu.select(0); 
                this.itemId = itemIndex; 
                break;
            }
            case('AreaPot'):{
                this.currentMenu = this.enemiesMenu; 
                this.remapEnemies();
                this.enemiesMenu.select(0); 
                this.itemId = itemIndex; 
                break;
            }
            case('CatPot'): this.battleScene.receivePlayerSelection("catPot", undefined, itemIndex); break;
            case('StrPot'): this.battleScene.receivePlayerSelection("strPot", undefined, itemIndex); break;
            case('DefPot'): this.battleScene.receivePlayerSelection("defPot", undefined, itemIndex); break;
        }
    }

    // Retroceder
    onBack() {
        if(this.currentMenu === this.enemiesMenu){ // En caso de estar en el menu de enemigos
            this.enemiesMenu.clear()
            this.enemiesMenu.deselect();
            this.currentMenu = this.actionsMenu;
            this.actionsMenu.select(0);
            this.itemId = undefined;
        }else if(this.currentMenu === this.itemsMenu){ // En caso de estar en el menu de items
            this.itemsMenu.clear();
            this.itemsMenu.deselect();
            this.currentMenu = this.actionsMenu;
            this.actionsMenu.select(1);
        }
        
    }

    onFirstPlayerSelect() {
        const firstHero = this.battleScene.heroes[0];
    if (firstHero) {
        this.actionsMenu.setHero(firstHero);
        this.enemiesMenu.clear();

        this.currentMenu = this.actionsMenu;
        this.actionsMenu.select(0);
    }
        this.heroesMenu.select(0);
    }

    // Al escoger el heroe a usar
    onPlayerSelect(){
        const hero = this.battleScene.heroes[this.heroesMenu.menuItemIndex];
        this.actionsMenu.setHero(hero);
        this.actionsMenu.refreshMenu();
        this.enemiesMenu.clear();

        this.currentMenu = this.actionsMenu;
        this.actionsMenu.select(0);

    }

    // Recoloca el tamaño y posicion del marcador dependiendo del enemigo
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
       
        let width = 50;
        let height = 50;
        let mitadx = 25;
        let mitady = 25;
        const cornerLength = 10;

        //Ajustes de cuadro
        if (this.battleScene.enemies[index].type === 'Goblin' || this.battleScene.enemies[index].type === 'Mushroom') {
            mitady = mitady-10;
        }
        else if (this.battleScene.enemies[index].type === 'Dragon') {
            width = 120;
            height = 80;
            mitady = mitady-15;
            mitadx = mitadx+25;
        }
        else if (this.battleScene.enemies[index].type === 'Flying Eye'){
            mitadx = mitadx - 5;
        }
        else if (this.battleScene.enemies[index].type === 'Pharaoh'){
            height = 80;
            mitady = mitady +15;
        }
        else if (this.battleScene.enemies[index].type === 'Scarab'){
            height = 30;
            mitady = mitady -35;
        }
        else if (this.battleScene.enemies[index].type === 'Medusa'){
            height = 70;
            mitady = mitady+5;
            mitadx = mitadx+20;
            width = 70;
        }
        else if (this.battleScene.enemies[index].type === 'Jester'){
            mitady = mitady - 3;
        }
        else if (this.battleScene.enemies[index].type === 'King'){
            height = 60;
            width = 40;
            mitadx = mitadx-7;
            mitady = mitady;
        }
        else if (this.battleScene.enemies[index].type === 'Scared Wizard'){
            height = 60;
            mitady = mitady -10;
        }
        else if (this.battleScene.enemies[index].type === 'Sad Wizard' || this.battleScene.enemies[index].type === 'Angry Wizard'){
            height = 60;
            mitady = mitady +5;
        }


        //Cuadro que enmarca al enemigo seleccionado
        this.enemiesMarker.beginPath();
        this.enemiesMarker.moveTo(coords.x-mitadx, coords.y-mitady);
        this.enemiesMarker.lineTo(coords.x + cornerLength-mitadx, coords.y-mitady);
        this.enemiesMarker.moveTo(coords.x-mitadx, coords.y-mitady);
        this.enemiesMarker.lineTo(coords.x-mitadx, coords.y + cornerLength-mitady);

        this.enemiesMarker.moveTo(coords.x-mitadx + width, coords.y-mitady);
        this.enemiesMarker.lineTo(coords.x + width - cornerLength-mitadx, coords.y-mitady);
        this.enemiesMarker.moveTo(coords.x + width-mitadx, coords.y-mitady);
        this.enemiesMarker.lineTo(coords.x + width-mitadx, coords.y + cornerLength-mitady);

        this.enemiesMarker.moveTo(coords.x-mitadx, coords.y + height-mitady);
        this.enemiesMarker.lineTo(coords.x + cornerLength-mitadx, coords.y + height-mitady);
        this.enemiesMarker.moveTo(coords.x-mitadx, coords.y + height-mitady);
        this.enemiesMarker.lineTo(coords.x-mitadx, coords.y + height - cornerLength-mitady);

        this.enemiesMarker.moveTo(coords.x + width-mitadx, coords.y + height-mitady);
        this.enemiesMarker.lineTo(coords.x + width - cornerLength-mitadx, coords.y + height-mitady);
        this.enemiesMarker.moveTo(coords.x + width-mitadx, coords.y + height-mitady);
        this.enemiesMarker.lineTo(coords.x + width-mitadx, coords.y + height - cornerLength-mitady);

        this.enemiesMarker.strokePath();
        this.enemiesMarker.setVisible(true);
    }
    
    // == Remaps ==
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
        


        switch(event.code) { //Cambiar entre actions y enemies menus
            case "KeyB": 
            if (this.currentMenu === this.enemiesMenu || this.currentMenu === this.itemsMenu){
                {this.currentMenu?.deselect(); 
                this.currentMenu.clear();
                this.currentMenu = this.actionsMenu; 
                this.currentMenu.select(0);} 
                return; 
            }
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

        if (this.currentMenu === this.actionsMenu) {
            if (this.actionsMenu.getMenuItemIndex() === 2) {
                const hero = this.battleScene.heroes[this.heroesMenu.menuItemIndex];

                if (hero) {
                    let msg = "";

                    switch (hero.type) {
                        case "Dragon":
                            msg = "Dragon deals area damage to all enemies.";
                            break;

                        case "Cacodaemon":
                            msg = "Cacodaemon deals damage to five random enemies";
                            break;

                        case "Medusa":
                            msg = "Medusa petrifies all enemies during the next two turns.";
                            break;

                        case "King":
                            msg = "King invokes one Jester in each empty position.";
                            break;

                        default:
                            msg = "Wrong character";
                            break;
                    }
                    this.message.showPermanentMessage(msg);
                }
            }
            else this.message.hideMessage();
        }

        if (this.currentMenu === this.itemsMenu) {
            const index = this.itemsMenu.getMenuItemIndex();
            const item = this.localInventory[index];

            if (item) {
                let msg = "";

                switch (item.getType()) {
                    case "HealPot":
                        msg = "Heals a hero " + item.hp + "hp.";
                        break;
                    case "DmgPot":
                        msg = "Deals " + item.hp + " damage to one enemy.";
                        break;
                    case "AreaPot":
                        msg = "Deals " + item.hp + " damage to a line of enemies.";
                        break;
                    case "CatPot":
                        msg = "Deals " + item.hp + " damage to all enemies.";
                        break;
                    case "StrPot":
                        msg = "Increases attack temporarily (+" + item.str + ").";
                        break;
                    case "DefPot":
                        msg = "Increases defense temporarily (+" + item.def + ").";
                        break;
                    default:
                        msg = "Unknown item.";
                        break;
                }

                this.message.showPermanentMessage(msg);
            }
        } else {
            this.message.hideMessage();
        }

        this.updateEnemiesMarker();
    }

    cleanEvents() {
         // De BattleScene
        this.battleScene.events.off("PlayerSelect", this._onFirstPlayerSelect);
        this.battleScene.events.off("PlayerSelect", this._onPlayerSelectFromBattle);

        this.events.off("PlayerSelect", this.onPlayerSelect, this);
        this.events.off("SelectEnemies", this.onSelectEnemies, this);
        this.events.off("Select", this.onSelect, this);                           
        this.events.off("Enemy", this.onEnemy, this);
        this.events.off("Item", this.onItem, this);
        this.events.off("Back", this.onBack, this);
    }

    createInventory(){
        this.localInventory = [];
        for(let i = 0; i < this.inventory.size(); i++){
            if(this.inventory.getNum(i) > 0){
                this.localInventory.push(this.inventory.getItem(i));
            }
        }
        console.log('tamaño inventario: ' + this.localInventory.length);
    }
}


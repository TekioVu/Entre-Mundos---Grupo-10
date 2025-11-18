import CharactersMenu from "../ui/CharactersMenu.js";
import PositionsMenu from "../ui/PositionsMenu.js";
import Message from "../ui/Message.js";


export default class CharacterSelectionScene extends Phaser.Scene {
    constructor() {
        super("CharacterSelectionScene");
    }

    create() {
        this.add.text(160, 140, "Characters selection. Press ENTER to start the battle.", {
            font: "11px Arial",
            fill: "#ffffffff"
        }).setOrigin(0.5);

        this.id = 0;
        
                this.graphics = this.add.graphics();
                this.graphics.lineStyle(1, 0xffffff);

                this.graphics.fillStyle(0x031f4c, 1);
                this.graphics.fillRect(1, 150, 159.25, 100);

                this.graphics.fillStyle(0x052b70, 1);
                this.graphics.fillRect(159.25, 150, 159.25, 100);

                this.graphics.strokeRect(1, 150, 318.5, 100);

                this.menus = this.add.container();
                this.positionsMenu = new PositionsMenu(40, 160, this);
                this.charactersMenu = new CharactersMenu(170, 160, this);

                this.currentMenu = this.charactersMenu;

                this.menus.add([this.positionsMenu, this.charactersMenu]);

                 
                this.positionsMenu.itemsPerRow = 2;
                this.positionsMenu.columnSpacing = 70;
                this.positions = ["Vang1", "Ret1", "Vang2", "Ret2", "Vang3", "Ret3"]; 
                
                this.positionsMenu.remap(this.positions);

                const battleScene = this.scene.get("BattleScene");
                this.charactersMenu.itemsPerRow = 5;
                this.charactersMenu.columnSpacing = 30;
                this.availableHeroes = battleScene.availableHeroes; 
                this.placedHeroes = new Array(this.positionsMenu.menuItems.length).fill(null);
                this.positionsOccupied = new Array(this.positionsMenu.menuItems.length).fill(false);
                this.heroSprites = new Array(this.positionsMenu.menuItems.length).fill(null);


                this.charactersMenu.remap(this.availableHeroes);
                this.selectedHero = null;

                this.currentMenu.select(0)

                this.positionMarker = this.add.circle(0, 0, 10, 0xff0000); 
                this.positionMarker.setVisible(false);

                this.events.on("PositionSelect", this.onSelectPosition, this);
                this.events.on("PlayerSelect", this.onSelectPlayer, this);


                this.message = new Message(this, this.events);
                this.add.existing(this.message);

                this.input.keyboard.on("keydown", this.onKeyInput, this);



                this.input.keyboard.on("keydown-ENTER", () => {

                    const hasHeroes = this.placedHeroes.some(hero => hero !== null);

                    if (!hasHeroes) {
                        this.events.emit("Message", "Select at least one character.");
                    }
                    else{this.scene.stop("CharacterSelectionScene");

                    const validHeroes = this.placedHeroes.filter(h => h !== null);
                    this.events.emit("selectionComplete", validHeroes);
                    this.scene.launch("UIScene");}
                });

            }
                
        update(){
            if (this.availableHeroes.length===0)
            {
                this.scene.stop("CharacterSelectionScene");
                const validHeroes = this.placedHeroes.filter(h => h !== null);
                this.events.emit("selectionComplete", validHeroes);
                this.scene.launch("UIScene");
            }
        }
        

        onKeyInput(event) {
        const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Space"];
        if (keysToPrevent.includes(event.code)) event.preventDefault();

        if (!this.currentMenu) return;

        const menu = this.currentMenu;
        const totalItems = menu.menuItems.length;
        const perRow = menu.itemsPerRow || 1;

        if (event.code === "ArrowLeft") {
            if (menu === this.charactersMenu && menu.menuItemIndex % perRow === 0) {
                if (!this.selectedHero) menu.confirm();
                this.currentMenu = this.positionsMenu;
                this.currentMenu.select(this.positionsMenu.menuItemIndex);
            } else {
                menu.moveSelectionUp();
            }
        } 
        else if (event.code === "ArrowRight") {
            if (menu === this.positionsMenu&& menu.menuItemIndex % perRow === 1) {
                this.positionsMenu.deselect();
                this.currentMenu = this.charactersMenu;
                this.currentMenu.select(this.charactersMenu.menuItemIndex);
            } else {
                const isLastInRow = (menu.menuItemIndex % perRow) === perRow - 1 || menu.menuItemIndex === totalItems - 1;
                if (!isLastInRow) {
                    menu.moveSelectionDown();
                }
            }
        } 

        else if (event.code === "ArrowUp") {
            menu.menuItems[menu.menuItemIndex].deselect();
            let newIndex = menu.menuItemIndex - perRow;
            if (newIndex < 0) newIndex = menu.menuItemIndex; 
            menu.select(newIndex);
        } 
        else if (event.code === "ArrowDown") {
            menu.menuItems[menu.menuItemIndex].deselect();
            let newIndex = menu.menuItemIndex + perRow;
            if (newIndex >= totalItems) newIndex = menu.menuItemIndex; 
            menu.select(newIndex);
        } 
        else if (event.code === "Space") {
            menu.confirm();
        }

        this.updatePositionMarker();
    }

    updatePositionMarker() {
    if (this.currentMenu !== this.positionsMenu) return;

    const markerPositions = [
        { x: 200, y: 50 } , 
        { x: 250, y: 50 }, 
        { x: 220, y: 75 }, 
        { x: 270, y: 75 }, 
        { x: 240, y: 100 }, 
        { x: 290, y: 100 },
    ];

    const index = this.positionsMenu.menuItemIndex; 
    const coords = markerPositions[index];

    this.positionMarker.setPosition(coords.x, coords.y);
    this.positionMarker.setVisible(true);
}

onSelectPlayer(){

        const hero = this.charactersMenu.menuItems[this.charactersMenu.menuItemIndex].unit;


        this.selectedHero = hero;
        this.positionsMenu.select(0);
        this.currentMenu = this.positionsMenu;
    }

    onSelectPosition() {
        const positionKey = this.positionsMenu.menuItemIndex;
            const hero = this.selectedHero;

            const positionCoords = [
                { x: 200, y: 50 } , 
                { x: 250, y: 50 }, 
                { x: 220, y: 75 }, 
                { x: 270, y: 75 }, 
                { x: 240, y: 100 }, 
                { x: 290, y: 100 },
            ];

            const coords = positionCoords[positionKey];


            if (this.positionsOccupied[positionKey]) {
                const previousHero = this.placedHeroes[positionKey];
                if (previousHero) {
                    this.availableHeroes.push(previousHero);
                    this.scene.get("BattleScene").events.emit("removeHero", positionKey)
                    this.placedHeroes[positionKey] = null;
                    this.positionsOccupied[positionKey] = false;
                }
            }
            
            this.scene.get("BattleScene").events.emit("heroesSelected", {
                texture: hero.texture,
                name: hero.name,
                id: hero.id,
                hp: hero.hp,
                atk: hero.atk,
                def: hero.def,
                x: coords.x,
                y: coords.y,
                positionKey: positionKey
            });

            this.placedHeroes[positionKey] = hero;
            this.positionsOccupied[positionKey] = true;

            this.availableHeroes = this.availableHeroes.filter(h => h !== hero);
            this.charactersMenu.remap(this.availableHeroes);

            this.selectedHero = null;
            this.charactersMenu.select(0);
            this.currentMenu = this.charactersMenu;
            this.positionMarker.setVisible(false);
        }

        cleanEvents() {

            // Eventos propios
            this.events.off("PositionSelect", this.onSelectPosition, this);
            this.events.off("PlayerSelect", this.onSelectPlayer, this);

            // Eventos del teclado
            if (this.input && this.input.keyboard) {
                this.input.keyboard.off("keydown", this.onKeyInput, this);
                this.input.keyboard.off("keydown-ENTER");
            }

            // Limpieza del marcador visual si sigue existiendo
            if (this.positionMarker) this.positionMarker.destroy();
        }

}
import CharactersMenu from "../ui/CharactersMenu.js";
import PositionsMenu from "../ui/PositionsMenu.js";


export default class CharacterSelectionScene extends Phaser.Scene {
    constructor() {
        super("CharacterSelectionScene");
    }

    create() {
        this.add.text(160, 20, "Selección de personajes", {
            font: "20px Arial",
            fill: "#ffffffff"
        }).setOrigin(0.5);

         this.add.text(160, 40, "Presiona ENTER para iniciar la batalla", {
            font: "10px Arial",
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

                 
                this.positionsMenu.itemsPerColumn = 3;
                this.positionsMenu.columnSpacing = 70;
                const positions = ["Pos1", "Pos2", "Pos3", "Pos4", "Pos5", "Pos6"]; 
                
                this.positionsMenu.remap(positions);

                const battleScene = this.scene.get("BattleScene");
                this.charactersMenu.itemsPerColumn = 3;
                this.charactersMenu.columnSpacing = 70;
                const heroes = battleScene.heroes; 
                
                this.charactersMenu.remap(heroes);

                this.currentMenu.select(0)

                this.positionMarker = this.add.circle(0, 0, 10, 0xff0000); 
                this.positionMarker.setVisible(false);

                this.events.on("PositionSelect", this.onSelectPosition, this);
                this.events.on("PlayerSelect", this.onSelectPlayer, this);


                this.input.keyboard.on("keydown", this.onKeyInput, this);



        this.input.keyboard.once("keydown-ENTER", () => {
            this.scene.stop ("CharacterSelectionScene");
            this.scene.launch("UIScene");
        });
    }

    onKeyInput(event) {
    const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Space"];
    if (keysToPrevent.includes(event.code)) event.preventDefault();

    if (!this.currentMenu) return;

    const menu = this.currentMenu;
    const totalItems = menu.menuItems.length;
    const perColumn = menu.itemsPerColumn;

    if (event.code === "ArrowUp") {
        menu.moveSelectionUp();
    } else if (event.code === "ArrowDown") {
        menu.moveSelectionDown();
    } 
    else if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        menu.menuItems[menu.menuItemIndex].deselect();
        let newIndex = menu.menuItemIndex;

        if (event.code === "ArrowLeft") {
            newIndex -= perColumn;
            if (newIndex < 0) {
                if (menu === this.charactersMenu) {
                    this.currentMenu = this.positionsMenu;
                    newIndex = Math.min(this.positionsMenu.menuItemIndex, this.positionsMenu.menuItems.length - 1);
                } else {
                    newIndex = menu.menuItemIndex % perColumn;
                }
            }
        } else if (event.code === "ArrowRight") {
            newIndex += perColumn;
            if (newIndex >= totalItems) {
                if (menu === this.positionsMenu) {
                    this.currentMenu = this.charactersMenu;
                    newIndex = Math.min(this.charactersMenu.menuItemIndex, this.charactersMenu.menuItems.length - 1);
                } else {
                    const lastColumnStart = Math.floor((totalItems - 1) / perColumn) * perColumn;
                    newIndex = Math.min(lastColumnStart + (menu.menuItemIndex % perColumn), totalItems - 1);
                }
            }
        }

        this.currentMenu.select(newIndex);
    }
    else if (event.code === "Enter" || event.code === "Space") {
        this.currentMenu.confirm();
    }

    this.updatePositionMarker();
}



    updatePositionMarker() {
    if (this.currentMenu !== this.positionsMenu) return;

    const markerPositions = [
        { x: 300, y: 30 }, 
        { x: 300, y: 80 }, 
        { x: 300, y: 130 }, 
        { x: 250, y: 130 }, 
        { x: 250, y: 30 }  
    ];

    const index = this.positionsMenu.menuItemIndex; 
    const coords = markerPositions[index];

    this.positionMarker.setPosition(coords.x, coords.y);
    this.positionMarker.setVisible(true);
}

onSelectPlayer(){
        this.positionsMenu.select(0);
        this.currentMenu = this.positionsMenu;
    }

onSelectPosition(){
        this.charactersMenu.select(0);
        this.currentMenu = this.charactersMenu;
    }
}
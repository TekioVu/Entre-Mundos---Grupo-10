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

                 
                this.positionsMenu.itemsPerRow = 2;
                this.positionsMenu.columnSpacing = 70;
                this.positions = ["Vang1", "Ret1", "Vang2", "Ret2", "Vang3", "Ret3"]; 
                
                this.positionsMenu.remap(this.positions);

                const battleScene = this.scene.get("BattleScene");
                this.charactersMenu.itemsPerRow = 5;
                this.charactersMenu.columnSpacing = 30;
                this.availableHeroes = battleScene.availableHeroes; 
                this.placedHeroes = new Array(this.positionsMenu.menuItems.length).fill(null);
                this.charactersMenu.remap(this.availableHeroes);
                this.selectedHero = null;

                this.currentMenu.select(0)

                this.positionMarker = this.add.circle(0, 0, 10, 0xff0000); 
                this.positionMarker.setVisible(false);

                this.events.on("PositionSelect", this.onSelectPosition, this);
                this.events.on("PlayerSelect", this.onSelectPlayer, this);


                this.input.keyboard.on("keydown", this.onKeyInput, this);



        this.input.keyboard.once("keydown-ENTER", () => {
            this.scene.stop ("CharacterSelectionScene");
            this.events.emit('selectionComplete', this.placedHeroes);
            this.scene.launch("UIScene");
        });
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
    else if (event.code === "Enter" || event.code === "Space") {
        menu.confirm();
    }

    this.updatePositionMarker();
}





    updatePositionMarker() {
    if (this.currentMenu !== this.positionsMenu) return;

    const markerPositions = [
        { x: 250, y: 30 } , 
        { x: 300, y: 30 }, 
        { x: 250, y: 80 }, 
        { x: 300, y: 80 }, 
        { x: 250, y: 130 }, 
        { x: 300, y: 130 },
    ];

    const index = this.positionsMenu.menuItemIndex; 
    const coords = markerPositions[index];

    this.positionMarker.setPosition(coords.x, coords.y);
    this.positionMarker.setVisible(true);
}

onSelectPlayer(){

        const hero = this.charactersMenu.menuItems[this.charactersMenu.menuItemIndex].unit;

            console.log("Hero seleccionado:", hero);

        this.selectedHero = hero;
        this.positionsMenu.select(0);
        this.currentMenu = this.positionsMenu;
    }

onSelectPosition() {
    const positionKey = this.positionsMenu.menuItems[this.positionsMenu.menuItemIndex].unit; // "Vang1", etc.
    const hero = this.selectedHero;

    const positionCoords = {
        "Vang1": { x: 250, y: 30 },
        "Ret1":  { x: 300, y: 30 },
        "Vang2": { x: 250, y: 80 },
        "Ret2":  { x: 300, y: 80 },
        "Vang3": { x: 250, y: 130 },
        "Ret3":  { x: 300, y: 130 }
    };

    const coords = positionCoords[positionKey];

    this.scene.get("BattleScene").events.emit("heroesSelected", {
        texture: hero.texture,
        name: hero.name,
        id: hero.id,
        hp: hero.hp,
        atk: hero.atk,
        x: coords.x,
        y: coords.y
    });

    this.placedHeroes[positionKey] = hero;

    this.selectedHero = null;
    this.charactersMenu.select(0);
    this.currentMenu = this.charactersMenu;
    this.positionMarker.setVisible(false); // opcional: ocultar marcador
}
}
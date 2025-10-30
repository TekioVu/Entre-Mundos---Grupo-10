import HeroesMenu from "../ui/HeroesMenu.js";
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

         this.add.text(160, 40, "Presiona ESPACIO para iniciar la batalla", {
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
                this.heroesMenu = new HeroesMenu(180, 155, this);
                this.positionsMenu = new PositionsMenu(10, 155, this);

                this.menus.add([this.positionsMenu, this.heroesMenu]);

                this.positionsMenu.addMenuItem("Pos1");
                this.positionsMenu.addMenuItem("Pos2");
                this.positionsMenu.addMenuItem("Pos3");
                this.positionsMenu.addMenuItem("Pos4");
                this.positionsMenu.addMenuItem("Pos6");

 
                this.heroesMenu.addMenuItem("A1");
                this.heroesMenu.addMenuItem("A2");
                this.heroesMenu.addMenuItem("A3");

                this.currentMenu = this.heroesMenu;
                this.currentMenu.select(0)

                this.positionMarker = this.add.circle(0, 0, 10, 0xff0000); 
                this.positionMarker.setVisible(false);

                this.input.keyboard.on("keydown", this.onKeyInput, this);



        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("UIScene");
        });
    }

    onKeyInput(event) {
        const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"];
        if (keysToPrevent.includes(event.code)) event.preventDefault();

        if (this.currentMenu) {
            if (event.code === "ArrowUp") this.currentMenu.moveSelectionUp();
            else if (event.code === "ArrowDown") this.currentMenu.moveSelectionDown();
            else if (event.code === "ArrowLeft") {

                this.currentMenu.deselect();
                this.currentMenu = this.positionsMenu;
                this.positionsMenu.select(0);
            } 
            else if (event.code === "ArrowRight") {
                this.currentMenu.deselect();
                this.currentMenu = this.heroesMenu;
                this.heroesMenu.select(0);
            }
            else if (event.code === "Enter" || event.code === "Space") {
                this.currentMenu.confirm();
            }
            this.updatePositionMarker();

        }
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
}
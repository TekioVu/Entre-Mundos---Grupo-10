import CharactersMenu from "../ui/CharactersMenu.js";
import PositionsMenu from "../ui/PositionsMenu.js";
import Message from "../ui/Message.js";


export default class CharacterSelectionScene extends Phaser.Scene {
    constructor() {
        super("CharacterSelectionScene");
        console.log("5");
    }

    create() {
        this.add.text(160, 140, "Characters selection. Press ENTER to start the battle.", {
            font: "Arial",
            fontSize: 12,

        }).setOrigin(0.5);

        this.add.text(10, 10, "[ESC] Return to Menu", {
            font: "Arial",
            fontSize: 11,
            fill: "#ffffffff",

        }).setOrigin(0);

        this.id = 0;
        
                this.graphics = this.add.graphics();
                // --- COLORES ELEGANTES ---
                const background = 0x1a1a1a;      // gris muy oscuro
                const border = 0xffffff;          // blanco para borde
                const innerHighlight = 0x2a2a2a;  // ligero contraste

                // --- PANEL PRINCIPAL (dos mitades) ---
                this.graphics.lineStyle(1, border, 1); // borde más fino
                this.graphics.fillStyle(background, 1);
                this.graphics.fillRect(1, 150, 318.5, 100); // fondo general
                this.graphics.strokeRect(1, 150, 318.5, 100);

                // --- SUTIL CAPA SUPERIOR (relieve elegante) ---
                this.graphics.fillStyle(innerHighlight, 0.25);
                this.graphics.fillRect(1, 150, 318.5, 25); // franja superior

                // --- LÍNEA DIVISORIA ENTRE MITADES ---
                this.graphics.lineStyle(1, border, 0.7); // línea más fina
                this.graphics.beginPath();
                this.graphics.moveTo(159.25, 150);
                this.graphics.lineTo(159.25, 250);
                this.graphics.strokePath();



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

                // this.positionMarker = this.add.circle(0, 0, 10, 0xff0000); 
                // this.positionMarker.setVisible(false);

                this.positionMarker = this.add.graphics();
                this.positionMarker.lineStyle(4, 0xffffff, 0.8); 
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

                this.input.keyboard.on("keydown-ESC", () => {
                        this.cleanEvents();
                        this.scene.get("BattleScene").cleanEvents();
                        this.scene.stop("BattleScene");
                        this.scene.stop("CharacterSelectionScene");
                        this.scene.switch("MenuScene");
                });

                // Colocar a Timmy en Vang2 automáticamente
                const timmy = {
                    texture: 'timmy',
                    name: 'Timmy',
                    hp: 100,
                    atk: 20,
                    def: 5
                };

                const vang2Index = this.positions.indexOf("Vang2");
                this.placedHeroes[vang2Index] = timmy;
                this.positionsOccupied[vang2Index] = true;

                // Emitimos directamente al BattleScene para crear el sprite
                const positionCoords = [
                    { x: 200, y: 50 },
                    { x: 250, y: 50 },
                    { x: 220, y: 75 }, // Vang2
                    { x: 270, y: 75 },
                    { x: 240, y: 100 },
                    { x: 290, y: 100 },
                ];

                this.scene.get("BattleScene").events.emit("heroesSelected", {
                    texture: timmy.texture,
                    name: timmy.name,
                    id: timmy.id || 0,
                    hp: timmy.hp,
                    atk: timmy.atk,
                    def: timmy.def,
                    x: positionCoords[vang2Index].x,
                    y: positionCoords[vang2Index].y,
                    positionKey: vang2Index
                });


            }
                
        update(){
            if (this.availableHeroes.length===0)
            {
                this.add.text(240, 195, "You have no more available\n  heroes left. Press ENTER\n         to start the battle.", {
                    font: "Arial",
                    fontSize: 11,
                    fill: "#ffffffff",
                    stroke: "#1b1b1bff",
                    strokeThickness: 2,
                    shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 2, fill: true }
                }).setOrigin(0.5);

            }
        }
        
        // Handler de inputs
        onKeyInput(event) {
            const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Space", "Esc"];
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
                //Si se intenta poner un personaje en la posición de Timmy no hacerlo.
                if (this.currentMenu === this.positionsMenu) {
                    const positionName = this.positions[this.positionsMenu.menuItemIndex];
                    if (positionName === "Vang2") {
                        return;
                    }
                }
                menu.confirm();
            }
            //else if (event.code === "Escape"){
            //     this.scene.switch("MenuScene");
            // }

        this.updatePositionMarker();
    }


    // Recoloca la marca y el tamaño al enemigo correspondiente
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
    const height = 50;
    const width = 50;
    const cornerLength = 10;
    this.positionMarker.clear();
    this.positionMarker.lineStyle(4, 0xffffff, 0.8); 

    this.positionMarker.beginPath();
        this.positionMarker.moveTo(coords.x-25, coords.y-25);
        this.positionMarker.lineTo(coords.x + cornerLength-25, coords.y-25);
        this.positionMarker.moveTo(coords.x-25, coords.y-25);
        this.positionMarker.lineTo(coords.x-25, coords.y + cornerLength-25);

        this.positionMarker.moveTo(coords.x-25 + width, coords.y-25);
        this.positionMarker.lineTo(coords.x + width - cornerLength-25, coords.y-25);
        this.positionMarker.moveTo(coords.x + width-25, coords.y-25);
        this.positionMarker.lineTo(coords.x + width-25, coords.y + cornerLength-25);

        this.positionMarker.moveTo(coords.x-25, coords.y + height-25);
        this.positionMarker.lineTo(coords.x + cornerLength-25, coords.y + height-25);
        this.positionMarker.moveTo(coords.x-25, coords.y + height-25);
        this.positionMarker.lineTo(coords.x-25, coords.y + height - cornerLength-25);

        this.positionMarker.moveTo(coords.x + width-25, coords.y + height-25);
        this.positionMarker.lineTo(coords.x + width - cornerLength-25, coords.y + height-25);
        this.positionMarker.moveTo(coords.x + width-25, coords.y + height-25);
        this.positionMarker.lineTo(coords.x + width-25, coords.y + height - cornerLength-25);

        this.positionMarker.strokePath();
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
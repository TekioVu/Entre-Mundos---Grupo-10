import Item from "../characters/Item.js";
import MenuItem from "./MenuItem.js";

export default class Menu extends Phaser.GameObjects.Container {
    constructor(x, y, scene, itemsPerRow = 2, itemsPerColumn = 3, columnSpacing = 20, icons = false) {
        super(scene, x, y);
        this.scene = scene;
        this.menuItems = [];
        this.menuItemIndex = 0;

        this.itemsPerColumn = itemsPerColumn;
        this.itemsPerRow = itemsPerRow;
        this.columnSpacing = columnSpacing;

        this.icons = icons;
    }

    addMenuItem(unit) {
        let Height = 28;
        const index = this.menuItems.length;
        this.columnSpacing= 30;
        let displayData;


        if (this.icons && unit && unit.textureKey) {
            displayData = { type: "icon", key: unit.textureKey };
            this.itemsPerColumn = 2;
            this.itemsPerRow = 3;
        } else if (typeof unit === "string") {
            displayData = { type: "text", key: unit };
            this.itemsPerRow = 1;
            Height = 20;

        }
        const row = Math.floor(index / this.itemsPerRow);
        const col = index % this.itemsPerRow;

        let xOffset;
        let yOffset
        if(unit === 'VACIO'){   // Exclusivo en caso de necesitar indicar que esta vacio el inventario
            xOffset = col * this.columnSpacing + 40;
            yOffset = row * Height + 25;
        }
        else{
            xOffset = col * this.columnSpacing + 10;
            yOffset = row * Height + 10;
        }

        

        const menuItem = new MenuItem(xOffset, yOffset, displayData, this.scene);
        if(unit.name){
            menuItem.setScale(0.725);
        }
        menuItem.unit = unit;
        this.menuItems.push(menuItem);
        this.add(menuItem);
    }

    getMenuItemIndex(){
        return this.menuItemIndex;
    }

    getMenuItemTexture(menuItemIndex){
        return this.menuItems[menuItemIndex].getDataKey();
    }

    moveSelectionUp() {
        if (!this.menuItems.length) return;
        this.menuItems[this.menuItemIndex].deselect();

        const col = this.menuItemIndex % this.itemsPerRow;
        let row = Math.floor(this.menuItemIndex / this.itemsPerRow);
        row = (row - 1 + Math.ceil(this.menuItems.length / this.itemsPerRow)) % Math.ceil(this.menuItems.length / this.itemsPerRow);

        let newIndex = row * this.itemsPerRow + col;
        if (newIndex >= this.menuItems.length) {
            // Ajuste para filas incompletas
            newIndex = this.menuItems.length - 1;
        }

        this.menuItemIndex = newIndex;
        this.menuItems[this.menuItemIndex].select();

    }

    moveSelectionDown() {
        if (!this.menuItems.length) return;
        this.menuItems[this.menuItemIndex].deselect();

        const col = this.menuItemIndex % this.itemsPerRow;
        let row = Math.floor(this.menuItemIndex / this.itemsPerRow);
        row = (row + 1) % Math.ceil(this.menuItems.length / this.itemsPerRow);

        let newIndex = row * this.itemsPerRow + col;
        if (newIndex >= this.menuItems.length) {
            // Ajuste para filas incompletas
            newIndex = row * this.itemsPerRow + (this.menuItems.length - 1) % this.itemsPerRow;
        }

        this.menuItemIndex = newIndex;
        this.menuItems[this.menuItemIndex].select();

    }

    moveSelectionLeft() {
        if (!this.menuItems.length) return;

        const row = Math.floor(this.menuItemIndex / this.itemsPerRow);
        let col = this.menuItemIndex % this.itemsPerRow;

        if (col === 0) {
            if (this.onLeftEdge) this.onLeftEdge(); 
            return;
        }

        this.menuItems[this.menuItemIndex].deselect();

        col = col - 1;
        let newIndex = row * this.itemsPerRow + col;
        this.menuItemIndex = newIndex;
        this.menuItems[this.menuItemIndex].select();
    }


    moveSelectionRight() {
        if (!this.menuItems.length) return;
        this.menuItems[this.menuItemIndex].deselect();


        const row = Math.floor(this.menuItemIndex / this.itemsPerRow);
        let col = this.menuItemIndex % this.itemsPerRow;
        col = (col + 1) % this.itemsPerRow;

        let newIndex = row * this.itemsPerRow + col;
        if (newIndex >= this.menuItems.length) {
            // Ajuste si la última fila no está completa
            newIndex = row * this.itemsPerRow + (this.menuItems.length - 1) % this.itemsPerRow;
        }

        this.menuItemIndex = newIndex;
        this.menuItems[this.menuItemIndex].select();


    }


    select(index = 0) {
        if (!this.menuItems.length) return;
        this.menuItems[this.menuItemIndex]?.deselect?.();
        this.menuItemIndex = index;
        this.menuItems[this.menuItemIndex]?.select?.();
    }

    deselect() {
        if (!this.menuItems.length) return;
        this.menuItems[this.menuItemIndex]?.deselect?.();
        this.menuItemIndex = 0;
    }

    clear() {
        this.menuItems.forEach(item => item.destroy());
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    }

    remap(units) {
        this.clear();
        units.forEach(unit => this.addMenuItem(unit));
        if(units.length <= 0){
            this.addMenuItem('VACIO');
        }
    }
}

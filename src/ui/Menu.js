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
        const Height = 28;
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
        this.menuItemIndex = (this.menuItemIndex - 1 + this.menuItems.length) % this.menuItems.length;
        this.menuItems[this.menuItemIndex].select();
    }

    moveSelectionDown() {
        if (!this.menuItems.length) return;
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = (this.menuItemIndex + 1) % this.menuItems.length;
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

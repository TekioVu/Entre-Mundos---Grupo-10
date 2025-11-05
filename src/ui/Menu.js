import MenuItem from "./MenuItem.js";

export default class Menu extends Phaser.GameObjects.Container {
    constructor(x, y, scene, itemsPerRow = 2, itemsPerColumn = 3, columnSpacing = 80, icons = false) {
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
        const Height = 30;
        const index = this.menuItems.length;

        const col = Math.floor(index / this.itemsPerColumn);
        const row = index % this.itemsPerColumn;

        const xOffset = col * this.columnSpacing + 10;
        const yOffset = row * Height + 10;

        let displayData;

        if (this.icons && unit && unit.textureKey) {
            displayData = { type: "icon", key: unit.textureKey };
        } else if (typeof unit === "string") {
            displayData = { type: "text", key: unit };
        }

        const menuItem = new MenuItem(xOffset, yOffset, displayData, this.scene);
        menuItem.unit = unit;
        this.menuItems.push(menuItem);
        this.add(menuItem);
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
    }
}

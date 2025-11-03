import MenuItemCharacterSelection from "./MenuItemCharacterSelection.js";

export default class MenuCharacterSelection extends Phaser.GameObjects.Container {
    constructor(x, y, scene, itemsPerColumn = 3, columnSpacing = 80, heroes) {
        super(scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.heroes = heroes;
        this.x = x;
        this.y = y;
        this.itemsPerColumn = itemsPerColumn;
        this.columsSpacing = columnSpacing;
    }

    addMenuItem(unit) {
        const itemHeight = 25;
        const index = this.menuItems.length;
        
        const col = Math.floor(index / this.itemsPerColumn);
        const row = index % this.itemsPerColumn;

        const xOffset = col * this.columnSpacing + 10;
        const yOffset = row * itemHeight + 10;
        const menuItem = new MenuItemCharacterSelection(xOffset, yOffset, unit, this.scene);
        this.menuItems.push(menuItem);
        this.add(menuItem);
    }

    moveSelectionUp() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = (this.menuItemIndex - 1 + this.menuItems.length) % this.menuItems.length;
        this.menuItems[this.menuItemIndex].select();
    }

    moveSelectionDown() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = (this.menuItemIndex + 1) % this.menuItems.length;
        this.menuItems[this.menuItemIndex].select();
    }

    select(index = 0) {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;
        this.menuItems[this.menuItemIndex].select();
    }

    deselect() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
    }

    clear() {
        this.menuItems.forEach(item => item.destroy());
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    }

    remap(units) {
        this.clear();
        units.forEach(unit => {const display = unit.textureKey ? unit.textureKey : unit;
        this.addMenuItem(display);
    });
    }
}

import MenuItemCharacterSelection from "./MenuItemCharacterSelection.js";

export default class MenuCharacterSelection extends Phaser.GameObjects.Container {
    constructor(x, y, scene,itemsPerRow= 5, itemsPerColumn = 3, columnSpacing = 80, heroes) {
        super(scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.heroes = heroes;
        this.x = x;
        this.y = y;
        this.itemsPerColumn = itemsPerColumn;
        this.itemsPerRow = itemsPerRow;
        this.columsSpacing = columnSpacing;
    }

    addMenuItem(unit) {
        const Height = 25;
        const index = this.menuItems.length;

        const row = Math.floor(index / this.itemsPerRow);
        const col = index % this.itemsPerRow;
        
        const xOffset = col * this.columnSpacing + 10;
        const yOffset = row * Height + 10;
        const menuItem = new MenuItemCharacterSelection(xOffset, yOffset, unit.textureKey ? unit.textureKey : unit, this.scene);
        menuItem.unit = unit;
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

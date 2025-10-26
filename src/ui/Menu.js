import MenuItem from "./MenuItem.js";

export default class Menu extends Phaser.GameObjects.Container {
    constructor(x, y, scene, heroes) {
        super(scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.heroes = heroes;
        this.x = x;
        this.y = y;
    }

    addMenuItem(unit) {
        const itemHeight = 25;
        const yOffset = this.menuItems.length * itemHeight + 12;
        const menuItem = new MenuItem(45, yOffset, unit, this.scene);
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

    confirm() {}
    back() {}

    clear() {
        this.menuItems.forEach(item => item.destroy());
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    }

    remap(units) {
        this.clear();
        units.forEach(unit => this.addMenuItem(unit.type));
    }
}

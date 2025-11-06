import Menu from "./Menu.js";

export default class ItemsMenu extends Menu {
    constructor(x, y, scene, inv) {
        super(x, y, scene, 2, 3, 80, true);
        this.inventory = inv;
    }

    confirm() {
        if(typeof this.menuItems[this.menuItemIndex] !== 'string'){
        let itemIndex = this.inventory.getItemIndexByTexture(this.getMenuItemTexture(this.menuItemIndex));
        this.scene.events.emit("Item", itemIndex);
        }
    }

    back(){
        this.scene.events.emit("Back");
    }
}
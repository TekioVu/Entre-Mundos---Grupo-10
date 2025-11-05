import Menu from "./Menu.js";

export default class ItemsMenu extends Menu {
    constructor(x, y, scene, Icon= false) {
        super(x, y, scene, Icon);
    }

    confirm() {
        this.scene.events.emit("Item");
    }

    back() {
        this.scene.events.emit("Back");
    }
}
import Menu from "./Menu.js";

export default class ItemsMenu extends Menu {
    constructor(x, y, scene) {
        super(x, y, scene);
    }

    confirm() {
        this.scene.events.emit("Item");
    }

    back() {
        this.scene.events.emit("Back");
    }
}
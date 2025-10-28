import Menu from "./Menu.js";

export default class ActionsMenu extends Menu {
    constructor(x, y, scene) {
        super(x, y, scene);
    }

    confirm() {
        this.scene.events.emit("SelectEnemies");
    }

    back() {
        this.scene.events.emit("SelectActions");
    }
}
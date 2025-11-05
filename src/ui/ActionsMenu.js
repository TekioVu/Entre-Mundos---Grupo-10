import Menu from "./Menu.js";

export default class ActionsMenu extends Menu {
    constructor(x, y, scene) {
        super(x, y, scene, 1, 3, 80, false);
        this.addMenuItem("Attack");
        this.addMenuItem("Item");
    }

    confirm() {
        this.scene.events.emit("SelectEnemies");
    }

    back() {
        this.scene.events.emit("Back");
    }
}

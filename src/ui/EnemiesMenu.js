import Menu from "./Menu.js";

export default class EnemiesMenu extends Menu {
    constructor(x, y, scene) {
        super(x, y, scene, 2, 3, 80, true);
    }

    confirm() {
        this.scene.events.emit("Enemy", this.menuItemIndex);
    }

    back(){
        this.scene.events.emit("Back");
    }
}

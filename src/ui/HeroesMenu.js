import Menu from "./Menu.js";

export default class HeroesMenu extends Menu {
    constructor(x, y, scene) {
        super(x, y, scene, 2,3 , 80, true);
        this.id = 0;
    }

    confirm() {
        this.scene.events.emit("PlayerSelect");
    }
}
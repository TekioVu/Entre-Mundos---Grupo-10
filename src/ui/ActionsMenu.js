import Menu from "./Menu.js";

export default class ActionsMenu extends Menu {
    constructor(x, y, scene, hero = null) {
        super(x, y, scene, 1, 3, 80, false);
        this.hero = hero;

        this.refreshMenu();
    }

    refreshMenu() {
        this.clear();

        this.addMenuItem("Attack");
        this.addMenuItem("Item");

if (this.hero) {
    console.log(this.hero.type + " hasAbility: " + this.hero.hasAbility);
} else {
    console.log("No hero assigned yet");
}
        if (this.hero && this.hero.hasAbility && this.hero.specialAttackCounter == 2) { 
            this.addMenuItem("Hability");
        }
    }

    setHero(hero) {
        this.hero = hero;
        this.refreshMenu();
    }

    confirm() {
        this.scene.events.emit("Select");
    }

    back() {
        this.scene.events.emit("Back");
    }
}

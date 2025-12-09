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

        if (this.hero && this.hero.hasAbility) {
            if ((this.hero.type === "Dragon" || this.hero.type === "Cacodaemon") && this.hero.specialAttackCounter == 2) 
            this.addMenuItem("Ability");
        else if (this.hero.type === "Medusa" && this.hero.specialAttackCounter == 3) 
            this.addMenuItem("Ability");
        else if (this.hero.type === "King" && this.hero.specialAttackCounter == 1 && !this.hero.alreadySpecialAttacked) 
            this.addMenuItem("Ability");
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

import MenuCharacterSelection from "./MenuCharacterSelection.js";

export default class CharactersMenu extends MenuCharacterSelection {
    constructor(x, y, scene) {
        super(x, y, scene);
        this.id = 0;
    }

    confirm() {
        this.scene.events.emit("PlayerSelect");
    }
}
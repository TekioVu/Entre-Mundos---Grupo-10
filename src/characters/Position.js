import Unit from "./Unit.js";

export default class Position extends Unit {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        this.type= type;
    }
}

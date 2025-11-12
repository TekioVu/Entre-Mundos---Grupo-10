import Unit from "./Unit.js";

export default class Enemy extends Unit {
    constructor(scene, x, y, texture, frame, type, hp, damage, pos) {
        super(scene, x, y, texture, frame, type, hp, damage, pos);
    }
}

import Unit from "./Unit.js";

export default class Enemy extends Unit {
    constructor(scene, x, y, texture, frame, type, hp, damage) {
        super(scene, x, y, texture, frame, type, hp, damage);
        if(type === "Jester") this.flipX = true;
    }
}

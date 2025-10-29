import Item from "./Item.js"

export default class Inventory extends Item{
    constructor(scene, x, y, texture, frame, name, type, str, def, hp){
        super(scene, x, y, texture, frame, name, type, str, def, hp);
    }
}
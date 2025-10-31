import Item from "./Item.js";

export default class Inventory extends Phaser.GameObjects.Container{
    constructor(){
        this.itemsArray = [];
    }

    insertItem(id){
        this.itemsArray[id].numUp();
    }

    useItem(id){
        this.itemsArray[id].numDown();
    }
}
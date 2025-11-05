import Item from "./Item.js";

export default class Inventory extends Phaser.GameObjects.Container{
    constructor(){
        this.itemsArray = [];
    }

    size(){
        return this.itemsArray.size();
    }

    getItem(id){
        return this.itemsArray[id];
    }

    getNum(id){
        return this.itemsArray[id].getNum();
    }

    insertItem(id){
        this.itemsArray[id].numUp();
    }

    useItem(id){
        this.itemsArray[id].numDown();
    }
}
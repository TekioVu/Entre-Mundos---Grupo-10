import Item from "./Item.js";

export default class Inventory{
    constructor(){
        this.itemsArray = [];
    }

    createItem(texture, name, type, str, def, hp){
        this.itemsArray.push(new Item(texture, name, type, str, def, hp));
    }

    size(){
        return this.itemsArray.length;
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
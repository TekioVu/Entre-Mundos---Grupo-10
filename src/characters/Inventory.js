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
        console.log('Cantidad antes: ' + this.itemsArray[id].getNum());
        this.itemsArray[id].numUp();
        console.log('Cantidad despues: ' + this.itemsArray[id].getNum());
    }

    insertItemByName(name){
        let i = 0;
        while(i < this.itemsArray.length && this.itemsArray[i].getName() !== name){
            i++;
        }
        if(this.itemsArray[i] === name){
            console.log('insertado: ' + name);
            this.itemsArray[id].numUp();
        }
        else{
            console.log('no insertado :( ' + name);
        }
    }

    useItem(id){
        this.itemsArray[id].numDown();
    }
}
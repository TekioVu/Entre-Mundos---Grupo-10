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

    getItemIndexByTexture(texture){
        let i = 0;
        while(i < this.itemsArray.length && this.itemsArray[i].getTexture() !== texture){
            i++;
        }
        if(this.itemsArray[i].getTexture() === texture){
            console.log('encontrado: ' + texture);
            return i;
        }else{
            console.log('no encontrado :( ' + texture);
        }
    }

    useItem(id){
        this.itemsArray[id].numDown();
    }
}
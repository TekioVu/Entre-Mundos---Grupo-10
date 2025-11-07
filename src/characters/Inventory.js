import Item from "./Item.js";

export default class Inventory{
    constructor(){
        this.itemsArray = [];
    }

    // Crea, lo que no añade, items al inventario
    createItem(texture, name, type, str, def, hp){
        this.itemsArray.push(new Item(texture, name, type, str, def, hp));
    }
    
    // Devuelve el tamaño del inventario
    size(){
        return this.itemsArray.length;
    }

    // Devuelve un item
    getItem(id){
        return this.itemsArray[id];
    }

    // Devuelve la cantidad de un item en el inventario
    getNum(id){
        return this.itemsArray[id].getNum();
    }

    // Añade items al inventario
    insertItem(id){
        this.itemsArray[id].numUp();
    }

    // Añade pero por busqueda de nombre
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

    // Devuelve el nombre de la textura de un item
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

    // Reduce la cantidad de un item en el inventario
    useItem(id){
        this.itemsArray[id].numDown();
    }
}
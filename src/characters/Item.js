export default class Item{
    constructor(texture, name, type, str, def, hp){
        this.textureKey = texture;
        this.frame = 0;
        this.num = 0;
        this.name = name;
        this.type = type;
        switch(this.type){
            case('Weapon'): this.str = str; break;
            case('Armor'): this.def = def; break;
            case('HealPot'): this.hp = hp; break;
            case('DmgPot'): this.hp = hp; break;
            case('StrPot'): this.str = str; break;
            case('DefPot'): this.def = def; break;
        }
    }

    getTexture(){
        return this.textureKey;
    }

    getName(){
        return this.name;
    }

    getType(){
        console.log('Tipo del objeto: ' + this.type);
        return this.type;
    }

    // Dependiendo del tipo de objeto devuelve el stat relevante de este
    getStat(){
        switch(this.type){
            case('Weapon'): return this.str;
            case('Armor'): return this.def;
            case('HealPot'): return this.hp;
            case('DmgPot'): return this.hp;
            case('StrPot'): return this.str;
            case('DefPot'): return this.def;
        }
    }

    // Devuelve la cantidad de un item
    getNum(){
        return this.num;
    }

    // Aumenta o reduce la cantidad que tiene el jugador del objeto
    numUp(){
        this.num++;
    }

    numDown(){
        this.num--;
    }

    // Cura a una unidad en base a la hp del item (exclusivo de pociones de vida)
    heal(unit){
        unit.healPlayer(this.hp);
    }
}
export default class Item extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, name, type, str, def, hp){
        super(scene, x, y, texture, frame);
        this.name = name;
        this.type = type;
        switch(this.type){
            case('Weapon'): this.str = str; break;
            case('Armor'): this.def = def; break;
            case('HealPot'): this.hp = hp; break;
            case('SrtPot'): this.str = str; break;
            case('DefPot'): this.def = def; break;
        }
    }

    getType(){
        console.log('Tipo del objeto: ' + this.type);
    }

    getWeaponStr(){
        console.log('Daño del arma: ' + this.str);
    }
}
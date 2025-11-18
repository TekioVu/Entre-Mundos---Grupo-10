import Unit from "./Unit.js";

export default class PlayerCharacter extends Unit {
    constructor(scene, x, y, texture, frame, type, hp, damage, defense, pos) {
        super(scene, x, y, texture, frame, type, hp, damage, pos);
        this. defense = defense;
        this.debuffDef = defense; // Esto servira para mantener un registro de la defensa que tenia antes de usar pociones y poder restaurar la defensa
        this.flipX = true;
    }

    defUp(boost){
        this.defense += boost;
        this.scene.events.emit("Message", `${this.type} boosts defense by ${boost}`);
    }

    restoreDef(){
        this.defense = this.debuffDef;
    }

    dmgUp(boost){
        this.damage += boost;
        this.scene.events.emit("Message", `${this.type} boosts attack by ${boost}`);
    }

    restoreDmg(){
        this.damage = this.debuffDmg;
    }
}

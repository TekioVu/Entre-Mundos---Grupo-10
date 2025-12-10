export default class MiniGame_History extends Phaser.Scene {
    constructor() {
        super({ key: "MiniGame_History" });
    }
     init(data){
        this.attacker = data.attacker;
        this.target = data.target;
        this.parent = data.parent;
        this.firstTime = data.firstTime;
    }
    create(){

        
    }
}

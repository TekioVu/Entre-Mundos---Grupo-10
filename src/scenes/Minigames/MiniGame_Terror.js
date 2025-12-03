export default class MiniGame_Terror extends Phaser.Scene {
    constructor() {
        super({ key: "MiniGame_Terror" });
    }

    init(data){
        this.attacker = data.attacker;
        this.target = data.target;
        this.parent = data.parent;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const cx = width / 2;
        const cy = height / 2;
        //Bucle
        this.finished = false;
        this.timeLeft = 1.5;
        //----------------------------------------
        // Fondo 
        //----------------------------------------
        this.add.rectangle(0, 0, width, height, 0x0b0b0b).setOrigin(0);

        const barWidth = 300;
        const barHeight = 30;
        const strokeWidth = 3;

        this.mainBar = this.add.rectangle(cx, cy, barWidth, barHeight, 0x333333)
            .setOrigin(0.5)
            .setStrokeStyle(strokeWidth, 0xffffff);

        //----------------------------------------
        // Zona Perfecta
        //----------------------------------------
        this.perfectWidth = barWidth * 0.05;

        this.perfectZone = this.add.rectangle(
            cx,
            cy,
            this.perfectWidth,
            barHeight - strokeWidth,
            0xff0000
            ).setOrigin(0.5);

        //Zonas normales
        this.normalWidth = barWidth * 0.05;

        this.rightnormalZone = this.add.rectangle(
            cx + this.perfectWidth,
            cy,
            this.normalWidth,
            barHeight - strokeWidth,
            0xffff00
            ).setOrigin(0.5);

        this.leftnormalZone= this.add.rectangle(
            cx - this.perfectWidth,
            cy,
            this.normalWidth,
            barHeight - strokeWidth,
            0xffff00
            ).setOrigin(0.5);

        // ----- CURSOR -----
        this.cursorWidth = 10;
        this.cursor = this.add.rectangle(
            cx - barWidth / 2 + this.cursorWidth/2,  
            cy,
            this.cursorWidth,       
            barHeight - strokeWidth,
            0xffffff
        ).setOrigin(0.5);
        
        //Movimiento del cursor
        this.cursorSpeed = 400;
        this.cursorDir = 1

        this.leftLimit = cx - barWidth/2 + this.cursorWidth/2;
        this.rightLimit = cx + barWidth/2 - this.cursorWidth/2;

    }
    
    
    cursorMovement(){
        if(this.finished)return; 
        this.cursor.x +=  this.cursorDir * this.cursorSpeed * this.game.loop.delta / 1000;
        if(this.cursor.x < this.leftLimit)this.cursorDir = 1;
        if(this.cursor.x > this.rightLimit)this.cursorDir = -1;
            
        }

    update(time,delta){
        if(this.finished)return;
        this.timeLeft -= delta / 1000;
        if(this.timeLeft <= 0){
            this.finished = true;
            return
        }
        this.cursorMovement();
    }
}

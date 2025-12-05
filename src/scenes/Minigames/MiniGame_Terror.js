export default class MiniGame_Terror extends Phaser.Scene {
    constructor() {
        super({ key: "MiniGame_Terror" });
    }

    init(data){
        this.attacker = data.attacker;
        this.target = data.target;
        this.parent = data.parent;
        this.firstTime = data.firstTime;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const cx = width / 2;
        const cy = height / 2;
        //Bucle
        this.finished = false;

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

        if (!this.firstTime) {
            this.timeLeft = 1.09;
            this.timerText = this.add.text(cx, 40, this.timeLeft.toFixed(2), {
                fontSize: "42px",
                fontFamily: "Arial",
                color: "#ffffff"
            }).setOrigin(0.5);
        }
        
        this.perfectWidth = barWidth * 0.05;
        this.normalWidth = barWidth * 0.1;
                
        this.totalWidth = this.normalWidth/2 + this.perfectWidth/2 + 10;

        this.randomL = cx - barWidth/2  + this.totalWidth;
        this.randomR = cx + barWidth/2  - this.totalWidth;
        this.random = Phaser.Math.Between(this.randomL, this.randomR);
   
        // Zona Perfecta

        this.perfectZone = this.add.rectangle(
            this.random,
            cy,
            this.perfectWidth,
            barHeight - strokeWidth,
            0xff0000
            ).setOrigin(0.5);


        this.physics.add.existing(this.perfectZone);   
        //Zonas normales
    
        this.rightnormalZone = this.add.rectangle(
            this.random + this.perfectWidth * 1.5,
            cy,
            this.normalWidth,
            barHeight - strokeWidth,
            0xffff00
            ).setOrigin(0.5);

        this.physics.add.existing(this.rightnormalZone);    

        this.leftnormalZone= this.add.rectangle(
            this.random - this.perfectWidth * 1.5,
            cy,
            this.normalWidth,
            barHeight - strokeWidth,
             0xffff00
            ).setOrigin(0.5);

        this.physics.add.existing(this.leftnormalZone);

        // ----- CURSOR -----
        this.cursorWidth = 5;
        this.cursor = this.add.rectangle(
            cx - barWidth / 2 + this.cursorWidth/2,  
            cy,
            this.cursorWidth,       
            barHeight - strokeWidth,
            0xffffff
        ).setOrigin(0.5);

        this.physics.add.existing(this.cursor);
        
        //Movimiento del cursor
        this.cursorSpeed = 600;
        this.cursorDir = 1
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        

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

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)){
            this.checkResult();
            return;
        }

        if(this.finished)return;
        if (!this.firstTime) {
        this.timeLeft -= delta / 1000;
        if (this.timeLeft < 0) this.timeLeft = 0;

        this.timerText.setText(this.timeLeft.toFixed(2));
        }

        if(this.timeLeft <= 0){
            this.finish("fail");
            return
        }
    
        this.cursorMovement();
    }

    checkResult(){
        let cursor   = this.cursor.getBounds();
        let perfect  = this.perfectZone.getBounds();
        let rightN    = this.rightnormalZone.getBounds();
        let leftN     = this.leftnormalZone.getBounds();

        let result;

        if (Phaser.Geom.Intersects.RectangleToRectangle(cursor,perfect)) result = "perfect";
        else if (Phaser.Geom.Intersects.RectangleToRectangle(cursor,leftN)
                ||Phaser.Geom.Intersects.RectangleToRectangle(cursor,rightN)) result = "normal";
        else result = "fail";

        this.finish(result);

    }



    finish(result) {
        if (this.finished) return;
        this.finished = true;

        this.time.delayedCall(350, () => {
            this.parent.minigameResult(result);
            this.scene.stop();
        });
    }
}

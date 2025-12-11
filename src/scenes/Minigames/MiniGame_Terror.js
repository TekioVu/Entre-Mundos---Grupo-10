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
            this.timeLeft = 1.1;
            this.timerText = this.add.text(cx, 40, this.timeLeft.toFixed(2), {
                fontSize: "42px",
                fontFamily: "Arial",
                color: "#ffffff"
            }).setOrigin(0.5);
        }
        
        this.perfectWidth = barWidth * 0.05;
        this.normalWidth = barWidth * 0.1;
                
        this.totalWidth = this.normalWidth/2 + this.perfectWidth/2 + 20;

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

        this.physics.add.existing(this.perfectZone,true);

        //Zonas normales
    
        this.rightnormalZone = this.add.rectangle(
            this.random + this.perfectWidth * 1.5,
            cy,
            this.normalWidth,
            barHeight - strokeWidth,
            0xffff00
            ).setOrigin(0.5);
        this.physics.add.existing(this.rightnormalZone,true);

        this.leftnormalZone= this.add.rectangle(
            this.random - this.perfectWidth * 1.5,
            cy,
            this.normalWidth,
            barHeight - strokeWidth,
             0xffff00
            ).setOrigin(0.5);
        this.physics.add.existing(this.leftnormalZone,true);

        // ----- CURSOR -----
        this.cursorWidth = 5;
        this.cursor = this.add.rectangle(
            cx - barWidth / 2 + this.cursorWidth/2,  
            cy,
            this.cursorWidth,       
            barHeight - strokeWidth,
            0xffffff
        ).setOrigin(0.5);

        
        //Fisicas
        this.physics.add.existing(this.cursor);
        this.cursor.body.setCollideWorldBounds(true);
        this.cursor.body.setAllowGravity(false);
        this.cursor.body.setBounce(1, 0);
        //Si es la primera vez va mas despacio
        if(!this.firstTime) this.cursor.body.setVelocityX(600);  
        else this.cursor.body.setVelocityX(300);
        // ----------------------------------------
        // PAREDES INVISIBLES A LOS LADOS
        // ----------------------------------------
        this.leftWall = this.add.rectangle(
            this.mainBar.x - this.mainBar.width / 2,
            this.mainBar.y,
            10, this.mainBar.height,
            0x000000, 0
        );

        this.rightWall = this.add.rectangle(
            this.mainBar.x + this.mainBar.width / 2,
            this.mainBar.y,
            10, this.mainBar.height,
            0x000000, 0
        );

        this.physics.add.existing(this.leftWall, true);
        this.physics.add.existing(this.rightWall, true);

        this.physics.add.collider(this.cursor, this.leftWall);
        this.physics.add.collider(this.cursor, this.rightWall);
          
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        // TEXTO Tutorial
         if (this.firstTime) {
            const tutorialBg = this.add.rectangle(cx, 30, 300, 50, 0x000000, 0.7)
                .setStrokeStyle(3, 0xffffff);

            const tutorialText = this.add.text(cx, 30,
                "Presiona ESPACIO en la zona roja.",
                {
                    fontSize: "14px",
                    fontFamily: "Arial",
                    color: "#ffffff",
                    align: "center"
                }
            ).setOrigin(0.5);

            this.tutorialBg = tutorialBg;
            this.tutorialText = tutorialText;
        }
        
    }
    



    update(time,delta){

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)){
            this.handleOverlap();
            return;
        }

        if(this.finished)return;
         if (!this.firstTime) {
            this.timeLeft -= delta / 1000;
            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.cursor.body.setVelocityX(0);
                this.finish("fail");
                return;
            }
            this.timerText.setText(this.timeLeft.toFixed(2));
        }
    
    }

    handleOverlap(){
        if (this.finished) return;

        let result = "fail";

         if (this.physics.overlap(this.cursor, this.perfectZone)) result = "perfect";
         else if (this.physics.overlap(this.cursor, this.leftnormalZone) ||
                  this.physics.overlap(this.cursor, this.rightnormalZone)) result = "normal";

        this.finish(result);

    }



    finish(result) {
        if (this.finished) return;
        this.finished = true;

        this.cursor.body.setVelocityX(0);
        this.time.delayedCall(350, () => {
            this.parent.minigameResult(result);
            
            this.scene.stop();
        });
    }
}

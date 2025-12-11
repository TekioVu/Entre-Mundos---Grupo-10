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
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const cx = width / 2;
        const cy = height / 2;

        this.finished = false;
        //Fondo
        this.add.rectangle(0, 0, width, height, 0x0b0b0b).setOrigin(0);

        this.objects = [
            "obj0", "obj1", "obj2",
            "obj3", "obj4", "obj5",
            "obj6", "obj7", "obj8"
        ];

        this.startRound();
        this.input.on("pointerdown", (pointer, targets) => {
        if (targets.length === 0) {
            this.finish("fail"); 
        }});

        //TEXTO timer
        if (!this.firstTime) {
            this.timeLeft = 1.5;
            this.timerText = this.add.text(cx, 40, this.timeLeft.toFixed(2), {
                fontSize: "42px",
                fontFamily: "Arial",
                color: "#ffffff"
            }).setOrigin(0.5);
        }
        // TEXTO Tutorial
         if (this.firstTime) {
            const tutorialBg = this.add.rectangle(cx, 30, 300, 50, 0x000000, 0.7)
                .setStrokeStyle(3, 0xffffff);

            const tutorialText = this.add.text(cx, 30,
                "Haz click en el objeto correcto .",
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
            
         if (!this.firstTime) {
            this.timeLeft -= delta / 1000;
            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.finish("fail");
                return;
            }
            this.timerText.setText(this.timeLeft.toFixed(2));
        }

    }

    //Obtiene 2 objetos aleatorios de los 9 que hay
    getRandom(){
        
        let a = Phaser.Math.Between(0, 8);
        let b;

        do {
            b = Phaser.Math.Between(0, 8);
        } while (b === a);

        return { a, b };
    }

    startRound(){

        const { a, b } = this.getRandom();

        this.A = a;
        this.B = b;

        //Elegimos al que tiene que clicar
        this.correct = Phaser.Math.RND.pick([this.A, this.B]);

        this.goalImage = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height/2,
            this.objects[this.correct]
        ).setScale(2.5)
        .setOrigin(0.5);
            
        const posX1 = this.cameras.main.width * 0.3;
        const posX2 = this.cameras.main.width * 0.7;

        this.falling1 = this.physics.add.image(posX1, 70, this.objects[this.A]).setScale(2);
        this.falling2 = this.physics.add.image(posX2, 70, this.objects[this.B]).setScale(2);

        if(!this.firstTime){
            this.falling1.body.setGravityY(100);
            this.falling2.body.setGravityY(100);
        }else{
            this.falling1.body.setGravityY(25);
            this.falling2.body.setGravityY(25);
        }


        //Para girar
        this.falling1.setAngularVelocity(Phaser.Math.Between(-200, 200));
        this.falling2.setAngularVelocity(Phaser.Math.Between(-200, 200));
        
        if(this.correct === this.A){
            this.falling1.setInteractive();
            this.falling1.on("pointerdown", () => {
            this.finish("perfect");
        });
        }else{
            this.falling2.setInteractive();
            this.falling2.on("pointerdown", () => {
            this.finish("perfect");
        });
        }

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

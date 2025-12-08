export default class MiniGame_Comedy extends Phaser.Scene {
    constructor() {
        super({ key: "MiniGame_Comedy" });
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

        //Bucle
        this.finished = false;

        // --------- FONDO ---------
        this.add.rectangle(0, 0, width, height, 0x3333aa).setOrigin(0);
          // --------- AGUJEROS ---------
        this.holePositions = [
            {x: width*0.25, y: height*0.4},
            {x: width*0.5, y: height*0.4},
            {x: width*0.75, y: height*0.4},
            {x: width*0.25, y: height*0.7},
            {x: width*0.5, y: height*0.7},
            {x: width*0.75, y: height*0.7}
        ];

        this.holes = [];

        this.holePositions.forEach(pos => {
            const hole = this.add.circle(pos.x, pos.y, 25, 0x000000)
                .setStrokeStyle(3, 0x555555);
            this.holes.push(hole);
        });

        //Creamos el payaso
        this.payaso = this.add.circle(0, 0, 30, 0xff00ff) 
            .setVisible(false);

        this.physics.add.existing(this.payaso,true);


        this.spawnPayaso();





        if (!this.firstTime) {
            this.timeLeft = 1;
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
                "Haz click en el payaso cuando aparezca.",
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
        if(this.finished)return;
        
         if (!this.firstTime) {
            this.timeLeft -= delta / 1000;
            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.payaso.setVisible(false);
                this.finish("fail");
                return;
            }
            this.timerText.setText(this.timeLeft.toFixed(2));
        }
    }

    spawnPayaso(){
        const random =  Math.floor(Math.random() * this.holes.length);
        const pos = this.holes[random];

        this.payaso.setPosition(pos.x, pos.y);
        this.payaso.setVisible(true);
        //Hacemos que sea interactivo para clicar
        this.payaso.setInteractive();
        this.payaso.once('pointerdown', () => {
            if (this.finished) return;
            this.payaso.setVisible(false);
            this.finish("perfect");
        });
    }

    finish(result){
        if (this.finished) return;
        this.finished = true;

        this.time.delayedCall(250, () => {
            this.parent.minigameResult(result);
            this.scene.stop();
        });

    }
}

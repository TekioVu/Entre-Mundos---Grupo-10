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
         this.add.image(0, 0, 'minigame')
        .setOrigin(0, 0)     
        .setDisplaySize(width, height);
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
        //ANIMACIONES(spawn y esconderse)
        this.anims.create({
            key: 'clown_pop',
            frames: this.anims.generateFrameNumbers('clown', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'clown_hide',
            frames: this.anims.generateFrameNumbers('clown', { start: 20, end: 22 }),
            frameRate: 12,
            repeat: 0
        });
        
        

        //Creamos el payaso
        this.payaso = this.add.sprite(0, 0, 'clown')
            .setScale(1.5)
            .setVisible(false);
        
        this.physics.add.existing(this.payaso,true);


        this.spawnPayaso();
        //si detecta un click va a handleclick
        this.input.on('pointerdown', this.handleClick, this);


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
        // Mientras que no se termine el temporizador y no sea la primera vez que se ve el minijuego reduce el tiempo
        if(this.finished)return;
        
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

    // Spawnea el payaso aleatoriamente entre todos los agujeros
    spawnPayaso(){
        const random =  Math.floor(Math.random() * this.holes.length);
        const pos = this.holes[random];

        this.payaso.setPosition(pos.x, pos.y);
        this.payaso.setVisible(true);
        this.payaso.play('clown_pop');
        //Hacemos que sea interactivo para clicar
        this.payaso.setInteractive();
        this.payaso.once('pointerdown', () => {
            if (this.finished) return;
            //Frame cuando le clicas
            this.payaso.setFrame(16); 
            this.finish("perfect");
        });
    }

    // Handler del click para comprobar si acierta o no
    handleClick(pointer) {
    if (this.finished) return;

    if (!this.payaso.visible) return;

    const dx = pointer.x - this.payaso.x;
    const dy = pointer.y - this.payaso.y;
    //Comprobamos la distancia total
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Si es mayor devuelve fail
    if (dist > this.payaso.radius) {
        this.finish('fail');
        }
    }

    // Devuelve el resultado del minijuego
    finish(result){
        if (this.finished) return;
        this.finished = true;
        //Si es fail se esconde
        if(result == 'fail')this.payaso.play('clown_hide');

        this.time.delayedCall(300, () => {
            this.payaso.setVisible(false);
            this.parent.minigameResult(result);
            this.scene.stop();
        });

    }
}

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

        //----------------------------------------
        // Fondo 
        //----------------------------------------
        this.add.rectangle(0, 0, width, height, 0x0b0b0b).setOrigin(0);

        const barWidth = 300;
        const barHeight = 30;

        this.mainBar = this.add.rectangle(cx, cy, barWidth, barHeight, 0x333333)
            .setOrigin(0.5)
            .setStrokeStyle(3, 0xffffff);

        //----------------------------------------
        // Zona Perfecta
        //----------------------------------------
        this.perfectWidth = this.barWidth * 0.15;
        this.perfectHeight = this.barHeight;

        this.perfectZone = this.add.rectangle(
            cx,
            cy,
            this.perfectWidth,
            this.perfectHeight,
            0xff0000,
            0.6).setOrigin(0.5);

        // ----- CURSOR -----
        this.cursorWidth = 10;
        this.cursor = this.add.rectangle(
            cx - barWidth / 2,  
            cy,
            this.cursorWidth,       
            barHeight,
            0xffffff  
        ).setOrigin(0.5);
        
        //Movimiento del cursor
        this.cursorSpeed = 200;
        this.cursorDir = 1

        const leftLimit = cx - barWidth/2;
        const rightLimit = cx + barWidth/2;


    }
}

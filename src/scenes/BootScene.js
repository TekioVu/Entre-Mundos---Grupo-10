export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }

    preload() {
        this.load.spritesheet('player', './assets/Timmy/IDLE.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('goblin', './assets/Enemigos/Goblin/Attack3.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('ghost', './assets/Enemigos/Ghost/Idle.png', { frameWidth: 128, frameHeight: 128 });

        this.load.image('fantasy_background', './assets/Backgrounds/Fantasy.png');
        this.load.image('romance_background', './assets/Backgrounds/Romance.png');
        this.load.image('history_background', './assets/Backgrounds/Egypt3.png');
        this.load.image('comedy_background', './assets/Backgrounds/Comedy.png');
        this.load.image('horror_background', './assets/Backgrounds/Horror.png');

        //Objetos tienda
        this.load.image('pocion_roja', './assets/Pociones/Icon1.png');
        this.load.image('pocion_verde', './assets/Pociones/Icon3.png');
        this.load.image('pocion_azul', './assets/Pociones/Icon5.png');
        this.load.image('pocion_dorada', './assets/Pociones/Icon2.png');

        this.load.image('pocion_daño_area', './assets/Pociones/Icon18.png');
        this.load.image('pocion_daño_pequeña', './assets/Pociones/Icon4.png')
        this.load.image('pocion_daño_grande', './assets/Pociones/Icon20.png')
        this.load.image('pocion_cataclismo', './assets/Pociones/Icon35.png')

        this.load.image('pocion_ataque', './assets/Pociones/Icon40.png')
        this.load.image('pocion_defensa', './assets/Pociones/Icon36.png')
        this.load.image('pocion_aturdidora', './assets/Pociones/Icon25.png')

        this.load.image('goblin_image', './assets/Enemigos/Enemigos_Tienda/Goblin_Image.png')
        this.load.image('ghost_image', './assets/Enemigos/Enemigos_Tienda/Ghost_Image.png')

        // Aqui se cargaran los objetos que se podran utilizar:
        ;

    }

    create() {
        this.scene.start("MenuScene");
    }
}

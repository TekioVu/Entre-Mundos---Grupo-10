export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }

    preload() {
        
        //Enemigos
        this.load.spritesheet('player', './assets/Timmy/IDLE.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('player_attack1', './assets/Timmy/ATTACK_1.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('player_attack2', './assets/Timmy/ATTACK_3.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('player_hurt', './assets/Timmy/HURT.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('player_death', './assets/Timmy/DEATH.png', { frameWidth: 96, frameHeight: 84 });

        this.load.spritesheet('wizard', './assets/Wizard/Idle.png', { frameWidth: 231, frameHeight: 190 });

        this.load.spritesheet('goblin', './assets/Enemigos/Goblin/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('ghost', './assets/Enemigos/Ghost/Idle.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('clown', './assets/Enemigos/Clown/Clown_Sprite.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('jester', './assets/Enemigos/Jester/Jester.png', { frameWidth: 64, frameHeight: 64 });

        this.load.spritesheet('pharaoh', './assets/Enemigos/Egypt/Pharaoh_Stand.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('scarab', './assets/Enemigos/Egypt/Scarab_Stand.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('flying_eye', './assets/Enemigos/Flying_eye/Flight.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('mushroom', './assets/Enemigos/Mushroom/Idle.png', { frameWidth: 150, frameHeight: 150 });

        this.load.spritesheet('dragon', './assets/Enemigos/Dragon/Dragon.png', { frameWidth: 256, frameHeight: 256 });

        //Backgrounds
        this.load.image('fantasy_background', './assets/Backgrounds/Fantasy.png');
        this.load.image('romance_background', './assets/Backgrounds/Romance.png');
        this.load.image('history_background', './assets/Backgrounds/Egypt3.png');
        this.load.image('comedy_background', './assets/Backgrounds/Comedy2.png');
        this.load.image('horror_background', './assets/Backgrounds/Horror2.png');

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
        this.load.image('wizard_image', './assets/Enemigos/Enemigos_Tienda/Wizard_Image.png')

        // Aqui se cargaran los objetos que se podran utilizar:
        ;

    }

    create() {
        this.scene.start("MenuScene");
    }
}

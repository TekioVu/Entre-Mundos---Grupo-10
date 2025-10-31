export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }

    preload() {
        this.load.spritesheet('player', './assets/Timmy/IDLE.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('goblin', './assets/Enemigos/Goblin/Attack3.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('ghost', './assets/Enemigos/Ghost/Idle.png', { frameWidth: 128, frameHeight: 128 });
        this.load.image('fantasy_background', './assets/Backgrounds/graveyard.png');
        this.load.image('pocion_roja', './assets/Pociones/Icon1.png');
        this.load.image('pocion_verde', './assets/Pociones/Icon3.png');
        this.load.image('pocion_azul', './assets/Pociones/Icon5.png');
        this.load.image('pocion_dorada', './assets/Pociones/Icon2.png');
    }

    create() {
        this.scene.start("MenuScene");
    }
}

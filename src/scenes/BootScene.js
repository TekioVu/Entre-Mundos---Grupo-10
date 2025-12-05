import Inventory from "../characters/Inventory.js";
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }

    preload() {
        
        //Héroes
        this.load.spritesheet('timmy', './assets/Timmy/IDLE.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('timmy_idle', './assets/Timmy/IDLE.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('timmy_attack', './assets/Timmy/ATTACK 2.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('timmy_damage', './assets/Timmy/HURT.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('timmy_death', './assets/Timmy/DEATH.png', { frameWidth: 96, frameHeight: 84 });

        this.load.spritesheet('wizard', './assets/Wizard/Idle.png', { frameWidth: 231, frameHeight: 190 });
        this.load.spritesheet('wizard_idle', './assets/Wizard/Idle.png', { frameWidth: 231, frameHeight: 190 });
        this.load.spritesheet('wizard_attack', './assets/Wizard/Attack1.png', { frameWidth: 231, frameHeight: 190 });
        this.load.spritesheet('wizard_damage', './assets/Wizard/Hit.png', { frameWidth: 231, frameHeight: 190 });
        this.load.spritesheet('wizard_death', './assets/Wizard/Death.png', { frameWidth: 231, frameHeight: 190 });


        //Fantasía
        this.load.spritesheet('goblin', './assets/Enemigos/Goblin/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('goblin_idle', './assets/Enemigos/Goblin/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('goblin_attack', './assets/Enemigos/Goblin/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('goblin_death', './assets/Enemigos/Goblin/Death.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('goblin_damage', './assets/Enemigos/Goblin/Take Hit.png', { frameWidth: 150, frameHeight: 150 });

        this.load.spritesheet('ghost', './assets/Enemigos/Ghost/Idle.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('ghost_idle', './assets/Enemigos/Ghost/Idle.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('ghost_attack', './assets/Enemigos/Ghost/Sprite-fantasma2.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('ghost_death', './assets/Enemigos/Ghost/Sprite-fantasma4.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('ghost_damage', './assets/Enemigos/Ghost/Ghost_Damage.png', { frameWidth: 128, frameHeight: 128 });

        //Terror
        this.load.spritesheet('flying_eye', './assets/Enemigos/Flying_eye/Flight.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('flying_eye_idle', './assets/Enemigos/Flying_eye/Flight.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('flying_eye_attack', './assets/Enemigos/Flying_eye/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('flying_eye_death', './assets/Enemigos/Flying_eye/Death.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('flying_eye_damage', './assets/Enemigos/Flying_eye/Take Hit.png', { frameWidth: 150, frameHeight: 150 });

        this.load.spritesheet('mushroom', './assets/Enemigos/Mushroom/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('mushroom_idle', './assets/Enemigos/Mushroom/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('mushroom_attack', './assets/Enemigos/Mushroom/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('mushroom_death', './assets/Enemigos/Mushroom/Death.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('mushroom_damage', './assets/Enemigos/Mushroom/Take Hit.png', { frameWidth: 150, frameHeight: 150 });

        //Comedia
        this.load.spritesheet('clown', './assets/Enemigos/Clown/Clown_Sprite.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('clown_idle', './assets/Enemigos/Clown/Clown_Sprite.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('clown_attack', './assets/Enemigos/Clown/Clown_Sprite.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('clown_death', './assets/Enemigos/Clown/Clown_Sprite.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('clown_damage', './assets/Enemigos/Clown/Clown_Sprite.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('jester', './assets/Enemigos/Jester/Jester_Icon.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jester_idle', './assets/Enemigos/Jester/Jester.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jester_attack', './assets/Enemigos/Jester/Jester.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jester_death', './assets/Enemigos/Jester/Jester.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jester_damage', './assets/Enemigos/Jester/Jester.png', { frameWidth: 64, frameHeight: 64 });

        this.load.spritesheet('king', './assets/Enemigos/MedievalKing/Idle.png', { frameWidth: 160, frameHeight: 76 });
        this.load.spritesheet('king_idle', './assets/Enemigos/MedievalKing/Idle.png', { frameWidth: 160, frameHeight: 76 });
        this.load.spritesheet('king_attack', './assets/Enemigos/MedievalKing/Attack1.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('king_damage', './assets/Enemigos/MedievalKing/Take Hit - white silhouette.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('king_death', './assets/Enemigos/MedievalKing/Death.png', { frameWidth: 160, frameHeight: 111 });


        //Historia
        this.load.spritesheet('pharaoh', './assets/Enemigos/Egypt/Pharaoh_Stand.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('pharaoh_idle', './assets/Enemigos/Egypt/Pharaoh_Stand.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('pharaoh_attack', './assets/Enemigos/Egypt/Pharaoh_RAttack.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('pharaoh_damage', './assets/Enemigos/Egypt/Pharaoh_Damage.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('pharaoh_death', './assets/Enemigos/Egypt/Pharaoh_Stand.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('scarab', './assets/Enemigos/Egypt/Scarab_Stand.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('scarab_idle', './assets/Enemigos/Egypt/Scarab_Stand.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('scarab_attack', './assets/Enemigos/Egypt/Scarab_Fly.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('scarab_damage', './assets/Enemigos/Egypt/Scarab_Damage.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('scarab_death', './assets/Enemigos/Egypt/Scarab_Fly.png', { frameWidth: 128, frameHeight: 128 });

        //Bosses
        this.load.spritesheet('dragon', './assets/Enemigos/Dragon/Dragon.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('dragon_idle', './assets/Enemigos/Dragon/Dragon.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('dragon_attack', './assets/Enemigos/Dragon/Dragon.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('dragon_death', './assets/Enemigos/Dragon/Dragon.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('dragon_damage', './assets/Enemigos/Dragon/Dragon.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('medusa', './assets/Enemigos/Medusa/Medusa.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('medusa_idle', './assets/Enemigos/Medusa/Medusa.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('medusa_attack', './assets/Enemigos/Medusa/Medusa.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('medusa_damage', './assets/Enemigos/Medusa/Medusa.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('medusa_death', './assets/Enemigos/Medusa/Medusa.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('cacodaemon', './assets/Enemigos/Cacodaemon/Cacodaemon.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('cacodaemon_idle', './assets/Enemigos/Cacodaemon/Cacodaemon.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('cacodaemon_attack', './assets/Enemigos/Cacodaemon/Cacodaemon.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('cacodaemon_damage', './assets/Enemigos/Cacodaemon/Cacodaemon.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('cacodaemon_death', './assets/Enemigos/Cacodaemon/Cacodaemon.png', { frameWidth: 64, frameHeight: 64 });

        this.load.spritesheet('demon', './assets/Enemigos/Bosses/Demon.png', { frameWidth: 288, frameHeight: 160 });
        this.load.spritesheet('demon_idle', './assets/Enemigos/Bosses/Demon.png', { frameWidth: 288, frameHeight: 160 });
        this.load.spritesheet('demon_attack', './assets/Enemigos/Bosses/Demon.png', { frameWidth: 288, frameHeight: 160 });
        this.load.spritesheet('demon_damage', './assets/Enemigos/Bosses/Demon.png', { frameWidth: 288, frameHeight: 160 });
        this.load.spritesheet('demon_death', './assets/Enemigos/Bosses/Demon.png', { frameWidth: 288, frameHeight: 160 });

        this.load.spritesheet('boss1', './assets/Enemigos/FinalBosses/Evil Wizard/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('boss1_idle', './assets/Enemigos/FinalBosses/Evil Wizard/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('boss1_attack', './assets/Enemigos/FinalBosses/Evil Wizard/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('boss1_damage', './assets/Enemigos/FinalBosses/Evil Wizard/Take Hit.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('boss1_death', './assets/Enemigos/FinalBosses/Evil Wizard/Death.png', { frameWidth: 150, frameHeight: 150 });

        this.load.spritesheet('boss2', './assets/Enemigos/FinalBosses/Evil Wizard 2/Idle.png', { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('boss2_idle', './assets/Enemigos/FinalBosses/Evil Wizard 2/Idle.png', { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('boss2_attack', './assets/Enemigos/FinalBosses/Evil Wizard 2/Attack1.png', { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('boss2_damage', './assets/Enemigos/FinalBosses/Evil Wizard 2/Take hit.png', { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('boss2_death', './assets/Enemigos/FinalBosses/Evil Wizard 2/Death.png', { frameWidth: 250, frameHeight: 250 });

        this.load.spritesheet('boss3', './assets/Enemigos/FinalBosses/Evil Wizard 3/Idle.png', { frameWidth: 140, frameHeight: 140 });
        this.load.spritesheet('boss3_idle', './assets/Enemigos/FinalBosses/Evil Wizard 3/Idle.png', { frameWidth: 140, frameHeight: 140 });
        this.load.spritesheet('boss3_attack', './assets/Enemigos/FinalBosses/Evil Wizard 3/Attack.png', { frameWidth: 140, frameHeight: 140 });
        this.load.spritesheet('boss3_damage', './assets/Enemigos/FinalBosses/Evil Wizard 3/Get hit.png', { frameWidth: 140, frameHeight: 140 });
        this.load.spritesheet('boss3_death', './assets/Enemigos/FinalBosses/Evil Wizard 3/Death.png', { frameWidth: 140, frameHeight: 140 });

        this.load.spritesheet('cat_idle', './assets/Cat/IDLE.png', { frameWidth: 80, frameHeight: 64 });
        this.load.spritesheet('cat_walk', './assets/Cat/WALK.png', { frameWidth: 80, frameHeight: 64 });

        //Backgrounds
        this.load.image('fantasy_background', './assets/Backgrounds/Fantasy.png');
        this.load.image('romance_background', './assets/Backgrounds/Romance.png');
        this.load.image('history_background', './assets/Backgrounds/Egypt3.png');
        this.load.image('comedy_background', './assets/Backgrounds/Comedy3.png');
        this.load.image('horror_background', './assets/Backgrounds/Horror2.png');
        this.load.image('finalboss_background', './assets/Backgrounds/FinalBoss2.png');

        //Minijuegos
        this.load.spritesheet('fireball_idle', './assets/Minijuegos/Fireball/Idle.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('fireball_creation', './assets/Minijuegos/Fireball/Creation.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('fireball_explode', './assets/Minijuegos/Fireball/Explode.png', { frameWidth: 64, frameHeight: 64 });

        //UI
        this.load.image('attack_panel', './assets/UI/Panel.png');
        this.load.image('coins_won', './assets/UI/Coins.png');

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


    }

    create() {
        this.scene.start("KidnapScene");
    }
}

var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: "BootScene" });
    },

    preload: function ()
    {
        //Enemy
        this.load.spritesheet('player', './assets/Timmy/IDLE.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('goblin', './assets/Enemigos/Goblin/Attack3.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('ghost', './assets/Enemigos/Ghost/Idle.png', { frameWidth: 128, frameHeight: 128 });

        //Background
        this.load.image('fantasy_background', './assets/Backgrounds/graveyard.png');
    },

    create: function ()
    {
        this.scene.start("BattleScene");
    }
});

var BattleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BattleScene ()
    {
        Phaser.Scene.call(this, { key: "BattleScene" });
    },
    create: function ()
    {
        this.cameras.main.setBackgroundColor("#1a1f2b");

        this.add.image(0, 0, 'fantasy_background')
        .setOrigin(0, 0.3)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        .setScrollFactor(0);

        this.anims.create({
            key: 'timmy-idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }), 
            frameRate: 5,   
            repeat: -1     
        });

        this.anims.create({
            key: 'ghost-idle', 
            frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 11 }),
            frameRate: 5,  
            repeat: -1     
        });

        this.anims.create({
            key: 'goblin-idle', 
            frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 4 }),
            frameRate: 5,  
            repeat: -1     
        });
        
        // player character - timmy
        var timmy = new PlayerCharacter(this, 250, 75, 'player', 6, 'Timmy', 100, 20);        
        this.add.existing(timmy);
        timmy.anims.play('timmy-idle');          
        
        var goblin1 = new Enemy(this, 50, 100, "goblin", 4, "Goblin", 50, 3);
        goblin1.setScale(1.2); 
        this.add.existing(goblin1);
        goblin1.anims.play('goblin-idle');          
        
        var ghost1 = new Enemy(this, 50, 50, "ghost", 11,"Ghost", 50, 3);
        this.add.existing(ghost1);
        ghost1.setScale(0.3); 
        ghost1.anims.play('ghost-idle');         
        
        // array with heroes
        this.heroes = [ timmy ];
        // array with enemies
        this.enemies = [ goblin1, ghost1 ];
        // array with both parties, who will attack
        this.units = this.heroes.concat(this.enemies);
        
        // Run UI Scene at the same time
        this.scene.launch("UIScene");
        
        this.index = -1;                
    },
    nextTurn: function() {
        this.index++;
        // if there are no more units, we start again from the first one
        if(this.index >= this.units.length) {
            this.index = 0;
        }
        if(this.units[this.index]) {
            // if its player hero
            if(this.units[this.index] instanceof PlayerCharacter) {                
                this.events.emit("PlayerSelect", this.index);
            } else { // else if its enemy unit
                // pick random hero
                var r = Math.floor(Math.random() * this.heroes.length);
                // call the enemy"s attack function 
                this.units[this.index].attack(this.heroes[r]);  
                // add timer for the next turn, so will have smooth gameplay
                this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
            }
        }
    },
    // when the player have selected the enemy to be attacked
    receivePlayerSelection: function(action, target) {
        if(action == "attack") {            
            this.units[this.index].attack(this.enemies[target]);              
        }
        // next turn in 3 seconds
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });        
    },
    update: function() {
    this.units.forEach(unit => {
        if (unit.hpText && unit.alive !== false) {
            unit.updateHpText();
        }
    });
}
});

// base class for heroes and enemies
var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage; // default damage 
        
        const offsets = {
            "Timmy": 40,
            "Goblin": 25,
            "Ghost": 25
        };
        this.hpOffsetY = offsets[this.type] || 30; // valor por defecto 30

        // Texto de HP
        this.hpText = scene.add.text(this.x, this.y - this.hpOffsetY, this.hp, {
            font: "14px Arial",
            fill: "#ff0000",
            stroke: "#000000",
            strokeThickness: 2
        }).setOrigin(0.5);
    },
    updateHpText() {
        this.hpText.setPosition(this.x, this.y - this.hpOffsetY);
        this.hpText.setText(this.hp);
    },
    
    attack: function(target) {
        target.takeDamage(this.damage);
        this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");
    },
    takeDamage: function(damage) {
        this.hp -= damage;
        if(this.hp <= 0) {
            this.hp = 0;
            this.alive = false;

            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 600,
                onComplete: () => {
                    this.setVisible(false);
                }
            });
            this.hpText.setVisible(false);

            this.scene.units = this.scene.units.filter(u => u !== this);
        if (this instanceof Enemy) {
            this.scene.enemies = this.scene.enemies.filter(e => e !== this);
        } else {
            this.scene.heroes = this.scene.heroes.filter(h => h !== this);
        }

        if (this instanceof Enemy) {
            const uiScene = this.scene.scene.get("UIScene");
            uiScene.remapEnemies();
        }

        }
        
    }
});

var Enemy = new Phaser.Class({
    Extends: Unit,

    initialize:
    function Enemy(scene, x, y, texture, frame, type, hp, damage) {
        Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    }
});

var PlayerCharacter = new Phaser.Class({
    Extends: Unit,

    initialize:
    function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
        Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
        // flip the image so I don"t have to edit it manually
        this.flipX = true;
        
        this.setScale(2);
    }
});

var MenuItem = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    
    initialize:
    function MenuItem(x, y, text, scene) {
        Phaser.GameObjects.Container.call(this, scene, x, y);
        
        const boxWidth = 90;
        const boxHeight = 20;
        const bgColor = 0x000000;
        const bgAlpha = 0.6;
        
        // Fondo del botón
        this.bg = scene.add.graphics();
        this.bg.fillStyle(bgColor, bgAlpha);
        this.bg.fillRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 4);
        this.add(this.bg);

        // Texto centrado
        this.text = scene.add.text(0, 0, text, {
            color: "#ffffff",
            align: "center",
            fontSize: "14px"
        }).setOrigin(0.5);
        this.add(this.text);

        // Guardamos el tamaño por si luego lo quieres usar
        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
    },
    
    select: function() {
        this.bg.clear();
        this.bg.fillStyle(0xf8ff38, 0.8); // fondo amarillo al seleccionar
        this.bg.fillRoundedRect(-this.boxWidth/2, -this.boxHeight/2, this.boxWidth, this.boxHeight, 4);
        this.text.setColor("#000000");
    },
    
    deselect: function() {
        this.bg.clear();
        this.bg.fillStyle(0x000000, 0.6); // fondo normal
        this.bg.fillRoundedRect(-this.boxWidth/2, -this.boxHeight/2, this.boxWidth, this.boxHeight, 4);
        this.text.setColor("#ffffff");
    }
});


var Menu = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    
    initialize:
            
    function Menu(x, y, scene, heroes) {
        Phaser.GameObjects.Container.call(this, scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.heroes = heroes;
        this.x = x;
        this.y = y;
    },     
    addMenuItem: function(unit) {
        const itemHeight = 25; // separación vertical entre ítems
        const yOffset = this.menuItems.length * itemHeight + 12; // compensación vertical
        const menuItem = new MenuItem(45, yOffset, unit, this.scene);
        this.menuItems.push(menuItem);
        this.add(menuItem);
    },
          
    moveSelectionUp: function() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex--;
        if(this.menuItemIndex < 0)
            this.menuItemIndex = this.menuItems.length - 1;
        this.menuItems[this.menuItemIndex].select();
    },
    moveSelectionDown: function() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex++;
        if(this.menuItemIndex >= this.menuItems.length)
            this.menuItemIndex = 0;
        this.menuItems[this.menuItemIndex].select();
    },
    // select the menu as a whole and an element with index from it
    select: function(index) {
        if(!index)
            index = 0;
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;
        this.menuItems[this.menuItemIndex].select();
    },
    // deselect this menu
    deselect: function() {        
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
    },
    confirm: function() {
        // wen the player confirms his slection, do the action
    },
    clear: function() {
        for(var i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    },
    remap: function(units) {
        this.clear();        
        for(var i = 0; i < units.length; i++) {
            var unit = units[i];
            this.addMenuItem(unit.type);
        }
    }
});

var HeroesMenu = new Phaser.Class({
    Extends: Menu,
    
    initialize:
            
    function HeroesMenu(x, y, scene) {
        Menu.call(this, x, y, scene);                    
    }
});

var ActionsMenu = new Phaser.Class({
    Extends: Menu,
    
    initialize:
            
    function ActionsMenu(x, y, scene) {
        Menu.call(this, x, y, scene);   
        this.addMenuItem("Attack");
    },
    confirm: function() {      
        this.scene.events.emit("SelectEnemies");        
    }
    
});

var EnemiesMenu = new Phaser.Class({
    Extends: Menu,
    
    initialize:
            
    function EnemiesMenu(x, y, scene) {
        Menu.call(this, x, y, scene);        
    },       
    confirm: function() {        
        this.scene.events.emit("Enemy", this.menuItemIndex);
    }
});

var UIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: "UIScene" });
    },

    create: function ()
    {    
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);        
        this.graphics.strokeRect(1, 150, 90, 100);
        this.graphics.fillRect(1, 150, 130, 100);
        this.graphics.strokeRect(105, 150, 90, 90);
        this.graphics.fillRect(105, 150, 190, 90);
        this.graphics.strokeRect(205, 150, 130, 100);
        this.graphics.fillRect(205, 150, 130, 100);
        
        // basic container to hold all menus
        this.menus = this.add.container();
                
        this.heroesMenu = new HeroesMenu(218, 155, this);
        this.actionsMenu = new ActionsMenu(110, 155, this);
        this.enemiesMenu = new EnemiesMenu(8, 155, this);
   
        
        // the currently selected menu 
        this.currentMenu = this.actionsMenu;
        
        // add menus to the container
        this.menus.add(this.heroesMenu);
        this.menus.add(this.actionsMenu);
        this.menus.add(this.enemiesMenu);
        
        this.battleScene = this.scene.get("BattleScene");
        
        this.remapHeroes();
        this.remapEnemies();
        
        this.input.keyboard.on("keydown", this.onKeyInput, this);   
        
        this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);
        
        this.events.on("SelectEnemies", this.onSelectEnemies, this);
        
        this.events.on("Enemy", this.onEnemy, this);
        
        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);        
        
        this.battleScene.nextTurn();                
    },
    onEnemy: function(index) {
        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.currentMenu = null;
        this.battleScene.receivePlayerSelection("attack", index);
    },
    onPlayerSelect: function(id) {
        this.heroesMenu.select(id);
        this.actionsMenu.select(0);
        this.currentMenu = this.actionsMenu;
    },
    onSelectEnemies: function() {
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    },
    remapHeroes: function() {
        var heroes = this.battleScene.heroes;
        this.heroesMenu.remap(heroes);
    },
    remapEnemies: function() {
        var enemies = this.battleScene.enemies;
        this.enemiesMenu.remap(enemies);
    },
    onKeyInput: function(event) {
        // Prevenir que el navegador haga scroll u otras acciones
        const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"];
        if (keysToPrevent.includes(event.code)) {
            event.preventDefault(); // <- esto evita que la página se mueva
        }

        if(this.currentMenu) {
            if(event.code === "ArrowUp") {
                this.currentMenu.moveSelectionUp();
            } else if(event.code === "ArrowDown") {
                this.currentMenu.moveSelectionDown();
            } else if(event.code === "ArrowRight" || event.code === "Shift") {
                // puedes usar esto más adelante
            } else if(event.code === "Space" || event.code === "ArrowLeft") {
                this.currentMenu.confirm();
            } 
        }
    },

});

var Message = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,

    initialize:
    function Message(scene, events) {
        Phaser.GameObjects.Container.call(this, scene, 160, 30);
        var graphics = this.scene.add.graphics();
        this.add(graphics);
        graphics.lineStyle(1, 0xffffff, 0.8);
        graphics.fillStyle(0x031f4c, 0.3);        
        graphics.strokeRect(-90, -15, 180, 30);
        graphics.fillRect(-90, -15, 180, 30);
        this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", { color: "#ffffff", align: "center", fontSize: 13, wordWrap: { width: 160, useAdvancedWrap: true }});
        this.add(this.text);
        this.text.setOrigin(0.5);        
        events.on("Message", this.showMessage, this);
        this.visible = false;
    },
    showMessage: function(text) {
        this.text.setText(text);
        this.visible = true;
        if(this.hideEvent)
            this.hideEvent.remove(false);
        this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
    },
    hideMessage: function() {
        this.hideEvent = null;
        this.visible = false;
    }
});

var config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [ BootScene, BattleScene, UIScene ]
};

var game = new Phaser.Game(config);
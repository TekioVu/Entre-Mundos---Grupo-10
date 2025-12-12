export default class Unit extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, type, hp, damage, pos, hasHability) {
        super(scene, x, y, texture, frame);
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage;
        this.debuffDmg = damage;
        this.textureKey = texture;
        this.pos = pos;
        this.stunned = 0;
        this.specialAttackCounter = 0;
        this.hasAbility = false;
        this.alreadySpecialAttacked = false; //Variable para los mini bosses que solo usen su habilidad 1 vez

        //Variables que determinan cuando se puede utilizar la habilidad de los basses aliados
    if (!this.isEnemy){
        if(this.type === "Dragon" || this.type === "Cacodaemon"){
            this.hasAbility = true;
            this.specialAttackCounter = 2;
        }
        else if (this.type === "Medusa"){
            this.hasAbility = true;
            this.specialAttackCounter = 3;
        }
        else if ( this.type === "King"){
            this.hasAbility = true;
            this.specialAttackCounter = 1;
            this.alreadySpecialAttacked = false;
        }
    }

        const offsets = {
            "Timmy": 40,
            "Wizard": 40,

            "Goblin": 25,
            "Ghost": 30,
            "Mushroom": 25,
            "Flying Eye": 25,
            "Pharaoh": 50,
            "Scarab": 20,
            "Clown": 25,
            "Jester": 25,
            "King": 25,

            "Dragon": 25,
            "Cacodaemon" : 25,
            "Medusa": 35,

            "Demon": 35,
            "Scared Wizard" : 25,
            "Sad Wizard" : 25,
            "Angry Wizard" : 25,
        };

        this.isEnemy = true;

        this.hpOffsetY = offsets[this.type] || 30;

        this.hpText = scene.add.text(this.x, this.y - this.hpOffsetY, this.hp, {
            font: "14px Arial",
            fill: "#ff0000",
            stroke: "#000000",
            strokeThickness: 2
        }).setOrigin(0.5);

        
    }

    // Actualiza la vida en la pantalla
    updateHpText() {
        this.hpText.setPosition(this.x, this.y - this.hpOffsetY);
        this.hpText.setText(this.hp);
    }


    //Reproduce las animaciones de ataque, daño y muerte y vuelve a idle
    playAnim(action, onComplete = null) {
        const animKey = `${this.textureKey}-${action}`;
        if (this.scene.anims.exists(animKey)) {
            this.play(animKey);
        }

        if (onComplete) {
            this.once('animationcomplete', onComplete);
        }
    }


    attack(target) {
        // r = 0 ataque crit, r = 1, 2, 3 ataque normal
        const r = Math.floor(Math.random() * 3);
        let d;
        if (target.pos == 'v') d = this.damage - 5;
        else d = this.damage;

        // En caso de ser un golpe critico empieza el minijuego correspondiente al mundo y aumenta el daño
        const battleScene = this.scene.scene.get("BattleScene");
        if(r === 0 && !this.isEnemy && (battleScene.currentbook === "FANTASÍA" || battleScene.currentbook === "TERROR" 
        || battleScene.currentbook === "COMEDIA") ||battleScene.currentbook === "HISTORIA" ||battleScene.currentbook === "THE END" ) 
        {
            console.log("crit");
            this.damage *= 1.25;
            this.startMinigame(target);
        }
        else{
            target.takeDamage(d, this);
            this.scene.events.emit("Message", `${this.type} attacks ${target.type} for ${d} damage`);
        }

        // Hace la animacion de ataque del atacante
        if (!this.stunned)
        {this.playAnim('attack', () => this.playAnim('idle'));}
        
        // Conteo de las habilidades especiales
        if (this.specialAttackCounter < 2 && this.type === "Dragon" || this.type === "Cacodaemon") this.specialAttackCounter++;
        else if (this.specialAttackCounter < 3 && this.type === "Medusa") this.specialAttackCounter++;
        if(this.isEnemy)
        this.checkSpecialAttack(target);
    }

    // Cura a la unidad en base a 'hp'
    heal(hp){
        this.hp += hp;
        this.updateHpText();
        this.scene.events.emit("Message", `${this.type} heals ${hp}HP`);
    }

    // Hace daño al area del enemigo seleccionado (vanguardia o retaguardia)
    areaPot(damage, p){
        const battleScene = this.scene.scene.get("BattleScene");
        for (let h of battleScene.enemies) {
            if(h.pos === p){
                h.takeDamage(damage, this);
            }
        }
    }

    // Hace daño a todos los enemigos
    catPot(damage){
        const battleScene = this.scene.scene.get("BattleScene");
        for (let h of battleScene.enemies) {
            h.takeDamage(damage, this);          
        }
    }

    //El personaje recibe daño
    takeDamage(damage, attacker) {

        const bs = this.scene.scene.get("BattleScene");
        if (!bs) return;

        if(this.defense){ // Sirve para diferenciar entre aliados ,que cuentan con estadistica de defensa, y enemigos
            this.hp -= damage - this.defense;
        }
        else{
        this.hp -= damage;
        }

        this.isDead(bs, attacker);
    }

    //Gestiona si el personaje muere o solo reciba daño
    isDead(bs, attacker){
        if (this.hp <= 0)
        {
            this.hp = 0;
            this.alive = false;

            if (this.type === "Goblin" || this.type === "Ghost" || this.type === "Timmy" || this.type === "Wizard"|| this.type === "Mushroom" || this.type === "Flying Eye"|| this.type === "Dragon"|| this.type === "Jester"|| this.type === "Scared Wizard"|| this.type === "Angry Wizard" || this.type === "Sad Wizard" || this.type === "King" || this.type === "Medusa"|| this.type === "Cacodaemon")
            {
                this.playAnim('death', () => {
                
                    bs.tweens.add({
                        targets: this,
                        alpha: 0,
                        duration: 600,
                        onComplete: () => this.setVisible(false)
                    });
                });
            }
            else {

                bs.tweens.add({
                    targets: this,
                    alpha: 0,
                    duration: 600,
                    onComplete: () => 
                    {
                        this.setVisible(false)
                    }
                });
            }
            
            this.hpText.setVisible(false);

            // Eliminar de las listas correspondientes
            this.scene.units = this.scene.units.filter(u => u !== this);
            if (this.isEnemy) {
                let removedIndex = -1;

                this.scene.enemies = this.scene.enemies.filter((e, i) => {
                    if (e === this) {
                        removedIndex = i;   
                        return false;       
                    }
                    return true;
                });    
                this.scene.events.emit("enemyRemoved", removedIndex);

            } else {
                this.scene.heroes = this.scene.heroes.filter(h => h !== this);
            }

            const uiScene = this.scene.scene.get("UIScene");
            const battleScene = this.scene.scene.get("BattleScene");
            const charSelectScene = this.scene.scene.get("CharacterSelectionScene");

            uiScene.remapHeroes();
            
            // Si no quedan mas enemigos vivos comprueba si queda el miniboss por matar, sino termina el combate
            if (this.scene.enemies.length === 0) {
                if (battleScene.normalCombatCompleted || battleScene.currentbook === "THE END") {
                    this.scene.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            uiScene.cleanEvents();
                            battleScene.cleanEvents();
                            charSelectScene.cleanEvents();

                            this.scene.scene.stop("UIScene");
                            this.scene.scene.stop("BattleScene");
                            if (battleScene.currentbook !== "THE END")
                            this.scene.scene.start("VictoryScene");
                            else 
                            this.scene.scene.start("EndScene");
                        }
                    });
                } else {
                    this.scene.time.delayedCall(3000, () => {
                        battleScene.createMiniBoss();
                        uiScene.remapEnemies();
                    });
                }
            }

            // Si no quedan mas aliados pasa a la pantalla de derrota
            if (this.scene.heroes.length === 0) {
                this.scene.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.scene.scene.stop("BattleScene");
                        this.scene.scene.stop("UIScene");
                        this.scene.scene.start("GameOverScene");
                    }
                });
            }
        }
        else{
            if (!attacker.stunned)
             {this.playAnim('damage', () => this.playAnim('idle'));}
            
        }
    }


    //Minijuegos
    startMinigame(target)
    {
        const r = Math.floor(Math.random() * 4);
        // Depende del libro actual empieza un minijuego u otro
        const battleScene = this.scene.scene.get("BattleScene");

        if (battleScene.currentbook === "FANTASÍA") {
            battleScene.launchMagicMinigame(this, target);

        }else if(battleScene.currentbook === "TERROR")
        {
            battleScene.launchTerrorMinigame(this, target);
        }else if(battleScene.currentbook === "HISTORIA")
        {
            battleScene.launchHistoryMinigame(this, target);
        }else if(battleScene.currentbook === "COMEDIA")
        {
            battleScene.launchComedyMinigame(this, target);
        }else if(battleScene.currentbook === "THE END")
        {
            switch(r){
                case(0):
                battleScene.launchMagicMinigame(this, target);
                break;
                case(1):
                battleScene.launchTerrorMinigame(this, target);
                break;
                case(2):
                battleScene.launchHistoryMinigame(this, target);
                break;
                case(3):
                battleScene.launchComedyMinigame(this, target);
                break;
            }
        }
    }

    //Habilidades de los bosses enemigos
    checkSpecialAttack(target)
    {
        const battleScene = this.scene.scene.get("BattleScene");

         if(this.stunned == 0)
        {   
            // Si el contador llega a 2 hace el ataque especial personaje correspondiente
            if(this.type === "Dragon" && this.specialAttackCounter == 2)
            {
                this.specialAttackCounter = 0;
                for (let h of battleScene.heroes) {
                    h.takeDamage(this.damage, this);
                }

                this.scene.events.emit("Message", `${this.type} is using flare: 40 DMG ALL UNITS`);
            }
            else if(this.type === "Cacodaemon" && this.specialAttackCounter == 2)
            {
                this.specialAttackCounter = 0;
                for (let i = 0; i < 5; i++) {
                
                    const r = Math.floor(Math.random() * battleScene.heroes.length);
                    battleScene.heroes[r].takeDamage(this.damage / 2, this);
                }

                this.scene.events.emit("Message", `${this.type} is using randomness`);
            }
            else if(this.type === "Medusa" && this.specialAttackCounter == 3)
            {
                this.specialAttackCounter = 0;
                for (let h of battleScene.heroes) {
                    h.stunned = 2;
                }

                this.scene.events.emit("Message", `${this.type} is using petrification: ALL UNITS STUNNED FOR 2 TURNS`);
            }
            else if(this.type === "King" && this.specialAttackCounter == 1 && !this.alreadySpecialAttacked)
            {
                this.alreadySpecialAttacked = true;
                battleScene.invokeJester();
                this.scene.events.emit("Message", `${this.type} is invoking Jesters`);
            }
            else if(this.type === "Scared Wizard" && this.specialAttackCounter == 2)
            {
                target.stunned = 3;
                this.scene.events.emit("Message", `${target.type} is feared for 3 turns`);
            }
            else if(this.type === "Sad Wizard" && this.specialAttackCounter == 2)
            {
                for (let i = 0; i < 3; i++) {
                
                    const r = Math.floor(Math.random() * battleScene.heroes.length);
                    battleScene.heroes[r].attack *= 0.8;
                }

                this.scene.events.emit("Message", `${this.type} is reducing attack`);
            }
            else if(this.type === "Angry Wizard" && this.specialAttackCounter == 2)
            {
                for (let h of battleScene.heroes) {
                    h.takeDamage(this.damage, this);
                }

                this.scene.events.emit("Message", `${this.type} is using meteor: ${this.damage} in AREA`);
            }
            else if(this.isEnemy || battleScene.currentbook !== "FANTASÍA"){
                let d;
                if (target.pos == 'v') d = this.damage - 5;
                else d = this.damage;

                target.takeDamage(d, this);

                this.scene.events.emit("Message", `${this.type} attacks ${target.type} for ${d} damage`);
            }
        }else {
            this.scene.events.emit("Message", `${this.type} is stunned`);
            this.stunned--;
        }

        this.specialAttackCounter++;
    }


    //Habilidades de los bosses aliados
    checkSpecialAttackHeroes(target)
    {
        const battleScene = this.scene.scene.get("BattleScene");

         if(this.stunned == 0)
        {
            if(this.type === "Dragon" && this.specialAttackCounter == 2)
            {
                this.specialAttackCounter = 0;
                for (let h of battleScene.enemies) {
                    h.takeDamage(this.damage, this);
                }

                this.scene.events.emit("Message", `${this.type} is using flare: 40 DMG ALL UNITS`);
            }
            else if(this.type === "Cacodaemon" && this.specialAttackCounter == 2)
            {
                this.specialAttackCounter = 0;
                for (let i = 0; i < 5; i++) {
                
                    const r = Math.floor(Math.random() * battleScene.enemies.length);
                    battleScene.enemies[r].takeDamage(this.damage / 2, this);
                }

                this.scene.events.emit("Message", `${this.type} is using randomness`);
            }
            else if(this.type === "Medusa" && this.specialAttackCounter == 3)
            {
                this.specialAttackCounter = 0;
                for (let h of battleScene.enemies) {
                    h.stunned = 2;
                }

                this.scene.events.emit("Message", `${this.type} is using petrification: ALL UNITS STUNNED FOR 2 TURNS`);
            }
            else if(this.type === "King" && this.specialAttackCounter == 1 && !this.alreadySpecialAttacked)
            {
                this.alreadySpecialAttacked = true;
                battleScene.invokeJesterHero();
                this.scene.events.emit("Message", `${this.type} is invoking Jesters`);
            }
        }else {
            this.scene.events.emit("Message", `${this.type} is stunned`);
            this.stunned--;
        }

        this.specialAttackCounter++;
        battleScene.time.addEvent({ delay: 3000, callback: battleScene.nextTurn, callbackScope: battleScene });

    }
}

export default class MiniGame_Fantasy extends Phaser.Scene {
    constructor() {
        super({ key: "MiniGame_Fantasy" });
    }

    init(data) {
        this.attacker = data.attacker;
        this.target = data.target;
        this.parent = data.parent;
        this.firstTime = data.firstTime;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const centerX = width / 2;
        const centerY = height / 2;

        this.physics.world.setBounds(0, 0, width, height);

        // Fondo
        this.add.rectangle(0, 0, width, height, 0x2d1b55).setOrigin(0);

        const margin = 50;

        //------------------------------------------
        // TIMER (solo si NO es la primera vez)
        //------------------------------------------
        if (!this.firstTime) {
            this.timeLeft = 1.09;
            this.timerText = this.add.text(centerX, 40, this.timeLeft.toFixed(2), {
                fontSize: "42px",
                fontFamily: "Arial",
                color: "#ffffff"
            }).setOrigin(0.5);
        }
        //------------------------------------------

        // RANDOM TARGET
        const targetSize = Phaser.Math.Between(30, 50);
        const targetX = Phaser.Math.Clamp(centerX + Phaser.Math.Between(-120, 120), margin, width - margin);
        const targetY = Phaser.Math.Clamp(centerY + Phaser.Math.Between(-140, 0), margin, height - margin);

        this.targetZone = this.add.circle(targetX, targetY, targetSize, 0x00ff88, 0.25)
            .setStrokeStyle(3, 0x00ffcc);

        this.physics.add.existing(this.targetZone);
        this.targetZone.body.setCircle(targetSize);
        this.targetZone.body.setAllowGravity(false);
        this.targetZone.body.setImmovable(true);
        this.targetZone.body.isSensor = true;

        // Movimiento suave
        this.tweens.add({
            targets: this.targetZone,
            x: Phaser.Math.Clamp(this.targetZone.x + Phaser.Math.Between(-60, 60), margin, width - margin),
            y: Phaser.Math.Clamp(this.targetZone.y + Phaser.Math.Between(-40, 40), margin, height - margin),
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut",
            onUpdate: () => {
                this.targetZone.body.reset(this.targetZone.x, this.targetZone.y);
            }
        });

        // ORB
        const orbX = Phaser.Math.Clamp(centerX + Phaser.Math.Between(-60, 60), margin, width - margin);
        const orbY = Phaser.Math.Clamp(centerY + 130, margin, height - margin);

        this.orb = this.add.circle(orbX, orbY, 25, 0x88aaff)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive();

        this.physics.add.existing(this.orb);
        this.orb.body.setCircle(25);
        this.orb.body.setAllowGravity(false);
        this.orb.body.setImmovable(true);
        this.orb.body.moves = false;

        // Draggable
        this.input.setDraggable(this.orb);

        this.input.on("drag", (pointer, obj, dragX, dragY) => {
            obj.x = Phaser.Math.Linear(obj.x, dragX, 0.20);
            obj.y = Phaser.Math.Linear(obj.y, dragY, 0.20);

            obj.x = Phaser.Math.Clamp(obj.x, margin, width - margin);
            obj.y = Phaser.Math.Clamp(obj.y, margin, height - margin);

            obj.body.reset(obj.x, obj.y);
        });

        this.input.on("dragend", () => {
            if (this.finished) return;

            this.released = true;
            if (this.dragTimer) this.dragTimer.remove(false);

            if (Phaser.Geom.Intersects.CircleToCircle(this.orb, this.targetZone)) {
                this.handleOverlap();
            } else {
                this.finish("fail");
            }
        });

        //------------------------------------------
        // TIMEOUT (solo si NO es la primera vez)
        //------------------------------------------
        this.released = false;
        this.finished = false;

        if (!this.firstTime) {
            this.dragTimer = this.time.delayedCall(1100, () => {
                if (!this.released && !this.finished) {
                    this.released = true;

                    if (Phaser.Geom.Intersects.CircleToCircle(this.orb, this.targetZone)) {
                        this.handleOverlap();
                    } else {
                        this.finish("fail");
                    }
                }
            });
        }
        //------------------------------------------
        //------------------------------------------
        // CAJA DE TEXTO DEL TUTORIAL
        //------------------------------------------
        if (this.firstTime) {
            const tutorialBg = this.add.rectangle(centerX, 30, 300, 50, 0x000000, 0.7)
                .setStrokeStyle(3, 0xffffff);

            const tutorialText = this.add.text(centerX, 30,
                "Arrastra el orbe hasta el círculo de destino.",
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

    update(time, delta) {
    if (this.finished) return;

    // Solo actualiza el timer si NO es primera vez
    if (!this.firstTime) {
        this.timeLeft -= delta / 1000;
        if (this.timeLeft < 0) this.timeLeft = 0;

        this.timerText.setText(this.timeLeft.toFixed(2));
    }
}


    handleOverlap() {
        if (this.finished) return;

        const dist = Phaser.Math.Distance.Between(this.orb.x, this.orb.y, this.targetZone.x, this.targetZone.y);

        let result;
        const perfectRange = this.targetZone.radius * 0.35;
        const normalRange = this.targetZone.radius * 0.9;

        if (dist < perfectRange) result = "perfect";
        else if (dist < normalRange) result = "normal";
        else result = "fail";

        this.finish(result);
    }

    finish(result) {
        if (this.finished) return;
        this.finished = true;

        // borrar tutorial si hay
        if (this.tutorialBg) this.tutorialBg.destroy();
        if (this.tutorialText) this.tutorialText.destroy();

        this.flashColor(
            result === "perfect" ? 0x00ffcc :
            result === "normal"  ? 0xffff00 :
                                   0xff4444
        );

        this.time.delayedCall(350, () => {
            this.parent.minigameResult(result);
            this.scene.stop();
        });
    }

    flashColor(color) {
        const rect = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, color, 0.5).setOrigin(0);

        this.tweens.add({
            targets: rect,
            alpha: 0,
            duration: 300,
            onComplete: () => rect.destroy()
        });
    }
}

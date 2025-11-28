export default class MiniGame_Fantasy extends Phaser.Scene {
    constructor() {
        super({ key: "MiniGame_Fantasy" });
    }

    init(data) {
        this.attacker = data.attacker;
        this.target = data.target;
        this.parent = data.parent;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const centerX = width / 2;
        const centerY = height / 2;

        // Activar físicas Arcade
        this.physics.world.setBounds(0, 0, width, height);

        // Fondo
        this.add.rectangle(0, 0, width, height, 0x2d1b55).setOrigin(0);

        // --- CONFIG BORDES SEGUROS ---
        const margin = 50;

        // RANDOM TARGET
        const targetSize = Phaser.Math.Between(30, 50);

        const targetX = Phaser.Math.Clamp(
            centerX + Phaser.Math.Between(-120, 120),
            margin, width - margin
        );
        const targetY = Phaser.Math.Clamp(
            centerY + Phaser.Math.Between(-140, 0),
            margin, height - margin
        );

        // DISPLAY
        this.targetZone = this.add.circle(
            targetX, targetY, targetSize,
            0x00ff88, 0.25
        ).setStrokeStyle(3, 0x00ffcc);

        // --- FÍSICAS DEL TARGET ---
        this.physics.add.existing(this.targetZone);
        this.targetZone.body.setCircle(targetSize);
        this.targetZone.body.setAllowGravity(false);
        this.targetZone.body.setImmovable(true);
        this.targetZone.body.isSensor = true;

        // Movimiento suave del target
        this.tweens.add({
            targets: this.targetZone,
            x: Phaser.Math.Clamp(
                this.targetZone.x + Phaser.Math.Between(-60, 60),
                margin, width - margin
            ),
            y: Phaser.Math.Clamp(
                this.targetZone.y + Phaser.Math.Between(-40, 40),
                margin, height - margin
            ),
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut",
            onUpdate: () => {
                this.targetZone.body.reset(this.targetZone.x, this.targetZone.y);
            }
        });

        // RANDOM ORB START
        const orbX = Phaser.Math.Clamp(
            centerX + Phaser.Math.Between(-60, 60),
            margin, width - margin
        );
        const orbY = Phaser.Math.Clamp(centerY + 130, margin, height - margin);

        // DISPLAY
        this.orb = this.add.circle(orbX, orbY, 25, 0x88aaff)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive();

        // --- FÍSICAS DEL ORBE ---
        this.physics.add.existing(this.orb);
        this.orb.body.setCircle(25);
        this.orb.body.setAllowGravity(false);
        this.orb.body.setImmovable(true);
        this.orb.body.moves = false;
        this.orb.body.reset(orbX, orbY);

        this.input.on("dragend", () => {
            if (this.finished) return;

            this.released = true;
            this.dragTimer.remove(false);

            // Verificar overlap SOLO al soltar
            if (Phaser.Geom.Intersects.CircleToCircle(this.orb, this.targetZone)) {
                this.handleOverlap();
            } else {
                this.finish("fail");
            }
        });


        // Arrastre
        this.input.setDraggable(this.orb);

        this.input.on("drag", (pointer, obj, dragX, dragY) => {
            obj.x = Phaser.Math.Linear(obj.x, dragX, 0.20);
            obj.y = Phaser.Math.Linear(obj.y, dragY, 0.20);

            obj.x = Phaser.Math.Clamp(obj.x, margin, width - margin);
            obj.y = Phaser.Math.Clamp(obj.y, margin, height - margin);

            obj.body.reset(obj.x, obj.y);
        });

        // Timer de seguridad
        this.released = false;
        this.finished = false;

        this.dragTimer = this.time.delayedCall(1100, () => {
            if (!this.released && !this.finished) {
                this.released = true;
                
                // Igual que al soltar: comprobar si está dentro
                if (Phaser.Geom.Intersects.CircleToCircle(this.orb, this.targetZone)) {
                    this.handleOverlap();
                } else {
                    this.finish("fail");
                }
            }
        });

        // Suelta el orbe
        this.input.on("dragend", () => {
            if (this.finished) return;
            this.released = true;
            this.dragTimer.remove(false);

            // Si no hubo overlap → fail
            if (!this.hasOverlapped) this.finish("fail");
        });
    }

    handleOverlap() {
        if (this.finished) return;
        this.hasOverlapped = true;

        // Determinar precisión según distancia al centro
        const dist = Phaser.Math.Distance.Between(
            this.orb.x, this.orb.y,
            this.targetZone.x, this.targetZone.y
        );

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
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const rect = this.add.rectangle(0, 0, width, height, color, 0.5).setOrigin(0);

        this.tweens.add({
            targets: rect,
            alpha: 0,
            duration: 300,
            onComplete: () => rect.destroy()
        });
    }
}

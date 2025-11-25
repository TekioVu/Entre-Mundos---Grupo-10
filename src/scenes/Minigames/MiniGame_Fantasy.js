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

        // Fondo
        this.add.rectangle(0, 0, width, height, 0x2d1b55).setOrigin(0);

        // --- CONFIG BORDES SEGUROS ---
        const margin = 50; // margen para no salir de pantalla

        // RANDOM TARGET (pero siempre dentro de pantalla)
        const targetSize = Phaser.Math.Between(30, 50);

        const targetX = Phaser.Math.Clamp(
            centerX + Phaser.Math.Between(-120, 120),
            margin,
            width - margin
        );
        const targetY = Phaser.Math.Clamp(
            centerY + Phaser.Math.Between(-140, 0),
            margin,
            height - margin
        );

        // Zona objetivo
        this.targetZone = this.add.circle(
            targetX,
            targetY,
            targetSize,
            0x00ff88,
            0.25
        ).setStrokeStyle(3, 0x00ffcc);

        // Movimiento del objetivo
        this.tweens.add({
            targets: this.targetZone,
            x: Phaser.Math.Clamp(
                this.targetZone.x + Phaser.Math.Between(-60, 60),
                margin,
                width - margin
            ),
            y: Phaser.Math.Clamp(
                this.targetZone.y + Phaser.Math.Between(-40, 40),
                margin,
                height - margin
            ),
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut"
        });

        // RANDOM ORB START (pero también dentro de pantalla)
        const orbX = Phaser.Math.Clamp(
            centerX + Phaser.Math.Between(-60, 60),
            margin,
            width - margin
        );
        const orbY = Phaser.Math.Clamp(centerY + 130, margin, height - margin);

        // Orbe
        this.orb = this.add.circle(
            orbX,
            orbY,
            25,
            0x88aaff
        ).setStrokeStyle(3, 0xffffff)
         .setInteractive();

        this.input.setDraggable(this.orb);

        // Arrastre suavizado + CLAMP para no salir de pantalla
        this.input.on("drag", (pointer, obj, dragX, dragY) => {
            // suavizado
            obj.x = Phaser.Math.Linear(obj.x, dragX, 0.20);
            obj.y = Phaser.Math.Linear(obj.y, dragY, 0.20);

            // límites de pantalla
            obj.x = Phaser.Math.Clamp(obj.x, margin, width - margin);
            obj.y = Phaser.Math.Clamp(obj.y, margin, height - margin);
        });

        // Tiempo límite
        this.released = false;
        this.dragTimer = this.time.delayedCall(1100, () => {
            if (!this.released) {
                this.released = true;
                this.finish();
            }
        });

        this.input.on("dragend", () => {
            if (this.released) return;
            this.released = true;

            this.dragTimer.remove(false);
            this.finish();
        });
    }

    finish() {
        const dist = Phaser.Math.Distance.Between(
            this.orb.x, this.orb.y,
            this.targetZone.x, this.targetZone.y
        );

        let result;

        const perfectRange = this.targetZone.radius * 0.35;
        const normalRange  = this.targetZone.radius * 0.9;

        if (dist < perfectRange) result = "perfect";
        else if (dist < normalRange) result = "normal";
        else result = "fail";

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

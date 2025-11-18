export default class Message extends Phaser.GameObjects.Container {
    constructor(scene, events) {
        super(scene, 160, 30);

        this.events = events; 

        this.graphics = this.scene.add.graphics();
        this.add(this.graphics);

        this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", {
            color: "#ffffff",
            align: "center",
            fontSize: 13,
            wordWrap: { width: 200, useAdvancedWrap: true } // puedes ajustar el wrap
        });
        this.text.setOrigin(0.5);
        this.add(this.text);

        this.events.on("Message", this.showMessage, this);

        this.visible = false;

        this.once(Phaser.GameObjects.Events.DESTROY, this.cleanup, this);
    }

    showMessage(text) {
        this.text.setText(text);

        // 🔥 Medimos el texto ya colocado
        const padding = 10;
        const width = this.text.width + padding * 2;
        const height = this.text.height + padding * 2;

        // 🔥 Redibujar el gráfico ajustado al tamaño
        this.graphics.clear();
        this.graphics.lineStyle(1, 0xffffff, 0.8);
        this.graphics.fillStyle(0x031f4c, 0.3);

        this.graphics.strokeRect(-width/2, -height/2, width, height);
        this.graphics.fillRect(-width/2, -height/2, width, height);

        this.visible = true;

        // temporizador como ya tenías
        if (this.hideEvent) this.hideEvent.remove(false);
        this.hideEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.hideMessage,
            callbackScope: this
        });
    }

    hideMessage() {
        this.hideEvent = null;
        this.visible = false;
    }

    cleanup() {
        if (this.events) {
            this.events.off("Message", this.showMessage, this);
        }
    }
}

export default class Message extends Phaser.GameObjects.Container {
    constructor(scene, events) {
        super(scene, 160, 30);

        this.events = events; 

        const graphics = this.scene.add.graphics();
        this.add(graphics);

        graphics.lineStyle(1, 0xffffff, 0.8);
        graphics.fillStyle(0x031f4c, 0.3);
        graphics.strokeRect(-90, -15, 180, 30);
        graphics.fillRect(-90, -15, 180, 30);

        this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", {
            color: "#ffffff",
            align: "center",
            fontSize: 13,
            wordWrap: { width: 160, useAdvancedWrap: true }
        });
        this.add(this.text);
        this.text.setOrigin(0.5);

        this.events.on("Message", this.showMessage, this);

        this.visible = false;

        this.once(Phaser.GameObjects.Events.DESTROY, this.cleanup, this);
    }

    showMessage(text) {
        this.text.setText(text);
        this.visible = true;
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

export default class MenuItem extends Phaser.GameObjects.Container {
    constructor(x, y, dato, scene) {
        super(scene, x, y);
        this.scene = scene;

        const bgColor = 0x1a1a1a;      // gris muy oscuro
        const borderColor = 0x3a3a3a;  // gris medio para borde
        const textColor = "#cccccc";   // gris claro para texto

        this.bg = scene.add.graphics();
        this.add(this.bg);

        this.dato = dato;

        if (dato.type === "icon") {
            this.boxWidth = 25;
            this.boxHeight = 25;

            // Fondo gris oscuro
            this.bg.fillStyle(bgColor, 1);
            this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);

            // Borde gris medio
            this.bg.lineStyle(2, borderColor, 1);
            this.bg.strokeRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);

            this.sprite = scene.add.sprite(0, 0, dato.key).setDisplaySize(40, 40);
            if (dato.key === 'ghost') this.sprite.setScale(0.15);
            else if (dato.key === 'goblin') this.sprite.setScale(0.5);
            else if (dato.key === 'wizard') this.sprite.setScale(0.2);
            else if (dato.key === 'timmy') this.sprite.setScale(0.45);

            this.add(this.sprite);
        } else {
            this.boxWidth = 70;
            this.boxHeight = 20;

            // Fondo gris oscuro
            this.bg.fillStyle(bgColor, 1);
            this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);

            // Borde gris medio
            this.bg.lineStyle(2, borderColor, 1);
            this.bg.strokeRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);

            // Texto gris claro
            this.text = scene.add.text(0, 0, dato.key, {
                color: textColor,
                align: "center",
                fontSize: "14px"
            }).setOrigin(0.5);

            this.add(this.text);
        }
    }

    select() {
        const hoverBg = 0x2a2a2a;      // gris más claro para hover
        const borderColor = 0x3a3a3a;

        this.bg.clear();

        // Fondo hover
        this.bg.fillStyle(hoverBg, 1);
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);

        // Borde
        this.bg.lineStyle(2, borderColor, 1);
        this.bg.strokeRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);

        // Texto
        if (this.text) this.text.setColor("#ffffff"); // más contraste al seleccionar
    }

    deselect() {
        const bgColor = 0x1a1a1a;
        const borderColor = 0x3a3a3a;

        this.bg.clear();

        // Fondo normal
        this.bg.fillStyle(bgColor, 1);
        this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);

        // Borde normal
        this.bg.lineStyle(2, borderColor, 1);
        this.bg.strokeRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 6);

        // Texto
        if (this.text) this.text.setColor("#cccccc");
    }

    getDataKey() {
        return this.dato.key;
    }
}

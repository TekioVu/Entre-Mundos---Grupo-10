export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: "IntroScene" });
        console.log("2");
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Fondo oscuro
        this.add.rectangle(0, 0, width, height, 0x1e1e2f).setOrigin(0);

        // Historias a mostrar
        const story = [
            "Timmy siempre ha amado los libros...",
            "Un día, su gato desaparece misteriosamente",
            "Entre las páginas de cinco libros mágicos se encuentra la única pista",
            "Cada libro guarda peligros, enemigos y aliados dispuestos a ayudar",
            "Para rescatar a su gato, Timmy deberá superar todos los desafíos",
            "Su viaje comienza ahora: el Libro de Fantasía..."
        ];

        let lineIndex = 0;

        // Texto principal
        const text = this.add.text(centerX, centerY, story[lineIndex], {
            fontSize: "28px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
            align: "center",
            wordWrap: { width: width - 15, useAdvancedWrap: true }
        }).setOrigin(0.5).setAlpha(0);

        const spaceIcon = this.add.text(centerX - 80, centerY + 100, "[SPACE] Continuar", {
            fontSize: "16px",
            fontFamily: "Arial",
            color: "#ffffff"
        }).setOrigin(0.5);

        // Icono indicador de avance
        const advanceIcon = this.add.text(centerX + 120, centerY + 100, "⏎ Omitir", {
            fontSize: "16px",
            fontFamily: "Arial",
            color: "#ffffff"
        }).setOrigin(0.5).setAlpha(0.8);

        // Animaciones de entrada
        this.tweens.add({
            targets: text,
            alpha: 1,
            duration: 600,
            ease: "Power2"
        });
        this.tweens.add({
            targets: advanceIcon,
            alpha: 0.9,
            yoyo: true,
            repeat: -1,
            duration: 600
        });

        // Función para mostrar siguiente línea
        const showNextLine = () => {
            lineIndex++;
            if (lineIndex < story.length) {
                this.tweens.add({
                    targets: text,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => {
                        text.setText(story[lineIndex]);
                        this.tweens.add({
                            targets: text,
                            alpha: 1,
                            duration: 300
                        });
                    }
                });
            } else {
                // Pasar al menú o siguiente escena
                this.scene.start("MenuScene", { firstTime: true, parent: this });
            }
        };

        // Captura la barra espaciadora
        this.input.keyboard.on('keydown-SPACE', (event) => {
            event.preventDefault();
            showNextLine();
        });

        this.input.keyboard.on('keydown-ENTER', (event) => {
            this.scene.start("MenuScene", { firstTime: true, parent: this });
        });

        // También permitir click/tap para avanzar
        this.input.on('pointerdown', showNextLine);
    }
}

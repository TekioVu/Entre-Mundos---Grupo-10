import BootScene from "./scenes/BootScene.js";
import BattleScene from "./scenes/BattleScene.js";
import UIScene from "./scenes/UIScene.js";
import MenuScene from "./scenes/MenuScene.js";
import GameOverScene from "./scenes/GameOverScene.js";

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 } }
    },
    scene: [BootScene, BattleScene, UIScene, MenuScene, GameOverScene]
};

new Phaser.Game(config);

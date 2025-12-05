import BootScene from "./scenes/BootScene.js";
import BattleScene from "./scenes/BattleScene.js";
import UIScene from "./scenes/UIScene.js";
import MenuScene from "./scenes/MenuScene.js";
import GameOverScene from "./scenes/GameOverScene.js";
import VictoryScene from "./scenes/VictoryScene.js";
import ShopScene from "./scenes/ShopScene.js";
import CharacterSelectionScene from "./scenes/CharacterSelectionScene.js";
import MiniGame_Fantasy from "./scenes/Minigames/MiniGame_Fantasy.js";
import MiniGame_Comedy from "./scenes/Minigames/MiniGame_Comedy.js";
import MiniGame_FinalBoss from "./scenes/Minigames/MiniGame_FinalBoss.js";
import MiniGame_History from "./scenes/Minigames/MiniGame_History.js";
import MiniGame_Terror from "./scenes/Minigames/MiniGame_Terror.js";
import IntroScene from "./scenes/IntroScene.js";
import KidnapScene from "./scenes/KidnapScene.js";


const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 320,
    height: 240,
    zoom: 3,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 } }
    },
    scene: [BootScene, KidnapScene, IntroScene,BattleScene, UIScene, MenuScene, GameOverScene, VictoryScene, CharacterSelectionScene, ShopScene, 
        MiniGame_Fantasy, MiniGame_Comedy, MiniGame_FinalBoss, MiniGame_History, MiniGame_Terror]
};

new Phaser.Game(config);

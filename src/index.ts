import Phaser from "phaser";
import {GAME_CONFIG} from "./config/gameConfig";
import {GameScene} from "./scenes/GameScene";

new Phaser.Game({
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    parent: "game",
    backgroundColor: "#ffb0b0",
    scene: [GameScene]
});

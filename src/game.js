import Phaser from "phaser";
import BootScene from "./scenes/BootScene"
import CafeScene from "./scenes/CafeScene"

export function createGame() {
    const config = {
        type: Phaser.AUTO,
        parent: "app",
        backgroundColor: "#111111",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 960,
            height: 540
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 0 },
                debug: false
            },
        },
        scene: [BootScene, CafeScene]
    }

    return new Phaser.Game(config)
}
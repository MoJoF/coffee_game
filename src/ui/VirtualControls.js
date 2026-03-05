import Phaser from "phaser";

export default class VirtualControls {
    constructor(scene) {
        this.scene = scene

        this.dir = new Phaser.Math.Vector2(0, 0)
        this.interactPressed = false

        this.isMobile = 
            scene.sys.game.device.os.android ||
            scene.sys.game.device.os.iOS ||
            scene.sys.game.device.os.iPad
        
        if (!this.isMobile) return

        const w = scene.scale.width
        const h = scene.scale.height

        this.base = scene.add.circle(120, h - 120, 70, 0x000000, 0.35).setDepth(900).setScrollFactor(0)
        this.base.setStrokeStyle(2, 0xffffff, 0.6)

        this.knob = scene.add.circle(120, h - 120, 30, 0xffffff, 0.5).setDepth(901).setScrollFactor(0)

        this.pointerId = null
        this.basePos = new Phaser.Math.Vector2(this.base.x, this.base.y)
        this.knobPos = new Phaser.Math.Vector2(this.knob.x, this.knob.y)

        this.btn = scene.add.circle(w - 120, h - 120, 52, 0x000000, 0.35).setDepth(900).setScrollFactor(0)
        this.btn.setStrokeStyle(2, 0xffffff, 0.6)

        this.btnText = scene.add.text(w - 132, h - 136, "E", {
            fontFamily: "monospace",
            fontSize: "40px",
            color: "#ffffff"
        }).setDepth(901).setScrollFactor(0)

        this.btn.setInteractive(new Phaser.Geom.Circle(this.btn.x, this.btn.y, this.btn.radius), Phaser.Geom.Circle.Contains)

        this.btn.on("pointerdown", () => (this.interactPressed = true))
        this.btn.on("pointerup", () => (this.interactPressed = false))
        this.btn.on("pointerout", () => (this.interactPressed = false))

        scene.input.on("pointerdown", (p) => {
            if (this.btn.getBounds().contains(p.x, p.y)) return

            const dx = p.x
        })
    }
}
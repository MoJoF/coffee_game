import Phaser from "phaser";

export default class Interactables {
    constructor(scene, player, dialogue, options = {}) {
        this.scene = scene;
        this.player = player;
        this.dialogue = dialogue;

        this.interactKey = options.interactKey; // Phaser Key (E/Space)
        this.virtualControls = options.virtualControls; // твой mobile контроллер

        this.items = [];
        this.nearest = null;

        this.hint = scene.add.text(0, 0, "E", {
            fontFamily: "monospace",
            fontSize: "22px",
            color: "#ffffff",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: { x: 6, y: 3 },
        })
            .setDepth(950)
            .setVisible(false)
            .setOrigin(0.5);

        this.hintOffsetY = options.hintOffsetY ?? -50;
    }

    addRect({ x, y, w, h, text, prompt = "E", onInteract = null }) {
        const zone = this.scene.add.zone(x, y, w, h);
        this.scene.physics.add.existing(zone, true);

        const item = { zone, text, prompt, onInteract };
        this.items.push(item);

        return item;
    }

    _findNearestOverlapping() {
        let best = null;
        let bestDist = Infinity;

        const px = this.player.x;
        const py = this.player.y;

        for (const item of this.items) {
            // arcade overlap check
            const overlapping = this.scene.physics.overlap(this.player, item.zone);
            if (!overlapping) continue;

            const dx = item.zone.x - px;
            const dy = item.zone.y - py;
            const d = dx * dx + dy * dy;

            if (d < bestDist) {
                bestDist = d;
                best = item;
            }
        }

        return best;
    }

    update() {
        // Если диалог открыт — E закрывает/пропускает, и мы не показываем подсказку
        const interactPressed =
            (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey)) ||
            (this.virtualControls?.consumeInteractJustPressed?.() ?? false);

        if (this.dialogue.visible) {
            this.hint.setVisible(false);
            if (interactPressed) this.dialogue.skipOrClose();
            return;
        }

        this.nearest = this._findNearestOverlapping();

        if (this.nearest) {
            this.hint.setText(this.nearest.prompt);
            this.hint.setPosition(this.nearest.zone.x, this.nearest.zone.y + this.hintOffsetY);
            this.hint.setVisible(true);

            if (interactPressed) {
                if (typeof this.nearest.onInteract === "function") {
                    // кастомная логика (например открыть меню кофе)
                    this.nearest.onInteract();
                } else {
                    // обычный диалог
                    this.dialogue.show(this.nearest.text ?? "...");
                }
            }
        } else {
            this.hint.setVisible(false);
        }
    }
}
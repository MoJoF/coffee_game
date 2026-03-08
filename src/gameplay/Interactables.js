import Phaser from "phaser";

export default class Interactables {
    constructor(scene, player, dialogue, options = {}) {
        this.scene = scene;
        this.player = player;
        this.dialogue = dialogue;

        this.interactKey = options.interactKey;
        this.virtualControls = options.virtualControls;

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

    addRect({
        x,
        y,
        w,
        h,
        text,
        prompt = "E",
        onInteract = null,
        showZone = false,
        zoneColor = 0x00ff00,
        zoneAlpha = 0.25,
        hintOffsetY = null
    }) {
        const zone = this.scene.add.zone(x, y, w, h);
        this.scene.physics.add.existing(zone, true);

        let debugRect = null;

        if (showZone) {
            debugRect = this.scene.add.rectangle(x, y, w, h, zoneColor, zoneAlpha)
                .setDepth(900)
                .setOrigin(0.5);
        }

        const item = { zone, text, prompt, onInteract, debugRect, hintOffsetY };
        this.items.push(item);

        return item;
    }

    addRectForObject(sprite, {
        offsetX = 0,
        offsetY = 0,
        extraWidth = 0,
        extraHeight = 0,
        text,
        prompt = "E",
        onInteract = null,
        showZone = false,
        zoneColor = 0x00ff00,
        zoneAlpha = 0.25,
        hintOffsetY = null
    }) {
        const x = sprite.x + sprite.displayWidth / 2 + offsetX;
        const y = sprite.y + sprite.displayHeight / 2 + offsetY;
        const w = sprite.displayWidth + extraWidth;
        const h = sprite.displayHeight + extraHeight;

        return this.addRect({
            x,
            y,
            w,
            h,
            text,
            prompt,
            onInteract,
            showZone,
            zoneColor,
            zoneAlpha,
            hintOffsetY
        });
    }

    _findNearestOverlapping() {
        let best = null;
        let bestDist = Infinity;

        const px = this.player.x;
        const py = this.player.y;

        for (const item of this.items) {
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
            const hintOffsetY = this.nearest.hintOffsetY ?? this.hintOffsetY
            this.hint.setText(this.nearest.prompt);
            this.hint.setPosition(this.nearest.zone.x, this.nearest.zone.y + hintOffsetY);
            this.hint.setVisible(true);

            if (interactPressed) {
                if (typeof this.nearest.onInteract === "function") {
                    this.nearest.onInteract();
                } else {
                    if (Array.isArray(this.nearest.text)) {
                        this.dialogue.showSequence(this.nearest.text);
                    } else {
                        this.dialogue.show(this.nearest.text ?? "...");
                    }
                }
            }
        } else {
            this.hint.setVisible(false);
        }
    }
}
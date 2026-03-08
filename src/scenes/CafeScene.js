import Phaser from "phaser";
import DialogueBox from "../ui/DialogueBox";
import VirtualControls from "../ui/VirtualControls";
import Interactables from "../gameplay/Interactables";


export default class CafeScene extends Phaser.Scene {
    constructor() {
        super("CafeScene");
    }

    createWall(player) {
        const w = this.scale.width
        const h = this.scale.height
        const sceneWidth = this.scale.width
        const tileSize = 16
        const wallY = 0

        this.wallLayer = this.add.layer()

        for (let x = 0; x < sceneWidth; x += tileSize * 3) {
            const tile = this.add.image(x, wallY, "cafe_atlas", "wall")
            tile.setScale(3)
            tile.setOrigin(0, 0)
            this.wallLayer.add(tile)
        }

        this.topWallCollider = this.add.rectangle(
            sceneWidth / 2,
            tileSize * 5.75,
            sceneWidth,
            8,
            0x000000,
            0
        )

        this.physics.add.existing(this.topWallCollider, true)
        this.physics.add.collider(player, this.topWallCollider)

        this.leftBound = this.add.rectangle(0, h / 2, 1, h, 0x00ff00, 0)
        this.leftBound.setOrigin(0, 0.5)
        this.physics.add.existing(this.leftBound, true)

        this.rightBound = this.add.rectangle(w, h / 2, 1, h, 0x00ff00, 0)
        this.rightBound.setOrigin(0, 0.5)
        this.physics.add.existing(this.rightBound, true)

        this.bottomBound = this.add.rectangle(w / 2, h, w, 1, 0x00ff00, 0)
        this.bottomBound.setOrigin(0.5, 0)
        this.physics.add.existing(this.bottomBound, true)

        this.physics.add.collider(player, this.leftBound)
        this.physics.add.collider(player, this.rightBound)
        this.physics.add.collider(player, this.bottomBound)
    }

    drawFloor() {
        const w = this.scale.width
        const h = this.scale.height
        const scale = 5
        const tileSize = 16 * scale
        const wallHeight = 16 * scale

        this.floorLayer = this.add.layer()

        for (let y = wallHeight; y < h; y += tileSize) {
            for (let x = 0; x < w; x += tileSize) {
                const tile = this.add.image(x, y, "cafe_atlas", "floor")
                tile.setScale(scale)
                tile.setOrigin(0, 0)
                this.floorLayer.add(tile)
            }
        }
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        // UI
        this.dialogue = new DialogueBox(this);
        this.vc = new VirtualControls(this);

        // Фон (пол)
        this.drawFloor()

        // --- Игрок ---
        this.player = this.add.rectangle(w / 2, h / 2, 28, 28, 0xffffff);
        this.physics.add.existing(this.player);

        // --- Стены / границы ---
        // ВАЖНО: rectangle -> add.rectangle(), а физику добавляем отдельно через physics.add.existing(obj, true)
        this.createWall(this.player)

        // Отрисовка барной стойки
        this.counter = this.add.image(0, 70, "cafe_atlas", "counter")
            .setScale(5)
            .setOrigin(0, 0)
        this.counterCollider = this.add.rectangle(
            0 + this.counter.displayWidth / 2,
            70 + this.counter.displayHeight / 2,
            this.counter.displayWidth,
            this.counter.displayHeight,
            0xff0000,
            0
        )
        this.physics.add.existing(this.counterCollider, true)
        this.physics.add.collider(this.player, this.counterCollider)

        // Отрисовка часов
        this.clock = this.add.image(500, 20, "cafe_atlas", "clock")
            .setScale(2.5)
            .setOrigin(0)

        // Настройки тела игрока
        /** @type {Phaser.Physics.Arcade.Body} */
        const pBody = this.player.body;
        pBody.setCollideWorldBounds(true);
        pBody.setSize(28, 28, true);

        // Клавиатура (ПК)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            E: Phaser.Input.Keyboard.KeyCodes.E,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.interactables = new Interactables(this, this.player, this.dialogue, {
            interactKey: this.keys.E,
            virtualControls: this.vc,
            hintOffsetY: -70,
        });

        // this.interactables.addRect({
        //     x: this.counter.x,
        //     y: this.counter.y - 40,
        //     w: 260,
        //     h: 120,
        //     text: "Стойка липкая от сиропа. Кто-то опять пролил карамель.",
        // });

        this.interactables.addRect({
            x: (0 + this.counter.displayWidth) / 2,
            y: (70 + this.counter.displayHeight / 2) + 40,
            w: this.counter.displayWidth,
            h: this.counter.displayHeight,
            prompt: "Нажмите \"E\"",
            text: [
                "Барная стойка пахнет кофе.",
                "На дереве остались липкие следы сиропа.",
                "Сегодня будет шумно."
            ],
        });

        this.interactables.addRect({
            x: 480 + this.clock.displayWidth,
            y: 5 + this.clock.displayHeight,
            w: this.clock.displayWidth,
            h: this.clock.displayHeight,
            showZone: true,
            prompt: "Нажмите \"E\"",
            text: [
                "17:12"
            ],
        });

        // this.interactables.addRect({
        //     x: 760,
        //     y: 260,
        //     w: 160,
        //     h: 120,
        //     prompt: "E",
        //     onInteract: () => {
        //         this.dialogue.show("Касса молчит. Терминал ждёт карту, но сегодня покупателей мало.");
        //     },
        // });

        this.input.on("pointerdown", () => {
            if (this.dialogue.visible) this.dialogue.skipOrClose();
        });
    }

    update() {
        const speed = 180;
        let vx = 0;
        let vy = 0;

        const left = this.cursors.left.isDown || this.keys.A.isDown;
        const right = this.cursors.right.isDown || this.keys.D.isDown;
        const up = this.cursors.up.isDown || this.keys.W.isDown;
        const down = this.cursors.down.isDown || this.keys.S.isDown;

        if (left) vx -= 1;
        if (right) vx += 1;
        if (up) vy -= 1;
        if (down) vy += 1;

        if (this.vc?.dir) {
            if (Math.abs(this.vc.dir.x) > 0.05 || Math.abs(this.vc.dir.y) > 0.05) {
                vx = this.vc.dir.x;
                vy = this.vc.dir.y;
            }
        }

        const v = new Phaser.Math.Vector2(vx, vy);
        if (v.length() > 1) v.normalize();

        const pBody = this.player.body;
        pBody.setVelocity(v.x * speed, v.y * speed);

        this.interactables.update();
    }
}
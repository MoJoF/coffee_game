import Phaser from "phaser";
import DialogueBox from "../ui/DialogueBox";
import VirtualControls from "../ui/VirtualControls";
import Interactables from "../gameplay/Interactables";


export default class CafeScene extends Phaser.Scene {
    constructor() {
        super("CafeScene");
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        // UI
        this.dialogue = new DialogueBox(this);
        this.vc = new VirtualControls(this);

        // Фон (пол)
        this.add.rectangle(w / 2, h / 2, w, h, 0x1a1a1a);

        // --- Стены / границы ---
        // ВАЖНО: rectangle -> add.rectangle(), а физику добавляем отдельно через physics.add.existing(obj, true)
        this.walls = [];

        const topWall = this.add.rectangle(w / 2, 10, w, 20, 0x333333);
        this.physics.add.existing(topWall, true);
        this.walls.push(topWall);

        const bottomWall = this.add.rectangle(w / 2, h - 10, w, 20, 0x333333);
        this.physics.add.existing(bottomWall, true);
        this.walls.push(bottomWall);

        const leftWall = this.add.rectangle(10, h / 2, 20, h, 0x333333);
        this.physics.add.existing(leftWall, true);
        this.walls.push(leftWall);

        const rightWall = this.add.rectangle(w - 10, h / 2, 20, h, 0x333333);
        this.physics.add.existing(rightWall, true);
        this.walls.push(rightWall);

        // --- Игрок ---
        this.player = this.add.rectangle(w / 2, h / 2, 28, 28, 0xffffff);
        this.physics.add.existing(this.player); 

        // Настройки тела игрока
        /** @type {Phaser.Physics.Arcade.Body} */
        const pBody = this.player.body;
        pBody.setCollideWorldBounds(true);
        pBody.setSize(28, 28, true);

        // Коллизии игрока со стенами
        for (const wall of this.walls) {
            this.physics.add.collider(this.player, wall);
        }

        // --- “Стойка” как декор (можно сделать коллизией тоже) ---
        this.counter = this.add.rectangle(w / 2, h / 2 + 120, 240, 40, 0x555555);
        this.physics.add.existing(this.counter, true);
        this.physics.add.collider(this.player, this.counter);

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

        this.interactables.addRect({
            x: this.counter.x,
            y: this.counter.y - 40,
            w: 260,
            h: 120,
            text: "Стойка липкая от сиропа. Кто-то опять пролил карамель.",
        });

        this.interactables.addRect({
            x: this.counter.x,
            y: this.counter.y - 40,
            w: 260,
            h: 120,
            text: "Стойка липкая от сиропа. Кто-то опять пролил карамель.",
        });

        this.interactables.addRect({
            x: 760,
            y: 260,
            w: 160,
            h: 120,
            prompt: "E",
            onInteract: () => {
                this.dialogue.show("Касса молчит. Терминал ждёт карту, но сегодня покупателей мало.");
            },
        });

        this.input.on("pointerdown", () => {
            if (this.dialogue.visible) this.dialogue.skipOrClose();
        });


        this.add.image(500, 150, "cafe_atlas", "burger").setScale(3)
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
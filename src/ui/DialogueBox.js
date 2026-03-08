import Phaser from "phaser";

export default class DialogueBox {
  constructor(scene) {
    this.scene = scene;

    const w = scene.scale.width;
    const h = scene.scale.height;

    this.container = scene.add.container(0, 0).setDepth(1000).setVisible(false);

    this.panel = scene.add.rectangle(w / 2, h - 110, w - 60, 160, 0x000000, 0.85);
    this.panel.setStrokeStyle(4, 0xffffff, 1);

    this.portrait = scene.add.rectangle(90, h - 110, 90, 90, 0x222222, 1);
    this.portrait.setStrokeStyle(2, 0xffffff, 1);

    this.text = scene.add.text(150, h - 170, "", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#ffffff",
      wordWrap: { width: w - 220 },
    });

    this.container.add([this.panel, this.portrait, this.text]);

    this.fullText = "";
    this.isTyping = false;
    this.typingEvent = null;

    this.lines = [];
    this.currentLineIndex = 0;
    this.onSequenceComplete = null;
  }

  show(message) {
    this.container.setVisible(true);
    this.lines = [message];
    this.currentLineIndex = 0;
    this.onSequenceComplete = null;
    this._showCurrentLine();
  }

  showSequence(lines, onComplete = null) {
    this.container.setVisible(true);
    this.lines = lines;
    this.currentLineIndex = 0;
    this.onSequenceComplete = onComplete;
    this._showCurrentLine();
  }

  _showCurrentLine() {
    const message = this.lines[this.currentLineIndex] ?? "";
    this.setTextTyped(message);
  }

  hide() {
    this.stopTyping();
    this.container.setVisible(false);
    this.text.setText("");
    this.lines = [];
    this.currentLineIndex = 0;

    if (this.onSequenceComplete) {
      const callback = this.onSequenceComplete;
      this.onSequenceComplete = null;
      callback();
    }
  }

  stopTyping() {
    this.isTyping = false;
    if (this.typingEvent) {
      this.typingEvent.remove(false);
      this.typingEvent = null;
    }
  }

  setTextTyped(message) {
    this.stopTyping();

    this.fullText = message;
    this.text.setText("");
    this.isTyping = true;

    let i = 0;
    this.typingEvent = this.scene.time.addEvent({
      delay: 22,
      loop: true,
      callback: () => {
        if (!this.isTyping) return;

        i++;
        this.text.setText(this.fullText.slice(0, i));

        if (i >= this.fullText.length) {
          this.isTyping = false;
          this.stopTyping();
        }
      },
    });
  }

  next() {
    if (!this.container.visible) return;

    if (this.isTyping) {
      this.stopTyping();
      this.text.setText(this.fullText);
      return;
    }

    this.currentLineIndex++;

    if (this.currentLineIndex >= this.lines.length) {
      this.hide();
      return;
    }

    this._showCurrentLine();
  }

  skipOrClose() {
    this.next();
  }

  get visible() {
    return this.container.visible;
  }
}
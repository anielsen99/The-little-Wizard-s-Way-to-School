class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
    }
  
    preload() {
      // Assets laden
      this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');

      this.load.image('mushroom', 'media/mushroom.png');
      this.load.image('tree-resin', 'media/tree-resin.png');
      this.load.image('herbs', 'media/herbs.png');
    }
  
    create() {
      // 1. Boden / Plattformen
      const platforms = this.physics.add.staticGroup();
      platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  
      // 2. Kleiner Zauberer (Platzhalter-Grafik)
      const wizardGfx = this.add.graphics();
      wizardGfx.fillStyle(0x79529f, 1);
      wizardGfx.fillRect(0, 0, 24, 32);
      wizardGfx.generateTexture('wizardPlaceholder', 64, 96);
      wizardGfx.destroy();
  
      this.wizard = this.physics.add.sprite(100, 450, 'wizardPlaceholder');
      this.wizard.setCollideWorldBounds(true);
      this.wizard.setBounce(0.1);
  
      this.physics.add.collider(this.wizard, platforms);

      const item_mushroom = this.add.image(100, 300, 'mushroom');
      const item_treeresin = this.add.image(500, 450, 'tree-resin');
      const item_herbs = this.add.image(200, 450, 'herbs');
      //item.setScale(0.05);
  
      // 3. Tastatursteuerung
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      });
    }
  
    update() {
      const left = this.cursors.left.isDown || this.wasd.left.isDown;
      const right = this.cursors.right.isDown || this.wasd.right.isDown;
      const jump = this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.space.isDown;
  
      if (left) {
        this.wizard.setVelocityX(-160);
      } else if (right) {
        this.wizard.setVelocityX(160);
      } else {
        this.wizard.setVelocityX(0);
      }
  
      if (jump && this.wizard.body.touching.down) {
        this.wizard.setVelocityY(-350);
      }
    }
  }
  
  // Konfiguration
  const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#07150d',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 600 },
        debug: true
      }
    },
    scene: [GameScene]
  };
  
  const game = new Phaser.Game(config);
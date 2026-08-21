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
      this.load.image('wizard', 'media/wizard-standing-right.png');

      // Audio laden (aus dem Phaser Labs Beispiel)
      this.load.audio('CatAstroPhi', [
        'https://labs.phaser.io/assets/audio/CatAstroPhi_shmup_normal.ogg',
        'https://labs.phaser.io/assets/audio/CatAstroPhi_shmup_normal.mp3'
      ]);
    }
  
    create() {
      // Level Höhe und Breite
      const levelWidth = 2400;
      const levelHeight = 720;

      // Physik-Grenzen der Spielwelt
      this.physics.world.setBounds(0, 0, levelWidth, levelHeight);

      // Plattform-Gruppe erstellen und Plattformen im Level verteilen
      const platforms = this.physics.add.staticGroup();
      
      // Durchgehender Boden über das gesamte Level
      for (let x = 0; x < levelWidth; x += 400) {
        platforms.create(x + 200, 584, 'ground').setScale(1).refreshBody();
      }

      // Schwebende Plattformen auf verschiedenen Höhen
      platforms.create(500, 490, 'ground');
      platforms.create(950, 320, 'ground');
      platforms.create(1350, 420, 'ground');
      platforms.create(1700, 260, 'ground');
      platforms.create(2100, 380, 'ground');
  
      // Zauberer (Platzhalter-Grafik)
      const wizardGfx = this.add.graphics();
      wizardGfx.fillStyle(0x79529f, 1);
      wizardGfx.fillRect(0, 0, 24, 32);
      wizardGfx.generateTexture('wizard', 64, 96);
      wizardGfx.destroy();
  
      this.wizard = this.physics.add.sprite(100, 450, 'wizard');
      this.wizard.setCollideWorldBounds(true);
      this.wizard.setBounce(0.1);
  
      this.physics.add.collider(this.wizard, platforms);
      
      // Items
      const item_mushroom = this.add.image(100, 300, 'mushroom');
      const item_treeresin = this.add.image(500, 450, 'tree-resin');
      const item_herbs = this.add.image(200, 450, 'herbs');
  

      // Kamera konfigurieren
      this.cameras.main.setBounds(0, 0, levelWidth, levelHeight); // Kamera darf nicht über das Level hinausfilmen
      this.cameras.main.startFollow(this.wizard, true, 0.08, 0.08); // Verfolgt den Zauberer mit sanfter Verzögerung (Lerp)
  
      // Tastatursteuerung
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      });

      // Musik implementieren
      this.bgMusic = this.sound.add('CatAstroPhi', {
        volume: 0.3, // Lautstärke (0.0 bis 1.0)
        loop: true   // Endlosschleife
      });
  
      // Musik starten
      this.bgMusic.play();
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
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Assets laden
    // Obstacles
    this.load.image('ground', 'media/obstacles/ground.png')
    this.load.image('plattform', 'media/obstacles/plattform.png');

    //Castle
    this.load.image('castle-closed', 'media/castle/castle-closed.png');

    //Items
    this.load.image('mushroom', 'media/items/mushroom.png');
    this.load.image('tree-resin', 'media/items/tree-resin.png');
    this.load.image('herbs', 'media/items/herbs.png');

    //Wizard
    this.load.spritesheet('wizard', 'media/wizard/spritesheet-wizard.png', {
      frameWidth: 68,
      frameHeight: 104
    });

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

    // Schloss platzieren
    const castle_closed = this.add.image(1210, 440, 'castle-closed');

    // Plattform-Gruppe erstellen und Plattformen im Level verteilen
    const platforms = this.physics.add.staticGroup();

    // Durchgehender Boden über das gesamte Level
    for (let x = 0; x < levelWidth; x += 204) {
      platforms.create(x + 100, 688, 'ground').setScale(1).refreshBody();
    }

    // Schwebende Plattformen auf verschiedenen Höhen
    platforms.create(500, 490, 'plattform');
    platforms.create(950, 320, 'plattform');
    platforms.create(1350, 420, 'plattform');
    platforms.create(1700, 260, 'plattform');
    platforms.create(2100, 380, 'plattform');


    // Wizard
    // 1. Figur erstellen (nutzt standardmäßig Frame 0)
    this.wizard = this.physics.add.sprite(100, 450, 'wizard');
    this.wizard.setCollideWorldBounds(true);
    this.wizard.setBounce(0.1);
    this.physics.add.collider(this.wizard, platforms);

    // 2. Lauf-Animation anlegen
    this.anims.create({
      key: 'walk',
      // Frame-Reihenfolge definieren: 0, 1, 0, 2
      frames: this.anims.generateFrameNumbers('wizard', { frames: [0, 1, 0, 2] }),
      frameRate: 8,     // Wie schnell die Bilder wechseln (8 Bilder pro Sekunde)
      repeat: -1        // -1 bedeutet: Die Animation wiederholt sich endlos
    });


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

    // 1. Horizontale Bewegung & Richtung
    if (right) {
      this.wizard.setVelocityX(160);
      this.wizard.setFlipX(false);
    } else if (left) {
      this.wizard.setVelocityX(-160);
      this.wizard.setFlipX(true);
    } else {
      this.wizard.setVelocityX(0);
    }

    // 2. Sprung-Impuls auslösen (nur wenn Bodenberührung besteht)
    if (jump && this.wizard.body.touching.down) {
      this.wizard.setVelocityY(-350);
    }

    // 3. Grafische Zuweisung: Luft zustand vs. Bodenzustand
    if (!this.wizard.body.touching.down) {
      // FIGURE IST IN DER LUFT:
      this.wizard.anims.stop(); // Lauf-Animation pausieren/stoppen
      this.wizard.setFrame(1);  // Frame 1 als Sprung-Bild erzwingen
    } else {
      // FIGURE IST AUF DEM BODEN:
      if (left || right) {
        this.wizard.anims.play('walk', true); // Laufen abspielen
      } else {
        this.wizard.anims.stop();
        this.wizard.setFrame(0);             // Standbild (Frame 0)
      }
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
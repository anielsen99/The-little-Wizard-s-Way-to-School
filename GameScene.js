import { HUD } from './HUD.js';
import { Overlay } from './Overlay.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Assets laden

    // Hintergrund
    this.load.image('background', 'media/background_2.jpg')

    // Castle
    this.load.image('castle-closed', 'media/castle/castle-closed.png');

    // Items
    this.load.image('mushroom', 'media/items/mushroom.png');
    this.load.image('tree-resin', 'media/items/tree-resin.png');
    this.load.image('herbs', 'media/items/herbs.png');

    // Wizard
    this.load.spritesheet('wizard', 'media/wizard/spritesheet-wizard.png', {
      frameWidth: 68,
      frameHeight: 104
    });

    // Tiles
    this.load.image('tiles-set', 'media/tiles.png');

    // Map Level 1
    this.load.tilemapTiledJSON('map', 'maps/level-1.tmj');

    // Audio laden (aus dem Phaser Labs Beispiel)
    this.load.audio('CatAstroPhi', [
      'https://labs.phaser.io/assets/audio/CatAstroPhi_shmup_normal.ogg',
      'https://labs.phaser.io/assets/audio/CatAstroPhi_shmup_normal.mp3'
    ]);
  };

  create() {
    // Level Höhe und Breite
    const levelWidth = 2400;
    const levelHeight = 720;

    // Hintergrund
    const bg = this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(1280, 720)   // Passt das Bild an die Bildschirmgröße an
      .setScrollFactor(0);         // 0 = fixiert am Bildschirm (scrollt nicht weg)

    // Physik-Grenzen der Spielwelt
    this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
    this.physics.world.setBoundsCollision(true, true, false, false);

    // Schloss platzieren
    const castle_closed = this.add.image(2330, 440, 'castle-closed');

    // Tilemap aus dem Cache erstellen
    const map = this.make.tilemap({ key: 'map' });
    // Tileset verknüpfen
    const tileset = map.addTilesetImage('tiles', 'tiles-set');
    // Ebene erstellen
    const groundLayer = map.createLayer('plattforms', tileset, 0, 0);

    // 4. Kollision für alle Kacheln aktivieren, die nicht leer sind
    groundLayer.setCollisionByExclusion([-1]);

    // Wizard
    // 1. Figur erstellen (nutzt standardmäßig Frame 0)
    this.wizard = this.physics.add.sprite(100, 450, 'wizard');
    this.wizard.setBounce(0.1);
    this.wizard.setCollideWorldBounds(true);
    this.physics.add.collider(this.wizard, groundLayer);
    this.isDead = false;

    // 2. Lauf-Animation anlegen
    this.anims.create({
      key: 'walk',
      // Frame-Reihenfolge definieren: 0, 1, 0, 2
      frames: this.anims.generateFrameNumbers('wizard', { frames: [0, 1, 0, 2] }),
      frameRate: 8,     // Wie schnell die Bilder wechseln (8 Bilder pro Sekunde)
      repeat: -1        // -1 bedeutet: Die Animation wiederholt sich endlos
    });

    // ----------------------------
    // Items
    // ----------------------------
    // 1. Eine STATISCHE Physik-Gruppe für alle Items erstellen
    this.items = this.physics.add.staticGroup();

    // Liest alle Punkte aus der Tiled-Objektebene namens 'Items' aus
    const itemLayer = map.getObjectLayer('items');
    if (itemLayer) {
      itemLayer.objects.forEach(obj => {
        // Erstellt das Item an den Koordinaten aus Tiled mit der Textur obj.name ('mushroom', 'tree-resin', 'herbs')
        this.items.create(obj.x, obj.y, obj.name);
      });
    }

    // 3. Zähler-Objekt für dein Inventar
    this.inventory = {
      'mushroom': 0,
      'tree-resin': 0,
      'herbs': 0
    };

    // Quoten für Level 1 festlegen
    this.quotas = {
      'mushroom': 2,
      'tree-resin': 2,
      'herbs': 2
    };

    // HUD & Overlay initialisieren
    this.hud = new HUD(this);
    this.hud.create(this.quotas);
    this.overlay = new Overlay(this)

    // Overlap-Prüfung aktivieren
    this.physics.add.overlap(this.wizard, this.items, this.collectItem, null, this);

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
    // Wenn der Zauberer bereits stirbt, Steuerung ignorieren
    if (this.isDead) return;

    // Prüfen, ob der Zauberer unter den Bildschirm gefallen ist (Höhe > 720)
    if (this.wizard.y > 750) {
      this.die();
      return;
    }

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

    // 2. Sprung (onFloor prüft sowohl Kacheln als auch Plattformen)
    if (jump && this.wizard.body.onFloor()) {
      this.wizard.setVelocityY(-600);
    }

    // 3. Animationen
    if (!this.wizard.body.onFloor()) {
      this.wizard.anims.stop();
      this.wizard.setFrame(1);
    } else {
      if (left || right) {
        this.wizard.anims.play('walk', true);
      } else {
        this.wizard.anims.stop();
        this.wizard.setFrame(0);
      }
    }
  }

  // Items einsammeln
  collectItem(wizard, item) {
    const itemType = item.texture.key;

    if (this.inventory[itemType] < this.quotas[itemType]) {
      this.inventory[itemType] += 1;

      // HUD-Zähler aktualisieren:
      this.hud.updateCounter(itemType, this.inventory[itemType]);

      item.disableBody(true, true);
    }
  }

  // Spieler stirbt und Level startet neu
  die() {
    if (this.isDead) return;
    this.isDead = true;
  
    // Bewegung stoppen & Figur rot einfärben
    this.wizard.setVelocity(0, 0);
    this.wizard.setTint(0xff5555);
  
    // Musik stoppen
    if (this.bgMusic) {
      this.bgMusic.stop();
    }
  
    // Overlay anzeigen statt sofortigem Auto-Neustart
    this.overlay.showGameOver();
  }
}


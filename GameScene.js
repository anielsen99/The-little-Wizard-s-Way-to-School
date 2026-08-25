import { HUD } from './HUD.js';
import { Overlay } from './Overlay.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  // ============================================================================================
  preload() {
    // Assets laden

    // Hintergrund
    this.load.image('bg-game', 'media//backgrounds/background_level-1.jpg')

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

    // Slime-enemy
    // Pass deine Frame-Maße an (frameWidth / frameHeight)
    this.load.spritesheet('slime-enemy', 'media/enemies/spritesheet-slime.png', {
      frameWidth: 48,
      frameHeight: 48
    });

    // Tiles
    this.load.image('tiles-set', 'media/tiles.png');

    // Map Level 1
    this.load.tilemapTiledJSON('map', 'maps/level-1.tmj');

    // Audio laden
    // Musik während Level
    this.load.audio('CatAstroPhi', [
      'https://labs.phaser.io/assets/audio/CatAstroPhi_shmup_normal.ogg',
      'https://labs.phaser.io/assets/audio/CatAstroPhi_shmup_normal.mp3'
    ]);

    //Sound beim Gehen
    this.load.audio('step-sound', 'audio/Footsteps/Footstep_Dirt_07.mp3');

    //Sound beim Einsammeln von Items
    this.load.audio('item-sound', 'audio/Inventory_Open_00.mp3');


  };

  // ============================================================================================
  create() {
    // Level Höhe und Breite
    const levelWidth = 3840;
    const levelHeight = 720;

    // Hintergrund
    const bg = this.add.image(0, 0, 'bg-game')
      .setOrigin(0, 0)
      .setDisplaySize(1280, 720)   // Passt das Bild an die Bildschirmgröße an
      .setScrollFactor(0);         // 0 = fixiert am Bildschirm (scrollt nicht weg)

    // Physik-Grenzen der Spielwelt
    this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
    this.physics.world.setBoundsCollision(true, true, false, false);

    // Tilemap aus dem Cache erstellen
    const map = this.make.tilemap({ key: 'map' });
    // Tileset verknüpfen
    const tileset = map.addTilesetImage('tiles', 'tiles-set');
    // Ebene erstellen
    const groundLayer = map.createLayer('plattforms', tileset, 0, 0);

    // 4. Kollision für alle Kacheln aktivieren, die nicht leer sind
    groundLayer.setCollisionByExclusion([-1]);

    // ---------------------------------------------
    // WIZARD
    // ---------------------------------------------
    // Figur erstellen (nutzt standardmäßig Frame 0)
    this.wizard = this.physics.add.sprite(100, 450, 'wizard');
    this.wizard.setBounce(0.1);
    this.wizard.setCollideWorldBounds(true);
    this.physics.add.collider(this.wizard, groundLayer);
    this.isDead = false;

    // Lauf-Animation anlegen
    this.anims.create({
      key: 'walk',
      // Frame-Reihenfolge definieren: 0, 1, 0, 2
      frames: this.anims.generateFrameNumbers('wizard', { frames: [0, 1, 0, 2] }),
      frameRate: 8,     // Wie schnell die Bilder wechseln (8 Bilder pro Sekunde)
      repeat: -1        // -1 bedeutet: Die Animation wiederholt sich endlos
    });

    // Sound beim Laufen
    this.walkSound = this.sound.add('step-sound', {
      volume: 0.9, // Lautstärke anpassen
      loop: true
    });

    // ---------------------------------------------
    // SLIME-ENEMY
    // ---------------------------------------------
    // 1. Animation definieren (Frames 0, 1, 2)
    this.anims.create({
      key: 'enemy_walk',
      frames: this.anims.generateFrameNumbers('slime-enemy', { start: 0, end: 2 }),
      frameRate: 6, // Geschwindigkeit der Animation
      repeat: -1    // Endlosschleife
    });

    // 1. Physikalische Gruppe für Gegner anlegen
    this.enemies = this.physics.add.group();

    // 2. Objektebene aus der Tiled-Map abrufen ('enemies' = Name der Objektebene in Tiled)
    const enemyLayer = map.getObjectLayer('enemies');
    if (enemyLayer) {
      enemyLayer.objects.forEach(obj => {
        // Tiled Point Offset (-24), damit der Slime auf dem Boden steht
        const enemy = this.enemies.create(obj.x, obj.y - 24, 'slime-enemy');
        enemy.play('enemy_walk');
        enemy.setCollideWorldBounds(true);

        // Startrichtung speichern (-1 = links, 1 = rechts)
        enemy.setData('direction', -1);
      });
    }

    // Kollision mit Boden & Plattformen aktivieren
    this.physics.add.collider(this.enemies, groundLayer);

    // Unsichtbare Gegner-Wände (enemy-barrier)
    this.enemyBarriers = this.physics.add.staticGroup();

    const barrierLayer = map.getObjectLayer('enemy-barrier');
    if (barrierLayer) {
      barrierLayer.objects.forEach(obj => {
        // Falls in Tiled als Rechteck gezeichnet, Maße übernehmen – sonst 32x64px Standard
        const width = obj.width > 0 ? obj.width : 32;
        const height = obj.height > 0 ? obj.height : 64;
        const posX = obj.x + (obj.width > 0 ? width / 2 : 0);
        const posY = obj.y + (obj.height > 0 ? height / 2 : -height / 2);

        // Unsichtbaren Kasten als statischen Körper erstellen
        const barrier = this.add.rectangle(posX, posY, width, height);
        barrier.setVisible(false); // Macht die Wand unsichtbar
        this.physics.add.existing(barrier, true); // true = statischer physikalischer Körper
        this.enemyBarriers.add(barrier);
      });
    }

    // Gegner kollidieren mit den unsichtbaren Wänden
    this.physics.add.collider(this.enemies, this.enemyBarriers);

    // Berührung mit Zauberer führt zum Tod
    this.physics.add.overlap(this.wizard, this.enemies, this.die, null, this);

    // ---------------------------------------------
    // ITEMS
    // ---------------------------------------------
    // Eine STATISCHE Physik-Gruppe für alle Items erstellen
    this.items = this.physics.add.staticGroup();

    // Liest alle Punkte aus der Tiled-Objektebene namens 'Items' aus
    const itemLayer = map.getObjectLayer('items');
    if (itemLayer) {
      itemLayer.objects.forEach(obj => {
        // Erstellt das Item an den Koordinaten aus Tiled mit der Textur obj.name ('mushroom', 'tree-resin', 'herbs')
        this.items.create(obj.x, obj.y, obj.name);
      });
    }
    // Zähler-Objekt für dein Inventar
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

    // ---------------------------------------------
    // SCHLOSS
    // ---------------------------------------------
    this.castle = this.physics.add.staticImage(3800, 408, 'castle-closed');
    this.physics.add.overlap(this.wizard, this.castle, this.win, null, this);

    // ---------------------------------------------
    // HUD & Overlay initialisieren
    // ---------------------------------------------
    this.hud = new HUD(this);
    this.hud.create(this.quotas);
    this.overlay = new Overlay(this)

    // Overlap-Prüfung aktivieren
    this.physics.add.overlap(this.wizard, this.items, this.collectItem, null, this);

    // ---------------------------------------------
    // KAMERA
    // ---------------------------------------------
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight); // Kamera darf nicht über das Level hinausfilmen
    this.cameras.main.startFollow(this.wizard, true, 0.08, 0.08); // Verfolgt den Zauberer mit sanfter Verzögerung (Lerp)

    // ---------------------------------------------
    // TASTATURSTEUERUNG
    // ---------------------------------------------
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // ---------------------------------------------
    // Musik
    // ---------------------------------------------

    this.bgMusic = this.sound.add('CatAstroPhi', {
      volume: 0.1, // Lautstärke (0.0 bis 1.0)
      loop: true   // Endlosschleife
    });
    this.bgMusic.play();

  }

  // ============================================================================================
  update() {
    // Wenn der Zauberer bereits stirbt, Steuerung ignorieren
    if (this.isDead || this.hasWon) return;

    // Prüfen, ob der Zauberer unter den Bildschirm gefallen ist (Höhe > 720)
    if (this.wizard.y > 750) {
      this.die();
      return;
    }

    // -----------------------------------------
    // GEGNER
    // -----------------------------------------

    // Gegner-Parabel-Sprünge mit 1000ms Pause
    this.enemies.getChildren().forEach(enemy => {
      // Richtungswechsel bei Wand- oder Barrier-Kontakt
      if (enemy.body.blocked.right || enemy.body.touching.right) {
        enemy.setData('direction', -1);
      } else if (enemy.body.blocked.left || enemy.body.touching.left) {
        enemy.setData('direction', 1);
      }

      const dir = enemy.getData('direction');
      const isOnGround = enemy.body.blocked.down || enemy.body.touching.down;

      if (isOnGround) {
        // Sicherstellen, dass die automatische Animation gestoppt ist
        if (enemy.anims.isPlaying) {
          enemy.anims.stop();
        }

        // Wenn der Gegner gerade gelandet ist und noch nicht im Warterhythmus ist
        if (!enemy.getData('isWaiting')) {
          enemy.setData('isWaiting', true);
          enemy.setVelocityX(0); // Bewegung stoppen

          // PHASE 1: Kurzes Stauchen bei der Landung (Frame 1)
          enemy.setFrame(1);

          // Nach 100 ms entspannen -> stillstehen auf Frame 0
          this.time.delayedCall(100, () => {
            if (enemy && enemy.body && (enemy.body.blocked.down || enemy.body.touching.down)) {
              enemy.setFrame(0);
            }
          });

          // PHASE 2: Vorbereitung auf den nächsten Sprung bei 850 ms (Frame 1)
          this.time.delayedCall(850, () => {
            if (enemy && enemy.body && (enemy.body.blocked.down || enemy.body.touching.down)) {
              enemy.setFrame(1);
            }
          });

          // PHASE 3: Absprung nach insgesamt 1000 ms
          this.time.delayedCall(1000, () => {
            if (enemy && enemy.body) {
              enemy.setVelocityY(-250);      // Sprunghöhe
              enemy.setVelocityX(60 * dir); // Sprungweite
              enemy.setFrame(2);             // Flug-Frame
              enemy.setData('isWaiting', false);
            }
          });
        }
      } else {
        // In der Luft: Stoppt Animation & setzt fest Frame 2
        if (enemy.anims.isPlaying) {
          enemy.anims.stop();
        }
        enemy.setFrame(2);
      }

      // Blickrichtung anpassen
      enemy.setFlipX(dir > 0);
    });


    // -----------------------------
    // WIZARD
    // -----------------------------

    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const jump = this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.space.isDown;

    // Horizontale Bewegung & Richtung
    if (right) {
      this.wizard.setVelocityX(160);
      this.wizard.setFlipX(false);
    } else if (left) {
      this.wizard.setVelocityX(-160);
      this.wizard.setFlipX(true);
    } else {
      this.wizard.setVelocityX(0);
    }

    // Sprung (onFloor prüft sowohl Kacheln als auch Plattformen)
    if (jump && this.wizard.body.onFloor()) {
      this.wizard.setVelocityY(-600);
    }

    // Animationen & Sound
    if (!this.wizard.body.onFloor()) {
      // In der Luft (Springen/Fallen): Animation stoppen & Sound anhalten
      this.wizard.anims.stop();
      this.wizard.setFrame(1);

      if (this.walkSound.isPlaying) {
        this.walkSound.stop();
      }
    } else {
      if (left || right) {
        // Am Boden & in Bewegung: Animation spielen & Sound starten (falls er noch nicht läuft)
        this.wizard.anims.play('walk', true);

        if (!this.walkSound.isPlaying) {
          this.walkSound.play();
        }
      } else {
        // Am Boden & Stillstand: Animation stoppen & Sound anhalten
        this.wizard.anims.stop();
        this.wizard.setFrame(0);

        if (this.walkSound.isPlaying) {
          this.walkSound.stop();
        }
      }
    }
  }

  // ============================================================================================
  // Items einsammeln
  collectItem(wizard, item) {
    const itemType = item.texture.key;

    if (this.inventory[itemType] < this.quotas[itemType]) {
      this.inventory[itemType] += 1;

      // HUD-Zähler aktualisieren
      this.hud.updateCounter(itemType, this.inventory[itemType]);
      item.disableBody(true, true);

      // Soundeffekt abspielen
      this.sound.play('item-sound', { volume: 0.5 }); // volume optional (0.0 bis 1.0)
    }
  }

  // ============================================================================================
  // Spieler stirbt und Level startet neu
  die() {
    if (this.isDead) return;
    this.isDead = true;

    // Physik & Verfolgung stoppen
    this.physics.pause();
    this.cameras.main.stopFollow();

    // Bewegung stoppen & Figur rot einfärben
    this.wizard.setVelocity(0, 0);
    this.wizard.setTint(0xff5555);

    // Musik stoppen
    if (this.bgMusic) {
      this.bgMusic.stop();
    }

    // Overlay anzeigen
    this.overlay.showGameOver();
  }

  // ============================================================================================
  win(wizard, castle) {
    // Abbrechen, wenn das Level bereits beendet oder der Spieler tot ist
    if (this.hasWon || this.isDead) return;

    // Prüfen, ob alle Quoten erfüllt sind
    const hasAllItems =
      this.inventory['mushroom'] >= this.quotas['mushroom'] &&
      this.inventory['tree-resin'] >= this.quotas['tree-resin'] &&
      this.inventory['herbs'] >= this.quotas['herbs'];

    if (hasAllItems) {
      this.hasWon = true;

      // Physik & Verfolgung stoppen
      this.physics.pause();
      this.cameras.main.stopFollow();

      // Musik stoppen
      if (this.bgMusic) {
        this.bgMusic.stop();
      }

      // Win-Overlay anzeigen
      this.overlay.showWin();
    }
  }
}


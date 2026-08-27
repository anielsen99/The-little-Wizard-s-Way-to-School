import { HUD } from './HUD.js';
import { Overlay } from './Overlay.js';

// test branch

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.currentLevel = data.level || 1;
    this.selectedSkin = data.skin || this.registry.get('selectedSkin') || 'wizard-blue';
    this.hasWon = false;
    this.isDead = false;
  }

  // ============================================================================================
  preload() {
    // Assets laden

    // Hintergründe
    this.load.image('bg-level-1', 'media/backgrounds/background_level-1.jpg');
    this.load.image('bg-level-2', 'media/backgrounds/background_level-2.jpg');
    this.load.image('bg-level-3', 'media/backgrounds/background_level-3.jpg');

    // Castle
    this.load.image('castle-closed', 'media/castle/castle-closed.png');

    // Tent
    this.load.image('tent', 'media/castle/tent.png');

    // Items
    this.load.image('mushroom', 'media/items/mushroom.png');
    this.load.image('tree-resin', 'media/items/tree-resin.png');
    this.load.image('herbs', 'media/items/herbs.png');

    // Wizard
    this.load.spritesheet('wizard-blue', 'media/wizard/spritesheet-wizard-blue.png', {frameWidth: 120, frameHeight: 104});
    this.load.spritesheet('wizard-yellow', 'media/wizard/spritesheet-wizard-yellow.png', {frameWidth: 120, frameHeight: 104});
    this.load.spritesheet('wizard-red', 'media/wizard/spritesheet-wizard-red.png', {frameWidth: 120, frameHeight: 104});
    this.load.spritesheet('wizard-green', 'media/wizard/spritesheet-wizard-green.png', {frameWidth: 120, frameHeight: 104});

    // Spell
    this.load.spritesheet('spell_anim', 'media/wizard/spritesheet-spell.png', {
      frameWidth: 48,
      frameHeight: 48
    });

    // HUD Background
    this.load.image('HUD-bg', 'media/HUD-bg.png');

    // Enemies
    // Pass deine Frame-Maße an (frameWidth / frameHeight)
    this.load.spritesheet('slime-enemy', 'media/enemies/spritesheet-slime.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.image('poison-mushroom', 'media/enemies/poison-mushroom.png');

    // Tiles
    this.load.image('tiles-set-1', 'maps/tiles/tiles-1.png');
    this.load.image('tiles-set-2', 'maps/tiles/tiles-2.png');
    this.load.image('tiles-set-3', 'maps/tiles/tiles-3.png');

    // Map Level
    this.load.tilemapTiledJSON('map-1', 'maps/level-1.tmj');
    this.load.tilemapTiledJSON('map-2', 'maps/level-2.tmj');
    this.load.tilemapTiledJSON('map-3', 'maps/level-3.tmj');

    // Audio laden
    // Musik
    this.load.audio('level-1-sound', [
      'https://labs.phaser.io/assets/audio/CatAstroPhi_shmup_normal.ogg',
      'https://labs.phaser.io/assets/audio/CatAstroPhi_shmup_normal.mp3'
    ]);
    this.load.audio('level-2-sound', 'audio/Opening_01.ogg');
    this.load.audio('level-3-sound', 'audio/game_music.ogg');
    
    this.load.audio('step-sound', 'audio/Footsteps/Footstep_Dirt_07.mp3'); //Sound beim Gehen
    this.load.audio('jump-sound', 'audio/jump.wav'); //Sound beim Springen Wizard
    this.load.audio('item-sound', 'audio/Inventory_Open_00.mp3'); //Sound beim Einsammeln von Items
    this.load.audio('dying-sound', 'audio/Jingle_Lose_00.mp3'); // Sound beim Sterben
    this.load.audio('winning-sound', 'audio/Jingle_Achievement_00.mp3'); // Sound beim Gewinnen
    this.load.audio('speechbubble-sound', 'audio/huh.MP3'); // Sound bei Sprechblase
    this.load.audio('spell-sound', 'audio/Spell_00.mp3'); // Sound der Spells
    this.load.audio('enemy-death-sound', 'audio/flyswatter.wav'); // Sound Dying Enemy
    this.load.audio('slime-jump-sound', 'audio/slime_step_1.ogg'); // Sound jumping Enemy
  };

  // ============================================================================================
  create() {
    // ---------------------------------------------
    // LEVEL EINSTELLUNGEN
    // ---------------------------------------------
    const levelSettings = {
      1: {
        width: 3840,
        height: 720,
        bg: 'bg-level-1',
        tiles: 'tiles-1',
        music: 'level-1-sound',
        musicVolume: 0.1,
        quotas: { 'mushroom': 4, 'tree-resin': 4, 'herbs': 4 },
        castleX: 3800,
        castleY: 408,
        endTexture: 'tent'
      },
      2: {
        width: 4800,
        height: 720,
        bg: 'bg-level-2',
        tiles: 'tiles-2',
        music: 'level-2-sound',
        musicVolume: 0.6,
        quotas: { 'mushroom': 4, 'tree-resin': 4, 'herbs': 4 },
        castleX: 4760,
        castleY: 408,
        endTexture: 'tent'
      },
      3: {
        width: 4800,
        height: 720,
        bg: 'bg-level-3',
        tiles: 'tiles-3',
        music: 'level-3-sound',
        musicVolume: 0.35,
        quotas: { 'mushroom': 6, 'tree-resin': 6, 'herbs': 6 },
        castleX: 4760,
        castleY: 408,
        endTexture: 'castle-closed'
      }
    };
    const currentConfig = levelSettings[this.currentLevel] || levelSettings[1];
    const levelWidth = currentConfig.width;
    const levelHeight = currentConfig.height;
    this.quotas = currentConfig.quotas;

    
    // Tasten für Zauber registrieren
    this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

    // Hintergrund
    const bg = this.add.image(0, 0, currentConfig.bg)
      .setOrigin(0, 0)
      .setDisplaySize(1280, 720)   // Passt das Bild an die Bildschirmgröße an
      .setScrollFactor(0);         // 0 = fixiert am Bildschirm (scrollt nicht weg)

    // Physik-Grenzen der Spielwelt
    this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
    this.physics.world.setBoundsCollision(true, true, false, false);

    // Tilemap
    const map = this.make.tilemap({ key: `map-${this.currentLevel}` }); // Tilemap aus dem Cache erstellen
    const tileset = map.addTilesetImage(currentConfig.tiles, `tiles-set-${this.currentLevel}`); // Tileset verknüpfen
    const groundLayer = map.createLayer('plattforms', tileset, 0, 0); // Ebene erstellen
    groundLayer.setCollisionByExclusion([-1]); // Kollision für alle Kacheln aktivieren, die nicht leer sind

    // ---------------------------------------------
    // WIZARD
    // ---------------------------------------------
    // Figur erstellen (nutzt standardmäßig Frame 0)
    this.wizard = this.physics.add.sprite(100, 450, this.selectedSkin);
    this.wizard.setBounce(0.1);
    this.wizard.setCollideWorldBounds(true);
    this.physics.add.collider(this.wizard, groundLayer);
    this.isDead = false;

    if (this.anims.exists('walk')) this.anims.remove('walk');
    if (this.anims.exists('fly_broom')) this.anims.remove('fly_broom');

    // Lauf-Animation anlegen
    this.anims.create({
      key: 'walk',
      // Frame-Reihenfolge definieren: 0, 1, 0, 2
      frames: this.anims.generateFrameNumbers(this.selectedSkin, { frames: [0, 1, 0, 2] }),
      frameRate: 8,     // Wie schnell die Bilder wechseln (8 Bilder pro Sekunde)
      repeat: -1        // -1 bedeutet: Die Animation wiederholt sich endlos
    });

    // 1. Besen-Flug-Animation erstellen (nutzt die neuen Frames 3 und 4)
    this.anims.create({
      key: 'fly_broom',
      frames: this.anims.generateFrameNumbers(this.selectedSkin, { start: 3, end: 4 }),
      frameRate: 6,
      repeat: -1
    });

    // 2. Gleit-Variablen
    this.isGliding = false;
    this.canGlide = true;      // Wird erst am Boden wieder auf true gesetzt
    this.glideStartTime = 0;
    this.maxGlideTime = 1500;  // Maximal 1.500 ms (1,5 Sekunden)

    // 3. Maße für Hitboxen (Passe die Zahlen an deinen Sprite an!)
    this.normalWidth = 68;     // Normaler Steh-/Lauf-Körper
    this.normalHeight = 104;
    this.broomWidth = 120;      // Breitere Hitbox für den Besenflug
    this.broomHeight = 104;
    this.setNormalHitbox();


    // Sound beim Laufen
    this.walkSound = this.sound.add('step-sound', {
      volume: 0.7, // Lautstärke anpassen
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
    // Neu: Gefrorene Gegner verletzen den Zauberer nicht
    this.physics.add.collider(this.wizard, this.enemies, (wizard, enemy) => {
      if (!enemy.getData('isFrozen')) {
        this.die();
      }
    }, null, this);

    // ---------------------------------------------
    // ZAUBERSPRÜCHE
    // ---------------------------------------------
    this.spells = this.physics.add.group({
      allowGravity: false // Alle Zauber fliegen ab sofort geradeaus
    });

    // 1. Kollision: Zauber trifft Wand -> hitWall wird ausgeführt
    this.physics.add.collider(this.spells, groundLayer, this.hitWall, null, this);

    // 2. Kollision: Zauber trifft Gegner -> hitEnemy wird ausgeführt
    this.physics.add.overlap(this.spells, this.enemies, this.hitEnemy, null, this);

    this.anims.create({
      key: 'spell_fly', // Der Name der Animation, den wir später benutzen
      frames: this.anims.generateFrameNumbers('spell_anim', {
        start: 0, // Erster Frame
        end: 1    // Letzter Frame (bei 2 Frames ist das Index 1)
      }),
      frameRate: 10, // Geschwindigkeit (Bilder pro Sekunde)
      repeat: -1     // Unendlich wiederholen
    });

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

    // ---------------------------------------------
    // TÖDLICHE ITEMS
    // ---------------------------------------------
    // 1. Statische Physik-Gruppe für tödliche Objekte erstellen
    this.hazards = this.physics.add.staticGroup();

    // 2. Layer aus Tiled abrufen
    const hazardLayer = map.getObjectLayer('poison');

    if (hazardLayer) {
      hazardLayer.objects.forEach(obj => {
        // Erstelle ein Physik-Objekt an den Tiled-Koordinaten
        const hazard = this.hazards.create(obj.x, obj.y, 'poison-mushroom');

        // Hitbox anpassen, falls nötig
        hazard.refreshBody();
      });
    }

    // 3. Overlap-Prüfung zwischen Zauberer und den Gefahren-Objekten
    this.physics.add.overlap(this.wizard, this.hazards, this.hitHazard, null, this);

    // ---------------------------------------------
    // SCHLOSS
    // ---------------------------------------------
    this.castle = this.physics.add.staticImage(
      currentConfig.castleX,
      currentConfig.castleY,
      currentConfig.endTexture
    );
    this.physics.add.overlap(this.wizard, this.castle, this.win, null, this);

    // ---------------------------------------------
    // HUD & Overlay initialisieren
    // ---------------------------------------------
    this.hud = new HUD(this);
    this.hud.create(this.quotas);
    this.overlay = new Overlay(this)
    this.physics.add.overlap(this.wizard, this.items, this.collectItem, null, this); // Overlap-Prüfung aktivieren

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
    this.bgMusic = this.sound.add(currentConfig.music, {
      volume: currentConfig.musicVolume,
      loop: true
    });
    this.bgMusic.play();
  }

  // ============================================================================================
  update() {
    // Zaubersprüche auslösen
    if (Phaser.Input.Keyboard.JustDown(this.keyJ)) {
      this.castSpell('ice');
    } else if (Phaser.Input.Keyboard.JustDown(this.keyK)) {
      this.castSpell('fire');
    } else if (Phaser.Input.Keyboard.JustDown(this.keyL)) {
      this.castSpell('wind');
    }
    
    if (this.isDead || this.hasWon) return; // Wenn der Zauberer bereits stirbt, Steuerung ignorieren

    if (this.currentBubble) {
      this.currentBubble.setPosition(this.wizard.x, this.wizard.y - 170);
    }

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
      if (enemy.getData('isFrozen')) return; // Gefrorene Gegner springen nicht

      // Richtungswechsel bei Wand- oder Barrier-Kontakt
      if (enemy.body.blocked.right || enemy.body.touching.right) {
        enemy.setData('direction', -1);
      } else if (enemy.body.blocked.left || enemy.body.touching.left) {
        enemy.setData('direction', 1);
      }

      const dir = enemy.getData('direction');
      const isOnGround = (enemy.body.blocked.down || enemy.body.touching.down) && enemy.body.velocity.y >= 0;

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
            if (enemy && enemy.active && enemy.body) {
              // NEU: Prüfen, ob der Gegner im Moment des Absprungs wirklich noch am Boden ist
              const isStillOnGround = enemy.body.blocked.down || enemy.body.touching.down;

              if (isStillOnGround && !enemy.getData('isFrozen')) {
                enemy.setVelocityY(-250);      // Sprunghöhe
                enemy.setVelocityX(60 * dir); // Sprungweite
                enemy.setFrame(2);             // Flug-Frame
                enemy.setData('isWaiting', false);

                // Sound abspielen, wenn im Sichtbereich
                if (this.cameras.main.worldView.contains(enemy.x, enemy.y)) {
                  this.sound.play('slime-jump-sound', { volume: 0.2 });
                }
              } else {
                // Falls er durch den Windstoß bereits in der Luft ist: Warterhythmus zurücksetzen
                enemy.setData('isWaiting', false);
              }
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
    // WIZARD STEUERUNG & BESEN
    // -----------------------------

    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    
    // Unterscheidung: Einmaliges Drücken (Sprung) vs. Halten (Gleiten)
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
                        Phaser.Input.Keyboard.JustDown(this.wasd.up) || 
                        Phaser.Input.Keyboard.JustDown(this.wasd.space);
                        
    const jumpHeld = this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.space.isDown;

    const isOnGround = this.wizard.body.onFloor();

    // 1. Horizontale Bewegung
    if (right) {
      this.wizard.setVelocityX(160);
      this.wizard.setFlipX(false);
    } else if (left) {
      this.wizard.setVelocityX(-160);
      this.wizard.setFlipX(true);
    } else {
      this.wizard.setVelocityX(0);
    }

    // 2. Erster Sprung vom Boden
    if (jumpPressed && isOnGround) {
      this.wizard.setVelocityY(-600);
      this.sound.play('jump-sound', { volume: 0.3 });
    }

    // 3. Besen-Gleiten Logik
    if (isOnGround) {
      if (this.isGliding) {
        this.stopGliding();
      }
      this.canGlide = true; // Wieder freigeben am Boden
    } else {
      // In der Luft: Besen aktivieren, wenn Taste gehalten wird & Figur nach unten fällt
      if (jumpHeld && this.canGlide && !this.isGliding && this.wizard.body.velocity.y > 0) {
        this.startGliding();
      }

      // Physik während des Gleitens anpassen
      if (this.isGliding) {
        const timePassed = this.time.now - this.glideStartTime;

        if (timePassed < this.maxGlideTime && jumpHeld) {
          this.wizard.setVelocityY(80); // Langsamer Fall
        } else {
          this.stopGliding(); // Zeit abgelaufen oder Taste losgelassen
        }
      }
    }

    // 4. Animationen & Sound steuern
    if (this.isGliding) {
      this.wizard.anims.play('fly_broom', true);
      if (this.walkSound.isPlaying) this.walkSound.stop();
    } else if (!isOnGround) {
      this.wizard.anims.stop();
      this.wizard.setFrame(1);
      if (this.walkSound.isPlaying) this.walkSound.stop();
    } else {
      if (left || right) {
        this.wizard.anims.play('walk', true);
        if (!this.walkSound.isPlaying) this.walkSound.play();
      } else {
        this.wizard.anims.stop();
        this.wizard.setFrame(0);
        if (this.walkSound.isPlaying) this.walkSound.stop();
      }
    }
  }

  // ============================================================================================
  // ITEMS SAMMELN
  // ============================================================================================
  // Hitbox an sprite anpassen
  setNormalHitbox() {
    this.wizard.body.setSize(this.normalWidth, this.normalHeight);
    // Optional: Versatz zurücksetzen, falls nötig
    this.wizard.body.setOffset(
      (this.wizard.width - this.normalWidth) / 2, 
      this.wizard.height - this.normalHeight
    );
  }
  
  setBroomHitbox() {
    this.wizard.body.setSize(this.broomWidth, this.broomHeight);
    // Zentriert die Hitbox auf dem breiteren Besen-Frame
    this.wizard.body.setOffset(
      (this.wizard.width - this.broomWidth) / 2, 
      this.wizard.height - this.broomHeight
    );
  }

  // ============================================================================================
  // ============================================================================================
  // Items einsammeln (ohne Limit)
  collectItem(wizard, item) {
    const itemType = item.texture.key;

    // 1. Zähler immer erhöhen
    this.inventory[itemType] += 1;

    // 2. HUD-Zähler aktualisieren (übergibt Typ, aktuellen Stand & Ziel-Quote)
    this.hud.updateCounter(itemType, this.inventory[itemType], this.quotas[itemType]);

    // 3. Item immer vom Spielfeld entfernen
    item.disableBody(true, true);

    // 4. Soundeffekt abspielen
    this.sound.play('item-sound', { volume: 0.5 });
  }

  // ============================================================================================
  // TÖDLICHE ITEMS EINSAMMELN
  // ============================================================================================
  hitHazard(wizard, hazard) {
    if (this.isDead || this.hasWon) return;
    hazard.disableBody(true, true); // Das tödliche Item sofort ausblenden
    this.die(); // Ruft deine fertige Todes-Funktion auf (kümmert sich um Overlay, Sound & Stopps)
  }

  // ============================================================================================
  // STERBEN
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

    // Lauf-Animation stoppen & auf Steh-Frame zurücksetzen (NEU!)
    this.wizard.anims.stop();
    this.wizard.setFrame(0);

    // Schritt-Sound stoppen
    if (this.walkSound && this.walkSound.isPlaying) {
      this.walkSound.stop();
    }

    // Musik stoppen
    if (this.bgMusic) {
      this.bgMusic.stop();
    }

    // Overlay anzeigen
    this.overlay.showGameOver();

    // Musik Dying starten
    this.sound.play('dying-sound', { volume: 0.3 }); // volume optional (0.0 bis 1.0)
  }

  // ============================================================================================
  // GEWINNEN
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

      // Bewegung stoppen 
      this.wizard.setVelocity(0, 0);

      // Lauf-Animation stoppen & auf Steh-Frame zurücksetzen (NEU!)
      this.wizard.anims.stop();
      this.wizard.setFrame(0);

      // Schritt-Sound stoppen
      if (this.walkSound && this.walkSound.isPlaying) {
        this.walkSound.stop();
      }

      // Musik stoppen
      if (this.bgMusic) {
        this.bgMusic.stop();
      }

      // Win-Overlay anzeigen
      this.overlay.showWin();

      // Musik Winning starten
      this.sound.play('winning-sound', { volume: 0.3 }); // volume optional (0.0 bis 1.0)
    }
    else {
      // Fehlende Items berechnen
      const missing = [];
      const itemNames = {
        'mushroom': 'Pilz(e)',
        'tree-resin': 'Baumharz',
        'herbs': 'Kräuter'
      };

      for (const [key, quota] of Object.entries(this.quotas)) {
        const diff = quota - this.inventory[key];
        if (diff > 0) {
          missing.push(`${diff}x ${itemNames[key] || key}`);
        }
      }

      // Sprechblasen-Text zusammenbauen
      const missingText = missing.join(', ');
      const message = `Oh nein, da habe ich doch\ngleich ${missingText} vergessen.\nDie brauch' ich für den\nZaubertrankunterricht!`;

      this.showSpeechBubble(message);
    }
  }

  // ============================================================================================
  // SPELLS ABFEUERN
  // ============================================================================================
  castSpell(element = 'fire') {
    if (this.isDead || this.hasWon || this.isGliding) return;

    this.sound.play('spell-sound', { volume: 0.5 });

    const isFacingLeft = this.wizard.flipX;
    const spawnX = isFacingLeft ? this.wizard.x - 30 : this.wizard.x + 30;
    const spawnY = this.wizard.y - 10;
    const speed = isFacingLeft ? -400 : 400;

    const spell = this.spells.create(spawnX, spawnY, 'spell_anim');
    spell.play('spell_fly');
    spell.setData('element', element); // Element auf Spruch speichern

    // Färbung je nach Zauber
    if (element === 'ice') {
      spell.clearTint(); // Originalfarben (Cyan mit Pink)
    } else if (element === 'fire') {
      spell.clearTint();
      spell.postFX.addColorMatrix().negative(); // Invertiert alle Farben (Cyan -> Feuriges Rot)
    } else if (element === 'wind') {
      spell.setTintFill(0xffffff); // Strahlendes Weiß
    }

    spell.body.setSize(spell.width, spell.height);
    spell.body.allowGravity = false;
    spell.setVelocityX(speed);
    spell.setVelocityY(0);
    spell.setFlipX(isFacingLeft);

    this.time.delayedCall(2000, () => {
      if (spell && spell.active) {
        spell.destroy();
      }
    });
  }

  // ============================================================================================
  // Treffer-Logik: Zauberspruch trifft auf Wand oder Boden
  // ============================================================================================
  hitWall(spell, wall) {
    spell.destroy(); // Zauber sofort und komplett löschen
  }

  // ============================================================================================
  // Treffer-Logik zwischen Zauberspruch und Gegner
  // ============================================================================================
  hitEnemy(spell, enemy) {
    const element = spell.getData('element');

    if (spell && spell.active) {
      spell.destroy();
    }

    if (!enemy || !enemy.active) return;

    if (element === 'ice') {
      // EIS: Friert Gegner für 4 Sekunden ein (kann als Plattform genutzt werden)
      enemy.setData('isFrozen', true);
      enemy.setTint(0x00ffff);
      enemy.setVelocity(0, 0);
      enemy.body.setImmovable(true);
      enemy.body.allowGravity = false;

      this.time.delayedCall(4000, () => {
        if (enemy && enemy.active) {
          enemy.setData('isFrozen', false);
          enemy.clearTint();
          enemy.body.setImmovable(false);
          enemy.body.allowGravity = true;
        }
      });

    } else if (element === 'wind') {
      // WIND: Pustet den Gegner zurück (auch in der Luft)
      const pushSpeed = 200; // Schwung nach links/rechts
      const pushDir = spell.flipX ? -pushSpeed : pushSpeed;
      const newDirection = pushDir > 0 ? 1 : -1;

      // 1. Blick- und Laufrichtung des Gegners an den Windstoß anpassen
      enemy.setData('direction', newDirection);

      // 2. Warterhythmus zurücksetzen, falls er gerade abspringen wollte
      enemy.setData('isWaiting', false);

      // 3. Stärkeren Impuls nach oben und zur Seite geben
      enemy.setVelocityX(pushDir);
      enemy.setVelocityY(-300); // Höherer Wert (-300), damit er auch im Flug weggeschleudert wird
    } else {
      // FEUER: Gegner sofort besiegen
      this.sound.play('enemy-death-sound', { volume: 0.7 });
      enemy.destroy();
    }
  }

  // -------------------------------------
  // Besen gleiten
  // -------------------------------------
  // Besen-Gleiten aktivieren
  startGliding() {
    this.isGliding = true;
    this.canGlide = false; // Für diesen Luftaufenthalt verbraucht
    this.glideStartTime = this.time.now;
    this.setBroomHitbox();
  }

  // Besen-Gleiten beenden
  stopGliding() {
    this.isGliding = false;
    this.setNormalHitbox();
  }

  // Zeigt eine Sprechblase über dem Zauberer an
  showSpeechBubble(text) {
    // Verhindert, dass die Sprechblase mehrfach gleichzeitig erzeugt wird
    if (this.isTalking) return;
    this.isTalking = true;

    this.sound.play('speechbubble-sound', { volume: 0.7 });

    const bubbleWidth = 320;
    const bubbleHeight = 170;

    // Container erstellen, der alle Teile der Sprechblase bündelt
    this.currentBubble = this.add.container(this.wizard.x, this.wizard.y - 170);
    this.currentBubble.setDepth(150);

    // 1. Weißer Kasten mit abgerundeten Ecken
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 0.95);
    bg.fillRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 8);
    bg.lineStyle(2, 0x333333, 1);
    bg.strokeRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 8);

    // 2. Kleine Sprechblasen-Spitze nach unten zum Zauberer
    bg.fillStyle(0xffffff, 0.95);
    bg.beginPath();
    bg.moveTo(-8, bubbleHeight / 2);
    bg.lineTo(0, bubbleHeight / 2 + 10);
    bg.lineTo(8, bubbleHeight / 2);
    bg.closePath();
    bg.fillPath();

    // 3. Text in der Blase
    const bubbleText = this.add.text(0, 0, text, {
      fontSize: '16px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#1a1a1a',
      align: 'center',
      wordWrap: { width: bubbleWidth - 20 }
    }).setOrigin(0.5);

    this.currentBubble.add([bg, bubbleText]);

    // Nach 3.5 Sekunden wird die Sprechblase wieder ausgeblendet
    this.time.delayedCall(3500, () => {
      if (this.currentBubble) {
        this.currentBubble.destroy();
        this.currentBubble = null;
      }
      this.isTalking = false; // Kann danach erneut ausgelöst werden
    });
  }
}




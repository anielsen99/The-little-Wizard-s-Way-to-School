export class InstructionsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionsScene' });
  }

  preload() {
    // Hintergrund & Klicksound
    this.load.image('bg-menu', 'media/backgrounds/background_menu.jpg');
    this.load.audio('hover-button-sound', 'audio/Pickup_Gold_00.mp3');

    // Zauberer & Zauber (KORREKTUR: frameWidth auf 120 gesetzt)
    this.load.spritesheet('wizard', 'media/wizard/spritesheet-wizard-blue.png', {
      frameWidth: 120,
      frameHeight: 104
    });
    this.load.spritesheet('spell_anim', 'media/wizard/spritesheet-spell.png', {
      frameWidth: 48,
      frameHeight: 48
    });

    // Items & Gefahren
    this.load.image('mushroom', 'media/items/mushroom.png');
    this.load.image('tree-resin', 'media/items/tree-resin.png');
    this.load.image('herbs', 'media/items/herbs.png');
    this.load.image('poison-mushroom', 'media/enemies/poison-mushroom.png');
    this.load.spritesheet('slime-enemy', 'media/enemies/spritesheet-slime.png', {
      frameWidth: 48,
      frameHeight: 48
    });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Hintergrund
    this.add.image(0, 0, 'bg-menu')
      .setOrigin(0, 0)
      .setDisplaySize(width, height)
      .setTint(0x444444);

    // 2. Große Infobox
    const boxWidth = 980;
    const boxHeight = 580;
    const box = this.add.graphics();
    box.fillStyle(0x0a0a0a, 0.90);
    box.fillRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight, 14);
    box.lineStyle(2, 0xffd700, 0.85); // Goldener Rahmen
    box.strokeRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight, 14);

    // 3. Titel
    this.add.text(centerX, centerY - 245, '★ ANLEITUNG & STEUERUNG ★', {
      fontSize: '26px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffd700'
    }).setOrigin(0.5);

    // =========================================================================
      // LINKE SPALTE: STEUERUNG & ZAUBER
      // =========================================================================
      const leftX = centerX - 260;
  
      // --- GRUNDSTEUERUNG ---
      this.add.text(leftX, centerY - 195, 'STEUERUNG', {
        fontSize: '18px',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        color: '#55ff99'
      }).setOrigin(0.5);
  
      // Zauberer-Grafik (exakt auf der Icon-Linie leftX - 160)
      this.add.sprite(leftX - 200, centerY - 128, 'wizard', 0)
        .setOrigin(0.3, 0.5)
        .setScale(0.8);
  
      // Bewegen
      this.createKeyBadge(leftX - 100, centerY - 160, 'A / D');
      this.add.text(leftX - 50, centerY - 160, 'oder ◄ / ► : Bewegen', {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#ffffff'
      }).setOrigin(0, 0.5);
  
      // Springen
      this.createKeyBadge(leftX - 100, centerY - 128, 'W');
      this.add.text(leftX - 50, centerY - 128, 'oder ▲ / SPACE : Springen', {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#ffffff'
      }).setOrigin(0, 0.5);

      // Besenflug
      this.createKeyBadge(leftX - 100, centerY - 96, 'W halten');
      this.add.text(leftX - 50, centerY - 96, 'oder ▲ / SPACE halten : Besenflug', {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#ffffff'
      }).setOrigin(0, 0.5);
  
      // --- ZAUBERSPRÜCHE ---
      this.add.text(leftX, centerY - 45, 'ZAUBERSPRÜCHE', {
        fontSize: '18px',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        color: '#55ff99'
      }).setOrigin(0.5);
  
      // [J] Eiszauber
      const iceIcon = this.add.sprite(leftX - 160, centerY + 5, 'spell_anim', 0).setScale(0.7);
      this.createKeyBadge(leftX - 100, centerY + 5, 'J');
      this.add.text(leftX - 50, centerY + 5, 'Eiszauber (friert Gegner ein,\nlässt sie als Plattform nutzen)', {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#88eeff'
      }).setOrigin(0, 0.5);
  
      // [K] Feuerzauber
      const fireIcon = this.add.sprite(leftX - 160, centerY + 65, 'spell_anim', 0).setScale(0.7);
      fireIcon.postFX.addColorMatrix().negative();
      this.createKeyBadge(leftX - 100, centerY + 65, 'K');
      this.add.text(leftX - 50, centerY + 65, 'Feuerzauber (besiegt Gegner\nsofort)', {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#ff8866'
      }).setOrigin(0, 0.5);
  
      // [L] Windzauber
      const windIcon = this.add.sprite(leftX - 160, centerY + 125, 'spell_anim', 0).setScale(0.7);
      windIcon.setTintFill(0xffffff);
      this.createKeyBadge(leftX - 100, centerY + 125, 'L');
      this.add.text(leftX - 50, centerY + 125, 'Windzauber (schleudert Gegner\nweit zurück)', {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#ffffff'
      }).setOrigin(0, 0.5);


    // =========================================================================
    // RECHTE SPALTE: ZUTATEN & GEFAHREN
    // =========================================================================
    const rightX = centerX + 240;

    // --- ZUTATEN ---
    this.add.text(rightX, centerY - 195, 'ZUTATEN SAMMELN', {
      fontSize: '18px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffd700'
    }).setOrigin(0.5);

    this.add.text(rightX, centerY - 165, 'Sammle alle Quoten für den Trankunterricht:', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#cccccc'
    }).setOrigin(0.5);

    // Items nebeneinander anzeigen
    this.add.image(rightX - 130, centerY - 120, 'mushroom').setScale(0.9);
    this.add.text(rightX - 130, centerY - 85, 'Pilz', { fontSize: '13px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5);

    this.add.image(rightX, centerY - 120, 'tree-resin').setScale(0.9);
    this.add.text(rightX, centerY - 85, 'Baumharz', { fontSize: '13px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5);

    this.add.image(rightX + 130, centerY - 120, 'herbs').setScale(0.9);
    this.add.text(rightX + 130, centerY - 85, 'Kräuter', { fontSize: '13px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5);

    // --- GEFAHREN ---
    this.add.text(rightX, centerY - 25, 'ACHTUNG: GEFAHREN!', {
      fontSize: '18px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ff5555'
    }).setOrigin(0.5);

    // Giftpilz
    this.add.image(rightX - 140, centerY + 35, 'poison-mushroom').setScale(0.9);
    this.add.text(rightX - 90, centerY + 35, 'Giftpilz: Berührung ist tödlich!', {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: '#ff8888'
    }).setOrigin(0, 0.5);

    // Slime Gegner
    this.add.sprite(rightX - 140, centerY + 95, 'slime-enemy', 0).setScale(0.9);
    this.add.text(rightX - 90, centerY + 95, 'Schleim: Tödlich bei Kontakt!\n(Erst einfrieren oder besiegen)', {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: '#ff8888'
    }).setOrigin(0, 0.5);

    // =========================================================================
    // ZURÜCK-BUTTON
    // =========================================================================
    const backBtn = this.add.text(centerX, centerY + 230, '⬅ Zurück zum Menü', {
      fontSize: '16px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffffff',
      backgroundColor: '#1f1f1f',
      padding: { x: 18, y: 8 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => {
      backBtn.setStyle({ backgroundColor: '#3a3a3a' });
      this.sound.play('hover-button-sound', { volume: 0.3 });
    });

    backBtn.on('pointerout', () => backBtn.setStyle({ backgroundColor: '#1f1f1f' }));
    backBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }

  // Hilfsfunktion: Zeichnet eine Tastatur-Taste (Badge)
  createKeyBadge(x, y, label) {
    const badge = this.add.text(x, y, `[${label}]`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffd700',
      backgroundColor: '#222222',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5);

    return badge;
  }
}
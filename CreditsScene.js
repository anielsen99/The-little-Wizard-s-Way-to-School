export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CreditsScene' });
  }

  preload() {
    // Hintergrundbild laden
    this.load.image('bg-menu', 'media/backgrounds/background_menu.jpg');

    // Soundeffekt laden
    this.load.audio('hover-button-sound', 'audio/Pickup_Gold_00.mp3');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = width / 2;

    // 1. Abgedunkelter Hintergrund
    this.add.image(0, 0, 'bg-menu')
      .setOrigin(0, 0)
      .setDisplaySize(width, height)
      .setTint(0x444444);

    // 2. Transparente Infobox
    const boxWidth = 720;
    const boxHeight = 560;
    const boxY = height / 2;

    const box = this.add.graphics();
    box.fillStyle(0x0a0a0a, 0.88);
    box.fillRect(centerX - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight, 12);
    box.lineStyle(2, 0xffd700, 0.8);
    box.strokeRect(centerX - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight, 12);

    // 3. Titel
    this.add.text(centerX, 115, 'CREDITS', {
      fontSize: '26px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffd700'
    }).setOrigin(0.5);

    // 4. Spiel & Grafik
    this.add.text(centerX, 160, 'SPIEL & GRAFIK', {
      fontSize: '16px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#55ff99'
    }).setOrigin(0.5);

    this.add.text(centerX, 185, 'Stefanie Kottmann & Amanda Nielsen', {
      fontSize: '15px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 5. Sound & Musik
    this.add.text(centerX, 230, 'AUDIO & SOUNDEFFEKTE', {
      fontSize: '16px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#55ff99'
    }).setOrigin(0.5);

    // -- Little Robot Sound Factory
    this.add.text(centerX, 260, 'Little Robot Sound Factory', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.createLink(centerX, 280, 'www.littlerobotsoundfactory.com', 'http://www.littlerobotsoundfactory.com');

    // -- AVGVSTA
    this.add.text(centerX, 310, 'Sounds & Music by AVGVSTA', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    // -- Marcelo Fernandez
    this.add.text(centerX, 345, '“Pixel adventures” – Music by Marcelo Fernandez', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.createLink(centerX, 368, 'www.marcelofernandezmusic.com (CC BY 4.0)', 'http://www.marcelofernandezmusic.com');

    // -- Flush (OpenGameArt)
    this.add.text(centerX, 405, 'Additional Sounds by Flush', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.createLink(centerX, 428, 'opengameart.org/users/flush', 'https://opengameart.org/users/flush');

    // 6. Zurück-Button
    const backBtn = this.add.text(centerX, 505, '⬅ Zurück zum Menü', {
      fontSize: '16px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffffff',
      backgroundColor: '#1f1f1f',
      padding: { x: 16, y: 8 }
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

  // Hilfsfunktion zum Erstellen interaktiver Links
  createLink(x, y, displayText, url) {
    const link = this.add.text(x, y, displayText, {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: '#66b3ff'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    link.on('pointerover', () => link.setStyle({ color: '#ffffff' }));
    link.on('pointerout', () => link.setStyle({ color: '#66b3ff' }));
    link.on('pointerdown', () => {
      window.open(url, '_blank');
    });

    return link;
  }
}
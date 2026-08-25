export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CreditsScene' });
  }

  preload() {
    // Hintergrundbild laden
    this.load.image('bg-menu', 'media//backgrounds/background_menu.jpg')
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
    const boxWidth = 600;
    const boxHeight = 440;
    const box = this.add.graphics();
    box.fillStyle(0x0a0a0a, 0.85);
    box.fillRect(centerX - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 12);
    box.lineStyle(2, 0xffd700, 0.8);
    box.strokeRect(centerX - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 12);

    // 3. Titel
    this.add.text(centerX, 180, 'CREDITS', {
      fontSize: '28px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffd700'
    }).setOrigin(0.5);

    // 4. Spiel & Grafik
    this.add.text(centerX, 240, 'SPIEL & GRAFIK', {
      fontSize: '18px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#55ff99'
    }).setOrigin(0.5);

    this.add.text(centerX, 270, 'Stefanie Kottmann & Amanda Nielsen', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 5. Sound & Musik
    this.add.text(centerX, 330, 'AUDIO & SOUNDEFFEKTE', {
      fontSize: '18px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#55ff99'
    }).setOrigin(0.5);

    this.add.text(centerX, 360, 'Little Robot Sound Factory', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Anklickbarer Weblink
    const linkText = this.add.text(centerX, 385, 'www.littlerobotsoundfactory.com', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#66b3ff'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    linkText.on('pointerover', () => linkText.setStyle({ color: '#ffffff' }));
    linkText.on('pointerout', () => linkText.setStyle({ color: '#66b3ff' }));
    linkText.on('pointerdown', () => {
      window.open('http://www.littlerobotsoundfactory.com', '_blank');
    });

    // 6. Zurück-Button
    const backBtn = this.add.text(centerX, 470, '⬅ Zurück zum Menü', {
      fontSize: '16px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffffff',
      backgroundColor: '#1f1f1f',
      padding: { x: 16, y: 8 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setStyle({ backgroundColor: '#3a3a3a' }));
    backBtn.on('pointerout', () => backBtn.setStyle({ backgroundColor: '#1f1f1f' }));
    backBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
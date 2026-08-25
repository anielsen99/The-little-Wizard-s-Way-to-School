export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    // Hintergrund
    this.load.image('bg-menu', 'media/backgrounds/background_menu.jpg')

    // Soundeffect laden
    this.load.audio('hover-button-sound', '/audio/Pickup_Gold_00.mp3')


  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const bg = this.add.image(0, 0, 'bg-menu')
      .setOrigin(0, 0)
      .setDisplaySize(width, height)
      .setDepth(-1)
      .setTint(0x888888);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.text(centerX, centerY - 100, "The Little Wizard's Way to School", {
      fontSize: '32px',
      color: '#e0d6ff',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const playButton = this.add.text(centerX, centerY + 40, '▶ SPIEL STARTEN', {
      fontSize: '24px',
      color: '#55ff99',
      fontFamily: 'monospace',
      backgroundColor: '#081c15',
      padding: { x: 20, y: 10 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playButton.on('pointerover', () => {
      playButton.setStyle({ color: '#ffff55', backgroundColor: '#1b4332' });
      // Soundeffekt abspielen
      this.sound.play('hover-button-sound', { volume: 0.3 });
    });
    playButton.on('pointerout', () => { playButton.setStyle({ color: '#55ff99', backgroundColor: '#081c15' }); });
    playButton.on('pointerdown', () => { this.scene.start('GameScene'); });

    const creditButton = this.add.text(centerX, centerY + 220, 'Credits', {
      fontSize: '16px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#aaaaaa',
      backgroundColor: '#1f1f1f',
      padding: { x: 16, y: 6 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    creditButton.on('pointerover', () => {
      creditButton.setStyle({ color: '#ffffff', backgroundColor: '#3a3a3a' });
      // Soundeffekt abspielen
      this.sound.play('hover-button-sound', { volume: 0.3 });
    });
    creditButton.on('pointerout', () => { creditButton.setStyle({ color: '#aaaaaa', backgroundColor: '#1f1f1f' }); });
    creditButton.on('pointerdown', () => { this.scene.start('CreditsScene'); });
  }
}

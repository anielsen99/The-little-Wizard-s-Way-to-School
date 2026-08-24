export class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }
  
    create() {
      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;
  
      this.add.text(centerX, centerY - 100, "The Little Wizard's Journey", {
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
      });
  
      playButton.on('pointerout', () => {
        playButton.setStyle({ color: '#55ff99', backgroundColor: '#081c15' });
      });
  
      playButton.on('pointerdown', () => {
        this.scene.start('GameScene');
      });
    }
  }

export class HUD {
  constructor(scene) {
    this.scene = scene;
    this.texts = {};
    this.quotas = {};
  }

  create(quotas) {
    this.quotas = quotas;
    const hudBg = this.scene.add.image(0, 0, 'HUD-bg')
      .setOrigin(-0.05, -0.2)
      .setDisplaySize(360, 80)
      .setDepth(100)
      .setScrollFactor(0);

    this.scene.add.image(55, 55, 'mushroom').setScale(0.8).setScrollFactor(0).setDepth(101);
    this.texts['mushroom'] = this.scene.add.text(85, 45, `0/${this.quotas['mushroom']}`, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(101);

    this.scene.add.image(175, 55, 'tree-resin').setScale(0.8).setScrollFactor(0).setDepth(101);
    this.texts['tree-resin'] = this.scene.add.text(200, 45, `0/${this.quotas['tree-resin']}`, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(101);

    this.scene.add.image(290, 55, 'herbs').setScale(0.8).setScrollFactor(0).setDepth(101);
    this.texts['herbs'] = this.scene.add.text(320, 45, `0/${this.quotas['herbs']}`, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(101);

    const menuBtn = this.scene.add.text(1240, 40, 'MENÜ', {
      fontSize: '18px',
      color: '#ff6666',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      backgroundColor: '#1a0505',
      padding: { x: 14, y: 8 }
    })
      .setOrigin(1, 0.5)
      .setScrollFactor(0)
      .setDepth(101)
      .setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => {
      menuBtn.setStyle({ color: '#ffffff', backgroundColor: '#801515' });
    });

    menuBtn.on('pointerout', () => {
      menuBtn.setStyle({ color: '#ff6666', backgroundColor: '#1a0505' });
    });

    menuBtn.on('pointerdown', () => {
      if (this.scene.bgMusic) this.scene.bgMusic.stop();
      this.scene.scene.start('MenuScene');
    });
  }

  updateCounter(itemType, currentCount) {
    if (this.texts[itemType]) {
      this.texts[itemType].setText(`${currentCount}/${this.quotas[itemType]}`);
      if (currentCount >= this.quotas[itemType]) {
        this.texts[itemType].setColor('#55ff99');
      }
    }
  }
}
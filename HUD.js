export class HUD {
    constructor(scene) {
      this.scene = scene;
      this.texts = {};
      this.quotas = {};
    }
  
    create(quotas) {
      this.quotas = quotas;
  
      const hudBg = this.scene.add.graphics();
      // Hintergrund
      hudBg.fillStyle(0x000000, 0.75);
      hudBg.fillRoundedRect(20, 15, 360, 50, 0);
      // Rand
      hudBg.lineStyle(2, 0xff6666, 0.9);
      hudBg.strokeRoundedRect(20, 15, 360, 50, 0);
      //
      hudBg.setScrollFactor(0);
      hudBg.setDepth(100);
  
      this.scene.add.image(45, 40, 'mushroom').setScale(0.8).setScrollFactor(0).setDepth(101);
      this.texts['mushroom'] = this.scene.add.text(65, 30, `0/${this.quotas['mushroom']}`, {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold'
      }).setScrollFactor(0).setDepth(101);
  
      this.scene.add.image(160, 40, 'tree-resin').setScale(0.8).setScrollFactor(0).setDepth(101);
      this.texts['tree-resin'] = this.scene.add.text(180, 30, `0/${this.quotas['tree-resin']}`, {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold'
      }).setScrollFactor(0).setDepth(101);
  
      this.scene.add.image(275, 40, 'herbs').setScale(0.8).setScrollFactor(0).setDepth(101);
      this.texts['herbs'] = this.scene.add.text(295, 30, `0/${this.quotas['herbs']}`, {
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
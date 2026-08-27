export class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' });
  }

  preload() {
    // Hintergrundbild laden
    this.load.image('bg-menu', 'media/backgrounds/background_menu.jpg');

    // Klicksound laden
    this.load.audio('hover-button-sound', 'audio/Pickup_Gold_00.mp3');

    // Wizard
    this.load.spritesheet('wizard-blue', 'media/wizard/spritesheet-wizard-blue.png', { frameWidth: 120, frameHeight: 104 });
    this.load.spritesheet('wizard-yellow', 'media/wizard/spritesheet-wizard-yellow.png', { frameWidth: 120, frameHeight: 104 });
    this.load.spritesheet('wizard-red', 'media/wizard/spritesheet-wizard-red.png', { frameWidth: 120, frameHeight: 104 });
    this.load.spritesheet('wizard-green', 'media/wizard/spritesheet-wizard-green.png', { frameWidth: 120, frameHeight: 104 });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Abgedunkelter Hintergrund
    this.add.image(0, 0, 'bg-menu')
      .setOrigin(0, 0)
      .setDisplaySize(width, height)
      .setTint(0x444444);

    // 2. Transparente Infobox
    const boxWidth = 620;
    const boxHeight = 520;
    const box = this.add.graphics();
    box.fillStyle(0x0a0a0a, 0.88);
    box.fillRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight, 12);
    box.lineStyle(2, 0xffd700, 0.8);
    box.strokeRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight, 12);

    // 3. Titel
    this.add.text(centerX, centerY - 215, '★ EINSTELLUNGEN ★', {
      fontSize: '26px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffd700'
    }).setOrigin(0.5);

    // 4. Musik / Audio Label
    this.add.text(centerX, centerY - 160, 'MUSIK & SOUNDS', {
      fontSize: '18px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#e0d6ff'
    }).setOrigin(0.5);

    // 5. Interaktiver Musik-Schalter (AN / AUS)
    const isMuted = this.sound.mute;

    const toggleBtn = this.add.text(centerX, centerY - 120, isMuted ? 'MUSIK: [ AUS ]' : 'MUSIK: [ AN ]', {
      fontSize: '18px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: isMuted ? '#ff6666' : '#55ff99',
      backgroundColor: isMuted ? '#3b1212' : '#0d381e',
      padding: { x: 20, y: 10 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Hover-Effekte
    toggleBtn.on('pointerover', () => {
      toggleBtn.setStyle({ color: '#ffffff' });
    });

    toggleBtn.on('pointerout', () => {
      toggleBtn.setStyle({
        color: this.sound.mute ? '#ff6666' : '#55ff99'
      });
    });

    // Klick-Logik zum Umschalten
    toggleBtn.on('pointerdown', () => {
      // Audio global umschalten
      this.sound.mute = !this.sound.mute;

      if (!this.sound.mute) {
        this.sound.play('hover-button-sound', { volume: 0.3 });
      }

      // Button-Aussehen und -Text anpassen
      if (this.sound.mute) {
        toggleBtn.setText('MUSIK: [ AUS ]');
        toggleBtn.setStyle({ color: '#ff6666', backgroundColor: '#3b1212' });
      } else {
        toggleBtn.setText('MUSIK: [ AN ]');
        toggleBtn.setStyle({ color: '#55ff99', backgroundColor: '#0d381e' });
      }
    });

    // Kleider
    this.add.text(centerX, centerY - 55, 'GEWAND DES ZAUBERERS', {
      fontSize: '17px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#e0d6ff'
    }).setOrigin(0.5);

    const skins = [
      { key: 'wizard-blue', name: 'Sternenblau' },
      { key: 'wizard-yellow', name: 'Sonnengelb' },
      { key: 'wizard-red', name: 'Feuerrot' },
      { key: 'wizard-green', name: 'Waldgrün' }
    ];

    const currentSkinKey = this.registry.get('selectedSkin') || 'wizard-blue';
    let currentSkinIndex = skins.findIndex(s => s.key === currentSkinKey);
    if (currentSkinIndex === -1) currentSkinIndex = 0;

    const skinPreview = this.add.sprite(centerX, centerY + 20, skins[currentSkinIndex].key, 0).setScale(0.85);

    const skinLabel = this.add.text(centerX, centerY + 95, skins[currentSkinIndex].name, {
      fontSize: '16px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#55ff99'
    }).setOrigin(0.5);

    const updateSkin = (newIndex) => {
      currentSkinIndex = newIndex;
      const chosenSkin = skins[currentSkinIndex];
      skinLabel.setText(chosenSkin.name);
      skinPreview.setTexture(chosenSkin.key, 0);
      this.registry.set('selectedSkin', chosenSkin.key);

      if (!this.sound.mute) {
        this.sound.play('hover-button-sound', { volume: 0.3 });
      }
    };

    // Button Links
    const prevBtn = this.add.text(centerX - 130, centerY + 95, '◄', {
      fontSize: '22px', fontFamily: 'monospace', fontStyle: 'bold', color: '#ffd700', backgroundColor: '#1f1f1f', padding: { x: 12, y: 4 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    prevBtn.on('pointerover', () => prevBtn.setStyle({ color: '#ffffff', backgroundColor: '#3a3a3a' }));
    prevBtn.on('pointerout', () => prevBtn.setStyle({ color: '#ffd700', backgroundColor: '#1f1f1f' }));
    prevBtn.on('pointerdown', () => {
      const nextIdx = (currentSkinIndex - 1 + skins.length) % skins.length;
      updateSkin(nextIdx);
    });

    // Button Rechts
    const nextBtn = this.add.text(centerX + 130, centerY + 95, '►', {
      fontSize: '22px', fontFamily: 'monospace', fontStyle: 'bold', color: '#ffd700', backgroundColor: '#1f1f1f', padding: { x: 12, y: 4 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    nextBtn.on('pointerover', () => nextBtn.setStyle({ color: '#ffffff', backgroundColor: '#3a3a3a' }));
    nextBtn.on('pointerout', () => nextBtn.setStyle({ color: '#ffd700', backgroundColor: '#1f1f1f' }));
    nextBtn.on('pointerdown', () => {
      const nextIdx = (currentSkinIndex + 1) % skins.length;
      updateSkin(nextIdx);
    });

    // 6. Zurück-Button
    const backBtn = this.add.text(centerX, centerY + 190, '⬅ Zurück zum Menü', {
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
      if (!this.sound.mute) {
        this.sound.play('hover-button-sound', { volume: 0.3 });
      }
    });

    backBtn.on('pointerout', () => backBtn.setStyle({ backgroundColor: '#1f1f1f' }));
    backBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
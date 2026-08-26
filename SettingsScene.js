export class SettingsScene extends Phaser.Scene {
    constructor() {
      super({ key: 'SettingsScene' });
    }
  
    preload() {
      // Hintergrundbild laden
      this.load.image('bg-menu', 'media/backgrounds/background_menu.jpg');
  
      // Klicksound laden
      this.load.audio('hover-button-sound', 'audio/Pickup_Gold_00.mp3');
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
      const boxWidth = 520;
      const boxHeight = 360;
      const box = this.add.graphics();
      box.fillStyle(0x0a0a0a, 0.88);
      box.fillRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight, 12);
      box.lineStyle(2, 0xffd700, 0.8);
      box.strokeRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight, 12);
  
      // 3. Titel
      this.add.text(centerX, centerY - 120, '★ EINSTELLUNGEN ★', {
        fontSize: '26px',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        color: '#ffd700'
      }).setOrigin(0.5);
  
      // 4. Musik / Audio Label
      this.add.text(centerX, centerY - 45, 'MUSIK & SOUNDS', {
        fontSize: '18px',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        color: '#e0d6ff'
      }).setOrigin(0.5);
  
      // 5. Interaktiver Musik-Schalter (AN / AUS)
      const isMuted = this.sound.mute;
  
      const toggleBtn = this.add.text(centerX, centerY + 10, isMuted ? 'MUSIK: [ AUS ]' : 'MUSIK: [ AN ]', {
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
  
      // 6. Zurück-Button
      const backBtn = this.add.text(centerX, centerY + 115, '⬅ Zurück zum Menü', {
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
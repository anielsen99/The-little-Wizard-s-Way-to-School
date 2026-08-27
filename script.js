import { MenuScene } from './MenuScene.js';
import { GameScene } from './GameScene.js';
import { CreditsScene } from './CreditsScene.js';
import { SettingsScene } from './SettingsScene.js';
import { InstructionsScene } from './InstructionsScene.js';

// Konfiguration
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#07150d',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: true
    }
  },
  scene: [MenuScene, GameScene, CreditsScene, SettingsScene, InstructionsScene]
};

const game = new Phaser.Game(config);
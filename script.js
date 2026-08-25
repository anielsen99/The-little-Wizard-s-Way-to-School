import { GameScene } from './GameScene.js';
import { MenuScene } from './MenuScene.js';

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
  scene: [MenuScene, GameScene]
};

const game = new Phaser.Game(config);
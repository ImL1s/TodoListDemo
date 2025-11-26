import Phaser from 'phaser';
import { TodoScene } from './scenes/TodoScene';
import { CONFIG } from './types';

/**
 * Main entry point for the Phaser Todo List application
 * This file configures and initializes the Phaser game instance
 */

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // Automatically choose WebGL or Canvas
  width: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#2c3e50',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scene: [TodoScene],
  dom: {
    createContainer: true,
  },
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true,
    roundPixels: false,
  },
};

// Create and start the game
const game = new Phaser.Game(config);

// Make game instance available globally for debugging
(window as any).game = game;

// Handle window resize
window.addEventListener('resize', () => {
  game.scale.refresh();
});

// Log version information
console.log(`
╔══════════════════════════════════════════╗
║   Phaser Todo List v1.0.0               ║
║   Built with Phaser ${Phaser.VERSION}                ║
║   TypeScript + Vite                      ║
╚══════════════════════════════════════════╝

Keyboard Shortcuts:
  N - New todo (focus input)
  C - Clear completed
  1 - Show all todos
  2 - Show active todos
  3 - Show completed todos

Features:
  ✓ Drag and drop reordering
  ✓ Priority levels
  ✓ Completion animations
  ✓ Particle effects
  ✓ Game statistics
  ✓ Level system
  ✓ Streak tracking
`);

export default game;

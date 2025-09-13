/**
 * Phaser Game Configuration and Initialization
 * Sets up Phaser.js game instance with WebGL/Canvas rendering
 */

// Using global Phaser from CDN - no import needed
declare const Phaser: any;
import { Match3Scene } from '../ui/phaser-renderer.js';

export class Match3Game {
  private game!: Phaser.Game;
  private scene: Match3Scene | null = null;

  constructor(containerId: string = 'game-container') {
    this.initializeGame(containerId);
  }

  private initializeGame(containerId: string): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // WebGL with Canvas fallback
      width: 800,
      height: 700,
      parent: containerId,
      backgroundColor: '#2C3E50',
      scene: Match3Scene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 }, // No physics gravity for Match-3
          debug: false
        }
      },
      render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 400,
          height: 350
        },
        max: {
          width: 1200,
          height: 1050
        }
      },
      input: {
        touch: true,
        mouse: true
      },
      dom: {
        createContainer: true
      }
    };

    this.game = new Phaser.Game(config);
    
    // Get reference to the scene after it's created
    this.game.events.once('ready', () => {
      this.scene = this.game.scene.getScene('Match3Scene') as Match3Scene;
      console.log('Phaser.js Match-3 Game initialized with hardware acceleration');
    });
  }

  /**
   * Get the current game scene
   */
  getScene(): Match3Scene | null {
    return this.scene;
  }

  /**
   * Get current score from the scene
   */
  getScore(): number {
    return this.scene?.getScore() || 0;
  }

  /**
   * Get number of valid moves available
   */
  getValidMovesCount(): number {
    return this.scene?.getValidMovesCount() || 0;
  }

  /**
   * Check if game is over (no valid moves)
   */
  isGameOver(): boolean {
    return this.getValidMovesCount() === 0;
  }

  /**
   * Reset the game
   */
  resetGame(): void {
    if (this.scene) {
      this.scene.scene.restart();
    }
  }

  /**
   * Destroy the game instance
   */
  destroy(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }

  /**
   * Pause the game
   */
  pause(): void {
    if (this.scene) {
      this.scene.scene.pause();
    }
  }

  /**
   * Resume the game
   */
  resume(): void {
    if (this.scene) {
      this.scene.scene.resume();
    }
  }

  /**
   * Get game statistics for external use
   */
  getGameStats(): {
    score: number;
    validMoves: number;
    isGameOver: boolean;
  } {
    return {
      score: this.getScore(),
      validMoves: this.getValidMovesCount(),
      isGameOver: this.isGameOver()
    };
  }
}
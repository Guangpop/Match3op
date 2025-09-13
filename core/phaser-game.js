/**
 * Phaser Game Configuration and Initialization
 * Sets up Phaser.js game instance with WebGL/Canvas rendering
 */
// Phaser is loaded globally from CDN in HTML
import { Match3Scene } from '../ui/phaser-renderer.js';
export class Match3Game {
    game;
    scene = null;
    constructor(containerId = 'game-container') {
        this.initializeGame(containerId);
    }
    initializeGame(containerId) {
        const config = {
            type: Phaser.AUTO, // WebGL with Canvas fallback
            width: 800,
            height: 800,
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
            this.scene = this.game.scene.getScene('Match3Scene');
            console.log('Phaser.js Match-3 Game initialized with hardware acceleration');
        });
    }
    /**
     * Get the current game scene
     */
    getScene() {
        return this.scene;
    }
    /**
     * Get current score from the scene
     */
    getScore() {
        return this.scene?.getScore() || 0;
    }
    /**
     * Get number of valid moves available
     */
    getValidMovesCount() {
        return this.scene?.getValidMovesCount() || 0;
    }
    /**
     * Check if game is over (no valid moves)
     */
    isGameOver() {
        return this.getValidMovesCount() === 0;
    }
    /**
     * Reset the game
     */
    resetGame() {
        if (this.scene) {
            this.scene.scene.restart();
        }
    }
    /**
     * Destroy the game instance
     */
    destroy() {
        if (this.game) {
            this.game.destroy(true);
        }
    }
    /**
     * Pause the game
     */
    pause() {
        if (this.scene) {
            this.scene.scene.pause();
        }
    }
    /**
     * Resume the game
     */
    resume() {
        if (this.scene) {
            this.scene.scene.resume();
        }
    }
    /**
     * Get game statistics for external use
     */
    getGameStats() {
        return {
            score: this.getScore(),
            validMoves: this.getValidMovesCount(),
            isGameOver: this.isGameOver()
        };
    }
}
//# sourceMappingURL=phaser-game.js.map
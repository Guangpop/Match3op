/**
 * Phaser Game Configuration and Initialization
 * Sets up Phaser.js game instance with WebGL/Canvas rendering
 */
import { Match3Scene } from '../ui/phaser-renderer.js';
export declare class Match3Game {
    private game;
    private scene;
    constructor(containerId?: string);
    private initializeGame;
    /**
     * Get the current game scene
     */
    getScene(): Match3Scene | null;
    /**
     * Get current score from the scene
     */
    getScore(): number;
    /**
     * Get number of valid moves available
     */
    getValidMovesCount(): number;
    /**
     * Check if game is over (no valid moves)
     */
    isGameOver(): boolean;
    /**
     * Reset the game
     */
    resetGame(): void;
    /**
     * Destroy the game instance
     */
    destroy(): void;
    /**
     * Pause the game
     */
    pause(): void;
    /**
     * Resume the game
     */
    resume(): void;
    /**
     * Get game statistics for external use
     */
    getGameStats(): {
        score: number;
        validMoves: number;
        isGameOver: boolean;
    };
}
//# sourceMappingURL=phaser-game.d.ts.map
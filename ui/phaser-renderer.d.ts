/**
 * Phaser Renderer - Main Phaser.js scene for Match-3 game
 * Handles hardware-accelerated rendering, sprites, and user input
 */
import { BoardManager } from '../core/board.js';
import { MatchEngine } from '../core/match.js';
export declare class Match3Scene extends Phaser.Scene {
    private boardManager;
    private matchEngine;
    private animator;
    private tileSprites;
    private backgroundGrid;
    private selectedTile;
    private selectedSprite;
    private score;
    private isAnimating;
    private scoreText;
    private statusText;
    private validMovesText;
    private readonly BOARD_SIZE;
    private readonly TILE_SIZE;
    private readonly BOARD_OFFSET_X;
    private readonly BOARD_OFFSET_Y;
    constructor();
    preload(): void;
    create(): void;
    private createTileTextures;
    private createBackground;
    private createUI;
    private createButtons;
    private createBoard;
    private createTileSprite;
    private handleTileClick;
    private selectTile;
    private deselectTile;
    private attemptSwap;
    private processCascadingMatchesWithLogging;
    private showHint;
    private playAutoMove;
    private resetGame;
    private updateDisplay;
    private updateStatus;
    getScore(): number;
    getValidMovesCount(): number;
    getBoardManager(): BoardManager;
    getMatchEngine(): MatchEngine;
    getLogManager(): import("../core/log-manager.js").LogManager;
    exportGameLogs(): Promise<void>;
}
//# sourceMappingURL=phaser-renderer.d.ts.map
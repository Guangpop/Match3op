/**
 * Phaser Animator - Hardware-accelerated animations for Match-3 game
 * Handles tile swapping, cascading, particles, and visual effects
 */
import { Position, TileType } from '../core/board.js';
export declare class PhaserAnimator {
    private scene;
    private readonly TILE_SIZE;
    private readonly BOARD_OFFSET_X;
    private readonly BOARD_OFFSET_Y;
    constructor(scene: Phaser.Scene);
    /**
     * Animate a valid tile swap with smooth tweening
     */
    animateSwap(sprite1: Phaser.GameObjects.Sprite, sprite2: Phaser.GameObjects.Sprite): Promise<void>;
    /**
     * Animate an invalid swap with shake effect and return to original position
     */
    animateInvalidSwap(sprite1: Phaser.GameObjects.Sprite, sprite2: Phaser.GameObjects.Sprite): Promise<void>;
    /**
     * Animate tile clearing with particle effects
     */
    animateTileClearing(positions: Position[], tileSprites: Phaser.GameObjects.Sprite[][]): Promise<void>;
    /**
     * Animate tiles falling due to gravity
     */
    animateFallingTiles(movements: Map<string, Position>, tileSprites: Phaser.GameObjects.Sprite[][]): Promise<void>;
    /**
     * Animate new tiles spawning from above
     */
    animateSpawningTiles(tileSprites: Phaser.GameObjects.Sprite[][], boardState: TileType[][]): Promise<void>;
    /**
     * Create a new tile sprite with proper positioning and data
     */
    private createNewTileSprite;
    /**
     * Animate individual tile spawn with drop effect
     */
    private animateTileSpawn;
    /**
     * Highlight hint tiles with pulsing animation
     */
    highlightHintTiles(sprites: Phaser.GameObjects.Sprite[]): void;
    /**
     * Get color value for tile type (for particles)
     */
    private getTileColor;
    /**
     * Check if any animations are currently running
     */
    isAnimating(): boolean;
    /**
     * Stop all running animations
     */
    stopAllAnimations(): void;
}
//# sourceMappingURL=phaser-animator.d.ts.map
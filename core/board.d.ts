/**
 * Board Manager - Core game logic for Match-3 board
 * Handles 8x8 grid initialization, tile management, and swapping operations
 */
export declare enum TileType {
    RED = 0,
    BLUE = 1,
    GREEN = 2,
    YELLOW = 3,
    PURPLE = 4
}
export interface Position {
    row: number;
    col: number;
}
export interface Tile {
    type: TileType;
    position: Position;
}
export declare class BoardManager {
    private readonly BOARD_SIZE;
    private readonly TILE_TYPES;
    private board;
    constructor();
    /**
     * Initialize 8x8 board ensuring no pre-existing matches
     * Uses iterative approach to prevent initial match formations
     */
    private initializeBoard;
    /**
     * Get a valid tile type that won't create matches at given position
     */
    private getValidTileType;
    /**
     * Get tile type at specific position
     */
    getTile(row: number, col: number): TileType | null;
    /**
     * Set tile type at specific position
     */
    setTile(row: number, col: number, type: TileType): boolean;
    /**
     * Swap two tiles if they are adjacent
     */
    swapTiles(pos1: Position, pos2: Position): boolean;
    /**
     * Check if two positions are adjacent (horizontal/vertical only)
     */
    areAdjacent(pos1: Position, pos2: Position): boolean;
    /**
     * Check if position is within board bounds
     */
    isValidPosition(row: number, col: number): boolean;
    /**
     * Get current board state (read-only copy)
     */
    getBoard(): TileType[][];
    /**
     * Get board dimensions
     */
    getBoardSize(): number;
    /**
     * Get number of tile types
     */
    getTileTypeCount(): number;
    /**
     * Reset board to initial state
     */
    reset(): void;
    /**
     * Get all positions of a specific tile type
     */
    getPositionsOfType(type: TileType): Position[];
    /**
     * Fill empty positions (represented by negative values) with new random tiles
     * Used after matches are cleared
     */
    refillBoard(): void;
    /**
     * Mark tiles as empty (for match clearing)
     */
    clearTiles(positions: Position[]): void;
    /**
     * Apply gravity - move tiles down to fill empty spaces
     * Returns mapping of old position to new position for animation
     */
    applyGravity(): Map<string, Position>;
}
//# sourceMappingURL=board.d.ts.map
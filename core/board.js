/**
 * Board Manager - Core game logic for Match-3 board
 * Handles 8x8 grid initialization, tile management, and swapping operations
 */
export var TileType;
(function (TileType) {
    TileType[TileType["RED"] = 0] = "RED";
    TileType[TileType["BLUE"] = 1] = "BLUE";
    TileType[TileType["GREEN"] = 2] = "GREEN";
    TileType[TileType["YELLOW"] = 3] = "YELLOW";
    TileType[TileType["PURPLE"] = 4] = "PURPLE";
})(TileType || (TileType = {}));
export class BoardManager {
    BOARD_SIZE = 8;
    TILE_TYPES = 5;
    board;
    constructor() {
        this.board = [];
        this.initializeBoard();
    }
    /**
     * Initialize 8x8 board ensuring no pre-existing matches
     * Uses iterative approach to prevent initial match formations
     */
    initializeBoard() {
        // Initialize empty board
        this.board = Array(this.BOARD_SIZE)
            .fill(null)
            .map(() => Array(this.BOARD_SIZE).fill(TileType.RED));
        // Fill board tile by tile, avoiding matches
        for (let row = 0; row < this.BOARD_SIZE; row++) {
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                if (this.board[row]) {
                    this.board[row][col] = this.getValidTileType(row, col);
                }
            }
        }
    }
    /**
     * Get a valid tile type that won't create matches at given position
     */
    getValidTileType(row, col) {
        const invalidTypes = new Set();
        // Check horizontal match potential (left side)
        if (col >= 2) {
            const tile1 = this.board[row]?.[col - 1];
            const tile2 = this.board[row]?.[col - 2];
            if (tile1 !== undefined && tile2 !== undefined && tile1 === tile2) {
                invalidTypes.add(tile1);
            }
        }
        // Check vertical match potential (above)
        if (row >= 2) {
            const tile1 = this.board[row - 1]?.[col];
            const tile2 = this.board[row - 2]?.[col];
            if (tile1 !== undefined && tile2 !== undefined && tile1 === tile2) {
                invalidTypes.add(tile1);
            }
        }
        // Find all valid tile types
        const validTypes = [];
        for (let type = 0; type < this.TILE_TYPES; type++) {
            if (!invalidTypes.has(type)) {
                validTypes.push(type);
            }
        }
        // Return random valid tile type
        if (validTypes.length === 0) {
            return TileType.RED; // Fallback
        }
        return validTypes[Math.floor(Math.random() * validTypes.length)];
    }
    /**
     * Get tile type at specific position
     */
    getTile(row, col) {
        if (!this.isValidPosition(row, col)) {
            return null;
        }
        const tile = this.board[row]?.[col];
        return tile !== undefined ? tile : null;
    }
    /**
     * Set tile type at specific position
     */
    setTile(row, col, type) {
        if (!this.isValidPosition(row, col)) {
            return false;
        }
        if (this.board[row] === undefined) {
            return false;
        }
        this.board[row][col] = type;
        return true;
    }
    /**
     * Swap two tiles if they are adjacent
     */
    swapTiles(pos1, pos2) {
        if (!this.areAdjacent(pos1, pos2)) {
            return false;
        }
        if (!this.board[pos1.row] || !this.board[pos2.row]) {
            return false;
        }
        const tile1 = this.board[pos1.row][pos1.col];
        const tile2 = this.board[pos2.row][pos2.col];
        if (tile1 === undefined || tile2 === undefined) {
            return false;
        }
        this.board[pos1.row][pos1.col] = tile2;
        this.board[pos2.row][pos2.col] = tile1;
        return true;
    }
    /**
     * Check if two positions are adjacent (horizontal/vertical only)
     */
    areAdjacent(pos1, pos2) {
        if (!this.isValidPosition(pos1.row, pos1.col) ||
            !this.isValidPosition(pos2.row, pos2.col)) {
            return false;
        }
        const rowDiff = Math.abs(pos1.row - pos2.row);
        const colDiff = Math.abs(pos1.col - pos2.col);
        // Adjacent means exactly one step in one direction
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
    /**
     * Check if position is within board bounds
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.BOARD_SIZE &&
            col >= 0 && col < this.BOARD_SIZE;
    }
    /**
     * Get current board state (read-only copy)
     */
    getBoard() {
        return this.board.map(row => [...row]);
    }
    /**
     * Get board dimensions
     */
    getBoardSize() {
        return this.BOARD_SIZE;
    }
    /**
     * Get number of tile types
     */
    getTileTypeCount() {
        return this.TILE_TYPES;
    }
    /**
     * Reset board to initial state
     */
    reset() {
        this.initializeBoard();
    }
    /**
     * Get all positions of a specific tile type
     */
    getPositionsOfType(type) {
        const positions = [];
        for (let row = 0; row < this.BOARD_SIZE; row++) {
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                const tile = this.board[row]?.[col];
                if (tile === type) {
                    positions.push({ row, col });
                }
            }
        }
        return positions;
    }
    /**
     * Fill empty positions (represented by negative values) with new random tiles
     * Used after matches are cleared
     */
    refillBoard() {
        for (let row = 0; row < this.BOARD_SIZE; row++) {
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                const tile = this.board[row]?.[col];
                // Fill empty spaces (undefined or -1)
                if (tile === undefined || tile < 0) {
                    // Use smart tile generation to avoid creating immediate matches
                    this.board[row][col] = this.getValidTileType(row, col);
                }
            }
        }
    }
    /**
     * Mark tiles as empty (for match clearing)
     */
    clearTiles(positions) {
        for (const pos of positions) {
            if (this.isValidPosition(pos.row, pos.col) && this.board[pos.row]) {
                this.board[pos.row][pos.col] = -1; // Mark as empty
            }
        }
    }
    /**
     * Apply gravity - move tiles down to fill empty spaces
     * Returns mapping of old position to new position for animation
     */
    applyGravity() {
        const movements = new Map();
        for (let col = 0; col < this.BOARD_SIZE; col++) {
            // Collect non-empty tiles with their original positions (from bottom to top)
            const tilesWithPositions = [];
            for (let row = this.BOARD_SIZE - 1; row >= 0; row--) {
                const tile = this.board[row]?.[col];
                if (tile !== undefined && tile >= 0) {
                    tilesWithPositions.push({ tile, originalRow: row });
                }
            }
            // Clear entire column first
            for (let row = 0; row < this.BOARD_SIZE; row++) {
                if (this.board[row]) {
                    this.board[row][col] = -1; // Mark as empty
                }
            }
            // Place existing tiles at bottom (maintaining order from bottom)
            for (let i = 0; i < tilesWithPositions.length; i++) {
                const newRow = this.BOARD_SIZE - 1 - i;
                const { tile, originalRow } = tilesWithPositions[i];
                // Ensure board row exists
                if (!this.board[newRow]) {
                    this.board[newRow] = new Array(this.BOARD_SIZE).fill(-1);
                }
                this.board[newRow][col] = tile;
                // Track movement for animation if tile moved
                if (originalRow !== newRow) {
                    movements.set(`${originalRow},${col}`, { row: newRow, col });
                }
            }
            // Fill remaining empty spaces at the top with -1 to be filled later
            for (let row = 0; row < this.BOARD_SIZE - tilesWithPositions.length; row++) {
                if (!this.board[row]) {
                    this.board[row] = new Array(this.BOARD_SIZE).fill(-1);
                }
                this.board[row][col] = -1;
            }
        }
        return movements;
    }
}
//# sourceMappingURL=board.js.map
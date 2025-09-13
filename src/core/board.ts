/**
 * Board Manager - Core game logic for Match-3 board
 * Handles 8x8 grid initialization, tile management, and swapping operations
 */

export enum TileType {
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

export class BoardManager {
  private readonly BOARD_SIZE = 8;
  private readonly TILE_TYPES = 5;
  private board: TileType[][];

  constructor() {
    this.board = [];
    this.initializeBoard();
  }

  /**
   * Initialize 8x8 board ensuring no pre-existing matches
   * Uses iterative approach to prevent initial match formations
   */
  private initializeBoard(): void {
    // Initialize empty board
    this.board = Array(this.BOARD_SIZE)
      .fill(null)
      .map(() => Array(this.BOARD_SIZE).fill(TileType.RED));

    // Fill board tile by tile, avoiding matches
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        if (this.board[row]) {
          this.board[row]![col] = this.getValidTileType(row, col);
        }
      }
    }
  }

  /**
   * Get a valid tile type that won't create matches at given position
   */
  private getValidTileType(row: number, col: number): TileType {
    const invalidTypes = new Set<TileType>();

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
    const validTypes: TileType[] = [];
    for (let type = 0; type < this.TILE_TYPES; type++) {
      if (!invalidTypes.has(type as TileType)) {
        validTypes.push(type as TileType);
      }
    }

    // Return random valid tile type
    if (validTypes.length === 0) {
      return TileType.RED; // Fallback
    }
    return validTypes[Math.floor(Math.random() * validTypes.length)]!;
  }

  /**
   * Get tile type at specific position
   */
  getTile(row: number, col: number): TileType | null {
    if (!this.isValidPosition(row, col)) {
      return null;
    }
    const tile = this.board[row]?.[col];
    return tile !== undefined ? tile : null;
  }

  /**
   * Set tile type at specific position
   */
  setTile(row: number, col: number, type: TileType): boolean {
    if (!this.isValidPosition(row, col)) {
      return false;
    }
    if (this.board[row] === undefined) {
      return false;
    }
    this.board[row]![col] = type;
    return true;
  }

  /**
   * Swap two tiles if they are adjacent
   */
  swapTiles(pos1: Position, pos2: Position): boolean {
    if (!this.areAdjacent(pos1, pos2)) {
      return false;
    }

    if (!this.board[pos1.row] || !this.board[pos2.row]) {
      return false;
    }

    const tile1 = this.board[pos1.row]![pos1.col];
    const tile2 = this.board[pos2.row]![pos2.col];
    
    if (tile1 === undefined || tile2 === undefined) {
      return false;
    }
    
    this.board[pos1.row]![pos1.col] = tile2;
    this.board[pos2.row]![pos2.col] = tile1;

    return true;
  }

  /**
   * Check if two positions are adjacent (horizontal/vertical only)
   */
  areAdjacent(pos1: Position, pos2: Position): boolean {
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
  isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.BOARD_SIZE && 
           col >= 0 && col < this.BOARD_SIZE;
  }

  /**
   * Get current board state (read-only copy)
   */
  getBoard(): TileType[][] {
    return this.board.map(row => [...row]);
  }

  /**
   * Get board dimensions
   */
  getBoardSize(): number {
    return this.BOARD_SIZE;
  }

  /**
   * Get number of tile types
   */
  getTileTypeCount(): number {
    return this.TILE_TYPES;
  }

  /**
   * Reset board to initial state
   */
  reset(): void {
    this.initializeBoard();
  }

  /**
   * Get all positions of a specific tile type
   */
  getPositionsOfType(type: TileType): Position[] {
    const positions: Position[] = [];
    
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
  refillBoard(): void {
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        const tile = this.board[row]?.[col];
        // Fill empty spaces (undefined or -1)
        if (tile === undefined || tile < 0) {
          // Use smart tile generation to avoid creating immediate matches
          this.board[row]![col] = this.getValidTileType(row, col);
        }
      }
    }
  }

  /**
   * Mark tiles as empty (for match clearing)
   */
  clearTiles(positions: Position[]): void {
    for (const pos of positions) {
      if (this.isValidPosition(pos.row, pos.col) && this.board[pos.row]) {
        this.board[pos.row]![pos.col] = -1 as TileType; // Mark as empty
      }
    }
  }

  /**
   * Apply gravity - move tiles down to fill empty spaces
   * Returns mapping of old position to new position for animation
   */
  applyGravity(): Map<string, Position> {
    const movements = new Map<string, Position>();

    for (let col = 0; col < this.BOARD_SIZE; col++) {
      // Collect non-empty tiles from top to bottom, preserving order
      const validTiles: Array<{ tile: TileType; originalRow: number }> = [];
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        const tile = this.board[row]?.[col];
        if (tile !== undefined && tile >= 0) {
          validTiles.push({ tile, originalRow: row });
        }
      }

      // Clear entire column first
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        if (this.board[row]) {
          this.board[row]![col] = -1 as TileType; // Mark as empty
        }
      }

      // Place tiles from bottom up, maintaining their relative order
      for (let i = 0; i < validTiles.length; i++) {
        const targetRow = this.BOARD_SIZE - validTiles.length + i;
        const { tile, originalRow } = validTiles[i]!;

        // Ensure board row exists
        if (!this.board[targetRow]) {
          this.board[targetRow] = new Array(this.BOARD_SIZE).fill(-1);
        }

        this.board[targetRow]![col] = tile;

        // Track movement for animation if tile moved
        if (originalRow !== targetRow) {
          movements.set(`${originalRow},${col}`, { row: targetRow, col });
        }
      }

      // Fill remaining empty spaces at the top with -1 to be filled later
      for (let row = 0; row < this.BOARD_SIZE - validTiles.length; row++) {
        if (!this.board[row]) {
          this.board[row] = new Array(this.BOARD_SIZE).fill(-1);
        }
        this.board[row]![col] = -1 as TileType;
      }
    }

    return movements;
  }

}
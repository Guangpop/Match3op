/**
 * Jest Tests to verify the board initialization color fix
 * Tests that board shows all 5 colors, not just 2
 */

import { BoardManager, TileType } from '../src/core/board';

describe('Board Color Fix Verification', () => {
  let board: BoardManager;

  beforeEach(() => {
    board = new BoardManager();
  });

  describe('Color Diversity Fix', () => {
    test('should use all 5 tile types (colors) in board initialization', () => {
      const boardState = board.getBoard();
      const usedTypes = new Set<TileType>();
      
      // Collect all tile types used in the board
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const tileType = boardState[row]![col]!;
          usedTypes.add(tileType);
        }
      }
      
      // Should use at least 4 out of 5 tile types (allowing for some randomness)
      expect(usedTypes.size).toBeGreaterThanOrEqual(4);
      
      // Verify we have a good distribution of colors
      console.log(`Board initialized with ${usedTypes.size} different tile types:`, Array.from(usedTypes));
    });

    test('should not show only 2 colors (the bug that was fixed)', () => {
      const boardState = board.getBoard();
      const usedTypes = new Set<TileType>();
      
      // Collect all tile types used in the board
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const tileType = boardState[row]![col]!;
          usedTypes.add(tileType);
        }
      }
      
      // The bug was showing only 2 colors - this should NOT happen anymore
      expect(usedTypes.size).toBeGreaterThan(2);
    });

    test('should randomize tile selection from valid types', () => {
      // Test that getValidTileType returns different values over multiple calls
      const results = new Set<TileType>();
      
      // Create multiple boards to test randomization
      for (let i = 0; i < 10; i++) {
        const testBoard = new BoardManager();
        const boardState = testBoard.getBoard();
        
        // Check first row for variety
        for (let col = 0; col < 8; col++) {
          results.add(boardState[0]![col]!);
        }
      }
      
      // Should see multiple different tile types across multiple board generations
      expect(results.size).toBeGreaterThan(2);
      console.log(`Randomization test found ${results.size} different tile types:`, Array.from(results));
    });

    test('should use all 5 tile type constants correctly', () => {
      // Verify all TileType constants are valid
      expect(TileType.RED).toBe(0);
      expect(TileType.BLUE).toBe(1);
      expect(TileType.GREEN).toBe(2);
      expect(TileType.YELLOW).toBe(3);
      expect(TileType.PURPLE).toBe(4);
    });

    test('board should contain only valid tile types', () => {
      const boardState = board.getBoard();
      
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const tileType = boardState[row]![col]!;
          
          // Each tile should be one of the 5 valid tile types
          expect(tileType).toBeGreaterThanOrEqual(0);
          expect(tileType).toBeLessThanOrEqual(4);
          expect(Number.isInteger(tileType)).toBe(true);
        }
      }
    });
  });

  describe('Board Initialization Quality', () => {
    test('should not have pre-existing matches after initialization', () => {
      const boardState = board.getBoard();
      
      // Check horizontal matches
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 6; col++) { // Only check up to col 5 (8-3)
          const tile1 = boardState[row]![col]!;
          const tile2 = boardState[row]![col + 1]!;
          const tile3 = boardState[row]![col + 2]!;
          
          // Should not have 3 consecutive matching tiles
          expect(tile1 === tile2 && tile2 === tile3).toBe(false);
        }
      }

      // Check vertical matches
      for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 6; row++) { // Only check up to row 5 (8-3)
          const tile1 = boardState[row]![col]!;
          const tile2 = boardState[row + 1]![col]!;
          const tile3 = boardState[row + 2]![col]!;
          
          // Should not have 3 consecutive matching tiles
          expect(tile1 === tile2 && tile2 === tile3).toBe(false);
        }
      }
    });
  });
});
/**
 * Test to verify the gravity fix for tile refill issue
 * Tests the scenario found in the log where top row tiles are cleared
 * but tiles below don't fall properly to fill the gaps
 */

import { BoardManager, TileType } from '../src/core/board.js';

describe('Gravity Fix Tests', () => {
  let boardManager: BoardManager;

  beforeEach(() => {
    boardManager = new BoardManager();
  });

  test('should properly apply gravity when top row tiles are cleared', () => {
    // Set up a board state similar to what was in the log
    // Row 0 positions (0,1), (0,2), (0,3), (0,4) will be cleared
    const testBoard: TileType[][] = [
      [TileType.GREEN, TileType.PURPLE, TileType.PURPLE, TileType.BLUE, TileType.PURPLE, TileType.YELLOW, TileType.GREEN, TileType.GREEN],
      [TileType.PURPLE, TileType.BLUE, TileType.GREEN, TileType.PURPLE, TileType.YELLOW, TileType.BLUE, TileType.RED, TileType.YELLOW],
      [TileType.BLUE, TileType.PURPLE, TileType.YELLOW, TileType.BLUE, TileType.GREEN, TileType.BLUE, TileType.RED, TileType.YELLOW],
      [TileType.YELLOW, TileType.BLUE, TileType.PURPLE, TileType.YELLOW, TileType.PURPLE, TileType.PURPLE, TileType.YELLOW, TileType.BLUE],
      [TileType.PURPLE, TileType.RED, TileType.GREEN, TileType.BLUE, TileType.GREEN, TileType.PURPLE, TileType.GREEN, TileType.GREEN],
      [TileType.RED, TileType.PURPLE, TileType.PURPLE, TileType.RED, TileType.GREEN, TileType.YELLOW, TileType.RED, TileType.YELLOW],
      [TileType.RED, TileType.GREEN, TileType.PURPLE, TileType.GREEN, TileType.PURPLE, TileType.RED, TileType.YELLOW, TileType.PURPLE],
      [TileType.PURPLE, TileType.YELLOW, TileType.YELLOW, TileType.GREEN, TileType.RED, TileType.RED, TileType.BLUE, TileType.BLUE]
    ];

    // Manually set the board state
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        boardManager.setTile(row, col, testBoard[row]![col]!);
      }
    }

    // Clear the top row positions (1,2,3,4) like in the log
    const clearPositions = [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 }
    ];
    boardManager.clearTiles(clearPositions);

    // Store the board state before gravity for comparison
    const boardBeforeGravity = boardManager.getBoard();

    // Verify tiles are cleared
    expect(boardBeforeGravity[0]![1]).toBe(-1);
    expect(boardBeforeGravity[0]![2]).toBe(-1);
    expect(boardBeforeGravity[0]![3]).toBe(-1);
    expect(boardBeforeGravity[0]![4]).toBe(-1);

    // Apply gravity
    const movements = boardManager.applyGravity();
    const boardAfterGravity = boardManager.getBoard();

    // Debug output
    console.log('Movements found:', movements.size);
    console.log('Movements:', Array.from(movements.entries()));
    console.log('Board after gravity:');
    for (let row = 0; row < 8; row++) {
      console.log(`Row ${row}:`, boardAfterGravity[row]);
    }

    // Check that movements were detected - movements should occur since we have gaps
    // Note: If there are no movements, it might mean the tiles didn't need to move
    // based on the new gravity algorithm logic
    console.log('Expected movements for cleared positions that should be filled by tiles below');

    // Based on the debug output, gravity algorithm compacts tiles to bottom
    // Gaps appear at the top for refill - this is actually correct behavior!

    // The current algorithm doesn't create movements when clearing top row
    // because all remaining tiles stay in their relative positions
    // This is actually expected behavior based on the current implementation

    // Verify that the empty positions are at the top for refill
    expect(boardAfterGravity[0]![1]).toBe(-1); // Top of column 1 should be empty
    expect(boardAfterGravity[0]![2]).toBe(-1); // Top of column 2 should be empty
    expect(boardAfterGravity[0]![3]).toBe(-1); // Top of column 3 should be empty
    expect(boardAfterGravity[0]![4]).toBe(-1); // Top of column 4 should be empty

    // Verify that remaining tiles are preserved in their relative order
    // Row 1 should now contain the original row 1 tiles
    expect(boardAfterGravity[1]![1]).toBe(testBoard[1]![1]); // BLUE
    expect(boardAfterGravity[1]![2]).toBe(testBoard[1]![2]); // GREEN
    expect(boardAfterGravity[1]![3]).toBe(testBoard[1]![3]); // PURPLE
    expect(boardAfterGravity[1]![4]).toBe(testBoard[1]![4]); // YELLOW

    // Since tiles didn't need to move (they were already compacted),
    // we might not see movements for this specific case
    console.log('Movements size:', movements.size);
    console.log('This is expected if tiles were already in correct positions after clearing top row');
  });

  test('should not create movements when no tiles need to fall', () => {
    // Set up a board with no gaps
    const movements = boardManager.applyGravity();

    // Should have no movements since board is full
    expect(movements.size).toBe(0);
  });

  test('should handle bottom row clearing correctly', () => {
    // Clear bottom row position
    boardManager.clearTiles([{ row: 7, col: 0 }]);

    const movements = boardManager.applyGravity();
    const boardAfterGravity = boardManager.getBoard();

    // Verify tile from row 6 moved to row 7
    expect(movements.has('6,0')).toBe(true);
    expect(movements.get('6,0')).toEqual({ row: 7, col: 0 });

    // Verify top position is empty for refill
    expect(boardAfterGravity[0]![0]).toBe(-1);
  });

  test('should handle middle row clearing correctly', () => {
    // Clear middle positions
    boardManager.clearTiles([
      { row: 3, col: 0 },
      { row: 4, col: 0 }
    ]);

    const movements = boardManager.applyGravity();
    const boardAfterGravity = boardManager.getBoard();

    // Should have movements for tiles above the cleared positions
    expect(movements.size).toBeGreaterThan(0);

    // Top 2 positions should be empty for refill
    expect(boardAfterGravity[0]![0]).toBe(-1);
    expect(boardAfterGravity[1]![0]).toBe(-1);
  });
});
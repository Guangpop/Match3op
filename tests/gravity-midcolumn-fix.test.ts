/**
 * Test for gravity fix when mid-column tiles are cleared
 * This reproduces the bug found in the latest log where tiles in positions
 * (0,2), (1,2), (2,2) were cleared but gravity didn't fill the gaps
 */

import { BoardManager, TileType } from '../src/core/board.js';

describe('Gravity Mid-Column Fix Tests', () => {
  let boardManager: BoardManager;

  beforeEach(() => {
    boardManager = new BoardManager();
  });

  test('should properly apply gravity when top-middle positions are cleared', () => {
    // Set up the board state similar to the log where column 2 has gaps at top
    const testBoard: TileType[][] = [
      [TileType.PURPLE, TileType.RED, TileType.YELLOW, TileType.BLUE, TileType.BLUE, TileType.RED, TileType.PURPLE, TileType.YELLOW],
      [TileType.BLUE, TileType.GREEN, TileType.YELLOW, TileType.YELLOW, TileType.PURPLE, TileType.PURPLE, TileType.RED, TileType.PURPLE],
      [TileType.PURPLE, TileType.BLUE, TileType.YELLOW, TileType.GREEN, TileType.RED, TileType.GREEN, TileType.BLUE, TileType.YELLOW],
      [TileType.GREEN, TileType.BLUE, TileType.RED, TileType.BLUE, TileType.BLUE, TileType.RED, TileType.RED, TileType.GREEN],
      [TileType.RED, TileType.PURPLE, TileType.BLUE, TileType.GREEN, TileType.GREEN, TileType.RED, TileType.RED, TileType.YELLOW],
      [TileType.GREEN, TileType.RED, TileType.YELLOW, TileType.BLUE, TileType.RED, TileType.GREEN, TileType.PURPLE, TileType.BLUE],
      [TileType.YELLOW, TileType.BLUE, TileType.YELLOW, TileType.YELLOW, TileType.PURPLE, TileType.GREEN, TileType.YELLOW, TileType.RED],
      [TileType.PURPLE, TileType.GREEN, TileType.RED, TileType.RED, TileType.BLUE, TileType.PURPLE, TileType.PURPLE, TileType.YELLOW]
    ];

    // Manually set the board state
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        boardManager.setTile(row, col, testBoard[row]![col]!);
      }
    }

    // Clear positions (0,2), (1,2), (2,2) like in the log
    const clearPositions = [
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 2, col: 2 }
    ];
    boardManager.clearTiles(clearPositions);

    // Store the board state before gravity for comparison
    const boardBeforeGravity = boardManager.getBoard();

    // Verify tiles are cleared
    expect(boardBeforeGravity[0]![2]).toBe(-1);
    expect(boardBeforeGravity[1]![2]).toBe(-1);
    expect(boardBeforeGravity[2]![2]).toBe(-1);

    // Apply gravity
    const movements = boardManager.applyGravity();
    const boardAfterGravity = boardManager.getBoard();

    console.log('Board before gravity (column 2):');
    for (let row = 0; row < 8; row++) {
      console.log(`Row ${row}: ${boardBeforeGravity[row]![2]}`);
    }

    console.log('Board after gravity (column 2):');
    for (let row = 0; row < 8; row++) {
      console.log(`Row ${row}: ${boardAfterGravity[row]![2]}`);
    }

    console.log('Movements detected:', movements.size);
    console.log('Movement details:', Array.from(movements.entries()));

    // Check that movements were detected - tiles should move up to fill gaps
    expect(movements.size).toBeGreaterThan(0);

    // Verify that tiles moved up from bottom to fill the gaps
    // Column 2 should now have all tiles packed at bottom, empty at top
    expect(boardAfterGravity[0]![2]).toBe(-1); // Top should be empty
    expect(boardAfterGravity[1]![2]).toBe(-1); // Second should be empty
    expect(boardAfterGravity[2]![2]).toBe(-1); // Third should be empty

    // Bottom 5 positions should contain the valid tiles from original column 2
    expect(boardAfterGravity[7]![2]).toBe(testBoard[7]![2]); // RED from bottom
    expect(boardAfterGravity[6]![2]).toBe(testBoard[6]![2]); // YELLOW from second bottom
    expect(boardAfterGravity[5]![2]).toBe(testBoard[5]![2]); // YELLOW from third bottom
    expect(boardAfterGravity[4]![2]).toBe(testBoard[4]![2]); // BLUE from fourth bottom
    expect(boardAfterGravity[3]![2]).toBe(testBoard[3]![2]); // RED from fifth bottom

    // Verify movement tracking
    expect(movements.has('7,2')).toBe(false); // Bottom tile doesn't move
    expect(movements.has('6,2')).toBe(false); // Second bottom doesn't move
    expect(movements.has('5,2')).toBe(false); // Third bottom doesn't move
    expect(movements.has('4,2')).toBe(true);  // This should move down
    expect(movements.has('3,2')).toBe(true);  // This should move down
  });

  test('should handle complete column clearing correctly', () => {
    // Clear entire column
    const clearPositions = [];
    for (let row = 0; row < 8; row++) {
      clearPositions.push({ row, col: 0 });
    }
    boardManager.clearTiles(clearPositions);

    const movements = boardManager.applyGravity();
    const boardAfterGravity = boardManager.getBoard();

    // Should have no movements since entire column is empty
    expect(movements.size).toBe(0);

    // Entire column should be empty
    for (let row = 0; row < 8; row++) {
      expect(boardAfterGravity[row]![0]).toBe(-1);
    }
  });

  test('should handle scattered gaps correctly', () => {
    // Clear scattered positions in column 1
    boardManager.clearTiles([
      { row: 1, col: 1 },
      { row: 3, col: 1 },
      { row: 5, col: 1 }
    ]);

    const movements = boardManager.applyGravity();
    const boardAfterGravity = boardManager.getBoard();

    // Should have movements as tiles compact to bottom
    expect(movements.size).toBeGreaterThan(0);

    // Top 3 positions should be empty
    expect(boardAfterGravity[0]![1]).toBe(-1);
    expect(boardAfterGravity[1]![1]).toBe(-1);
    expect(boardAfterGravity[2]![1]).toBe(-1);

    // Bottom 5 positions should have tiles
    for (let row = 3; row < 8; row++) {
      expect(boardAfterGravity[row]![1]).toBeGreaterThanOrEqual(0);
    }
  });
});
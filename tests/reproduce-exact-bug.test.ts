/**
 * Reproduces the exact gravity bug from the second falling tiles entry in the log
 */

import { BoardManager, TileType } from '../src/core/board.js';

describe('Exact Gravity Bug Reproduction', () => {
  let boardManager: BoardManager;

  beforeEach(() => {
    boardManager = new BoardManager();
  });

  test('should reproduce column 4 gravity bug from second falling tiles entry', () => {
    // Set up the exact board state from "Before Gravity" in the log (lines 274-283)
    const testBoard: TileType[][] = [
      [TileType.GREEN, TileType.BLUE, TileType.YELLOW, TileType.RED, TileType.YELLOW, TileType.GREEN, TileType.YELLOW, TileType.RED],
      [TileType.YELLOW, TileType.BLUE, TileType.GREEN, TileType.YELLOW, TileType.RED, TileType.RED, TileType.PURPLE, TileType.GREEN],
      [TileType.GREEN, TileType.GREEN, TileType.YELLOW, TileType.BLUE, TileType.BLUE, TileType.YELLOW, TileType.BLUE, TileType.PURPLE],
      [TileType.PURPLE, TileType.PURPLE, TileType.BLUE, TileType.PURPLE, TileType.BLUE, TileType.RED, TileType.BLUE, TileType.GREEN],
      [TileType.YELLOW, TileType.PURPLE, TileType.GREEN, TileType.YELLOW, -1 as TileType, TileType.RED, TileType.YELLOW, TileType.RED],
      [TileType.RED, TileType.RED, TileType.YELLOW, TileType.RED, -1 as TileType, TileType.GREEN, TileType.YELLOW, TileType.YELLOW],
      [TileType.YELLOW, TileType.GREEN, -1 as TileType, -1 as TileType, -1 as TileType, -1 as TileType, TileType.GREEN, TileType.PURPLE],
      [TileType.RED, TileType.BLUE, TileType.GREEN, TileType.GREEN, TileType.RED, TileType.YELLOW, TileType.GREEN, TileType.PURPLE]
    ];

    // Set the board state
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        boardManager.setTile(row, col, testBoard[row]![col]!);
      }
    }

    console.log('📋 Before Gravity (Column 4):');
    const boardBefore = boardManager.getBoard();
    for (let row = 0; row < 8; row++) {
      const tile = boardBefore[row]![4];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    // Apply gravity
    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    console.log('\n📋 After Gravity (Column 4):');
    for (let row = 0; row < 8; row++) {
      const tile = boardAfter[row]![4];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    console.log('\n📊 Column 4 Movements:');
    Array.from(movements.entries())
      .filter(([key]) => key.endsWith(',4'))
      .forEach(([key, pos]) => {
        const [fromRow] = key.split(',').map(Number);
        const fromTile = boardBefore[fromRow!]![4];
        console.log(`  ${fromTile} (${fromRow},4) → (${pos.row},4)`);
      });

    // Based on the Before Gravity state for column 4:
    // Valid tiles: Row 0=YELLOW, Row 1=RED, Row 2=BLUE, Row 3=BLUE, Row 7=RED
    // Should result in:
    // Row 0,1,2 = Empty
    // Row 3 = YELLOW (was at row 0)
    // Row 4 = RED (was at row 1)
    // Row 5 = BLUE (was at row 2)
    // Row 6 = BLUE (was at row 3)
    // Row 7 = RED (was at row 7, no movement)

    expect(boardAfter[0]![4]).toBe(-1); // Empty
    expect(boardAfter[1]![4]).toBe(-1); // Empty
    expect(boardAfter[2]![4]).toBe(-1); // Empty
    expect(boardAfter[3]![4]).toBe(TileType.YELLOW); // Was at row 0
    expect(boardAfter[4]![4]).toBe(TileType.RED); // Was at row 1
    expect(boardAfter[5]![4]).toBe(TileType.BLUE); // Was at row 2
    expect(boardAfter[6]![4]).toBe(TileType.BLUE); // Was at row 3
    expect(boardAfter[7]![4]).toBe(TileType.RED); // Was at row 7

    // Verify movements
    expect(movements.has('0,4')).toBe(true); // Row 0 → Row 3
    expect(movements.get('0,4')).toEqual({ row: 3, col: 4 });
    expect(movements.has('1,4')).toBe(true); // Row 1 → Row 4
    expect(movements.get('1,4')).toEqual({ row: 4, col: 4 });
    expect(movements.has('2,4')).toBe(true); // Row 2 → Row 5
    expect(movements.get('2,4')).toEqual({ row: 5, col: 4 });
    expect(movements.has('3,4')).toBe(true); // Row 3 → Row 6
    expect(movements.get('3,4')).toEqual({ row: 6, col: 4 });
    expect(movements.has('7,4')).toBe(false); // Row 7 stays at Row 7
  });

  test('should handle simple case correctly', () => {
    // Simple test: One empty space at bottom
    boardManager.clearTiles([{ row: 7, col: 0 }]);

    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    // Should have exactly 7 movements (all tiles in column 0 drop down one row)
    const col0Movements = Array.from(movements.entries())
      .filter(([key]) => key.endsWith(',0'));

    console.log('\n📊 Simple case movements (column 0):');
    col0Movements.forEach(([key, pos]) => {
      console.log(`  ${key} → (${pos.row},${pos.col})`);
    });

    expect(col0Movements.length).toBe(7);

    // Top should be empty, rest should be tiles
    expect(boardAfter[0]![0]).toBe(-1);
    for (let row = 1; row < 8; row++) {
      expect(boardAfter[row]![0]).toBeGreaterThanOrEqual(0);
    }
  });
});
/**
 * Reproduce the specific gravity bug from the latest log
 * where column 5 has gaps at top but tiles don't move
 */

import { BoardManager, TileType } from '../src/core/board.js';

describe('Reproduce Specific Gravity Bug', () => {
  let boardManager: BoardManager;

  beforeEach(() => {
    boardManager = new BoardManager();
  });

  test('should reproduce the column 5 gravity bug', () => {
    // Set up the exact board state from "Before Gravity" in the latest log
    const testBoard: TileType[][] = [
      [TileType.PURPLE, TileType.PURPLE, TileType.BLUE, TileType.RED, TileType.BLUE, -1 as TileType, TileType.GREEN, TileType.PURPLE],
      [TileType.PURPLE, TileType.YELLOW, TileType.GREEN, TileType.YELLOW, TileType.YELLOW, -1 as TileType, TileType.YELLOW, TileType.RED],
      [TileType.GREEN, TileType.YELLOW, TileType.PURPLE, TileType.BLUE, TileType.BLUE, -1 as TileType, TileType.BLUE, TileType.PURPLE],
      [TileType.PURPLE, TileType.PURPLE, TileType.BLUE, TileType.YELLOW, TileType.RED, TileType.YELLOW, TileType.RED, TileType.YELLOW],
      [TileType.YELLOW, TileType.PURPLE, TileType.YELLOW, TileType.YELLOW, TileType.PURPLE, TileType.RED, TileType.GREEN, TileType.GREEN],
      [TileType.RED, TileType.YELLOW, TileType.GREEN, TileType.PURPLE, TileType.BLUE, TileType.GREEN, TileType.GREEN, TileType.BLUE],
      [TileType.YELLOW, TileType.BLUE, TileType.GREEN, TileType.RED, TileType.RED, TileType.BLUE, TileType.PURPLE, TileType.PURPLE],
      [TileType.YELLOW, TileType.PURPLE, TileType.YELLOW, TileType.RED, TileType.RED, TileType.BLUE, TileType.RED, TileType.RED]
    ];

    // Set the board state
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        boardManager.setTile(row, col, testBoard[row]![col]!);
      }
    }

    console.log('📋 Before Gravity (Column 5):');
    const boardBefore = boardManager.getBoard();
    for (let row = 0; row < 8; row++) {
      const tile = boardBefore[row]![5];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    // Debug: Check what validTiles looks like for column 5
    const validTiles: Array<{ tile: TileType; originalRow: number }> = [];
    for (let row = 0; row < 8; row++) {
      const tile = boardBefore[row]![5];
      if (tile !== undefined && tile >= 0) {
        validTiles.push({ tile, originalRow: row });
      }
    }

    console.log('\n🔍 Debug - Valid tiles in column 5 BEFORE gravity:');
    validTiles.forEach((item, index) => {
      console.log(`  [${index}] Row ${item.originalRow}: ${item.tile}`);
    });
    console.log(`Total valid tiles: ${validTiles.length}`);
    console.log(`Empty spaces: ${8 - validTiles.length}`);

    // Apply gravity
    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    console.log('\n📋 After Gravity (Column 5):');
    for (let row = 0; row < 8; row++) {
      const tile = boardAfter[row]![5];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    console.log('\n📊 Total Movements:', movements.size);
    console.log('Column 5 Movements:');
    Array.from(movements.entries())
      .filter(([key]) => key.endsWith(',5'))
      .forEach(([key, pos]) => {
        const [fromRow] = key.split(',').map(Number);
        const fromTile = boardBefore[fromRow!]![5];
        console.log(`  ${fromTile} (${fromRow},5) → (${pos.row},5)`);
      });

    // Based on the Before Gravity state for column 5:
    // Valid tiles: Row 3=YELLOW, Row 4=RED, Row 5=GREEN, Row 6=BLUE, Row 7=BLUE
    // Expected result after gravity:
    // Row 0,1,2 = Empty (-1)
    // Row 3 = YELLOW (was at row 3) - NO MOVEMENT expected
    // Row 4 = RED (was at row 4) - NO MOVEMENT expected
    // Row 5 = GREEN (was at row 5) - NO MOVEMENT expected
    // Row 6 = BLUE (was at row 6) - NO MOVEMENT expected
    // Row 7 = BLUE (was at row 7) - NO MOVEMENT expected

    // Wait, let me recalculate this properly:
    // validTiles[0] = { tile: YELLOW, originalRow: 3 }
    // validTiles[1] = { tile: RED, originalRow: 4 }
    // validTiles[2] = { tile: GREEN, originalRow: 5 }
    // validTiles[3] = { tile: BLUE, originalRow: 6 }
    // validTiles[4] = { tile: BLUE, originalRow: 7 }
    // emptySpaces = 8 - 5 = 3
    // targetRow for validTiles[0] = 3 + 0 = 3 (same as original)
    // targetRow for validTiles[1] = 3 + 1 = 4 (same as original)
    // etc.

    // Actually, this means NO movements should happen since tiles are already at bottom!
    expect(movements.size).toBe(0);

    // Verify the board state is correct
    expect(boardAfter[0]![5]).toBe(-1);
    expect(boardAfter[1]![5]).toBe(-1);
    expect(boardAfter[2]![5]).toBe(-1);
    expect(boardAfter[3]![5]).toBe(TileType.YELLOW);
    expect(boardAfter[4]![5]).toBe(TileType.RED);
    expect(boardAfter[5]![5]).toBe(TileType.GREEN);
    expect(boardAfter[6]![5]).toBe(TileType.BLUE);
    expect(boardAfter[7]![5]).toBe(TileType.BLUE);
  });

  test('should test gravity when tiles really need to move', () => {
    // Create a case where tiles definitely need to move in column 5
    const testBoard: TileType[][] = Array(8).fill(null).map(() => Array(8).fill(TileType.RED));

    // Set column 5 to have gaps in the middle
    testBoard[0]![5] = TileType.YELLOW;  // Valid tile at top
    testBoard[1]![5] = -1 as TileType;   // Gap
    testBoard[2]![5] = -1 as TileType;   // Gap
    testBoard[3]![5] = -1 as TileType;   // Gap
    testBoard[4]![5] = TileType.BLUE;    // Valid tile
    testBoard[5]![5] = TileType.GREEN;   // Valid tile
    testBoard[6]![5] = -1 as TileType;   // Gap
    testBoard[7]![5] = TileType.PURPLE;  // Valid tile at bottom

    // Set the board state
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        boardManager.setTile(row, col, testBoard[row]![col]!);
      }
    }

    console.log('\n📋 Test 2 - Before Gravity (Column 5):');
    const boardBefore = boardManager.getBoard();
    for (let row = 0; row < 8; row++) {
      const tile = boardBefore[row]![5];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    console.log('\n📋 Test 2 - After Gravity (Column 5):');
    for (let row = 0; row < 8; row++) {
      const tile = boardAfter[row]![5];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    console.log('\n📊 Test 2 - Total Movements:', movements.size);

    // Should have movements since tiles need to compact to bottom
    expect(movements.size).toBeGreaterThan(0);

    // Expected result: 4 empty spaces at top, then 4 valid tiles at bottom
    expect(boardAfter[0]![5]).toBe(-1);
    expect(boardAfter[1]![5]).toBe(-1);
    expect(boardAfter[2]![5]).toBe(-1);
    expect(boardAfter[3]![5]).toBe(-1);
    expect(boardAfter[4]![5]).toBe(TileType.YELLOW);  // Was at row 0
    expect(boardAfter[5]![5]).toBe(TileType.BLUE);    // Was at row 4
    expect(boardAfter[6]![5]).toBe(TileType.GREEN);   // Was at row 5
    expect(boardAfter[7]![5]).toBe(TileType.PURPLE);  // Was at row 7
  });
});
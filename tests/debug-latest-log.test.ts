/**
 * Debug the latest log issue where column 7 has gaps but no movements detected
 */

import { BoardManager, TileType } from '../src/core/board.js';

describe('Debug Latest Log Issue', () => {
  let boardManager: BoardManager;

  beforeEach(() => {
    boardManager = new BoardManager();
  });

  test('should debug column 7 gravity issue from latest log', () => {
    // Set up the exact board state from "Before Gravity" in the latest log
    const testBoard: TileType[][] = [
      [TileType.RED, TileType.GREEN, TileType.GREEN, TileType.BLUE, TileType.RED, TileType.YELLOW, TileType.PURPLE, -1 as TileType],
      [TileType.GREEN, TileType.RED, TileType.PURPLE, TileType.GREEN, TileType.RED, TileType.PURPLE, TileType.BLUE, -1 as TileType],
      [TileType.YELLOW, TileType.PURPLE, TileType.YELLOW, TileType.BLUE, TileType.BLUE, TileType.GREEN, TileType.YELLOW, -1 as TileType],
      [TileType.PURPLE, TileType.YELLOW, TileType.RED, TileType.YELLOW, TileType.GREEN, TileType.PURPLE, TileType.YELLOW, TileType.PURPLE],
      [TileType.YELLOW, TileType.RED, TileType.GREEN, TileType.GREEN, TileType.PURPLE, TileType.BLUE, TileType.GREEN, TileType.PURPLE],
      [TileType.YELLOW, TileType.PURPLE, TileType.RED, TileType.PURPLE, TileType.PURPLE, TileType.BLUE, TileType.YELLOW, TileType.GREEN],
      [TileType.RED, TileType.PURPLE, TileType.GREEN, TileType.BLUE, TileType.BLUE, TileType.PURPLE, TileType.GREEN, TileType.YELLOW],
      [TileType.BLUE, TileType.YELLOW, TileType.YELLOW, TileType.PURPLE, TileType.RED, TileType.PURPLE, TileType.RED, TileType.RED]
    ];

    // Set the board state
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        boardManager.setTile(row, col, testBoard[row]![col]!);
      }
    }

    console.log('📋 Before Gravity (Column 7):');
    const boardBefore = boardManager.getBoard();
    for (let row = 0; row < 8; row++) {
      const tile = boardBefore[row]![7];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    // Apply gravity
    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    console.log('\n📋 After Gravity (Column 7):');
    for (let row = 0; row < 8; row++) {
      const tile = boardAfter[row]![7];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    console.log('\n📊 Total Movements:', movements.size);
    console.log('Column 7 Movements:');
    Array.from(movements.entries())
      .filter(([key]) => key.endsWith(',7'))
      .forEach(([key, pos]) => {
        const [fromRow] = key.split(',').map(Number);
        const fromTile = boardBefore[fromRow!]![7];
        console.log(`  ${fromTile} (${fromRow},7) → (${pos.row},7)`);
      });

    // Debug: Check what validTiles looks like for column 7
    const validTiles: Array<{ tile: TileType; originalRow: number }> = [];
    for (let row = 0; row < 8; row++) {
      const tile = boardBefore[row]![7];
      if (tile !== undefined && tile >= 0) {
        validTiles.push({ tile, originalRow: row });
      }
    }

    console.log('\n🔍 Debug - Valid tiles in column 7:');
    validTiles.forEach((item, index) => {
      console.log(`  [${index}] Row ${item.originalRow}: ${item.tile}`);
    });
    console.log(`Total valid tiles: ${validTiles.length}`);
    console.log(`Empty spaces: ${8 - validTiles.length}`);

    // Based on the Before Gravity state for column 7:
    // Rows 0,1,2 = Empty (-1)
    // Rows 3,4,5,6,7 = Valid tiles (PURPLE, PURPLE, GREEN, YELLOW, RED)
    // Expected result:
    // Rows 0,1,2 = Empty (-1)
    // Row 3 = PURPLE (was at row 3)
    // Row 4 = PURPLE (was at row 4)
    // Row 5 = GREEN (was at row 5)
    // Row 6 = YELLOW (was at row 6)
    // Row 7 = RED (was at row 7)

    // Should have 0 movements since all valid tiles are already at the bottom
    expect(movements.size).toBe(0);

    // Verify final state
    expect(boardAfter[0]![7]).toBe(-1);
    expect(boardAfter[1]![7]).toBe(-1);
    expect(boardAfter[2]![7]).toBe(-1);
    expect(boardAfter[3]![7]).toBe(TileType.PURPLE);
    expect(boardAfter[4]![7]).toBe(TileType.PURPLE);
    expect(boardAfter[5]![7]).toBe(TileType.GREEN);
    expect(boardAfter[6]![7]).toBe(TileType.YELLOW);
    expect(boardAfter[7]![7]).toBe(TileType.RED);
  });

  test('should show what happens when tiles need to move down', () => {
    // Create a scenario where tiles definitely need to move
    boardManager.clearTiles([
      { row: 3, col: 7 },
      { row: 4, col: 7 },
      { row: 5, col: 7 }
    ]);

    console.log('\n📋 Scenario 2 - Before Gravity (Column 7):');
    const boardBefore = boardManager.getBoard();
    for (let row = 0; row < 8; row++) {
      const tile = boardBefore[row]![7];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    console.log('\n📋 Scenario 2 - After Gravity (Column 7):');
    for (let row = 0; row < 8; row++) {
      const tile = boardAfter[row]![7];
      console.log(`Row ${row}: ${(tile as number) === -1 ? '⚫' : tile}`);
    }

    console.log('\n📊 Scenario 2 - Total Movements:', movements.size);

    // Should have movements now
    expect(movements.size).toBeGreaterThan(0);
  });
});
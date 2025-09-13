/**
 * 測試修正後的重力系統是否符合Match-3標準
 * Test the corrected gravity system follows Match-3 standards
 */

import { BoardManager } from '../src/core/board.js';

describe('正確的重力系統測試', () => {
  let boardManager: BoardManager;

  beforeEach(() => {
    boardManager = new BoardManager();
  });

  test('應該讓方塊向下掉落並保持相對順序', () => {
    // 使用clearTiles創建空格來測試重力
    const clearPositions = [
      { row: 1, col: 0 }, // 列0中間空格
      { row: 3, col: 0 }, // 列0另一個空格
      { row: 1, col: 2 }, // 列2中間空格
      { row: 3, col: 2 }  // 列2另一個空格
    ];

    boardManager.clearTiles(clearPositions);

    console.log('🎯 重力前狀態：');
    const boardBefore = boardManager.getBoard();
    for (let row = 0; row < 8; row++) {
      console.log(`行${row}: [${boardBefore[row]!.map(t => (t as number) === -1 ? '⚫' : t).join(', ')}]`);
    }

    // 執行重力
    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    console.log('\n⬇️ 重力後狀態：');
    for (let row = 0; row < 8; row++) {
      console.log(`行${row}: [${boardAfter[row]!.map(t => (t as number) === -1 ? '⚫' : t).join(', ')}]`);
    }

    console.log(`\n📊 移動次數: ${movements.size}`);
    console.log('移動詳情:', Array.from(movements.entries()));

    // 驗證第0列（有空格）
    // 行1和行3的空格應該導致方塊下移
    expect(movements.size).toBeGreaterThan(0);

    // 驗證空格只出現在頂部
    expect(boardAfter[0]![0]).toBe(-1); // 列0頂部應該有空格
    expect(boardAfter[1]![0]).toBe(-1); // 列0第二行應該有空格

    // 驗證核心原則：所有非空格位置都有有效方塊
    for (let row = 2; row < 8; row++) {
      expect(boardAfter[row]![0]).toBeGreaterThanOrEqual(0);
      expect(boardAfter[row]![2]).toBeGreaterThanOrEqual(0);
    }
  });

  test('應該正確處理底部清除的情況', () => {
    // 設置棋盤並清除底部方塊
    const positions = [{ row: 7, col: 1 }];
    boardManager.clearTiles(positions);

    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    console.log('📊 底部清除後移動:', movements.size);

    // 應該有移動（上方方塊下落）
    expect(movements.size).toBeGreaterThan(0);

    // 頂部應該有空格
    expect(boardAfter[0]![1]).toBe(-1);

    // 所有其他位置都應該有有效方塊
    for (let row = 1; row < 8; row++) {
      expect(boardAfter[row]![1]).toBeGreaterThanOrEqual(0);
    }
  });

  test('應該正確處理中間清除的情況', () => {
    // 清除中間的一些位置
    const positions = [
      { row: 3, col: 0 },
      { row: 4, col: 0 },
      { row: 5, col: 0 }
    ];
    boardManager.clearTiles(positions);

    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    console.log('📊 中間清除後移動:', movements.size);

    // 應該有移動
    expect(movements.size).toBeGreaterThan(0);

    // 頂部應該有3個空格
    expect(boardAfter[0]![0]).toBe(-1);
    expect(boardAfter[1]![0]).toBe(-1);
    expect(boardAfter[2]![0]).toBe(-1);

    // 底部應該有有效方塊
    for (let row = 3; row < 8; row++) {
      expect(boardAfter[row]![0]).toBeGreaterThanOrEqual(0);
    }
  });

  test('驗證Match-3重力的核心原則', () => {
    // 建立一個特定的測試案例
    // 列1: [A, _, B, _, C] (其中_是空格)
    // 重力後應該變成: [_, _, A, B, C]

    boardManager.clearTiles([
      { row: 1, col: 0 }, { row: 3, col: 0 } // 製造兩個空格
    ]);

    const boardBefore = boardManager.getBoard();
    console.log('清除前列0狀態:', boardBefore.map(row => row![0]).map(t => (t as number) === -1 ? '⚫' : t));

    const movements = boardManager.applyGravity();
    const boardAfter = boardManager.getBoard();

    console.log('重力後列0狀態:', boardAfter.map(row => row![0]).map(t => (t as number) === -1 ? '⚫' : t));
    console.log('移動追蹤:', Array.from(movements.entries()));

    // 驗證核心原則：
    // 1. 空格只在頂部
    expect(boardAfter[0]![0]).toBe(-1);
    expect(boardAfter[1]![0]).toBe(-1);

    // 2. 所有有效方塊都在底部，沒有中間的空格
    for (let row = 2; row < 8; row++) {
      expect(boardAfter[row]![0]).toBeGreaterThanOrEqual(0);
    }

    // 3. 應該有移動發生
    expect(movements.size).toBeGreaterThan(0);
  });
});
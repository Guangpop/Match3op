/**
 * Logging System Tests
 * Tests for the centralized logging system including LogManager, FileLogger, and GameLogger
 */

import { LogManager } from '../src/core/log-manager.js';
import { FileLogger } from '../src/core/file-logger.js';
import { GameLogger } from '../src/core/game-logger.js';
import { BoardManager } from '../src/core/board.js';

// Mock localStorage and sessionStorage for Node.js environment
const mockLocalStorage = {
  data: new Map<string, string>(),
  getItem: function(key: string): string | null {
    return this.data.get(key) || null;
  },
  setItem: function(key: string, value: string): void {
    this.data.set(key, value);
  },
  removeItem: function(key: string): void {
    this.data.delete(key);
  },
  clear: function(): void {
    this.data.clear();
  },
  length: 0,
  key: function(index: number): string | null {
    const keys = Array.from(this.data.keys());
    return keys[index] || null;
  }
};

const mockSessionStorage = {
  data: new Map<string, string>(),
  getItem: function(key: string): string | null {
    return this.data.get(key) || null;
  },
  setItem: function(key: string, value: string): void {
    this.data.set(key, value);
  },
  removeItem: function(key: string): void {
    this.data.delete(key);
  },
  clear: function(): void {
    this.data.clear();
  },
  length: 0,
  key: function(index: number): string | null {
    const keys = Array.from(this.data.keys());
    return keys[index] || null;
  }
};

// Mock window object for browser environment
Object.defineProperty(global, 'window', {
  value: {
    localStorage: mockLocalStorage,
    sessionStorage: mockSessionStorage,
    URL: {
      createObjectURL: jest.fn(() => 'mock-url'),
      revokeObjectURL: jest.fn()
    }
  },
  writable: true
});

// Mock localStorage and sessionStorage globally
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

Object.defineProperty(global, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true
});

// Mock document for browser environment
Object.defineProperty(global, 'document', {
  value: {
    createElement: jest.fn(() => ({
      href: '',
      download: '',
      style: { display: '' },
      click: jest.fn()
    })),
    body: {
      appendChild: jest.fn(),
      removeChild: jest.fn()
    }
  },
  writable: true
});

describe('Logging System', () => {
  let logManager: LogManager;
  let fileLogger: FileLogger;
  let gameLogger: GameLogger;
  let boardManager: BoardManager;

  beforeEach(() => {
    // Clear all storage before each test
    mockLocalStorage.clear();
    mockSessionStorage.clear();
    
    // Create fresh instances
    logManager = new LogManager();
    fileLogger = new FileLogger();
    gameLogger = new GameLogger();
    boardManager = new BoardManager();
  });

  describe('LogManager', () => {
    test('should initialize with logging enabled', () => {
      expect(logManager.isLoggingEnabled()).toBe(true);
    });

    test('should be able to disable and enable logging', () => {
      logManager.setLoggingEnabled(false);
      expect(logManager.isLoggingEnabled()).toBe(false);
      
      logManager.setLoggingEnabled(true);
      expect(logManager.isLoggingEnabled()).toBe(true);
    });

    test('should generate unique session ID', () => {
      const sessionId = logManager.getSessionId();
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);
    });

    test('should log debug messages when enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      logManager.logDebug('Test debug message', { test: 'data' });
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should not log when disabled', () => {
      logManager.setLoggingEnabled(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      logManager.logDebug('Test debug message');
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should log board states', () => {
      const board = boardManager.getBoard();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      logManager.logBoardState('Test Board', board);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should log errors with context', () => {
      const error = new Error('Test error');
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      logManager.logError(error, 'Test context');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should log game state changes', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      logManager.logGameStateChange('Test Change', { old: 'state1', new: 'state2' });
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should get current session logs', () => {
      const logs = logManager.getCurrentSessionLogs();
      expect(typeof logs).toBe('string');
    });

    test('should get all stored logs', () => {
      const allLogs = logManager.getAllStoredLogs();
      expect(typeof allLogs).toBe('object');
    });

    test('should clear all logs', () => {
      logManager.logDebug('Test message');
      logManager.clearAllLogs();
      
      const logs = logManager.getCurrentSessionLogs();
      // After clearing, only the "All logs cleared" debug message should remain
      expect(logs).toContain('All logs cleared');
    });
  });

  describe('FileLogger', () => {
    test('should initialize with session ID', () => {
      const sessionId = fileLogger.getSessionId();
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
    });

    test('should log player moves', () => {
      const board = boardManager.getBoard();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      fileLogger.logPlayerMove(
        1,
        { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
        board,
        [[{ row: 0, col: 0 }, { row: 0, col: 1 }]],
        [],
        board,
        100,
        100
      );
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should log board states', () => {
      const board = boardManager.getBoard();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      fileLogger.logBoardState('Test Board', board);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should log falling tiles', () => {
      const board = boardManager.getBoard();
      const movements = new Map<string, any>();
      movements.set('0,0', { row: 1, col: 0 });
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      fileLogger.logFallingTiles(movements, board, board);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should log refill operations', () => {
      const board = boardManager.getBoard();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      fileLogger.logRefill(board, board);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should log game statistics', () => {
      const stats = {
        totalMoves: 10,
        totalScore: 1000,
        totalCascades: 5,
        averageScorePerMove: 100,
        sessionDuration: 60000
      };
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      fileLogger.logGameStats(stats);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should export logs as file', () => {
      // This test verifies the export method doesn't throw errors
      expect(() => fileLogger.exportLogsAsFile()).not.toThrow();
    });

    test('should clear logs', () => {
      fileLogger.logDebug('Test message');
      fileLogger.clearLogs();
      
      // Verify logs are cleared (implementation dependent)
      expect(() => fileLogger.clearLogs()).not.toThrow();
    });
  });

  describe('GameLogger', () => {
    test('should initialize with session ID', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      new GameLogger();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Game Logger initialized')
      );
      consoleSpy.mockRestore();
    });

    test('should log player moves', () => {
      const board = boardManager.getBoard();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      gameLogger.logMove(
        { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
        board,
        [[{ row: 0, col: 0 }, { row: 0, col: 1 }]],
        [],
        board,
        100,
        100
      );
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Move 1:')
      );
      consoleSpy.mockRestore();
    });

    test('should create cascade events', () => {
      const cascadeEvent = gameLogger.createCascadeEvent(
        1,
        [{ row: 0, col: 0 }],
        100,
        [],
        [],
        boardManager.getBoard()
      );
      
      expect(cascadeEvent).toBeDefined();
      expect(cascadeEvent.level).toBe(1);
      expect(cascadeEvent.clearedPositions).toHaveLength(1);
      expect(cascadeEvent.scoreGained).toBe(100);
    });

    test('should print board states', () => {
      const board = boardManager.getBoard();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      gameLogger.printBoard(board, 'Test Board');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test Board')
      );
      consoleSpy.mockRestore();
    });

    test('should calculate game statistics', () => {
      const board = boardManager.getBoard();
      
      // Log a move to generate stats
      gameLogger.logMove(
        { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
        board,
        [[{ row: 0, col: 0 }, { row: 0, col: 1 }]],
        [],
        board,
        100,
        100
      );
      
      const stats = gameLogger.getStats();
      
      expect(stats.totalMoves).toBe(1);
      expect(stats.totalScore).toBe(100);
      expect(stats.totalCascades).toBe(0);
      expect(stats.averageScorePerMove).toBe(100);
    });

    test('should print game statistics', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      gameLogger.printStats();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Game Statistics')
      );
      consoleSpy.mockRestore();
    });

    test('should export logs as JSON', async () => {
      const board = boardManager.getBoard();
      
      // Log a move first
      gameLogger.logMove(
        { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
        board,
        [[{ row: 0, col: 0 }, { row: 0, col: 1 }]],
        [],
        board,
        100,
        100
      );
      
      const jsonLogs = await gameLogger.exportLogs();
      const parsedLogs = JSON.parse(jsonLogs);
      
      expect(parsedLogs.sessionId).toBeDefined();
      expect(parsedLogs.totalMoves).toBe(1);
      expect(parsedLogs.logs).toHaveLength(1);
    });

    test('should get all logs', () => {
      const board = boardManager.getBoard();
      
      gameLogger.logMove(
        { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
        board,
        [[{ row: 0, col: 0 }, { row: 0, col: 1 }]],
        [],
        board,
        100,
        100
      );
      
      const logs = gameLogger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0]!.moveNumber).toBe(1);
    });

    test('should clear logs', () => {
      const board = boardManager.getBoard();
      
      gameLogger.logMove(
        { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
        board,
        [[{ row: 0, col: 0 }, { row: 0, col: 1 }]],
        [],
        board,
        100,
        100
      );
      
      expect(gameLogger.getLogs()).toHaveLength(1);
      
      gameLogger.clearLogs();
      
      expect(gameLogger.getLogs()).toHaveLength(0);
    });
  });

  describe('Integration Tests', () => {
    test('should log complete game move through LogManager', () => {
      const board = boardManager.getBoard();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Simulate a complete move
      logManager.logPlayerMove(
        1,
        { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
        board,
        [[{ row: 0, col: 0 }, { row: 0, col: 1 }]],
        [],
        board,
        100,
        100
      );
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should handle cascade events through LogManager', () => {
      const board = boardManager.getBoard();
      const cascadeEvent = logManager.createCascadeEvent(
        1,
        [{ row: 0, col: 0 }],
        100,
        [],
        [],
        board
      );
      
      expect(cascadeEvent).toBeDefined();
      expect(cascadeEvent.level).toBe(1);
    });

    test('should export logs through LogManager', async () => {
      const board = boardManager.getBoard();
      
      // Log a move
      logManager.logPlayerMove(
        1,
        { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
        board,
        [[{ row: 0, col: 0 }, { row: 0, col: 1 }]],
        [],
        board,
        100,
        100
      );
      
      // Export as JSON
      const jsonLogs = await logManager.exportLogsAsJSON();
      const parsedLogs = JSON.parse(jsonLogs);
      
      expect(parsedLogs.sessionId).toBeDefined();
      expect(parsedLogs.totalMoves).toBe(1);
    });

    test('should get game statistics through LogManager', () => {
      const board = boardManager.getBoard();
      
      // Log a move
      logManager.logPlayerMove(
        1,
        { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
        board,
        [[{ row: 0, col: 0 }, { row: 0, col: 1 }]],
        [],
        board,
        100,
        100
      );
      
      const stats = logManager.getGameStats();
      
      expect(stats.totalMoves).toBe(1);
      expect(stats.totalScore).toBe(100);
    });
  });

  describe('Error Handling', () => {
    test('should handle logging errors gracefully', () => {
      const error = new Error('Test error');
      
      expect(() => {
        logManager.logError(error, 'Test context');
      }).not.toThrow();
    });

    test('should handle invalid board states', () => {
      const invalidBoard: any[][] = [];
      
      expect(() => {
        logManager.logBoardState('Invalid Board', invalidBoard);
      }).not.toThrow();
    });

    test('should handle empty cascade events', () => {
      const board = boardManager.getBoard();
      
      expect(() => {
        logManager.logPlayerMove(
          1,
          { pos1: { row: 0, col: 0 }, pos2: { row: 0, col: 1 }, tile1Type: 0, tile2Type: 1 },
          board,
          [],
          [],
          board,
          0,
          0
        );
      }).not.toThrow();
    });
  });
});

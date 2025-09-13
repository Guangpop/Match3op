/**
 * Game Logger - Records player moves, board states, and cascading effects
 * Helps with debugging and analyzing game behavior
 */
import { TileType, Position } from './board.js';
export interface MoveLog {
    timestamp: string;
    moveNumber: number;
    swap: {
        pos1: Position;
        pos2: Position;
        tile1Type: TileType;
        tile2Type: TileType;
    };
    boardStateBefore: TileType[][];
    matchesFound: Position[][];
    cascadeEvents: CascadeEvent[];
    boardStateAfter: TileType[][];
    scoreGained: number;
    totalScore: number;
}
export interface CascadeEvent {
    level: number;
    clearedPositions: Position[];
    tilesCleared: number;
    scoreGained: number;
    fallingTiles: Array<{
        from: Position;
        to: Position;
        tileType: TileType;
    }>;
    newTilesSpawned: Array<{
        position: Position;
        tileType: TileType;
    }>;
    boardStateAfterCascade: TileType[][];
}
export declare class GameLogger {
    private logs;
    private moveCounter;
    private sessionId;
    constructor();
    /**
     * Log a complete move with all its effects
     */
    logMove(swap: {
        pos1: Position;
        pos2: Position;
        tile1Type: TileType;
        tile2Type: TileType;
    }, boardStateBefore: TileType[][], matchesFound: Position[][], cascadeEvents: CascadeEvent[], boardStateAfter: TileType[][], scoreGained: number, totalScore: number): void;
    /**
     * Log cascade event details
     */
    createCascadeEvent(level: number, clearedPositions: Position[], scoreGained: number, fallingTiles: Array<{
        from: Position;
        to: Position;
        tileType: TileType;
    }>, newTilesSpawned: Array<{
        position: Position;
        tileType: TileType;
    }>, boardStateAfterCascade: TileType[][]): CascadeEvent;
    /**
     * Export logs to JSON file
     */
    exportLogs(): Promise<string>;
    /**
     * Print board state for debugging
     */
    printBoard(board: TileType[][], title?: string): void;
    /**
     * Get move statistics
     */
    getStats(): {
        totalMoves: number;
        totalScore: number;
        totalCascades: number;
        averageScorePerMove: number;
        sessionDuration: number;
    };
    /**
     * Print current game statistics
     */
    printStats(): void;
    /**
     * Helper method to deep clone board state
     */
    private cloneBoard;
    /**
     * Get all logs
     */
    getLogs(): MoveLog[];
    /**
     * Clear all logs
     */
    clearLogs(): void;
}
//# sourceMappingURL=game-logger.d.ts.map
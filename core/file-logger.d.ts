/**
 * File Logger - Writes game logs to .log files in the logs directory
 * Handles server-side file writing for debugging purposes
 */
import { TileType, Position } from './board.js';
import { CascadeEvent } from './game-logger.js';
export declare class FileLogger {
    private sessionId;
    private logFilePath;
    constructor();
    private initializeLogFile;
    /**
     * Log a player move with full details
     */
    logPlayerMove(moveNumber: number, swapPositions: {
        pos1: Position;
        pos2: Position;
        tile1Type: TileType;
        tile2Type: TileType;
    }, boardBefore: TileType[][], matchesFound: Position[][], cascadeEvents: CascadeEvent[], boardAfter: TileType[][], scoreGained: number, totalScore: number): void;
    /**
     * Log board state at any point
     */
    logBoardState(title: string, board: TileType[][]): void;
    /**
     * Log falling tile movements
     */
    logFallingTiles(movements: Map<string, Position>, boardBefore: TileType[][], boardAfter: TileType[][]): void;
    /**
     * Log refill operations
     */
    logRefill(boardBefore: TileType[][], boardAfter: TileType[][]): void;
    /**
     * Log game statistics
     */
    logGameStats(stats: any): void;
    private formatBoard;
    private formatCascadeEvent;
    private getTileSymbol;
    private writeToLog;
    /**
     * Get log file path for downloads
     */
    getLogFilePath(): string;
    /**
     * Get session ID
     */
    getSessionId(): string;
    /**
     * Export logs as downloadable file
     */
    exportLogsAsFile(): void;
    /**
     * Clear logs
     */
    clearLogs(): void;
    /**
     * Log error with detailed information
     */
    logError(error: Error, context?: string): void;
    /**
     * Log debug information
     */
    logDebug(message: string, data?: any): void;
    /**
     * Log game state change
     */
    logGameStateChange(changeType: string, details: any): void;
    /**
     * Get current session logs from memory
     */
    getCurrentSessionLogs(): string;
    /**
     * Get all stored logs
     */
    getAllStoredLogs(): {
        [key: string]: string;
    };
}
//# sourceMappingURL=file-logger.d.ts.map
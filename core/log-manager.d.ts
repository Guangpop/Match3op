/**
 * Log Manager - Centralized logging system for Match-3 game debugging
 * Provides easy access to logs, export functionality, and log analysis
 */
export declare class LogManager {
    private fileLogger;
    private gameLogger;
    private isEnabled;
    constructor();
    /**
     * Enable or disable logging
     */
    setLoggingEnabled(enabled: boolean): void;
    /**
     * Check if logging is enabled
     */
    isLoggingEnabled(): boolean;
    /**
     * Log a player move with full details
     */
    logPlayerMove(moveNumber: number, swapPositions: {
        pos1: any;
        pos2: any;
        tile1Type: any;
        tile2Type: any;
    }, boardBefore: any[][], matchesFound: any[][], cascadeEvents: any[], boardAfter: any[][], scoreGained: number, totalScore: number): void;
    /**
     * Log board state
     */
    logBoardState(title: string, board: any[][]): void;
    /**
     * Log falling tiles
     */
    logFallingTiles(movements: Map<string, any>, boardBefore: any[][], boardAfter: any[][]): void;
    /**
     * Log refill operations
     */
    logRefill(boardBefore: any[][], boardAfter: any[][]): void;
    /**
     * Log error
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
     * Log game statistics
     */
    logGameStats(stats: any): void;
    /**
     * Export current session logs as downloadable file
     */
    exportLogsAsFile(): void;
    /**
     * Export logs as JSON
     */
    exportLogsAsJSON(): Promise<string>;
    /**
     * Get current session logs
     */
    getCurrentSessionLogs(): string;
    /**
     * Get all stored logs
     */
    getAllStoredLogs(): {
        [key: string]: string;
    };
    /**
     * Get game statistics
     */
    getGameStats(): any;
    /**
     * Print game statistics to console
     */
    printGameStats(): void;
    /**
     * Clear all logs
     */
    clearAllLogs(): void;
    /**
     * Get session ID
     */
    getSessionId(): string;
    /**
     * Create a cascade event for logging
     */
    createCascadeEvent(level: number, clearedPositions: any[], scoreGained: number, fallingTiles: Array<{
        from: any;
        to: any;
        tileType: any;
    }>, newTilesSpawned: Array<{
        position: any;
        tileType: any;
    }>, boardStateAfterCascade: any[][]): any;
    /**
     * Print board state to console
     */
    printBoard(board: any[][], title?: string): void;
    /**
     * Get all move logs
     */
    getMoveLogs(): any[];
    /**
     * Log a complete game session summary
     */
    logSessionSummary(): void;
}
export declare const logManager: LogManager;
//# sourceMappingURL=log-manager.d.ts.map
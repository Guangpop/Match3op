/**
 * Log Viewer - Utility for viewing and analyzing game logs
 * Provides easy access to log data and export functionality
 */
export declare class LogViewer {
    private container;
    constructor(containerId?: string);
    /**
     * Create a log viewer UI
     */
    createLogViewerUI(): void;
    /**
     * Attach event listeners to the log viewer
     */
    private attachEventListeners;
    /**
     * Switch between tabs
     */
    private switchTab;
    /**
     * Update the entire log display
     */
    updateLogDisplay(): void;
    /**
     * Update statistics display
     */
    private updateStats;
    /**
     * Update current session logs
     */
    private updateCurrentLogs;
    /**
     * Update all logs display
     */
    private updateAllLogs;
    /**
     * Download JSON data as file
     */
    private downloadJSON;
    /**
     * Show log viewer in a modal
     */
    showLogViewerModal(): void;
}
export declare const logViewer: LogViewer;
//# sourceMappingURL=log-viewer.d.ts.map
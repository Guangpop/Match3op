/**
 * Log Viewer - Utility for viewing and analyzing game logs
 * Provides easy access to log data and export functionality
 */
import { logManager } from './log-manager.js';
export class LogViewer {
    container = null;
    constructor(containerId) {
        if (containerId) {
            this.container = document.getElementById(containerId);
        }
    }
    /**
     * Create a log viewer UI
     */
    createLogViewerUI() {
        if (!this.container) {
            console.error('Log viewer container not found');
            return;
        }
        this.container.innerHTML = `
      <div class="log-viewer">
        <div class="log-header">
          <h3>🎮 Match-3 Game Logs</h3>
          <div class="log-controls">
            <button id="refresh-logs" class="btn btn-primary">🔄 Refresh</button>
            <button id="export-logs" class="btn btn-success">📁 Export Logs</button>
            <button id="export-json" class="btn btn-info">📊 Export JSON</button>
            <button id="clear-logs" class="btn btn-danger">🗑️ Clear Logs</button>
            <button id="toggle-logging" class="btn btn-warning">⏸️ Toggle Logging</button>
          </div>
        </div>
        
        <div class="log-stats">
          <div class="stat-item">
            <span class="stat-label">Session ID:</span>
            <span class="stat-value" id="session-id">${logManager.getSessionId()}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Moves:</span>
            <span class="stat-value" id="total-moves">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Score:</span>
            <span class="stat-value" id="total-score">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Logging:</span>
            <span class="stat-value" id="logging-status">${logManager.isLoggingEnabled() ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>

        <div class="log-content">
          <div class="log-tabs">
            <button class="tab-btn active" data-tab="current">Current Session</button>
            <button class="tab-btn" data-tab="all">All Logs</button>
            <button class="tab-btn" data-tab="stats">Statistics</button>
          </div>
          
          <div class="tab-content">
            <div id="current-tab" class="tab-pane active">
              <pre id="current-logs" class="log-text"></pre>
            </div>
            <div id="all-tab" class="tab-pane">
              <pre id="all-logs" class="log-text"></pre>
            </div>
            <div id="stats-tab" class="tab-pane">
              <pre id="stats-content" class="log-text"></pre>
            </div>
          </div>
        </div>
      </div>
    `;
        this.attachEventListeners();
        this.updateLogDisplay();
    }
    /**
     * Attach event listeners to the log viewer
     */
    attachEventListeners() {
        if (!this.container)
            return;
        // Refresh logs
        const refreshBtn = this.container.querySelector('#refresh-logs');
        refreshBtn?.addEventListener('click', () => {
            this.updateLogDisplay();
        });
        // Export logs as file
        const exportBtn = this.container.querySelector('#export-logs');
        exportBtn?.addEventListener('click', () => {
            logManager.exportLogsAsFile();
        });
        // Export logs as JSON
        const exportJsonBtn = this.container.querySelector('#export-json');
        exportJsonBtn?.addEventListener('click', async () => {
            try {
                const jsonData = await logManager.exportLogsAsJSON();
                this.downloadJSON(jsonData, `game-logs-${logManager.getSessionId()}.json`);
            }
            catch (error) {
                console.error('Failed to export JSON logs:', error);
            }
        });
        // Clear logs
        const clearBtn = this.container.querySelector('#clear-logs');
        clearBtn?.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all logs?')) {
                logManager.clearAllLogs();
                this.updateLogDisplay();
            }
        });
        // Toggle logging
        const toggleBtn = this.container.querySelector('#toggle-logging');
        toggleBtn?.addEventListener('click', () => {
            const isEnabled = logManager.isLoggingEnabled();
            logManager.setLoggingEnabled(!isEnabled);
            this.updateLogDisplay();
        });
        // Tab switching
        const tabBtns = this.container.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target;
                const tabName = target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }
    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        if (!this.container)
            return;
        // Update tab buttons
        const tabBtns = this.container.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => btn.classList.remove('active'));
        this.container.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        // Update tab content
        const tabPanes = this.container.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => pane.classList.remove('active'));
        this.container.querySelector(`#${tabName}-tab`)?.classList.add('active');
        // Update content based on tab
        switch (tabName) {
            case 'current':
                this.updateCurrentLogs();
                break;
            case 'all':
                this.updateAllLogs();
                break;
            case 'stats':
                this.updateStats();
                break;
        }
    }
    /**
     * Update the entire log display
     */
    updateLogDisplay() {
        this.updateStats();
        this.updateCurrentLogs();
        this.updateAllLogs();
    }
    /**
     * Update statistics display
     */
    updateStats() {
        if (!this.container)
            return;
        const stats = logManager.getGameStats();
        const sessionIdEl = this.container.querySelector('#session-id');
        const totalMovesEl = this.container.querySelector('#total-moves');
        const totalScoreEl = this.container.querySelector('#total-score');
        const loggingStatusEl = this.container.querySelector('#logging-status');
        if (sessionIdEl)
            sessionIdEl.textContent = logManager.getSessionId();
        if (totalMovesEl)
            totalMovesEl.textContent = stats.totalMoves.toString();
        if (totalScoreEl)
            totalScoreEl.textContent = stats.totalScore.toString();
        if (loggingStatusEl)
            loggingStatusEl.textContent = logManager.isLoggingEnabled() ? 'Enabled' : 'Disabled';
        // Update stats tab content
        const statsContent = this.container.querySelector('#stats-content');
        if (statsContent) {
            statsContent.textContent = JSON.stringify(stats, null, 2);
        }
    }
    /**
     * Update current session logs
     */
    updateCurrentLogs() {
        if (!this.container)
            return;
        const currentLogsEl = this.container.querySelector('#current-logs');
        if (currentLogsEl) {
            const logs = logManager.getCurrentSessionLogs();
            currentLogsEl.textContent = logs || 'No logs available for current session';
        }
    }
    /**
     * Update all logs display
     */
    updateAllLogs() {
        if (!this.container)
            return;
        const allLogsEl = this.container.querySelector('#all-logs');
        if (allLogsEl) {
            const allLogs = logManager.getAllStoredLogs();
            let displayText = '';
            for (const [filename, content] of Object.entries(allLogs)) {
                displayText += `\n=== ${filename} ===\n${content}\n`;
            }
            allLogsEl.textContent = displayText || 'No logs available';
        }
    }
    /**
     * Download JSON data as file
     */
    downloadJSON(jsonData, filename) {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }
    /**
     * Show log viewer in a modal
     */
    showLogViewerModal() {
        const modal = document.createElement('div');
        modal.className = 'log-modal';
        modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🎮 Game Logs</h2>
          <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body" id="modal-log-container"></div>
      </div>
    `;
        document.body.appendChild(modal);
        // Create log viewer in modal
        const container = modal.querySelector('#modal-log-container');
        if (container) {
            const viewer = new LogViewer();
            viewer.container = container;
            viewer.createLogViewerUI();
        }
        // Close modal
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn?.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}
// Global log viewer instance
export const logViewer = new LogViewer();
//# sourceMappingURL=log-viewer.js.map
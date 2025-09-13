/**
 * Simple Express server to handle file saving for Match-3 game logs
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('dist'));

// CORS middleware for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ensure logs directory exists
async function ensureLogsDirectory() {
  const logsDir = path.join(__dirname, 'logs');
  try {
    await fs.access(logsDir);
  } catch (error) {
    await fs.mkdir(logsDir, { recursive: true });
  }
}

// API endpoint to save log files
app.post('/api/save-log', async (req, res) => {
  try {
    const { sessionId, content, type = 'log' } = req.body;

    if (!sessionId || !content) {
      return res.status(400).json({ error: 'SessionId and content are required' });
    }

    await ensureLogsDirectory();

    const extension = type === 'json' ? 'json' : 'log';
    const filename = `game-session-${sessionId}.${extension}`;
    const filepath = path.join(__dirname, 'logs', filename);

    await fs.writeFile(filepath, content, 'utf8');

    console.log(`📁 Log file saved: ${filename}`);
    res.json({
      success: true,
      message: `Log file saved to logs/${filename}`,
      filename: filename
    });

  } catch (error) {
    console.error('Failed to save log file:', error);
    res.status(500).json({
      error: 'Failed to save log file',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Match-3 Log Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Match-3 Log Server running on http://localhost:${PORT}`);
  console.log(`📁 Logs will be saved to: ${path.join(__dirname, 'logs')}`);
});
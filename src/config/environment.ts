/**
 * Environment Configuration
 * 環境配置 - 檢測部署環境並控制功能顯示
 */

export interface EnvironmentConfig {
  isProduction: boolean;
  isGitHubPages: boolean;
  enableExport: boolean;
  enableServerFeatures: boolean;
}

/**
 * 檢測當前環境
 * Detect current environment
 */
function detectEnvironment(): EnvironmentConfig {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : '';

  // GitHub Pages 檢測
  const isGitHubPages = hostname.endsWith('.github.io') || hostname.includes('github.io');

  // 生產環境檢測
  const isProduction = isGitHubPages || protocol === 'https:' || hostname !== 'localhost';

  // 功能開關
  const enableExport = !isProduction; // 只在開發環境顯示
  const enableServerFeatures = !isGitHubPages; // GitHub Pages 不支援伺服器功能

  return {
    isProduction,
    isGitHubPages,
    enableExport,
    enableServerFeatures
  };
}

export const ENV = detectEnvironment();

/**
 * 記錄環境資訊到控制台
 * Log environment info to console
 */
export function logEnvironmentInfo(): void {
  console.log('🌍 Environment Info:', {
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    isProduction: ENV.isProduction,
    isGitHubPages: ENV.isGitHubPages,
    enableExport: ENV.enableExport,
    enableServerFeatures: ENV.enableServerFeatures
  });
}
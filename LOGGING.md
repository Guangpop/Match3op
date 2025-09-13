# 🎮 Match-3 Log System

這是一個專為 Match-3 遊戲設計的完整 log 系統，用於記錄玩家移動、盤面狀況、落下補齊狀況等詳細資訊，幫助除錯和遊戲分析。

## 📁 檔案結構

```
src/core/
├── file-logger.ts      # 檔案 log 記錄器
├── game-logger.ts      # 遊戲 log 記錄器
├── log-manager.ts      # 統一 log 管理器
├── log-viewer.ts       # log 查看器 UI
└── log-viewer.css      # log 查看器樣式

logs/                   # log 檔案存放目錄
├── {timestamp}.log     # 遊戲 session log 檔案
└── ...

test-logs.html          # log 系統測試頁面
```

## 🚀 快速開始

### 1. 基本使用

```typescript
import { logManager } from './src/core/log-manager.js';

// 記錄玩家移動
logManager.logPlayerMove(
  moveNumber,
  swapPositions,
  boardBefore,
  matchesFound,
  cascadeEvents,
  boardAfter,
  scoreGained,
  totalScore
);

// 記錄盤面狀態
logManager.logBoardState('Initial Board', board);

// 記錄錯誤
logManager.logError(error, 'Context information');

// 記錄除錯資訊
logManager.logDebug('Debug message', { data: 'value' });
```

### 2. 測試 log 系統

開啟 `test-logs.html` 檔案來測試 log 系統：

```bash
# 在專案根目錄執行
open test-logs.html
# 或
python -m http.server 8000
# 然後開啟 http://localhost:8000/test-logs.html
```

## 📊 Log 內容

### 玩家移動記錄
- 移動步數
- 交換位置和方塊類型
- 交換前盤面狀態
- 找到的匹配組合
- 連鎖事件詳情
- 交換後盤面狀態
- 得分和總分

### 盤面狀況記錄
- 完整的 8x8 盤面狀態
- 方塊類型（用表情符號表示：🔴🔵🟡🟢🟣）
- 空位標記（⚫）

### 落下補齊狀況
- 方塊落下移動軌跡
- 重力應用前後盤面對比
- 新方塊生成位置和類型
- 補齊操作詳情

## 🛠️ 功能特色

### 1. 統一 Log 管理
- `LogManager` 提供統一的 log 介面
- 自動管理 session ID 和時間戳
- 支援啟用/停用 log 功能

### 2. 多種 Log 格式
- **文字格式**：人類可讀的詳細 log
- **JSON 格式**：程式可解析的結構化資料
- **即時 Console**：開發時即時查看

### 3. 視覺化 Log 查看器
- 網頁版 log 查看器
- 分頁顯示（當前 session、所有 logs、統計資料）
- 即時更新和重新整理
- 一鍵匯出功能

### 4. 除錯工具
- 錯誤記錄和堆疊追蹤
- 除錯訊息記錄
- 遊戲狀態變更記錄
- 統計資料分析

## 📋 API 參考

### LogManager 主要方法

```typescript
// 記錄玩家移動
logPlayerMove(moveNumber, swapPositions, boardBefore, matchesFound, cascadeEvents, boardAfter, scoreGained, totalScore)

// 記錄盤面狀態
logBoardState(title: string, board: TileType[][])

// 記錄方塊落下
logFallingTiles(movements: Map<string, Position>, boardBefore: TileType[][], boardAfter: TileType[][])

// 記錄補齊操作
logRefill(boardBefore: TileType[][], boardAfter: TileType[][])

// 記錄錯誤
logError(error: Error, context?: string)

// 記錄除錯資訊
logDebug(message: string, data?: any)

// 記錄遊戲狀態變更
logGameStateChange(changeType: string, details: any)

// 記錄遊戲統計
logGameStats(stats: any)

// 匯出 logs
exportLogsAsFile(): void
exportLogsAsJSON(): Promise<string>

// 控制 log 功能
setLoggingEnabled(enabled: boolean): void
isLoggingEnabled(): boolean

// 清除 logs
clearAllLogs(): void

// 取得統計資料
getGameStats(): any
```

### LogViewer 主要方法

```typescript
// 建立 log 查看器 UI
createLogViewerUI(): void

// 顯示 log 查看器模態視窗
showLogViewerModal(): void

// 更新 log 顯示
updateLogDisplay(): void
```

## 🎯 使用場景

### 1. 遊戲除錯
- 追蹤玩家移動邏輯
- 分析匹配演算法
- 檢查連鎖反應
- 驗證重力系統

### 2. 遊戲平衡調整
- 分析玩家行為模式
- 統計得分分佈
- 優化遊戲難度
- 調整方塊生成機率

### 3. 效能分析
- 追蹤遊戲效能
- 識別效能瓶頸
- 優化動畫系統
- 監控記憶體使用

### 4. 使用者體驗研究
- 分析遊戲流程
- 識別使用者痛點
- 優化使用者介面
- 改善遊戲體驗

## 📁 Log 檔案格式

### 檔案命名
- 格式：`{timestamp}.log`
- 範例：`2024-01-15T10-30-45-123Z.log`

### Log 內容範例
```
🎮 Match-3 Game Session Log
📅 Session ID: 2024-01-15T10-30-45-123Z
🕐 Started: 2024/1/15 下午6:30:45
=====================================

📝 MOVE 1 - 18:30:46
=====================================
🔄 Swap: (0,0)[🔴] ↔ (0,1)[🔵]

📋 Board BEFORE Swap:
   0 1 2 3 4 5 6 7
0: 🔴 🔵 🟡 🟢 🟣 🔴 🔵 🟡
1: 🟢 🟣 🔴 🔵 🟡 🟢 🟣 🔴
...

🎯 Matches Found: 1 groups
  Group 1: (0,0), (0,1), (0,2)

🌊 Cascade Events: 1 levels
  Level 1: 3 tiles cleared, 0 tiles fell, 3 new tiles, +30 points

📋 Board AFTER All Cascades:
   0 1 2 3 4 5 6 7
0: 🟡 🟢 🟣 🔴 🔵 🟡 🟢 🟣
...

💰 Score: +30 (Total: 30)
=====================================
```

## 🔧 自訂設定

### 啟用/停用 Log 功能
```typescript
// 停用 log 功能（提升效能）
logManager.setLoggingEnabled(false);

// 重新啟用 log 功能
logManager.setLoggingEnabled(true);
```

### 自訂 Log 格式
可以修改 `FileLogger` 類別中的格式化方法來自訂 log 輸出格式。

### 自訂 Log 儲存位置
可以修改 `FileLogger` 建構函式中的 `logFilePath` 來變更 log 檔案儲存位置。

## 🐛 常見問題

### Q: Log 檔案沒有產生？
A: 檢查瀏覽器的 localStorage 和 sessionStorage 是否可用，或使用 `exportLogsAsFile()` 手動下載。

### Q: Log 內容太多影響效能？
A: 使用 `setLoggingEnabled(false)` 停用 log 功能，或在生產環境中移除 log 相關程式碼。

### Q: 如何分析大量的 log 資料？
A: 使用 `exportLogsAsJSON()` 匯出 JSON 格式，然後用程式分析或匯入到資料分析工具中。

## 📝 更新日誌

- **v1.0.0**: 初始版本，包含基本的 log 記錄功能
- **v1.1.0**: 新增 LogManager 統一管理介面
- **v1.2.0**: 新增 LogViewer 視覺化查看器
- **v1.3.0**: 新增測試頁面和完整文件

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個 log 系統！

## 📄 授權

此專案使用 MIT 授權條款。

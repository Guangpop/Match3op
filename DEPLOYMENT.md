# 🚀 GitHub Pages 部署指南

## 📋 部署檢查清單

### ✅ 已完成設定

- [x] **GitHub Actions 工作流程** (`.github/workflows/deploy.yml`)
- [x] **環境檢測系統** (`src/config/environment.ts`)
- [x] **生產環境優化** (Export 功能自動隱藏)
- [x] **TypeScript 建構設定** (自動編譯到 `dist/`)
- [x] **統一珠子資料結構**
- [x] **Package.json 部署腳本** (`build:prod`, `serve:prod`)

### 🔧 環境特性

| 環境 | Export 功能 | 伺服器功能 | 檔案日誌 |
|------|------------|-----------|---------|
| 開發環境 (localhost) | ✅ 顯示 | ✅ 啟用 | ✅ 支援 |
| GitHub Pages | ❌ 隱藏 | ❌ 停用 | ❌ 僅瀏覽器下載 |

## 🌐 部署步驟

### 1. 準備 GitHub Repository

```bash
# 確保程式碼已推送到 GitHub
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

### 2. 啟用 GitHub Pages

1. 前往你的 GitHub Repository
2. **Settings** → **Pages**
3. **Source** 選擇 "**GitHub Actions**"
4. **Actions** → **General** → **Workflow permissions** → "**Read and write permissions**"

### 3. 自動部署

推送程式碼後，GitHub Actions 會自動：
1. 檢出程式碼 ✓
2. 安裝 Node.js 18 ✓
3. 安裝相依套件 (`npm ci`) ✓
4. 建構 TypeScript (`npm run build`) ✓
5. 上傳到 GitHub Pages ✓
6. 部署到 `https://username.github.io/match3op` ✓

## 🧪 本地測試

### 開發模式測試
```bash
npm install
npm run build
npm run serve      # localhost:8080 (完整功能)
npm run server &   # 啟動後端服務 (支援 Export)
```

### 生產模式測試
```bash
npm run build:prod
npm run serve:prod # localhost:3002 (模擬 GitHub Pages)
```

在生產模式測試中，Export 按鈕應該會自動隱藏。

## 🎮 部署後確認項目

### ✅ 功能測試
- [ ] 遊戲載入正常
- [ ] 方塊交換動畫流暢
- [ ] 三消匹配正確
- [ ] 連鎖效果正常
- [ ] 計分系統運作
- [ ] Export 按鈕已隱藏 (生產環境)

### ✅ 效能測試
- [ ] 60 FPS 動畫表現
- [ ] 硬體加速正常
- [ ] 粒子效果顯示
- [ ] 響應式設計 (手機/平板)

### ✅ 相容性測試
- [ ] Chrome/Edge (桌面)
- [ ] Safari (桌面)
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] WebView 環境

## 📊 效能監控

部署後可在瀏覽器開發者工具中檢查：

```javascript
// 在瀏覽器 Console 中查看環境資訊
console.log(ENV);
```

應該會顯示：
```json
{
  "isProduction": true,
  "isGitHubPages": true,
  "enableExport": false,
  "enableServerFeatures": false
}
```

## 🔧 故障排除

### 部署失敗
1. 檢查 **Actions** 頁面的錯誤訊息
2. 確認 **Workflow permissions** 設定正確
3. 檢查 `package.json` 中的相依套件版本

### 遊戲載入問題
1. 檢查瀏覽器 Console 的錯誤訊息
2. 確認 Phaser.js CDN 載入正常
3. 檢查 ES6 Module 相容性

### 效能問題
1. 啟用瀏覽器硬體加速
2. 檢查 WebGL 支援狀況
3. 關閉不必要的瀏覽器擴充功能

## 📱 行動裝置優化

遊戲已針對 WebView 環境最佳化：
- 觸控操作支援
- 響應式設計
- 硬體加速
- 60fps 動畫

## 🎯 SEO 優化 (可選)

在 `index.html` 中已包含基本的 meta 標籤，可根據需要自訂：
- `<title>` - 遊戲標題
- `<meta name="description">` - 遊戲描述
- `<meta property="og:*">` - 社群分享資訊

---

🎮 **部署完成後，你的 Match-3 遊戲就可以在全世界暢玩了！**
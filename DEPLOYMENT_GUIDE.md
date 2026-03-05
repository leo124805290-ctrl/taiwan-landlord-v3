# 🚀 台灣房東系統 - 完整部署指南

## 系統架構

```
前端 (Vercel) → 後端 (Zeabur) → 資料庫 (PostgreSQL)
```

## 部署狀態檢查

### 1. 前端狀態
- **網址**: https://taiwan-landlord-v3-frontend.vercel.app/
- **狀態**: ✅ 已部署，正常運行
- **最後更新**: 2026-03-05

### 2. 後端狀態
- **網址**: https://taiwan-landlord-v3.zeabur.app/
- **狀態**: ❌ 404錯誤（未部署或部署失敗）
- **問題**: 後端服務沒有運行

### 3. 資料庫狀態
- **狀態**: ❓ 未知（需要後端連接）

## 問題診斷

### 當前問題
1. **後端服務 404**：Zeabur 上沒有運行後端服務
2. **前端無法連接**：前端嘗試連接不存在的後端
3. **資料庫未配置**：後端需要 PostgreSQL 資料庫

## 解決方案

### 方案 A：完整部署（推薦）

#### 步驟 1：部署後端到 Zeabur
1. 登入 [Zeabur 控制台](https://zeabur.com)
2. 選擇 `taiwan-landlord-v3` 專案
3. 點擊「新增服務」
4. 選擇「從原始碼部署」
5. 連接 GitHub 倉庫：`leo124805290-ctrl/taiwan-landlord-v3`
6. 設定服務：
   - **名稱**: `backend`
   - **根目錄**: `/apps/backend`
   - **啟動指令**: `npm start`
   - **連接埠**: `3000`
7. 點擊「部署」

#### 步驟 2：設定環境變數
在 Zeabur 後端服務設定中，添加以下環境變數：
```
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://taiwan-landlord-v3-frontend.vercel.app
DATABASE_URL=你的_PostgreSQL_連接字串
```

#### 步驟 3：新增資料庫
1. 在 Zeabur 市場中新增「PostgreSQL」服務
2. 獲取連接字串
3. 將連接字串設定為 `DATABASE_URL`

#### 步驟 4：測試部署
1. 訪問：`https://你的後端.zeabur.app/api/health`
2. 應該返回 `{"status":"ok","message":"API is running"}`

### 方案 B：使用模擬數據（臨時方案）

如果暫時不想部署後端，可以使用模擬數據模式：

1. 在前端瀏覽器控制台中執行：
   ```javascript
   localStorage.setItem('forceMockData', 'true');
   location.reload();
   ```

2. 系統會使用本地儲存（localStorage）保存數據
3. 所有功能都可以正常使用
4. 數據可以匯出/匯入

## 技術規格

### 後端要求
- **Node.js**: 18.x 或更高
- **記憶體**: 至少 512MB
- **儲存空間**: 至少 1GB

### 資料庫要求
- **PostgreSQL**: 12.x 或更高
- **表格**: 系統會自動創建

### 前端要求
- **現代瀏覽器**: Chrome 90+, Firefox 88+, Safari 14+
- **JavaScript**: ES6+ 支援

## 故障排除

### 常見問題 1：後端 404 錯誤
```
錯誤：無法連接到後端伺服器
解決：檢查 Zeabur 部署日誌，確保後端服務正在運行
```

### 常見問題 2：CORS 錯誤
```
錯誤：跨域請求被阻止
解決：確保 ALLOWED_ORIGINS 環境變數包含前端網址
```

### 常見問題 3：資料庫連接錯誤
```
錯誤：無法連接到資料庫
解決：檢查 DATABASE_URL 格式和權限
```

### 常見問題 4：前端 JavaScript 錯誤
```
錯誤：showPropertyModal is not defined
解決：清除瀏覽器快取，重新載入頁面
```

## 監控與維護

### 健康檢查
- 前端：訪問首頁，檢查控制台錯誤
- 後端：`GET /api/health`
- 資料庫：後端日誌中的連接狀態

### 備份策略
1. **自動備份**：Zeabur PostgreSQL 有自動備份
2. **手動備份**：從前端匯出數據（JSON格式）
3. **版本控制**：GitHub 保存程式碼

### 性能優化
1. **快取**：前端使用 localStorage 快取數據
2. **壓縮**：啟用 Gzip 壓縮
3. **CDN**：Vercel 自動提供 CDN

## 升級指南

### 從模擬模式升級到完整模式
1. 部署後端和資料庫
2. 在前端執行：
   ```javascript
   localStorage.removeItem('forceMockData');
   ```
3. 系統會自動切換到後端模式

### 數據遷移
1. 從模擬模式匯出數據（JSON）
2. 部署完整系統
3. 使用後端 API 匯入數據

## 緊急恢復

### 後端完全故障
1. 切換到模擬模式：`localStorage.setItem('forceMockData', 'true')`
2. 繼續使用本地功能
3. 修復後端後，數據可以同步

### 資料庫故障
1. 從備份恢復
2. 或從前端匯入最近備份

## 聯絡支援

### 技術問題
1. 檢查本文件
2. 查看 GitHub Issues
3. 聯繫開發者

### 部署問題
1. Zeabur 文件：https://docs.zeabur.com
2. Vercel 文件：https://vercel.com/docs

---

**最後更新**: 2026-03-05  
**版本**: 1.0.0  
**狀態**: 等待後端部署
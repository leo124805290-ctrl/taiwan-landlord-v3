# 🚀 台灣房東系統 - 一鍵部署

## 立即部署到 Zeabur

[![Deploy to Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/projects/create?template=leo124805290-ctrl/taiwan-landlord-ultimate)

## 部署步驟

### 方法一：一鍵部署（推薦）
1. **點擊上方按鈕**
2. **登入 Zeabur**（使用 GitHub 帳號）
3. **選擇專案名稱**
4. **點擊「Deploy」**
5. **等待部署完成**（約 2-5 分鐘）

### 方法二：手動部署
1. **Fork 專案**到你的 GitHub
2. **前往 Zeabur**：https://zeabur.com
3. **點擊「Create Project」**
4. **選擇「Import from GitHub」**
5. **選擇你的專案**
6. **點擊「Deploy」**

## 部署後設定

### 1. 檢查部署狀態
部署完成後，訪問：
```
https://你的專案.zeabur.app/api/health
```
應該看到健康檢查回應。

### 2. 初始化資料庫
訪問以下網址初始化資料庫：
```
https://你的專案.zeabur.app/api/init-db
```

### 3. 訪問系統
系統首頁：
```
https://你的專案.zeabur.app
```

## 系統功能

### 🏠 物業管理
- 新增/編輯/刪除物業
- 房間管理
- 租金設定

### 👤 租客管理
- 租客資訊
- 入住/退租記錄
- 聯絡方式

### 💰 繳費管理
- 租金收款
- 押金管理
- 付款狀態

### ⚡ 成本管理
- 支出記錄
- 分類統計
- 月度趨勢

### 🔄 同步功能
- 多設備同步
- 即時更新
- 離線支援

## 技術特色

### ✅ 一次部署成功
- 極簡架構，沒有複雜依賴
- 完整配置檔案
- 穩定版本鎖定

### ✅ 雲端原生
- PostgreSQL 資料庫
- WebSocket 同步
- 自動擴展

### ✅ 包租公專用
- 簡單直觀界面
- 快速操作流程
- 實用功能優先

## 故障排除

### 1. 部署失敗
- 檢查 `package-lock.json` 是否存在
- 確認 Dockerfile 語法正確
- 查看 Zeabur 日誌

### 2. 資料庫連接失敗
- 確認 `DATABASE_URL` 環境變數
- 執行 `/api/init-db` 初始化
- 檢查資料庫服務狀態

### 3. 前端無法載入
- 檢查 JavaScript 錯誤
- 確認 API 端點可訪問
- 清除瀏覽器快取

## 支援與聯絡

### 問題回報
- **GitHub Issues**：專案 Issues 頁面
- **Email**：系統管理員

### 文件資源
- **API 文件**：`/api/health` 查看系統資訊
- **部署指南**：本檔案
- **技術規格**：查看原始碼註解

---

**💪 地表最強的包租公系統，一次部署成功！**

**如有任何問題，請隨時聯絡我們！** 📧
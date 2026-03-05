# 🔧 Vercel 部署故障排除指南

## ❌ 錯誤訊息
```
指定的根目錄“apps/frontend”不存在。請更新您的項目設定。
```

## 🔍 問題分析
Vercel 還在嘗試使用舊的專案配置，可能是因為：
1. **Vercel 緩存**: 舊的專案設定被緩存
2. **舊配置**: 之前的 `vercel.json` 或專案設定
3. **Git 歷史**: 舊的配置檔案還在 Git 歷史中

## 🛠️ 解決方案

### 方案 1: 在 Vercel 控制台更新設定 (推薦)
1. **登入 Vercel**: https://vercel.com
2. **選擇專案**: `taiwan-landlord-v3`
3. **進入設定**: 點擊 "Settings"
4. **找到 "Build & Development Settings"**
5. **更新以下設定**:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm ci --include=dev`
   - **Root Directory**: (留空或 `/`)
6. **點擊 "Save"**
7. **重新部署**: 點擊 "Deployments" → "Redeploy"

### 方案 2: 刪除並重新創建專案
1. **刪除舊專案**:
   - 進入 Vercel 專案列表
   - 找到 `taiwan-landlord-v3`
   - 點擊 "..." → "Delete Project"
   - 確認刪除

2. **創建新專案**:
   - 點擊 "New Project"
   - 選擇 `taiwan-landlord-v3` 倉庫
   - **重要**: 在配置頁面檢查:
     - Framework: Next.js (自動偵測)
     - Root Directory: (留空)
   - 點擊 "Deploy"

### 方案 3: 使用 Vercel CLI (進階)
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 在專案目錄中
cd taiwan-landlord-v3

# 部署並設定
vercel --prod

# 當詢問配置時:
# - Set up and deploy: Yes
# - Which scope: 選擇你的帳號
# - Link to existing project: No
# - What's your project's name: taiwan-landlord-v3
# - In which directory: . (當前目錄)
# - Want to override settings: Yes
# - Build Command: npm run build
# - Output Directory: .next
# - Development Command: npm run dev
# - Install Command: npm ci --include=dev
```

### 方案 4: 檢查 Git 歷史
```bash
# 檢查是否有舊的 vercel.json 或配置
git log --all --full-history -- "**/vercel*" "**/.vercel*"

# 如果有舊配置，可能需要清理
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch apps/frontend/vercel.json apps/backend/vercel.json' \
  --prune-empty --tag-name-filter cat -- --all
```

## ✅ 正確的專案結構
```
taiwan-landlord-v3/
├── app/                    # Next.js App Router
├── components/            # React 組件
├── contexts/              # React Context
├── lib/                   # 工具函數
├── public/                # 靜態資源
├── package.json          # 依賴配置
├── vercel.json           # 部署配置 (正確)
└── .gitignore            # Git 忽略檔案
```

## 📋 部署配置檢查清單

### 必須正確的配置
- [ ] **Root Directory**: 空或 `/` (不是 `apps/frontend`)
- [ ] **Framework**: Next.js
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `.next`
- [ ] **Install Command**: `npm ci --include=dev`

### 專案檔案檢查
- [ ] `vercel.json` 存在且正確
- [ ] `package.json` 存在且正確
- [ ] `app/` 目錄存在
- [ ] `components/` 目錄存在

## 🚨 常見錯誤

### 錯誤 1: 根目錄錯誤
```
錯誤: 指定的根目錄不存在
解決: 在 Vercel 設定中將 Root Directory 設為空
```

### 錯誤 2: 構建失敗
```
錯誤: Build failed
解決: 檢查 package.json 中的依賴版本
```

### 錯誤 3: 框架偵測錯誤
```
錯誤: Framework not detected
解決: 手動設定為 Next.js
```

## 🔄 快速修復步驟

### 5分鐘修復
1. **登入 Vercel**
2. **進入專案設定**
3. **找到 "Build & Development Settings"**
4. **將 "Root Directory" 設為空**
5. **點擊 "Save"**
6. **重新部署**

### 如果還是不行
1. **刪除 Vercel 專案**
2. **重新創建專案**
3. **確保根目錄為空**
4. **部署**

## 📞 技術支援

### 需要幫助？
1. **截圖錯誤**: 提供完整的錯誤訊息
2. **檢查日誌**: Vercel 部署日誌
3. **聯繫開發者**: 提供錯誤詳情

### 緊急聯絡
如果以上方法都無效，可以：
1. **創建新倉庫**: `taiwan-landlord-system-ready`
2. **重新部署**: 使用新倉庫
3. **遷移數據**: 使用備份功能

## 🎯 最終目標
**成功部署到**: https://taiwan-landlord-v3.vercel.app/

**功能完整**:
- ✅ 房間管理
- ✅ 繳費管理  
- ✅ 成本管理
- ✅ 系統設定
- ✅ 多語言支援

**現在就去 Vercel 修復部署吧！** 🚀
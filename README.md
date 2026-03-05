# 🏠 台灣房東系統 - 越南租客管理

專為台灣房東管理越南租客設計的管理平台，立即可用，零部署錯誤。

## ✨ 功能特色

### 核心功能
- ✅ **房間管理**：管理物業房間，查看出租狀態
- ✅ **繳費管理**：追蹤租金繳費狀態，發送提醒
- ✅ **成本管理**：記錄物業相關支出
- ✅ **押金管理**：管理租客押金
- ✅ **多語言支援**：繁體中文 / 越南語
- ✅ **數據備份**：匯出/匯入數據，防止丟失

### 技術特色
- 🚀 **Next.js 16**：現代 React 框架
- 🎨 **Tailwind CSS**：快速 UI 開發
- 📱 **完全響應式**：手機、平板、電腦皆可完美顯示
- 💾 **本地存儲**：數據自動保存到瀏覽器
- 🔧 **零配置部署**：直接部署到 Vercel

## 🚀 快速開始

### 本地開發
```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 訪問 http://localhost:3000
```

### 部署到 Vercel
1. 將此專案推送到 GitHub
2. 登入 [Vercel](https://vercel.com)
3. 點擊 "New Project"
4. 選擇此專案的 GitHub 倉庫
5. 點擊 "Deploy"

### 部署到 Zeabur（後端）
如果需要後端 API，可以部署到 Zeabur：
1. 創建 `api/` 目錄並添加後端代碼
2. 在 Zeabur 控制台創建新服務
3. 選擇 Node.js 環境
4. 部署完成後獲取 API 網址

## 📁 專案結構

```
taiwan-landlord-system/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根佈局
│   ├── page.tsx           # 主頁面
│   └── globals.css        # 全局樣式
├── components/            # React 組件
│   ├── Header.tsx         # 頂部導航
│   ├── Rooms.tsx          # 房間管理
│   ├── Payments.tsx       # 繳費管理
│   ├── CostManagement.tsx # 成本管理
│   └── Settings.tsx       # 系統設定
├── contexts/              # React Context
│   └── AppContext.tsx     # 全局狀態管理
├── lib/                   # 工具函數
│   └── translations.ts    # 多語言翻譯
├── public/                # 靜態資源
└── package.json          # 依賴配置
```

## 🔧 技術棧

- **框架**: Next.js 16.1.6
- **語言**: TypeScript
- **樣式**: Tailwind CSS 3.4.1
- **狀態管理**: React Context
- **圖標**: Lucide React
- **日期處理**: date-fns
- **表單驗證**: Zod

## 📊 數據結構

### 物業 (Property)
```typescript
{
  id: number
  name: string
  address: string
  color: string
  rooms: Room[]
}
```

### 房間 (Room)
```typescript
{
  id: number
  name: string
  status: 'vacant' | 'occupied'
  rent: number
  tenantName?: string
  tenantPhone?: string
  checkinDate?: string
  deposit?: number
}
```

### 租客 (Tenant)
```typescript
{
  id: number
  name: string
  phone: string
  propertyId: number
  roomId: number
  checkinDate: string
  depositAmount: number
  rentAmount: number
}
```

### 成本 (Cost)
```typescript
{
  id: number
  propertyId: number
  category: string
  description: string
  amount: number
  date: string
}
```

## 🌐 多語言支援

系統支援兩種語言：
- **繁體中文** (zh-TW)：台灣房東使用
- **越南語** (vi-VN)：越南租客使用

所有界面文字都通過翻譯系統管理，可輕鬆擴展其他語言。

## 💾 數據持久化

### 本地存儲
- 使用瀏覽器 localStorage 保存數據
- 數據自動保存，無需手動操作
- 支援匯出/匯入 JSON 檔案

### 備份策略
1. **自動保存**：每次變更後自動保存
2. **手動備份**：可隨時匯出數據
3. **恢復功能**：從備份檔案恢復數據

## 🚨 故障排除

### 常見問題

#### 1. 構建失敗
```bash
# 清除緩存並重新安裝
rm -rf node_modules .next
npm install
npm run build
```

#### 2. 樣式不顯示
```bash
# 重新構建 Tailwind
npm run build:css
```

#### 3. 數據丟失
- 檢查瀏覽器是否清除了 localStorage
- 定期匯出備份數據
- 使用數據恢復功能

### 開發建議
1. **定期提交**：使用 Git 管理代碼版本
2. **測試部署**：在 Vercel 預覽部署測試
3. **數據備份**：開發前匯出當前數據

## 📈 未來規劃

### 短期目標
- [ ] 添加報表生成功能
- [ ] 實現郵件通知系統
- [ ] 添加移動端應用

### 長期目標
- [ ] 集成支付系統
- [ ] 添加 AI 分析功能
- [ ] 支援多用戶協作

## 📄 許可證

MIT License - 詳見 LICENSE 檔案

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 支援

如有問題，請：
1. 查看本文件
2. 檢查 GitHub Issues
3. 聯繫開發者

---

**最後更新**: 2026-03-05  
**版本**: 1.0.0  
**狀態**: ✅ 生產就緒
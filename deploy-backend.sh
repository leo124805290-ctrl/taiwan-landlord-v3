#!/bin/bash
echo "🚀 部署台灣房東系統後端到 Zeabur"

# 檢查必要文件
if [ ! -f "apps/backend/simple-api-fixed.js" ]; then
    echo "❌ 找不到後端主文件"
    exit 1
fi

if [ ! -f "apps/backend/package.json" ]; then
    echo "❌ 找不到 package.json"
    exit 1
fi

echo "✅ 後端文件檢查完成"
echo "📦 後端目錄結構:"
echo "  - simple-api-fixed.js (主文件)"
echo "  - package.json (依賴配置)"
echo "  - 依賴: express, cors, helmet, socket.io, pg"

echo ""
echo "📋 部署步驟:"
echo "1. 登入 Zeabur 控制台"
echo "2. 選擇 taiwan-landlord-v3 專案"
echo "3. 點擊「新增服務」"
echo "4. 選擇「從原始碼部署」"
echo "5. 連接 GitHub 倉庫"
echo "6. 設定服務:"
echo "   - 名稱: backend"
echo "   - 根目錄: /apps/backend"
echo "   - 啟動指令: npm start"
echo "   - 連接埠: 3000"
echo "7. 點擊「部署」"

echo ""
echo "🔧 環境變數設定 (部署後在 Zeabur 控制台設定):"
echo "  - PORT=3000"
echo "  - NODE_ENV=production"
echo "  - DATABASE_URL=(你的 PostgreSQL 連接字串)"
echo "  - ALLOWED_ORIGINS=https://taiwan-landlord-v3-frontend.vercel.app"

echo ""
echo "💡 提示:"
echo "- 如果沒有 PostgreSQL 資料庫，可以在 Zeabur 市場新增"
echo "- 部署完成後，測試 API: https://你的服務.zeabur.app/api/health"
echo "- 前端已設定連接到此後端"

echo ""
echo "🎯 目標: 讓 https://taiwan-landlord-v3.zeabur.app 正常運作"
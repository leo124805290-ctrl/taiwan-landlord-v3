#!/bin/bash

# 🧪 台灣房東系統 - 測試指令稿

echo "=========================================="
echo "🧪 台灣房東系統測試"
echo "=========================================="

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# 測試函數
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "測試 $name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        echo -e "${GREEN}✅ 成功${NC}"
        return 0
    else
        echo -e "${RED}❌ 失敗${NC}"
        return 1
    fi
}

# 檢查伺服器是否運行
echo "檢查伺服器狀態..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "啟動伺服器..."
    node simple-api-fixed.js &
    SERVER_PID=$!
    sleep 3
fi

# 執行測試
echo ""
echo "執行 API 測試..."
echo ""

# 測試健康檢查
test_endpoint "健康檢查" "http://localhost:3000/api/health"

# 測試同步API
test_endpoint "同步API" "http://localhost:3000/api/sync/all"

# 測試初始化資料庫
test_endpoint "資料庫初始化" "http://localhost:3000/api/init-db"

# 測試前端檔案
echo ""
echo "測試前端檔案..."
if [ -f "public/index.html" ]; then
    echo -e "${GREEN}✅ index.html 存在${NC}"
else
    echo -e "${RED}❌ index.html 不存在${NC}"
fi

if [ -f "public/app.js" ]; then
    echo -e "${GREEN}✅ app.js 存在${NC}"
else
    echo -e "${RED}❌ app.js 不存在${NC}"
fi

# 測試依賴檔案
echo ""
echo "測試依賴檔案..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json 存在${NC}"
else
    echo -e "${RED}❌ package.json 不存在${NC}"
fi

if [ -f "package-lock.json" ]; then
    echo -e "${GREEN}✅ package-lock.json 存在${NC}"
else
    echo -e "${RED}❌ package-lock.json 不存在${NC}"
fi

if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✅ Dockerfile 存在${NC}"
else
    echo -e "${RED}❌ Dockerfile 不存在${NC}"
fi

if [ -f "zeabur.yml" ]; then
    echo -e "${GREEN}✅ zeabur.yml 存在${NC}"
else
    echo -e "${RED}❌ zeabur.yml 不存在${NC}"
fi

# 停止伺服器
if [ ! -z "$SERVER_PID" ]; then
    echo ""
    echo "停止測試伺服器..."
    kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "=========================================="
echo "🧪 測試完成"
echo "=========================================="
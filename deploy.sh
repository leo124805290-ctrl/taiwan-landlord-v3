#!/bin/bash

# 🚀 台灣房東系統 - 一鍵部署指令稿
# 地表最強的包租公系統 💪

set -e  # 遇到錯誤立即退出

echo "=========================================="
echo "🏠 台灣房東系統 - 終極完整版部署"
echo "=========================================="

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函數：顯示進度
progress() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

# 函數：顯示成功
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 函數：顯示警告
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 函數：顯示錯誤
error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# 檢查必要工具
check_requirements() {
    progress "檢查系統要求..."
    
    # 檢查 Git
    if ! command -v git &> /dev/null; then
        error "Git 未安裝，請先安裝 Git"
    fi
    success "Git 已安裝"
    
    # 檢查 Node.js
    if ! command -v node &> /dev/null; then
        warning "Node.js 未安裝，但 Zeabur 會自動處理"
    else
        success "Node.js 已安裝"
    fi
    
    # 檢查 Docker（可選）
    if command -v docker &> /dev/null; then
        success "Docker 已安裝（本地測試用）"
    fi
}

# 準備專案
prepare_project() {
    progress "準備專案..."
    
    # 檢查是否在正確的目錄
    if [ ! -f "simple-api-fixed.js" ]; then
        error "請在專案根目錄執行此指令稿"
    fi
    
    # 檢查必要檔案
    required_files=("package.json" "package-lock.json" "Dockerfile" "zeabur.yml" "public/index.html" "public/app.js")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            error "缺少必要檔案: $file"
        fi
    done
    success "所有必要檔案都存在"
    
    # 檢查 package.json
    if ! grep -q '"name": "taiwan-landlord-ultimate"' package.json; then
        warning "package.json 中的專案名稱不匹配"
    fi
    
    # 檢查 Node.js 依賴
    if [ -f "package-lock.json" ]; then
        success "package-lock.json 存在，確保版本鎖定"
    else
        warning "package-lock.json 不存在，建議生成"
    fi
}

# 本地測試
local_test() {
    progress "執行本地測試..."
    
    # 檢查是否可以啟動伺服器
    if command -v node &> /dev/null; then
        progress "啟動本地伺服器測試..."
        
        # 在背景啟動伺服器
        node simple-api-fixed.js &
        SERVER_PID=$!
        
        # 等待伺服器啟動
        sleep 3
        
        # 測試健康檢查
        if curl -s http://localhost:3000/api/health > /dev/null; then
            success "本地伺服器啟動成功"
            
            # 測試 API 端點
            progress "測試 API 端點..."
            
            # 健康檢查
            HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
            if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
                success "健康檢查 API 正常"
            else
                warning "健康檢查 API 返回異常"
            fi
            
            # 同步 API
            SYNC_RESPONSE=$(curl -s http://localhost:3000/api/sync/all)
            if echo "$SYNC_RESPONSE" | grep -q "properties"; then
                success "同步 API 正常"
            else
                warning "同步 API 返回異常"
            fi
            
            # 停止伺服器
            kill $SERVER_PID 2>/dev/null
            wait $SERVER_PID 2>/dev/null
            
        else
            warning "本地伺服器啟動失敗，但 Zeabur 部署可能仍會成功"
            kill $SERVER_PID 2>/dev/null 2>/dev/null || true
        fi
    else
        warning "Node.js 未安裝，跳過本地測試"
    fi
}

# 部署到 GitHub
deploy_to_github() {
    progress "部署到 GitHub..."
    
    # 檢查 Git 倉庫
    if [ ! -d ".git" ]; then
        error "當前目錄不是 Git 倉庫"
    fi
    
    # 檢查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        warning "有未提交的更改，建議先提交"
        read -p "是否要提交更改？ (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "部署準備: $(date '+%Y-%m-%d %H:%M:%S')"
        fi
    fi
    
    # 推送到 GitHub
    progress "推送到 GitHub..."
    if git push; then
        success "GitHub 推送成功"
    else
        error "GitHub 推送失敗"
    fi
}

# 部署到 Zeabur
deploy_to_zeabur() {
    progress "部署到 Zeabur..."
    
    echo ""
    echo "=========================================="
    echo "🚀 Zeabur 部署指南"
    echo "=========================================="
    echo ""
    echo "請按照以下步驟部署到 Zeabur："
    echo ""
    echo "1. 前往 Zeabur：https://zeabur.com"
    echo "2. 點擊「Create Project」"
    echo "3. 選擇「Import from GitHub」"
    echo "4. 選擇你的專案：taiwan-landlord-ultimate"
    echo "5. 點擊「Deploy」"
    echo ""
    echo "或者使用一鍵部署連結："
    echo "https://zeabur.com/projects/create?template=leo124805290-ctrl/taiwan-landlord-ultimate"
    echo ""
    
    # 詢問是否要打開瀏覽器
    read -p "是否要打開 Zeabur 網站？ (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "https://zeabur.com"
        elif command -v open &> /dev/null; then
            open "https://zeabur.com"
        else
            warning "無法自動打開瀏覽器，請手動訪問"
        fi
    fi
}

# 部署後檢查
post_deploy_check() {
    progress "部署後檢查指南..."
    
    echo ""
    echo "=========================================="
    echo "🔧 部署後設定"
    echo "=========================================="
    echo ""
    echo "部署完成後，請執行以下步驟："
    echo ""
    echo "1. 等待 Zeabur 部署完成（約 2-5 分鐘）"
    echo "2. 訪問健康檢查：https://你的專案.zeabur.app/api/health"
    echo "3. 初始化資料庫：https://你的專案.zeabur.app/api/init-db"
    echo "4. 訪問系統首頁：https://你的專案.zeabur.app"
    echo ""
    echo "如果遇到問題，請檢查："
    echo "- Zeabur 部署日誌"
    echo "- 環境變數設定"
    echo "- 資料庫連接"
    echo ""
}

# 主函數
main() {
    echo ""
    echo "=========================================="
    echo "🚀 開始部署台灣房東系統"
    echo "=========================================="
    echo ""
    
    # 檢查系統要求
    check_requirements
    
    # 準備專案
    prepare_project
    
    # 本地測試
    local_test
    
    # 部署到 GitHub
    deploy_to_github
    
    # 部署到 Zeabur
    deploy_to_zeabur
    
    # 部署後檢查
    post_deploy_check
    
    echo ""
    echo "=========================================="
    echo "🎉 部署準備完成！"
    echo "=========================================="
    echo ""
    echo "下一步："
    echo "1. 前往 Zeabur 完成部署"
    echo "2. 設定環境變數"
    echo "3. 初始化資料庫"
    echo "4. 測試系統功能"
    echo ""
    echo "💪 地表最強的包租公系統準備就緒！"
    echo ""
}

# 執行主函數
main "$@"
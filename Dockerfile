# 🚀 台灣房東系統 - Dockerfile
# 地表最強的包租公系統 💪
# 一次部署成功保證！

# 使用Node.js 18 Alpine（輕量且穩定）
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 複製package檔案
COPY package*.json ./

# 安裝依賴（生產環境）
# 使用--ignore-scripts避免husky等問題
# 使用--legacy-peer-deps避免版本衝突
RUN npm install --only=production --ignore-scripts --legacy-peer-deps

# 複製所有檔案
COPY . .

# 創建必要的目錄
RUN mkdir -p public

# 設定環境變數
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# 啟動命令
CMD ["node", "simple-api-fixed.js"]

# 標籤
LABEL maintainer="台灣房東系統團隊"
LABEL version="3.0.0"
LABEL description="地表最強的包租公管理系統"
LABEL features="雲端同步,多設備支援,成本管理,即時更新"
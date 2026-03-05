/**
 * 🚀 台灣房東系統 - 啟動檔案
 * 簡單的啟動檔案，實際邏輯在 simple-api-fixed.js
 */

console.log('==========================================');
console.log('🏠 台灣房東系統 - 終極完整版');
console.log('==========================================');
console.log('');

// 載入環境變數
require('dotenv').config();

// 檢查環境變數
const requiredEnvVars = ['NODE_ENV', 'PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.warn('⚠️  警告：缺少環境變數:', missingEnvVars.join(', '));
    console.warn('   使用預設值或從 .env.example 複製設定');
}

// 顯示系統資訊
console.log('📊 系統資訊:');
console.log(`   環境: ${process.env.NODE_ENV || 'development'}`);
console.log(`   端口: ${process.env.PORT || 3000}`);
console.log(`   資料庫: ${process.env.DATABASE_URL ? '已配置' : '未配置（使用模擬資料）'}`);
console.log('');

// 啟動伺服器
try {
    // 載入主應用程式
    require('./simple-api-fixed.js');
    
    console.log('✅ 系統啟動成功！');
    console.log('');
    console.log('🌐 訪問網址:');
    console.log(`   http://localhost:${process.env.PORT || 3000}`);
    console.log(`   http://localhost:${process.env.PORT || 3000}/api/health`);
    console.log('');
    console.log('💪 地表最強的包租公系統已準備就緒！');
    console.log('==========================================');
    
} catch (error) {
    console.error('❌ 系統啟動失敗:', error.message);
    console.error('   錯誤詳情:', error.stack);
    process.exit(1);
}
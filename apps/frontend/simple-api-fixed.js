/**
 * 🚀 台灣房東系統 - 終極完整版後端
 * 地表最強的雲端包租公系統 💪
 * 一次部署成功！
 * 
 * 注意：這是唯一要修改的後端檔案！
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// 環境變數
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const DATABASE_URL = process.env.DATABASE_URL;

// PostgreSQL連接池
let pool;
if (DATABASE_URL) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  // 測試資料庫連接
  pool.connect((err, client, release) => {
    if (err) {
      console.error('❌ 資料庫連接失敗:', err.message);
    } else {
      console.log('✅ 資料庫連接成功');
      release();
    }
  });
}

// 中間件
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 100, // 每個IP限制100個請求
  message: { error: '請求過於頻繁，請稍後再試' }
});
app.use('/api/', limiter);

// 健康檢查
app.get('/api/health', async (req, res) => {
  try {
    let dbStatus = 'disconnected';
    if (pool) {
      const client = await pool.connect();
      dbStatus = 'connected';
      client.release();
    }
    
    res.json({
      status: 'healthy',
      service: '台灣房東系統',
      version: '3.0.0',
      environment: NODE_ENV,
      database: dbStatus,
      timestamp: new Date().toISOString(),
      features: [
        '雲端PostgreSQL資料庫',
        '即時WebSocket同步',
        '完整API服務',
        '多設備支援',
        '成本管理系統'
      ]
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 初始化資料庫（如果不存在）
app.get('/api/init-db', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: '資料庫未配置' });
  }
  
  try {
    const client = await pool.connect();
    
    // 創建表格
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        color VARCHAR(7) DEFAULT '#3B82F6',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        room_number VARCHAR(50) NOT NULL,
        rent_amount INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(20) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
        check_in_date DATE,
        check_out_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        type VARCHAR(50) DEFAULT 'rent',
        status VARCHAR(20) DEFAULT 'pending',
        payment_date DATE DEFAULT CURRENT_DATE,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS costs (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        amount INTEGER NOT NULL,
        payment_date DATE DEFAULT CURRENT_DATE,
        receipt_no VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    client.release();
    
    res.json({
      success: true,
      message: '資料庫初始化完成',
      tables: ['properties', 'rooms', 'tenants', 'payments', 'costs']
    });
  } catch (error) {
    console.error('❌ 資料庫初始化失敗:', error);
    res.status(500).json({ error: error.message });
  }
});

// 獲取所有資料（巢狀格式）- 符合前端要求
app.get('/api/sync/all', async (req, res) => {
  try {
    if (!pool) {
      // 返回模擬資料（開發用）
      return res.json(getMockData());
    }
    
    const client = await pool.connect();
    
    // 獲取所有資料
    const propertiesResult = await client.query('SELECT * FROM properties ORDER BY id');
    const roomsResult = await client.query('SELECT * FROM rooms ORDER BY property_id, room_number');
    const tenantsResult = await client.query('SELECT * FROM tenants ORDER BY id');
    const paymentsResult = await client.query('SELECT * FROM payments ORDER BY payment_date DESC');
    const costsResult = await client.query('SELECT * FROM costs ORDER BY payment_date DESC');
    
    client.release();
    
    // 轉換為巢狀格式（前端要求）
    const properties = propertiesResult.rows.map(property => {
      const propertyRooms = roomsResult.rows.filter(room => room.property_id === property.id);
      
      // 為每個房間添加租客資訊
      const roomsWithTenants = propertyRooms.map(room => {
        const tenant = tenantsResult.rows.find(t => t.room_id === room.id);
        return {
          id: room.id,
          n: room.room_number, // 前端使用縮寫
          r: room.rent_amount,
          s: room.status,
          t: tenant ? tenant.name : null,
          in: tenant ? tenant.check_in_date : null,
          out: tenant ? tenant.check_out_date : null
        };
      });
      
      // 獲取該物業的付款記錄
      const propertyPayments = paymentsResult.rows.filter(payment => {
        const tenant = tenantsResult.rows.find(t => t.id === payment.tenant_id);
        return tenant && roomsResult.rows.find(r => r.id === tenant.room_id)?.property_id === property.id;
      });
      
      // 獲取該物業的成本記錄
      const propertyCosts = costsResult.rows.filter(cost => cost.property_id === property.id);
      
      return {
        id: property.id.toString(),
        name: property.name,
        address: property.address,
        color: property.color,
        rooms: roomsWithTenants,
        payments: propertyPayments.map(p => ({
          id: p.id,
          tenant_id: p.tenant_id,
          amount: p.amount,
          type: p.type,
          status: p.status,
          payment_date: p.payment_date,
          due_date: p.due_date
        })),
        history: [], // 歷史記錄（可擴展）
        maintenance: propertyCosts.map(c => ({
          id: c.id,
          category: c.category,
          description: c.description,
          amount: c.amount,
          date: c.payment_date,
          receipt_no: c.receipt_no
        }))
      };
    });
    
    res.json({
      properties: properties,
      last_sync: new Date().toISOString(),
      sync_version: '1.0.0'
    });
    
  } catch (error) {
    console.error('❌ 同步資料失敗:', error);
    res.status(500).json({ 
      error: '同步失敗',
      message: error.message 
    });
  }
});

// 儲存資料
app.post('/api/sync/save', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!pool) {
      return res.json({ success: true, message: '開發模式：資料已接收' });
    }
    
    const client = await pool.connect();
    
    switch (type) {
      case 'property':
        await client.query(
          'INSERT INTO properties (name, address, color) VALUES ($1, $2, $3) RETURNING *',
          [data.name, data.address, data.color || '#3B82F6']
        );
        break;
        
      case 'room':
        await client.query(
          'INSERT INTO rooms (property_id, room_number, rent_amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
          [data.property_id, data.room_number, data.rent_amount || 0, data.status || 'available']
        );
        break;
        
      case 'tenant':
        await client.query(
          'INSERT INTO tenants (name, phone, room_id, check_in_date) VALUES ($1, $2, $3, $4) RETURNING *',
          [data.name, data.phone, data.room_id, data.check_in_date]
        );
        break;
        
      case 'payment':
        await client.query(
          'INSERT INTO payments (tenant_id, amount, type, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [data.tenant_id, data.amount, data.type || 'rent', data.status || 'pending', data.due_date]
        );
        break;
        
      case 'cost':
        await client.query(
          'INSERT INTO costs (property_id, category, description, amount, payment_date, receipt_no, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [data.property_id, data.category, data.description, data.amount, data.payment_date, data.receipt_no, data.notes]
        );
        break;
        
      default:
        throw new Error(`不支援的資料類型: ${type}`);
    }
    
    client.release();
    
    // 通知所有連接的設備
    io.emit('data_updated', {
      type: type,
      data: data,
      timestamp: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      message: '資料儲存成功',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 儲存資料失敗:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 入住API（原子性操作）
app.post('/api/checkin/complete', async (req, res) => {
  try {
    const { tenantData, roomId, paymentType, depositAmount, rentAmount } = req.body;
    
    if (!pool) {
      return res.json({
        success: true,
        message: '開發模式：入住成功',
        tenant_id: 999,
        room_updated: true
      });
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. 創建租客
      const tenantResult = await client.query(
        'INSERT INTO tenants (name, phone, room_id, check_in_date) VALUES ($1, $2, $3, $4) RETURNING id',
        [tenantData.name, tenantData.phone, roomId, new Date().toISOString().split('T')[0]]
      );
      const tenantId = tenantResult.rows[0].id;
      
      // 2. 更新房間狀態
      let roomStatus = 'available';
      if (paymentType === 'deposit_only') {
        roomStatus = 'pending';
      } else if (paymentType === 'full') {
        roomStatus = 'occupied';
      }
      
      await client.query(
        'UPDATE rooms SET status = $1 WHERE id = $2',
        [roomStatus, roomId]
      );
      
      // 3. 創建付款記錄（根據付款類型）
      if (paymentType === 'full' && rentAmount > 0) {
        // 全額繳納：創建已付款記錄
        await client.query(
          'INSERT INTO payments (tenant_id, amount, type, status, payment_date) VALUES ($1, $2, $3, $4, $5)',
          [tenantId, rentAmount, 'rent', 'paid', new Date().toISOString().split('T')[0]]
        );
      } else if (paymentType === 'deposit_only' && depositAmount > 0) {
        // 僅付押金：創建押金記錄
        await client.query(
          'INSERT INTO payments (tenant_id, amount, type, status) VALUES ($1, $2, $3, $4)',
          [tenantId, depositAmount, 'deposit', 'pending']
        );
      }
      
      // 4. 如果有押金，記錄押金管理
      if (depositAmount > 0) {
        await client.query(
          'INSERT INTO payments (tenant_id, amount, type, status) VALUES ($1, $2, $3, $4)',
          [tenantId, depositAmount, 'deposit', 'pending']
        );
      }
      
      await client.query('COMMIT');
      
      // 通知所有設備
      io.emit('data_updated', {
        type: 'checkin',
        data: { tenant_id: tenantId, room_id: roomId },
        timestamp: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: '入住成功',
        tenant_id: tenantId,
        room_updated: true,
        payment_created: true
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ 入住失敗:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 成本管理API
app.get('/api/costs/summary', async (req, res) => {
  try {
    if (!pool) {
      // 返回模擬資料
      const mockCosts = [
        { category: 'electricity', total: 4500, count: 3 },
        { category: 'water', total: 2200, count: 2 },
        { category: 'maintenance', total: 3800, count: 2 },
        { category: 'management', total: 2000, count: 1 }
      ];
      return res.json({
        success: true,
        data: {
          total: 12500,
          by_category: mockCosts
        }
      });
    }
    
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(amount) as total
      FROM costs
      GROUP BY category
      ORDER BY total DESC
    `);
    
    client.release();
    
    const total = result.rows.reduce((sum, row) => sum + parseInt(row.total), 0);
    
    res.json({
      success: true,
      data: {
        total: total,
        by_category: result.rows
      }
    });
    
  } catch (error) {
    console.error('❌ 獲取成本摘要失敗:', error);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket連接
io.on('connection', (socket) => {
  console.log('🔄 新設備連接:', socket.id);
  
  // 發送歡迎訊息
  socket.emit('welcome', {
    message: '歡迎使用台灣房東系統',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    features: ['real-time-sync', 'cloud-database', 'multi-device']
  });
  
  // 數據更新通知
  socket.on('data_updated', (data) => {
    console.log('📊 數據更新:', data.type);
    // 廣播給所有連接的設備
    io.emit('sync_update', {
      type: data.type,
      data: data.data,
      timestamp: new Date().toISOString(),
      from: socket.id
    });
  });
  
  // 請求同步所有資料
  socket.on('request_sync', async () => {
    try {
      if (!pool) {
        socket.emit('sync_data', getMockData());
        return;
      }
      
      const client = await pool.connect();
      const propertiesResult = await client.query('SELECT * FROM properties ORDER BY id');
      client.release();
      
      socket.emit('sync_data', {
        properties: propertiesResult.rows,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      socket.emit('sync_error', { error: error.message });
    }
  });
  
  // 斷開連接
  socket.on('disconnect', () => {
    console.log('🔌 設備斷開:', socket.id);
  });
});

// 模擬資料（開發用）
function getMockData() {
  return {
    properties: [
      {
        id: '1',
        name: '板橋幸福社區',
        address: '新北市板橋區',
        color: '#3B82F6',
        rooms: [
          { id: 1, n: '101', r: 7000, s: 'occupied', t: '張小明', in: '2026-02-01' },
          { id: 2, n: '102', r: 7500, s: 'available', t: null, in: null },
          { id: 3, n: '103', r: 8000, s: 'occupied', t: '李大同', in: '2026-01-15' }
        ],
        payments: [
          { id: 1, tenant_id: 1, amount: 7000, type: 'rent', status: 'paid', payment_date: '2026-03-01' },
          { id: 2, tenant_id: 3, amount: 8000, type: 'rent', status: 'pending', due_date: '2026-03-05' }
        ],
        history: [],
        maintenance: [
          { id: 1, category: 'electricity', description: '2月份電費', amount: 2500, date: '2026-02-28' },
          { id: 2, category: 'water', description: '2月份水費', amount: 800, date: '2026-02-28' }
        ]
      },
      {
        id: '2',
        name: '台北101大樓',
        address: '台北市信義區',
        color: '#10B981',
        rooms: [
          { id: 4, n: '201', r: 12000, s: 'occupied', t: '王美麗', in: '2026-03-01' },
          { id: 5, n: '202', r: 12500, s: 'available', t: null, in: null }
        ],
        payments: [
          { id: 3, tenant_id: 4, amount: 12000, type: 'rent', status: 'paid', payment_date: '2026-03-01' }
        ],
        history: [],
        maintenance: [
          { id: 3, category: 'maintenance', description: '電梯維修', amount: 5000, date: '2026-03-01' }
        ]
      }
    ],
    last_sync: new Date().toISOString(),
    sync_version: '1.0.0'
  };
}

// 前端頁面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404處理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '找不到請求的資源',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('❌ 伺服器錯誤:', err);
  res.status(500).json({
    success: false,
    error: '伺服器內部錯誤',
    message: NODE_ENV === 'development' ? err.message : '請稍後再試',
    timestamp: new Date().toISOString()
  });
});

// 啟動伺服器
server.listen(PORT, () => {
  console.log(`
  🚀 台灣房東系統 - 終極完整版
  ==================================
  📍 運行網址: http://localhost:${PORT}
  📊 健康檢查: http://localhost:${PORT}/api/health
  🔄 WebSocket: ws://localhost:${PORT}
  📱 同步系統: 已啟用
  💾 資料庫: ${DATABASE_URL ? '雲端PostgreSQL' : '模擬資料'}
  ==================================
  🎉 地表最強的系統已準備就緒！ 💪
  `);
  
  // 顯示API端點
  console.log(`
  📋 可用API端點:
  - GET  /api/health         健康檢查
  - GET  /api/init-db        初始化資料庫
  - GET  /api/sync/all       同步所有資料（巢狀格式）
  - POST /api/sync/save      儲存資料
  - POST /api/checkin/complete 原子性入住
  - GET  /api/costs/summary  成本摘要
  `);
  
  // 顯示重要提示
  console.log(`
  ⚠️  重要提示:
  1. 部署到Zeabur時，請設定DATABASE_URL環境變數
  2. 前端網址需要添加到ALLOWED_ORIGINS
  3. 首次使用請訪問 /api/init-db 初始化資料庫
  `);
});

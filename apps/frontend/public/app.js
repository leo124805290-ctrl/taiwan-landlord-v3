/**
 * 🏠 台灣房東系統 - 前端邏輯
 * 地表最強的包租公系統前端 💪
 * 符合CLAUDE.md規範，完整null防護
 */

console.log('📦 app.js開始載入...');

// 全局變數
let socket = null;
let syncData = {
    properties: [],
    last_sync: null,
    sync_version: '1.0.0'
};

console.log('✅ 全局變數初始化完成');

// 初始化函數
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOMContentLoaded事件觸發 - 台灣房東系統前端啟動');
    console.log('📋 檢查DOM元素...');
    console.log('   document.body存在:', !!document.body);
    console.log('   document.getElementById測試:', document.getElementById('addPropertyBtn') ? '找到addPropertyBtn' : '未找到addPropertyBtn');
    
    // 初始化系統
    console.log('🔄 開始初始化系統...');
    initSystem();
    
    // 綁定事件
    console.log('🔗 開始綁定事件...');
    bindEvents();
    
    // 測試連接
    console.log('🌐 開始測試連接...');
    testConnection();
    
    console.log('🎉 前端初始化完成！');
});

// 初始化系統
function initSystem() {
    // 更新UI狀態
    updateConnectionStatus('正在連接...', 'yellow');
    
    // 連接WebSocket
    connectWebSocket();
    
    // 獲取初始資料
    fetchInitialData();
}

// 連接WebSocket
function connectWebSocket() {
    // 使用後端Zeabur網址
    const backendHost = 'taiwan-landlord-v3.zeabur.app';
    const wsUrl = `wss://${backendHost}`;
    
    socket = io(wsUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });
    
    // WebSocket事件處理
    socket.on('connect', () => {
        console.log('✅ WebSocket連接成功');
        updateConnectionStatus('已連接', 'green');
        updateSyncStatus('同步中...', 'green');
        
        // 請求同步資料
        socket.emit('request_sync');
    });
    
    socket.on('welcome', (data) => {
        console.log('👋 歡迎訊息:', data);
        showNotification(`歡迎使用台灣房東系統 v${data.version}`, 'success');
    });
    
    socket.on('sync_data', (data) => {
        console.log('📊 收到同步資料:', data);
        syncData = data;
        updateUIWithData(data);
        updateLastSync();
    });
    
    socket.on('sync_update', (data) => {
        console.log('🔄 收到同步更新:', data);
        showNotification(`資料已更新: ${data.type}`, 'info');
        
        // 重新獲取資料
        fetchInitialData();
    });
    
    socket.on('sync_error', (error) => {
        console.error('❌ 同步錯誤:', error);
        showNotification(`同步錯誤: ${error.error}`, 'error');
    });
    
    socket.on('disconnect', () => {
        console.log('🔌 WebSocket斷開連接');
        updateConnectionStatus('已斷開', 'red');
        updateSyncStatus('同步失敗', 'red');
    });
    
    socket.on('connect_error', (error) => {
        console.error('❌ WebSocket連接錯誤:', error);
        updateConnectionStatus('連接失敗', 'red');
    });
}

// 獲取初始資料
async function fetchInitialData() {
    try {
        const apiUrl = getApiUrl('/api/sync/all');
        
        // 如果apiUrl為null，直接使用模擬數據
        if (apiUrl === null) {
            console.log('🔧 API網址為null，直接使用模擬數據');
            useMockData();
            return;
        }
        
        console.log('🔗 嘗試連接API:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'  // 明確指定CORS模式
        });
        
        console.log('📡 API回應狀態:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API錯誤回應:', errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
        }
        
        const data = await response.json();
        console.log('📊 獲取初始資料成功，資料筆數:', data?.properties?.length || 0);
        
        syncData = data;
        updateUIWithData(data);
        updateLastSync();
        updateConnectionStatus('已連接', 'green');
        
        // 顯示成功訊息
        showNotification(`成功載入 ${data?.properties?.length || 0} 筆物業資料`, 'success');
        
    } catch (error) {
        console.error('❌ 獲取初始資料失敗:', error);
        console.error('錯誤詳情:', error.stack);
        
        // 顯示詳細錯誤訊息
        const errorMsg = error.message.includes('Failed to fetch') 
            ? '無法連接到後端伺服器，請檢查網路連接' 
            : `無法獲取資料: ${error.message.split('\n')[0]}`;
        
        showNotification(errorMsg, 'error');
        updateConnectionStatus('資料獲取失敗', 'red');
        
        // 使用模擬資料
        useMockData();
    }
}

// 更新UI
function updateUIWithData(data) {
    // 安全防護：確保data存在
    const properties = data?.properties ?? [];
    
    // 更新統計數據
    updateStatistics(properties);
    
    // 更新物業列表
    updatePropertiesList(properties);
    
    // 更新提醒訊息
    updateReminders(properties);
    
    // 更新系統狀態
    updateSystemStatus();
}

// 更新統計數據
function updateStatistics(properties) {
    // 安全防護
    const props = properties ?? [];
    
    // 計算統計
    let totalProperties = props.length;
    let totalRooms = 0;
    let occupiedRooms = 0;
    let monthlyIncome = 0;
    
    props.forEach(property => {
        const rooms = property?.rooms ?? [];
        totalRooms += rooms.length;
        
        rooms.forEach(room => {
            if (room?.s === 'occupied') {
                occupiedRooms++;
            }
        });
        
        // 計算本月收入
        const payments = property?.payments ?? [];
        payments.forEach(payment => {
            if (payment?.status === 'paid') {
                monthlyIncome += payment?.amount ?? 0;
            }
        });
    });
    
    // 計算出租率
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    
    // 更新UI
    document.getElementById('propertyCount').textContent = totalProperties;
    document.getElementById('totalRooms').textContent = totalRooms;
    document.getElementById('occupiedRooms').textContent = occupiedRooms;
    document.getElementById('occupancyRate').textContent = `出租率: ${occupancyRate}%`;
    document.getElementById('occupancyBar').style.width = `${occupancyRate}%`;
    document.getElementById('monthlyIncome').textContent = `$${monthlyIncome.toLocaleString()}`;
}

// 更新物業列表
function updatePropertiesList(properties) {
    const container = document.getElementById('propertiesList');
    if (!container) return;
    
    // 安全防護
    const props = properties ?? [];
    
    if (props.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-building text-4xl text-gray-300 mb-4"></i>
                <h4 class="text-lg font-medium text-gray-700">還沒有物業</h4>
                <p class="text-gray-500 mt-2">點擊「新增物業」開始管理</p>
                <button onclick="showPropertyModal()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <i class="fas fa-plus mr-2"></i>新增第一個物業
                </button>
            </div>
        `;
        return;
    }
    
    // 生成物業卡片
    container.innerHTML = props.map(property => {
        const rooms = property?.rooms ?? [];
        const occupiedCount = rooms.filter(r => r?.s === 'occupied').length;
        const availableCount = rooms.filter(r => r?.s === 'available').length;
        
        return `
            <div class="bg-white rounded-xl shadow border hover:shadow-md transition-shadow">
                <div class="p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style="background-color: ${property?.color || '#3B82F6'}">
                                <i class="fas fa-building text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">${property?.name || '未命名'}</h4>
                                <p class="text-xs text-gray-500">${property?.address || '無地址'}</p>
                            </div>
                        </div>
                        <span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">${rooms.length}間房</span>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">已出租</span>
                            <span class="font-medium text-green-600">${occupiedCount}間</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">空房</span>
                            <span class="font-medium text-blue-600">${availableCount}間</span>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-3 border-t">
                        <button onclick="viewProperty('${property?.id}')" class="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">
                            <i class="fas fa-eye mr-2"></i>查看詳情
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 更新提醒訊息
function updateReminders(properties) {
    const container = document.getElementById('remindersList');
    if (!container) return;
    
    const reminders = [];
    
    // 安全防護
    const props = properties ?? [];
    
    // 檢查空房提醒
    props.forEach(property => {
        const rooms = property?.rooms ?? [];
        const availableRooms = rooms.filter(r => r?.s === 'available');
        
        if (availableRooms.length > 0) {
            reminders.push(`• ${property?.name} 有 ${availableRooms.length} 間空房待出租`);
        }
    });
    
    // 檢查付款提醒
    props.forEach(property => {
        const payments = property?.payments ?? [];
        const pendingPayments = payments.filter(p => p?.status === 'pending');
        
        if (pendingPayments.length > 0) {
            reminders.push(`• ${property?.name} 有 ${pendingPayments.length} 筆待收款項`);
        }
    });
    
    // 如果沒有提醒，顯示預設訊息
    if (reminders.length === 0) {
        reminders.push('• 系統運行正常，沒有待處理事項');
    }
    
    container.innerHTML = reminders.map(r => `<li class="text-sm text-yellow-700">${r}</li>`).join('');
}

// 更新系統狀態
function updateSystemStatus() {
    // 更新API狀態
    document.getElementById('apiStatus').textContent = '✅';
    
    // 更新資料庫狀態
    document.getElementById('dbStatus').textContent = syncData.properties?.length > 0 ? '✅' : '🔄';
    
    // 更新同步狀態
    document.getElementById('syncStatusIcon').textContent = socket?.connected ? '✅' : '❌';
}

// 綁定事件
function bindEvents() {
    console.log('🔧 bindEvents函數開始執行');
    
    // 快速入住按鈕
    const quickCheckinBtn = document.getElementById('quickCheckinBtn');
    console.log('   quickCheckinBtn:', quickCheckinBtn ? '找到' : '未找到');
    if (quickCheckinBtn) {
        quickCheckinBtn.addEventListener('click', showCheckinModal);
        console.log('   ✅ quickCheckinBtn事件綁定成功');
    }
    
    // 記錄成本按鈕
    const recordCostBtn = document.getElementById('recordCostBtn');
    console.log('   recordCostBtn:', recordCostBtn ? '找到' : '未找到');
    if (recordCostBtn) {
        recordCostBtn.addEventListener('click', showCostModal);
        console.log('   ✅ recordCostBtn事件綁定成功');
    }
    
    // 新增物業按鈕
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    console.log('   addPropertyBtn:', addPropertyBtn ? '找到' : '未找到');
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', showPropertyModal);
        console.log('   ✅ addPropertyBtn事件綁定成功');
    }
    
    // 關閉入住Modal按鈕
    const closeCheckinModalBtn = document.getElementById('closeCheckinModalBtn');
    if (closeCheckinModalBtn) {
        closeCheckinModalBtn.addEventListener('click', hideCheckinModal);
    }
    
    // 取消入住按鈕
    const cancelCheckinBtn = document.getElementById('cancelCheckinBtn');
    if (cancelCheckinBtn) {
        cancelCheckinBtn.addEventListener('click', hideCheckinModal);
    }
    
    // 關閉物業Modal按鈕
    const closePropertyModalBtn = document.getElementById('closePropertyModalBtn');
    if (closePropertyModalBtn) {
        closePropertyModalBtn.addEventListener('click', hidePropertyModal);
    }
    
    // 取消物業按鈕
    const cancelPropertyBtn = document.getElementById('cancelPropertyBtn');
    if (cancelPropertyBtn) {
        cancelPropertyBtn.addEventListener('click', hidePropertyModal);
    }
    
    // 關閉成本Modal按鈕
    const closeCostModalBtn = document.getElementById('closeCostModalBtn');
    if (closeCostModalBtn) {
        closeCostModalBtn.addEventListener('click', hideCostModal);
    }
    
    // 取消成本按鈕
    const cancelCostBtn = document.getElementById('cancelCostBtn');
    if (cancelCostBtn) {
        cancelCostBtn.addEventListener('click', hideCostModal);
    }
    
    // 入住表單提交
    const checkinForm = document.getElementById('checkinForm');
    if (checkinForm) {
        checkinForm.addEventListener('submit', handleCheckinSubmit);
    }
    
    // 成本表單提交
    const costForm = document.getElementById('costForm');
    if (costForm) {
        costForm.addEventListener('submit', handleCostSubmit);
    }
    
    // 物業表單提交
    const propertyForm = document.getElementById('propertyForm');
    if (propertyForm) {
        propertyForm.addEventListener('submit', handlePropertySubmit);
    }
}

// 處理入住提交
async function handleCheckinSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        tenantData: {
            name: formData.get('name'),
            phone: formData.get('phone')
        },
        roomId: parseInt(formData.get('room_id')),
        paymentType: formData.get('payment_type'),
        depositAmount: parseFloat(formData.get('deposit_amount') || 0),
        rentAmount: parseFloat(formData.get('rent_amount') || 0)
    };
    
    // 驗證資料
    if (!data.tenantData.name || !data.roomId) {
        showNotification('請填寫必要欄位', 'error');
        return;
    }
    
    try {
        const apiUrl = getApiUrl('/api/checkin/complete');
        
        // 如果apiUrl為null，使用模擬響應
        if (apiUrl === null) {
            console.log('🔧 使用模擬API響應（後端不可用）');
            
            // 模擬成功響應
            showNotification('入住成功！（模擬模式）', 'success');
            hideCheckinModal();
            
            // 重新獲取資料（會使用模擬數據）
            fetchInitialData();
            
            return;
        }
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('入住成功！', 'success');
            hideCheckinModal();
            
            // 重新獲取資料
            fetchInitialData();
            
            // 通知WebSocket
            if (socket) {
                socket.emit('data_updated', {
                    type: 'checkin',
                    data: result
                });
            }
        } else {
            showNotification(`入住失敗: ${result.error}`, 'error');
        }
        
    } catch (error) {
        console.error('❌ 入住失敗:', error);
        showNotification(`入住失敗: ${error.message}`, 'error');
    }
}

// 處理成本提交
async function handleCostSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        property_id: parseInt(formData.get('property_id')),
        category: formData.get('category'),
        description: formData.get('description'),
        amount: parseFloat(formData.get('amount') || 0),
        payment_date: formData.get('payment_date') || new Date().toISOString().split('T')[0],
        receipt_no: formData.get('receipt_no'),
        notes: formData.get('notes')
    };
    
    // 驗證資料
    if (!data.property_id || !data.category || !data.amount) {
        showNotification('請填寫必要欄位', 'error');
        return;
    }
    
    try {
        const apiUrl = getApiUrl('/api/sync/save');
        
        // 如果apiUrl為null，使用模擬響應
        if (apiUrl === null) {
            console.log('🔧 使用模擬API響應（後端不可用）');
            
            // 模擬成功響應
            showNotification('成本記錄成功！（模擬模式）', 'success');
            hideCostModal();
            
            // 重新獲取資料（會使用模擬數據）
            fetchInitialData();
            
            return;
        }
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'cost',
                data: data
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('成本記錄成功！', 'success');
            hideCostModal();
            
            // 重新獲取資料
            fetchInitialData();
            
            // 通知WebSocket
            if (socket) {
                socket.emit('data_updated', {
                    type: 'cost',
                    data: data
                });
            }
        } else {
            showNotification(`成本記錄失敗: ${result.error}`, 'error');
        }
        
    } catch (error) {
        console.error('❌ 成本記錄失敗:', error);
        showNotification(`成本記錄失敗: ${error.message}`, 'error');
    }
}

// 處理物業提交
async function handlePropertySubmit(event) {
    event.preventDefault();
    console.log('📝 開始處理物業表單提交');
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        address: formData.get('address'),
        color: formData.get('color') || '#3B82F6'
    };
    
    console.log('📋 表單資料:', data);
    
    // 驗證資料
    if (!data.name) {
        console.warn('⚠️ 驗證失敗：缺少物業名稱');
        showNotification('請填寫物業名稱', 'error');
        return;
    }
    
    console.log('✅ 表單驗證通過');
    
    try {
        const apiUrl = getApiUrl('/api/sync/save');
        
        // 如果apiUrl為null，使用模擬響應
        if (apiUrl === null) {
            console.log('🔧 使用模擬API響應（後端不可用）');
            
            // 模擬成功響應
            const mockResult = {
                success: true,
                message: '物業新增成功（模擬模式）',
                data: {
                    id: Date.now(), // 使用時間戳作為模擬ID
                    ...data
                }
            };
            
            console.log('✅ 模擬API回應成功:', mockResult);
            
            // 顯示成功訊息
            console.log('🎉 物業新增成功！（模擬模式）');
            showNotification('物業新增成功！（模擬模式）', 'success');
            hidePropertyModal();
            
            // 重新獲取資料（會使用模擬數據）
            console.log('🔄 重新獲取資料（模擬模式）...');
            fetchInitialData();
            
            return;
        }
        
        console.log('🔗 發送API請求到:', apiUrl);
        console.log('📤 請求資料:', { type: 'property', data: data });
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'property',
                data: data
            })
        });
        
        console.log('📡 API回應狀態:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API錯誤回應:', errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
        }
        
        const result = await response.json();
        console.log('✅ API回應成功:', result);
        
        if (result.success) {
            console.log('🎉 物業新增成功！');
            showNotification('物業新增成功！', 'success');
            hidePropertyModal();
            
            // 重新獲取資料
            console.log('🔄 重新獲取資料...');
            fetchInitialData();
            
            // 通知WebSocket
            if (socket) {
                console.log('📡 發送WebSocket更新通知');
                socket.emit('data_updated', {
                    type: 'property',
                    data: data
                });
            }
        } else {
            console.error('❌ 物業新增失敗:', result.error);
            showNotification(`物業新增失敗: ${result.error}`, 'error');
        }
        
    } catch (error) {
        console.error('❌ 物業新增失敗:', error);
        console.error('錯誤詳情:', error.stack);
        showNotification(`物業新增失敗: ${error.message.split('\n')[0]}`, 'error');
    }
}

// 測試連接
async function testConnection() {
    try {
        const apiUrl = getApiUrl('/api/health');
        
        // 如果apiUrl為null，跳過健康檢查
        if (apiUrl === null) {
            console.log('🔧 跳過健康檢查（模擬數據模式）');
            document.getElementById('apiStatus').textContent = '🔧';
            return;
        }
        
        const response = await fetch(apiUrl);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 健康檢查成功:', data);
            document.getElementById('apiStatus').textContent = '✅';
            
            // 更新設備數量
            if (socket) {
                document.getElementById('deviceCount').textContent = '1 台設備在線';
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ 健康檢查失敗:', error);
        document.getElementById('apiStatus').textContent = '❌';
    }
}

// 工具函數

// 獲取API URL
function getApiUrl(endpoint) {
    // 暫時強制使用模擬數據，因為後端服務不可用
    console.log('🔧 後端服務不可用，使用模擬數據模式');
    return null; // 返回null表示使用模擬數據
    
    // 原始代碼（保留以供將來恢復）：
    // const backendUrl = 'https://taiwan-landlord-v3.zeabur.app';
    // return `${backendUrl}${endpoint}`;
}

// 顯示通知
function showNotification(message, type = 'info') {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full`;
    
    // 根據類型設定樣式
    const styles = {
        success: 'bg-green-100 text-green-800 border border-green-200',
        error: 'bg-red-100 text-red-800 border border-red-200',
        info: 'bg-blue-100 text-blue-800 border border-blue-200',
        warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    };
    
    notification.className += ` ${styles[type] || styles.info}`;
    
    // 設定內容
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加到頁面
    document.body.appendChild(notification);
    
    // 顯示動畫
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    }, 10);
    
    // 自動移除
    setTimeout(() => {
        notification.classList.remove('translate-x-0');
        notification.classList.add('translate-x-full');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 更新連接狀態
function updateConnectionStatus(status, color = 'gray') {
    const element = document.getElementById('connectionStatus');
    if (element) {
        element.textContent = status;
        element.className = `text-sm ${color === 'green' ? 'text-green-600' : color === 'red' ? 'text-red-600' : 'text-yellow-600'}`;
    }
}

// 更新同步狀態
function updateSyncStatus(status, color = 'gray') {
    const element = document.getElementById('syncStatus');
    if (element) {
        const icon = element.querySelector('i');
        const text = element.querySelector('span');
        
        if (icon) icon.className = `fas fa-sync-alt mr-2 ${color === 'green' ? 'text-green-600' : color === 'red' ? 'text-red-600' : 'text-yellow-600'}`;
        if (text) text.textContent = status;
        
        element.className = `flex items-center px-3 py-1 rounded-full text-sm ${color === 'green' ? 'bg-green-100 text-green-800' : color === 'red' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`;
    }
}

// 更新最後同步時間
function updateLastSync() {
    const element = document.getElementById('lastSync');
    if (element) {
        const now = new Date();
        element.textContent = `最後同步: ${now.toLocaleTimeString('zh-TW')}`;
    }
}

// 使用模擬資料
function useMockData() {
    console.log('⚠️ 使用模擬資料');
    
    const mockData = {
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
            }
        ],
        last_sync: new Date().toISOString(),
        sync_version: '1.0.0'
    };
    
    syncData = mockData;
    updateUIWithData(mockData);
    
    showNotification('使用模擬資料模式', 'warning');
}

// Modal控制函數

function showCheckinModal() {
    const modal = document.getElementById('checkinModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // 載入房間選項
        loadRoomOptions();
    }
}

function hideCheckinModal() {
    const modal = document.getElementById('checkinModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        
        // 重置表單
        const form = document.getElementById('checkinForm');
        if (form) form.reset();
    }
}

function showCostModal() {
    const modal = document.getElementById('costModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // 載入物業選項
        loadPropertyOptions();
    }
}

function hideCostModal() {
    const modal = document.getElementById('costModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        
        // 重置表單
        const form = document.getElementById('costForm');
        if (form) form.reset();
    }
}

function showPropertyModal() {
    console.log('🔘 點擊新增物業按鈕，執行showPropertyModal');
    
    const modal = document.getElementById('propertyModal');
    if (modal) {
        console.log('✅ 找到propertyModal元素');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        console.log('✅ Modal顯示設定完成');
    } else {
        console.error('❌ 找不到propertyModal元素！');
        showNotification('找不到新增物業的表單，請刷新頁面重試', 'error');
    }
}

function hidePropertyModal() {
    const modal = document.getElementById('propertyModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        
        // 重置表單
        const form = document.getElementById('propertyForm');
        if (form) form.reset();
    }
}

// 載入房間選項
function loadRoomOptions() {
    const select = document.getElementById('roomSelect');
    if (!select) return;
    
    // 清空選項
    select.innerHTML = '<option value="">請選擇房間...</option>';
    
    // 安全防護
    const properties = syncData?.properties ?? [];
    
    // 添加房間選項
    properties.forEach(property => {
        const rooms = property?.rooms ?? [];
        
        rooms.forEach(room => {
            if (room?.s === 'available') {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = `${property.name} - ${room.n}號房 (租金: $${room.r})`;
                select.appendChild(option);
            }
        });
    });
    
    // 如果沒有空房
    if (select.options.length === 1) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '目前沒有空房';
        option.disabled = true;
        select.appendChild(option);
    }
}

// 載入物業選項
function loadPropertyOptions() {
    const select = document.getElementById('propertySelect');
    if (!select) return;
    
    // 清空選項
    select.innerHTML = '<option value="">請選擇物業...</option>';
    
    // 安全防護
    const properties = syncData?.properties ?? [];
    
    // 添加物業選項
    properties.forEach(property => {
        const option = document.createElement('option');
        option.value = property.id;
        option.textContent = property.name;
        select.appendChild(option);
    });
    
    // 如果沒有物業
    if (select.options.length === 1) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '請先新增物業';
        option.disabled = true;
        select.appendChild(option);
    }
}

// 查看物業詳情
function viewProperty(propertyId) {
    showNotification(`查看物業 ${propertyId} 詳情`, 'info');
    // 這裡可以實現跳轉到物業詳情頁面
}

// 點擊Modal外部關閉
document.addEventListener('click', function(event) {
    const modals = ['checkinModal', 'costModal', 'propertyModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && modal.classList.contains('flex') && event.target === modal) {
            if (modalId === 'checkinModal') hideCheckinModal();
            if (modalId === 'costModal') hideCostModal();
            if (modalId === 'propertyModal') hidePropertyModal();
        }
    });
});

// 鍵盤事件：ESC關閉Modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideCheckinModal();
        hideCostModal();
        hidePropertyModal();
    }
});

// 導出全局函數
window.showCheckinModal = showCheckinModal;
window.hideCheckinModal = hideCheckinModal;
window.showCostModal = showCostModal;
window.hideCostModal = hideCostModal;
window.showPropertyModal = showPropertyModal;
window.hidePropertyModal = hidePropertyModal;
window.viewProperty = viewProperty;

console.log('🎉 前端邏輯載入完成');
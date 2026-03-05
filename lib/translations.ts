// 翻譯字典
const translations = {
  'zh-TW': {
    // 系統
    system: '台灣房東系統',
    properties: '個物業',
    allProperties: '全部物業',
    
    // 分頁
    roomsTab: '房間管理',
    paymentsTab: '繳費管理',
    depositManagementTab: '押金管理',
    costManagementTab: '成本管理',
    settingsTab: '設定',
    backfillCheckInTab: '補登入住',
    backfillHistoryTab: '補登歷史',
    
    // 房間狀態
    vacant: '空房',
    occupied: '已出租',
    
    // 操作
    addProperty: '新增物業',
    quickCheckin: '快速入住',
    recordCost: '記錄支出',
    exportData: '匯出資料',
    importData: '匯入資料',
    
    // 統計
    totalProperties: '總物業數',
    rentedRooms: '已出租',
    monthlyIncome: '本月收入',
    monthlyCost: '本月支出',
    
    // 按鈕
    save: '保存',
    cancel: '取消',
    confirm: '確認',
    delete: '刪除',
    edit: '編輯',
    
    // 訊息
    success: '成功',
    error: '錯誤',
    warning: '警告',
    loading: '載入中...',
    
    // 表單
    propertyName: '物業名稱',
    address: '地址',
    color: '顏色標記',
    tenantName: '租客姓名',
    phone: '手機號碼',
    selectRoom: '選擇房間',
    depositAmount: '押金金額',
    rentAmount: '租金金額',
    category: '類別',
    amount: '金額',
    description: '描述',
    date: '日期',
    
    // 類別
    utilities: '水電費',
    maintenance: '維修費',
    management: '管理費',
    tax: '稅金',
    insurance: '保險費',
    other: '其他',
  },
  'vi-VN': {
    // 系統
    system: 'Hệ thống chủ nhà Đài Loan',
    properties: 'tài sản',
    allProperties: 'Tất cả tài sản',
    
    // 分頁
    roomsTab: 'Quản lý phòng',
    paymentsTab: 'Quản lý thanh toán',
    depositManagementTab: 'Quản lý tiền đặt cọc',
    costManagementTab: 'Quản lý chi phí',
    settingsTab: 'Cài đặt',
    backfillCheckInTab: 'Check-in bổ sung',
    backfillHistoryTab: 'Lịch sử bổ sung',
    
    // 房間狀態
    vacant: 'Phòng trống',
    occupied: 'Đã cho thuê',
    
    // 操作
    addProperty: 'Thêm tài sản',
    quickCheckin: 'Check-in nhanh',
    recordCost: 'Ghi chi phí',
    exportData: 'Xuất dữ liệu',
    importData: 'Nhập dữ liệu',
    
    // 統計
    totalProperties: 'Tổng tài sản',
    rentedRooms: 'Đã cho thuê',
    monthlyIncome: 'Thu nhập tháng',
    monthlyCost: 'Chi phí tháng',
    
    // 按鈕
    save: 'Lưu',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    delete: 'Xóa',
    edit: 'Sửa',
    
    // 訊息
    success: 'Thành công',
    error: 'Lỗi',
    warning: 'Cảnh báo',
    loading: 'Đang tải...',
    
    // 表單
    propertyName: 'Tên tài sản',
    address: 'Địa chỉ',
    color: 'Màu đánh dấu',
    tenantName: 'Tên người thuê',
    phone: 'Số điện thoại',
    selectRoom: 'Chọn phòng',
    depositAmount: 'Số tiền đặt cọc',
    rentAmount: 'Số tiền thuê',
    category: 'Danh mục',
    amount: 'Số tiền',
    description: 'Mô tả',
    date: 'Ngày',
    
    // 類別
    utilities: 'Tiền điện nước',
    maintenance: 'Sửa chữa',
    management: 'Quản lý',
    tax: 'Thuế',
    insurance: 'Bảo hiểm',
    other: 'Khác',
  }
}

// 翻譯函數
export function t(key: string, lang: 'zh-TW' | 'vi-VN' = 'zh-TW'): string {
  const langDict = translations[lang] || translations['zh-TW']
  return langDict[key as keyof typeof langDict] || key
}

// 獲取所有翻譯
export function getTranslations(lang: 'zh-TW' | 'vi-VN') {
  return translations[lang] || translations['zh-TW']
}
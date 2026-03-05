'use client'

import { t } from '@/lib/translations'
import { useApp } from '@/contexts/AppContext'
import { useState } from 'react'

export default function Payments() {
  const { state, getCurrentProperty } = useApp()
  const property = getCurrentProperty()
  
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all')

  // 生成付款記錄
  const generatePayments = () => {
    if (!property) return []
    
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const payments = []
    
    property.rooms.forEach(room => {
      if (room.status === 'occupied') {
        payments.push({
          id: room.id,
          roomName: room.name,
          tenantName: room.tenantName || '未命名租客',
          amount: room.rent || 0,
          status: Math.random() > 0.5 ? 'paid' : 'unpaid' as 'paid' | 'unpaid',
          dueDate: `${currentMonth}-05`,
          paidDate: Math.random() > 0.5 ? `${currentMonth}-${Math.floor(Math.random() * 5) + 1}` : null
        })
      }
    })
    
    return payments
  }

  const payments = generatePayments()
  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(p => p.status === filter)

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const unpaidAmount = payments.filter(p => p.status === 'unpaid').reduce((sum, p) => sum + p.amount, 0)

  if (!property) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💵</div>
        <h2 className="text-2xl font-bold mb-4">繳費管理</h2>
        <p className="text-gray-600">
          請選擇單一物業以查看繳費記錄。
        </p>
      </div>
    )
  }

  const handleMarkAsPaid = (paymentId: number) => {
    if (confirm('確定要標記為已繳費嗎？')) {
      alert(`付款記錄 ${paymentId} 已標記為已繳費`)
      // 實際實現會更新狀態
    }
  }

  const handleSendReminder = (paymentId: number) => {
    alert(`已發送繳費提醒給租客 (記錄 ${paymentId})`)
  }

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">總應收金額</p>
              <p className="text-3xl font-bold mt-2">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">已收金額</p>
              <p className="text-3xl font-bold mt-2 text-green-600">${paidAmount.toLocaleString()}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">未收金額</p>
              <p className="text-3xl font-bold mt-2 text-red-600">${unpaidAmount.toLocaleString()}</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* 篩選和操作 */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">繳費記錄</h2>
            <p className="text-gray-600">{property.name} - {payments.length} 筆記錄</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-white shadow' : ''}`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter('paid')}
                className={`px-4 py-2 rounded-md ${filter === 'paid' ? 'bg-white shadow' : ''}`}
              >
                已繳費
              </button>
              <button
                onClick={() => setFilter('unpaid')}
                className={`px-4 py-2 rounded-md ${filter === 'unpaid' ? 'bg-white shadow' : ''}`}
              >
                未繳費
              </button>
            </div>
            
            <button
              onClick={() => alert('批量操作功能')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              批量操作
            </button>
            <button
              onClick={() => alert('匯出報表功能')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              匯出報表
            </button>
          </div>
        </div>
      </div>

      {/* 付款列表 */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-3">📄</div>
            <p>沒有找到付款記錄</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">房間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">租客</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">繳費狀態</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">到期日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{payment.roomName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{payment.tenantName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">${payment.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        payment.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'paid' ? '✅ 已繳費' : '❌ 未繳費'}
                      </span>
                      {payment.paidDate && (
                        <div className="text-xs text-gray-500 mt-1">繳費日: {payment.paidDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{payment.dueDate}</div>
                      {payment.status === 'unpaid' && new Date(payment.dueDate) < new Date() && (
                        <div className="text-xs text-red-600 mt-1">已逾期</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {payment.status === 'unpaid' && (
                          <>
                            <button
                              onClick={() => handleMarkAsPaid(payment.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              標記已繳
                            </button>
                            <button
                              onClick={() => handleSendReminder(payment.id)}
                              className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                            >
                              發送提醒
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => alert('查看詳情')}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          詳情
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* 統計摘要 */}
        {filteredPayments.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                顯示 {filteredPayments.length} 筆記錄
              </div>
              <div className="font-bold">
                合計: ${filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => alert('生成本月所有付款記錄')}
            className="bg-blue-100 text-blue-700 p-4 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold">生成本月付款單</div>
            <div className="text-sm text-blue-600 mt-1">為所有租客生成付款記錄</div>
          </button>
          
          <button
            onClick={() => alert('發送批量繳費提醒')}
            className="bg-yellow-100 text-yellow-700 p-4 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            <div className="text-2xl mb-2">📢</div>
            <div className="font-semibold">批量發送提醒</div>
            <div className="text-sm text-yellow-600 mt-1">發送繳費提醒給所有未繳費租客</div>
          </button>
          
          <button
            onClick={() => alert('下載繳費報表')}
            className="bg-green-100 text-green-700 p-4 rounded-lg hover:bg-green-200 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">下載報表</div>
            <div className="text-sm text-green-600 mt-1">匯出 Excel/PDF 報表</div>
          </button>
        </div>
      </div>
    </div>
  )
}
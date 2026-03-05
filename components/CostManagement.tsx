'use client'

import { t } from '@/lib/translations'
import { useApp } from '@/contexts/AppContext'
import { useState } from 'react'

export default function CostManagement() {
  const { state, updateData, getCurrentProperty } = useApp()
  const property = getCurrentProperty()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCost, setNewCost] = useState({
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  })

  if (!property) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💸</div>
        <h2 className="text-2xl font-bold mb-4">成本管理</h2>
        <p className="text-gray-600">
          請選擇單一物業以管理成本記錄。
        </p>
      </div>
    )
  }

  // 獲取當前物業的成本記錄
  const propertyCosts = state.data.costs.filter(cost => cost.propertyId === property.id)
  
  // 按月份分組
  const costsByMonth: Record<string, typeof propertyCosts> = {}
  propertyCosts.forEach(cost => {
    const month = cost.date.slice(0, 7) // YYYY-MM
    if (!costsByMonth[month]) {
      costsByMonth[month] = []
    }
    costsByMonth[month].push(cost)
  })

  // 計算統計
  const totalCost = propertyCosts.reduce((sum, cost) => sum + cost.amount, 0)
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyCost = propertyCosts
    .filter(cost => cost.date.startsWith(currentMonth))
    .reduce((sum, cost) => sum + cost.amount, 0)

  // 按類別統計
  const categoryStats: Record<string, number> = {}
  propertyCosts.forEach(cost => {
    categoryStats[cost.category] = (categoryStats[cost.category] || 0) + cost.amount
  })

  const handleAddCost = () => {
    if (!newCost.category || !newCost.amount) {
      alert('請填寫必要欄位')
      return
    }

    const newCostRecord = {
      id: Date.now(),
      propertyId: property.id,
      ...newCost
    }

    updateData({
      costs: [...state.data.costs, newCostRecord]
    })

    setShowAddModal(false)
    setNewCost({
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    })
    
    alert('成本記錄添加成功！')
  }

  const handleDeleteCost = (costId: number) => {
    if (!confirm('確定要刪除此成本記錄嗎？')) return
    
    const updatedCosts = state.data.costs.filter(cost => cost.id !== costId)
    updateData({ costs: updatedCosts })
    alert('成本記錄已刪除')
  }

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">總成本</p>
              <p className="text-3xl font-bold mt-2">${totalCost.toLocaleString()}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">本月成本</p>
              <p className="text-3xl font-bold mt-2 text-red-600">${monthlyCost.toLocaleString()}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">記錄筆數</p>
              <p className="text-3xl font-bold mt-2">{propertyCosts.length}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* 類別統計 */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">成本類別分佈</h3>
        <div className="space-y-4">
          {Object.entries(categoryStats).map(([category, amount]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                <span>{category}</span>
              </div>
              <div className="font-bold">${amount.toLocaleString()}</div>
            </div>
          ))}
          
          {Object.keys(categoryStats).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              還沒有成本記錄
            </div>
          )}
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">成本記錄</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          + 新增成本記錄
        </button>
      </div>

      {/* 成本記錄列表（按月分組） */}
      <div className="space-y-6">
        {Object.entries(costsByMonth).length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            <div className="text-4xl mb-3">📄</div>
            <p>還沒有成本記錄</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              新增第一筆記錄
            </button>
          </div>
        ) : (
          Object.entries(costsByMonth).sort(([monthA], [monthB]) => monthB.localeCompare(monthA)).map(([month, costs]) => {
            const monthTotal = costs.reduce((sum, cost) => sum + cost.amount, 0)
            
            return (
              <div key={month} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{month}</h3>
                    <span className="font-bold">${monthTotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="divide-y">
                  {costs.map(cost => (
                    <div key={cost.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="font-medium mr-3">{cost.category}</span>
                            <span className="text-sm text-gray-500">{cost.date}</span>
                          </div>
                          {cost.description && (
                            <p className="text-gray-600">{cost.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-bold text-lg">${cost.amount.toLocaleString()}</div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => alert(`編輯記錄 ${cost.id}`)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              編輯
                            </button>
                            <button
                              onClick={() => handleDeleteCost(cost.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              刪除
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 新增成本模態框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">新增成本記錄</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">類別 *</label>
                  <select
                    value={newCost.category}
                    onChange={(e) => setNewCost({...newCost, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">選擇類別</option>
                    <option value="水電費">水電費</option>
                    <option value="維修費">維修費</option>
                    <option value="管理費">管理費</option>
                    <option value="稅金">稅金</option>
                    <option value="保險費">保險費</option>
                    <option value="清潔費">清潔費</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">金額 *</label>
                  <input
                    type="number"
                    value={newCost.amount || ''}
                    onChange={(e) => setNewCost({...newCost, amount: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="輸入金額"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">日期</label>
                  <input
                    type="date"
                    value={newCost.date}
                    onChange={(e) => setNewCost({...newCost, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">描述</label>
                  <input
                    type="text"
                    value={newCost.description}
                    onChange={(e) => setNewCost({...newCost, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="輸入描述（可選）"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCost}
                  disabled={!newCost.category || !newCost.amount}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  新增記錄
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
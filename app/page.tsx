'use client'

import Header from '@/components/Header'
import Rooms from '@/components/Rooms'
import Payments from '@/components/Payments'
import CostManagement from '@/components/CostManagement'
import Settings from '@/components/Settings'
import { useApp } from '@/contexts/AppContext'

export default function HomePage() {
  const { state, getCurrentProperty } = useApp()
  const property = getCurrentProperty()

  // 渲染內容
  const renderContent = () => {
    // 檢查是否選擇了「全部物業」
    const isAllProperties = state.currentProperty === 'all' || state.currentProperty === null
    
    if (isAllProperties) {
      // 顯示所有物業的內容
      switch (state.tab) {
        case 'rooms':
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold mb-4">全部物業 - 房間總覽</h2>
              <p className="text-gray-600 mb-6">
                在「全部物業」模式下，請選擇單一物業以管理房間。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {state.data.properties.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center mb-4">
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: p.color }}
                      />
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{p.address}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">總房間數:</span>
                        <span className="font-semibold">{p.rooms.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">已出租:</span>
                        <span className="font-semibold text-green-600">
                          {p.rooms.filter(r => r.status === 'occupied').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">空房:</span>
                        <span className="font-semibold text-blue-600">
                          {p.rooms.filter(r => r.status === 'vacant').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">月收入:</span>
                        <span className="font-semibold">
                          ${p.rooms
                            .filter(r => r.status === 'occupied')
                            .reduce((sum, room) => sum + (room.rent || 0), 0)
                            .toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        case 'payments':
          return <Payments />
        case 'cost-management':
          return <CostManagement />
        case 'settings':
          return <Settings />
        default:
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-4">全部物業模式</h2>
              <p className="text-gray-600">
                當前分頁在全部物業模式下不可用，請選擇單一物業。
              </p>
            </div>
          )
      }
    } else {
      // 單一物業模式
      switch (state.tab) {
        case 'rooms':
          return <Rooms />
        case 'payments':
          return <Payments />
        case 'deposit-management':
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h2 className="text-2xl font-bold mb-4">押金管理</h2>
              <p className="text-gray-600">功能開發中...</p>
            </div>
          )
        case 'cost-management':
          return <CostManagement />
        case 'settings':
          return <Settings />
        case 'backfill-checkin':
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-bold mb-4">補登入住</h2>
              <p className="text-gray-600">功能開發中...</p>
            </div>
          )
        case 'backfill-history':
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-4">補登歷史</h2>
              <p className="text-gray-600">功能開發中...</p>
            </div>
          )
        default:
          return <Rooms />
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
      
      {/* 快速操作浮動按鈕 */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <button
          onClick={() => window.alert('新增物業功能')}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="新增物業"
        >
          <span className="text-xl">🏢</span>
        </button>
        <button
          onClick={() => window.alert('快速入住功能')}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          title="快速入住"
        >
          <span className="text-xl">👤</span>
        </button>
        <button
          onClick={() => window.alert('記錄支出功能')}
          className="bg-yellow-600 text-white p-4 rounded-full shadow-lg hover:bg-yellow-700 transition-colors"
          title="記錄支出"
        >
          <span className="text-xl">💸</span>
        </button>
      </div>
    </div>
  )
}
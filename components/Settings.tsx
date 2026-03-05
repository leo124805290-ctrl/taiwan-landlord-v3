'use client'

import { t } from '@/lib/translations'
import { useApp } from '@/contexts/AppContext'
import { useState } from 'react'

export default function Settings() {
  const { state, updateState, updateData } = useApp()
  const [activeTab, setActiveTab] = useState<'general' | 'data' | 'export'>('general')

  const handleExportData = () => {
    const dataStr = JSON.stringify(state.data, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `taiwan-landlord-backup-${new Date().toISOString().slice(0,10)}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    alert('數據匯出成功！')
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          updateData(importedData)
          alert('數據匯入成功！')
        } catch (error) {
          console.error('匯入失敗:', error)
          alert('匯入失敗，檔案格式錯誤')
        }
      }
      reader.readAsText(file)
    }
    
    input.click()
  }

  const handleClearData = () => {
    if (confirm('確定要清除所有數據嗎？此操作無法復原！')) {
      updateData({
        properties: [],
        tenants: [],
        costs: []
      })
      localStorage.removeItem('taiwanLandlordData')
      alert('數據已清除')
    }
  }

  const handleResetToSample = () => {
    if (confirm('確定要重置為樣本數據嗎？當前數據將被覆蓋。')) {
      updateData({
        properties: [
          {
            id: 1,
            name: '台北大安公寓',
            address: '台北市大安區忠孝東路四段',
            color: '#3B82F6',
            rooms: [
              { id: 1, name: '101房', status: 'vacant', rent: 15000 },
              { id: 2, name: '102房', status: 'vacant', rent: 16000 },
              { id: 3, name: '103房', status: 'vacant', rent: 14000 },
            ]
          },
          {
            id: 2,
            name: '台中逢甲套房',
            address: '台中市西屯區逢甲路',
            color: '#10B981',
            rooms: [
              { id: 1, name: '201房', status: 'vacant', rent: 12000 },
              { id: 2, name: '202房', status: 'vacant', rent: 13000 },
            ]
          }
        ],
        tenants: [],
        costs: []
      })
      alert('已重置為樣本數據')
    }
  }

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">系統設定</h1>
        <p className="text-gray-600">管理系統設定和數據</p>
      </div>

      {/* 設定選項卡 */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 font-medium ${activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              一般設定
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-6 py-4 font-medium ${activeTab === 'data' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              數據管理
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-6 py-4 font-medium ${activeTab === 'export' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              匯出/匯入
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* 一般設定 */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">語言設定</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateState({ lang: 'zh-TW' })}
                    className={`px-6 py-3 rounded-lg ${state.lang === 'zh-TW' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    繁體中文
                  </button>
                  <button
                    onClick={() => updateState({ lang: 'vi-VN' })}
                    className={`px-6 py-3 rounded-lg ${state.lang === 'vi-VN' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Tiếng Việt
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">顯示設定</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">顯示貨幣符號</p>
                      <p className="text-sm text-gray-600">在金額前顯示 $ 符號</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">自動保存</p>
                      <p className="text-sm text-gray-600">變更後自動保存數據</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">通知設定</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">繳費提醒</p>
                      <p className="text-sm text-gray-600">在繳費日前發送提醒</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">系統更新通知</p>
                      <p className="text-sm text-gray-600">接收系統更新和維護通知</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 數據管理 */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">數據統計</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">物業數</p>
                    <p className="text-xl font-bold">{state.data.properties.length}</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">房間數</p>
                    <p className="text-xl font-bold">
                      {state.data.properties.reduce((sum, p) => sum + p.rooms.length, 0)}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">租客數</p>
                    <p className="text-xl font-bold">{state.data.tenants.length}</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">成本記錄</p>
                    <p className="text-xl font-bold">{state.data.costs.length}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">數據操作</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleResetToSample}
                    className="bg-yellow-100 text-yellow-800 p-4 rounded-lg hover:bg-yellow-200 transition-colors text-left"
                  >
                    <div className="text-xl mb-2">🔄</div>
                    <div className="font-semibold">重置為樣本數據</div>
                    <div className="text-sm text-yellow-700 mt-1">恢復到初始樣本數據</div>
                  </button>

                  <button
                    onClick={handleClearData}
                    className="bg-red-100 text-red-800 p-4 rounded-lg hover:bg-red-200 transition-colors text-left"
                  >
                    <div className="text-xl mb-2">🗑️</div>
                    <div className="font-semibold">清除所有數據</div>
                    <div className="text-sm text-red-700 mt-1">刪除所有數據，無法復原</div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">存儲信息</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">數據存儲位置：瀏覽器本地存儲 (localStorage)</p>
                  <p className="text-sm text-gray-600 mt-1">數據自動保存，無需手動保存</p>
                  <p className="text-sm text-gray-600 mt-1">建議定期匯出備份</p>
                </div>
              </div>
            </div>
          )}

          {/* 匯出/匯入 */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">數據備份</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="text-4xl mb-4">📤</div>
                    <h4 className="font-semibold mb-2">匯出數據</h4>
                    <p className="text-gray-600 mb-4">將所有數據匯出為 JSON 檔案</p>
                    <button
                      onClick={handleExportData}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      匯出數據
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="text-4xl mb-4">📥</div>
                    <h4 className="font-semibold mb-2">匯入數據</h4>
                    <p className="text-gray-600 mb-4">從 JSON 檔案匯入數據</p>
                    <button
                      onClick={handleImportData}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
                    >
                      匯入數據
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 重要提醒</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 定期備份數據以防止丟失</li>
                  <li>• 匯入數據會覆蓋當前所有數據</li>
                  <li>• 確保備份檔案來自可信來源</li>
                  <li>• 數據僅存儲在本地瀏覽器中</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">數據格式</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`{
  "properties": [
    {
      "id": 1,
      "name": "物業名稱",
      "address": "地址",
      "color": "#3B82F6",
      "rooms": [...]
    }
  ],
  "tenants": [...],
  "costs": [...]
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 系統信息 */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">系統信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">版本</p>
            <p className="font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">最後更新</p>
            <p className="font-medium">2026-03-05</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">運行模式</p>
            <p className="font-medium">本地模式</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">數據存儲</p>
            <p className="font-medium">localStorage</p>
          </div>
        </div>
      </div>
    </div>
  )
}
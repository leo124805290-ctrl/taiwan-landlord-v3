'use client'

import { t } from '@/lib/translations'
import { useApp } from '@/contexts/AppContext'

export default function Header() {
  const { state, updateState } = useApp()
  
  const tabs = [
    { key: 'rooms', icon: '🏠', label: 'roomsTab' },
    { key: 'payments', icon: '💵', label: 'paymentsTab' },
    { key: 'deposit-management', icon: '💰', label: 'depositManagementTab' },
    { key: 'cost-management', icon: '💸', label: 'costManagementTab' },
    { key: 'settings', icon: '⚙️', label: 'settingsTab' },
    { key: 'backfill-checkin', icon: '📅', label: 'backfillCheckInTab' },
    { key: 'backfill-history', icon: '📊', label: 'backfillHistoryTab' },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* 頂部欄 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">🏢 {t('system', state.lang)}</h1>
              <p className="text-xs md:text-sm text-gray-500">
                {state.data.properties.length} {t('properties', state.lang)}
              </p>
            </div>
            
            {/* 物業切換下拉選單 */}
            {state.data.properties.length > 0 && (
              <div className="relative w-full md:w-auto">
                <select 
                  value={state.currentProperty || 'all'}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === 'all') {
                      updateState({ currentProperty: 'all' })
                    } else {
                      updateState({ currentProperty: parseInt(value) })
                    }
                  }}
                  className="w-full md:w-auto px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                >
                  <option value="all">
                    📊 {t('allProperties', state.lang)} ({(state.data?.properties || []).length})
                  </option>
                  {(state.data?.properties || []).map(property => (
                    <option key={property.id} value={property.id}>
                      🏠 {property.name} ({property.rooms.length} {t('roomsTab', state.lang).toLowerCase()})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* 語言切換 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateState({ lang: 'zh-TW' })}
              className={`px-3 py-1 rounded-lg text-sm ${state.lang === 'zh-TW' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            >
              繁體中文
            </button>
            <button
              onClick={() => updateState({ lang: 'vi-VN' })}
              className={`px-3 py-1 rounded-lg text-sm ${state.lang === 'vi-VN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            >
              Tiếng Việt
            </button>
          </div>
        </div>
        
        {/* 分頁導航 */}
        <nav className="overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => updateState({ tab: tab.key })}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  state.tab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span>{t(tab.label, state.lang)}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
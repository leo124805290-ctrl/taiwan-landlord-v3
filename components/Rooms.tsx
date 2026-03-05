'use client'

import { t } from '@/lib/translations'
import { useApp } from '@/contexts/AppContext'
import { useState } from 'react'

export default function Rooms() {
  const { state, updateData, openModal, getCurrentProperty } = useApp()
  const property = getCurrentProperty()
  
  const [showCheckinModal, setShowCheckinModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [checkinData, setCheckinData] = useState({
    name: '',
    phone: '',
    deposit: 0,
    rent: 0
  })

  if (!property) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏢</div>
        <h2 className="text-2xl font-bold mb-4">{t('allProperties', state.lang)}</h2>
        <p className="text-gray-600 mb-6">
          {t('selectPropertyToView', state.lang) || '請選擇單一物業以查看房間詳情'}
        </p>
      </div>
    )
  }

  const handleCheckin = (roomId: number) => {
    setSelectedRoom(roomId)
    const room = property.rooms.find(r => r.id === roomId)
    setCheckinData({
      name: '',
      phone: '',
      deposit: room?.deposit || 0,
      rent: room?.rent || 0
    })
    setShowCheckinModal(true)
  }

  const handleCheckinSubmit = () => {
    if (!selectedRoom || !checkinData.name) return
    
    // 更新房間狀態
    const updatedProperties = state.data.properties.map(p => {
      if (p.id === property.id) {
        return {
          ...p,
          rooms: p.rooms.map(room => 
            room.id === selectedRoom 
              ? { 
                  ...room, 
                  status: 'occupied' as const,
                  tenantName: checkinData.name,
                  tenantPhone: checkinData.phone,
                  deposit: checkinData.deposit,
                  rent: checkinData.rent,
                  checkinDate: new Date().toISOString().split('T')[0]
                }
              : room
          )
        }
      }
      return p
    })

    // 添加到租客列表
    const newTenant = {
      id: Date.now(),
      name: checkinData.name,
      phone: checkinData.phone,
      propertyId: property.id,
      roomId: selectedRoom,
      checkinDate: new Date().toISOString().split('T')[0],
      depositAmount: checkinData.deposit,
      rentAmount: checkinData.rent
    }

    updateData({
      properties: updatedProperties,
      tenants: [...state.data.tenants, newTenant]
    })

    setShowCheckinModal(false)
    setSelectedRoom(null)
    setCheckinData({ name: '', phone: '', deposit: 0, rent: 0 })
    
    alert(`${t('success', state.lang)}: ${checkinData.name} ${t('checkinSuccess', state.lang) || '入住成功'}`)
  }

  const handleMoveOut = (roomId: number) => {
    if (!confirm(t('confirmMoveOut', state.lang) || '確定要辦理退租嗎？')) return
    
    const updatedProperties = state.data.properties.map(p => {
      if (p.id === property.id) {
        return {
          ...p,
          rooms: p.rooms.map(room => 
            room.id === roomId 
              ? { 
                  ...room, 
                  status: 'vacant' as const,
                  tenantName: undefined,
                  tenantPhone: undefined,
                  checkinDate: undefined
                }
              : room
          )
        }
      }
      return p
    })

    updateData({ properties: updatedProperties })
    alert(t('moveOutSuccess', state.lang) || '退租成功')
  }

  return (
    <div className="space-y-6">
      {/* 物業資訊 */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3" 
                style={{ backgroundColor: property.color }}
              />
              {property.name}
            </h2>
            <p className="text-gray-600 mt-1">{property.address}</p>
          </div>
          <button
            onClick={() => openModal('add-room')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            + {t('addRoom', state.lang) || '新增房間'}
          </button>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t('totalRooms', state.lang) || '總房間數'}</p>
            <p className="text-2xl font-bold">{property.rooms.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t('occupied', state.lang)}</p>
            <p className="text-2xl font-bold">
              {property.rooms.filter(r => r.status === 'occupied').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t('vacant', state.lang)}</p>
            <p className="text-2xl font-bold">
              {property.rooms.filter(r => r.status === 'vacant').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t('monthlyIncome', state.lang)}</p>
            <p className="text-2xl font-bold">
              ${property.rooms
                .filter(r => r.status === 'occupied')
                .reduce((sum, room) => sum + (room.rent || 0), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 房間列表 */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{t('roomsTab', state.lang)}</h3>
        </div>
        
        <div className="divide-y">
          {property.rooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">🏠</div>
              <p>{t('noRooms', state.lang) || '還沒有房間，點擊「新增房間」開始添加'}</p>
            </div>
          ) : (
            property.rooms.map(room => (
              <div key={room.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-3">🏠</span>
                      <div>
                        <h4 className="font-semibold text-lg">{room.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 rounded text-sm ${
                            room.status === 'occupied' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {t(room.status, state.lang)}
                          </span>
                          <span className="ml-3 text-gray-600">
                            ${room.rent?.toLocaleString()} / {t('month', state.lang) || '月'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {room.status === 'occupied' && (
                      <div className="mt-3 pl-10">
                        <p className="text-gray-700">
                          <span className="font-medium">{t('tenantName', state.lang)}: </span>
                          {room.tenantName}
                        </p>
                        {room.tenantPhone && (
                          <p className="text-gray-700 mt-1">
                            <span className="font-medium">{t('phone', state.lang)}: </span>
                            {room.tenantPhone}
                          </p>
                        )}
                        {room.checkinDate && (
                          <p className="text-gray-700 mt-1">
                            <span className="font-medium">{t('checkinDate', state.lang) || '入住日期'}: </span>
                            {room.checkinDate}
                          </p>
                        )}
                        {room.deposit && (
                          <p className="text-gray-700 mt-1">
                            <span className="font-medium">{t('depositAmount', state.lang)}: </span>
                            ${room.deposit.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {room.status === 'vacant' ? (
                      <button
                        onClick={() => handleCheckin(room.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
                      >
                        {t('quickCheckin', state.lang)}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => openModal('edit-tenant', { roomId: room.id })}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                        >
                          {t('edit', state.lang)}
                        </button>
                        <button
                          onClick={() => handleMoveOut(room.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
                        >
                          {t('moveOut', state.lang) || '退租'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 入住模態框 */}
      {showCheckinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{t('quickCheckin', state.lang)}</h3>
                <button
                  onClick={() => setShowCheckinModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">{t('tenantName', state.lang)} *</label>
                  <input
                    type="text"
                    value={checkinData.name}
                    onChange={(e) => setCheckinData({...checkinData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('enterTenantName', state.lang) || '輸入租客姓名'}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">{t('phone', state.lang)}</label>
                  <input
                    type="tel"
                    value={checkinData.phone}
                    onChange={(e) => setCheckinData({...checkinData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('enterPhone', state.lang) || '輸入手機號碼'}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">{t('depositAmount', state.lang)}</label>
                    <input
                      type="number"
                      value={checkinData.deposit}
                      onChange={(e) => setCheckinData({...checkinData, deposit: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">{t('rentAmount', state.lang)}</label>
                    <input
                      type="number"
                      value={checkinData.rent}
                      onChange={(e) => setCheckinData({...checkinData, rent: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCheckinModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t('cancel', state.lang)}
                </button>
                <button
                  onClick={handleCheckinSubmit}
                  disabled={!checkinData.name}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('confirmCheckin', state.lang) || '確認入住'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
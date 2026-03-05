'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 類型定義
export interface Room {
  id: number
  name: string
  status: 'vacant' | 'occupied'
  rent: number
  tenantName?: string
  tenantPhone?: string
  checkinDate?: string
  deposit?: number
}

export interface Property {
  id: number
  name: string
  address: string
  color: string
  rooms: Room[]
}

export interface Tenant {
  id: number
  name: string
  phone: string
  propertyId: number
  roomId: number
  checkinDate: string
  depositAmount: number
  rentAmount: number
}

export interface Cost {
  id: number
  propertyId: number
  category: string
  description: string
  amount: number
  date: string
}

export interface AppState {
  tab: string
  currentProperty: number | 'all' | null
  lang: 'zh-TW' | 'vi-VN'
  data: {
    properties: Property[]
    tenants: Tenant[]
    costs: Cost[]
  }
}

interface AppContextType {
  state: AppState
  updateState: (updates: Partial<AppState>) => void
  updateData: (updates: Partial<AppState['data']>) => void
  openModal: (modalType: string, data?: any) => void
  getCurrentProperty: () => Property | null
}

// 創建上下文
const AppContext = createContext<AppContextType | undefined>(undefined)

// 初始狀態
const initialState: AppState = {
  tab: 'rooms',
  currentProperty: 'all',
  lang: 'zh-TW',
  data: {
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
  }
}

// 提供者組件
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  // 從 localStorage 加載數據
  useEffect(() => {
    const savedData = localStorage.getItem('taiwanLandlordData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setState(prev => ({
          ...prev,
          data: parsedData.data || prev.data
        }))
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
  }, [])

  // 保存數據到 localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('taiwanLandlordData', JSON.stringify({
        data: state.data
      }))
    }, 500)
    return () => clearTimeout(timer)
  }, [state.data])

  // 更新狀態
  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  // 更新數據
  const updateData = (updates: Partial<AppState['data']>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates }
    }))
  }

  // 打開模態框（簡單實現）
  const openModal = (modalType: string, data?: any) => {
    console.log(`Open modal: ${modalType}`, data)
    // 實際實現會使用狀態管理模態框
    alert(`打開 ${modalType} 模態框`)
  }

  // 獲取當前物業
  const getCurrentProperty = (): Property | null => {
    if (state.currentProperty === 'all' || state.currentProperty === null) {
      return null
    }
    return state.data.properties.find(p => p.id === state.currentProperty) || null
  }

  const value = {
    state,
    updateState,
    updateData,
    openModal,
    getCurrentProperty
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// 使用上下文的鉤子
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
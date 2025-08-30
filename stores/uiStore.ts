import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  // Theme and appearance
  sidebarCollapsed: boolean
  
  // Modal states
  modals: {
    createInstitution: boolean
    createActivity: boolean
    createMetric: boolean
    userProfile: boolean
  }
  
  // Notification system
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    timestamp: number
  }>
  
  // Map state
  mapViewState: {
    longitude: number
    latitude: number
    zoom: number
    bearing?: number
    pitch?: number
  }
  
  // Dashboard preferences
  dashboardLayout: {
    showMetrics: boolean
    showMap: boolean
    showActivities: boolean
    chartType: 'line' | 'bar' | 'area'
  }
  
  // Actions
  toggleSidebar: () => void
  openModal: (modalName: keyof UIState['modals']) => void
  closeModal: (modalName: keyof UIState['modals']) => void
  closeAllModals: () => void
  
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  updateMapViewState: (viewState: Partial<UIState['mapViewState']>) => void
  updateDashboardLayout: (layout: Partial<UIState['dashboardLayout']>) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarCollapsed: false,
      
      modals: {
        createInstitution: false,
        createActivity: false,
        createMetric: false,
        userProfile: false
      },
      
      notifications: [],
      
      mapViewState: {
        longitude: -46.6333, // São Paulo, Brazil
        latitude: -23.5505,
        zoom: 10
      },
      
      dashboardLayout: {
        showMetrics: true,
        showMap: true,
        showActivities: true,
        chartType: 'line'
      },
      
      // Actions
      toggleSidebar: () => set(state => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      openModal: (modalName) => set(state => ({
        modals: { ...state.modals, [modalName]: true }
      })),
      
      closeModal: (modalName) => set(state => ({
        modals: { ...state.modals, [modalName]: false }
      })),
      
      closeAllModals: () => set(state => ({
        modals: Object.keys(state.modals).reduce((acc, key) => ({
          ...acc,
          [key]: false
        }), {} as UIState['modals'])
      })),
      
      addNotification: (notification) => set(state => ({
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
          }
        ]
      })),
      
      removeNotification: (id) => set(state => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      updateMapViewState: (viewState) => set(state => ({
        mapViewState: { ...state.mapViewState, ...viewState }
      })),
      
      updateDashboardLayout: (layout) => set(state => ({
        dashboardLayout: { ...state.dashboardLayout, ...layout }
      }))
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        mapViewState: state.mapViewState,
        dashboardLayout: state.dashboardLayout
      })
    }
  )
)

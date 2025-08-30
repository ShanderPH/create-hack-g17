"use client"

import { useEffect } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FiX, FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'

export function NotificationSystem() {
  const { notifications, removeNotification } = useUIStore()

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    const timers = notifications.map(notification => {
      if (notification.type === 'success' || notification.type === 'info') {
        return setTimeout(() => {
          removeNotification(notification.id)
        }, 5000)
      }
      return null
    })

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer))
    }
  }, [notifications, removeNotification])

  if (notifications.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <FiCheckCircle className="w-5 h-5 text-green-500" />
      case 'error': return <FiAlertCircle className="w-5 h-5 text-red-500" />
      case 'warning': return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info': return <FiInfo className="w-5 h-5 text-blue-500" />
      default: return <FiInfo className="w-5 h-5 text-gray-500" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'error': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card 
          key={notification.id}
          className={`p-4 shadow-lg animate-in slide-in-from-right duration-300 ${getBackgroundColor(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900">
                {notification.title}
              </h4>
              {notification.message && (
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="p-1 h-auto min-w-0"
            >
              <FiX className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

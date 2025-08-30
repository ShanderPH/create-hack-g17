"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { useActivities } from '@/hooks/useData'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { InteractiveMap } from '@/components/maps/InteractiveMap'
import { ActivityForm } from '@/components/forms/ActivityForm'
import { MapService } from '@/services/mapService'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading, initialized } = useAuthStore()
  const { modals, openModal, closeModal, dashboardLayout } = useUIStore()
  
  const institutionId = user?.user_metadata?.institution_id
  const { data: activities } = useActivities(institutionId)

  useEffect(() => {
    if (initialized && !authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, initialized, router])

  if (authLoading || !initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  const mapFeatures = activities ? MapService.transformActivitiesToFeatures(activities) : []

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Gerencie suas atividades filantrópicas e acompanhe o impacto
          </p>
        </div>
        <Button onClick={() => openModal('createActivity')}>
          Nova Atividade
        </Button>
      </div>

      {/* Dashboard Overview */}
      {dashboardLayout.showMetrics && <DashboardOverview />}

      {/* Map Section */}
      {dashboardLayout.showMap && (
        <Card>
          <CardHeader>
            <CardTitle>Mapa de Atividades</CardTitle>
            <CardDescription>
              Visualização geográfica das atividades filantrópicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InteractiveMap 
              features={mapFeatures}
              height="500px"
              onFeatureClick={(feature) => {
                console.log('Feature clicked:', feature)
                // Could open a modal with activity details
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Activities List */}
      {dashboardLayout.showActivities && (
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Suas atividades filantrópicas mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities?.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {activity.category} • {activity.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Início: {new Date(activity.start_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    {activity.beneficiaries_count && (
                      <p className="text-sm font-medium">
                        {activity.beneficiaries_count} beneficiários
                      </p>
                    )}
                    {activity.budget && (
                      <p className="text-xs text-muted-foreground">
                        R$ {activity.budget.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhuma atividade registrada ainda
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => openModal('createActivity')}
                  >
                    Criar primeira atividade
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {modals.createActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ActivityForm
              onSuccess={() => closeModal('createActivity')}
              onCancel={() => closeModal('createActivity')}
            />
          </div>
        </div>
      )}
    </div>
  )
}

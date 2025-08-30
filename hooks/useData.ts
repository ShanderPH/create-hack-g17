import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataService } from '@/services/dataService'
import { useUIStore } from '@/stores/uiStore'
import type { Database } from '@/types/database'

type Tables = Database['public']['Tables']
type Institution = Tables['institutions']['Row']
type PhilanthropicActivity = Tables['philanthropic_activities']['Row']
type Metric = Tables['metrics']['Row']

// Query keys
export const queryKeys = {
  institutions: ['institutions'] as const,
  institution: (id: string) => ['institutions', id] as const,
  activities: (institutionId?: string) => ['activities', institutionId] as const,
  metrics: (activityId?: string, institutionId?: string) => ['metrics', activityId, institutionId] as const,
  dashboard: (institutionId?: string) => ['dashboard', institutionId] as const,
}

// Institution hooks
export function useInstitutions() {
  return useQuery({
    queryKey: queryKeys.institutions,
    queryFn: DataService.getInstitutions,
  })
}

export function useInstitution(id: string) {
  return useQuery({
    queryKey: queryKeys.institution(id),
    queryFn: () => DataService.getInstitutionById(id),
    enabled: !!id,
  })
}

export function useCreateInstitution() {
  const queryClient = useQueryClient()
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: DataService.createInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.institutions })
      addNotification({
        type: 'success',
        title: 'Instituição criada',
        message: 'A instituição foi criada com sucesso!'
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erro ao criar instituição',
        message: error.message || 'Ocorreu um erro inesperado'
      })
    }
  })
}

export function useUpdateInstitution() {
  const queryClient = useQueryClient()
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Institution> }) =>
      DataService.updateInstitution(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.institutions })
      queryClient.invalidateQueries({ queryKey: queryKeys.institution(data.id) })
      addNotification({
        type: 'success',
        title: 'Instituição atualizada',
        message: 'As informações foram atualizadas com sucesso!'
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erro ao atualizar instituição',
        message: error.message || 'Ocorreu um erro inesperado'
      })
    }
  })
}

// Activity hooks
export function useActivities(institutionId?: string) {
  return useQuery({
    queryKey: queryKeys.activities(institutionId),
    queryFn: () => DataService.getPhilanthropicActivities(institutionId),
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: DataService.createPhilanthropicActivity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities() })
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(data.institution_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() })
      addNotification({
        type: 'success',
        title: 'Atividade criada',
        message: 'A atividade filantrópica foi criada com sucesso!'
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erro ao criar atividade',
        message: error.message || 'Ocorreu um erro inesperado'
      })
    }
  })
}

// Metrics hooks
export function useMetrics(activityId?: string, institutionId?: string) {
  return useQuery({
    queryKey: queryKeys.metrics(activityId, institutionId),
    queryFn: () => DataService.getMetrics(activityId, institutionId),
  })
}

export function useCreateMetric() {
  const queryClient = useQueryClient()
  const { addNotification } = useUIStore()

  return useMutation({
    mutationFn: DataService.createMetric,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.metrics() })
      queryClient.invalidateQueries({ queryKey: queryKeys.metrics(data.activity_id || undefined, data.institution_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() })
      addNotification({
        type: 'success',
        title: 'Métrica registrada',
        message: 'A métrica foi registrada com sucesso!'
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erro ao registrar métrica',
        message: error.message || 'Ocorreu um erro inesperado'
      })
    }
  })
}

// Dashboard hook
export function useDashboardData(institutionId?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard(institutionId),
    queryFn: () => DataService.getDashboardData(institutionId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

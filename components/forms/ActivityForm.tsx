"use client"

import { useState } from 'react'
import { useCreateActivity } from '@/hooks/useData'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { MapService } from '@/services/mapService'

interface ActivityFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ActivityForm({ onSuccess, onCancel }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    start_date: '',
    end_date: '',
    budget: '',
    location: '',
    beneficiaries_count: ''
  })
  const [isGeolocating, setIsGeolocating] = useState(false)

  const { user } = useAuthStore()
  const { addNotification } = useUIStore()
  const createActivity = useCreateActivity()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGeocoding = async () => {
    if (!formData.location.trim()) {
      addNotification({
        type: 'warning',
        title: 'Localização necessária',
        message: 'Digite um endereço para buscar as coordenadas'
      })
      return
    }

    setIsGeolocating(true)
    try {
      const { coordinates } = await MapService.geocodeAddress(formData.location)
      addNotification({
        type: 'success',
        title: 'Localização encontrada',
        message: 'Coordenadas obtidas com sucesso'
      })
      // Store coordinates for submission
      setFormData(prev => ({ 
        ...prev, 
        latitude: coordinates[1].toString(),
        longitude: coordinates[0].toString()
      }))
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro na geolocalização',
        message: error.message || 'Não foi possível encontrar o endereço'
      })
    } finally {
      setIsGeolocating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.user_metadata?.institution_id) {
      addNotification({
        type: 'error',
        title: 'Erro de autenticação',
        message: 'Usuário deve estar associado a uma instituição'
      })
      return
    }

    try {
      const activityData = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        location: formData.location || null,
        latitude: (formData as any).latitude ? parseFloat((formData as any).latitude) : null,
        longitude: (formData as any).longitude ? parseFloat((formData as any).longitude) : null,
        beneficiaries_count: formData.beneficiaries_count ? parseInt(formData.beneficiaries_count) : null,
        institution_id: user.user_metadata.institution_id,
        status: 'planning' as const
      }

      await createActivity.mutateAsync(activityData)
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the mutation
    }
  }

  const categories = [
    'Educação',
    'Saúde',
    'Meio Ambiente',
    'Assistência Social',
    'Cultura',
    'Esporte',
    'Direitos Humanos',
    'Desenvolvimento Comunitário'
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nova Atividade Filantrópica</CardTitle>
        <CardDescription>
          Registre uma nova atividade para sua instituição
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Título da atividade"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <textarea
                className="w-full p-3 border border-divider bg-content1 text-foreground rounded-md resize-none placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Descrição da atividade"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <select
                className="w-full p-3 border border-divider bg-content1 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                type="number"
                placeholder="Número de beneficiários"
                value={formData.beneficiaries_count}
                onChange={(e) => handleInputChange('beneficiaries_count', e.target.value)}
              />
            </div>

            <div>
              <Input
                type="date"
                placeholder="Data de início"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                type="date"
                placeholder="Data de término"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
              />
            </div>

            <div>
              <Input
                type="number"
                step="0.01"
                placeholder="Orçamento (R$)"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Endereço/Localização"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGeocoding}
                disabled={isGeolocating}
              >
                {isGeolocating ? 'Buscando...' : 'Localizar'}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={createActivity.isPending}
              className="flex-1"
            >
              {createActivity.isPending ? 'Salvando...' : 'Criar Atividade'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

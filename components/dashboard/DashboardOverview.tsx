"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { AreaChart, BarChart, DonutChart, Metric, Text, Flex, Grid } from '@tremor/react'
import { useDashboardData } from '@/hooks/useData'
import { useAuthStore } from '@/stores/authStore'

const valueFormatter = (number: number) => 
  `R$ ${new Intl.NumberFormat('pt-BR').format(number)}`

const beneficiariesFormatter = (number: number) =>
  `${new Intl.NumberFormat('pt-BR').format(number)} pessoas`

export function DashboardOverview() {
  const { user } = useAuthStore()
  const institutionId = user?.user_metadata?.institution_id
  
  const { data, isLoading, error } = useDashboardData(institutionId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-default-200 dark:bg-default-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-default-200 dark:bg-default-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Text>Erro ao carregar dados do dashboard</Text>
        </CardContent>
      </Card>
    )
  }

  const { summary, activities, metrics } = data || {}

  // Prepare chart data
  const monthlyData = activities?.reduce((acc: any[], activity: any) => {
    const month = new Date(activity.start_date).toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'short' 
    })
    const existing = acc.find(item => item.month === month)
    
    if (existing) {
      existing.atividades += 1
      existing.investimento += activity.budget || 0
      existing.beneficiarios += activity.beneficiaries_count || 0
    } else {
      acc.push({
        month,
        atividades: 1,
        investimento: activity.budget || 0,
        beneficiarios: activity.beneficiaries_count || 0
      })
    }
    
    return acc
  }, []) || []

  const categoryData = activities?.reduce((acc: any[], activity: any) => {
    const existing = acc.find(item => item.categoria === activity.category)
    
    if (existing) {
      existing.atividades += 1
      existing.investimento += activity.budget || 0
    } else {
      acc.push({
        categoria: activity.category || 'Outros',
        atividades: 1,
        investimento: activity.budget || 0
      })
    }
    
    return acc
  }, []) || []

  const statusData = activities?.reduce((acc: any[], activity: any) => {
    const statusLabels = {
      planning: 'Planejamento',
      active: 'Ativo',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    }
    
    const status = statusLabels[activity.status as keyof typeof statusLabels] || activity.status
    const existing = acc.find(item => item.status === status)
    
    if (existing) {
      existing.count += 1
    } else {
      acc.push({
        status,
        count: 1
      })
    }
    
    return acc
  }, []) || []

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
        <Card>
          <CardContent className="p-6">
            <Flex alignItems="start">
              <div>
                <Text>Total de Instituições</Text>
                <Metric>{summary?.totalInstitutions || 0}</Metric>
              </div>
            </Flex>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Flex alignItems="start">
              <div>
                <Text>Atividades Ativas</Text>
                <Metric>{summary?.totalActivities || 0}</Metric>
              </div>
            </Flex>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Flex alignItems="start">
              <div>
                <Text>Total de Beneficiários</Text>
                <Metric>{beneficiariesFormatter(summary?.totalBeneficiaries || 0)}</Metric>
              </div>
            </Flex>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Flex alignItems="start">
              <div>
                <Text>Investimento Total</Text>
                <Metric>{valueFormatter(summary?.totalInvestment || 0)}</Metric>
              </div>
            </Flex>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid numItemsLg={2} className="gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades por Mês</CardTitle>
            <CardDescription>
              Evolução das atividades filantrópicas ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              className="h-72"
              data={monthlyData}
              index="month"
              categories={["atividades", "beneficiarios"]}
              colors={["blue", "green"]}
              valueFormatter={(number) => number.toString()}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investimento por Categoria</CardTitle>
            <CardDescription>
              Distribuição de recursos por área de atuação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-72"
              data={categoryData}
              index="categoria"
              categories={["investimento"]}
              colors={["blue"]}
              valueFormatter={valueFormatter}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid numItemsLg={2} className="gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status das Atividades</CardTitle>
            <CardDescription>
              Distribuição atual do status das atividades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              className="h-72"
              data={statusData}
              category="count"
              index="status"
              colors={["blue", "green", "yellow", "red"]}
              valueFormatter={(number) => `${number} atividades`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas Recentes</CardTitle>
            <CardDescription>
              Últimas métricas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.slice(0, 5).map((metric: any) => (
                <div key={metric.id} className="flex items-center justify-between">
                  <div>
                    <Text className="font-medium">{metric.metric_type}</Text>
                    <Text className="text-sm text-default-500">
                      {new Date(metric.measurement_date).toLocaleDateString('pt-BR')}
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text className="font-semibold">
                      {metric.value} {metric.unit}
                    </Text>
                  </div>
                </div>
              )) || (
                <Text>Nenhuma métrica registrada ainda</Text>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </div>
  )
}

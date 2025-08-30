import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Tables = Database['public']['Tables']
type Institution = Tables['institutions']['Row']
type PhilanthropicActivity = Tables['philanthropic_activities']['Row']
type Metric = Tables['metrics']['Row']
type Investor = Tables['investors']['Row']

export class DataService {
  // Institution operations
  static async getInstitutions() {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getInstitutionById(id: string) {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async createInstitution(institution: Omit<Institution, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('institutions')
      .insert(institution)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateInstitution(id: string, updates: Partial<Institution>) {
    const { data, error } = await supabase
      .from('institutions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Philanthropic Activities operations
  static async getPhilanthropicActivities(institutionId?: string) {
    let query = supabase
      .from('philanthropic_activities')
      .select('*, institutions(*)')
      .order('created_at', { ascending: false })
    
    if (institutionId) {
      query = query.eq('institution_id', institutionId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async createPhilanthropicActivity(
    activity: Omit<PhilanthropicActivity, 'id' | 'created_at' | 'updated_at'>
  ) {
    const { data, error } = await supabase
      .from('philanthropic_activities')
      .insert(activity)
      .select('*, institutions(*)')
      .single()
    
    if (error) throw error
    return data
  }

  // Metrics operations
  static async getMetrics(activityId?: string, institutionId?: string) {
    let query = supabase
      .from('metrics')
      .select('*, philanthropic_activities(*), institutions(*)')
      .order('created_at', { ascending: false })
    
    if (activityId) {
      query = query.eq('activity_id', activityId)
    }
    
    if (institutionId) {
      query = query.eq('institution_id', institutionId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async createMetric(metric: Omit<Metric, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('metrics')
      .insert(metric)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Dashboard aggregations
  static async getDashboardData(institutionId?: string) {
    const [institutions, activities, metrics] = await Promise.all([
      this.getInstitutions(),
      this.getPhilanthropicActivities(institutionId),
      this.getMetrics(undefined, institutionId)
    ])

    return {
      institutions,
      activities,
      metrics,
      summary: {
        totalInstitutions: institutions.length,
        totalActivities: activities.length,
        totalMetrics: metrics.length,
        totalBeneficiaries: metrics.reduce((sum, m) => sum + (m.beneficiaries_count || 0), 0),
        totalInvestment: activities.reduce((sum, a) => sum + (a.budget || 0), 0)
      }
    }
  }
}

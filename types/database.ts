export interface Database {
  public: {
    Tables: {
      institutions: {
        Row: {
          id: string
          name: string
          description: string | null
          email: string
          phone: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          website: string | null
          logo_url: string | null
          category: string | null
          founded_year: number | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          email: string
          phone?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          website?: string | null
          logo_url?: string | null
          category?: string | null
          founded_year?: number | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          website?: string | null
          logo_url?: string | null
          category?: string | null
          founded_year?: number | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      philanthropic_activities: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          start_date: string
          end_date: string | null
          budget: number | null
          status: 'planning' | 'active' | 'completed' | 'cancelled'
          location: string | null
          latitude: number | null
          longitude: number | null
          beneficiaries_count: number | null
          institution_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          start_date: string
          end_date?: string | null
          budget?: number | null
          status?: 'planning' | 'active' | 'completed' | 'cancelled'
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          beneficiaries_count?: number | null
          institution_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          start_date?: string
          end_date?: string | null
          budget?: number | null
          status?: 'planning' | 'active' | 'completed' | 'cancelled'
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          beneficiaries_count?: number | null
          institution_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      metrics: {
        Row: {
          id: string
          metric_type: string
          value: number
          unit: string | null
          description: string | null
          measurement_date: string
          activity_id: string | null
          institution_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          metric_type: string
          value: number
          unit?: string | null
          description?: string | null
          measurement_date: string
          activity_id?: string | null
          institution_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          metric_type?: string
          value?: number
          unit?: string | null
          description?: string | null
          measurement_date?: string
          activity_id?: string | null
          institution_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      investors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          investment_focus: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          investment_focus?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          investment_focus?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

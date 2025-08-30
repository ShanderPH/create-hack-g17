import { create } from 'zustand'
import { AuthService, type AuthUser } from '@/services/authService'
import type { Session } from '@supabase/supabase-js'

interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  initialized: boolean
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: any) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: { email?: string; data?: any }) => Promise<void>
  initialize: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  setSession: (session: Session | null) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,
  
  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { user, session } = await AuthService.signIn(email, password)
      set({ user: user as AuthUser, session, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  signUp: async (email: string, password: string, metadata?: any) => {
    set({ loading: true })
    try {
      const { user, session } = await AuthService.signUp(email, password, metadata)
      set({ user: user as AuthUser, session, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  signOut: async () => {
    set({ loading: true })
    try {
      await AuthService.signOut()
      set({ user: null, session: null, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  resetPassword: async (email: string) => {
    set({ loading: true })
    try {
      await AuthService.resetPassword(email)
      set({ loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  updateProfile: async (updates: { email?: string; data?: any }) => {
    set({ loading: true })
    try {
      await AuthService.updateProfile(updates)
      const user = await AuthService.getUser()
      set({ user: user as AuthUser, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  initialize: async () => {
    if (get().initialized) return
    
    set({ loading: true })
    try {
      const [user, session] = await Promise.all([
        AuthService.getUser(),
        AuthService.getSession()
      ])
      
      set({ 
        user: user as AuthUser, 
        session, 
        loading: false, 
        initialized: true 
      })
      
      // Set up auth state listener
      AuthService.onAuthStateChange((event, session) => {
        set({ 
          user: session?.user as AuthUser || null, 
          session 
        })
      })
    } catch (error) {
      set({ loading: false, initialized: true })
    }
  },
  
  setUser: (user: AuthUser | null) => set({ user }),
  setSession: (session: Session | null) => set({ session })
}))

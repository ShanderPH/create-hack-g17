import { supabase } from '@/lib/supabase'
import type { User, Session, UserMetadata } from '@supabase/supabase-js'

export interface AuthUser extends User {
  user_metadata: UserMetadata & {
    full_name?: string
    avatar_url?: string
    institution_id?: string
  }
}

export class AuthService {
  // Authentication methods
  static async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) throw error
  }

  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  }

  static async updateProfile(updates: {
    email?: string
    data?: any
  }) {
    const { error } = await supabase.auth.updateUser(updates)
    if (error) throw error
  }

  // Session management
  static async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }

  static async getUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user as AuthUser
  }

  // Auth state listeners
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // Utility methods
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession()
    return !!session
  }

  static async requireAuth(): Promise<AuthUser> {
    const user = await this.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }
    return user
  }

  // Social auth (optional)
  static async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) throw error
  }

  static async signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) throw error
  }
}

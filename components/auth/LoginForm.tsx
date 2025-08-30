"use client"

import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  const { signIn, signUp, loading } = useAuthStore()
  const { addNotification } = useUIStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      addNotification({
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha todos os campos.'
      })
      return
    }

    try {
      if (isSignUp) {
        await signUp(email, password)
        addNotification({
          type: 'success',
          title: 'Conta criada',
          message: 'Verifique seu email para confirmar a conta.'
        })
      } else {
        await signIn(email, password)
        addNotification({
          type: 'success',
          title: 'Login realizado',
          message: 'Bem-vindo de volta!'
        })
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: isSignUp ? 'Erro ao criar conta' : 'Erro no login',
        message: error.message || 'Ocorreu um erro inesperado'
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Criar Conta' : 'Entrar'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Crie sua conta para gerenciar atividades filantrópicas'
            : 'Entre com suas credenciais para acessar a plataforma'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? 'Já tem uma conta? Faça login'
                : 'Não tem conta? Cadastre-se'
              }
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

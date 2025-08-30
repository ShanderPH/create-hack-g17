# Create Hack G17 - Plataforma Filantrópica
## Prompt Header para Desenvolvimento Colaborativo

### 🎯 **VISÃO GERAL DO PROJETO**
Plataforma web para gestão e transparência de atividades filantrópicas, conectando instituições beneficentes com investidores através de métricas e visualizações geográficas.

---

## 🏗️ **ARQUITETURA & STACK TECNOLÓGICO**

### **Framework Principal**
- **Next.js 15.3.1** com App Router
- **React 18.3.1** com TypeScript 5.6.3
- **Turbopack** para desenvolvimento

### **UI & Styling**
- **HeroUI v2** (sistema de componentes baseado em Radix UI)
- **Tailwind CSS 4.1.11** com Tailwind Variants 2.0.1
- **Framer Motion 11.18.2** para animações
- **next-themes 0.4.6** para dark/light mode

### **Backend & Database**
- **Supabase** (PostgreSQL + Auth + Storage)
- **@supabase/supabase-js ^2.45.4**
- **Row Level Security (RLS)** para controle de acesso

### **Estado & Data Fetching**
- **Zustand ^4.5.5** para estado global da UI
- **TanStack Query ^5.56.2** para estado do servidor e cache
- **React Context** para autenticação

### **Visualização de Dados**
- **Tremor ^3.18.3** para charts e métricas
- **MapBox GL ^3.6.0** + **react-map-gl ^7.1.7** para mapas interativos
- **react-icons ^5.3.0** para ícones

---

## 📁 **ESTRUTURA DE DIRETÓRIOS**

```
create-hack-g17/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Dashboard principal (homepage)
│   ├── layout.tsx                # Layout raiz com providers
│   ├── providers.tsx             # Configuração de providers
│   ├── auth/page.tsx             # Página de autenticação
│   ├── dashboard/page.tsx        # Dashboard específico
│   └── [outras rotas]/
├── components/                   # Componentes React
│   ├── ui/                       # Componentes atômicos
│   │   ├── Button.tsx            # Wrapper do HeroUI Button
│   │   ├── Input.tsx             # Wrapper do HeroUI Input
│   │   ├── Card.tsx              # Componente Card customizado
│   │   └── NotificationSystem.tsx
│   ├── auth/                     # Componentes de autenticação
│   │   ├── AuthProvider.tsx      # Provider de contexto
│   │   └── LoginForm.tsx         # Formulário de login/registro
│   ├── dashboard/                # Componentes do dashboard
│   │   └── DashboardOverview.tsx # Visão geral com métricas
│   ├── maps/                     # Componentes de mapas
│   │   └── InteractiveMap.tsx    # Mapa interativo com clusters
│   ├── forms/                    # Formulários
│   │   └── ActivityForm.tsx      # Formulário de atividades
│   └── navbar.tsx                # Navegação principal
├── services/                     # Camada de serviços
│   ├── authService.ts            # Serviços de autenticação
│   ├── dataService.ts            # CRUD operations
│   └── mapService.ts             # Serviços de mapas/geocoding
├── stores/                       # Estado global (Zustand)
│   ├── authStore.ts              # Estado de autenticação
│   └── uiStore.ts                # Estado da UI (modais, notificações)
├── hooks/                        # Custom hooks
│   └── useData.ts                # Hooks do TanStack Query
├── lib/                          # Configurações e utilitários
│   ├── supabase.ts               # Cliente Supabase
│   └── queryClient.ts            # Configuração TanStack Query
├── types/                        # Definições TypeScript
│   ├── database.ts               # Tipos do banco de dados
│   └── index.ts                  # Tipos gerais
└── config/                       # Configurações
    ├── site.ts                   # Configuração do site
    └── fonts.ts                  # Configuração de fontes
```

---

## 🗄️ **SCHEMA DO BANCO DE DADOS**

### **Tabelas Principais**
```typescript
// institutions - Instituições filantrópicas
{
  id: string (UUID)
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
  user_id: string (FK)
  created_at: string
  updated_at: string
}

// philanthropic_activities - Atividades filantrópicas
{
  id: string (UUID)
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
  institution_id: string (FK)
  created_at: string
  updated_at: string
}

// metrics - Métricas de impacto
{
  id: string (UUID)
  metric_type: string
  value: number
  unit: string | null
  description: string | null
  measurement_date: string
  activity_id: string | null (FK)
  institution_id: string (FK)
  created_at: string
  updated_at: string
}

// investors - Investidores
{
  id: string (UUID)
  name: string
  email: string
  phone: string | null
  company: string | null
  investment_focus: string | null
  user_id: string (FK)
  created_at: string
  updated_at: string
}
```

---

## 🔄 **FLUXO DE DADOS & ESTADO**

### **Gerenciamento de Estado**
1. **authStore (Zustand)**: Estado de autenticação global
2. **uiStore (Zustand)**: Estado da UI (modais, notificações, layout)
3. **TanStack Query**: Cache e sincronização de dados do servidor
4. **React Context**: Inicialização da autenticação

### **Padrões de Data Fetching**
```typescript
// Hooks customizados em useData.ts
useInstitutions()           // Lista todas instituições
useActivities(institutionId) // Atividades por instituição
useMetrics(activityId)      // Métricas por atividade
useDashboardData(instId)    // Dados agregados do dashboard

// Mutações com invalidação automática
useCreateActivity()         // Cria atividade + invalida cache
useUpdateInstitution()      // Atualiza instituição + invalida cache
```

### **Fluxo de Autenticação**
1. **AuthProvider** inicializa estado na montagem
2. **authStore** gerencia sessão e usuário
3. **RLS policies** no Supabase controlam acesso aos dados
4. **Navbar** mostra/esconde baseado no estado de auth

---

## 🎨 **SISTEMA DE DESIGN**

### **Tokens de Cor (HeroUI)**
```css
/* Use sempre tokens semânticos */
bg-content1          /* Background de cards */
bg-background        /* Background principal */
text-foreground      /* Texto principal */
text-default-500     /* Texto secundário */
text-default-400     /* Placeholder text */
border-divider       /* Bordas */
text-primary         /* Cor primária */
text-danger          /* Cor de erro */
```

### **Responsividade**
- **Mobile-first**: Base styles para mobile
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- **Componentes flexíveis**: Layouts que se adaptam automaticamente

### **Componentes Atômicos**
- **Button**: Wrapper do HeroUI com variantes customizadas
- **Input**: Wrapper com styling consistente
- **Card**: Componente composto (Header, Content, Footer)

---

## 🔧 **PADRÕES DE DESENVOLVIMENTO**

### **Estrutura de Componentes**
```typescript
// Sempre use "use client" para componentes interativos
"use client"

import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'

export function MeuComponente() {
  // 1. Hooks de estado
  const [localState, setLocalState] = useState()
  
  // 2. Stores globais
  const { user } = useAuthStore()
  const { addNotification } = useUIStore()
  
  // 3. Data fetching
  const { data, isLoading } = useMinhaQuery()
  
  // 4. Event handlers
  const handleAction = async () => {
    try {
      // lógica
      addNotification({ type: 'success', title: 'Sucesso!' })
    } catch (error) {
      addNotification({ type: 'error', title: 'Erro!' })
    }
  }
  
  // 5. Render com loading/error states
  if (isLoading) return <LoadingSkeleton />
  
  return (
    <div className="responsive-classes">
      {/* JSX */}
    </div>
  )
}
```

### **Tratamento de Erros**
- **TanStack Query**: Retry automático e error boundaries
- **Notifications**: Sistema centralizado via uiStore
- **Form validation**: Validação client-side + server-side

### **Performance**
- **Code splitting**: Componentes lazy quando apropriado
- **Query caching**: TanStack Query com stale-while-revalidate
- **Image optimization**: Next.js Image component

---

## 🔐 **SEGURANÇA & AUTENTICAÇÃO**

### **Supabase Auth**
- **JWT tokens** para autenticação
- **Row Level Security (RLS)** no PostgreSQL
- **OAuth providers** configuráveis
- **Email confirmation** para novos usuários

### **Controle de Acesso**
```sql
-- Exemplo de RLS policy
CREATE POLICY "Users can only see their own institutions"
ON institutions FOR SELECT
USING (auth.uid() = user_id);
```

### **Variáveis de Ambiente**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

---

## 📊 **FUNCIONALIDADES IMPLEMENTADAS**

### ✅ **Core Features**
- [x] Sistema de autenticação completo
- [x] Dashboard com métricas e gráficos
- [x] CRUD de instituições e atividades
- [x] Mapas interativos com clustering
- [x] Sistema de notificações
- [x] Dark/Light mode
- [x] Responsive design
- [x] Formulários com validação

### ✅ **Componentes UI**
- [x] Navbar com auth state
- [x] Cards responsivos
- [x] Botões e inputs customizados
- [x] Modais e overlays
- [x] Loading skeletons
- [x] Sistema de notificações

---

## 🚀 **COMANDOS DE DESENVOLVIMENTO**

```bash
# Desenvolvimento
npm run dev          # Inicia servidor com Turbopack

# Build & Deploy
npm run build        # Build de produção
npm start           # Servidor de produção

# Linting
npm run lint        # ESLint com auto-fix
```

---

## ⚠️ **REGRAS CRÍTICAS PARA DESENVOLVIMENTO**

### **🎨 Styling**
- **SEMPRE use tokens semânticos do HeroUI** (`text-foreground`, `bg-content1`, etc.)
- **NUNCA use cores hardcoded** (`text-gray-500`, `bg-white`, etc.)
- **Mobile-first**: Escreva CSS base para mobile, depois breakpoints

### **🔄 Estado**
- **UI state**: Use `uiStore` (modais, notificações, layout)
- **Server state**: Use TanStack Query hooks
- **Auth state**: Use `authStore`
- **Local state**: Use `useState` apenas para estado local

### **📡 Data Fetching**
- **SEMPRE use hooks customizados** de `useData.ts`
- **Invalidação automática**: Mutações devem invalidar queries relacionadas
- **Loading states**: Sempre trate estados de loading/error

### **🔐 Segurança**
- **RLS policies**: Sempre configure no Supabase
- **Validação**: Client-side + server-side
- **Env vars**: Nunca commite secrets

### **📱 Responsividade**
- **Teste em mobile**: Sempre verifique em telas pequenas
- **Flexbox/Grid**: Use para layouts adaptativos
- **Touch targets**: Botões com tamanho mínimo 44px

### **🧩 Componentes**
- **"use client"**: Para componentes interativos
- **TypeScript**: Sempre tipado, use interfaces do database.ts
- **Error boundaries**: Trate erros graciosamente
- **Accessibility**: Use semantic HTML e ARIA

---

## 📝 **EXEMPLO DE IMPLEMENTAÇÃO**

```typescript
// Exemplo de nova feature seguindo os padrões
"use client"

import { useState } from 'react'
import { useCreateMetric } from '@/hooks/useData'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface MetricFormProps {
  activityId: string
  onSuccess?: () => void
}

export function MetricForm({ activityId, onSuccess }: MetricFormProps) {
  const [formData, setFormData] = useState({
    metric_type: '',
    value: '',
    unit: '',
    description: ''
  })
  
  const { user } = useAuthStore()
  const { addNotification } = useUIStore()
  const createMetric = useCreateMetric()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.user_metadata?.institution_id) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Usuário deve estar associado a uma instituição'
      })
      return
    }
    
    try {
      await createMetric.mutateAsync({
        ...formData,
        value: parseFloat(formData.value),
        activity_id: activityId,
        institution_id: user.user_metadata.institution_id,
        measurement_date: new Date().toISOString()
      })
      
      onSuccess?.()
    } catch (error) {
      // Error handling é feito no hook
    }
  }
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Nova Métrica</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Tipo de métrica"
            value={formData.metric_type}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              metric_type: e.target.value 
            }))}
            required
          />
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Valor"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                value: e.target.value 
              }))}
              required
              className="flex-1"
            />
            <Input
              placeholder="Unidade"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                unit: e.target.value 
              }))}
              className="w-24"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={createMetric.isPending}
            className="w-full"
          >
            {createMetric.isPending ? 'Salvando...' : 'Salvar Métrica'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

**🎯 Use este prompt header como referência para manter consistência arquitetural e seguir os padrões estabelecidos no projeto Create Hack G17.**

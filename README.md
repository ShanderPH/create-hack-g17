# Create Hack G17 - Plataforma Filantrópica

Uma plataforma moderna para gestão e métricas de atividades filantrópicas, desenvolvida para atrair investimentos através da transparência e visualização de dados de impacto social.

## Visão Geral

O Create Hack G17 é uma aplicação web completa que permite às instituições filantrópicas:

- **Gerenciar atividades** filantrópicas com métricas de impacto
- **Visualizar dados** através de dashboards interativos e mapas
- **Atrair investidores** com transparência e relatórios detalhados
- **Monitorar progresso** com gráficos e indicadores em tempo real

## Stack Tecnológico

### Frontend
- **Next.js 15.3.1** - Framework React com App Router
- **React 18.3.1** - Biblioteca de interface do usuário
- **TypeScript 5.6.3** - Tipagem estática

### UI/UX
- **HeroUI v2** - Sistema de componentes baseado em Radix UI
- **Tailwind CSS 4.1.11** - Framework CSS utility-first
- **Framer Motion 11.18.2** - Animações fluidas
- **React Icons** - Biblioteca de ícones

### Gerenciamento de Estado
- **Zustand 4.5.5** - Estado da UI (modais, notificações, preferências)
- **TanStack Query 5.56.2** - Estado do servidor e cache de dados

### Visualização de Dados
- **Tremor 3.18.3** - Gráficos e dashboards interativos
- **react-map-gl 7.1.7** - Mapas interativos com MapBox

### Backend & Dados
- **Supabase** - Autenticação, banco de dados PostgreSQL e RLS
- **MapBox** - Serviços de geolocalização e mapas

## Arquitetura

### Estrutura de Componentes
```bash
components/
├── auth/           # Autenticação (AuthProvider, LoginForm)
├── dashboard/      # Dashboards e visualizações
├── forms/          # Formulários (ActivityForm, MetricForm)
├── maps/           # Componentes de mapa interativo
└── ui/             # Componentes atômicos (Button, Input, Card)
```

### Camada de Serviços
```bash
services/
├── authService.ts    # Autenticação com Supabase
├── dataService.ts    # Operações CRUD no banco
└── mapService.ts     # Integração com MapBox
```

### Gerenciamento de Estado
```bash
stores/
├── authStore.ts      # Estado de autenticação
└── uiStore.ts        # Estado da interface (modais, notificações)
```

### Hooks Customizados
```bash
hooks/
└── useData.ts        # Hooks para TanStack Query
```

## Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie `.env.example` para `.env.local` e configure:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MapBox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

### 3. Configurar Banco de Dados Supabase

Execute as seguintes queries SQL no Supabase para criar as tabelas:

```sql
-- Tabela de instituições
CREATE TABLE institutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  website TEXT,
  logo_url TEXT,
  category TEXT,
  founded_year INTEGER,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de atividades filantrópicas
CREATE TABLE philanthropic_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL,
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  beneficiaries_count INTEGER,
  institution_id UUID REFERENCES institutions(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de métricas
CREATE TABLE metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  value DECIMAL NOT NULL,
  unit TEXT,
  description TEXT,
  measurement_date DATE NOT NULL,
  activity_id UUID REFERENCES philanthropic_activities(id),
  institution_id UUID REFERENCES institutions(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE philanthropic_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (exemplo básico)
CREATE POLICY "Users can view own institutions" ON institutions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own institutions" ON institutions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Funcionalidades Principais

### Dashboard Interativo
- **Métricas em tempo real** - Total de instituições, atividades, beneficiários e investimentos
- **Gráficos dinâmicos** - Evolução temporal, distribuição por categoria, status das atividades
- **Visualização geográfica** - Mapa interativo com localização das atividades

### Gestão de Atividades
- **Formulário completo** - Título, descrição, categoria, datas, orçamento
- **Geolocalização** - Integração com MapBox para coordenadas automáticas
- **Status tracking** - Planejamento, ativo, concluído, cancelado

### Sistema de Autenticação
- **Login/Registro** seguro com Supabase Auth
- **Gestão de sessão** persistente
- **Proteção de rotas** baseada em autenticação

### Notificações
- **Sistema de feedback** para ações do usuário
- **Auto-dismiss** para notificações de sucesso
- **Diferentes tipos** - sucesso, erro, aviso, informação

## Segurança

- **Row Level Security (RLS)** no Supabase para isolamento de dados
- **Validação de entrada** em formulários
- **Sanitização** de dados antes da renderização
- **Tokens JWT** para autenticação segura
- **HTTPS** obrigatório em produção

## Design System

### Componentes Atômicos
- **Button** - Variantes: default, destructive, outline, ghost
- **Input** - Tipos: text, email, password, number, date
- **Card** - Header, Content, Footer estruturados

### Tema e Cores
- **Modo escuro/claro** com next-themes
- **Paleta consistente** baseada no Tailwind CSS
- **Componentes responsivos** para mobile e desktop

## Visualização de Dados

### Gráficos Tremor
- **AreaChart** - Evolução temporal das atividades
- **BarChart** - Distribuição de investimentos por categoria
- **DonutChart** - Status das atividades

### Mapas Interativos
- **Marcadores** para instituições e atividades
- **Popups informativos** com detalhes
- **Clustering** automático para múltiplos pontos
- **Controles de navegação** e zoom

## Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Outras Plataformas
- Configure as variáveis de ambiente
- Execute `npm run build`
- Sirva os arquivos da pasta `.next`

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

Para dúvidas ou problemas:
1. Verifique a [documentação](./docs/)
2. Abra uma [issue](../../issues)
3. Entre em contato com a equipe

---
**Create Hack G17** - Transformando filantropia através da tecnologia 

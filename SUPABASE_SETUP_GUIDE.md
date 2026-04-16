# 🔧 Guia Completo de Reconstrução do Backend - Tá Pago.PT

## 📋 Visão Geral

Este guia contém **TODOS** os passos necessários para recriar o backend Supabase do Tá Pago.PT do zero.

---

## 🚀 PASSO 1: Criar Novo Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"New Project"**
3. Nome do projeto: **`ta-pago-pt`** (ou qualquer nome)
4. Database Password: **Guarde em local seguro!**
5. Region: **Europe West (London)** (mais próximo de Portugal)
6. Aguarde ~2 minutos para provisionamento

---

## 🗄️ PASSO 2: Criar Estrutura do Banco de Dados

### 2.1 - Tabela `users` (Usuários/Empresas)

Cole no **SQL Editor** do Supabase:

```sql
-- =====================================================
-- TABELA: users
-- Armazena dados de empresas/usuários da plataforma
-- =====================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  document TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'starter', 'professional', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_auth_id ON public.users(auth_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_plan_type ON public.users(plan_type);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = auth_id);
```

---

### 2.2 - Tabela `debtors` (Devedores)

```sql
-- =====================================================
-- TABELA: debtors
-- Armazena todos os devedores cadastrados
-- =====================================================

CREATE TABLE public.debtors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados pessoais
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  document TEXT,
  document_type TEXT CHECK (document_type IN ('cpf', 'cnpj', 'nif', 'nipc')),
  
  -- Dados da dívida
  debt_amount DECIMAL(12,2) NOT NULL,
  original_amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  days_overdue INTEGER GENERATED ALWAYS AS (
    EXTRACT(DAY FROM (NOW() - due_date))::INTEGER
  ) STORED,
  
  -- Status e classificação
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'negotiating', 'paid', 'defaulted', 'legal', 'dispute')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  score INTEGER DEFAULT 50 CHECK (score >= 0 AND score <= 100),
  category TEXT,
  segment TEXT,
  
  -- Endereço (JSONB para flexibilidade)
  address JSONB DEFAULT '{}'::JSONB,
  
  -- Informações adicionais
  company_name TEXT,
  last_contact TIMESTAMPTZ,
  notes TEXT,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_debtors_user_id ON public.debtors(user_id);
CREATE INDEX idx_debtors_status ON public.debtors(status);
CREATE INDEX idx_debtors_priority ON public.debtors(priority);
CREATE INDEX idx_debtors_due_date ON public.debtors(due_date);
CREATE INDEX idx_debtors_email ON public.debtors(email);
CREATE INDEX idx_debtors_document ON public.debtors(document);

-- RLS
ALTER TABLE public.debtors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own debtors"
  ON public.debtors FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own debtors"
  ON public.debtors FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own debtors"
  ON public.debtors FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own debtors"
  ON public.debtors FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );
```

---

### 2.3 - Tabela `timeline_events` (Histórico de Ações)

```sql
-- =====================================================
-- TABELA: timeline_events
-- Registro de todas as interações com devedores
-- =====================================================

CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debtor_id UUID REFERENCES public.debtors(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Tipo e dados do evento
  event_type TEXT NOT NULL CHECK (event_type IN ('email', 'sms', 'whatsapp', 'call', 'payment', 'note', 'status_change', 'dispute', 'agreement')),
  channel TEXT,
  
  -- Conteúdo
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  
  -- Status
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_timeline_debtor_id ON public.timeline_events(debtor_id);
CREATE INDEX idx_timeline_user_id ON public.timeline_events(user_id);
CREATE INDEX idx_timeline_event_type ON public.timeline_events(event_type);
CREATE INDEX idx_timeline_created_at ON public.timeline_events(created_at DESC);

-- RLS
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own timeline"
  ON public.timeline_events FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own timeline"
  ON public.timeline_events FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );
```

---

### 2.4 - Tabela `payment_agreements` (Acordos de Pagamento)

```sql
-- =====================================================
-- TABELA: payment_agreements
-- Armazena acordos de parcelamento
-- =====================================================

CREATE TABLE public.payment_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debtor_id UUID REFERENCES public.debtors(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Detalhes do acordo
  original_debt DECIMAL(12,2) NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  agreed_amount DECIMAL(12,2) NOT NULL,
  installments_count INTEGER NOT NULL CHECK (installments_count > 0),
  installment_amount DECIMAL(12,2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'breached')),
  
  -- Datas
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  first_payment_date DATE NOT NULL,
  
  -- Metadados
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_agreements_debtor_id ON public.payment_agreements(debtor_id);
CREATE INDEX idx_agreements_user_id ON public.payment_agreements(user_id);
CREATE INDEX idx_agreements_status ON public.payment_agreements(status);

-- RLS
ALTER TABLE public.payment_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agreements"
  ON public.payment_agreements FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own agreements"
  ON public.payment_agreements FOR ALL
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );
```

---

### 2.5 - Tabela `installments` (Parcelas)

```sql
-- =====================================================
-- TABELA: installments
-- Parcelas individuais de acordos
-- =====================================================

CREATE TABLE public.installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID REFERENCES public.payment_agreements(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados da parcela
  installment_number INTEGER NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  
  -- Status e pagamento
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  paid_at TIMESTAMPTZ,
  paid_amount DECIMAL(12,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(agreement_id, installment_number)
);

-- Índices
CREATE INDEX idx_installments_agreement ON public.installments(agreement_id);
CREATE INDEX idx_installments_status ON public.installments(status);
CREATE INDEX idx_installments_due_date ON public.installments(due_date);

-- RLS
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own installments"
  ON public.installments FOR SELECT
  USING (
    agreement_id IN (
      SELECT id FROM public.payment_agreements pa
      JOIN public.users u ON pa.user_id = u.id
      WHERE u.auth_id = auth.uid()
    )
  );
```

---

### 2.6 - Tabela `disputes` (Contestações/Disputas)

```sql
-- =====================================================
-- TABELA: disputes
-- Contestações de dívidas
-- =====================================================

CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debtor_id UUID REFERENCES public.debtors(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Detalhes da disputa
  dispute_type TEXT NOT NULL CHECK (dispute_type IN ('contestacao_valor', 'servico_nao_prestado', 'pagamento_efetuado', 'outro')),
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'accepted', 'rejected', 'closed')),
  
  -- Resolução
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.users(id),
  
  -- Metadados
  opened_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_disputes_debtor_id ON public.disputes(debtor_id);
CREATE INDEX idx_disputes_user_id ON public.disputes(user_id);
CREATE INDEX idx_disputes_status ON public.disputes(status);

-- RLS
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own disputes"
  ON public.disputes FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own disputes"
  ON public.disputes FOR ALL
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );
```

---

### 2.7 - Tabela `settings` (Configurações)

```sql
-- =====================================================
-- TABELA: settings
-- Configurações personalizadas por usuário
-- =====================================================

CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Configurações de email
  email_enabled BOOLEAN DEFAULT true,
  email_templates JSONB DEFAULT '{}'::JSONB,
  
  -- Configurações de SMS
  sms_enabled BOOLEAN DEFAULT false,
  sms_provider TEXT,
  sms_api_key TEXT,
  
  -- Configurações de WhatsApp
  whatsapp_enabled BOOLEAN DEFAULT false,
  whatsapp_number TEXT,
  
  -- Automações
  auto_reminders BOOLEAN DEFAULT true,
  reminder_days_before INTEGER[] DEFAULT ARRAY[7, 3, 1],
  
  -- Preferências
  preferences JSONB DEFAULT '{}'::JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_settings_user_id ON public.settings(user_id);

-- RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON public.settings FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own settings"
  ON public.settings FOR ALL
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  );
```

---

### 2.8 - Tabela `webauthn_credentials` (Autenticação Biométrica)

```sql
-- =====================================================
-- TABELA: webauthn_credentials
-- Credenciais WebAuthn (Face ID, Touch ID, etc)
-- =====================================================

CREATE TABLE public.webauthn_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados do WebAuthn
  credential_id TEXT UNIQUE NOT NULL,
  public_key TEXT NOT NULL,
  counter BIGINT DEFAULT 0,
  
  -- Metadados do dispositivo
  device_name TEXT,
  device_type TEXT,
  transports TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_webauthn_user_id ON public.webauthn_credentials(user_id);
CREATE INDEX idx_webauthn_credential_id ON public.webauthn_credentials(credential_id);

-- RLS
ALTER TABLE public.webauthn_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credentials"
  ON public.webauthn_credentials FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own credentials"
  ON public.webauthn_credentials FOR ALL
  USING (user_id = auth.uid());
```

---

## ⚙️ PASSO 3: Triggers e Funções Auxiliares

### 3.1 - Trigger para atualizar `updated_at`

```sql
-- =====================================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_debtors_updated_at BEFORE UPDATE ON public.debtors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agreements_updated_at BEFORE UPDATE ON public.payment_agreements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 3.2 - Função: Criar usuário automaticamente após signup

```sql
-- =====================================================
-- FUNÇÃO: Criar entrada na tabela users após signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, user_name, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Empresa')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 3.3 - Função: Criar settings padrão para novos usuários

```sql
-- =====================================================
-- FUNÇÃO: Criar settings padrão
-- =====================================================

CREATE OR REPLACE FUNCTION public.create_default_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_user_created_settings
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_settings();
```

---

## 🔐 PASSO 4: Configurar Autenticação

### 4.1 - Habilitar Email Auth

No Supabase Dashboard:
1. Vá em **Authentication** → **Providers**
2. Habilite **Email**
3. Desabilite "Confirm Email" (para desenvolvimento)

### 4.2 - Configurar Email Templates (Opcional)

Em **Authentication** → **Email Templates**, customize:
- Confirmation Email
- Magic Link
- Password Recovery

---

## 🚀 PASSO 5: Edge Functions

Você precisa criar Edge Functions para as rotas da API. Aqui está a estrutura:

### 5.1 - Estrutura de pastas

```
supabase/
└── functions/
    └── make-server-12af7011/
        └── index.ts
```

### 5.2 - Código da Edge Function Principal

Cole este código no arquivo `index.ts` da Edge Function:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/make-server-12af7011/', '')
    
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    // Routes that don't require auth
    if (path.startsWith('auth/')) {
      return handleAuthRoutes(req, path, supabaseClient)
    }

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get user data
    const { data: userData } = await supabaseClient
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    // Route handlers
    if (path.startsWith('debtors')) {
      return handleDebtorsRoutes(req, path, supabaseClient, userData)
    }
    
    if (path.startsWith('analytics/')) {
      return handleAnalyticsRoutes(req, path, supabaseClient, userData)
    }

    if (path.startsWith('settings')) {
      return handleSettingsRoutes(req, path, supabaseClient, userData)
    }

    if (path.startsWith('actions/')) {
      return handleActionsRoutes(req, path, supabaseClient, userData)
    }

    if (path.startsWith('ai/')) {
      return handleAIRoutes(req, path, supabaseClient, userData)
    }

    if (path.startsWith('webauthn/')) {
      return handleWebAuthnRoutes(req, path, supabaseClient, user)
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// ==================== AUTH ROUTES ====================

async function handleAuthRoutes(req: Request, path: string, supabase: any) {
  if (path === 'auth/signup' && req.method === 'POST') {
    const { email, password, companyName, userName } = await req.json()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName,
          user_name: userName
        }
      }
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ==================== DEBTORS ROUTES ====================

async function handleDebtorsRoutes(req: Request, path: string, supabase: any, userData: any) {
  // GET /debtors - List all debtors
  if (path === 'debtors' && req.method === 'GET') {
    const { data, error } = await supabase
      .from('debtors')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return new Response(JSON.stringify({ debtors: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // POST /debtors - Create debtor
  if (path === 'debtors' && req.method === 'POST') {
    const body = await req.json()
    
    const { data, error } = await supabase
      .from('debtors')
      .insert({
        ...body,
        user_id: userData.id
      })
      .select()
      .single()

    if (error) throw error

    // Create timeline event
    await supabase.from('timeline_events').insert({
      debtor_id: data.id,
      user_id: userData.id,
      event_type: 'note',
      title: 'Devedor cadastrado',
      description: `Devedor ${data.name} cadastrado no sistema`
    })

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // PUT /debtors/:id - Update debtor
  const updateMatch = path.match(/^debtors\/([^/]+)$/)
  if (updateMatch && req.method === 'PUT') {
    const debtorId = updateMatch[1]
    const body = await req.json()

    const { data, error } = await supabase
      .from('debtors')
      .update(body)
      .eq('id', debtorId)
      .eq('user_id', userData.id)
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // DELETE /debtors/:id - Delete debtor
  const deleteMatch = path.match(/^debtors\/([^/]+)$/)
  if (deleteMatch && req.method === 'DELETE') {
    const debtorId = deleteMatch[1]

    const { error } = await supabase
      .from('debtors')
      .delete()
      .eq('id', debtorId)
      .eq('user_id', userData.id)

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // GET /debtors/:id/timeline - Get timeline
  const timelineMatch = path.match(/^debtors\/([^/]+)\/timeline$/)
  if (timelineMatch && req.method === 'GET') {
    const debtorId = timelineMatch[1]

    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('debtor_id', debtorId)
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return new Response(JSON.stringify({ events: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // POST /debtors/:id/dispute - Open dispute
  const disputeMatch = path.match(/^debtors\/([^/]+)\/dispute$/)
  if (disputeMatch && req.method === 'POST') {
    const debtorId = disputeMatch[1]
    const { type, reason, description } = await req.json()

    // Create dispute
    const { data: dispute, error: disputeError } = await supabase
      .from('disputes')
      .insert({
        debtor_id: debtorId,
        user_id: userData.id,
        dispute_type: type,
        reason,
        description,
        opened_by: userData.user_name
      })
      .select()
      .single()

    if (disputeError) throw disputeError

    // Update debtor status
    await supabase
      .from('debtors')
      .update({ status: 'dispute' })
      .eq('id', debtorId)

    // Create timeline event
    await supabase.from('timeline_events').insert({
      debtor_id: debtorId,
      user_id: userData.id,
      event_type: 'dispute',
      title: 'Disputa aberta',
      description: `${reason}: ${description}`
    })

    return new Response(JSON.stringify(dispute), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ==================== ANALYTICS ROUTES ====================

async function handleAnalyticsRoutes(req: Request, path: string, supabase: any, userData: any) {
  if (path === 'analytics/dashboard' && req.method === 'GET') {
    // Get all debtors for this user
    const { data: debtors } = await supabase
      .from('debtors')
      .select('*')
      .eq('user_id', userData.id)

    // Calculate metrics
    const totalDebt = debtors?.reduce((sum: number, d: any) => sum + parseFloat(d.debt_amount), 0) || 0
    const totalDebtors = debtors?.length || 0
    const activeDebtors = debtors?.filter((d: any) => d.status === 'active').length || 0
    const overdueDebtors = debtors?.filter((d: any) => d.days_overdue > 0).length || 0
    
    // Recovery rate (mock for now)
    const recoveryRate = totalDebtors > 0 ? (activeDebtors / totalDebtors * 100).toFixed(1) : 0

    return new Response(JSON.stringify({
      totalDebt,
      totalDebtors,
      activeDebtors,
      overdueDebtors,
      recoveryRate,
      trend: 'up'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ==================== SETTINGS ROUTES ====================

async function handleSettingsRoutes(req: Request, path: string, supabase: any, userData: any) {
  if (path === 'settings' && req.method === 'GET') {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userData.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return new Response(JSON.stringify(data || {}), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (path === 'settings' && req.method === 'PUT') {
    const body = await req.json()

    const { data, error } = await supabase
      .from('settings')
      .upsert({
        user_id: userData.id,
        ...body
      })
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ==================== ACTIONS ROUTES ====================

async function handleActionsRoutes(req: Request, path: string, supabase: any, userData: any) {
  if (path === 'actions/execute' && req.method === 'POST') {
    const { debtorId, channel, message } = await req.json()

    // Create timeline event
    const { data, error } = await supabase
      .from('timeline_events')
      .insert({
        debtor_id: debtorId,
        user_id: userData.id,
        event_type: channel,
        channel,
        title: `Mensagem enviada via ${channel}`,
        description: message,
        status: 'completed'
      })
      .select()
      .single()

    if (error) throw error

    // Update last contact
    await supabase
      .from('debtors')
      .update({ last_contact: new Date().toISOString() })
      .eq('id', debtorId)

    return new Response(JSON.stringify({ success: true, event: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ==================== AI ROUTES ====================

async function handleAIRoutes(req: Request, path: string, supabase: any, userData: any) {
  if (path === 'ai/suggest-message' && req.method === 'POST') {
    const { debtorId, channel, tone } = await req.json()

    // Get debtor info
    const { data: debtor } = await supabase
      .from('debtors')
      .select('*')
      .eq('id', debtorId)
      .single()

    // Mock AI suggestion (you can integrate real AI later)
    let message = ''
    if (tone === 'friendly') {
      message = `Olá ${debtor.name}! Notamos que existe um valor em aberto de €${debtor.debt_amount}. Podemos ajudar com opções de pagamento?`
    } else if (tone === 'formal') {
      message = `Prezado(a) ${debtor.name}, informamos que consta em nosso sistema um débito no valor de €${debtor.debt_amount}. Solicitamos regularização.`
    } else {
      message = `${debtor.name}, você tem uma dívida de €${debtor.debt_amount} vencida há ${debtor.days_overdue} dias. Entre em contato urgentemente.`
    }

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (path === 'ai/best-contact-time' && req.method === 'POST') {
    // Mock response
    return new Response(JSON.stringify({
      bestTime: '14:00-16:00',
      confidence: 0.85,
      reasoning: 'Baseado em padrões históricos de resposta'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ==================== WEBAUTHN ROUTES ====================

async function handleWebAuthnRoutes(req: Request, path: string, supabase: any, user: any) {
  // WebAuthn implementation would go here
  // For now, return mock responses
  
  if (path === 'webauthn/register/options' && req.method === 'POST') {
    return new Response(JSON.stringify({
      challenge: 'mock-challenge-' + Date.now(),
      rp: { name: 'Tá Pago.PT', id: 'localhost' },
      user: { id: user.id, name: user.email, displayName: user.email }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (path === 'webauthn/register/verify' && req.method === 'POST') {
    return new Response(JSON.stringify({ verified: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (path === 'webauthn/login/options' && req.method === 'POST') {
    return new Response(JSON.stringify({
      challenge: 'mock-challenge-' + Date.now()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
```

### 5.3 - Deploy da Edge Function

No terminal local:

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Login no Supabase
supabase login

# Link ao projeto
supabase link --project-ref SEU_PROJECT_ID

# Deploy da função
supabase functions deploy make-server-12af7011
```

---

## 🔗 PASSO 6: Conectar ao Figma Make

### 6.1 - Obter credenciais

No Supabase Dashboard:
1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (exemplo: `https://xxxxx.supabase.co`)
   - **anon/public key**

### 6.2 - Atualizar arquivo de info

Você precisará criar o arquivo `/utils/supabase/info.ts`:

```typescript
export const projectId = 'SEU_PROJECT_ID'; // Apenas o ID, ex: 'abcdefgh'
export const publicAnonKey = 'SUA_ANON_KEY'; // A chave pública
```

---

## 📊 PASSO 7: Popular com Dados de Teste (Opcional)

Para testar rapidamente, cole no SQL Editor:

```sql
-- Criar usuário de teste (após signup manual)
-- Substitua 'SEU_AUTH_ID' pelo ID do auth.users após criar conta

INSERT INTO public.debtors (user_id, name, email, phone, document, document_type, debt_amount, original_amount, due_date, status, priority, score)
SELECT 
  u.id,
  'João Silva',
  'joao@example.com',
  '+351912345678',
  '12345678901',
  'nif',
  1500.00,
  2000.00,
  CURRENT_DATE - INTERVAL '30 days',
  'active',
  'high',
  75
FROM public.users u
WHERE u.email = 'SEU_EMAIL_DE_TESTE'
LIMIT 1;

INSERT INTO public.debtors (user_id, name, email, phone, document, document_type, debt_amount, original_amount, due_date, status, priority, score)
SELECT 
  u.id,
  'Maria Santos',
  'maria@example.com',
  '+351923456789',
  '98765432109',
  'nif',
  3200.00,
  3200.00,
  CURRENT_DATE - INTERVAL '15 days',
  'negotiating',
  'medium',
  60
FROM public.users u
WHERE u.email = 'SEU_EMAIL_DE_TESTE'
LIMIT 1;
```

---

## ✅ CHECKLIST FINAL

- [ ] Projeto Supabase criado
- [ ] Todas as tabelas criadas (8 tabelas)
- [ ] Triggers e funções criadas
- [ ] RLS policies ativadas
- [ ] Email Auth configurado
- [ ] Edge Function deployada
- [ ] Credenciais copiadas (Project ID + Anon Key)
- [ ] Arquivo `/utils/supabase/info.ts` atualizado
- [ ] Conta de teste criada
- [ ] Dados de teste inseridos (opcional)
- [ ] Frontend conectando com sucesso

---

## 🆘 Troubleshooting

### Erro: "relation does not exist"
- Verifique se executou todos os SQLs na ordem correta
- Confirme que está usando o schema `public`

### Erro: "JWT expired" ou "Invalid JWT"
- Refaça login no sistema
- Verifique se o anon key está correto

### Erro: "permission denied for table"
- Verifique as RLS policies
- Confirme que o usuário está autenticado

### Edge Function não responde
- Verifique os logs: `supabase functions logs make-server-12af7011`
- Confirme que fez deploy: `supabase functions list`

---

## 📞 Próximos Passos

Após completar este setup:

1. **Teste a autenticação**: Criar conta e fazer login
2. **Teste CRUD de devedores**: Criar, editar, deletar
3. **Teste importação**: Upload de CSV/Excel
4. **Configure integrações**: Cegid, Moloni (quando disponíveis)
5. **Personalize**: Ajuste conforme necessidades

---

**Versão**: 1.0  
**Última atualização**: {{ data_atual }}  
**Compatibilidade**: Supabase v2.x, PostgreSQL 15+

# 🚀 Setup Rápido - Tá Pago.PT

## ✅ PASSO 1: Credenciais Atualizadas
**Status**: ✅ COMPLETO

As credenciais do novo projeto já foram atualizadas no código!

---

## 📊 PASSO 2: Criar Estrutura do Banco de Dados

### Como executar os SQLs:

1. **Acesse o SQL Editor do Supabase**:
   - Vá para: https://supabase.com/dashboard/project/isbmsgkbghgbcatcwoos/sql/new
   
2. **Execute os SQLs na ORDEM abaixo** (copie e cole cada bloco):

---

### 🗂️ SQL #1 - Tabela `users`

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

CREATE INDEX idx_users_auth_id ON public.users(auth_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_plan_type ON public.users(plan_type);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = auth_id);
```

**Execute este SQL primeiro** ✅ e depois prossiga para o próximo.

---

### 🗂️ SQL #2 - Tabela `debtors`

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

CREATE INDEX idx_debtors_user_id ON public.debtors(user_id);
CREATE INDEX idx_debtors_status ON public.debtors(status);
CREATE INDEX idx_debtors_priority ON public.debtors(priority);
CREATE INDEX idx_debtors_due_date ON public.debtors(due_date);
CREATE INDEX idx_debtors_email ON public.debtors(email);
CREATE INDEX idx_debtors_document ON public.debtors(document);

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

### 🗂️ SQL #3 - Tabela `timeline_events`

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

CREATE INDEX idx_timeline_debtor_id ON public.timeline_events(debtor_id);
CREATE INDEX idx_timeline_user_id ON public.timeline_events(user_id);
CREATE INDEX idx_timeline_event_type ON public.timeline_events(event_type);
CREATE INDEX idx_timeline_created_at ON public.timeline_events(created_at DESC);

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

### 🗂️ SQL #4 - Tabela `payment_agreements`

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

CREATE INDEX idx_agreements_debtor_id ON public.payment_agreements(debtor_id);
CREATE INDEX idx_agreements_user_id ON public.payment_agreements(user_id);
CREATE INDEX idx_agreements_status ON public.payment_agreements(status);

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

### 🗂️ SQL #5 - Tabela `installments`

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

CREATE INDEX idx_installments_agreement ON public.installments(agreement_id);
CREATE INDEX idx_installments_status ON public.installments(status);
CREATE INDEX idx_installments_due_date ON public.installments(due_date);

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

### 🗂️ SQL #6 - Tabela `disputes`

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

CREATE INDEX idx_disputes_debtor_id ON public.disputes(debtor_id);
CREATE INDEX idx_disputes_user_id ON public.disputes(user_id);
CREATE INDEX idx_disputes_status ON public.disputes(status);

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

### 🗂️ SQL #7 - Tabela `settings`

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

CREATE INDEX idx_settings_user_id ON public.settings(user_id);

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

### 🗂️ SQL #8 - Tabela `webauthn_credentials`

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

CREATE INDEX idx_webauthn_user_id ON public.webauthn_credentials(user_id);
CREATE INDEX idx_webauthn_credential_id ON public.webauthn_credentials(credential_id);

ALTER TABLE public.webauthn_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credentials"
  ON public.webauthn_credentials FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own credentials"
  ON public.webauthn_credentials FOR ALL
  USING (user_id = auth.uid());
```

---

### 🗂️ SQL #9 - Triggers e Funções

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

### 🗂️ SQL #10 - Função para criar usuário após signup

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

### 🗂️ SQL #11 - Função para criar settings padrão

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

## ✅ CHECKLIST

Após executar TODOS os SQLs acima:

- [ ] SQL #1 - Tabela `users` ✅
- [ ] SQL #2 - Tabela `debtors` ✅
- [ ] SQL #3 - Tabela `timeline_events` ✅
- [ ] SQL #4 - Tabela `payment_agreements` ✅
- [ ] SQL #5 - Tabela `installments` ✅
- [ ] SQL #6 - Tabela `disputes` ✅
- [ ] SQL #7 - Tabela `settings` ✅
- [ ] SQL #8 - Tabela `webauthn_credentials` ✅
- [ ] SQL #9 - Triggers e funções ✅
- [ ] SQL #10 - Função handle_new_user ✅
- [ ] SQL #11 - Função create_default_settings ✅

---

## 🎯 PRÓXIMO PASSO

Depois de executar todos os SQLs, volte aqui e me avise que concluiu!

Vou então criar a **Edge Function** para completar o backend.

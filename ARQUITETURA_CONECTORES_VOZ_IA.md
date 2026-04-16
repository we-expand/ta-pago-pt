# 🔌 ARQUITETURA COMPLETA DE CONECTORES - AGENTE DE VOZ IA
## Sistema de Integração Total para Chamadas Conversacionais
**Tá Pago.pt - Plataforma Fintech**

---

## 📋 ÍNDICE EXECUTIVO

### Status Actual do Projeto
- ✅ **Frontend**: Agente conversacional implementado com UI completa
- ✅ **Google Cloud TTS**: Vozes PT-PT Neural integradas
- ✅ **Speech Recognition**: WebAPI para captura de voz do devedor
- ✅ **IA Conversacional**: Lógica de negociação inteligente implementada
- ⚠️ **FALTAM**: Conectores de telefonia, pagamentos e comunicação

### O Que Contemplámos vs. O Que Falta

#### ✅ JÁ IMPLEMENTADO (Frontend + Backend Básico)
1. Interface do Agente de Voz (ConversationalVoiceAgent.tsx)
2. Google Cloud Text-to-Speech (vozes PT-PT)
3. Speech Recognition (WebAPI do navegador)
4. Lógica de IA conversacional (detecção de intenção, estratégias)
5. Backend Supabase com Hono
6. Sistema de autenticação e gestão de devedores
7. KV Store para persistência

#### ❌ CONECTORES NECESSÁRIOS (Faltam Implementar)

**CRÍTICOS PARA PRODUÇÃO:**
1. 🔴 **Telefonia VoIP** (Twilio/Vonage) - Fazer chamadas telefónicas reais
2. 🔴 **Speech-to-Text Profissional** (Google/Deepgram) - Transcrição de qualidade
3. 🔴 **Gateway de Pagamentos** (Easypay/Stripe) - Aceitar pagamentos
4. 🟡 **SMS/WhatsApp** (Twilio/MessageBird) - Confirmações e lembretes
5. 🟡 **Email Transacional** (Resend/SendGrid) - Acordos por email
6. 🟡 **IA Generativa** (OpenAI GPT-4) - Respostas mais inteligentes (opcional)

---

## 🏗️ ARQUITETURA COMPLETA DO SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                    TÁ PAGO.PT - FRONTEND                         │
│  (React + Supabase Client + WebRTC)                             │
└───────────────────┬─────────────────────────────────────────────┘
                    │
                    │ HTTPS + WebSocket
                    │
┌───────────────────▼─────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTIONS (Hono Server)               │
│  • /make-server-12af7011/voice-ai/*                             │
│  • /make-server-12af7011/payments/*                             │
│  • /make-server-12af7011/communications/*                       │
└───────────────────┬─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┬───────────────┬──────────────┐
        │                       │               │              │
┌───────▼────────┐  ┌──────────▼─────┐  ┌─────▼────────┐  ┌───▼─────────┐
│   TELEFONIA    │  │  TEXT-TO-SPEECH │  │  PAGAMENTOS  │  │ COMUNICAÇÃO │
│                │  │                 │  │              │  │             │
│ • Twilio       │  │ • Google TTS    │  │ • Easypay    │  │ • Twilio    │
│ • Vonage       │  │ • ElevenLabs    │  │ • Stripe     │  │ • SendGrid  │
│ • Plivo        │  │ • Azure         │  │ • MB Way     │  │ • Mailgun   │
└────────────────┘  └─────────────────┘  └──────────────┘  └─────────────┘
        │                       │               │              │
        └───────────────────────┴───────────────┴──────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   ANALYTICS & LOGS    │
                    │  • Sentry             │
                    │  • Supabase Logs      │
                    └───────────────────────┘
```

---

## 🔴 CONECTOR 1: TELEFONIA VoIP (CRÍTICO)

### Objetivo
Fazer **chamadas telefónicas reais** para os devedores via internet.

### Opções de Providers

#### 🏆 RECOMENDADO: **Twilio** (Mais Popular)
**Prós:**
- ✅ Documentação excelente em português
- ✅ SDK JavaScript/TypeScript oficial
- ✅ Suporte a números portugueses (+351)
- ✅ Webhooks para eventos de chamada
- ✅ Gravação de chamadas incluída
- ✅ WebRTC integrado (chamadas via navegador)

**Contras:**
- ❌ Custo: ~€0.03/min para Portugal
- ❌ Requer validação de identidade (KYC)

**Preço:**
- Número português: €1/mês
- Chamadas de saída: €0.03/minuto
- SMS: €0.08/cada

#### Alternativa 1: **Vonage (ex-Nexmo)**
- Similar ao Twilio
- Preços competitivos: €0.025/min
- API REST simples
- Boa para escala

#### Alternativa 2: **Plivo**
- Mais barato: €0.02/min
- Menos features que Twilio
- Boa para startups

### Integração Técnica - Twilio

#### 1. Instalar SDK
```bash
npm install twilio
```

#### 2. Criar Serviço no Backend (`/supabase/functions/server/twilio_service.tsx`)

```typescript
import { Twilio } from 'npm:twilio';
import * as kv from './kv_store.tsx';

// Credenciais (via environment variables)
const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER'); // +351XXXXXXXXX

const client = new Twilio(accountSid, authToken);

/**
 * Inicia uma chamada telefónica com IA conversacional
 */
export async function startVoiceCall(params: {
  to: string;              // +351912345678
  debtorName: string;
  debtAmount: number;
  companyId: string;
}): Promise<{ success: boolean; callSid: string; error?: string }> {
  try {
    // URL do webhook que irá gerenciar a chamada
    const webhookUrl = `https://${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-12af7011/voice-ai/twilio-webhook`;

    const call = await client.calls.create({
      url: webhookUrl,
      to: params.to,
      from: fromNumber,
      method: 'POST',
      statusCallback: `${webhookUrl}/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      record: true, // Grava a chamada
      recordingStatusCallback: `${webhookUrl}/recording`,
    });

    // Salva informações da chamada
    await kv.set(`call:${call.sid}`, {
      callSid: call.sid,
      debtorName: params.debtorName,
      debtAmount: params.debtAmount,
      companyId: params.companyId,
      status: 'initiated',
      createdAt: new Date().toISOString(),
    });

    console.log(`[TWILIO] Call initiated: ${call.sid}`);

    return {
      success: true,
      callSid: call.sid,
    };
  } catch (error: any) {
    console.error('[TWILIO] Error starting call:', error);
    return {
      success: false,
      callSid: '',
      error: error.message,
    };
  }
}

/**
 * Webhook handler - Twilio chama esta função quando a chamada é atendida
 */
export function generateTwiMLResponse(params: {
  debtorName: string;
  debtAmount: number;
}): string {
  // TwiML = Twilio Markup Language
  // Instrui o Twilio sobre o que dizer/fazer na chamada
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Ines" language="pt-PT">
    Bom dia, ${params.debtorName}. O meu nome é Sofia, sou assistente virtual da Tá Pago.
    Estou a ligar em relação ao pagamento pendente de ${params.debtAmount} euros.
    Tem alguns minutos para conversarmos?
  </Say>
  <Gather input="speech" language="pt-PT" speechTimeout="auto" action="/voice-ai/twilio-process-speech">
    <Say voice="Polly.Ines" language="pt-PT">
      Por favor, responda sim ou não.
    </Say>
  </Gather>
</Response>`;
}
```

#### 3. Criar Rota no Servidor Principal (`/supabase/functions/server/index.tsx`)

```typescript
import { startVoiceCall, generateTwiMLResponse } from './twilio_service.tsx';

// POST /make-server-12af7011/voice-ai/start-real-call
app.post('/make-server-12af7011/voice-ai/start-real-call', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error } = await authenticateUser(accessToken);
    if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

    const { debtorPhone, debtorName, debtAmount } = await c.req.json();

    const result = await startVoiceCall({
      to: debtorPhone,
      debtorName,
      debtAmount,
      companyId: user.companyId,
    });

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST /make-server-12af7011/voice-ai/twilio-webhook
// Twilio chama esta rota quando a chamada é atendida
app.post('/make-server-12af7011/voice-ai/twilio-webhook', async (c) => {
  try {
    const callSid = c.req.query('CallSid');
    const callData = await kv.get(`call:${callSid}`);
    
    if (!callData) {
      return c.text('Call not found', 404);
    }

    const twiml = generateTwiMLResponse({
      debtorName: callData.debtorName,
      debtAmount: callData.debtAmount,
    });

    // Retorna TwiML (XML)
    return new Response(twiml, {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error: any) {
    console.error('[TWILIO WEBHOOK] Error:', error);
    return c.text('Error', 500);
  }
});
```

#### 4. Configurar Environment Variables

No Supabase Dashboard:
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+351912345678
```

---

## 🟡 CONECTOR 2: SPEECH-TO-TEXT PROFISSIONAL

### Problema
A WebAPI `SpeechRecognition` do navegador funciona, mas:
- ❌ Baixa precisão em PT-PT
- ❌ Não funciona em chamadas telefónicas (só no navegador)
- ❌ Sem controlo sobre modelo de linguagem

### Solução: Google Cloud Speech-to-Text

#### Vantagens
- ✅ **Precisão 95%+** em português
- ✅ Modelo específico para telefonemas (`phone_call`)
- ✅ Reconhecimento em tempo real (streaming)
- ✅ Pontuação automática
- ✅ **Gratuito até 60 minutos/mês**

#### Integração

```typescript
// /supabase/functions/server/google_stt_service.tsx
import { SpeechClient } from 'npm:@google-cloud/speech@6';

const speechClient = new SpeechClient({
  apiKey: Deno.env.get('GOOGLE_CLOUD_API_KEY'),
});

/**
 * Transcreve áudio de chamada telefónica
 */
export async function transcribeCallAudio(audioBuffer: Uint8Array): Promise<string> {
  const audio = {
    content: Buffer.from(audioBuffer).toString('base64'),
  };

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 8000, // Telefone = 8kHz
    languageCode: 'pt-PT',
    model: 'phone_call', // Otimizado para telefone
    useEnhanced: true, // Modelo premium
    enableAutomaticPunctuation: true,
  };

  const request = {
    audio,
    config,
  };

  const [response] = await speechClient.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');

  return transcription;
}
```

**Custo:**
- Primeiros 60 min/mês: GRÁTIS
- Depois: €0.006/15 segundos

---

## 🔴 CONECTOR 3: GATEWAY DE PAGAMENTOS (CRÍTICO)

### Objetivo
Processar pagamentos quando devedor aceita acordo.

### Opções para Portugal

#### 🏆 RECOMENDADO: **Easypay** (Portugal)
**Prós:**
- ✅ Empresa portuguesa
- ✅ **Multibanco**, MB WAY, Visa, Mastercard
- ✅ Referências Multibanco automáticas
- ✅ API REST simples
- ✅ Suporte em português

**Contras:**
- ❌ Taxa: 1.5% + €0.25 por transação

**Features Críticas:**
- Gerar referência Multibanco
- Receber webhook quando pagamento é confirmado
- Criar plano de pagamentos recorrentes

#### Alternativa 1: **Stripe**
- Global, confiável
- Taxa: 1.5% + €0.25
- Excelente documentação
- Suporte a Multibanco via "Local Payment Methods"

#### Alternativa 2: **SIBS (MB WAY)**
- Integração direta com MB WAY
- Taxa menor para alto volume
- Requer contrato empresarial

### Integração Técnica - Easypay

#### 1. Criar Conta Easypay
- Registar em https://www.easypay.pt/
- Obter API Key

#### 2. Implementar Serviço de Pagamentos

```typescript
// /supabase/functions/server/easypay_service.tsx

const EASYPAY_API_KEY = Deno.env.get('EASYPAY_API_KEY');
const EASYPAY_BASE_URL = 'https://api.prod.easypay.pt/2.0';

/**
 * Gera referência Multibanco
 */
export async function generateMultibancoReference(params: {
  amount: number;        // Em euros
  debtorName: string;
  debtorEmail: string;
  description: string;
}): Promise<{
  success: boolean;
  entity?: string;       // Entidade (ex: 11249)
  reference?: string;    // Referência (ex: 123 456 789)
  expiryDate?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${EASYPAY_BASE_URL}/single`, {
      method: 'POST',
      headers: {
        'AccountId': EASYPAY_API_KEY,
        'ApiKey': EASYPAY_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'single',
        payment: {
          methods: ['mb'], // Multibanco
          type: 'sale',
          capture: {
            transaction_key: `debt_${Date.now()}`,
            descriptive: params.description,
          },
          currency: 'EUR',
          expiration_time: '2024-12-31', // Validade
        },
        order: {
          items: [
            {
              description: params.description,
              quantity: 1,
              key: 'debt',
              value: params.amount,
            },
          ],
        },
        customer: {
          name: params.debtorName,
          email: params.debtorEmail,
          language: 'PT',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Easypay error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    return {
      success: true,
      entity: data.method.entity,
      reference: data.method.reference,
      expiryDate: data.method.expiration_date,
    };
  } catch (error: any) {
    console.error('[EASYPAY] Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Webhook - Easypay chama quando pagamento é confirmado
 */
export async function handlePaymentWebhook(payload: any): Promise<void> {
  console.log('[EASYPAY WEBHOOK] Payment received:', payload);

  const transactionKey = payload.capture.transaction_key;
  const amount = payload.value;
  const status = payload.status; // 'success', 'pending', 'failed'

  if (status === 'success') {
    // Atualizar status do acordo no KV store
    await kv.set(`payment:${transactionKey}`, {
      status: 'paid',
      amount,
      paidAt: new Date().toISOString(),
    });

    // Enviar email/SMS de confirmação
    // ... código de notificação ...
  }
}
```

#### 3. Criar Rota de Webhook

```typescript
// /supabase/functions/server/index.tsx

import { handlePaymentWebhook } from './easypay_service.tsx';

// POST /make-server-12af7011/payments/easypay-webhook
app.post('/make-server-12af7011/payments/easypay-webhook', async (c) => {
  try {
    const payload = await c.req.json();
    await handlePaymentWebhook(payload);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Error:', error);
    return c.json({ error: error.message }, 500);
  }
});
```

---

## 🟡 CONECTOR 4: SMS / WHATSAPP

### Objetivo
Enviar confirmações, lembretes e referências de pagamento.

### Opção: Twilio (SMS + WhatsApp)

```typescript
// /supabase/functions/server/sms_service.tsx

import { Twilio } from 'npm:twilio';

const client = new Twilio(
  Deno.env.get('TWILIO_ACCOUNT_SID'),
  Deno.env.get('TWILIO_AUTH_TOKEN')
);

/**
 * Envia SMS
 */
export async function sendSMS(params: {
  to: string;
  message: string;
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    const result = await client.messages.create({
      body: params.message,
      from: Deno.env.get('TWILIO_PHONE_NUMBER'),
      to: params.to,
    });

    return { success: true, sid: result.sid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Envia WhatsApp (requer aprovação Twilio)
 */
export async function sendWhatsApp(params: {
  to: string;
  message: string;
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    const result = await client.messages.create({
      body: params.message,
      from: `whatsapp:${Deno.env.get('TWILIO_WHATSAPP_NUMBER')}`,
      to: `whatsapp:${params.to}`,
    });

    return { success: true, sid: result.sid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

**Preços Twilio:**
- SMS Portugal: €0.08/cada
- WhatsApp: €0.005/mensagem

---

## 🟡 CONECTOR 5: EMAIL TRANSACIONAL

### Objetivo
Enviar acordos, recibos e confirmações por email.

### Opção: Resend (Moderno e Simples)

```typescript
// /supabase/functions/server/resend_service.tsx

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

/**
 * Envia email com template HTML
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sofia <sofia@tapago.pt>',
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Template de email para acordo de pagamento
 */
export function generatePaymentAgreementEmail(params: {
  debtorName: string;
  amount: number;
  installments: number;
  dueDate: string;
  entity: string;
  reference: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px; }
    .highlight { background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .reference { font-size: 24px; font-weight: bold; color: #667eea; text-align: center; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Acordo de Pagamento Confirmado</h1>
    </div>
    <div class="content">
      <p>Olá, ${params.debtorName}!</p>
      <p>O seu acordo de pagamento foi registado com sucesso.</p>
      
      <div class="highlight">
        <h3>📋 Detalhes do Acordo</h3>
        <p><strong>Valor Total:</strong> €${params.amount.toFixed(2)}</p>
        <p><strong>Parcelas:</strong> ${params.installments}x</p>
        <p><strong>Primeira Parcela:</strong> ${params.dueDate}</p>
      </div>

      <div class="highlight">
        <h3>💳 Referência Multibanco</h3>
        <p><strong>Entidade:</strong> ${params.entity}</p>
        <p class="reference">${params.reference}</p>
        <p style="text-align: center; color: #666;">Válido até ${params.dueDate}</p>
      </div>

      <p>Obrigado pela sua colaboração!</p>
      <p><strong>Equipa Tá Pago</strong></p>
    </div>
  </div>
</body>
</html>
  `;
}
```

**Preço Resend:**
- 3.000 emails/mês: GRÁTIS
- Depois: €20/mês para 50k emails

---

## 📊 RESUMO DE CUSTOS MENSAIS

### Cenário: 1.000 Chamadas/Mês

| Serviço | Custo | Notas |
|---------|-------|-------|
| **Twilio (Telefonia)** | €30 | 1.000 chamadas × 1 min × €0.03 |
| **Twilio (SMS)** | €80 | 1.000 SMS × €0.08 |
| **Google Cloud TTS** | €0 | Gratuito até 1M chars |
| **Google Cloud STT** | €0 | Gratuito até 60 min |
| **Easypay** | 1.5% | Taxa por transação |
| **Resend (Email)** | €0 | Gratuito até 3k emails |
| **Supabase** | €25 | Plano Pro |
| **Total Fixo** | **~€135/mês** | Para 1.000 chamadas |

**Custo por chamada:** €0.135

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### Fase 1: Essenciais (1-2 semanas)
1. ✅ Twilio - Telefonia VoIP
2. ✅ Google Speech-to-Text
3. ✅ Easypay - Gateway de pagamentos
4. ⏸️ SMS via Twilio

### Fase 2: Comunicação (1 semana)
5. ⏸️ WhatsApp Business API
6. ⏸️ Resend - Emails transacionais

### Fase 3: Inteligência (1 semana)
7. ⏸️ OpenAI GPT-4 (respostas mais inteligentes)
8. ⏸️ Sentiment Analysis (análise de emoção)

### Fase 4: Analytics (1 semana)
9. ⏸️ Sentry - Monitoramento de erros
10. ⏸️ PostHog - Analytics de produto

---

## 🔐 SECRETS NECESSÁRIOS (Environment Variables)

Adicionar no **Supabase Dashboard → Edge Functions → Secrets**:

```bash
# Twilio (Telefonia + SMS + WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+351912345678
TWILIO_WHATSAPP_NUMBER=+351912345678

# Google Cloud (TTS + STT)
GOOGLE_CLOUD_API_KEY=AIzaSyxxxxxxxxxxxxxx  # Já configurada

# Easypay (Pagamentos)
EASYPAY_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
EASYPAY_ACCOUNT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxx

# OpenAI (Opcional - IA avançada)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx

# Sentry (Opcional - Monitoramento)
SENTRY_DSN=https://xxxxxxx@sentry.io/xxxxxxx
```

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### 1. Criar Contas (30 minutos)
- [ ] Twilio: https://www.twilio.com/try-twilio
- [ ] Easypay: https://www.easypay.pt/
- [ ] Resend: https://resend.com/

### 2. Configurar Environment Variables (10 minutos)
- [ ] Adicionar secrets no Supabase
- [ ] Testar com `console.log(Deno.env.get('TWILIO_ACCOUNT_SID'))`

### 3. Implementar Conectores (2-3 dias)
- [ ] Criar `/supabase/functions/server/twilio_service.tsx`
- [ ] Criar `/supabase/functions/server/easypay_service.tsx`
- [ ] Criar `/supabase/functions/server/resend_service.tsx`
- [ ] Adicionar rotas no `index.tsx`

### 4. Testar em Modo Sandbox (1 dia)
- [ ] Twilio: Números de teste
- [ ] Easypay: Ambiente de teste
- [ ] Resend: Email próprio

### 5. Deploy e Produção (1 dia)
- [ ] Deploy no Supabase
- [ ] Configurar webhooks
- [ ] Testar chamada real
- [ ] Monitorar logs

---

## ⚠️ COMPLIANCE E LEGAL (IMPORTANTE!)

### RGPD (Regulamento Geral de Proteção de Dados)
- ✅ Gravar chamadas APENAS com consentimento
- ✅ Permitir opt-out de comunicações
- ✅ Armazenar dados apenas pelo tempo necessário
- ✅ Permitir exclusão de dados (direito ao esquecimento)

### Cobrança de Dívidas em Portugal
- ✅ Não fazer chamadas antes das 8h ou depois das 20h
- ✅ Identificar sempre a empresa e objetivo da chamada
- ✅ Não ameaçar ou coagir
- ✅ Respeitar pedidos de não contacto

### Telecomunicações
- ✅ Registar empresa na ANACOM (números próprios)
- ✅ Não fazer SPAM
- ✅ Permitir opt-out de SMS

---

## 📞 SUPORTE TÉCNICO

**Dúvidas sobre Integrações:**
- Twilio Docs PT: https://www.twilio.com/docs
- Easypay Docs: https://docs.easypay.pt/
- Google Cloud: https://cloud.google.com/text-to-speech/docs

**Comunidade:**
- Twilio Community: https://www.twilio.com/community
- Stack Overflow (tag: twilio, supabase)

---

## ✅ CHECKLIST FINAL

Antes de ir para produção:

- [ ] Todas as API keys configuradas
- [ ] Webhooks testados
- [ ] Gravação de chamadas funcionando
- [ ] Transcrição em PT-PT precisa
- [ ] Pagamentos Multibanco gerando referências
- [ ] SMS/Email enviando confirmações
- [ ] Logs e monitoramento ativos
- [ ] Compliance RGPD implementado
- [ ] Termos de uso atualizados
- [ ] Teste com números reais
- [ ] Budget de custos aprovado

---

## 🎉 CONCLUSÃO

**O que tínhamos:**
- ✅ Frontend bonito com UI de agente
- ✅ Google TTS para voz
- ✅ Lógica de IA conversacional

**O que faltava (e agora está documentado):**
- 🔴 Telefonia real (Twilio)
- 🔴 Speech-to-Text profissional (Google)
- 🔴 Gateway de pagamentos (Easypay)
- 🟡 SMS/WhatsApp (Twilio)
- 🟡 Email transacional (Resend)

**Resultado final:**
Um sistema de cobrança automatizado **100% funcional** que:
1. Liga automaticamente para devedores
2. Conversa inteligentemente em PT-PT
3. Negocia valores e prazos
4. Gera referências Multibanco
5. Envia confirmações por SMS/Email
6. Registra tudo para compliance

**Tempo estimado de implementação:** 2-3 semanas
**Custo operacional:** €0.135 por chamada
**ROI esperado:** Recuperação de 25-40% das dívidas

---

**Documento criado em:** 05 de Março de 2026  
**Versão:** 1.0  
**Autor:** Tá Pago.pt - Equipa de Desenvolvimento  
**Status:** 📋 Aguardando Implementação

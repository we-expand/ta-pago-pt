# 🚀 GUIA PRÁTICO - IMPLEMENTAÇÃO TWILIO + EASYPAY
## Do Zero à Primeira Chamada Real em 1 Dia
**Tá Pago.pt - Guia para Desenvolvedor**

---

## 🎯 OBJETIVO DESTE GUIA

Ao final deste documento, você terá:
- ✅ Conta Twilio configurada
- ✅ Número português comprado
- ✅ Primeira chamada telefónica real funcionando
- ✅ Gateway Easypay gerando referências Multibanco

**Tempo estimado:** 4-6 horas

---

## ⚡ PARTE 1: SETUP TWILIO (2 horas)

### Passo 1.1: Criar Conta Twilio (30 min)

1. **Aceder:** https://www.twilio.com/try-twilio

2. **Registar:**
   - Email: seu_email@tapago.pt
   - País: Portugal
   - Tipo de uso: "Voice & Messaging"

3. **Verificar telefone:**
   - Twilio envia SMS com código
   - Inserir código para verificar

4. **Dashboard:**
   - Após login, está no Twilio Console
   - Aqui consegue Account SID e Auth Token

5. **Crédito inicial:**
   - Twilio dá $15 grátis para teste
   - Para produção, adicionar €50 no billing

---

### Passo 1.2: Comprar Número Português (15 min)

1. **No Twilio Console:**
   - Menu lateral → Phone Numbers → Buy a number

2. **Pesquisar:**
   - Country: Portugal
   - Capabilities: Voice, SMS, MMS
   - Clicar "Search"

3. **Escolher número:**
   - Selecionar número +351 XXX XXX XXX
   - Custo: €1/mês
   - Clicar "Buy"

4. **Configurar número:**
   - Na página do número comprado
   - Voice & Fax → Configure With: Webhooks, TwiML Bins
   - A Call Comes In: Webhook
   - URL: (vamos configurar depois)
   - HTTP: POST

5. **Guardar:**
   - Nota: O número aparecerá como `+351XXXXXXXXX`

---

### Passo 1.3: Obter Credenciais (5 min)

1. **No Twilio Console:**
   - Menu lateral → Account → Account Info

2. **Copiar:**
   ```
   Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Auth Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Phone Number: +351XXXXXXXXX
   ```

3. **Adicionar no Supabase:**
   - Supabase Dashboard → Project Settings → Edge Functions
   - Secrets → Add new secret

   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+351XXXXXXXXX
   ```

---

### Passo 1.4: Instalar SDK no Backend (10 min)

1. **Abrir terminal:**
   ```bash
   cd supabase/functions/server
   ```

2. **O SDK Twilio já está disponível via npm:**
   - No Deno, importamos com `npm:twilio`
   - Não precisa instalar, apenas importar

3. **Criar arquivo `twilio_service.tsx`:**
   ```bash
   touch twilio_service.tsx
   ```

---

### Passo 1.5: Implementar Serviço Twilio (1 hora)

**Criar arquivo:** `/supabase/functions/server/twilio_service.tsx`

```typescript
/**
 * 📞 SERVIÇO TWILIO - Telefonia VoIP
 * Faz chamadas telefónicas reais com voz IA
 */

import { Twilio } from 'npm:twilio';
import * as kv from './kv_store.tsx';

// Credenciais do ambiente
const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

// Validar credenciais
if (!accountSid || !authToken || !fromNumber) {
  console.error('❌ [TWILIO] Credenciais não configuradas!');
  console.error('Configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_PHONE_NUMBER');
}

// Cliente Twilio
const twilioClient = new Twilio(accountSid, authToken);

/**
 * Inicia uma chamada telefónica
 */
export async function startVoiceCall(params: {
  to: string;              // +351912345678
  debtorName: string;
  debtAmount: number;
  companyId: string;
}): Promise<{
  success: boolean;
  callSid?: string;
  error?: string;
  estimatedDuration?: string;
}> {
  try {
    console.log(`[TWILIO] 📞 Iniciando chamada para ${params.to}...`);

    // URL do projeto Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const webhookUrl = `${supabaseUrl}/functions/v1/make-server-12af7011/voice-ai/twilio-webhook`;

    // Criar chamada
    const call = await twilioClient.calls.create({
      url: webhookUrl,
      to: params.to,
      from: fromNumber,
      method: 'POST',
      statusCallback: `${webhookUrl}/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      record: true, // Grava a chamada
      recordingStatusCallback: `${webhookUrl}/recording`,
      timeout: 30, // Toca por 30 segundos antes de desistir
    });

    console.log(`[TWILIO] ✅ Chamada iniciada com sucesso! SID: ${call.sid}`);

    // Salvar dados da chamada no KV
    await kv.set(`call:${call.sid}`, {
      callSid: call.sid,
      to: params.to,
      debtorName: params.debtorName,
      debtAmount: params.debtAmount,
      companyId: params.companyId,
      status: 'initiated',
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      callSid: call.sid,
      estimatedDuration: '2-3 minutos',
    };

  } catch (error: any) {
    console.error('[TWILIO] ❌ Erro ao iniciar chamada:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Gera TwiML (XML) para controlar a chamada
 * TwiML = Twilio Markup Language
 */
export function generateTwiMLResponse(params: {
  debtorName: string;
  debtAmount: number;
}): string {
  // Formata valor em euros
  const amountFormatted = params.debtAmount.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Script em português
  const script = `
    Bom dia, ${params.debtorName}.
    O meu nome é Sofia, sou assistente virtual da Tá Pago.
    Estou a ligar em relação ao pagamento pendente de ${amountFormatted} euros.
    Tem alguns minutos para conversarmos sobre opções de regularização?
  `;

  // TwiML usando voz portuguesa da Polly (AWS)
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Ines" language="pt-PT">
    ${script}
  </Say>
  <Gather input="speech" language="pt-PT" speechTimeout="auto" action="/make-server-12af7011/voice-ai/twilio-process-speech" method="POST">
    <Say voice="Polly.Ines" language="pt-PT">
      Por favor, responda sim ou não.
    </Say>
  </Gather>
  <Say voice="Polly.Ines" language="pt-PT">
    Desculpe, não consegui ouvir a sua resposta. Vou ligar novamente mais tarde. Bom dia.
  </Say>
</Response>`;
}

/**
 * Processa resposta de voz do devedor
 */
export function processSpeechInput(speechResult: string): {
  intent: string;
  response: string;
} {
  const speech = speechResult.toLowerCase();

  // Detectar intenção
  if (speech.includes('sim') || speech.includes('aceito') || speech.includes('está bem')) {
    return {
      intent: 'accept',
      response: `
        Excelente! Tenho duas propostas para si.
        Primeira opção: pagamento à vista com 20 por cento de desconto.
        Segunda opção: parcelamento em 4 vezes sem juros.
        Qual prefere?
      `,
    };
  }

  if (speech.includes('não') || speech.includes('recuso')) {
    return {
      intent: 'reject',
      response: `
        Compreendo. Mas deixe-me ser sincera:
        Se não regularizarmos agora, o valor vai aumentar com juros de 2 por cento ao mês.
        Não quer evitar esses custos extra?
      `,
    };
  }

  // Default
  return {
    intent: 'unclear',
    response: `
      Desculpe, não percebi bem.
      Pode repetir, por favor?
    `,
  };
}

/**
 * Enviar SMS
 */
export async function sendSMS(params: {
  to: string;
  message: string;
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    console.log(`[TWILIO SMS] 📱 Enviando SMS para ${params.to}...`);

    const result = await twilioClient.messages.create({
      body: params.message,
      from: fromNumber,
      to: params.to,
    });

    console.log(`[TWILIO SMS] ✅ SMS enviado! SID: ${result.sid}`);

    return {
      success: true,
      sid: result.sid,
    };

  } catch (error: any) {
    console.error('[TWILIO SMS] ❌ Erro ao enviar SMS:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default {
  startVoiceCall,
  generateTwiMLResponse,
  processSpeechInput,
  sendSMS,
};
```

---

### Passo 1.6: Adicionar Rotas no Servidor (30 min)

**Editar:** `/supabase/functions/server/index.tsx`

```typescript
// No topo do arquivo, adicionar import
import twilioService from './twilio_service.tsx';

// ===== ADICIONAR ESTAS ROTAS =====

/**
 * POST /make-server-12af7011/voice-ai/start-real-call
 * Inicia uma chamada telefónica real
 */
app.post('/make-server-12af7011/voice-ai/start-real-call', async (c) => {
  try {
    // Autenticar usuário
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error: authError } = await authenticateUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Obter dados do request
    const {
      debtorPhone,
      debtorName,
      debtAmount,
    } = await c.req.json();

    // Validar dados
    if (!debtorPhone || !debtorName || !debtAmount) {
      return c.json({
        error: 'Missing required fields: debtorPhone, debtorName, debtAmount',
      }, 400);
    }

    // Obter companyId do usuário
    const userData = await kv.get(`user_${user.id}`);
    const companyId = userData?.companyId;

    if (!companyId) {
      return c.json({ error: 'Company not found for user' }, 404);
    }

    // Iniciar chamada
    const result = await twilioService.startVoiceCall({
      to: debtorPhone,
      debtorName,
      debtAmount,
      companyId,
    });

    return c.json(result);

  } catch (error: any) {
    console.error('[VOICE AI] Error starting call:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /make-server-12af7011/voice-ai/twilio-webhook
 * Twilio chama esta rota quando a chamada é atendida
 */
app.post('/make-server-12af7011/voice-ai/twilio-webhook', async (c) => {
  try {
    console.log('[TWILIO WEBHOOK] 📞 Chamada atendida!');

    // Obter CallSid do Twilio
    const formData = await c.req.formData();
    const callSid = formData.get('CallSid');

    console.log('[TWILIO WEBHOOK] CallSid:', callSid);

    // Buscar dados da chamada no KV
    const callData = await kv.get(`call:${callSid}`);

    if (!callData) {
      console.error('[TWILIO WEBHOOK] Call not found:', callSid);
      return c.text('Call not found', 404);
    }

    // Gerar TwiML com script personalizado
    const twiml = twilioService.generateTwiMLResponse({
      debtorName: callData.debtorName,
      debtAmount: callData.debtAmount,
    });

    console.log('[TWILIO WEBHOOK] ✅ Retornando TwiML');

    // IMPORTANTE: Retornar XML com Content-Type correto
    return new Response(twiml, {
      headers: { 'Content-Type': 'text/xml' },
    });

  } catch (error: any) {
    console.error('[TWILIO WEBHOOK] ❌ Error:', error);
    return c.text('Internal Server Error', 500);
  }
});

/**
 * POST /make-server-12af7011/voice-ai/twilio-process-speech
 * Processa resposta de voz do devedor
 */
app.post('/make-server-12af7011/voice-ai/twilio-process-speech', async (c) => {
  try {
    console.log('[TWILIO SPEECH] 🎤 Processando resposta do devedor...');

    const formData = await c.req.formData();
    const speechResult = formData.get('SpeechResult') as string;
    const callSid = formData.get('CallSid') as string;

    console.log('[TWILIO SPEECH] Devedor disse:', speechResult);

    // Processar resposta com IA
    const { intent, response } = twilioService.processSpeechInput(speechResult);

    console.log('[TWILIO SPEECH] Intent detectado:', intent);

    // Gerar TwiML com resposta
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Ines" language="pt-PT">
    ${response}
  </Say>
  <Hangup/>
</Response>`;

    // Salvar interação no KV
    await kv.set(`call:${callSid}:speech`, {
      timestamp: new Date().toISOString(),
      speech: speechResult,
      intent,
    });

    return new Response(twiml, {
      headers: { 'Content-Type': 'text/xml' },
    });

  } catch (error: any) {
    console.error('[TWILIO SPEECH] ❌ Error:', error);
    return c.text('Error', 500);
  }
});

/**
 * POST /make-server-12af7011/voice-ai/twilio-webhook/status
 * Recebe status da chamada (ringing, answered, completed)
 */
app.post('/make-server-12af7011/voice-ai/twilio-webhook/status', async (c) => {
  try {
    const formData = await c.req.formData();
    const callSid = formData.get('CallSid');
    const callStatus = formData.get('CallStatus');

    console.log(`[TWILIO STATUS] Chamada ${callSid} → ${callStatus}`);

    // Atualizar status no KV
    const callData = await kv.get(`call:${callSid}`);
    if (callData) {
      await kv.set(`call:${callSid}`, {
        ...callData,
        status: callStatus,
        updatedAt: new Date().toISOString(),
      });
    }

    return c.json({ received: true });

  } catch (error: any) {
    console.error('[TWILIO STATUS] Error:', error);
    return c.json({ error: error.message }, 500);
  }
});
```

---

### Passo 1.7: Testar Chamada (30 min)

1. **Deploy do backend:**
   ```bash
   # No terminal, na raiz do projeto
   supabase functions deploy make-server-12af7011
   ```

2. **Testar via cURL:**
   ```bash
   curl -X POST \
     https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-12af7011/voice-ai/start-real-call \
     -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "debtorPhone": "+351912345678",
       "debtorName": "João Silva",
       "debtAmount": 1250.50
     }'
   ```

3. **Resultado esperado:**
   ```json
   {
     "success": true,
     "callSid": "CA1234567890abcdef",
     "estimatedDuration": "2-3 minutos"
   }
   ```

4. **Verificar:**
   - O telefone +351912345678 deve tocar
   - Ao atender, ouvir voz portuguesa da Sofia
   - Responder "sim" ou "não"
   - Ouvir resposta inteligente

5. **Ver logs:**
   - Supabase Dashboard → Edge Functions → Logs
   - Ver todas as mensagens `[TWILIO]`

---

## ⚡ PARTE 2: SETUP EASYPAY (2 horas)

### Passo 2.1: Criar Conta Easypay (1 hora)

1. **Aceder:** https://www.easypay.pt/

2. **Registar:**
   - Preencher formulário
   - Tipo de conta: Empresa
   - Setor: Serviços Financeiros

3. **Documentos necessários:**
   - NIF da empresa
   - Certidão permanente (online via Empresa Online)
   - Comprovativo IBAN
   - ID do representante legal

4. **Aguardar aprovação:**
   - Easypay demora 24-48h para aprovar
   - Receberá email quando aprovado

5. **Obter credenciais:**
   - Após aprovação, fazer login
   - Menu → API → Credentials
   - Copiar:
     ```
     Account ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     API Key: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     ```

6. **Adicionar no Supabase:**
   ```bash
   EASYPAY_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   EASYPAY_ACCOUNT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

---

### Passo 2.2: Implementar Serviço Easypay (1 hora)

**Criar arquivo:** `/supabase/functions/server/easypay_service.tsx`

```typescript
/**
 * 💳 SERVIÇO EASYPAY - Gateway de Pagamentos
 * Gera referências Multibanco e processa pagamentos
 */

import * as kv from './kv_store.tsx';

const EASYPAY_API_KEY = Deno.env.get('EASYPAY_API_KEY');
const EASYPAY_ACCOUNT_ID = Deno.env.get('EASYPAY_ACCOUNT_ID');
const EASYPAY_BASE_URL = 'https://api.prod.easypay.pt/2.0';

// Validar credenciais
if (!EASYPAY_API_KEY || !EASYPAY_ACCOUNT_ID) {
  console.error('❌ [EASYPAY] Credenciais não configuradas!');
}

/**
 * Gera referência Multibanco
 */
export async function generateMultibancoReference(params: {
  amount: number;
  debtorName: string;
  debtorEmail: string;
  description: string;
  debtorId: string;
}): Promise<{
  success: boolean;
  entity?: string;
  reference?: string;
  expiryDate?: string;
  error?: string;
}> {
  try {
    console.log(`[EASYPAY] 💳 Gerando referência Multibanco para €${params.amount}...`);

    const response = await fetch(`${EASYPAY_BASE_URL}/single`, {
      method: 'POST',
      headers: {
        'AccountId': EASYPAY_ACCOUNT_ID,
        'ApiKey': EASYPAY_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'single',
        payment: {
          methods: ['mb'], // Multibanco
          type: 'sale',
          capture: {
            transaction_key: `debt_${params.debtorId}_${Date.now()}`,
            descriptive: params.description,
          },
          currency: 'EUR',
          expiration_time: '2026-12-31', // Válido por 1 ano
        },
        order: {
          items: [
            {
              description: params.description,
              quantity: 1,
              key: 'debt_payment',
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
      throw new Error(`Easypay API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    console.log('[EASYPAY] ✅ Referência gerada com sucesso!');
    console.log(`[EASYPAY] Entidade: ${data.method.entity}`);
    console.log(`[EASYPAY] Referência: ${data.method.reference}`);

    // Salvar no KV para rastrear
    await kv.set(`payment:${data.id}`, {
      paymentId: data.id,
      debtorId: params.debtorId,
      amount: params.amount,
      entity: data.method.entity,
      reference: data.method.reference,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      entity: data.method.entity,
      reference: data.method.reference,
      expiryDate: data.method.expiration_date,
    };

  } catch (error: any) {
    console.error('[EASYPAY] ❌ Erro ao gerar referência:', error);
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
  console.log('[EASYPAY WEBHOOK] 💰 Pagamento recebido!');
  console.log('[EASYPAY WEBHOOK] Payload:', JSON.stringify(payload, null, 2));

  const paymentId = payload.id;
  const status = payload.status;

  if (status === 'success' || status === 'paid') {
    // Atualizar status no KV
    const paymentData = await kv.get(`payment:${paymentId}`);
    
    if (paymentData) {
      await kv.set(`payment:${paymentId}`, {
        ...paymentData,
        status: 'paid',
        paidAt: new Date().toISOString(),
      });

      console.log('[EASYPAY WEBHOOK] ✅ Pagamento confirmado e registado!');

      // Aqui você pode:
      // - Enviar SMS de confirmação
      // - Enviar email de recibo
      // - Atualizar status do devedor
      // - Notificar equipa
    }
  }
}

export default {
  generateMultibancoReference,
  handlePaymentWebhook,
};
```

**Adicionar rotas no** `/supabase/functions/server/index.tsx`:

```typescript
import easypayService from './easypay_service.tsx';

/**
 * POST /make-server-12af7011/payments/generate-reference
 * Gera referência Multibanco
 */
app.post('/make-server-12af7011/payments/generate-reference', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { user, error: authError } = await authenticateUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const {
      amount,
      debtorName,
      debtorEmail,
      description,
      debtorId,
    } = await c.req.json();

    const result = await easypayService.generateMultibancoReference({
      amount,
      debtorName,
      debtorEmail,
      description,
      debtorId,
    });

    return c.json(result);

  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /make-server-12af7011/payments/easypay-webhook
 * Webhook do Easypay
 */
app.post('/make-server-12af7011/payments/easypay-webhook', async (c) => {
  try {
    const payload = await c.req.json();
    await easypayService.handlePaymentWebhook(payload);
    return c.json({ received: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Error:', error);
    return c.json({ error: error.message }, 500);
  }
});
```

---

## ✅ CHECKLIST FINAL

Antes de ir para produção:

### Twilio
- [ ] Conta criada e verificada
- [ ] Número português comprado (+351)
- [ ] Credenciais no Supabase
- [ ] Código implementado
- [ ] Primeira chamada teste funcionou
- [ ] Webhook configurado
- [ ] Gravação de chamada ativa

### Easypay
- [ ] Conta criada e aprovada (24-48h)
- [ ] Documentos enviados
- [ ] Credenciais no Supabase
- [ ] Código implementado
- [ ] Referência teste gerada
- [ ] Webhook configurado

### Deploy
- [ ] Backend deployado
- [ ] Logs funcionando
- [ ] Frontend atualizado
- [ ] Testes end-to-end passaram

---

## 🎉 PARABÉNS!

Se chegou até aqui, o seu sistema está pronto para:
- ✅ Fazer chamadas telefónicas reais
- ✅ Gerar referências Multibanco
- ✅ Processar pagamentos
- ✅ Operar em produção!

**Próximo passo:** Documentação do investidor → Apresentar resultados

---

**Criado em:** 05 de Março de 2026  
**Autor:** Equipa Técnica Tá Pago.pt  
**Versão:** 1.0

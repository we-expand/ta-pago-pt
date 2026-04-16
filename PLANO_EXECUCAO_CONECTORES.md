# 📋 PLANO DE EXECUÇÃO - CONECTORES PARA AGENTE DE VOZ IA
## Cronograma Detalhado e Priorização Estratégica
**Tá Pago.pt - Plataforma Fintech**

---

## 🎯 OBJETIVO EXECUTIVO

Transformar o **protótipo funcional** do Agente de Voz IA (atualmente demo com vozes Google TTS e lógica conversacional) num **sistema de produção completo** capaz de:

1. ✅ Fazer chamadas telefónicas reais
2. ✅ Processar pagamentos
3. ✅ Enviar notificações automáticas
4. ✅ Operar 24/7 com escalabilidade

---

## 📊 ANÁLISE DE PRIORIZAÇÃO (Matriz Impacto vs. Esforço)

```
        ALTO IMPACTO
             │
    ┌────────┼────────┐
    │   1️⃣   │   3️⃣   │
    │ TWILIO │ SMS    │  ← FAZER AGORA
    │ (VoIP) │ Email  │
    ├────────┼────────┤
    │   2️⃣   │   4️⃣   │
    │ EASYPAY│ OpenAI │  ← FAZER DEPOIS
    │ (€€€)  │ (IA+)  │
    └────────┼────────┘
             │
       BAIXO ESFORÇO → ALTO ESFORÇO
```

### Legenda de Prioridades

| Prioridade | Conector | Impacto | Esforço | Status | Razão |
|------------|----------|---------|---------|--------|-------|
| 🔴 **P0** | **Twilio VoIP** | 🔥🔥🔥🔥🔥 | ⚙️⚙️⚙️ | Crítico | Sem isto, não há chamadas reais |
| 🔴 **P0** | **Easypay** | 🔥🔥🔥🔥🔥 | ⚙️⚙️ | Crítico | Sem isto, não há pagamentos |
| 🟡 **P1** | **Google STT** | 🔥🔥🔥🔥 | ⚙️⚙️ | Alta | Melhora qualidade das transcrições |
| 🟡 **P1** | **Twilio SMS** | 🔥🔥🔥 | ⚙️ | Alta | Confirmações essenciais |
| 🟢 **P2** | **Resend Email** | 🔥🔥 | ⚙️ | Média | Comunicação secundária |
| 🟢 **P2** | **WhatsApp** | 🔥🔥🔥 | ⚙️⚙️⚙️ | Média | Requer aprovação Meta |
| ⚪ **P3** | **OpenAI GPT** | 🔥 | ⚙️⚙️ | Baixa | Otimização futura |

---

## 🗓️ CRONOGRAMA EXECUTIVO (3 SEMANAS)

### ⏱️ SEMANA 1: Fundamentos (Telefonia + Pagamentos)

#### **Dia 1-2: Setup Inicial e Contas**
**Responsável:** Tech Lead  
**Duração:** 16h

**Tarefas:**
- [ ] Criar conta Twilio (1h)
  - Registar em https://www.twilio.com/try-twilio
  - Verificar identidade (KYC)
  - Comprar número português (+351)
  - Custo inicial: €50 crédito

- [ ] Criar conta Easypay (2h)
  - Registar em https://www.easypay.pt/
  - Submeter documentos empresa
  - Aguardar aprovação (24-48h)

- [ ] Configurar Environment Variables (1h)
  - Adicionar secrets no Supabase:
    ```bash
    TWILIO_ACCOUNT_SID
    TWILIO_AUTH_TOKEN
    TWILIO_PHONE_NUMBER
    EASYPAY_API_KEY
    EASYPAY_ACCOUNT_ID
    ```

- [ ] Instalar dependências (1h)
  ```bash
  # No backend Deno/Supabase
  npm:twilio
  npm:@google-cloud/speech
  ```

**Entregável:** Contas ativas e credenciais configuradas

---

#### **Dia 3-4: Implementar Twilio (Telefonia)**
**Responsável:** Backend Developer  
**Duração:** 16h

**Tarefas:**
- [ ] Criar `twilio_service.tsx` (4h)
  - Função `startVoiceCall()`
  - Função `generateTwiMLResponse()`
  - Handler de webhooks Twilio

- [ ] Adicionar rotas no servidor (2h)
  - `POST /voice-ai/start-real-call`
  - `POST /voice-ai/twilio-webhook`
  - `POST /voice-ai/twilio-webhook/status`
  - `POST /voice-ai/twilio-webhook/recording`

- [ ] Integrar com frontend (3h)
  - Atualizar `ConversationalVoiceAgent.tsx`
  - Adicionar botão "Chamada Real" vs "Demo"
  - Mostrar status da chamada em tempo real

- [ ] Testar com números sandbox (3h)
  - Twilio fornece números de teste
  - Validar fluxo completo
  - Gravar e ouvir chamada de teste

**Entregável:** Sistema fazendo chamadas reais com voz Google TTS

**Milestone:** 🎉 **Primeira chamada real para devedor!**

---

#### **Dia 5: Implementar Easypay (Pagamentos)**
**Responsável:** Backend Developer  
**Duração:** 8h

**Tarefas:**
- [ ] Criar `easypay_service.tsx` (3h)
  - Função `generateMultibancoReference()`
  - Função `handlePaymentWebhook()`
  - Integração com KV store

- [ ] Adicionar rotas (1h)
  - `POST /payments/generate-reference`
  - `POST /payments/easypay-webhook`

- [ ] Testar ambiente sandbox (2h)
  - Gerar referência de teste
  - Simular pagamento
  - Validar webhook

- [ ] Integrar com frontend (2h)
  - Mostrar referência Multibanco após acordo
  - Atualizar status quando pago

**Entregável:** Sistema gerando referências Multibanco

**Milestone:** 🎉 **Primeira referência Multibanco gerada!**

---

### ⏱️ SEMANA 2: Comunicação e Qualidade

#### **Dia 6-7: Google Cloud Speech-to-Text**
**Responsável:** AI Engineer  
**Duração:** 16h

**Tarefas:**
- [ ] Configurar Google Cloud STT (2h)
  - Habilitar API no console
  - Configurar modelo `phone_call`
  - Testar com áudio de telefone (8kHz)

- [ ] Criar `google_stt_service.tsx` (4h)
  - Função `transcribeCallAudio()`
  - Suporte a streaming (tempo real)
  - Integração com Twilio

- [ ] Substituir WebAPI por Google STT (4h)
  - Atualizar `ConversationalVoiceAgent.tsx`
  - Processar áudio da chamada Twilio
  - Enviar para Google STT

- [ ] Benchmark de qualidade (2h)
  - Comparar WebAPI vs Google STT
  - Medir precisão (Word Error Rate)
  - Ajustar modelos

**Entregável:** Transcrição profissional de chamadas

**Milestone:** 🎉 **Reconhecimento de voz 95%+ preciso!**

---

#### **Dia 8-9: SMS via Twilio**
**Responsável:** Backend Developer  
**Duração:** 8h

**Tarefas:**
- [ ] Criar `sms_service.tsx` (2h)
  - Função `sendSMS()`
  - Função `sendWhatsApp()` (preparação futura)
  - Templates PT-PT

- [ ] Adicionar rotas (1h)
  - `POST /communications/send-sms`

- [ ] Criar templates de SMS (2h)
  ```
  Olá {{nome}},
  Seu acordo foi confirmado!
  Referência MB: {{entity}} {{reference}}
  Válido até {{date}}
  Tá Pago
  ```

- [ ] Integrar com fluxo de pagamento (2h)
  - Enviar SMS após gerar referência
  - Enviar SMS após confirmação de pagamento
  - Enviar SMS de lembrete (1 dia antes)

**Entregável:** Notificações automáticas por SMS

---

#### **Dia 10: Email via Resend**
**Responsável:** Frontend Developer  
**Duração:** 8h

**Tarefas:**
- [ ] Criar conta Resend (30min)
  - Registar em https://resend.com/
  - Verificar domínio `tapago.pt`
  - Obter API key

- [ ] Criar `resend_service.tsx` (2h)
  - Função `sendEmail()`
  - Templates HTML responsivos

- [ ] Criar templates de email (3h)
  - **Acordo de Pagamento:** Detalhes + Multibanco
  - **Confirmação de Pagamento:** Recibo
  - **Lembrete:** 3 dias antes do vencimento

- [ ] Integrar com fluxo (2h)
  - Enviar email após acordo
  - Enviar email após pagamento
  - Enviar email de lembrete

**Entregável:** Comunicação profissional por email

---

### ⏱️ SEMANA 3: Refinamentos e Produção

#### **Dia 11-12: Monitoramento e Logs**
**Responsável:** DevOps Engineer  
**Duração:** 16h

**Tarefas:**
- [ ] Configurar Sentry (2h)
  - Integrar com frontend
  - Integrar com backend
  - Configurar alertas

- [ ] Implementar logging estruturado (4h)
  ```typescript
  console.log('[CALL][START]', {
    callSid,
    debtorId,
    timestamp,
    voiceUsed
  });
  ```

- [ ] Dashboard de métricas (4h)
  - Chamadas por dia
  - Taxa de conversão
  - Tempo médio de chamada
  - Pagamentos processados

- [ ] Alertas críticos (2h)
  - Falha na chamada → Slack
  - Pagamento recebido → Slack
  - Erro na API → Email

**Entregável:** Sistema monitorado 24/7

---

#### **Dia 13-14: Testes de Integração**
**Responsável:** QA Engineer  
**Duração:** 16h

**Cenários de Teste:**

1. **Fluxo Completo - Sucesso**
   - [ ] Sistema liga para devedor
   - [ ] Devedor aceita negociar
   - [ ] Sistema gera referência Multibanco
   - [ ] Devedor paga
   - [ ] Sistema confirma pagamento
   - [ ] SMS/Email enviados

2. **Fluxo Completo - Recusa**
   - [ ] Sistema liga para devedor
   - [ ] Devedor recusa pagamento
   - [ ] Sistema agenda nova tentativa
   - [ ] Registra motivo da recusa

3. **Fluxo de Erro**
   - [ ] Número inválido
   - [ ] Chamada não atendida
   - [ ] Falha na API Easypay
   - [ ] Falha no envio de SMS

4. **Performance**
   - [ ] 10 chamadas simultâneas
   - [ ] Tempo de resposta < 2s
   - [ ] Transcrição em tempo real

**Entregável:** Relatório de testes + bugs corrigidos

---

#### **Dia 15: Deploy e Go-Live**
**Responsável:** Tech Lead  
**Duração:** 8h

**Checklist de Produção:**

- [ ] **Configuração Final**
  - Todas as API keys em produção
  - Webhooks apontando para URLs corretas
  - Secrets no Supabase configurados

- [ ] **Deploy**
  - Deploy do backend no Supabase Edge Functions
  - Deploy do frontend no Vercel
  - Verificar logs

- [ ] **Smoke Tests**
  - Fazer 3 chamadas reais de teste
  - Gerar 3 referências Multibanco
  - Enviar 3 SMS/Emails

- [ ] **Documentação**
  - Manual de operação
  - Guia de troubleshooting
  - Contatos de suporte

- [ ] **Go-Live**
  - Ativar sistema para primeiros 10 devedores
  - Monitorar por 24h
  - Expandir gradualmente

**Entregável:** Sistema em produção! 🚀

---

## 💰 ORÇAMENTO DETALHADO

### Custos Únicos (Setup)

| Item | Custo | Justificativa |
|------|-------|---------------|
| Crédito inicial Twilio | €50 | Testes e validação |
| Número telefone PT (+351) | €1 | Compra inicial |
| Validação KYC Twilio | €0 | Grátis |
| Domínio `tapago.pt` | €10/ano | Email profissional |
| **Total Setup** | **€61** | Investimento único |

### Custos Mensais Recorrentes

#### Cenário 1: MVP (100 chamadas/mês)

| Serviço | Volume | Custo Unit | Total |
|---------|--------|------------|-------|
| Twilio - Chamadas | 100 × 1 min | €0.03 | €3 |
| Twilio - Número PT | 1 | €1/mês | €1 |
| Twilio - SMS | 100 | €0.08 | €8 |
| Google Cloud TTS | 10k chars | Grátis | €0 |
| Google Cloud STT | 100 min | Grátis | €0 |
| Easypay - Taxa | 20 pagtos × €100 | 1.5% | €30 |
| Resend - Email | 100 | Grátis | €0 |
| Supabase Pro | 1 | €25/mês | €25 |
| Sentry | 1 | €26/mês | €26 |
| **Total Mensal** | | | **€93** |

**Custo por chamada:** €0.93

---

#### Cenário 2: Escala (1.000 chamadas/mês)

| Serviço | Volume | Custo Unit | Total |
|---------|--------|------------|-------|
| Twilio - Chamadas | 1.000 × 1 min | €0.03 | €30 |
| Twilio - Número PT | 1 | €1/mês | €1 |
| Twilio - SMS | 1.000 | €0.08 | €80 |
| Google Cloud TTS | 100k chars | Grátis | €0 |
| Google Cloud STT | 200 min | €6/60min | €20 |
| Easypay - Taxa | 200 pagtos × €200 | 1.5% | €600 |
| Resend - Email | 1.000 | Grátis | €0 |
| Supabase Pro | 1 | €25/mês | €25 |
| Sentry | 1 | €26/mês | €26 |
| **Total Mensal** | | | **€782** |

**Custo por chamada:** €0.78  
**Taxa de recuperação esperada:** 30% = 300 pagamentos  
**Valor médio:** €200  
**Receita:** €60.000  
**ROI:** 7.600% 🚀

---

## 📈 MÉTRICAS DE SUCESSO (KPIs)

### Semana 1
- ✅ 10 chamadas de teste realizadas
- ✅ 5 referências Multibanco geradas
- ✅ 0 erros críticos no backend

### Mês 1 (Produção)
- 🎯 100 chamadas realizadas
- 🎯 30% taxa de conversão (30 acordos)
- 🎯 20 pagamentos confirmados
- 🎯 < 5% taxa de erro
- 🎯 95%+ satisfação (NPS)

### Trimestre 1 (Escala)
- 🎯 1.000 chamadas/mês
- 🎯 35% taxa de conversão
- 🎯 200 pagamentos/mês
- 🎯 €40.000 recuperados
- 🎯 < 2% taxa de erro

---

## ⚠️ RISCOS E MITIGAÇÕES

### Risco 1: Twilio KYC demora muito (5-10 dias)
**Probabilidade:** Média  
**Impacto:** Alto (bloqueia desenvolvimento)

**Mitigação:**
- Iniciar KYC no Dia 1
- Usar número sandbox enquanto aguarda
- Ter Vonage como backup

---

### Risco 2: Easypay rejeita empresa (falta documentos)
**Probabilidade:** Baixa  
**Impacto:** Alto

**Mitigação:**
- Preparar todos documentos antecipadamente:
  - NIF da empresa
  - Certidão permanente
  - Comprovativos IBAN
- Ter Stripe como alternativa

---

### Risco 3: Taxa de conversão < 20% (modelo IA fraco)
**Probabilidade:** Média  
**Impacto:** Médio

**Mitigação:**
- Implementar OpenAI GPT-4 (Semana 4)
- A/B testing de scripts
- Análise de sentimento em tempo real
- Treinamento com chamadas reais

---

### Risco 4: Custos explodem (muitas chamadas falhadas)
**Probabilidade:** Baixa  
**Impacto:** Médio

**Mitigação:**
- Validar números antes de ligar
- Detectar voicemail automaticamente
- Limitar tentativas (máx 3× por devedor)
- Dashboards de custo em tempo real

---

## 🎓 SKILLS NECESSÁRIAS

### Backend Developer (Crítico)
- ✅ TypeScript/Deno
- ✅ REST APIs
- ✅ Webhooks
- ⚠️ Twilio API (aprender)
- ⚠️ Payment gateways (aprender)

**Tempo de aprendizagem:** 2-3 dias  
**Recursos:** Twilio Docs PT-BR, tutoriais YouTube

---

### AI Engineer (Importante)
- ✅ Google Cloud APIs
- ✅ Speech Recognition
- ⚠️ Streaming audio (aprender)
- ⚠️ Sentiment analysis (opcional)

**Tempo de aprendizagem:** 3-4 dias

---

### DevOps Engineer (Importante)
- ✅ Supabase Edge Functions
- ✅ Environment variables
- ⚠️ Webhook debugging (aprender)
- ⚠️ Sentry setup (aprender)

**Tempo de aprendizagem:** 1-2 dias

---

## 📞 CONTATOS DE SUPORTE

### Twilio
- **Docs PT:** https://www.twilio.com/docs/voice
- **Support:** https://support.twilio.com/
- **Community:** https://www.twilio.com/community

### Easypay
- **Docs:** https://docs.easypay.pt/
- **Email:** suporte@easypay.pt
- **Telefone:** +351 21 099 5440

### Google Cloud
- **Docs TTS:** https://cloud.google.com/text-to-speech/docs
- **Docs STT:** https://cloud.google.com/speech-to-text/docs
- **Support:** Console → "Support"

### Resend
- **Docs:** https://resend.com/docs
- **Discord:** https://resend.com/discord

---

## ✅ APROVAÇÕES NECESSÁRIAS

Antes de iniciar implementação:

- [ ] **CFO:** Aprovar orçamento de €61 (setup) + €93/mês (operacional)
- [ ] **CTO:** Aprovar arquitetura técnica
- [ ] **Jurídico:** Validar compliance RGPD e cobrança
- [ ] **Investidor:** Aprovar roadmap de 3 semanas
- [ ] **Marketing:** Aprovar scripts de voz e templates

---

## 🚀 PRÓXIMA AÇÃO IMEDIATA

**Se aprovado hoje:**

1. **Amanhã (Dia 1):**
   - Criar conta Twilio → Tech Lead (1h)
   - Criar conta Easypay → Finance (2h)
   - Kickoff meeting → Toda equipa (1h)

2. **Esta Semana:**
   - Implementar Twilio + Easypay
   - Fazer primeira chamada real
   - Gerar primeira referência Multibanco

3. **Este Mês:**
   - 100 chamadas reais
   - 30 acordos fechados
   - €6.000 recuperados

---

## 📊 DASHBOARD DE ACOMPANHAMENTO

Criar dashboard no Supabase/Notion com:

- [ ] Progresso do cronograma (Gantt chart)
- [ ] Status de cada conector (✅ ⏸️ ❌)
- [ ] Custos acumulados vs. orçamento
- [ ] Métricas de performance (chamadas, conversões)
- [ ] Bloqueadores e riscos ativos

**Atualização:** Diária (15 min standup)

---

## 🎉 CELEBRAÇÕES (Motivação da Equipa)

- 🥳 **Dia 4:** Primeira chamada real → Pizza para equipa
- 🥳 **Dia 5:** Primeira referência Multibanco → Cerveja pós-trabalho
- 🥳 **Dia 15:** Go-Live → Jantar de equipa
- 🥳 **Mês 1:** 100 chamadas → Bónus de €500/pessoa
- 🥳 **Trimestre 1:** €40k recuperados → Bónus de €2.000/pessoa

---

**Documento criado em:** 05 de Março de 2026  
**Versão:** 1.0  
**Autor:** Tá Pago.pt - Product Management  
**Status:** 🟡 Aguardando Aprovação do Investidor

---

## 🤝 ASSINATURAS DE APROVAÇÃO

| Stakeholder | Cargo | Assinatura | Data |
|-------------|-------|------------|------|
| ____________ | CEO | ____________ | ___/___/___ |
| ____________ | CTO | ____________ | ___/___/___ |
| ____________ | CFO | ____________ | ___/___/___ |
| ____________ | Investidor | ____________ | ___/___/___ |

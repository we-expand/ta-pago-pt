# 📚 Índice da Documentação - Google Cloud TTS
## Sistema "Tá Pago.pt"

---

## 🎯 Por Onde Começar?

### Se está a ver esta documentação pela PRIMEIRA VEZ:
👉 **[COMECE_AQUI.md](/COMECE_AQUI.md)** ← Guia ultra-rápido (3 minutos)

### Se viu o aviso sobre "OAuth" no Google Cloud:
👉 **[GUIA_RAPIDO_OAUTH.md](/GUIA_RAPIDO_OAUTH.md)** ← Esclarecimento visual

### Se prefere um assistente visual interativo:
👉 **Aceda a:** `/setup/google-tts` na aplicação ← Interface com 5 passos guiados

---

## 📖 Documentação Completa

### 1️⃣ Configuração Inicial

#### **COMECE_AQUI.md** 
- ⏱️ Tempo de leitura: 2 minutos
- 📝 Conteúdo: Passos básicos ultra-resumidos
- 👥 Audiência: Todos
- 🔗 Link: [/COMECE_AQUI.md](/COMECE_AQUI.md)

#### **CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md**
- ⏱️ Tempo de leitura: 10 minutos
- 📝 Conteúdo: Tutorial detalhado com capturas de ecrã
- 👥 Audiência: Utilizadores que querem todos os detalhes
- 🔗 Link: [/CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md](/CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md)

---

### 2️⃣ Perguntas Frequentes e Troubleshooting

#### **FAQ_GOOGLE_CLOUD_TTS.md** ⭐ NOVO!
- ⏱️ Tempo de leitura: 15 minutos (consulta rápida por secção)
- 📝 Conteúdo: 
  - ❓ OAuth é necessário? (NÃO!)
  - 💰 Custos e limites do plano gratuito
  - 🎙️ Vozes disponíveis em PT-PT
  - 🔧 Resolução de erros comuns
  - 🎯 Dicas para apresentação ao investidor
- 👥 Audiência: Todos (especialmente útil quando algo dá errado)
- 🔗 Link: [/FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md)

#### **GUIA_RAPIDO_OAUTH.md** ⭐ NOVO!
- ⏱️ Tempo de leitura: 5 minutos
- 📝 Conteúdo: 
  - Diferença entre API Key e OAuth (visual)
  - Porque OAuth NÃO é necessário para TTS
  - Resposta para investidor técnico
- 👥 Audiência: Quem viu o aviso sobre OAuth
- 🔗 Link: [/GUIA_RAPIDO_OAUTH.md](/GUIA_RAPIDO_OAUTH.md)

---

### 3️⃣ Interface Visual

#### **Assistente de Configuração** (Recomendado)
- ⏱️ Tempo: 5-7 minutos (interativo)
- 📝 Conteúdo: Interface guiada com 5 passos
- 👥 Audiência: Utilizadores que preferem GUI em vez de texto
- 🔗 Acesso: `/setup/google-tts` na aplicação
- 📄 Código-fonte: `/src/app/components/GoogleCloudSetupWizard.tsx`

**Características:**
- ✅ Validação automática da API Key
- ✅ Teste de voz PT-PT integrado
- ✅ Avisos sobre OAuth destacados
- ✅ Links diretos para o Google Cloud Console
- ✅ Copiar/colar facilitado

---

## 🗂️ Estrutura de Ficheiros

```
/
├── 📄 COMECE_AQUI.md                           ← Começa aqui!
├── 📄 CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md
├── 📄 FAQ_GOOGLE_CLOUD_TTS.md                  ← Problemas? Leia isto
├── 📄 GUIA_RAPIDO_OAUTH.md                     ← OAuth? Leia isto
├── 📄 INDICE_DOCUMENTACAO_TTS.md               ← Você está aqui
│
├── /src/app/components/
│   └── GoogleCloudSetupWizard.tsx              ← Assistente visual
│
└── /supabase/functions/server/
    └── google_tts_service.tsx                  ← Serviço backend
```

---

## 🎯 Fluxograma de Decisão

```
┌─────────────────────────────────────────────────┐
│  Quero configurar Google Cloud TTS              │
└─────────────────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        │                       │
   Prefere GUI?          Prefere texto?
        ↓                       ↓
  /setup/google-tts      COMECE_AQUI.md
        ↓                       ↓
   ┌─────────────────────────────────┐
   │  Viu aviso sobre OAuth?         │
   └─────────────────────────────────┘
                ↓
           GUIA_RAPIDO_OAUTH.md
                ↓
   ┌─────────────────────────────────┐
   │  Algo deu errado?               │
   └─────────────────────────────────┘
                ↓
           FAQ_GOOGLE_CLOUD_TTS.md
                ↓
   ┌─────────────────────────────────┐
   │  ✅ Configuração completa!       │
   └─────────────────────────────────┘
```

---

## 📊 Comparação dos Documentos

| Documento                                  | Duração | Detalhe | Quando Usar                              |
|--------------------------------------------|---------|---------|------------------------------------------|
| **COMECE_AQUI.md**                         | 2 min   | Baixo   | Primeira vez, quer começar rápido        |
| **CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO**| 10 min  | Alto    | Quer ver todos os passos detalhados      |
| **FAQ_GOOGLE_CLOUD_TTS.md**                | Variável| Alto    | Tem dúvidas ou problemas                 |
| **GUIA_RAPIDO_OAUTH.md**                   | 5 min   | Médio   | Viu aviso sobre OAuth                    |
| **Assistente Visual** (`/setup/google-tts`)| 5-7 min | Médio   | Prefere interface gráfica                |

---

## 🔍 Pesquisa Rápida por Tópico

### Autenticação e Segurança
- OAuth é necessário? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#oauth) ou [GUIA_RAPIDO_OAUTH.md](/GUIA_RAPIDO_OAUTH.md)
- Como restringir a API Key? → [CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md](/CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md) (Passo 3.3)
- É seguro usar API Key? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#seguranca)

### Custos e Limites
- Quanto custa? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#custos)
- Qual o limite gratuito? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#limites)
- Como monitorar uso? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#monitorar)

### Vozes e Qualidade
- Quais vozes PT-PT existem? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#vozes)
- Posso ajustar velocidade/tom? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#ajustar-voz)
- Wavenet vs Standard? → [CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md](/CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md) (Vozes Disponíveis)

### Erros Comuns
- "API key not valid" → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#erros)
- "API not enabled for project" → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#erros)
- "Quota exceeded" → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#erros)
- Sem áudio / Áudio cortado → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#erros)

### Apresentação ao Investidor
- Como preparar demos? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#apresentacao)
- Que métricas mostrar? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#metricas)
- E se a internet falhar? → [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md#plano-b)

---

## 🎓 Níveis de Conhecimento

### Iniciante (Nunca usei Google Cloud)
1. Leia: [COMECE_AQUI.md](/COMECE_AQUI.md)
2. Use: Assistente Visual `/setup/google-tts`
3. Se tiver dúvidas: [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md)

### Intermediário (Já usei outras APIs do Google)
1. Leia: [GUIA_RAPIDO_OAUTH.md](/GUIA_RAPIDO_OAUTH.md) (esclarecer OAuth)
2. Siga: [CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md](/CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md)
3. Consulte: [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md) (otimizações)

### Avançado (Desenvolvedor/DevOps)
1. Código backend: `/supabase/functions/server/google_tts_service.tsx`
2. Código frontend: `/src/app/components/GoogleCloudSetupWizard.tsx`
3. Best practices: [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md) (secção Segurança)

---

## 📱 Acesso Rápido por Plataforma

### No Browser (Interface Web)
```
1. Aceda a: http://localhost:5173/setup/google-tts
   (ou domínio de produção/setup/google-tts)

2. Siga o assistente visual com 5 passos

3. Teste a voz no final
```

### Via Documentação (Markdown)
```
1. Abra: /COMECE_AQUI.md

2. Siga os links para documentação detalhada

3. Use Ctrl+F para procurar tópicos específicos
```

### Via Google Cloud Console
```
1. Ative API: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com

2. Crie credenciais: https://console.cloud.google.com/apis/credentials

3. Copie chave → Cole no assistente visual
```

---

## 🆘 Precisa de Ajuda?

### Ordem recomendada de resolução:

1. **Consulte o FAQ primeiro:**
   - [FAQ_GOOGLE_CLOUD_TTS.md](/FAQ_GOOGLE_CLOUD_TTS.md)
   - 90% das dúvidas estão respondidas aqui

2. **Verifique a consola do browser:**
   - Pressione `F12`
   - Vá à aba "Console"
   - Procure mensagens de erro em vermelho

3. **Reveja a configuração:**
   - API ativada? ✓
   - Chave copiada corretamente? ✓
   - Restrições configuradas? ✓
   - Aguardou 2-3 minutos? ✓

4. **Use o assistente de diagnóstico:**
   - No dashboard: "Campanhas Multicanal" → "Voz IA" → "Diagnosticar"
   - Mostra status de todas as integrações

---

## 📞 Links Úteis Externos

### Documentação Oficial Google:
- **Text-to-Speech Docs:** https://cloud.google.com/text-to-speech/docs
- **Vozes PT-PT:** https://cloud.google.com/text-to-speech/docs/voices
- **Preços:** https://cloud.google.com/text-to-speech/pricing
- **API Keys Best Practices:** https://cloud.google.com/docs/authentication/api-keys

### Google Cloud Console:
- **Console principal:** https://console.cloud.google.com/
- **Ativar TTS API:** https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- **Credenciais:** https://console.cloud.google.com/apis/credentials
- **Billing/Uso:** https://console.cloud.google.com/billing/reports

---

## ✅ Checklist de Verificação

Antes de considerar a configuração completa:

**Configuração Google Cloud:**
- [ ] Projeto "Tá Pago" selecionado
- [ ] API Text-to-Speech ativada
- [ ] Chave de API criada (AIzaSy...)
- [ ] Restrições HTTP configuradas (*.supabase.co/*)
- [ ] Restrições de API configuradas (só TTS)
- [ ] Aviso OAuth ignorado ✓

**Configuração no Sistema:**
- [ ] Chave inserida no assistente visual
- [ ] Validação bem-sucedida (✓ verde)
- [ ] Teste de voz funcionando
- [ ] Áudio em PT-PT audível e claro

**Preparação para Investidor:**
- [ ] Demos preparadas (2-3 cenários)
- [ ] Dashboard funcional
- [ ] Métricas visíveis
- [ ] Plano B (vídeos offline)

---

## 🎯 Próximos Passos

Após completar a configuração:

1. **Teste o Agente Conversacional:**
   - Vá para: "Campanhas Multicanal" → "Agente de Voz IA"
   - Selecione um devedor de teste
   - Inicie uma chamada simulada

2. **Configure Cenários Personalizados:**
   - Ajuste scripts de conversa
   - Defina respostas para objeções comuns
   - Personalize tom e velocidade

3. **Monitore o Uso:**
   - Google Cloud Console → Billing → Reports
   - Dashboard interno → Widget de status
   - Configure alertas (>80% quota)

4. **Prepare Apresentação:**
   - 3 demos curtas (30s cada)
   - Screenshots de métricas
   - ROI calculado (IA vs humano)

---

**✨ Documentação mantida e atualizada para o sistema "Tá Pago.pt"**

*Vozes IA 100% em Português de Portugal autêntico.*

---

## 📝 Histórico de Atualizações

**v1.0 (03/03/2026):**
- ✅ Documentação inicial completa
- ✅ FAQ com 20+ perguntas respondidas
- ✅ Guia OAuth vs API Key
- ✅ Assistente visual interativo
- ✅ Suporte completo PT-PT

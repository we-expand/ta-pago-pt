# ⚠️ GUIA RÁPIDO: OAuth vs API Key

## 🎯 TL;DR (Resumo Ultra-Rápido)

**VIU AVISO SOBRE OAuth NO GOOGLE CLOUD?**

```
┌────────────────────────────────────────────────────────┐
│ ⚠️ "Lembre-se de configurar OAuth..."                  │
└────────────────────────────────────────────────────────┘
```

### ✅ RESPOSTA: IGNORE COMPLETAMENTE!

**Para Text-to-Speech, só precisa de:**
1. ✅ API Key criada
2. ✅ API Text-to-Speech ativada
3. ❌ OAuth **NÃO** é necessário

---

## 📊 Comparação Visual

```
┌─────────────────────────────────────────────────────────────┐
│                   QUANDO USAR CADA UM?                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  API KEY                         OAuth 2.0                 │
│  ├─ Text-to-Speech ✅            ├─ Gmail (ler emails)     │
│  ├─ Google Maps                  ├─ Google Drive (ficheiros)│
│  ├─ Google Translate             ├─ Calendar (eventos)     │
│  └─ YouTube Data API             └─ Contacts (contactos)  │
│                                                             │
│  Acesso: Projeto                 Acesso: Dados do User     │
│  Config: 2 minutos               Config: 15-30 minutos     │
│  Segurança: Restrições           Segurança: Scopes         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Diferenças Técnicas

### API Key
```
┌─────────────────────────────────────────────┐
│  Cliente                                    │
│    ↓                                        │
│  API Key: "AIzaSyXXXXXX..."                 │
│    ↓                                        │
│  Google Cloud API                           │
│    ↓                                        │
│  "Ok, projeto identificado"                 │
│    ↓                                        │
│  Retorna áudio sintetizado                  │
└─────────────────────────────────────────────┘
```

**Características:**
- ✅ Identifica o **projeto**
- ✅ Permite aceder a APIs **públicas**
- ✅ Não acede a dados privados do utilizador
- ✅ Simples de configurar (2 minutos)

---

### OAuth 2.0
```
┌─────────────────────────────────────────────┐
│  Cliente                                    │
│    ↓                                        │
│  "Quero aceder ao Gmail do João"            │
│    ↓                                        │
│  Google: "João, autoriza?"                  │
│    ↓                                        │
│  João: "Sim, autorizo"                      │
│    ↓                                        │
│  Token de acesso gerado                     │
│    ↓                                        │
│  Retorna emails do João                     │
└─────────────────────────────────────────────┘
```

**Características:**
- ✅ Identifica o **utilizador**
- ✅ Acede a dados **privados** do utilizador
- ✅ Requer consentimento explícito
- ⚠️ Complexo de configurar (15-30 minutos)

---

## 🎙️ Para o Tá Pago.pt

### O que o sistema faz:
```javascript
// Chamada ao Google Cloud TTS
POST https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSy...

{
  "input": { "text": "Olá, fala da Tá Pago..." },
  "voice": { "languageCode": "pt-PT", "name": "pt-PT-Wavenet-D" },
  "audioConfig": { "audioEncoding": "MP3" }
}

// Retorna: Base64 do áudio MP3
{
  "audioContent": "//uQxAAAAAAAAAAAAAAAAAAAA..."
}
```

**Análise:**
- ❓ Acede a emails do utilizador? **NÃO**
- ❓ Acede a ficheiros no Drive? **NÃO**
- ❓ Acede a dados privados? **NÃO**
- ✅ Apenas converte texto em áudio? **SIM**

**Conclusão: API Key é suficiente!**

---

## 🛡️ Segurança

### API Key SEM Restrições (PERIGOSO ❌)
```
API Key: AIzaSyXXXXXX...
  ↓
Pode ser usada por QUALQUER site
  ↓
Pode aceder a TODAS as APIs do projeto
  ↓
Risco de abuso e custos inesperados
```

### API Key COM Restrições (SEGURO ✅)
```
API Key: AIzaSyXXXXXX...
  ↓
Restrições HTTP:
  ├─ *.supabase.co/*
  └─ localhost:*/*
  ↓
Restrições de API:
  └─ Cloud Text-to-Speech API (APENAS)
  ↓
Outros sites: ❌ Bloqueado
Outras APIs: ❌ Bloqueado
```

**SEMPRE configure restrições!**

---

## 📋 Checklist de Verificação

**Antes de sair do Google Cloud Console:**

- [ ] ✅ API Text-to-Speech **ATIVADA**
- [ ] ✅ Chave de API **CRIADA**
- [ ] ✅ Chave **COPIADA** (AIzaSy...)
- [ ] ✅ Restrições HTTP **CONFIGURADAS** (*.supabase.co/*)
- [ ] ✅ Restrições de API **CONFIGURADAS** (só TTS)
- [ ] ❌ OAuth **IGNORADO** (não é necessário)

---

## 🚨 Mensagens de Erro Comuns

### "Configure OAuth consent screen"
```
❌ Erro que VÊ:
   "Lembre-se de configurar a tela de permissão OAuth..."

✅ O que FAZER:
   NADA! Ignore completamente.

📖 Por quê:
   Esta mensagem aparece em TODOS os projetos.
   É um aviso genérico, não se aplica ao TTS.
```

### "API key not valid"
```
❌ Possíveis causas:
   1. Chave copiada incorretamente (falta caracteres)
   2. API Text-to-Speech não está ativada
   3. Restrições muito rígidas (domínio errado)
   4. Aguardar 2-3 minutos (tempo de propagação)

✅ Solução rápida:
   1. Verifique se a chave começa com "AIzaSy"
   2. Confirme que a API TTS está ativada
   3. Aguarde 3 minutos e tente novamente
```

---

## 🎓 Para o Investidor Técnico

Se o investidor perguntar sobre segurança:

**Pergunta:** "Porque não usam OAuth? Não é mais seguro?"

**Resposta:**
> "OAuth é excelente para autenticar utilizadores e aceder aos seus dados privados, 
> como emails ou ficheiros. No nosso caso, usamos Text-to-Speech, que é um serviço 
> **público** da Google Cloud - não acedemos a dados privados de ninguém.
> 
> Uma API Key com restrições adequadas (domínio + API específica) é a abordagem 
> **recomendada pela Google** para este tipo de serviço. É mais simples, mais rápida 
> de configurar, e igualmente segura para o nosso caso de uso.
> 
> Seguimos as best practices da Google Cloud para APIs públicas."

**Pergunta:** "E se alguém roubar a API Key?"

**Resposta:**
> "Implementámos várias camadas de segurança:
> 
> 1. **Restrições de domínio**: A chave só funciona em *.supabase.co e localhost
> 2. **Restrições de API**: Apenas Text-to-Speech está acessível, nenhuma outra API
> 3. **Monitorização**: Alertas configurados para uso anómalo (>80% da quota)
> 4. **Rotação**: Podemos invalidar e gerar nova chave em 30 segundos
> 5. **Backend-only**: A chave nunca é exposta no frontend
> 
> Mesmo com a chave, um atacante só conseguiria... gerar áudios PT-PT. 
> Não acede a dados, não pode alterar configurações, não tem acesso ao projeto."

---

## 📚 Links de Referência Oficial

**Google Cloud - API Keys Best Practices:**
https://cloud.google.com/docs/authentication/api-keys

**Citação:**
> "API keys are best suited for projects, automated systems, or during development. 
> For accessing private user data, use OAuth 2.0."

**Google Cloud - Text-to-Speech Authentication:**
https://cloud.google.com/text-to-speech/docs/authentication

**Citação:**
> "You can authenticate to Cloud Text-to-Speech using an API key. 
> This is recommended for client-side applications."

---

## ✅ Resumo Final

```
┌──────────────────────────────────────────────────────┐
│  PARA O GOOGLE CLOUD TEXT-TO-SPEECH:                │
│                                                      │
│  ✅ API Key             ← USE ISTO                  │
│  ❌ OAuth               ← IGNORE AVISOS             │
│                                                      │
│  ✅ Rápido (2 min)                                  │
│  ✅ Seguro (com restrições)                         │
│  ✅ Recomendado pela Google                         │
│  ✅ Suficiente para produção                        │
└──────────────────────────────────────────────────────┘
```

**Próximo passo:**
1. Vá para: `/setup/google-tts`
2. Siga os 5 passos do assistente
3. Teste a voz PT-PT
4. Demonstre ao investidor!

---

**🎉 Sucesso na configuração!**

*Sistema "Tá Pago.pt" - Vozes IA em Português de Portugal autêntico.*

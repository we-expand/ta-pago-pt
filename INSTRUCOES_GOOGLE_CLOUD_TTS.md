# 🎙️ Instruções Rápidas: Google Cloud Text-to-Speech

## 🚀 Começo Rápido

### ✅ O Que Já Está Configurado

O sistema "Tá Pago.pt" já está **100% preparado** para usar o Google Cloud Text-to-Speech com vozes em Português de Portugal. Falta apenas **configurar a API Key**.

---

## 📋 PASSO A PASSO SIMPLIFICADO

### **Opção 1: Assistente Visual (RECOMENDADO)**

1. **Aceda ao assistente de configuração:**
   ```
   👉 URL: /setup/google-tts
   ```

2. O assistente irá guiá-lo através de **5 passos simples:**
   - ✅ Verificar projeto Google Cloud
   - ✅ Ativar API Text-to-Speech
   - ✅ Criar chave de API
   - ✅ Configurar no sistema
   - ✅ Testar voz portuguesa

3. **Siga as instruções visuais** - capturas de ecrã incluídas!

---

### **Opção 2: Manual (Para Quem Já Conhece Google Cloud)**

#### 1️⃣ Ativar a API Text-to-Speech

Aceda ao link direto:
```
https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
```

- Selecione o projeto "Tá Pago"
- Clique em **"ATIVAR"**
- Aguarde 30-60 segundos

#### 2️⃣ Criar a Chave de API

Aceda ao link direto:
```
https://console.cloud.google.com/apis/credentials
```

1. Clique em **"+ CRIAR CREDENCIAIS"** → **"Chave de API"**
2. **COPIE A CHAVE IMEDIATAMENTE** (formato: `AIzaSy...`)
3. Guarde num local seguro

#### 3️⃣ Configurar no Sistema

**Via Assistente:**
- Vá para `/setup/google-tts`
- Cole a chave no Passo 4
- Clique em "Validar e Configurar"

**OU via Dashboard:**
- Campanhas Multicanal → Aba "Voz IA"
- Clique em "Configurar Google Cloud TTS"
- Cole a chave e teste

---

## 🎯 Informação Importante

### ✅ Está Na Imagem Que Anexou

Vejo que já está autenticado no Google Cloud Console!

- **Projeto:** "Tá Pago"
- **ID:** 128109583762

**Próximo passo:** Ative a API Text-to-Speech usando o link acima.

---

## 💰 Plano Gratuito

### Limites Incluídos:
- ✅ **1 milhão de caracteres/mês** (vozes Neural PT-PT)
- ✅ **~2.000 chamadas telefónicas/mês** (média de 500 chars/chamada)
- ✅ **Sem necessidade de cartão de crédito**
- ✅ Renovação automática todo dia 1º do mês

### Monitorar Uso:
```
https://console.cloud.google.com/billing/reports
```
Filtre por: **"Cloud Text-to-Speech API"**

---

## 🎤 Vozes Disponíveis (PT-PT)

O sistema usará automaticamente as melhores vozes:

| Voz                | Género    | Tipo    | Uso                    |
|--------------------|-----------|---------|------------------------|
| pt-PT-Wavenet-D    | Feminina  | Neural  | Agente principal       |
| pt-PT-Wavenet-B    | Masculina | Neural  | Agente alternativo     |
| pt-PT-Wavenet-A    | Feminina  | Neural  | Notificações           |
| pt-PT-Wavenet-C    | Masculina | Neural  | Mensagens automáticas  |

---

## 🔒 Segurança (Opcional mas Recomendado)

### Restringir a Chave de API:

1. No Google Cloud Console → **Credentials**
2. Clique na sua API Key
3. **Restrições de aplicação:**
   - Selecione: "Referenciadores HTTP (websites)"
   - Adicione:
     ```
     *.supabase.co/*
     localhost:*/*
     ```

4. **Restrições de API:**
   - Selecione: "Restringir chave"
   - Marque apenas: ☑️ **Cloud Text-to-Speech API**

5. Clique em **"GUARDAR"**

---

## 🛠️ Resolução de Problemas

### ❌ "API Key inválida"
- Verifique se copiou a chave completa (`AIzaSy...`)
- Aguarde 2-3 minutos após criar a chave
- Certifique-se de que a API está ativada

### ❌ "API not enabled"
- Ative a API no link: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- Aguarde 1-2 minutos para propagação

### ❌ "Quota exceeded"
- Atingiu o limite mensal (1M chars)
- Aguarde o próximo mês (renovação dia 1)
- OU ative faturamento para continuar

### ❌ Sem áudio
- Verifique a ligação à internet
- Teste noutro navegador (Chrome recomendado)
- Limpe a cache (Ctrl+Shift+Del)

---

## 📞 Links Úteis

### Console Google Cloud:
- **Ativar API:** https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- **Credenciais:** https://console.cloud.google.com/apis/credentials
- **Faturamento:** https://console.cloud.google.com/billing/reports

### Documentação do Sistema:
- **Guia Completo:** `/GOOGLE_TTS_SETUP.md`
- **Guia Passo a Passo:** `/CONFIGURACAO_GOOGLE_CLOUD_PASSO_A_PASSO.md`
- **Assistente Visual:** `/setup/google-tts`

### Documentação Oficial Google:
- **API Docs:** https://cloud.google.com/text-to-speech/docs
- **Vozes PT-PT:** https://cloud.google.com/text-to-speech/docs/voices
- **Preços:** https://cloud.google.com/text-to-speech/pricing

---

## ✅ Checklist de Configuração

Antes de apresentar ao investidor:

- [ ] API Text-to-Speech ativada no projeto "Tá Pago"
- [ ] Chave de API criada e guardada
- [ ] Chave restrita (apenas Cloud Text-to-Speech API)
- [ ] Chave configurada no sistema "Tá Pago.pt"
- [ ] Teste de voz PT-PT realizado com sucesso
- [ ] Agente conversacional testado
- [ ] Monitoria de uso configurada

---

## 🎯 Demonstração ao Investidor

### Preparação:
1. Configure a API Key seguindo as instruções acima
2. Teste o agente de voz com 2-3 devedores fictícios
3. Prepare capturas de ecrã do dashboard
4. Mostre o relatório de uso (Google Cloud Console)

### Durante a Apresentação:
1. Demonstre uma chamada ao vivo
2. Mostre a qualidade da voz PT-PT
3. Apresente métricas de eficácia
4. Destaque o custo zero (plano gratuito)

---

**✨ Sistema pronto para produção!**

*Desenvolvido com vozes 100% em Português de Portugal autêntico para o mercado português.*

---

**🆘 Precisa de Ajuda?**

1. Aceda ao assistente visual: `/setup/google-tts`
2. Consulte a documentação completa nos links acima
3. Verifique a consola do navegador (F12) para erros detalhados

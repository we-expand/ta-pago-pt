# 🚨 SOLUÇÃO: Erro "API Key Inválida" - Google Cloud TTS

## 📸 Situação Identificada

**Erro:** "API Key inválida" ao validar a chave no sistema Tá Pago.pt

**Chave criada no Google Cloud:** "Tá Pago! Real Voice API"

---

## ✅ CAUSA MAIS PROVÁVEL: API NÃO ESTÁ ATIVADA

### 🎯 Solução Rápida (2 minutos):

**PASSO 1: Ativar a API Cloud Text-to-Speech**

1. **Abra este link AGORA:**
   ```
   https://console.cloud.google.com/apis/library/texttospeech.googleapis.com?project=ta-pago-1
   ```

2. **Certifique-se** de que o projeto "Tá Pago!" está selecionado (topo da página)

3. **Clique no botão azul "ATIVAR"** (ou "ENABLE")

4. **Aguarde 30-60 segundos** até ver "API ativada"

5. **Volte ao sistema** e tente validar novamente

---

## 🔍 DIAGNÓSTICO COMPLETO

### Possíveis Causas do Erro:

#### 1️⃣ **API Text-to-Speech NÃO está ativada** ⭐ MAIS COMUM
```
Sintoma: Erro "API Key inválida" mesmo com chave correta
Causa: A API precisa ser explicitamente ativada no projeto
Solução: Ativar em https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
```

#### 2️⃣ **Restrições de API muito rígidas**
```
Sintoma: Chave funciona noutros serviços, mas não no TTS
Causa: Na configuração da chave, outras APIs foram marcadas mas TTS não
Solução: Editar chave → Restrições de API → Marcar "Cloud Text-to-Speech API"
```

#### 3️⃣ **Restrições de Domínio bloqueando**
```
Sintoma: Erro 403 "Referer blocked"
Causa: Domínio do Supabase não está nas restrições HTTP
Solução: Editar chave → Restrições HTTP → Adicionar "*.supabase.co/*"
```

#### 4️⃣ **Tempo de propagação**
```
Sintoma: Chave acabou de ser criada/editada
Causa: Google leva 2-5 minutos para propagar mudanças
Solução: Aguardar 5 minutos e tentar novamente
```

#### 5️⃣ **Chave copiada incorretamente**
```
Sintoma: Faltam caracteres ou há espaços
Causa: Cópia parcial ou com formatação
Solução: Copiar novamente, verificar se começa com "AIzaSy" e tem ~39 caracteres
```

---

## 🛠️ PROCEDIMENTO DE DIAGNÓSTICO

### Checklist Passo a Passo:

#### ✅ PASSO 1: Verificar se a API está ativada
```
1. Vá para: https://console.cloud.google.com/apis/dashboard
2. Procure "Cloud Text-to-Speech API" na lista
3. Status deve mostrar "Ativada" (verde)
4. Se NÃO aparecer na lista → API NÃO está ativada!
```

**Se não estiver ativada:**
- Ative em: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- Aguarde 60 segundos
- Tente validar novamente

---

#### ✅ PASSO 2: Verificar configuração da chave

```
1. Vá para: https://console.cloud.google.com/apis/credentials
2. Clique na chave "Tá Pago! Real Voice API"
3. Verifique:
```

**Restrições de Aplicação:**
```
Opção selecionada: "Referenciadores HTTP (websites)"

Referenciadores de sites:
  *.supabase.co/*
  localhost:*/*
```

**Restrições de API:**
```
Opção selecionada: "Restringir chave"

APIs permitidas:
  ☑️ Cloud Text-to-Speech API  ← DEVE ESTAR MARCADA!
```

**Se a Cloud Text-to-Speech API NÃO estiver marcada:**
- Marque a caixa
- Clique em "GUARDAR"
- Aguarde 2-3 minutos
- Tente validar novamente

---

#### ✅ PASSO 3: Testar chave diretamente (sem o sistema)

**Teste via navegador:**

1. Abra uma nova aba do navegador
2. Cole esta URL (SUBSTITUA `SUA_API_KEY` pela sua chave real):

```
https://texttospeech.googleapis.com/v1/voices?key=SUA_API_KEY&languageCode=pt-PT
```

**Exemplos:**

✅ **Se funcionar**, verá algo como:
```json
{
  "voices": [
    {
      "name": "pt-PT-Wavenet-A",
      "ssmlGender": "FEMALE",
      "languageCodes": ["pt-PT"]
    },
    ...
  ]
}
```

❌ **Se der erro**, verá:
```json
{
  "error": {
    "code": 403,
    "message": "Cloud Text-to-Speech API has not been used in project..."
  }
}
```
→ **Isto confirma**: API NÃO está ativada!

---

#### ✅ PASSO 4: Verificar projeto correto

```
No Google Cloud Console (topo da página):

Projeto atual: "Tá Pago!" 
             ou "ta-pago-1"
             ou ID: 128109583762

✅ Se está correto: Continue
❌ Se está diferente: Clique no nome → Selecione "Tá Pago!"
```

---

## 🔧 SOLUÇÕES PASSO A PASSO

### 🎯 Solução 1: Ativar a API (Mais Provável)

**Via Link Direto:**
```
1. Abra: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
2. Projeto "Tá Pago!" deve estar selecionado
3. Clique em "ATIVAR" (botão azul)
4. Aguarde 60 segundos
5. Volte ao sistema e valide a chave
```

**Via Console:**
```
1. Google Cloud Console → Menu ☰
2. APIs e serviços → Biblioteca
3. Pesquisar: "text-to-speech"
4. Clicar em "Cloud Text-to-Speech API"
5. Clicar em "ATIVAR"
6. Aguardar 60 segundos
```

---

### 🎯 Solução 2: Corrigir Restrições da Chave

**Se a API estiver ativada mas ainda dá erro:**

```
1. Google Cloud Console → APIs e serviços → Credenciais
2. Clique em "Tá Pago! Real Voice API"
3. Role até "Restrições de API"
4. Certifique-se de que está selecionado:
   
   ( ) Não restringir chave  ← NÃO SELECIONE (inseguro)
   (•) Restringir chave      ← SELECIONE ESTA
   
5. Na lista abaixo, marque:
   
   ☑️ Cloud Text-to-Speech API
   
6. Clique em "GUARDAR" (fundo da página)
7. Aguarde 2-3 minutos para propagar
8. Tente validar novamente
```

---

### 🎯 Solução 3: Testar sem Restrições (Temporário)

**Para confirmar que o problema são as restrições:**

```
1. Crie uma NOVA chave de API (temporária para teste):
   
   Google Cloud Console → Credenciais → + CRIAR CREDENCIAIS → Chave de API
   
2. NÃO adicione restrições (deixe tudo em branco por agora)
   
3. Copie esta chave temporária
   
4. Valide no sistema Tá Pago.pt
   
5. Se FUNCIONAR:
   → Problema era nas restrições da chave original
   → Configure restrições gradualmente
   
6. Se NÃO FUNCIONAR:
   → Problema é a API não estar ativada
   → Volte à Solução 1
   
7. ⚠️ IMPORTANTE: Após identificar o problema, DELETE esta chave temporária
```

---

### 🎯 Solução 4: Criar Nova Chave (Recomeçar)

**Se nada funcionar, recomeçar do zero:**

```
1. Google Cloud Console → APIs e serviços → Credenciais
2. Encontre a chave "Tá Pago! Real Voice API"
3. Clique nos 3 pontos (⋮) → "Excluir chave"
4. Confirme a exclusão
5. Clique em "+ CRIAR CREDENCIAIS" → "Chave de API"
6. Uma nova chave será gerada (AIzaSy...)
7. COPIE IMEDIATAMENTE
8. Clique em "RESTRINGIR CHAVE"
9. Configure:
   
   Restrições de aplicação:
   - Selecione: "Referenciadores HTTP"
   - Adicione: *.supabase.co/*
   - Adicione: localhost:*/*
   
   Restrições de API:
   - Selecione: "Restringir chave"
   - Marque: ☑️ Cloud Text-to-Speech API
   
10. Clique em "GUARDAR"
11. Aguarde 2-3 minutos
12. Valide no sistema
```

---

## 🔍 LOGS DE DEBUG

### Como ver o erro exato no navegador:

```
1. No sistema Tá Pago.pt, pressione F12
2. Vá à aba "Console"
3. Tente validar a chave novamente
4. Procure mensagens em vermelho
5. Copie o erro completo
```

**Erros comuns e o que significam:**

```
"API not enabled for project"
→ API Text-to-Speech NÃO está ativada
→ Solução: Ativar em console.cloud.google.com/apis/library/texttospeech.googleapis.com

"API key not valid"
→ Formato da chave está errado OU chave não existe
→ Solução: Verificar se chave começa com "AIzaSy" e tem ~39 caracteres

"Requests from referer <empty> are blocked"
→ Restrições HTTP estão bloqueando
→ Solução: Adicionar *.supabase.co/* nas restrições

"The caller does not have permission"
→ API está desativada OU restrições de API não incluem TTS
→ Solução: Ativar API + marcar TTS nas restrições
```

---

## 📞 PROCEDIMENTO PARA INVESTIDOR

Se o investidor estiver presente durante a configuração:

### Mensagem para o Investidor:

> "Este erro é comum na primeira configuração do Google Cloud. A causa mais frequente 
> é que a API Text-to-Speech precisa ser explicitamente ativada no projeto - é um 
> passo de segurança do Google para evitar custos inesperados.
> 
> Vou ativar agora (leva 60 segundos) e a validação funcionará. Este é um setup 
> único - após configurado, o sistema funcionará automaticamente."

### Demonstração Alternativa (Plano B):

Se a configuração demorar mais do que esperado:

```
1. Mostrar a documentação (FAQ_GOOGLE_CLOUD_TTS.md)
2. Mostrar o código backend (clean e bem organizado)
3. Mostrar uma demo gravada em vídeo
4. Remarcar para mostrar o sistema funcionando ao vivo
5. Manter profissionalismo
```

---

## ✅ CHECKLIST PÓS-SOLUÇÃO

Após resolver o erro:

- [ ] API Cloud Text-to-Speech está ativada (verde no dashboard)
- [ ] Chave de API criada e copiada
- [ ] Restrições HTTP configuradas (*.supabase.co/*)
- [ ] Restrições de API configuradas (TTS marcada)
- [ ] Validação no sistema bem-sucedida (✓ verde)
- [ ] Teste de voz funcionando (áudio PT-PT audível)
- [ ] Dashboard exibindo status "Configurado"

---

## 🎯 PRÓXIMOS PASSOS

Após validar com sucesso:

1. **Teste a voz:** Clique em "Testar Voz Portuguesa" no assistente
2. **Configure o agente:** Vá para "Campanhas Multicanal" → "Agente de Voz IA"
3. **Prepare demos:** Crie 2-3 cenários de conversa para o investidor
4. **Monitore uso:** Configure alertas no Google Cloud Console

---

## 📚 LINKS ÚTEIS

**Google Cloud Console:**
- Ativar API TTS: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- Ver APIs ativas: https://console.cloud.google.com/apis/dashboard
- Credenciais: https://console.cloud.google.com/apis/credentials
- Billing (uso): https://console.cloud.google.com/billing/reports

**Documentação:**
- FAQ Completo: /FAQ_GOOGLE_CLOUD_TTS.md
- Guia OAuth: /GUIA_RAPIDO_OAUTH.md
- Índice: /INDICE_DOCUMENTACAO_TTS.md

---

**✅ Este erro é 100% resolvível em 2-5 minutos!**

*A causa mais comum (90% dos casos) é a API não estar ativada.*

*Sistema "Tá Pago.pt" - Vozes IA em Português de Portugal autêntico.*

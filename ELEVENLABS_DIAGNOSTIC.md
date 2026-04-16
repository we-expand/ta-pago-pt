# 🔍 Diagnóstico ElevenLabs - Tá Pago.pt

## ✅ SISTEMA ACTUALIZADO - Nova Funcionalidade!

🎉 **NOVO Widget TTS no Dashboard!** Agora pode testar o sistema de voz com apenas 1 clique directamente no painel principal.

**→ Ver guia rápido:** [`QUICK_START_TTS.md`](./QUICK_START_TTS.md)
**→ Guia completo:** [`ELEVENLABS_TTS_SYSTEM_READY.md`](./ELEVENLABS_TTS_SYSTEM_READY.md)

---

## Problema Comum: Erro 401 "Invalid API Key"

Se está a receber erro 401 ao tentar gerar áudio com ElevenLabs, este guia vai ajudá-lo a identificar e resolver o problema.

---

## 🚀 Acesso Rápido ao Diagnóstico

### ⭐ Opção 1: Widget TTS no Dashboard (NOVO!)
1. Faça login na plataforma
2. Vá para o **Painel Principal** (Dashboard)
3. Role até ao final da página
4. Veja o widget **"Teste Rápido ElevenLabs TTS"**
5. Clique em **"Testar TTS Agora"**
6. Ouça o resultado em segundos!

Para diagnóstico completo, clique em **"Diagnóstico Completo"** no mesmo widget.

### Opção 2: Console do Browser
1. Abra o Chrome DevTools (F12)
2. Vá para o separador **Console**
3. Digite e execute:
   ```javascript
   window.openDiagnostics()
   ```
4. O sistema vai abrir a página de diagnóstico automaticamente

### Opção 3: URL Directa
Adicione `?diagnostic` ao URL da aplicação:
```
https://seu-dominio.com/?diagnostic
```

### Opção 4: Botão de Erro
Quando ocorrer um erro de TTS no **Campaign Manager**, clique no botão **"Diagnóstico"** que aparece no banner de erro vermelho.

---

## 📊 O Que o Diagnóstico Testa

O sistema executa 4 testes essenciais:

### ✅ Teste 1: Variável de Ambiente
- Verifica se `ELEVENLABS_API_KEY` está configurada no Supabase
- Valida o formato da chave (deve começar com `sk_`)
- Mostra preview da chave: `sk_b2d917d3...f5d`

### ✅ Teste 2: KV Store Fallback
- Verifica se há uma chave armazenada no KV store como fallback
- Útil para ambientes de desenvolvimento

### ✅ Teste 3: Validação da API
- Testa a chave directamente com a API da ElevenLabs
- Endpoint: `GET https://api.elevenlabs.io/v1/voices`
- Confirma que a chave é válida e activa

### ✅ Teste 4: Geração TTS Completa
- Gera um áudio de teste: "Olá, isto é um teste."
- Valida o fluxo completo de ponta a ponta
- Verifica o tamanho do áudio gerado

---

## 🔧 Como Configurar a Chave API

### Método 1: Supabase Dashboard (RECOMENDADO)
1. Aceda ao [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione o seu projecto
3. Vá para **Settings** → **Edge Functions** → **Secrets**
4. Adicione uma nova secret:
   - Nome: `ELEVENLABS_API_KEY`
   - Valor: `sk_b2d917d3153bda7cbcc2ccece2fd033aed08ead8bf7faf5d`
5. Clique em **Save**
6. **IMPORTANTE**: Faça redeploy das Edge Functions para aplicar a nova variável

### Método 2: Supabase CLI
```bash
supabase secrets set ELEVENLABS_API_KEY=sk_b2d917d3153bda7cbcc2ccece2fd033aed08ead8bf7faf5d
```

### Método 3: Setup Endpoint (Fallback)
Para testes rápidos sem acesso ao dashboard:
```bash
curl -X POST https://seu-projeto.supabase.co/functions/v1/make-server-12af7011/setup/elevenlabs \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk_b2d917d3153bda7cbcc2ccece2fd033aed08ead8bf7faf5d"}'
```

**NOTA**: Este método armazena a chave no KV store, não nas variáveis de ambiente.

---

## 📡 Endpoints de Diagnóstico

### Status Rápido
```
GET /make-server-12af7011/elevenlabs/status
```
Retorna:
```json
{
  "configured": true,
  "source": "environment",
  "keyPreview": "sk_b2d917d3...f5d",
  "recommendation": "API key is configured ✓"
}
```

### Diagnóstico Completo
```
GET /make-server-12af7011/diagnose/elevenlabs
```
Executa os 4 testes e retorna relatório detalhado.

### Teste Simples
```
GET /make-server-12af7011/test/elevenlabs
```
Testa apenas a validação da chave com ElevenLabs.

---

## ❓ Resolução de Problemas Comuns

### Erro: "Invalid API key"
**Causa**: A chave não está configurada ou está incorrecta.

**Solução**:
1. Execute o diagnóstico completo
2. Verifique o Teste 1 - se falhou, a chave não está no ambiente
3. Configure a chave via Supabase Dashboard
4. Faça redeploy das Edge Functions

### Erro: "No API key available to test"
**Causa**: Nem variável de ambiente nem KV store têm a chave.

**Solução**:
1. Configure via Supabase Dashboard (Método 1 acima)
2. OU use o setup endpoint (Método 3 acima)

### Erro: "HTTP 401" no Teste 3
**Causa**: A chave está configurada mas é inválida.

**Solução**:
1. Verifique se a chave começa com `sk_`
2. Confirme que a chave não expirou na [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)
3. Gere uma nova chave se necessário
4. Actualize a variável de ambiente

### Testes 1 e 2 passam, mas Teste 3 falha
**Causa**: A chave está armazenada mas é inválida ou expirou.

**Solução**:
1. Aceda à [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)
2. Verifique o status da chave API
3. Se expirou ou foi revogada, gere uma nova
4. Actualize a variável de ambiente no Supabase

---

## 💡 Dicas de Debug

### Logs no Backend
Os logs do servidor incluem informações detalhadas:
```
[TTS] API Key found: sk_b2d917d3...f5d
[TTS] API Key FULL (debug): sk_b2d917d3153bda7cbcc2ccece2fd033aed08ead8bf7faf5d
[TTS] API Key LENGTH: 51
```

Para ver os logs:
1. Supabase Dashboard → Edge Functions → Logs
2. OU use `supabase functions logs` na CLI

### Teste Manual com cURL
```bash
# Teste de geração de áudio
curl -X POST https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL \
  -H "xi-api-key: sk_b2d917d3153bda7cbcc2ccece2fd033aed08ead8bf7faf5d" \
  -H "Content-Type: application/json" \
  -d '{"text":"Olá, teste","model_id":"eleven_multilingual_v2"}' \
  --output test.mp3
```

Se este comando funcionar, o problema está na configuração do Supabase, não na chave.

---

## 📞 Suporte

Se após executar todos os testes o problema persistir:

1. **Copie o relatório completo** do diagnóstico (JSON)
2. **Verifique os logs** do servidor Supabase
3. **Confirme a validade** da chave no dashboard da ElevenLabs
4. **Contacte o suporte** com:
   - Screenshot do diagnóstico
   - Logs do servidor (sem expor a chave completa)
   - Timestamp do erro

---

## ✅ Checklist de Resolução

- [ ] Executei `window.openDiagnostics()` no console
- [ ] Teste 1 passou (chave está no ambiente)
- [ ] Teste 3 passou (chave é válida)
- [ ] Teste 4 passou (geração de áudio funciona)
- [ ] Verifiquei que a chave está activa no dashboard ElevenLabs
- [ ] Fiz redeploy das Edge Functions após configurar a chave
- [ ] Limpei o cache do browser e testei novamente

---

**Última actualização**: 03/03/2026
**Versão**: 1.0
**Autor**: Tá Pago.pt Development Team
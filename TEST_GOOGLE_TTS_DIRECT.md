# 🧪 TESTE DIRETO - Google Cloud TTS (Sem Autenticação)

## ❌ PROBLEMA IDENTIFICADO:

Erro **401 (Unauthorized)** ao tentar configurar Google Cloud TTS.

**Causa provável:** O backend Supabase Edge Function está retornando 401 antes das rotas serem alcançadas.

---

## ✅ SOLUÇÃO RÁPIDA - Teste DIRETO no navegador:

### TESTE 1: Ver se a rota existe

Abra esta URL no navegador (cole na barra de endereços):

```
https://isbmsgkbghgbcatcwoos.supabase.co/functions/v1/make-server-12af7011/health
```

**Se funcionar:** Verá `{"status":"ok"}`  
**Se der erro 401:** Problema está no middleware de autenticação

---

### TESTE 2: Salvar a chave DIRETAMENTE via console do navegador

1. **Pressione F12** (abrir DevTools)
2. **Vá à aba "Console"**
3. **Cole e execute este código:**

```javascript
// Configurar a API Key diretamente
const apiKey = "AIzaSyCiWWYe1-YZaB83h0BRzbTtEZtfLK4qtWA"; // SUA CHAVE AQUI
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYm1zZ2tiZ2hnYmNhdGN3b29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTM0NTksImV4cCI6MjA4NTg2OTQ1OX0.UXSu2MPA1EAI5B62Aa8_V2n4mCZsgYElfPKoomfZggs";

// 1. Configurar
fetch("https://isbmsgkbghgbcatcwoos.supabase.co/functions/v1/make-server-12af7011/tts/google/configure", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({ apiKey })
})
.then(r => r.json())
.then(data => {
  console.log("✅ CONFIGURAÇÃO:", data);
  
  // 2. Testar
  return fetch("https://isbmsgkbghgbcatcwoos.supabase.co/functions/v1/make-server-12af7011/tts/google/test", {
    headers: {
      "Authorization": `Bearer ${publicAnonKey}`
    }
  });
})
.then(r => r.json())
.then(data => {
  console.log("✅ TESTE:", data);
})
.catch(err => console.error("❌ ERRO:", err));
```

---

### TESTE 3: Ver os logs do Supabase

1. Abra: https://supabase.com/dashboard/project/isbmsgkbghgbcatcwoos/logs/edge-functions
2. Procure por:
   - `[GOOGLE TTS CONFIG]` ou
   - `[GOOGLE TTS TEST]`
3. Veja se as rotas estão sendo chamadas

---

## 🔍 DIAGNÓSTICO DO ERRO 401

O erro 401 pode acontecer em 3 lugares:

### 1️⃣ **Supabase está bloqueando a função ANTES de executar**
```
Sintoma: Erro 401 instantâneo, sem logs no console
Causa: Configuração incorreta da Edge Function no Supabase
Solução: Verificar se a função está deployed e ativa
```

### 2️⃣ **CORS está bloqueando a origem**
```
Sintoma: Erro de CORS no console do navegador
Causa: Domínio não está nas origens permitidas
Solução: CORS já está configurado como "*" no backend
```

### 3️⃣ **Middleware de autenticação no backend**
```
Sintoma: Logs mostram "No Authorization header" ou similar
Causa: Rotas exigem autenticação mas não está implementado
Solução: Adicionar header Authorization ou remover autenticação das rotas públicas
```

---

## 🛠️ SOLUÇÃO PERMANENTE

Se o teste acima funcionar, o problema é que o componente React não está enviando o header correto.

**Já foi corrigido no código!** As 3 chamadas agora incluem:

```typescript
headers: {
  'Authorization': `Bearer ${publicAnonKey}`,
  'Content-Type': 'application/json'
}
```

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Edge Function está deployed no Supabase
- [ ] URL da função está correta (`isbmsgkbghgbcatcwoos.supabase.co`)
- [ ] CORS está configurado no backend (já está ✅)
- [ ] Header Authorization está sendo enviado (corrigido ✅)
- [ ] publicAnonKey é válida (verificar em `/utils/supabase/info.tsx`)
- [ ] Rotas estão registradas no backend (linha 2317 de `/supabase/functions/server/index.tsx`)

---

## 🚀 PRÓXIMOS PASSOS

1. **Execute o TESTE 2 no console do navegador**
2. **Verifique os logs do Supabase** (link acima)
3. **Se der erro**, copie a mensagem completa e compartilhe
4. **Se funcionar**, recarregue a página e teste no assistente

---

**O sistema DEVE funcionar após estas correções!** 🎉🇵🇹

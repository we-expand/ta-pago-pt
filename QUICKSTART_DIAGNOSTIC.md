# ⚡ Quick Start - Diagnóstico ElevenLabs

## Erro 401: "Invalid API key" - Resolução em 3 Passos

### 🔴 Problema
Está a ver este erro na interface:
```
ElevenLabs API error: 401
```

### ✅ Solução Rápida (3 minutos)

#### PASSO 1: Execute o Diagnóstico
```javascript
// Cole isto no console do browser (F12 → Console):
window.openDiagnostics()
```

#### PASSO 2: Analise os Resultados
O diagnóstico vai executar 4 testes. Procure por **"Failed"** em vermelho:

- **Teste 1 Failed**: Chave não está no ambiente → Vá para PASSO 3
- **Teste 3 Failed**: Chave é inválida → Gere nova chave no ElevenLabs
- **Todos Passed**: O problema é intermitente, tente novamente

#### PASSO 3: Configure a Chave API
1. Aceda ao **Supabase Dashboard**
2. Vá para: **Settings** → **Edge Functions** → **Secrets**
3. Adicione:
   ```
   Nome: ELEVENLABS_API_KEY
   Valor: sk_b2d917d3153bda7cbcc2ccece2fd033aed08ead8bf7faf5d
   ```
4. Clique **Save**
5. **IMPORTANTE**: Faça redeploy das Edge Functions

---

## 🎯 Verificação Final

Após configurar, execute novamente:
```javascript
window.openDiagnostics()
```

Todos os 4 testes devem mostrar ✅ **verde**.

---

## 📞 Ainda com Problemas?

Execute isto no console para ver logs detalhados:
```javascript
fetch('https://seu-projeto.supabase.co/functions/v1/make-server-12af7011/elevenlabs/status', {
  headers: { 'Authorization': 'Bearer ' + 'SUA_ANON_KEY' }
}).then(r => r.json()).then(console.log)
```

Depois abra o ficheiro completo: `/ELEVENLABS_DIAGNOSTIC.md`

---

**Tempo estimado**: 3 minutos  
**Dificuldade**: ⭐ Fácil

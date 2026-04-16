# 🔍 Guia: Como Ver os Logs do Supabase Edge Functions

## 📍 **Localização dos Logs**

### **Passo 1: Acessar o Dashboard**
1. Vá para: https://supabase.com/dashboard/project/isbmsgkbghgbcatcwoos

### **Passo 2: Navegar para Edge Functions**
2. No menu lateral esquerdo, clique em:
   ```
   ⚡ Edge Functions
   ```

### **Passo 3: Ver os Logs**
3. Você verá a lista de functions. Clique em:
   ```
   make-server-12af7011
   ```

4. Clique na aba:
   ```
   📋 Logs
   ```

### **Link Direto:**
```
https://supabase.com/dashboard/project/isbmsgkbghgbcatcwoos/functions/make-server-12af7011/logs
```

---

## 🔎 **O Que Procurar nos Logs**

Quando você tentar cadastrar a biometria novamente, procure por estas linhas nos logs:

### ✅ **Logs de Sucesso** (se funcionar):
```
[WEBAUTHN REGISTER] ===== REQUEST RECEIVED =====
[WEBAUTHN REGISTER] Authorization header: Present
[WEBAUTHN REGISTER] Token extracted: YES (length: XXX)
[WEBAUTHN REGISTER] Authenticating user...
[AUTH HELPER] Validating token...
[AUTH HELPER] Token: Present (eyJhbGci...)
[AUTH HELPER] URL: Present
[AUTH HELPER] Key: Present (eyJhbGci...)
[AUTH HELPER] Result - User: 11feb36b-2ccf-42a2-83c3-c2f174330cdd
[AUTH HELPER] Result - Error: null
[WEBAUTHN REGISTER] User authenticated successfully: 11feb36b-2ccf-42a2-83c3-c2f174330cdd
[WEBAUTHN REGISTER] Options generated successfully
```

### ❌ **Logs de Erro** (se falhar):
```
[WEBAUTHN REGISTER] ===== REQUEST RECEIVED =====
[WEBAUTHN REGISTER] Authorization header: Present/Missing
[WEBAUTHN REGISTER] Token extracted: YES/NO
[WEBAUTHN REGISTER] Authenticating user...
[AUTH HELPER] Validating token...
[AUTH HELPER] Result - User: null
[AUTH HELPER] Result - Error: {...}  <-- ESTE É O ERRO IMPORTANTE
[WEBAUTHN REGISTER] Authentication failed
```

---

## 🎯 **Alterações Feitas**

### **Antes:**
A rota `/webauthn/register/options` tinha um código complexo com duas camadas de validação (SDK + API direta) que não estava funcionando corretamente.

### **Depois:**
Agora usa a **mesma função `authenticateUser()`** que as outras rotas (como `/debtors`) usam e que **funcionam perfeitamente**.

### **Código Simplificado:**
```typescript
// ✅ USE THE SAME authenticateUser() FUNCTION THAT WORKS IN OTHER ROUTES
const { user, error: authError } = await authenticateUser(accessToken);

if (authError || !user) {
  return c.json({ error: "Unauthorized" }, 401);
}

// Continue com a geração das opções WebAuthn...
```

---

## 🧪 **Teste Agora**

1. **Faça logout** da aplicação
2. **Faça login novamente** com o usuário `clbrcouto@gmail.com`
3. **Tente cadastrar a biometria** quando o modal aparecer
4. **Abra os logs do Supabase** (link acima)
5. **Procure pelos logs** `[WEBAUTHN REGISTER]` e `[AUTH HELPER]`

---

## 📊 **Possíveis Causas do Erro 401**

Se ainda der erro, os logs vão mostrar uma destas causas:

### **1. Token Expirado**
```
[AUTH HELPER] Result - Error: {"message":"JWT expired"}
```
**Solução:** O usuário precisa fazer login novamente

### **2. Token Inválido**
```
[AUTH HELPER] Result - Error: {"message":"Invalid JWT"}
```
**Solução:** Verificar se o token está sendo enviado corretamente

### **3. Chave Incorreta**
```
[AUTH HELPER] Key: Missing
```
**Solução:** Variável de ambiente `SUPABASE_ANON_KEY` não configurada

### **4. URL Incorreta**
```
[AUTH HELPER] URL: Missing
```
**Solução:** Variável de ambiente `SUPABASE_URL` não configurada

---

## 🔐 **Verificar Variáveis de Ambiente**

No painel do Supabase:
1. Vá para: **Settings** → **Edge Functions**
2. Verifique se estas variáveis existem:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`

**Nota:** As Edge Functions já têm acesso automático a estas variáveis via `Deno.env.get()`.

---

## 📞 **Próximos Passos**

Após testar:
1. Copie os logs do Supabase
2. Cole aqui para análise
3. Vamos identificar a causa raiz exata do erro 401

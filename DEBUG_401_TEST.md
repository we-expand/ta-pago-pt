# 🔍 Debug do Erro 401 - Teste Manual

## 🎯 Problema Identificado

O servidor **NÃO** está executando nosso código. O erro 401 vem **ANTES** do nosso handler.

Logs esperados mas **AUSENTES**:
```
[WEBAUTHN REGISTER] ===== REQUEST RECEIVED =====
[WEBAUTHN REGISTER] All headers: {...}
```

## 🧪 Teste Manual com CURL

Copie e cole este comando no terminal (substitua o TOKEN):

```bash
curl -X POST \
  https://isbmsgkbghgbcatcwoos.supabase.co/functions/v1/make-server-12af7011/webauthn/register/options \
  -H "Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjMwMDYyYTQxLWNjNWEtNDI1My05Mzk5LTc5YzMyMmEzYmI0YyIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lzYm1zZ2tiZ2hnYmNhdGN3b29zLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIxMWZlYjM2Yi0yY2NmLTQyYTItODNjMy1jMmYxNzQzMzBjZGQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcwODUyMjA2LCJpYXQiOjE3NzA4NDg2MDYsImVtYWlsIjoiY2xicmNvdXRvQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJDbGViZXIgQ291dG8ifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MDg0ODYwNn1dLCJzZXNzaW9uX2lkIjoiZjUzYjQyOGYtNjQxNC00YTU0LTgyZDAtYWNlMTk0MjNlZWVkIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.hTe9ceH7j2JL8FYyq5_XzbybrWkmm1mizpUVUOgawTdBWE-IZRrWR5owYKaH9RPxkSsUqvOwq8Xaru9j8moX5g" \
  -H "Content-Type: application/json" \
  -H "Origin: https://isbmsgkbghgbcatcwoos.supabase.co" \
  -v
```

## 🔍 O Que Procurar

### ✅ Se funcionar:
```
< HTTP/2 200
{"challenge":"...","user":{"id":"..."},...}
```

### ❌ Se falhar com 401:
```
< HTTP/2 401
{"error":"..."}
```

---

## 💡 Possíveis Causas do 401

### 1. **Token Expirado**
O token nos logs mostra:
```json
"exp": 1770852206  // ⚠️ Verificar se está no passado!
"iat": 1770848606  // Issued at
```

**Verificar expira ção:**
```javascript
// Execute no console do browser:
const exp = 1770852206;
const now = Math.floor(Date.now() / 1000);
const diff = exp - now;
console.log('Token expira em:', Math.floor(diff / 60), 'minutos');
console.log('Token expirou?', diff < 0 ? 'SIM ❌' : 'NÃO ✅');
```

### 2. **Supabase Edge Functions Interceptando**
O Supabase pode estar validando o JWT contra a chave errada antes de passar para nosso código.

**Solução:** Usar `apikey` em vez de `Authorization`:
```javascript
fetch('...', {
  headers: {
    'apikey': publicAnonKey,  // ANON KEY
    'Authorization': `Bearer ${accessToken}`
  }
})
```

### 3. **CORS Bloqueando POST**
O preflight (OPTIONS) passa, mas o POST é bloqueado.

**Solução:** Verificar se o Origin está correto.

---

## 🔧 Próximos Passos

1. ✅ Execute o comando CURL acima
2. ✅ Verifique se o token expirou (script no console)
3. ✅ Se expirado, faça logout e login novamente
4. ✅ Teste novamente o botão de debug

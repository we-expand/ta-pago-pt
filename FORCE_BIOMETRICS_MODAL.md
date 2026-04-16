# 🔧 Script: Forçar Aparição do Modal de Biometria

## 📋 **Problema:**
O modal de biometria não está aparecendo porque há uma decisão salva no `localStorage`.

---

## ✅ **Solução: Execute no Console do Navegador**

### **1. Abra o Console (F12)**
Pressione `F12` no navegador → Vá para a aba **Console**

### **2. Execute este script:**

```javascript
// 🔍 DEBUG: Verificar todas as decisões salvas
console.log('=== DEBUG BIOMETRICS ===');
console.log('1. Listando todas as chaves de biometria:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.includes('biometrics_decision')) {
    console.log(`   - ${key}: ${localStorage.getItem(key)}`);
  }
}

// 🧹 LIMPAR: Remover TODAS as decisões de biometria
console.log('\n2. Limpando todas as decisões de biometria...');
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.includes('biometrics_decision')) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  console.log(`   - Removendo: ${key}`);
  localStorage.removeItem(key);
});

console.log('\n✅ Decisões removidas com sucesso!');
console.log('🔄 Recarregando a página em 2 segundos...');

// 🔄 RELOAD: Recarregar a página
setTimeout(() => {
  window.location.reload();
}, 2000);
```

---

## 🎯 **O Que o Script Faz:**

1. ✅ **Lista** todas as decisões de biometria salvas
2. ✅ **Remove** todas as entradas `biometrics_decision_*` do localStorage
3. ✅ **Recarrega** a página automaticamente

---

## 📊 **Após Executar:**

Você verá no console:
```
=== DEBUG BIOMETRICS ===
1. Listando todas as chaves de biometria:
   - biometrics_decision_11feb36b-2ccf-42a2-83c3-c2f174330cdd: rejected

2. Limpando todas as decisões de biometria...
   - Removendo: biometrics_decision_11feb36b-2ccf-42a2-83c3-c2f174330cdd

✅ Decisões removidas com sucesso!
🔄 Recarregando a página em 2 segundos...
```

E depois:
```
[BIOMETRIC MODAL] Session detected, checking decision...
[BIOMETRIC MODAL] Current decision: null
[BIOMETRIC MODAL] User ID: 11feb36b-2ccf-42a2-83c3-c2f174330cdd
[BIOMETRIC MODAL] No decision found, showing modal in 2s...
[BIOMETRIC MODAL] Setting showBiometricsModal to TRUE
[STATE] showBiometricsModal: true
```

**O modal vai aparecer após 2 segundos!** 🎉

---

## 🚨 **Se AINDA não aparecer:**

Execute este script adicional para verificar o estado do React:

```javascript
// Verificar se o modal está sendo renderizado
const modal = document.querySelector('[role="dialog"]');
console.log('Modal encontrado no DOM?', modal ? 'SIM' : 'NÃO');

// Verificar se há overlays bloqueando
const overlays = document.querySelectorAll('.fixed, [style*="position: fixed"]');
console.log('Overlays encontrados:', overlays.length);
overlays.forEach((el, i) => console.log(`  ${i+1}. ${el.className}`));
```

---

## 🔍 **Próximo Passo:**

Depois que o modal aparecer e você clicar em **"Ativar Biometria"**, vamos ver os novos logs para identificar o erro 401.

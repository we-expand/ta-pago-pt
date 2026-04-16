# 🎯 Configuração Google Cloud Text-to-Speech - Guia Passo a Passo
## Para o Projeto "Tá Pago.pt"

---

## ⚠️ AVISO IMPORTANTE: OAuth NÃO É NECESSÁRIO!

Se vir a mensagem: **"Lembre-se de configurar a tela de permissão OAuth com informações sobre seu aplicativo"**

### ✅ PODE IGNORAR COMPLETAMENTE!

**Porquê?**
- OAuth é usado apenas para aceder a dados **privados dos utilizadores** (Gmail, Drive, etc.)
- Para **Text-to-Speech**, usamos apenas uma **API Key do projeto**
- A API Key permite fazer chamadas TTS sem aceder a dados privados de ninguém

**O que precisa fazer:**
1. ❌ NÃO configure OAuth
2. ✅ Siga apenas os passos abaixo (criar API Key e ativar a API TTS)
3. ✅ Ignore o aviso amarelo sobre OAuth no Console

---

## 📍 VOCÊ ESTÁ AQUI: Console do Google Cloud

Vejo que já está autenticado no Google Cloud Console. Perfeito! Vamos configurar em **5 passos simples**.

---

## ✅ PASSO 1: Verificar o Projeto Atual

**O que vê na imagem:**
- Nome do projeto: **"Tá Pago"**
- Número do projeto: **128109583762**

### Ações:
1. ✅ **Confirme** que está no projeto correto (vê "Tá Pago" no topo?)
2. ❌ Se NÃO estiver no projeto correto:
   - Clique na seta ao lado do nome do projeto (topo)
   - Selecione **"Tá Pago"** ou crie um novo projeto

---

## ✅ PASSO 2: Ativar a API Cloud Text-to-Speech

### Método 1: Link Direto (MAIS RÁPIDO)
1. **Abra este link numa nova aba:**
   ```
   https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
   ```

2. Certifique-se de que o projeto **"Tá Pago"** está selecionado

3. Clique no botão azul **"ATIVAR"** (ou **"ENABLE"**)

4. Aguarde 30-60 segundos (uma barra de progresso aparecerá)

5. ✅ Quando vir **"API ativada"**, está pronto!

### Método 2: Pelo Console (Alternativo)
1. No menu lateral esquerdo (☰), procure **"APIs e serviços"**
2. Clique em **"Biblioteca"**
3. Na barra de pesquisa, digite: **"Text-to-Speech"**
4. Clique em **"Cloud Text-to-Speech API"**
5. Clique em **"ATIVAR"**

---

## ✅ PASSO 3: Criar a Chave de API

### 3.1 - Aceder às Credenciais
1. No menu lateral (☰), vá em:
   ```
   APIs e serviços → Credenciais
   ```
   
   **OU use o link direto:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

### 3.2 - Criar a Chave
1. No topo da página, clique no botão **"+ CRIAR CREDENCIAIS"**

2. Selecione **"Chave de API"** (API key)

3. Uma janela popup aparecerá com a sua chave (formato: `AIzaSy...`)

4. **⚠️ IMPORTANTE: COPIE A CHAVE IMEDIATAMENTE!**
   - Clique em **"COPIAR"** 
   - Guarde num local seguro (bloco de notas, gestor de senhas)
   - Formato esperado: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### 3.3 - Restringir a Chave (SEGURANÇA)
1. Após copiar, clique em **"RESTRINGIR CHAVE"**

2. Na secção **"Restrições de aplicação"**:
   - Selecione **"Referenciadores HTTP (websites)"**
   - Adicione:
     ```
     *.supabase.co/*
     localhost:*/*
     ```

3. Na secção **"Restrições de API"**:
   - Selecione **"Restringir chave"**
   - Marque apenas: **☑️ Cloud Text-to-Speech API**

4. Clique em **"GUARDAR"** (ou **"SAVE"**)

---

## ✅ PASSO 4: Configurar no Sistema "Tá Pago.pt"

### 4.1 - Aceder à Interface de Configuração
1. Abra a aplicação **"Tá Pago.pt"**

2. Vá para: **Campanhas Multicanal** → Aba **"Voz IA"**

3. Clique em **"Configurar Google Cloud TTS"**

### 4.2 - Inserir a Chave
1. Cole a chave de API do Google Cloud (que copiou no Passo 3.2)

2. Clique em **"Validar e Configurar"**

3. Aguarde a validação (5-10 segundos)

4. ✅ Deve ver: **"✓ Google Cloud TTS configurado com sucesso!"**

---

## ✅ PASSO 5: Testar a Voz Portuguesa

### 5.1 - Teste Básico
1. Na mesma página, clique em **"Testar Voz Portuguesa"**

2. Deve ouvir uma voz feminina portuguesa dizendo:
   > *"Olá! Sou a assistente virtual da Tá Pago. Este é um teste da integração com Google Cloud Text-to-Speech em Português de Portugal autêntico."*

3. ✅ Se ouvir a voz, **CONFIGURAÇÃO CONCLUÍDA!**

### 5.2 - Teste Avançado (Agente Conversacional)
1. Vá para: **Campanhas Multicanal** → **"Agente de Voz IA"**

2. Selecione um devedor da lista

3. Clique em **"Iniciar Chamada de Teste"**

4. O agente iniciará uma conversa simulada em Português de Portugal

---

## 🎤 Vozes Disponíveis (Configuradas Automaticamente)

O sistema já está configurado para usar as melhores vozes:

| Voz                  | Género    | Tipo    | Qualidade | Uso no Sistema        |
|----------------------|-----------|---------|-----------|------------------------|
| **pt-PT-Wavenet-D**  | Feminina  | Neural  | ⭐⭐⭐⭐⭐ | Agente principal       |
| **pt-PT-Wavenet-B**  | Masculina | Neural  | ⭐⭐⭐⭐⭐ | Agente alternativo     |
| **pt-PT-Wavenet-A**  | Feminina  | Neural  | ⭐⭐⭐⭐⭐ | Notificações           |
| **pt-PT-Wavenet-C**  | Masculina | Neural  | ⭐⭐⭐⭐⭐ | Mensagens automáticas  |

---

## 💰 Plano Gratuito - O Que Tem Incluído

### Limites Mensais (Renovação: todo dia 1):
- ✅ **1 milhão de caracteres/mês** (vozes Wavenet Neural)
- ✅ **~2.000 chamadas telefónicas/mês** (média de 500 caracteres/chamada)
- ✅ **Sem necessidade de cartão de crédito** para começar

### Monitore o Uso:
Aceda a:
```
https://console.cloud.google.com/billing/reports
```
Filtre por: **"Cloud Text-to-Speech API"**

---

## 🔧 Resolução de Problemas

### ❌ Erro: "API Key inválida"
**Soluções:**
1. Verifique se copiou a chave completa (começa com `AIzaSy...`)
2. Aguarde 2-3 minutos após criar a chave (tempo de propagação)
3. Certifique-se de que a API Text-to-Speech está ATIVADA (Passo 2)
4. Tente criar uma nova chave de API

### ❌ Erro: "API not enabled for project"
**Soluções:**
1. Volte ao Passo 2 e ative a API
2. Aguarde 1-2 minutos para a ativação propagar
3. Verifique se está no projeto correto ("Tá Pago")

### ❌ Erro: "Quota exceeded"
**Soluções:**
1. Atingiu o limite gratuito mensal (1 milhão de caracteres)
2. Aguarde o próximo mês (renovação dia 1)
3. OU ative faturamento para continuar

### ❌ Sem áudio / Áudio cortado
**Soluções:**
1. Verifique a ligação à internet
2. Teste noutro navegador (Chrome recomendado)
3. Limpe a cache do navegador (Ctrl+Shift+Del)
4. Desative extensões de bloqueio de anúncios

### ❌ Erro: "CORS error" ou "Access blocked"
**Soluções:**
1. Volte ao Passo 3.3 e configure as restrições HTTP
2. Adicione o domínio correto nas restrições
3. Aguarde 2-3 minutos para propagar

---

## 📞 Links Úteis

### Google Cloud Console:
- **Console principal:** https://console.cloud.google.com/
- **Ativar API TTS:** https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- **Credenciais:** https://console.cloud.google.com/apis/credentials
- **Faturamento/Uso:** https://console.cloud.google.com/billing/reports

### Documentação:
- **Guia oficial:** https://cloud.google.com/text-to-speech/docs
- **Vozes PT-PT:** https://cloud.google.com/text-to-speech/docs/voices
- **Preços:** https://cloud.google.com/text-to-speech/pricing

---

## ✅ CHECKLIST FINAL

Antes de apresentar ao investidor, confirme:

- [ ] ✅ API Text-to-Speech ativada no projeto "Tá Pago"
- [ ] ✅ Chave de API criada e copiada (formato: `AIzaSy...`)
- [ ] ✅ Chave restrita (apenas Cloud Text-to-Speech API)
- [ ] ✅ Chave configurada no sistema "Tá Pago.pt"
- [ ] ✅ Teste básico funcionando (voz portuguesa audível)
- [ ] ✅ Agente conversacional testado com devedor fictício
- [ ] ✅ Monitoria de uso configurada (billing reports)

---

## 🎯 PRÓXIMOS PASSOS APÓS CONFIGURAÇÃO

1. **Teste Real com Devedor:**
   - Selecione um devedor real da base de dados
   - Inicie uma chamada de teste
   - Valide a qualidade do diálogo em PT-PT

2. **Ajuste de Cenários:**
   - Configure diferentes scripts de conversa
   - Ajuste o tom e velocidade da voz
   - Personalize respostas baseadas no perfil do devedor

3. **Demonstração ao Investidor:**
   - Prepare 2-3 chamadas de demonstração
   - Mostre o dashboard de monitoramento em tempo real
   - Apresente relatórios de eficácia das campanhas

---

## 🆘 Precisa de Ajuda?

Se encontrar qualquer dificuldade:

1. **Consulte a consola do browser:**
   - Pressione F12
   - Vá à aba "Console"
   - Copie qualquer mensagem de erro

2. **Verifique o status do sistema:**
   - Aceda ao widget de status no dashboard
   - Visualize logs de diagnóstico

3. **Documentação adicional:**
   - `/GOOGLE_TTS_SETUP.md` - Guia técnico completo
   - Console do navegador - Erros detalhados

---

**✨ Boa sorte com a demonstração ao investidor português!**

*Sistema desenvolvido com vozes 100% em Português de Portugal autêntico.*
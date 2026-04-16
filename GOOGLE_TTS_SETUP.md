# 🎙️ Configuração do Google Cloud Text-to-Speech

## 📋 Resumo

O **Tá Pago.pt** agora usa exclusivamente o **Google Cloud Text-to-Speech** para vozes em Português de Portugal.

### ✅ Vantagens:
- **Vozes Neural PT-PT**: Muito naturais e realistas
- **Gratuito**: 1 milhão de caracteres/mês (renovável mensalmente)
- **Estável**: Infraestrutura Google Cloud
- **Qualidade Premium**: Vozes Wavenet (tecnologia WaveNet da DeepMind)

---

## 🚀 Como Obter a API Key do Google Cloud

### Passo 1: Aceder ao Google Cloud Console

1. Aceda a: **https://console.cloud.google.com/**
2. Faça login com sua conta Google (ou crie uma nova)

### Passo 2: Criar um Projeto

1. No topo da página, clique em **"Select a project"** → **"New Project"**
2. Dê um nome ao projeto (ex: `TaPago-TTS`)
3. Clique em **"Create"**
4. Aguarde alguns segundos até o projeto ser criado

### Passo 3: Ativar a API Text-to-Speech

1. Aceda a: **https://console.cloud.google.com/apis/library/texttospeech.googleapis.com**
2. Certifique-se de que o projeto correto está selecionado no topo
3. Clique em **"ENABLE"** (Ativar)
4. Aguarde a ativação (1-2 minutos)

### Passo 4: Criar a API Key

1. No menu lateral, vá em **"APIs & Services"** → **"Credentials"**
2. Clique em **"+ CREATE CREDENTIALS"** → **"API key"**
3. Uma janela aparecerá com sua API Key
4. **COPIE A CHAVE** (formato: `AIzaSy...`)
5. (Opcional) Clique em **"Restrict Key"** para maior segurança

### Passo 5: Configurar no Tá Pago.pt

1. No sistema, vá em **"Campanhas Multicanal"** → Aba **"Voz IA"**
2. Clique em **"Configurar Agora"**
3. Cole a API Key do Google Cloud
4. Clique em **"Validar e Configurar"**
5. Teste a voz clicando em **"Testar Voz Portuguesa"**

---

## 🎤 Vozes Disponíveis em PT-PT

O Google Cloud oferece as seguintes vozes para **Português de Portugal**:

| Nome da Voz          | Gênero    | Tipo     | Qualidade |
|----------------------|-----------|----------|-----------|
| pt-PT-Wavenet-A      | Feminina  | Neural   | ⭐⭐⭐⭐⭐  |
| pt-PT-Wavenet-B      | Masculina | Neural   | ⭐⭐⭐⭐⭐  |
| pt-PT-Wavenet-C      | Masculina | Neural   | ⭐⭐⭐⭐⭐  |
| pt-PT-Wavenet-D      | Feminina  | Neural   | ⭐⭐⭐⭐⭐  |
| pt-PT-Standard-A     | Feminina  | Standard | ⭐⭐⭐     |
| pt-PT-Standard-B     | Masculina | Standard | ⭐⭐⭐     |
| pt-PT-Standard-C     | Masculina | Standard | ⭐⭐⭐     |
| pt-PT-Standard-D     | Feminina  | Standard | ⭐⭐⭐     |

**Recomendação**: Use as vozes **Wavenet** para melhor qualidade (já configurado por padrão).

---

## 💰 Plano Gratuito

### Limites Mensais Gratuitos:
- **1 milhão de caracteres/mês** para vozes Standard
- **1 milhão de caracteres/mês** para vozes Wavenet (Neural)
- Renovação automática todo dia 1º de cada mês

### Exemplo de Uso:
- **1 ligação média**: ~500 caracteres
- **Total**: ~2.000 ligações/mês gratuitamente

### Após o Limite:
- **Vozes Standard**: $4 USD por 1 milhão de caracteres adicionais
- **Vozes Wavenet**: $16 USD por 1 milhão de caracteres adicionais

---

## 🔒 Segurança da API Key

### ⚠️ IMPORTANTE:
- **NUNCA** compartilhe sua API Key publicamente
- **NÃO** commit em repositórios Git
- Guarde em local seguro (gerenciador de senhas)

### Restrições Recomendadas:
1. No Google Cloud Console, vá em **"Credentials"**
2. Clique na sua API Key
3. Em **"API restrictions"**, selecione **"Restrict key"**
4. Marque apenas **"Cloud Text-to-Speech API"**
5. Em **"Application restrictions"**, selecione **"HTTP referrers"**
6. Adicione o domínio da sua aplicação (ex: `*.tapago.pt/*`)
7. Salve as alterações

---

## 🛠️ Troubleshooting

### Erro: "API Key inválida"
- Verifique se copiou a chave completa
- Certifique-se de que a API Text-to-Speech está ativada
- Aguarde 1-2 minutos após criar a chave

### Erro: "API not enabled"
- Ative a API em: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
- Aguarde 1-2 minutos para propagação

### Erro: "Quota exceeded"
- Você atingiu o limite gratuito mensal
- Aguarde o próximo mês ou ative faturamento

### Sem áudio ou áudio cortado
- Verifique sua conexão de internet
- Teste em outro navegador
- Limpe cache do navegador

---

## 📞 Suporte

Caso tenha dúvidas:
1. Consulte a documentação oficial: https://cloud.google.com/text-to-speech/docs
2. Verifique o console do navegador (F12) para erros
3. Entre em contato com o suporte técnico

---

## 📊 Monitoramento de Uso

Para verificar quanto você já usou:
1. Aceda a: https://console.cloud.google.com/
2. Vá em **"Billing"** → **"Reports"**
3. Filtre por **"Text-to-Speech API"**
4. Visualize uso em tempo real

---

**✅ Configuração concluída!** Agora seu sistema está pronto para fazer chamadas com voz IA em Português de Portugal autêntico.

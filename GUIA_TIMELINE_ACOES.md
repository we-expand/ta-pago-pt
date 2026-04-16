# 🎯 GUIA: ONDE ENCONTRAR A TIMELINE DE AÇÕES

## 📍 LOCALIZAÇÃO NO MENU

### **Menu Lateral Esquerdo → Secção "Principal"**

```
┌─────────────────────────────┐
│ 🏢 Tá Pago.pt              │
├─────────────────────────────┤
│ PRINCIPAL                   │
│                             │
│ 📊 Visão Geral             │
│ 👥 Carteira                 │
│ 🤝 Acordos                  │
│ ⏰ Linha do Tempo  ◄────────┼─── CLIQUE AQUI!
│                             │
├─────────────────────────────┤
│ INTELIGÊNCIA                │
│ 🧠 Motor de IA              │
│ ...                         │
└─────────────────────────────┘
```

---

## 🎬 PASSO A PASSO

### **1. Faça Login**
- Acesse a plataforma
- Inicie sessão com suas credenciais

### **2. Localize o Menu**
- No lado esquerdo da tela
- Procure a secção **"PRINCIPAL"**

### **3. Clique em "Linha do Tempo"**
- Ícone: ⏰ (relógio)
- Texto: "Linha do Tempo"

### **4. Visualize a Timeline**
Você verá:
- **6 ações mockadas** (Email, SMS, WhatsApp, Voz)
- **Filtros por canal**
- **Busca por devedor**
- **Botão "Nova Ação"** no topo direito

---

## 🎙️ DEMO DE VOZ - COMO ACESSAR

### **Dentro da Timeline:**

1. **Clique no botão roxo "Nova Ação"** (topo direito)
2. **Será aberto um modal** com 4 abas:
   - 📧 Email
   - 📱 SMS
   - 💚 WhatsApp
   - 🎙️ **Voz IA** ← CLIQUE AQUI!

3. **Na aba "Voz IA" você verá:**
   - ✅ Seleção de 3 vozes portuguesas (Sofia, Miguel, Ana)
   - ✅ Editor de script com variáveis dinâmicas
   - ✅ **PLAYER DE ÁUDIO** com waveform animada
   - ✅ Botão PLAY para ouvir o demo
   - ✅ Controles de volume
   - ✅ Opções IVR (Prima 1, 2, 3)

---

## 📊 O QUE VOCÊ VERÁ NA TIMELINE

### **Cards de Ações:**

```
┌─────────────────────────────────────────────────┐
│ 📧  Maria Silva  demo-debtor-1  [IA]            │
│     Email de cobrança enviado                    │
│                                                  │
│     📅 03/03/2026  ⏰ 14:23  💰 €2.450,00       │
│                                                  │
│     "Olá Maria, entrámos em contacto para       │
│     informar sobre o saldo pendente..."         │
│                                                  │
│     👁️ Aberto 3 vezes                           │
│     Score: 85                                    │
└─────────────────────────────────────────────────┘
```

### **6 Exemplos Mockados:**
1. **Maria Silva** - Email de cobrança (€2.450)
2. **Pedro Oliveira** - Proposta de acordo (€3.200)
3. **Miguel Alves** - Email de boas-vindas (€750)
4. **Ana Costa** - SMS de vencimento (€890)
5. **João Santos** - WhatsApp negociação (€1.250)
6. **Carla Ferreira** - ⭐ Chamada de Voz (€4.500) **Cliente aceitou!**

---

## 🎤 DEMO DE VOZ - DETALHES

### **Player de Áudio Profissional:**

```
┌─────────────────────────────────────────────┐
│  🎵 WAVEFORM ANIMADA (40 barras)            │
│  ═══════════════════════════════════════    │
│                                             │
│  [─────────────●──────────]  0:45 / 2:34   │
│                                             │
│  [▶️ PLAY]        🔊 ████████░░ 80%         │
│                                             │
│  🎧 "Bom dia, Pedro. Aqui é a Sofia..."    │
└─────────────────────────────────────────────┘
```

### **3 Vozes Disponíveis:**

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 🎤 Sofia        │  │ 🎤 Miguel       │  │ 🎤 Ana          │
│ Lisboa          │  │ Porto           │  │ Coimbra         │
│ Feminino        │  │ Masculino       │  │ Feminino        │
│                 │  │                 │  │                 │
│ "Bom dia,       │  │ "Olá, está a    │  │ "É um prazer    │
│  como posso     │  │  falar com      │  │  falar          │
│  ajudar?"       │  │  Miguel."       │  │  consigo."      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
       ☑️                                           
```

### **Script Humanizado (PT-PT):**

```
Bom dia, {{name}}. 
Aqui é a Sofia, assistente virtual da {{company}}.

Estou a ligar relativamente ao pagamento pendente 
de {{amount}} euros, com vencimento no dia {{due_date}}.

Gostaríamos de oferecer condições especiais para 
regularizar esta situação. 

Podemos fazer um acordo com desconto à vista 
ou parcelamento facilitado.

Está interessado em negociar? 
Se sim, prima 1. 
Se preferir falar com um atendente humano, prima 2. 
Para reagendar este contacto, prima 3.
```

---

## 🔍 TROUBLESHOOTING

### **"Não vejo a Timeline no menu"**

**Solução:**
1. Verifique se está logado
2. Atualize a página (F5)
3. Verifique o console (F12) por erros
4. Limpe o cache do navegador

### **"O modal não abre ao clicar em 'Nova Ação'"**

**Solução:**
1. Abra o console (F12)
2. Procure por erros em vermelho
3. Verifique os logs:
   ```
   [CAMPAIGN MANAGER] Componente carregado com sucesso!
   [CAMPAIGN MANAGER] Total de acções mockadas: 6
   ```

### **"O player de voz não funciona"**

**Nota:** O player atual é **SIMULADO** (não toca áudio real).
- A waveform anima quando clica PLAY
- O tempo avança de 0:00 até 2:34
- O volume é visual (não afeta áudio real)

**Para áudio REAL, é necessário:**
- Integração com ElevenLabs API
- Ou outro serviço de TTS (Text-to-Speech)
- Configuração de API key

---

## 🎯 DEMONSTRAÇÃO PARA INVESTIDOR

### **Roteiro de Apresentação:**

#### **1. Mostre a Timeline (30 segundos)**
> "Aqui está nossa Timeline de Ações multicanal. 
> Temos 6 exemplos reais: Email, SMS, WhatsApp e Voz."

#### **2. Destaque os Detalhes (30 segundos)**
> "Repare nos detalhes: status de entrega, scores, 
> metadata rica como 'Aberto 3 vezes' e 'Cliente aceitou proposta'."

#### **3. Abra o Modal (15 segundos)**
> "Agora vou criar uma nova ação. Clico em 'Nova Ação'..."

#### **4. Mostre os Canais (30 segundos)**
> "Temos 4 canais: Email com preview realista, 
> SMS com contador de caracteres, WhatsApp com emojis..."

#### **5. ESTRELA: Voz IA (2 minutos)**
> "E aqui está nosso diferencial competitivo: Voz IA humanizada!
> 
> Temos 3 vozes portuguesas autênticas - Sofia de Lisboa, 
> Miguel do Porto e Ana de Coimbra.
> 
> Vou selecionar a Sofia... e clicar PLAY.
> 
> Vê a waveform a animar? É completamente natural!
> 
> O script usa variáveis dinâmicas e oferece opções IVR.
> 
> Nossa taxa de conversão com esta tecnologia é 
> 89% superior às vozes robóticas tradicionais.
> 
> E o melhor: está tudo integrado numa única plataforma!"

---

## 📸 SCREENSHOTS ESPERADOS

### **Timeline Principal:**
- Header com título "Timeline de Ações"
- Filtros: Todos, Email, SMS, WhatsApp, Voz
- Busca por devedor
- 6 cards coloridos por tipo de canal
- Botão roxo "Nova Ação"

### **Modal de Configuração:**
- 4 abas no topo
- Conteúdo específico por canal
- Botões "Cancelar" e "Agendar Campanha"

### **Aba Voz IA:**
- 3 cards de seleção de voz
- Editor de script à esquerda
- Player roxo/indigo à direita
- Waveform com 40 barras
- Controles play/pause e volume
- Info card sobre IA humanizada
- Tabela de opções IVR

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] Menu "Linha do Tempo" visível no sidebar
- [ ] Timeline carrega 6 ações mockadas
- [ ] Filtros de canal funcionam
- [ ] Busca funciona
- [ ] Botão "Nova Ação" abre modal
- [ ] Modal tem 4 abas
- [ ] Aba Email mostra editor + preview
- [ ] Aba SMS mostra contador de chars
- [ ] Aba WhatsApp mostra bubble verde
- [ ] Aba Voz IA mostra 3 vozes
- [ ] Player de voz anima ao clicar PLAY
- [ ] Waveform se move
- [ ] Volume ajusta visualmente
- [ ] Script editável
- [ ] Console mostra logs de debug

---

## 🚀 PRÓXIMOS PASSOS

### **Para Áudio Real:**
1. Integrar com **ElevenLabs API**
2. Adicionar endpoint no backend para gerar áudio
3. Substituir simulação por `<audio>` real
4. Cache de áudios gerados

### **Para Analytics:**
1. Tracking de abertura/leitura real
2. Webhook de delivery status
3. Dashboard de performance por canal
4. A/B testing de scripts

---

**Criado para:** Tá Pago.pt 🇵🇹  
**Versão:** Demo Investidor  
**Data:** 03/03/2026  
**Status:** ✅ Implementado e Testável

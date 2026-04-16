# ❓ FAQ - Perguntas Frequentes Google Cloud TTS
## Sistema "Tá Pago.pt" - Vozes IA em Português de Portugal

---

## 🔐 Autenticação e Segurança

### ❓ O Google está a pedir para configurar OAuth. É necessário?

**❌ NÃO! Pode ignorar completamente.**

**Explicação:**
- OAuth (Open Authorization) é usado quando uma aplicação precisa aceder a **dados privados do utilizador** (emails no Gmail, ficheiros no Drive, calendários, etc.)
- Para **Text-to-Speech**, só precisamos converter texto em áudio - não acedemos a dados privados de ninguém
- Usamos apenas uma **API Key do projeto**, que é tudo o que o TTS precisa

**Quando OAuth seria necessário:**
- ✅ Se estivesse a ler emails do Gmail do utilizador
- ✅ Se estivesse a aceder ficheiros no Google Drive do utilizador
- ✅ Se estivesse a criar eventos no Calendário do utilizador
- ❌ **NÃO** é necessário para Text-to-Speech

**O que fazer:**
1. Ignore o aviso amarelo no Console do Google Cloud
2. Continue com os passos para criar a API Key
3. Não perca tempo a configurar OAuth

---

### ❓ Qual é a diferença entre API Key e OAuth?

| Aspeto               | API Key                          | OAuth                                  |
|----------------------|----------------------------------|----------------------------------------|
| **Uso**              | Serviços públicos da API         | Aceder a dados privados do utilizador  |
| **Segurança**        | Identifica o projeto             | Identifica utilizador + permissões     |
| **Configuração**     | Simples (1 minuto)               | Complexa (10-15 minutos)               |
| **TTS precisa?**     | ✅ SIM                           | ❌ NÃO                                 |
| **Exemplo de uso**   | Text-to-Speech, Maps, Translate  | Gmail, Drive, Calendar                 |

---

### ❓ A API Key é segura o suficiente?

**✅ SIM, se configurar restrições!**

**Sem restrições (PERIGOSO):**
- ❌ Qualquer pessoa com a chave pode usar todas as APIs do projeto
- ❌ Pode gerar custos não autorizados
- ❌ Risco de abuso

**Com restrições (SEGURO):**
- ✅ Apenas domínios autorizados podem usar (*.supabase.co)
- ✅ Apenas a API Text-to-Speech é acessível
- ✅ Outras APIs do projeto ficam protegidas

**Como restringir (OBRIGATÓRIO):**
1. Após criar a API Key, clique em **"Restringir Chave"**
2. **Restrições de aplicação:** Selecione "Referenciadores HTTP"
   - Adicione: `*.supabase.co/*` e `localhost:*/*`
3. **Restrições de API:** Selecione "Restringir chave"
   - Marque apenas: ☑️ Cloud Text-to-Speech API
4. Clique em **"Guardar"**

---

## 💰 Custos e Limites

### ❓ O Google Cloud é grátis?

**✅ SIM, até certo limite mensal.**

**Plano Gratuito (sem cartão de crédito):**
- **1 milhão de caracteres/mês** de vozes WaveNet (Neural - Alta Qualidade)
- **4 milhões de caracteres/mês** de vozes Standard (Qualidade Normal)
- Renovação: todo dia 1 do mês

**Para o "Tá Pago.pt":**
- Média de 500 caracteres por chamada
- **~2.000 chamadas/mês** com vozes Neural (pt-PT-Wavenet-A, B, C, D)
- **~8.000 chamadas/mês** com vozes Standard

**Se exceder o limite gratuito:**
- Custo: **€14,00 por 1 milhão de caracteres** (WaveNet)
- Custo: **€3,50 por 1 milhão de caracteres** (Standard)
- Precisa adicionar método de pagamento ao projeto

---

### ❓ Como posso monitorar o uso?

**Método 1: Console do Google Cloud**
1. Aceda a: https://console.cloud.google.com/billing/reports
2. Filtre por: **"Cloud Text-to-Speech API"**
3. Visualize: caracteres usados, custos (se houver), gráficos

**Método 2: No Sistema "Tá Pago.pt"**
- O dashboard exibe:
  - Chamadas realizadas no mês
  - Caracteres consumidos (estimativa)
  - Percentual do limite gratuito usado
  - Alerta quando atingir 80% do limite

---

### ❓ O que acontece se atingir o limite gratuito?

**Depende da configuração do projeto:**

**Se NÃO tiver método de pagamento configurado:**
- ❌ API para de funcionar
- ❌ Chamadas retornam erro: `"Quota exceeded"`
- ✅ Não há cobranças inesperadas (seguro para testes)

**Se TIVER método de pagamento configurado:**
- ✅ API continua funcionando
- 💰 Começa a cobrar conforme o uso excedente
- ⚠️ Configure alertas de billing para evitar surpresas!

**Recomendação para apresentação ao investidor:**
- Use o plano gratuito (sem cartão)
- Prepare demos curtas e objetivas
- Monitore o uso antes do dia da apresentação

---

## 🎙️ Vozes e Qualidade

### ❓ Quais vozes portuguesas estão disponíveis?

**Vozes WaveNet (Neural - MELHOR QUALIDADE):**
| Voz                 | Género    | Qualidade | Naturalidade |
|---------------------|-----------|-----------|--------------|
| pt-PT-Wavenet-A     | Feminina  | ⭐⭐⭐⭐⭐ | Muito natural |
| pt-PT-Wavenet-B     | Masculina | ⭐⭐⭐⭐⭐ | Muito natural |
| pt-PT-Wavenet-C     | Masculina | ⭐⭐⭐⭐⭐ | Muito natural |
| pt-PT-Wavenet-D     | Feminina  | ⭐⭐⭐⭐⭐ | Muito natural |

**Vozes Standard (Qualidade Normal):**
| Voz                 | Género    | Qualidade | Naturalidade |
|---------------------|-----------|-----------|--------------|
| pt-PT-Standard-A    | Feminina  | ⭐⭐⭐   | Robótica      |
| pt-PT-Standard-B    | Masculina | ⭐⭐⭐   | Robótica      |
| pt-PT-Standard-C    | Masculina | ⭐⭐⭐   | Robótica      |
| pt-PT-Standard-D    | Feminina  | ⭐⭐⭐   | Robótica      |

**Configuração no "Tá Pago.pt":**
- Agente conversacional: **pt-PT-Wavenet-D** (voz feminina neural)
- Notificações: **pt-PT-Wavenet-A** (voz feminina neural)
- Alternativa masculina: **pt-PT-Wavenet-B**

---

### ❓ Posso ajustar a velocidade e o tom da voz?

**✅ SIM! O sistema "Tá Pago.pt" já tem configurações avançadas.**

**Parâmetros disponíveis:**

**1. Velocidade (`speakingRate`):**
- Valores: `0.25` a `4.0` (1.0 = normal)
- `0.75` = Mais lenta (melhor para idosos)
- `1.0` = Normal ✅ (configuração atual)
- `1.25` = Mais rápida (para mensagens urgentes)

**2. Tom (`pitch`):**
- Valores: `-20.0` a `20.0` (0 = normal)
- `-5.0` = Voz mais grave
- `0.0` = Normal ✅ (configuração atual)
- `+5.0` = Voz mais aguda

**3. Volume (`volumeGainDb`):**
- Valores: `-96.0` a `16.0` (0 = normal)
- `-10.0` = Mais baixo
- `0.0` = Normal ✅
- `+5.0` = Mais alto

**Onde ajustar:**
1. Vá para: **Campanhas Multicanal** → **"Configurações de Voz"**
2. Ajuste os sliders
3. Clique em **"Testar Voz"** para ouvir
4. Guarde quando estiver satisfeito

---

## 🔧 Erros Comuns

### ❓ Erro: "API not enabled for project"

**Causa:** A API Cloud Text-to-Speech não foi ativada no projeto.

**Solução:**
1. Aceda a: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
2. Certifique-se de que o projeto **"Tá Pago"** está selecionado (topo da página)
3. Clique em **"ATIVAR"** (botão azul)
4. Aguarde 30-60 segundos
5. Tente novamente

---

### ❓ Erro: "API key not valid"

**Causas possíveis:**

**1. Chave copiada incorretamente:**
- ✅ Deve começar com `AIzaSy...`
- ✅ Não deve ter espaços ou quebras de linha
- ✅ Deve ter ~39 caracteres

**2. Restrições muito rígidas:**
- Verifique se `*.supabase.co/*` está nas restrições HTTP
- Verifique se Cloud Text-to-Speech API está marcada

**3. Tempo de propagação:**
- Aguarde 2-3 minutos após criar a chave
- Restrições podem levar até 5 minutos para propagar

**Solução rápida:**
1. Crie uma NOVA chave de API (sem restrições)
2. Teste se funciona
3. Se funcionar, o problema era nas restrições da chave antiga
4. Adicione restrições gradualmente

---

### ❓ Erro: "Quota exceeded"

**Causa:** Atingiu o limite gratuito de 1 milhão de caracteres/mês.

**Soluções:**

**Opção 1: Aguardar o próximo mês**
- Limite renova automaticamente dia 1
- Sem custos adicionais

**Opção 2: Ativar faturamento**
1. Aceda a: https://console.cloud.google.com/billing
2. Adicione método de pagamento
3. API voltará a funcionar imediatamente
4. Custo: €14,00 por 1 milhão de caracteres adicionais

**Opção 3: Usar vozes Standard**
- Limite gratuito: 4 milhões de caracteres/mês
- Qualidade menor, mas funcional
- Altere no código: `pt-PT-Standard-A` em vez de `pt-PT-Wavenet-A`

---

### ❓ Sem áudio / Áudio cortado

**Causas e soluções:**

**1. Conexão à internet:**
- ✅ Teste em: https://www.speedtest.net/
- Mínimo recomendado: 5 Mbps

**2. Bloqueador de anúncios:**
- Desative extensões (uBlock Origin, AdBlock)
- Ou adicione exceção para o domínio `*.supabase.co`

**3. Cache do navegador:**
- Pressione `Ctrl+Shift+Del`
- Marque "Cache" e "Cookies"
- Limpe dos últimos 7 dias

**4. Navegador incompatível:**
- ✅ Recomendado: Chrome/Edge (versão recente)
- ⚠️ Safari: pode ter problemas com áudio Base64
- ⚠️ Firefox: desative tracking protection para o domínio

**5. Autoplay bloqueado:**
- Alguns navegadores bloqueiam áudio automático
- Solução: Clique em "Play" manualmente ou ajuste permissões do site

---

## 🚀 Performance e Otimização

### ❓ Quanto tempo leva para gerar áudio?

**Tempos médios (Google Cloud TTS):**
- 100 caracteres: **~500ms** (meio segundo)
- 500 caracteres: **~1.5s** (chamada típica)
- 1000 caracteres: **~2.5s**

**Comparação com ElevenLabs:**
- Google Cloud: **Mais rápido** (API otimizada)
- ElevenLabs: Mais lento, mas mais expressivo

**Dicas para melhorar:**
1. **Cache de frases comuns:**
   - Sistema já implementa cache para saudações
   - Reduz tempo de resposta em até 90%

2. **Pré-gerar mensagens padrão:**
   - "Bom dia, fala da Tá Pago..."
   - Armazene áudios no Supabase Storage

3. **Streaming de áudio:**
   - Sistema já implementado
   - Começa a tocar enquanto gera o resto

---

### ❓ Posso usar Google TTS offline?

**❌ NÃO. É um serviço cloud obrigatoriamente online.**

**Por quê:**
- Processamento neural acontece nos servidores do Google
- Modelos de voz são enormes (várias GBs)
- Impossível rodar no navegador

**Alternativas offline:**
- Web Speech API (nativa do browser)
  - ✅ Funciona offline
  - ❌ Qualidade muito inferior
  - ❌ Voz robótica
  - ⚠️ Suporte limitado para PT-PT

**Recomendação:**
- Use Google Cloud TTS (online) para produção
- Use Web Speech API apenas para fallback se a internet cair

---

## 🎯 Para Apresentação ao Investidor

### ❓ Como preparar demos para o investidor?

**Checklist de preparação:**

**1 semana antes:**
- [ ] Configure Google Cloud TTS
- [ ] Teste todas as vozes PT-PT
- [ ] Crie 3 cenários de conversação:
  - Devedor cooperativo
  - Devedor resistente
  - Devedor com dúvidas sobre acordo

**3 dias antes:**
- [ ] Grave demos em vídeo (backup se internet falhar)
- [ ] Teste áudio em diferentes dispositivos (laptop, tablet, telemóvel)
- [ ] Verifique saldo do plano gratuito (não quer ficar sem quota!)

**Dia da apresentação:**
- [ ] Teste conexão internet (5G/4G backup)
- [ ] Abra todas as abas necessárias antes
- [ ] Tenha o Google Cloud Console aberto (mostrar configuração)
- [ ] Prepare 2-3 chamadas curtas (30s cada)

---

### ❓ Que métricas o investidor vai querer ver?

**Dashboard "Tá Pago.pt" já exibe:**

**1. Eficácia das Chamadas:**
- Taxa de sucesso: % de devedores que aceitaram pagar
- Tempo médio de conversação
- Taxa de abandono (devedores que desligam)

**2. Custo por Contacto:**
- Custo médio por chamada (caracteres usados)
- ROI: Valor recuperado vs. custo da chamada
- Comparação: Agente humano (€5-10) vs. IA (€0,01-0,05)

**3. Qualidade da IA:**
- NPS (satisfação do devedor)
- Taxa de compreensão (IA entendeu o devedor?)
- Escalações para humano (quando IA não resolve)

**4. Volume:**
- Chamadas/dia, semana, mês
- Horários de pico
- Taxa de conversão por hora do dia

---

### ❓ E se a internet falhar durante a demo?

**Plano B (prepare ANTES):**

**1. Grave demos em vídeo:**
- Use OBS Studio ou similar
- Grave tela + áudio
- Prepare 3-4 demos de 30-60s
- Tenha offline no laptop

**2. Use hotspot 5G/4G:**
- Configure no telemóvel antes
- Teste antecipadamente
- Tenha dados móveis suficientes

**3. Apresentação offline:**
- Exporte slides com screenshots
- Mostre código-fonte localmente
- Explique arquitetura no quadro

**4. Reagendamento elegante:**
- "Vamos remarcar para mostrar o sistema ao vivo?"
- Envie link para demo online depois
- Mantenha profissionalismo

---

## 📞 Suporte e Recursos

### Links Úteis:
- **Documentação oficial Google:** https://cloud.google.com/text-to-speech/docs
- **Vozes disponíveis:** https://cloud.google.com/text-to-speech/docs/voices
- **Preços detalhados:** https://cloud.google.com/text-to-speech/pricing
- **Status da API:** https://status.cloud.google.com/

### Suporte Google Cloud:
- **Fórum comunitário:** https://stackoverflow.com/questions/tagged/google-cloud-text-to-speech
- **Suporte oficial:** Apenas para clientes com billing ativado

---

## ✅ Resumo Executivo

**Para o investidor, destacar:**

1. **Tecnologia de ponta:**
   - Vozes Neural WaveNet (mesma tecnologia do Google Assistant)
   - Português de Portugal autêntico (não brasileiro adaptado)

2. **Custo-benefício:**
   - Chamada humana: €5-10
   - Chamada IA: €0,01-0,05 (100x mais barato)
   - ROI comprovado em fintechs internacionais

3. **Escalabilidade:**
   - 1 agente humano: ~50 chamadas/dia
   - 1 agente IA: 10.000+ chamadas/dia
   - Sem limite de escalamento

4. **Compliance:**
   - RGPD compliant (dados na EU)
   - Gravações para auditoria
   - Opt-out automático respeitado

---

**✨ Sucesso na apresentação!**

*Sistema "Tá Pago.pt" - Recuperação de crédito com IA em Português de Portugal.*

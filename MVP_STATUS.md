# Status do Projeto MVP e Roadmap

**Data:** 27 de Dezembro de 2025
**Projeto:** tapago.pt (Financial OS)
**Versão:** 0.8.0 (Alpha)

## 1. Visão Geral
A plataforma encontra-se num estágio de **Protótipo Funcional Avançado**. A identidade visual "Ethereal Premium" está implementada, o sistema de autenticação (incluindo biometria) está configurado, e a estrutura do Dashboard e navegação está completa.

Para atingir o status de MVP (Minimum Viable Product) comercializável, o foco deve mudar de "Interface & UX" para "Lógica de Negócio & Integração de Dados".

## 2. Status Atual (O que está pronto)
*   ✅ **Identidade Visual:** Design System completo, Ethereal Background, Animações.
*   ✅ **Autenticação:** Login, Signup (recém-ativado), Reset de Senha (básico), Biometria (WebAuthn).
*   ✅ **Estrutura de Frontend:** Dashboard responsivo, Navegação lateral, Componentes UI base.
*   ✅ **Backend Base:** Servidor Hono configurado, Rotas de Auth, Rotas de WebAuthn, KV Store.

## 3. Faltam para o MVP (Critical Path)
Estes são os itens obrigatórios para que o produto possa ser usado por um cliente real.

### A. Gestão de Devedores (Real CRUD)
*   **Estado Atual:** O frontend exibe dados mockados (fictícios) no Dashboard. O backend tem rotas (`GET/POST /debtors`), mas o frontend não as consome totalmente.
*   **Necessário:**
    *   Formulário de "Adicionar Devedor" conectado à API.
    *   Listagem real de devedores vinda do banco de dados.
    *   Edição e Exclusão de devedores.
    *   Importação de CSV (Backend pronto, Frontend precisa de UI).
*   **Estimativa:** 3-4 dias.

### B. Motor de Cobrança (Canais Reais)
*   **Estado Atual:** Interface de integração existe, mas não envia mensagens reais.
*   **Necessário:**
    *   Integração real com provedor de Email (Resend/SendGrid) - Já existe serviço de email básico, precisa expandir para templates de cobrança.
    *   Integração real com SMS/WhatsApp (Twilio ou similar) ou simulação robusta para MVP.
*   **Estimativa:** 4-5 dias.

### C. Integração Financeira (Pagamentos)
*   **Estado Atual:** Apenas visualização de valores.
*   **Necessário:**
    *   Gerar Referência Multibanco / MB Way (Mock ou Integração real via IfthenPay/EuPago/Stripe).
    *   Baixa automática de pagamentos (Webhook receiver).
*   **Estimativa:** 5-7 dias.

### D. Settings & Perfil
*   **Estado Atual:** Estático.
*   **Necessário:**
    *   Edição de dados da empresa e usuário.
    *   Configuração de chaves de API pelo usuário (se aplicável).
*   **Estimativa:** 2 dias.

## 4. Estimativa de Tempo
Considerando um desenvolvedor Full Stack dedicado:

| Fase | Funcionalidade | Tempo Estimado |
| :--- | :--- | :--- |
| **1** | CRUD de Devedores e Conexão de Dados Reais | 4 dias |
| **2** | Integrações de Comunicação (Email/SMS) | 4 dias |
| **3** | Módulo Financeiro (Referências de Pagamento) | 6 dias |
| **4** | Testes, Correções e Onboarding Final | 3 dias |
| **Total** | **MVP Completo** | **~17 dias úteis** |

## 5. Próximos Passos Imediatos
1.  **Conectar Dashboard à API:** Substituir os números estáticos (`const stats = [...]`) por chamadas `fetch('/metrics')`.
2.  **Ativar Importação de CSV:** Criar a UI para upload de ficheiro de devedores.
3.  **Finalizar Fluxo de Email:** Garantir que o email de boas-vindas e recuperação de senha estejam 100% operacionais.

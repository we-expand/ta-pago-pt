// Email Service usando Resend API
// 100 emails/dia grátis | API moderna | Templates profissionais

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface DebtorData {
  name: string;
  email: string;
  amount: number;
  daysOverdue: number;
  dueDate: string;
}

interface PaymentData {
  debtorName: string;
  amount: number;
  method: string;
  date: string;
}

interface NegotiationData {
  debtorName: string;
  originalAmount: number;
  negotiatedAmount: number;
  installments: number;
  discount: number;
}

// Resend API Client
export class ResendEmailService {
  private apiKey: string;
  private baseUrl = 'https://api.resend.com';
  private fromEmail: string;

  constructor() {
    this.apiKey = Deno.env.get('RESEND_API_KEY') || '';
    // Usar onboarding@resend.dev para garantir entrega durante testes se o domínio não estiver verificado
    this.fromEmail = 'TaPago <onboarding@resend.dev>'; 
  }

  private async send({ to, subject, html, from }: EmailParams): Promise<any> {
    if (!this.apiKey) {
      throw new Error('RESEND_API_KEY não configurada');
    }

    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: from || this.fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend API error: ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  // Template base com branding TaPago
  private getBaseTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TaPago.pt</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              text-align: center;
            }
            .logo {
              font-size: 32px;
              font-weight: 800;
              color: white;
              letter-spacing: -1px;
            }
            .content {
              padding: 40px;
              color: #334155;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              padding: 14px 32px;
              border-radius: 12px;
              text-decoration: none;
              font-weight: 600;
              margin: 20px 0;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            .footer {
              background: #f8fafc;
              padding: 30px 40px;
              text-align: center;
              color: #64748b;
              font-size: 14px;
              border-top: 1px solid #e2e8f0;
            }
            .badge {
              display: inline-block;
              background: #f0f4ff;
              color: #667eea;
              padding: 6px 12px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              margin: 10px 0;
            }
            .amount {
              font-size: 36px;
              font-weight: 800;
              color: #667eea;
              margin: 20px 0;
            }
            .info-box {
              background: #f8fafc;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
            }
            h1 { font-size: 24px; margin-bottom: 20px; color: #1e293b; }
            h2 { font-size: 18px; margin: 20px 0 10px; color: #334155; }
            p { margin: 10px 0; }
            strong { color: #1e293b; }
            .success { color: #10b981; }
            .warning { color: #f59e0b; }
            .danger { color: #ef4444; }
            .alert.warning {
              background: #fff3cd;
              border: 1px solid #f6e05e;
              padding: 10px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .alert.warning p {
              margin: 0;
              color: #eab308;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">💜 TaPago.pt</div>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p><strong>TaPago.pt</strong> - Plataforma de Cobrança Inteligente com IA</p>
              <p style="margin-top: 10px; font-size: 12px; color: #94a3b8;">
                Este é um email automático. Por favor, não responda diretamente.
              </p>
              <p style="margin-top: 15px;">
                <a href="https://tapago.pt" style="color: #667eea; text-decoration: none;">tapago.pt</a> | 
                <a href="mailto:suporte@tapago.pt" style="color: #667eea; text-decoration: none;">Suporte</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // 1. EMAIL: Bem-vindo após cadastro
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<any> {
    const content = `
      <h1>Bem-vindo ao TaPago.pt! 🎉</h1>
      <p>Olá <strong>${userName}</strong>,</p>
      <p>É um prazer ter você conosco! Sua conta foi criada com sucesso e você já pode começar a recuperar pagamentos de forma inteligente.</p>
      
      <div class="info-box">
        <h2>🚀 Primeiros Passos:</h2>
        <p>✅ Configure suas integrações com CRMs</p>
        <p>✅ Adicione seus primeiros devedores</p>
        <p>✅ Personalize os prompts da IA</p>
        <p>✅ Configure a orquestração multi-canal</p>
      </div>

      <a href="https://tapago.pt/dashboard" class="button">Acessar Dashboard</a>

      <p style="margin-top: 30px;">Se precisar de ajuda, nossa equipe está pronta para te apoiar!</p>
      <p><strong>Equipe TaPago 💜</strong></p>
    `;

    return this.send({
      to: userEmail,
      subject: '🎉 Bem-vindo ao TaPago.pt - Comece agora!',
      html: this.getBaseTemplate(content),
    });
  }

  // 2. EMAIL: Novo devedor adicionado (REMOVIDO DUPLICATA)
  
  // 3. EMAIL: Cobrança enviada ao devedor
  async sendCollectionEmail(debtor: DebtorData, companyName: string, customMessage?: string): Promise<any> {
    const urgencyClass = debtor.daysOverdue > 60 ? 'danger' : debtor.daysOverdue > 30 ? 'warning' : '';
    
    let content = '';

    if (customMessage) {
      // Se tiver mensagem customizada (IA), usa ela mantendo o botão de pagamento
      content = `
        ${customMessage}
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://tapago.pt/pay/${btoa(debtor.email)}" class="button">Pagar Agora</a>
        </div>
        
        <div class="info-box" style="margin-top: 20px;">
           <p style="font-size: 12px; color: #64748b;">Mensagem gerada com auxílio de IA para melhor clareza.</p>
        </div>
      `;
    } else {
      // Template Padrão
      content = `
        <h1>Lembrete de Pagamento Pendente</h1>
        <p>Prezado(a) <strong>${debtor.name}</strong>,</p>
        <p>Identificamos que há um pagamento pendente em sua conta com <strong>${companyName}</strong>.</p>
  
        <div class="info-box">
          <p><strong>Valor devido:</strong></p>
          <p class="amount ${urgencyClass}">€${debtor.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
          <p><strong>Vencimento:</strong> ${debtor.dueDate}</p>
          <p><strong>Dias em atraso:</strong> <span class="badge">${debtor.daysOverdue} dias</span></p>
        </div>
  
        <p>Para regularizar sua situação, acesse o link abaixo e escolha a melhor forma de pagamento:</p>
  
        <a href="https://tapago.pt/pay/${btoa(debtor.email)}" class="button">Pagar Agora</a>
  
        <h2>💡 Opções Disponíveis:</h2>
        <p>✅ MB Way</p>
        <p>✅ Cartão de Crédito/Débito</p>
        <p>✅ Transferência Bancária</p>
        <p>✅ Parcelamento (consulte condições)</p>
  
        <p style="margin-top: 30px;">Caso já tenha efetuado o pagamento, por favor desconsidere este email.</p>
        <p>Dúvidas? Entre em contato conosco.</p>
      `;
    }

    return this.send({
      to: debtor.email,
      subject: `${debtor.daysOverdue > 60 ? '🔴 URGENTE' : debtor.daysOverdue > 30 ? '⚠️' : '💬'} Lembrete de Pagamento - €${debtor.amount}`,
      html: this.getBaseTemplate(content),
    });
  }

  // 4. EMAIL: Pagamento confirmado
  async sendPaymentConfirmationEmail(userData: { email: string; name: string }, payment: PaymentData): Promise<any> {
    const content = `
      <h1 class="success">✅ Pagamento Confirmado!</h1>
      <p>Olá <strong>${userData.name}</strong>,</p>
      <p>Ótimas notícias! Recebemos confirmação de pagamento:</p>

      <div class="info-box">
        <p><strong>Devedor:</strong> ${payment.debtorName}</p>
        <p><strong>Valor recebido:</strong> <span class="amount success">€${payment.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span></p>
        <p><strong>Método:</strong> ${payment.method}</p>
        <p><strong>Data:</strong> ${payment.date}</p>
      </div>

      <p>🎉 Parabéns! Mais um pagamento recuperado com sucesso.</p>

      <a href="https://tapago.pt/dashboard" class="button">Ver Dashboard</a>

      <p style="margin-top: 30px;"><strong>Continue assim!</strong> A IA está aprendendo com cada sucesso para otimizar suas próximas cobranças.</p>
    `;

    return this.send({
      to: userData.email,
      subject: `💰 Pagamento Recebido - ${payment.debtorName} - €${payment.amount}`,
      html: this.getBaseTemplate(content),
    });
  }

  // 5. EMAIL: Devedor para pagamento
  async sendPaymentConfirmationToDebtor(debtor: DebtorData, payment: PaymentData, companyName: string): Promise<any> {
    const content = `
      <h1 class="success">✅ Pagamento Confirmado!</h1>
      <p>Prezado(a) <strong>${debtor.name}</strong>,</p>
      <p>Confirmamos o recebimento do seu pagamento. Obrigado!</p>

      <div class="info-box">
        <p><strong>Valor pago:</strong> <span class="amount success">€${payment.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span></p>
        <p><strong>Método:</strong> ${payment.method}</p>
        <p><strong>Data:</strong> ${payment.date}</p>
        <p><strong>Empresa:</strong> ${companyName}</p>
      </div>

      <p>✅ Sua situação está regularizada!</p>
      <p>Este email serve como comprovante de pagamento. Guarde para seus registros.</p>

      <p style="margin-top: 30px;">Agradecemos a sua confiança!</p>
      <p><strong>${companyName}</strong></p>
    `;

    return this.send({
      to: debtor.email,
      subject: `✅ Comprovante de Pagamento - €${payment.amount}`,
      html: this.getBaseTemplate(content),
    });
  }

  // 6. EMAIL: Negociação aceita
  async sendNegotiationAcceptedEmail(userData: { email: string; name: string }, negotiation: NegotiationData): Promise<any> {
    const content = `
      <h1>🤝 Negociação Aceita!</h1>
      <p>Olá <strong>${userData.name}</strong>,</p>
      <p>Uma negociação foi aceita com sucesso:</p>

      <div class="info-box">
        <p><strong>Devedor:</strong> ${negotiation.debtorName}</p>
        <p><strong>Valor original:</strong> <span style="text-decoration: line-through;">€${negotiation.originalAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span></p>
        <p><strong>Valor negociado:</strong> <span class="amount">€${negotiation.negotiatedAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span></p>
        <p><strong>Desconto:</strong> <span class="badge">${negotiation.discount}%</span></p>
        <p><strong>Parcelamento:</strong> ${negotiation.installments}x de €${(negotiation.negotiatedAmount / negotiation.installments).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
      </div>

      <p>✅ A IA fechou automaticamente esta negociação dentro dos parâmetros configurados.</p>

      <a href="https://tapago.pt/dashboard" class="button">Ver Detalhes</a>
    `;

    return this.send({
      to: userData.email,
      subject: `🤝 Negociação Aceita - ${negotiation.debtorName}`,
      html: this.getBaseTemplate(content),
    });
  }

  // 7. EMAIL: Alerta de score baixo
  async sendLowScoreAlertEmail(userData: { email: string; name: string }, debtor: DebtorData, score: number): Promise<any> {
    const content = `
      <h1 class="warning">⚠️ Alerta: Score Baixo Detectado</h1>
      <p>Olá <strong>${userData.name}</strong>,</p>
      <p>A IA detectou um devedor com score de pagamento muito baixo:</p>

      <div class="info-box">
        <p><strong>Devedor:</strong> ${debtor.name}</p>
        <p><strong>Score:</strong> <span class="badge danger">${score}/100</span></p>
        <p><strong>Valor devido:</strong> €${debtor.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
        <p><strong>Dias em atraso:</strong> ${debtor.daysOverdue} dias</p>
      </div>

      <h2>🤖 Recomendações da IA:</h2>
      <p>❌ Evitar investir mais recursos em contatos automáticos</p>
      <p>✅ Considerar contato humano direto (telefone)</p>
      <p>✅ Avaliar possibilidade de desconto maior</p>
      <p>⚠️ Considerar encaminhamento para cobrança jurídica</p>

      <a href="https://tapago.pt/debtors/${debtor.email}" class="button">Analisar Perfil</a>
    `;

    return this.send({
      to: userData.email,
      subject: `⚠️ Alerta: Score Baixo - ${debtor.name} (${score}/100)`,
      html: this.getBaseTemplate(content),
    });
  }

  // 8. EMAIL: Relatório semanal
  async sendWeeklyReportEmail(userData: { email: string; name: string }, stats: any): Promise<any> {
    const content = `
      <h1>📊 Relatório Semanal - TaPago.pt</h1>
      <p>Olá <strong>${userData.name}</strong>,</p>
      <p>Aqui está o resumo da semana:</p>

      <div class="info-box">
        <h2>💰 Performance Financeira</h2>
        <p><strong>Valor recuperado:</strong> <span class="amount success">€${stats.recovered.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span></p>
        <p><strong>Taxa de conversão:</strong> <span class="badge">${stats.conversionRate}%</span></p>
        <p><strong>ROI da semana:</strong> <span class="badge success">${stats.roi}x</span></p>
      </div>

      <div class="info-box">
        <h2>📈 Métricas de Cobrança</h2>
        <p>✅ Emails enviados: <strong>${stats.emailsSent}</strong></p>
        <p>✅ WhatsApp enviados: <strong>${stats.whatsappSent}</strong></p>
        <p>✅ Ligações realizadas: <strong>${stats.callsMade}</strong></p>
        <p>✅ Taxa de resposta: <strong>${stats.responseRate}%</strong></p>
      </div>

      <div class="info-box">
        <h2>🎯 Destaques</h2>
        <p class="success">✅ ${stats.highlights.positive}</p>
        <p class="warning">⚠️ ${stats.highlights.attention}</p>
      </div>

      <a href="https://tapago.pt/dashboard" class="button">Ver Dashboard Completo</a>

      <p style="margin-top: 30px;">Continue assim! A IA está otimizando continuamente suas estratégias.</p>
    `;

    return this.send({
      to: userData.email,
      subject: `📊 Relatório Semanal - €${stats.recovered} Recuperados`,
      html: this.getBaseTemplate(content),
    });
  }

  // 9. EMAIL: Teste de configuração
  async sendTestEmail(to: string): Promise<any> {
    const content = `
      <h1>✅ Email de Teste</h1>
      <p>Parabéns! Seu sistema de email está configurado corretamente.</p>
      
      <div class="info-box">
        <p><strong>Provedor:</strong> Resend API</p>
        <p><strong>Status:</strong> <span class="badge success">Ativo ✅</span></p>
        <p><strong>Limite diário:</strong> 100 emails/dia (grátis)</p>
        <p><strong>Features:</strong> Templates HTML, Tracking, Logs</p>
      </div>

      <p>Você já pode começar a enviar emails automáticos para seus devedores!</p>

      <a href="https://tapago.pt/settings" class="button">Configurações</a>
    `;

    return this.send({
      to,
      subject: '✅ Teste de Email - TaPago.pt',
      html: this.getBaseTemplate(content),
    });
  }

  // 10. EMAIL: Notificação de Login
  async sendLoginNotificationEmail(userData: { email: string; name: string }): Promise<any> {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    const formattedTime = now.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const content = `
      <h1>🔐 Novo Acesso Detectado</h1>
      <p>Olá <strong>${userData.name}</strong>,</p>
      <p>Detectamos um novo acesso à sua conta TaPago.pt:</p>
      
      <div class="info-box">
        <p><strong>📅 Data:</strong> ${formattedDate}</p>
        <p><strong>🕐 Horário:</strong> ${formattedTime}</p>
        <p><strong>📧 Email:</strong> ${userData.email}</p>
        <p><strong>🌐 Dispositivo:</strong> Navegador Web</p>
      </div>

      <div class="alert warning">
        <p><strong>⚠️ Não foi você?</strong></p>
        <p>Se não reconhece este acesso, altere sua senha imediatamente e entre em contato conosco.</p>
      </div>

      <a href="https://tapago.pt/dashboard" class="button">Acessar Dashboard</a>

      <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
        Este é um email automático de segurança. Sempre que há um login, você receberá esta notificação.
      </p>
    `;

    return this.send({
      to: userData.email,
      subject: '🔐 Novo acesso à sua conta - TaPago.pt',
      html: this.getBaseTemplate(content),
    });
  }

  // 11. EMAIL: Devedor criado
  async sendDebtorCreatedEmail(userData: { email: string; name: string }, debtorData: DebtorData): Promise<any> {
    const content = `
      <h1>✅ Novo Devedor Adicionado</h1>
      <p>Olá <strong>${userData.name}</strong>,</p>
      <p>Um novo devedor foi adicionado à sua carteira:</p>
      
      <div class="info-box">
        <h2>👤 Dados do Devedor</h2>
        <p><strong>Nome:</strong> ${debtorData.name}</p>
        <p><strong>Email:</strong> ${debtorData.email}</p>
        <p><strong>Valor devido:</strong> <span class="amount">€${debtorData.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</span></p>
        <p><strong>Dias em atraso:</strong> <span class="badge ${debtorData.daysOverdue > 60 ? 'danger' : debtorData.daysOverdue > 30 ? 'warning' : ''}">${debtorData.daysOverdue} dias</span></p>
        <p><strong>Data de vencimento:</strong> ${debtorData.dueDate}</p>
      </div>

      <div class="info-box success">
        <p><strong>🤖 Próximos Passos Automáticos:</strong></p>
        <p>✅ IA calculando score de pagamento...</p>
        <p>✅ Estratégia de cobrança sendo definida...</p>
        <p>✅ Timeline de contatos criada...</p>
      </div>

      <a href="https://tapago.pt/devedores" class="button">Ver Devedores</a>

      <p style="margin-top: 30px;">O sistema já está trabalhando para otimizar a recuperação deste valor!</p>
    `;

    return this.send({
      to: userData.email,
      subject: `✅ Novo Devedor: ${debtorData.name} - €${debtorData.amount}`,
      html: this.getBaseTemplate(content),
    });
  }
}

export const emailService = new ResendEmailService();
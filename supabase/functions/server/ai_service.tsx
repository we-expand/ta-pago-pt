
interface DebtorContext {
  name: string;
  amount: number;
  daysOverdue: number;
  dueDate: string;
  companyName: string;
}

export class AIService {
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor() {}

  async generateCollectionMessage(debtor: DebtorContext, tone: 'friendly' | 'firm' | 'urgent' = 'friendly', lastDebtorMessage?: string): Promise<string> {
    const apiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!apiKey) {
      console.warn('GOOGLE_API_KEY not found. Using fallback template.');
      return this.getFallbackMessage(debtor, tone);
    }

    const systemPrompt = `
      Você é um assistente de IA especializado em recuperação de crédito e comunicação empática.
      Sua tarefa é escrever uma mensagem de cobrança (email ou texto curto) altamente personalizada.
      
      OBJETIVOS:
      1. Analisar o perfil do devedor (histórico, atraso, valor).
      2. Se houver uma mensagem anterior do devedor, ANALISE O TOM dela (irritado, triste, desculpas, indiferente) e adapte sua resposta para ser empática mas resolutiva.
      3. Use formatação HTML simples (<p>, <strong>, <br>). Não use tags <html> ou <body>.
      4. O objetivo final é conseguir o pagamento ou uma promessa de pagamento, mantendo o relacionamento cliente-empresa.
    `;

    const userPrompt = `
      Escreva uma mensagem de cobrança para:
      - Devedor: ${debtor.name}
      - Empresa Credora: ${debtor.companyName}
      - Valor: €${debtor.amount.toFixed(2)}
      - Atraso: ${debtor.daysOverdue} dias
      - Vencimento: ${debtor.dueDate}

      ${lastDebtorMessage ? `
      CONTEXTO CRÍTICO (Última mensagem recebida do devedor):
      "${lastDebtorMessage}"
      
      Instrução extra: Responda diretamente ao que o devedor disse acima. Se ele deu uma desculpa, reconheça mas insista no pagamento. Se ele foi agressivo, seja calmo e profissional.
      ` : ''}

      Tom de voz desejado: ${tone === 'urgent' ? 'Urgente e sério (último aviso)' : tone === 'firm' ? 'Firme e direto (focando nas consequências)' : 'Amigável, compreensivo e facilitador'}.
      
      Estrutura da Resposta:
      1. Saudação personalizada.
      2. Empatia (especialmente se houve mensagem do devedor).
      3. Contexto da dívida (valor/vencimento).
      4. Call to Action claro (Link de pagamento será inserido depois, apenas mencione "clique no link abaixo").
      5. Oferta de ajuda/negociação.
      6. Encerramento profissional.
    `;

    try {
      const response = await fetch(`${this.baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            role: "user",
            parts: [{ text: userPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.getFallbackMessage(debtor, tone);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.getFallbackMessage(debtor, tone);
    }
  }

  private getFallbackMessage(debtor: DebtorContext, tone: string): string {
    // Fallback caso a API falhe ou não tenha chave
    if (tone === 'urgent') {
      return `
        <p>Olá <strong>${debtor.name}</strong>,</p>
        <p>Consta em nosso sistema uma pendência importante no valor de <strong>€${debtor.amount.toFixed(2)}</strong>, vencida há ${debtor.daysOverdue} dias.</p>
        <p>Esta é uma notificação urgente para evitar medidas adicionais de cobrança.</p>
        <p>Por favor, regularize sua situação o mais breve possível.</p>
      `;
    } else {
      return `
        <p>Olá <strong>${debtor.name}</strong>,</p>
        <p>Gostaríamos de lembrar sobre a fatura pendente de <strong>€${debtor.amount.toFixed(2)}</strong> referente a ${debtor.companyName}.</p>
        <p>Sabemos que imprevistos acontecem. Se já efetuou o pagamento, por favor desconsidere.</p>
        <p>Caso precise negociar, estamos à disposição.</p>
      `;
    }
  }
}

export const aiService = new AIService();

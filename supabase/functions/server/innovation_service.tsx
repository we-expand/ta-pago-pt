
export interface InnovationResult {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;
  tags: string[];
  benefits: string[];
  implementation: string;
}

export class InnovationService {
  // Using Gemini 1.5 Flash which is faster and cheaper
  private geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  constructor() {}

  async generateSuggestions(query: string, category: string): Promise<InnovationResult[]> {
    // Prefer Google API Key as OpenAI key is reported invalid
    const apiKey = Deno.env.get('GOOGLE_API_KEY');
    
    // If no key or invalid key, return mock data immediately to avoid errors
    if (!apiKey || apiKey === 'aquela' || apiKey.length < 10) {
      console.warn('Valid GOOGLE_API_KEY not found. Using fallback data.');
      return this.getMockData(category);
    }

    const systemPrompt = `
      Você é um Consultor de Inovação Sênior especializado em SaaS B2B, Fintech e UX/UI.
      Sua missão é gerar sugestões inovadoras, práticas e detalhadas para o produto "TaPago.pt" (SaaS de automação de cobranças).
      
      Gere SEMPRE EXATAMENTE 15 sugestões focadas na categoria solicitada.
      Responda APENAS com um JSON Array válido. Sem markdown, sem explicações extras.
    `;

    let categoryPrompt = "";
    switch (category) {
      case 'visual': categoryPrompt = "Foque em Design System, UI Trends (Glassmorphism, Bento Grids), Animações e Identidade Visual."; break;
      case 'funcional': categoryPrompt = "Foque em novas features, automações, regras de cobrança, IA preditiva e ferramentas para o usuário."; break;
      case 'concorrencia': categoryPrompt = "Analise concorrentes (Stripe, Zuora, Paddle, Iugu, Asaas) e sugira diferenciais competitivos ou features que eles têm."; break;
      case 'tecnologia': categoryPrompt = "Foque em arquitetura, Edge Functions, Vector Search, Webhooks, Segurança e Performance."; break;
      case 'ux': categoryPrompt = "Foque em Usabilidade, Onboarding, Micro-interações, Acessibilidade e Fluxos de usuário."; break;
      case 'melhorias': categoryPrompt = "Sugira melhorias para o Dashboard atual, Tabelas, Relatórios e fluxos existentes."; break;
      default: categoryPrompt = "Gere um mix equilibrado de todas as áreas (Design, Funcional, Tech, UX, Concorrência)."; break;
    }

    const userPrompt = `
      Contexto: O usuário buscou por "${query}".
      Categoria Foco: ${category === 'all' ? 'Geral (Mix de categorias)' : category}.
      ${categoryPrompt}
      
      Gere 15 sugestões inovadoras seguindo este formato JSON para cada item:
      [{
        "title": "Título curto e impactante",
        "description": "Descrição detalhada do valor (2-3 frases)",
        "type": "${category === 'all' ? 'variado (design, feature, tech, etc)' : category}",
        "category": "Nome da Categoria em Português",
        "impact": "high" | "medium" | "low",
        "difficulty": "easy" | "medium" | "hard",
        "source": "Fonte da inspiração (ex: Stripe, Tendência 2024, Best Practice)",
        "tags": ["tag1", "tag2", "tag3"],
        "benefits": ["benefício 1", "benefício 2", "benefício 3"],
        "implementation": "Dica técnica rápida de como implementar"
      }]
    `;

    try {
      const response = await fetch(`${this.geminiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
            response_mime_type: "application/json",
            temperature: 0.8
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Log but don't throw to frontend, just return mock
        console.error(`Gemini API Error: ${response.statusText} - ${errorText}`);
        return this.getMockData(category);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        console.warn('Empty content from Gemini');
        return this.getMockData(category);
      }
      
      let results: any[] = [];
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          results = parsed;
        } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          results = parsed.suggestions;
        } else {
          // Fallback: try to find an array in values
          const possibleArray = Object.values(parsed).find(val => Array.isArray(val));
          if (possibleArray) {
            results = possibleArray as any[];
          }
        }
      } catch (e) {
        console.error("Failed to parse JSON content from Gemini:", content);
        return this.getMockData(category);
      }
      
      // Adicionar IDs únicos
      return results.map((item: any, index: number) => ({
        ...item,
        id: `ai_${Date.now()}_${index}`,
        // Garantir campos obrigatórios
        impact: item.impact || 'medium',
        difficulty: item.difficulty || 'medium',
        tags: item.tags || [],
        benefits: item.benefits || [],
      }));

    } catch (error) {
      console.error('Error generating innovation suggestions:', error);
      return this.getMockData(category);
    }
  }

  private getMockData(category: string): InnovationResult[] {
    return Array(5).fill(null).map((_, i) => ({
      id: `mock_${i}`,
      title: `Sugestão Exemplo ${i + 1}`,
      description: "O serviço de IA está temporariamente indisponível. Verifique as chaves de API.",
      type: category,
      category: "Sistema",
      impact: "low",
      difficulty: "easy",
      source: "Sistema Fallback",
      tags: ["erro", "fallback"],
      benefits: ["Continuidade do sistema"],
      implementation: "Verifique os logs do servidor"
    }));
  }
}

export const innovationService = new InnovationService();

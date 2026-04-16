export type Category = 'TECH' | 'DESIGN_UX' | 'FEATURE' | 'COMPETITION' | 'INNOVATION' | 'BUG' | 'OPTIMIZATION';
export type Impact = 'HIGH' | 'MEDIUM' | 'LOW';
export type Effort = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  impact: Impact;
  effort: Effort;
  status: 'active' | 'completed' | 'trash';
  fullAnalysis?: string; // Detalhes técnicos da sugestão
  createdAt: string;
}

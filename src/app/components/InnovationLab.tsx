import { useState } from 'react';
import { Sparkles, Search, TrendingUp, Eye, Target, Zap, Globe, Lightbulb, ArrowRight, CheckCircle2, ExternalLink, Brain, Rocket, Star, Filter, Clock, Users, DollarSign, Activity, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { projectId } from '../../../utils/supabase/info';
import { INNOVATION_DATA } from '../data/innovation_data';

type SearchCategory = 'all' | 'visual' | 'funcional' | 'concorrencia' | 'tecnologia' | 'ux' | 'melhorias';
type ResultType = 'design' | 'feature' | 'competitor' | 'tech' | 'trend' | 'ux' | 'improvement';

type InnovationResult = {
  id: string;
  title: string;
  description: string;
  type: ResultType;
  category: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;
  url?: string;
  tags: string[];
  preview?: string;
  implementation?: string;
  benefits: string[];
  examples?: string[];
};

export default function InnovationLab({ session }: { session: any }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<InnovationResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<InnovationResult | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [impactFilter, setImpactFilter] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]); // Track dismissed suggestions

  const categories = [
    { id: 'all', name: 'Tudo', icon: <Globe className="size-5" />, color: 'from-slate-500 to-slate-600' },
    { id: 'visual', name: 'Design & Visual', icon: <Eye className="size-5" />, color: 'from-pink-500 to-rose-600' },
    { id: 'funcional', name: 'Funcionalidades', icon: <Zap className="size-5" />, color: 'from-purple-500 to-indigo-600' },
    { id: 'concorrencia', name: 'Concorrência', icon: <Target className="size-5" />, color: 'from-red-500 to-orange-600' },
    { id: 'tecnologia', name: 'Tecnologia', icon: <Brain className="size-5" />, color: 'from-blue-500 to-cyan-600' },
    { id: 'ux', name: 'UX/UI', icon: <Users className="size-5" />, color: 'from-green-500 to-emerald-600' },
    { id: 'melhorias', name: 'Melhorias', icon: <Lightbulb className="size-5" />, color: 'from-yellow-500 to-orange-500' }
  ];

  // Simulação de IA - Em produção, isso chamaria uma API real de busca
  const performAISearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Digite um termo de pesquisa');
      return;
    }

    setSearching(true);
    
    try {
      // 1. Tentar chamar API de IA real primeiro
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12af7011/innovation/search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: searchQuery,
            category: selectedCategory
          })
        }
      );

      let intelligentResults: InnovationResult[] = [];

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
           intelligentResults = data.results;
        }
      }
      
      // 2. Se a API falhar ou não retornar nada (ex: sem chave OpenAI), usar dados estáticos completos
      if (intelligentResults.length === 0) {
        // Simular delay apenas se for fallback
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (selectedCategory === 'all') {
          // Pegar 3 de cada categoria para formar um mix rico
          const allCategories: SearchCategory[] = ['visual', 'funcional', 'concorrencia', 'tecnologia', 'ux', 'melhorias'];
          allCategories.forEach(cat => {
            if (INNOVATION_DATA[cat]) {
              intelligentResults.push(...INNOVATION_DATA[cat].slice(0, 3));
            }
          });
        } else {
          // Retornar TODOS os itens da categoria selecionada (15 itens)
          if (INNOVATION_DATA[selectedCategory]) {
             intelligentResults = [...INNOVATION_DATA[selectedCategory]];
          }
        }
      }

      setResults(intelligentResults);
      toast.success(`${intelligentResults.length} insights encontrados!`);
    } catch (error) {
       console.error("Erro na busca de inovação:", error);
       toast.error("Erro ao buscar inovações. Tentando modo offline...");
       
       // Fallback de emergência
        if (selectedCategory === 'all') {
          const allCategories: SearchCategory[] = ['visual', 'funcional', 'concorrencia', 'tecnologia', 'ux', 'melhorias'];
          const fallbackResults: InnovationResult[] = [];
          allCategories.forEach(cat => {
            if (INNOVATION_DATA[cat]) {
              fallbackResults.push(...INNOVATION_DATA[cat].slice(0, 3));
            }
          });
          setResults(fallbackResults);
        } else {
          if (INNOVATION_DATA[selectedCategory]) {
             setResults([...INNOVATION_DATA[selectedCategory]]);
          }
        }
    } finally {
      setSearching(false);
    }
  };

  const getTypeIcon = (type: ResultType) => {
    switch (type) {
      case 'design': return <Eye className="size-4" />;
      case 'feature': return <Zap className="size-4" />;
      case 'competitor': return <Target className="size-4" />;
      case 'tech': return <Brain className="size-4" />;
      case 'trend': return <TrendingUp className="size-4" />;
      case 'ux': return <Users className="size-4" />;
      case 'improvement': return <Lightbulb className="size-4" />;
    }
  };

  const getTypeColor = (type: ResultType) => {
    switch (type) {
      case 'design': return 'from-pink-500 to-rose-600';
      case 'feature': return 'from-purple-500 to-indigo-600';
      case 'competitor': return 'from-red-500 to-orange-600';
      case 'tech': return 'from-blue-500 to-cyan-600';
      case 'trend': return 'from-green-500 to-emerald-600';
      case 'ux': return 'from-yellow-500 to-orange-500';
      case 'improvement': return 'from-yellow-500 to-orange-500';
    }
  };

  const getImpactBadge = (impact: string) => {
    const badges = {
      high: { color: 'bg-red-100 text-red-700', label: 'Alto Impacto' },
      medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Médio Impacto' },
      low: { color: 'bg-blue-100 text-blue-700', label: 'Baixo Impacto' }
    };
    const badge = badges[impact as keyof typeof badges];
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}>{badge.label}</span>;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      easy: { color: 'bg-green-100 text-green-700', label: 'Fácil' },
      medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Médio' },
      hard: { color: 'bg-red-100 text-red-700', label: 'Difícil' }
    };
    const badge = badges[difficulty as keyof typeof badges];
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}>{badge.label}</span>;
  };

  const handleMarkAsApplied = (resultId: string, resultTitle: string) => {
    setDismissedIds([...dismissedIds, resultId]);
    toast.success(`"${resultTitle}" marcado como aplicado! ✅`);
    if (selectedResult?.id === resultId) {
      setSelectedResult(null);
    }
  };

  const handleMarkAsDiscarded = (resultId: string, resultTitle: string) => {
    setDismissedIds([...dismissedIds, resultId]);
    toast.info(`"${resultTitle}" descartado`);
    if (selectedResult?.id === resultId) {
      setSelectedResult(null);
    }
  };

  const filteredResults = results.filter(result => {
    const matchesImpact = impactFilter.length === 0 || impactFilter.includes(result.impact);
    const matchesDifficulty = difficultyFilter.length === 0 || difficultyFilter.includes(result.difficulty);
    const notDismissed = !dismissedIds.includes(result.id);
    return matchesImpact && matchesDifficulty && notDismissed;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
              <Sparkles className="size-7" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1">Innovation Lab 🚀</h1>
              <p className="text-white/90 text-lg">IA que pesquisa concorrência, tendências e inovações para sua plataforma</p>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="size-5" />
                <span className="text-sm font-medium">Concorrentes</span>
              </div>
              <div className="text-2xl font-bold">15+</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="size-5" />
                <span className="text-sm font-medium">Tendências</span>
              </div>
              <div className="text-2xl font-bold">50+</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="size-5" />
                <span className="text-sm font-medium">Tecnologias</span>
              </div>
              <div className="text-2xl font-bold">30+</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Rocket className="size-5" />
                <span className="text-sm font-medium">Features</span>
              </div>
              <div className="text-2xl font-bold">100+</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="size-5" />
                <span className="text-sm font-medium">Processadas</span>
              </div>
              <div className="text-2xl font-bold">{dismissedIds.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: 'analise meus concorrentes', 'tendências de design 2024', 'melhores práticas de UX'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performAISearch()}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg"
              />
            </div>
            <button
              onClick={performAISearch}
              disabled={searching}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {searching ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Pesquisando...
                </>
              ) : (
                <>
                  <Sparkles className="size-5" />
                  Pesquisar IA
                </>
              )}
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as SearchCategory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-900">{filteredResults.length} resultados encontrados</span>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <Filter className="size-4" />
                  Filtros
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                <div>
                  <div className="text-sm font-bold text-slate-700 mb-2">Impacto</div>
                  <div className="flex gap-2">
                    {['high', 'medium', 'low'].map(impact => (
                      <button
                        key={impact}
                        onClick={() => {
                          if (impactFilter.includes(impact)) {
                            setImpactFilter(impactFilter.filter(i => i !== impact));
                          } else {
                            setImpactFilter([...impactFilter, impact]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          impactFilter.includes(impact)
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {impact === 'high' ? 'Alto' : impact === 'medium' ? 'Médio' : 'Baixo'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-700 mb-2">Dificuldade</div>
                  <div className="flex gap-2">
                    {['easy', 'medium', 'hard'].map(diff => (
                      <button
                        key={diff}
                        onClick={() => {
                          if (difficultyFilter.includes(diff)) {
                            setDifficultyFilter(difficultyFilter.filter(d => d !== diff));
                          } else {
                            setDifficultyFilter([...difficultyFilter, diff]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          difficultyFilter.includes(diff)
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Médio' : 'Difícil'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="flex flex-col gap-2">
            {filteredResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-xl border border-slate-200 hover:border-purple-300 p-3 transition-all hover:shadow-md group flex items-center gap-4 cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <div className={`size-10 rounded-lg bg-gradient-to-br ${getTypeColor(result.type)} flex items-center justify-center text-white shadow-sm shrink-0`}>
                  {getTypeIcon(result.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-slate-900 truncate group-hover:text-purple-600 transition-colors">
                      {result.title}
                    </h3>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium truncate">{result.source}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{result.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 hidden md:flex">
                  {getImpactBadge(result.impact)}
                  {getDifficultyBadge(result.difficulty)}
                </div>

                <ArrowRight className="size-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0" />

                <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-slate-100 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsApplied(result.id, result.title);
                    }}
                    className="p-2 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-lg transition-colors"
                    title="Marcar como Aplicado"
                  >
                    <CheckCircle2 className="size-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsDiscarded(result.id, result.title);
                    }}
                    className="p-2 hover:bg-slate-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Descartar"
                  >
                    <XCircle className="size-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {results.length === 0 && !searching && (
        <div className="text-center py-20">
          <div className="size-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="size-10 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Pronto para inovar?</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Digite o que você quer descobrir e nossa IA irá pesquisar concorrentes, tendências, tecnologias e best practices.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => {
                setSearchQuery('analise meus concorrentes');
                setSelectedCategory('concorrencia');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors"
            >
              Analisar Concorrentes
            </button>
            <button
              onClick={() => {
                setSearchQuery('tendências de design 2024');
                setSelectedCategory('visual');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors"
            >
              Tendências de Design
            </button>
            <button
              onClick={() => {
                setSearchQuery('funcionalidades inovadoras');
                setSelectedCategory('funcional');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors"
            >
              Funcionalidades Inovadoras
            </button>
            <button
              onClick={() => {
                setSearchQuery('melhorias internas');
                setSelectedCategory('melhorias');
              }}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg rounded-xl text-sm font-bold transition-all"
            >
              💡 Melhorias Internas
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`size-16 rounded-2xl bg-gradient-to-br ${getTypeColor(selectedResult.type)} flex items-center justify-center text-white shadow-lg`}>
                    {getTypeIcon(selectedResult.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getImpactBadge(selectedResult.impact)}
                      {getDifficultyBadge(selectedResult.difficulty)}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedResult.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">{selectedResult.source}</span>
                      {selectedResult.url && (
                        <>
                          <span>•</span>
                          <a 
                            href={selectedResult.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Ver fonte <ExternalLink className="size-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Descrição</h3>
                  <p className="text-slate-700 leading-relaxed">{selectedResult.description}</p>
                </div>

                {/* Benefits */}
                {selectedResult.benefits && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Benefícios</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedResult.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                          <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Implementation */}
                {selectedResult.implementation && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Como Implementar</h3>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedResult.implementation}</p>
                    </div>
                  </div>
                )}

                {/* Examples */}
                {selectedResult.examples && selectedResult.examples.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Exemplos</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedResult.examples.map(example => (
                        <span key={example} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedResult.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => {
                      handleMarkAsApplied(selectedResult.id, selectedResult.title);
                      toast.success('Adicionado à lista de implementações!');
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="size-5" />
                    Marcar como Aplicado
                  </button>
                  <button
                    onClick={() => handleMarkAsDiscarded(selectedResult.id, selectedResult.title)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="size-5" />
                    Descartar
                  </button>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
# 🎨 TAPAGO.PT - DESIGN SYSTEM & PADRÃO VISUAL

## 📐 ESTRUTURA DE LAYOUT PADRÃO

### Layout Base (PageLayout)
Todas as páginas da aplicação devem seguir esta estrutura:

```tsx
<PageLayout
  title="Título da Página"
  description="Descrição opcional"
  icon={IconComponent}
  headerActions={<BotoesDeAcao />}
  maxWidth="7xl" // 7xl | 6xl | 5xl | full
>
  {/* Conteúdo da página */}
</PageLayout>
```

### Espaçamentos Padrão
- **Padding externo**: `p-8` (32px)
- **Espaçamento entre blocos**: `space-y-6` (24px)
- **Padding interno de cards**: `p-6` (24px)
- **Gap entre elementos**: `gap-6` (24px)

## 🎴 COMPONENTES PADRÃO

### 1. Stats Grid
Grid responsivo para cards de estatísticas:
- **Mobile**: 1 coluna
- **Tablet** (md): 2 colunas
- **Desktop** (xl): 4 colunas

```tsx
<StatsGrid>
  <GlassStatsCard
    icon={<Icon className="size-5 text-indigo-600" />}
    title="Título"
    value={123}
  />
</StatsGrid>
```

### 2. Charts Grid
Grid responsivo para gráficos:
- **Mobile**: 1 coluna
- **Desktop** (xl): 2 colunas

```tsx
<ChartsGrid>
  <GlassChartCard title="Gráfico 1">
    {/* Conteúdo do gráfico */}
  </GlassChartCard>
</ChartsGrid>
```

### 3. PageSection
Container padrão para seções de conteúdo:

```tsx
<PageSection className="custom-class">
  {/* Conteúdo */}
</PageSection>
```

### 4. SectionHeader
Cabeçalho de seção com título e ações:

```tsx
<SectionHeader
  title="Título da Seção"
  description="Descrição opcional"
  actions={<Botoes />}
/>
```

## 🎨 CORES E GRADIENTES

### Paleta Roxo Pantone (Principal)
```css
/* Gradientes principais */
from-indigo-600 via-purple-600 to-violet-600
from-indigo-500 to-purple-500

/* Cores individuais */
indigo-600: #4f46e5
purple-600: #9333ea
violet-600: #7c3aed
```

### Background Gradient
```css
bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20
```

## 📦 CARDS E GLASSMORPHISM

### GlassCard
```tsx
<GlassCard variant="default" blur="lg" hover={true}>
  {/* Conteúdo */}
</GlassCard>
```

**Variantes:**
- `default`: Card padrão com fundo branco/80
- `strong`: Card mais opaco para destaque

**Blur:**
- `sm`, `md`, `lg`, `xl`: Intensidade do backdrop blur

### GlassStatsCard
Card otimizado para estatísticas:

```tsx
<GlassStatsCard
  icon={ReactNode}
  title="string"
  value={number | string}
  change="+12%" // opcional
  trend="up" | "down" // opcional
/>
```

### GlassChartCard
Card otimizado para gráficos:

```tsx
<GlassChartCard
  title="Título do Gráfico"
  description="Descrição opcional"
  actions={<Botoes />}
>
  {/* Chart component */}
</GlassChartCard>
```

### GlassHeaderCard
Header com glassmorphism:

```tsx
<GlassHeaderCard color="purple" | "blue" | "green">
  {/* Conteúdo do header */}
</GlassHeaderCard>
```

## 🔘 BOTÕES

### Botão Primário
```tsx
<InteractiveButton className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold">
  <Icon className="size-5" />
  Texto do Botão
</InteractiveButton>
```

### Botão Secundário
```tsx
<button className="px-6 py-3 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl font-semibold border border-slate-200 hover:bg-white transition-all">
  Texto
</button>
```

## 📊 INPUTS E FORMULÁRIOS

### Input Padrão
```tsx
<input
  type="text"
  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
  placeholder="Placeholder..."
/>
```

### FormContainer
```tsx
<FormContainer>
  <FormGrid>
    {/* Inputs organizados em 2 colunas */}
  </FormGrid>
</FormContainer>
```

## 🎯 ÍCONES

### Tamanhos Padrão
- **Small**: `size-4` (16px)
- **Medium**: `size-5` (20px)
- **Large**: `size-6` (24px)
- **XL**: `size-8` (32px)

### Cores de Ícones
```tsx
// Status
text-indigo-600  // Primary
text-green-600   // Success
text-red-600     // Error
text-yellow-600  // Warning
text-slate-600   // Neutral
```

## 📱 RESPONSIVIDADE

### Breakpoints (Tailwind)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Max Width Container
```tsx
// 7xl: 1800px (Dashboard, Timeline)
max-w-[1800px]

// 7xl padrão: 1280px
max-w-7xl

// 5xl: 1024px (Páginas simples)
max-w-5xl
```

## 🎭 MICRO-INTERAÇÕES

### Motion Animations
```tsx
// Fade in + slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

### Hover Effects
```tsx
// Card hover
hover:shadow-xl transition-all

// Button hover
hover:scale-105 transition-transform

// Glassmorphic hover
hover:bg-white/90 transition-all
```

## 🏷️ BADGES E TAGS

### Status Badge
```tsx
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
  <CheckIcon className="size-3" />
  Concluído
</div>
```

### Score Badge
```tsx
<div className={`px-3 py-1 rounded-lg text-sm font-bold ${
  score >= 70 ? 'bg-green-100 text-green-700' :
  score >= 50 ? 'bg-yellow-100 text-yellow-700' :
  'bg-red-100 text-red-700'
}`}>
  Score: {score}
</div>
```

## 📋 TABELAS

### TableContainer
```tsx
<TableContainer>
  <table className="w-full">
    <thead>
      <tr className="border-b border-slate-200">
        <th className="text-left p-4 font-semibold text-slate-700">
          Coluna
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td className="p-4">Conteúdo</td>
      </tr>
    </tbody>
  </table>
</TableContainer>
```

## 🎨 EMPTY STATES

```tsx
<EmptyState
  icon={IconComponent}
  title="Nenhum item encontrado"
  description="Crie seu primeiro item para começar"
  action={
    <button>Criar Item</button>
  }
/>
```

## ✅ CHECKLIST DE PADRONIZAÇÃO

Ao criar ou modificar uma página, certifique-se de:

- [ ] Usa `PageLayout` como wrapper principal
- [ ] Header com ícone, título e descrição
- [ ] Espaçamento `space-y-6` entre blocos
- [ ] Stats Cards usando `StatsGrid` + `GlassStatsCard`
- [ ] Cards usando `GlassCard` componente
- [ ] Padding `p-6` em seções internas
- [ ] Gradiente roxo pantone nos botões primários
- [ ] Inputs com classe padrão (rounded-xl, bg-slate-50)
- [ ] Hover effects em elementos interativos
- [ ] Loading states com skeleton ou spinner
- [ ] Animações Motion em listas (fade + slide)
- [ ] Responsividade (grid cols: 1→2→4)
- [ ] Empty states com ícone e ação

## 🚀 EXEMPLO COMPLETO

```tsx
import { PageLayout, StatsGrid, PageSection } from './ui/PageLayout';
import GlassCard, { GlassStatsCard } from './ui/GlassCard';
import { Icon } from 'lucide-react';

export default function MinhaP
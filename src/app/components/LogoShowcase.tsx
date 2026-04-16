import { Logo } from './Logo';
import { ArrowLeft } from 'lucide-react';

export default function LogoShowcase({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={onBack}
        className="relative z-10 mb-8 flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md"
      >
        <ArrowLeft className="size-5" />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Identidade Visual</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            A nova marca <span className="font-bold text-slate-900">tapago</span> representa movimento, crescimento e tecnologia invisível.
          </p>
        </div>

        {/* Brand Showcase Grid */}
        <div className="grid gap-8">
          
          {/* Light Mode Card */}
          <div className="bg-white rounded-[32px] p-12 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 scale-150 transform transition-transform duration-700 group-hover:scale-[1.6]">
              <Logo size="large" variant="dark" />
            </div>
            <div className="absolute bottom-6 text-xs font-bold tracking-widest text-slate-300 uppercase">Light Mode Application</div>
          </div>

          {/* Dark Mode Card */}
          <div className="bg-[#0F172A] rounded-[32px] p-12 shadow-2xl flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
            {/* Dark Mode Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
            
            <div className="relative z-10 scale-150 transform transition-transform duration-700 group-hover:scale-[1.6]">
              <Logo size="large" variant="light" />
            </div>
            <div className="absolute bottom-6 text-xs font-bold tracking-widest text-slate-600 uppercase">Dark Mode Application</div>
          </div>

          {/* Context Sizes */}
          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-4">
                <Logo size="large" />
                <span className="text-xs text-slate-400 font-mono">Size: Large</span>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-4">
                <Logo size="default" />
                <span className="text-xs text-slate-400 font-mono">Size: Default</span>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-4">
                <Logo size="small" />
                <span className="text-xs text-slate-400 font-mono">Size: Small</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

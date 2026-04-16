import { 
  Bell, 
  Search, 
  Command, 
  Menu, 
  ChevronRight, 
  Sparkles,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  title: string;
  activeView: string;
  onOpenMobileMenu: () => void;
  session: any;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export function Header({ title, activeView, onOpenMobileMenu, session, onLogout, onOpenProfile }: HeaderProps) {
  return (
    <header className="h-20 px-6 md:px-10 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-white/50 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenMobileMenu} 
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="hidden md:inline font-medium text-slate-400">Tapago</span>
            <ChevronRight className="w-4 h-4 text-slate-300 hidden md:inline" />
            <span className="font-semibold text-slate-800 flex items-center gap-2 px-2 py-1 rounded-md bg-white/50 border border-transparent hover:border-slate-200 transition-colors cursor-default">
              {title}
              {activeView === 'ai' && <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />}
            </span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
          {/* Search Bar - Visual Only for now */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-full shadow-sm text-slate-400 w-64 transition-all hover:bg-white hover:border-indigo-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white group cursor-text">
              <Search className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-800" 
              />
              <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400">
                  <Command className="w-3 h-3" />
                  <span>K</span>
              </div>
          </div>

          <div className="flex items-center gap-3">
              <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all group">
                  <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 p-0.5 shadow-sm group-hover:shadow-md transition-all ring-2 ring-transparent group-hover:ring-indigo-100">
                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs">
                                {session?.user?.email?.[0]?.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-xl border-slate-100 shadow-xl rounded-xl p-1 animate-in fade-in zoom-in-95 duration-200">
                    <DropdownMenuLabel className="text-xs text-slate-400 font-medium uppercase tracking-wider px-2 py-1.5">Minha Conta</DropdownMenuLabel>
                    <DropdownMenuItem className="rounded-lg cursor-pointer py-2 focus:bg-slate-50" onClick={onOpenProfile}>
                        <User className="mr-2 w-4 h-4 text-slate-500" /> Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg cursor-pointer py-2 focus:bg-slate-50">
                        <Settings className="mr-2 w-4 h-4 text-slate-500" /> Preferências
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem className="rounded-lg cursor-pointer py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-700" onClick={onLogout}>
                        <LogOut className="mr-2 w-4 h-4" /> Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
      </div>
    </header>
  );
}

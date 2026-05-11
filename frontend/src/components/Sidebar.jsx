import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Zap, 
  FileText, 
  Activity, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Languages 
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, lang, setLang, t }) => {
  const { pathname } = useLocation();

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out shrink-0 bg-[#0a0f16] border-r border-white/10 flex flex-col relative z-20`}>
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 bg-cyan-500 text-black p-1 rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shrink-0">
            <ShieldAlert size={20} className="text-black" />
          </div>
          {isOpen && (
            <div className="font-space">
              <p className="text-xs font-black tracking-tighter text-white leading-none uppercase">Threat</p>
              <p className="text-xs font-black tracking-tighter text-cyan-400 leading-none uppercase">Detector</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-8 font-space">
        <div>
          <p className={`text-[10px] tracking-[0.2em] text-slate-500 px-3 mb-4 ${!isOpen && 'hidden'}`}>
            {t.modules}
          </p>
          <div className="space-y-1">
            <Link to="/" className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[11px] font-bold tracking-widest transition-all ${pathname === '/' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
              <LayoutDashboard size={18} />
              {isOpen && <span>{t.dashboard}</span>}
            </Link>
            <Link to="/analyze" className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[11px] font-bold tracking-widest transition-all ${pathname === '/analyze' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
              <ShieldAlert size={18} />
              {isOpen && <span>{t.phishing}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* Language Switcher Section */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex flex-col gap-2">
          {isOpen && <p className="text-[9px] text-slate-600 font-bold tracking-[0.2em] mb-1 uppercase px-1">Language</p>}
          <div className="flex gap-1">
            <button 
              onClick={() => setLang('en')}
              className={`flex-1 py-2 text-[10px] font-black rounded transition-all ${lang === 'en' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-white/5 text-slate-500 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('sq')}
              className={`flex-1 py-2 text-[10px] font-black rounded transition-all ${lang === 'sq' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-white/5 text-slate-500 hover:text-white'}`}
            >
              SQ
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
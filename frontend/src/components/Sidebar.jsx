import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Zap, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, lang, setLang, t }) => {
  const { pathname } = useLocation();

  return (
    <aside 
      className={`${
        isOpen ? 'w-64' : 'w-28'
      } transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) shrink-0 flex flex-col relative z-20 
      backdrop-blur-3xl bg-white/[0.01] shadow-[25px_0_50px_-20px_rgba(0,0,0,0.4)]`}
    >
      {/* ─── The Smooth Edge ─── */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
      
      {/* ─── Toggle Button ─── */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-4 top-10 w-8 h-8 flex items-center justify-center bg-[#0a0a0a] border border-white/10 text-white/50 rounded-full 
        hover:border-cyan-500/50 hover:text-white transition-all duration-500 shadow-2xl z-30 active:scale-90"
      >
        {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* ─── Logo Section ─── */}
      <div className="h-24 flex items-center px-8 shrink-0"> 
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
            <ShieldAlert size={18} className="text-white" />
          </div>
          
          {isOpen && (
            <div className="font-space animate-in fade-in slide-in-from-left-2 duration-700">
              <p className="text-[12px] font-medium tracking-[0.2em] text-white leading-tight uppercase">Threat</p>
              <p className="text-[10px] font-light tracking-[0.3em] text-cyan-400/80 leading-tight uppercase italic">Detector</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Navigation (Më lart dhe më afër) ─── */}
      <nav className="flex-1 px-4 space-y-6 font-space overflow-hidden">
        <div>
          <div className="h-6 flex items-center px-4 mb-2">
            {isOpen && (
              <p className="text-[8px] tracking-[0.5em] text-white/15 uppercase font-medium animate-in fade-in duration-1000">
                {t.modules}
              </p>
            )}
          </div>
          
          <div className="space-y-1">
            {[
              { to: "/", icon: LayoutDashboard, label: t.dashboard },
              { to: "/analyze", icon: ShieldAlert, label: t.phishing },
              { to: "/virus", icon: Zap, label: t.virusScan },
            ].map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`flex items-center gap-2 px-5 h-11 rounded-lg text-[10px] tracking-[0.2em] transition-all duration-500 relative group ${
                    isActive 
                      ? 'text-white bg-white/[0.05] shadow-sm' 
                      : 'text-white/30 hover:text-white/80 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="w-5 flex justify-center shrink-0">
                    <link.icon size={17} className={`transition-all duration-500 ${isActive ? "text-cyan-400" : "group-hover:text-white/60"}`} />
                  </div>
                  
                  {isOpen && (
                    <span className="truncate uppercase font-medium animate-in fade-in slide-in-from-left-3 duration-500">
                      {link.label}
                    </span>
                  )}
                  
                  {isActive && (
                    <div className="absolute left-0 w-[2px] h-3.5 bg-cyan-400/80 rounded-lg shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ─── Language Switcher ─── */}
      <div className="p-8 mt-auto shrink-0">
        <div className="relative bg-black/20 border border-white/5 rounded-lg p-1 backdrop-blur-3xl flex items-center h-9 shadow-inner">
          <div 
            className="absolute top-1 bottom-1 left-1 rounded-full bg-white/[0.9] shadow-sm transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{ 
              width: 'calc(50% - 4px)',
              transform: lang === 'en' ? 'translateX(0)' : 'translateX(100%)' 
            }}
          />
          <button 
            onClick={() => setLang('en')}
            className={`relative flex-1 text-[9px] tracking-widest font-bold z-10 transition-colors duration-700 ${lang === 'en' ? 'text-black' : 'text-white/20 hover:text-white/40'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('sq')}
            className={`relative flex-1 text-[9px] tracking-widest font-bold z-10 transition-colors duration-700 ${lang === 'sq' ? 'text-black' : 'text-white/20 hover:text-white/40'}`}
          >
            SQ
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
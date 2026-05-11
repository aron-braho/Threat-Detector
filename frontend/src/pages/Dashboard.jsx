import React from 'react';

const Dashboard = ({ t }) => {
  return (
    <main className="h-full flex flex-col bg-[#0f172a] text-slate-200 font-space overflow-hidden">
      
      {/* ─── Header (Njëjtë si te Phishing) ─── */}
      <div className="px-12 pt-14 pb-8 flex justify-between items-end border-b border-white/[0.03] shrink-0">
        <div className="space-y-1">
          <h2 className="text-[9px] uppercase tracking-[0.7em] text-cyan-400/50 font-black">
            {t?.intelligentScanner || "Intelligent Scanner"}
          </h2>
          <p className="text-4xl font-extralight tracking-tight text-white leading-none uppercase">
            {t?.systemOverview || "System"} <span className="font-black italic text-cyan-400">{t?.overview || "Overview"}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-3xl px-6 py-3 rounded-2xl border border-white/10">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {t?.nodeStatus || "Node: Active"}
          </span>
        </div>
      </div>

      {/* ─── Viewport / Grid ─── */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]" />

        <div className="relative z-10 space-y-12">
          
          {/* Stat Cards Me Stil "Glass" */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: t?.totalScans, value: '1,284', color: 'text-white' },
              { label: t?.blockedThreats, value: '42', color: 'text-rose-500' },
              { label: t?.cleanRate, value: '96.7%', color: 'text-cyan-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-[24px] p-8 hover:bg-white/[0.05] transition-all duration-500 group">
                <p className="text-[9px] tracking-[0.4em] text-slate-500 mb-6 font-black uppercase group-hover:text-cyan-400 transition-colors">
                  {stat.label}
                </p>
                <p className={`text-5xl font-black tracking-tighter ${stat.color} italic`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Traffic Analysis Card */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-10 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-slate-500 font-black">
                // {t?.trafficAnalysis}
              </h3>
              <div className="flex items-center gap-4 text-[9px] font-black tracking-widest text-cyan-400">
                <span className="opacity-50">LIVE_STREAM</span>
                <div className="w-12 h-[1px] bg-cyan-400/30" />
              </div>
            </div>

            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="dashboardGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,150 Q150,50 300,130 T600,70 T1000,110 L1000,200 L0,200 Z" fill="url(#dashboardGrad)" />
                <path d="M0,150 Q150,50 300,130 T600,70 T1000,110" fill="none" stroke="#22d3ee" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              </svg>
            </div>

            <div className="flex justify-between mt-8 border-t border-white/5 pt-6 text-[9px] text-slate-600 font-black tracking-[0.3em]">
              <span>00:00</span>
              <span>08:00</span>
              <span>16:00</span>
              <span>23:59</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Dashboard;
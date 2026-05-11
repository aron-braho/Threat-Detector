import React from 'react';

const Dashboard = ({ t }) => {
  return (
    <main className="flex-1 overflow-y-auto p-12 relative z-10 custom-scrollbar h-full">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[size:60px_60px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]" />

      <header className="mb-16 flex justify-between items-center relative z-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
            {t?.systemOverview || "System Overview"}
          </h1>
          <p className="text-slate-500 text-xs tracking-[0.4em] font-medium uppercase">
            {t?.nodeStatus || "Real-time Node Status: Active"}
          </p>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 relative z-10">
        {[
          { label: t?.totalScans || 'Total Scans', value: '1,284', color: 'text-white' },
          { label: t?.blockedThreats || 'Blocked Threats', value: '42', color: 'text-rose-500' },
          { label: t?.cleanRate || 'Clean Rate', value: '96.7%', color: 'text-cyan-400' },
        ].map((stat) => (
          <div key={stat.label} className="border-b border-white/5 pb-8 group">
            <p className="text-[10px] tracking-[0.2em] text-slate-500 mb-4 font-bold uppercase transition-colors group-hover:text-cyan-500">
              {stat.label}
            </p>
            <p className={`text-5xl font-black tracking-tighter ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Network Traffic Section */}
      <section className="bg-white/[0.07] border border-white/5 rounded-3xl p-10 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-xs tracking-[0.3em] text-slate-400 font-bold uppercase">// {t?.trafficAnalysis || "Network_Traffic_Analysis"}</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]"/> 
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{t?.inbound || "Inbound"}</span>
          </div>
        </div>
        
        <div className="h-64 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,150 Q150,50 300,130 T600,70 T1000,110 L1000,200 L0,200 Z" fill="url(#chartGradient)" />
            <path d="M0,150 Q150,50 300,130 T600,70 T1000,110" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
          </svg>
        </div>
        
        <div className="flex justify-between mt-8 text-[10px] text-slate-600 font-bold tracking-widest">
          <span>00:00</span><span>08:00</span><span>16:00</span><span>23:59</span>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
export const styles = {
  container: "min-h-screen bg-[#0a0a0a] text-slate-300 font-mono selection:bg-cyan-500/30 overflow-x-hidden",
  bgAmbient: "fixed inset-0 pointer-events-none",
  bgGradient: "absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent",
  bgGrid: "absolute inset-0 opacity-[0.25]",
  bgOverlay: "absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black",
  nav: "relative z-10 p-8 border-b border-white/10 bg-black/60 backdrop-blur-xl",
  navContent: "container mx-auto max-w-4xl flex justify-between items-center",
  main: "relative z-10 container mx-auto max-w-4xl mt-16 px-6",
  inputCard: "bg-white/[0.05] border border-white/20 rounded-sm p-8 backdrop-blur-md shadow-[0_0_50px_-12px_rgba(34,211,238,0.1)]",
  textarea: "w-full h-40 p-6 bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 outline-none transition-all text-sm leading-relaxed text-slate-100 placeholder-slate-600 resize-none mb-6",
  analyzeBtn: "w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-black font-black text-xs uppercase tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]",
  resultSection: "mt-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700",
  resultCard: "flex flex-col lg:flex-row items-stretch justify-between w-full bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md gap-0",
  
  // New separated layout sections
  wheelSection: "w-full lg:w-[30%] p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 bg-black/20",
  textSection: "w-full lg:w-[70%] p-10 flex flex-col justify-start space-y-8",
  
  // Wheel & assessment
  threatAssessmentLabel: "text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-8 font-bold text-center",
  riskBadge: "flex items-center gap-2 px-4 py-2 rounded-full border mt-8",
  riskBadgeHigh: "border-rose-500/20 bg-rose-500/10",
  riskBadgeLow: "border-emerald-500/20 bg-emerald-500/10",
  riskBadgeTextHigh: "text-[10px] font-bold uppercase tracking-widest text-rose-500",
  riskBadgeTextLow: "text-[10px] font-bold uppercase tracking-widest text-emerald-400",
  
  // Verdict section
  verdictLabel: "text-[11px] uppercase tracking-[0.5em] text-cyan-500/50 mb-2 font-black italic",
  verdictText: "text-6xl font-black tracking-tighter",
  
  // Intelligence report
  reportLabel: "text-[11px] uppercase tracking-[0.5em] text-slate-500 font-bold",
  reportBox: "bg-black/40 p-8 border-l-4 border-cyan-500 shadow-2xl rounded-r-xl",
  reportItem: "flex items-start gap-5 group",
  reportIndex: "text-cyan-500 font-mono font-bold text-lg leading-none pt-1",
  reportText: "text-[16px] text-slate-200 leading-relaxed font-medium group-hover:text-white transition-colors",
};
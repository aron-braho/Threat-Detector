export const styles = {
  // 1. Updated font-mono to font-space
  container: "min-h-screen bg-[#1a202c] text-slate-100 font-space selection:bg-cyan-500/30 overflow-x-hidden",
  bgAmbient: "fixed inset-0 pointer-events-none",
  
  // 3. Increased gradient opacity (from 30 to 40) to give more "glow"
  bgGradient: "absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-800/40 via-transparent to-transparent",
  
  // 4. Boosted grid opacity for better visibility
  bgGrid: "absolute inset-0 opacity-[0.5]", 
  bgOverlay: "absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30",
  
  // 5. Made the Nav slightly more opaque
  main: "relative z-10 container mx-auto max-w-4xl pt-8 px-6",
  
  // 6. INCREASED CARD VISIBILITY: Changed bg-white/[0.08] to [0.12] and border to /40
  inputCard: "bg-white/[0.12] border border-white/40 rounded-sm p-8 backdrop-blur-md shadow-[0_0_60px_-12px_rgba(34,211,238,0.2)]",
  
  textarea: "w-full h-40 p-6 bg-white/[0.08] border border-white/20 focus:border-cyan-400 outline-none transition-all text-sm leading-relaxed text-white placeholder-slate-400 resize-none mb-6",
  
  // 7. Brightened the Cyan button
  analyzeBtn: "w-full py-4 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-700 text-black font-black text-xs uppercase tracking-[0.3em] transition-all shadow-[0_0_25px_rgba(34,211,238,0.4)]",
  
  resultSection: "mt-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700",
  
  // 8. Result Card: Higher background opacity so it sits "above" the grid clearly
  resultCard: "flex flex-col lg:flex-row items-stretch justify-between w-full bg-white/[0.1] border border-white/25 rounded-2xl overflow-hidden backdrop-blur-md gap-0",

  wheelSection: "w-full lg:w-[30%] p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/20 bg-white/[0.05]",
  textSection: "w-full lg:w-[70%] p-10 flex flex-col justify-start space-y-8",

  threatAssessmentLabel: "text-[10px] uppercase tracking-[0.4em] text-slate-300 mb-8 font-bold text-center",
  
  // 9. High-Contrast Badges
  riskBadge: "flex items-center gap-2 px-4 py-2 rounded-full border mt-8",
  riskBadgeHigh: "border-rose-400 bg-rose-500/25",
  riskBadgeLow: "border-emerald-400 bg-emerald-500/25",
  riskBadgeTextHigh: "text-[10px] font-bold uppercase tracking-widest text-rose-300",
  riskBadgeTextLow: "text-[10px] font-bold uppercase tracking-widest text-emerald-300",

  verdictLabel: "text-[11px] uppercase tracking-[0.5em] text-cyan-300 mb-2 font-black italic",
  verdictText: "text-6xl font-black tracking-tighter text-white",

  reportLabel: "text-[11px] uppercase tracking-[0.5em] text-slate-300 font-bold",
  
  // 10. Stronger highlight on the report box
  reportBox: "bg-white/[0.07] p-8 border-l-4 border-cyan-400 shadow-2xl rounded-r-xl",
  reportItem: "flex items-start gap-5 group",
  // Kept reportIndex as font-mono for that technical look, change to font-space if preferred
  reportIndex: "text-cyan-300 font-mono font-bold text-lg leading-none pt-1", 
  reportText: "text-[16px] text-white leading-relaxed font-medium group-hover:text-cyan-200 transition-colors",
};
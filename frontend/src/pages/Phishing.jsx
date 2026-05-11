import React, { useState, useEffect } from 'react';

/* ─── Shared Risk Gauge ─── */
const RiskGauge = ({ value, t }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = (value || 0) / (duration / 10);
    const timer = setInterval(() => {
      start += increment;
      if (start >= (value || 0)) {
        setDisplayValue(value || 0);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 10);
    return () => clearInterval(timer);
  }, [value]);

  const color = value > 60 ? '#ff3366' : '#22d3ee';

  return (
    <div className="relative flex items-center justify-center w-32 h-32 shrink-0">
      <svg className="absolute w-full h-full -rotate-90">
        <circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="transparent" />
        <circle
          cx="64" cy="64" r="58" stroke={color} strokeWidth="2" fill="transparent"
          strokeDasharray={364}
          strokeDashoffset={364 - (364 * (value || 0)) / 100}
          className="transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1)"
          strokeLinecap="butt"
        />
      </svg>
      <div className="text-center">
        <span className="text-3xl font-extralight tracking-tighter italic" style={{ color }}>
          {displayValue}<span className="text-[10px] opacity-40 ml-0.5">/100</span>
        </span>
        <div className="text-[8px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-bold">
          {t?.threatLevel || "RISK LEVEL"}
        </div>
      </div>
    </div>
  );
};

const Phishing = ({ t }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('sms');

  const handlephishing = async () => {
    if (!text) return;
    setLoading(true);
    setResult(null);
    try {
      // URL-ja e saktë që përputhet me Backend-in tënd (main.py)
      const response = await fetch("https://threat-detector-xz9q.onrender.com/phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, type: type }),
      });
      
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      
      const data = await response.json();
      setResult(data);
    } catch (e) { 
      console.error("Connection severed:", e);
      // Krijo një rezultat fallco për të mos lejuar faqen të bëhet e bardhë në rast gabimi
      setResult({
        risk_score: 0,
        verdict: "GABIM LIDHJEJE",
        explanation: "Nuk u mor dot përgjigje nga serveri. Kontrolloni nëse Backend-i në Render është LIVE."
      });
    }
    setLoading(false);
  };

  const resetAnalysis = () => {
    setResult(null);
    setText('');
  };

  return (
    <main className="h-full flex flex-col bg-[#0f172a] text-slate-200 font-space overflow-hidden">
      
      {/* ─── Header ─── */}
      <div className="px-12 pt-14 pb-8 flex justify-between items-end border-b border-white/[0.03] shrink-0">
        <div className="space-y-1">
          <h2 className="text-[9px] uppercase tracking-[0.7em] text-cyan-400/50 font-black">
            {t?.intelligentScanner || "AI SCANNER"}
          </h2>
          <p className="text-4xl font-extralight tracking-tight text-white leading-none">
            {t?.detector || "DETECTOR"} <span className="font-black italic text-cyan-400">{t?.phishing || "PHISHING"}</span>
          </p>
        </div>
        
        {!result ? (
          <div className="flex bg-white/5 backdrop-blur-3xl p-1 rounded-2xl border border-white/10">
            {['sms', 'email'].map((tabType) => (
              <button
                key={tabType}
                onClick={() => setType(tabType)}
                className={`px-8 py-2 text-[9px] uppercase tracking-widest font-black transition-all duration-500 rounded-xl ${
                  type === tabType ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t?.[tabType] || tabType}
              </button>
            ))}
          </div>
        ) : (
          <button 
            onClick={resetAnalysis}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            ← {t?.newAnalysis || "NEW SCAN"}
          </button>
        )}
      </div>

      {/* ─── Viewport ─── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        
        {/* VIEW 1: Input Card */}
        {!result && (
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col bg-white/[0.03] backdrop-blur-3xl rounded-[32px] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
              <label className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-6 font-black text-center">
                {t?.payloadEntry || "INPUT DATA"}
              </label>

              <div className="relative group">
                <textarea
                  className="w-full h-48 bg-white/[0.01] border border-white/5 rounded-[20px] p-6 text-sm leading-relaxed focus:bg-white/[0.04] focus:border-cyan-500/30 outline-none transition-all resize-none placeholder:text-slate-800 italic font-light text-center"
                  placeholder={t?.pasteContent ? `${t.pasteContent} ${type}...` : "Paste here..."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <button
                onClick={handlephishing}
                disabled={loading || !text}
                className={`mt-8 py-4 rounded-[16px] text-[10px] font-black uppercase tracking-[0.5em] transition-all duration-500
                  ${!text || loading 
                    ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed' 
                    : 'bg-white text-slate-900 hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 shadow-lg'
                  }`}
              >
                {loading ? (t?.processing || "SCANNING...") : (t?.executeAudit || "EXECUTE AUDIT")}
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: Results Display */}
        {result && (
          <div className="w-full max-w-5xl h-[85%] bg-white/[0.02] backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-1000 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-12">
              
              <div className="flex items-center gap-12 mb-12 border-b border-white/[0.03] pb-12">
                <RiskGauge value={result?.risk_score} t={t} />
                <div className="flex-1">
                  <h3 className="text-[9px] uppercase tracking-[0.8em] text-slate-500 mb-3 font-black">
                    {t?.heuristicResult || "HEURISTIC ANALYSIS"}
                  </h3>
                  <p className={`text-[100px] font-black tracking-tighter italic leading-none ${
                    (result?.risk_score || 0) > 60 ? 'text-rose-500' : 'text-cyan-400'
                  }`}>
                    {/* Optional chaining prevents crashes if result.verdict is undefined */}
                    {result?.verdict?.toUpperCase() || "PENDING"}
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                <h3 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 font-black">
                  {t?.analyticalFindings || "FINDINGS"}
                </h3>
                <div className="grid gap-8">
                  {result?.explanation ? result.explanation.split('. ').map((point, index) => (
                    point.trim() && (
                      <div key={index} className="flex gap-10 group">
                        <span className="text-[10px] font-black text-white/10 group-hover:text-cyan-400 transition-colors pt-1">
                          {index + 1} //
                        </span>
                        <p className="text-2xl text-slate-300 font-extralight leading-snug group-hover:text-white transition-colors">
                          {point.trim()}.
                        </p>
                      </div>
                    )
                  )) : (
                    <p className="text-slate-500 italic">No detailed analysis available.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Phishing;
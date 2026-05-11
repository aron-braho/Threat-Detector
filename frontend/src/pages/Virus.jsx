import React, { useState, useEffect, useRef } from 'react';

/* ─── Shared Risk Gauge (Përshtatur me stilin e ri) ─── */
const RiskGauge = ({ value, t }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 10);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 10);
    return () => clearInterval(timer);
  }, [value]);

  const color = value > 60 ? '#ff3366' : '#22d3ee';

  return (
    <div className="relative flex items-center justify-center w-40 h-40 shrink-0">
      <svg className="absolute w-full h-full -rotate-90">
        <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="transparent" />
        <circle
          cx="80" cy="80" r="72" stroke={color} strokeWidth="2" fill="transparent"
          strokeDasharray={452}
          strokeDashoffset={452 - (452 * value) / 100}
          className="transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1)"
        />
      </svg>
      <div className="text-center">
        <span className="text-4xl font-extralight tracking-tighter italic" style={{ color }}>
          {displayValue}<span className="text-[12px] opacity-40 ml-0.5">/100</span>
        </span>
        <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-black">
          {t?.threatLevel}
        </div>
      </div>
    </div>
  );
};

const ScanBar = ({ active }) => (
  <div
    className="absolute left-0 right-0 h-[2px] pointer-events-none transition-opacity duration-300 z-10"
    style={{
      background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)',
      boxShadow: '0 0 15px #22d3ee',
      opacity: active ? 1 : 0,
      animation: active ? 'scanDown 1.8s linear infinite' : 'none',
      top: 0,
    }}
  />
);

const Virus = ({ t }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [scanLog, setScanLog] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!loading) return;
    const lines = [
      'Initializing environment...',
      'Isolating file buffer...',
      'Extracting metadata...',
      'Calculating file entropy...',
      'Heuristic engine active...',
      'Finalizing threat report...'
    ];
    let i = 0;
    setScanLog([]);
    const timer = setInterval(() => {
      if (i < lines.length) {
        setScanLog((prev) => [...prev, lines[i]]);
        i++;
      } else { clearInterval(timer); }
    }, 250);
    return () => clearInterval(timer);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://127.0.0.1:8000/virus', { method: 'POST', body: formData });
      const data = await response.json();
      data.error ? setError("AI unavailable.") : setResult(data);
    } catch { setError("Connection failed."); }
    setLoading(false);
  };

  return (
    <main className="h-full flex flex-col bg-[#0f172a] text-slate-200 font-space overflow-hidden">
      
      {/* ─── Header ─── */}
      <div className="px-12 pt-14 pb-8 flex justify-between items-end border-b border-white/[0.03] shrink-0">
        <div className="space-y-1">
          <h2 className="text-[9px] uppercase tracking-[0.7em] text-cyan-400/50 font-black">
            {t?.intelligentScanner || "Intelligent Scanner"}
          </h2>
          <p className="text-4xl font-extralight tracking-tight text-white leading-none uppercase">
             {t?.virusScan || "Virus"} <span className="font-black italic text-cyan-400">SCANNER</span>
          </p>
        </div>
        
        {result && (
          <button 
            onClick={() => {setResult(null); setFile(null);}}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            ← {t?.newAnalysis}
          </button>
        )}
      </div>

      {/* ─── Viewport ─── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]" />

        {!result && (
          <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-700 relative z-10">
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[32px] border border-white/10 p-10 shadow-2xl">
              
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); setDragOver(false); }}
                onClick={() => fileInputRef.current?.click()}
                className="relative overflow-hidden cursor-pointer border-2 border-dashed rounded-[24px] transition-all duration-500 flex flex-col items-center justify-center gap-6 py-16 px-10 mb-8"
                style={{
                  borderColor: dragOver ? '#22d3ee' : file ? '#10b981' : 'rgba(255,255,255,0.1)',
                  background: dragOver ? 'rgba(34,211,238,0.05)' : 'rgba(255,255,255,0.01)',
                }}
              >
                <ScanBar active={loading} />
                <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />

                <div className={`p-5 rounded-2xl border transition-all duration-500 ${file ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={file ? '#10b981' : '#475569'} strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>

                {file ? (
                  <div className="text-center">
                    <p className="text-emerald-400 font-black text-sm tracking-widest uppercase italic">{file.name}</p>
                    <p className="text-slate-500 text-[9px] mt-2 font-black tracking-[0.2em] uppercase">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-black">{t?.dropFile || "Select Target"}</p>
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !file}
                className={`w-full py-5 rounded-[18px] text-[11px] font-black uppercase tracking-[0.5em] transition-all duration-500
                  ${!file 
                    ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed' 
                    : 'bg-white text-slate-900 hover:bg-cyan-400 hover:scale-[1.01] shadow-xl'
                  }`}
              >
                {loading ? t?.scanning : (t?.executeAnalysis || "Initialize Scan")}
              </button>

              {loading && (
                <div className="mt-8 bg-black/20 border border-white/5 rounded-2xl p-6 h-32 overflow-hidden font-mono text-[9px] text-cyan-400/60 space-y-1.5 backdrop-blur-md">
                  {scanLog.map((line, i) => (
                    <div key={i} className="flex gap-4 animate-in slide-in-from-left-2 duration-300">
                      <span className="text-slate-700 font-black">LOG_0{i}</span>
                      <span className="uppercase tracking-tighter italic">{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="w-full max-w-6xl h-[85%] bg-white/[0.02] backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-1000 overflow-hidden relative z-10">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
              
              <div className="flex items-center gap-16 mb-16 border-b border-white/[0.03] pb-16">
                <RiskGauge value={result.risk_score} t={t} />
                <div className="flex-1">
                  <h3 className="text-[10px] uppercase tracking-[0.8em] text-slate-500 mb-4 font-black">
                    {t?.heuristicResult || "Engine Verdict"}
                  </h3>
                  <p className={`text-[100px] font-black tracking-tighter italic leading-none ${
                    result.risk_score > 60 ? 'text-rose-500' : 'text-emerald-400'
                  }`}>
                    {result.verdict.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-12">
                <h3 className="text-[10px] uppercase tracking-[0.6em] text-slate-500 font-black">
                  {t?.analyticalFindings}
                </h3>
                <div className="grid gap-10">
                  {result.explanation.split('. ').map((point, index) => (
                    point.trim() && (
                      <div key={index} className="flex gap-12 group">
                        <span className="text-[11px] font-black text-white/10 group-hover:text-cyan-400 transition-colors pt-1">
                          {index + 1} //
                        </span>
                        <p className="text-2xl text-slate-300 font-extralight leading-snug group-hover:text-white transition-colors">
                          {point.trim()}.
                        </p>
                      </div>
                    )
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanDown { 0% { top: 0; opacity: 1; } 90% { top: 100%; opacity: 1; } 100% { top: 100%; opacity: 0; } }
      `}</style>
    </main>
  );
};

export default Virus;
import React, { useState, useEffect } from 'react';
import { styles } from '../AppStyles'; 

const RiskGauge = ({ value }) => {
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

  const color = value > 60 ? '#f43f5e' : '#10b981';

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
        <circle
          cx="96" cy="96" r="80" stroke={color} strokeWidth="8" fill="transparent"
          strokeDasharray={502.4}
          strokeDashoffset={502.4 - (502.4 * value) / 100}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center">
        <span className="text-5xl font-mono font-black tracking-tighter" style={{ color }}>
          {displayValue}
        </span>
        <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-1 font-bold">Threat Level</div>
      </div>
    </div>
  );
};

const Phishing = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('sms');

  const handlephishing = async () => {
    if (!text) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, type: type }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <main className={styles.main}>
      {/* INPUT CARD */}
      <div className={styles.inputCard}>
        <div className="flex gap-4 mb-8">
          {['sms', 'email'].map((t) => (
            <button 
              key={t} 
              onClick={() => setType(t)}
              className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border ${
                type === t ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <textarea 
          className={styles.textarea} 
          placeholder={`Waiting for ${type} input raw data...`} 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />

        <button 
          onClick={handlephishing} 
          disabled={loading} 
          className={styles.phishingBtn}
        >
          {loading ? 'Scanning...' : 'Execute Analysis'}
        </button>
      </div>

      
      {/* RESULTS SECTION - SEPARATED LAYOUT */}
      {result && (
        <div className={styles.resultSection}>
          <div className="grid grid-cols-3 gap-8 w-full items-stretch">
            
            {/* LEFT SECTION: WHEEL ONLY - 1 column */}
            <div className="col-span-1 bg-white/[0.03] border border-white/10 rounded-2xl p-12 backdrop-blur-md flex flex-col items-center justify-center">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-12 font-bold text-center">Threat Assessment</h3>
              
              <div className="transform scale-100">
                <RiskGauge value={result.risk_score} />
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border mt-12 ${result.risk_score > 60 ? 'border-rose-500/20 bg-rose-500/10' : 'border-emerald-500/20 bg-emerald-500/10'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${result.risk_score > 60 ? 'text-rose-500' : 'text-emerald-400'}`}>
                  {result.risk_score > 60 ? '⚠️ High Risk' : '✅ Low Risk'}
                </span>
              </div>
            </div>

            {/* RIGHT SECTION: TEXT & INTELLIGENCE - 2 columns (BIGGER) */}
            <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl p-12 backdrop-blur-md flex flex-col justify-start space-y-8">
              
              {/* Verdict */}
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-cyan-500/50 mb-2 font-black italic">System Verdict</h3>
                <p className={`text-6xl font-black tracking-tighter ${result.risk_score > 60 ? 'text-rose-500' : 'text-emerald-400'}`}>
                  {result.verdict.toUpperCase()}
                </p>
              </div>

              {/* Intelligence Report */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-slate-500 font-bold">Intelligence Report</h3>
                <div className="bg-black/40 p-8 border-l-4 border-cyan-500 shadow-2xl rounded-r-xl">
                  <ul className="space-y-6">
                    {result.explanation.split('. ').map((point, index) => (
                      point.trim() && (
                        <li key={index} className="flex items-start gap-5 group">
                          <span className="text-cyan-500 font-mono font-bold text-lg leading-none pt-1">[{index + 1}]</span>
                          <p className="text-[16px] text-slate-200 leading-relaxed font-medium group-hover:text-white transition-colors">
                            {point.trim()}{!point.endsWith('.') && '.'}
                          </p>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Phishing;
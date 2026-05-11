import React, { useState, useEffect, useRef } from 'react';
import { styles } from '../AppStyles';

/* ─── Animated scan line that sweeps across the file content ─── */
const ScanBar = ({ active }) => (
  <div
    className="absolute left-0 right-0 h-[2px] pointer-events-none transition-opacity duration-300"
    style={{
      background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)',
      opacity: active ? 1 : 0,
      animation: active ? 'scanDown 1.8s linear infinite' : 'none',
      top: 0,
    }}
  />
);

/* ─── Hexagonal threat badge ─── */
const ThreatBadge = ({ label, value, color }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="w-16 h-16 flex items-center justify-center text-lg font-black font-mono"
      style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: `${color}22`,
        border: `1px solid ${color}55`,
        color,
      }}
    >
      {value}
    </div>
    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">{label}</span>
  </div>
);

/* ─── Animated progress bar ─── */
const ScanProgress = ({ label, percent, color = '#22d3ee' }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 100);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-mono">
        <span className="text-slate-400 uppercase tracking-widest">{label}</span>
        <span style={{ color }}>{percent}%</span>
      </div>
      <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
};

/* ─── Main component ─── */
const Virus = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [scanLog, setScanLog] = useState([]);
  const fileInputRef = useRef(null);
  const logRef = useRef(null);

  /* Stream fake log lines while scanning */
  useEffect(() => {
    if (!loading) return;
    const lines = [
      'Initializing sandbox environment...',
      'Unpacking file headers...',
      'Reading PE/ELF structure...',
      'Checking entropy signature...',
      'Cross-referencing threat DB...',
      'Analyzing obfuscation patterns...',
      'Inspecting syscall chains...',
      'Running heuristic engine v4.2...',
      'Comparing against known IOCs...',
      'Generating threat report...',
    ];
    let i = 0;
    setScanLog([]);
    const t = setInterval(() => {
      if (i < lines.length) {
        setScanLog((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(t);
      }
    }, 220);
    return () => clearInterval(t);
  }, [loading]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [scanLog]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:8000/virus', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setError('AI model unavailable. Please retry in a moment.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Could not reach the server. Is the backend running?');
    }

    setLoading(false);
  };

  const isMalicious = result && result.risk_score > 60;

  return (
    <main className={styles.main}>

      {/* ── INPUT CARD ── */}
      <div className={styles.inputCard}>
        <div className="mb-6">
          <h2 className="text-[11px] uppercase tracking-[0.4em] text-slate-500 font-bold mb-1">
            File Scanner
          </h2>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">
            Upload a file for deep static + heuristic analysis
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative overflow-hidden cursor-pointer border rounded-sm transition-all duration-300 flex flex-col items-center justify-center gap-4 py-12 px-6 mb-6"
          style={{
            borderColor: dragOver ? '#22d3ee' : file ? '#10b981' : 'rgba(255,255,255,0.08)',
            background: dragOver
              ? 'rgba(34,211,238,0.04)'
              : file
              ? 'rgba(16,185,129,0.04)'
              : 'rgba(255,255,255,0.01)',
          }}
        >
          <ScanBar active={loading} />

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* Icon */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="8" y="4" width="18" height="24" rx="1" stroke={file ? '#10b981' : '#334155'} strokeWidth="1.5" />
            <path d="M26 4l6 6" stroke={file ? '#10b981' : '#334155'} strokeWidth="1.5" />
            <rect x="26" y="4" width="6" height="6" rx="0" stroke={file ? '#10b981' : '#334155'} strokeWidth="1.5" />
            <line x1="13" y1="15" x2="27" y2="15" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />
            <line x1="13" y1="19" x2="23" y2="19" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
          </svg>

          {file ? (
            <div className="text-center">
              <p className="text-emerald-400 font-mono font-bold text-sm tracking-wider">{file.name}</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">
                {(file.size / 1024).toFixed(1)} KB · {file.type || 'unknown type'}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-400 text-[11px] uppercase tracking-[0.2em] font-bold">
                Drop file here or click to browse
              </p>
              <p className="text-slate-600 text-[10px] uppercase tracking-widest mt-1">
                .exe · .dll · .pdf · .zip · .js · any format
              </p>
            </div>
          )}
        </div>

        {/* Scan button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          className="w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
        >
          {loading ? 'Scanning...' : 'Execute Deep Scan'}
        </button>

        {/* Live scan log */}
        {loading && (
          <div
            ref={logRef}
            className="mt-4 bg-black/60 border border-white/5 rounded-sm p-4 h-28 overflow-y-auto font-mono text-[10px] text-cyan-500/70 space-y-1 scroll-smooth"
          >
            {scanLog.map((line, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-600">[{String(i + 1).padStart(2, '0')}]</span>
                <span>{line}</span>
              </div>
            ))}
            <div className="flex gap-2 animate-pulse">
              <span className="text-slate-600">[  ]</span>
              <span className="text-cyan-500">█</span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-rose-500 text-[11px] uppercase tracking-widest mt-4 text-center">
            ⚠ {error}
          </p>
        )}
      </div>

      {/* ── RESULTS ── */}
      {result && (
        <div className={styles.resultSection}>
          <div className="grid grid-cols-5 gap-8 w-full items-stretch">

            {/* LEFT: verdict + badges */}
            <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl p-10 backdrop-blur-md flex flex-col items-center justify-center gap-8">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold text-center">
                Threat Assessment
              </h3>

              {/* Big verdict pill */}
              <div
                className="px-8 py-5 rounded-full border text-center"
                style={{
                  borderColor: isMalicious ? '#f43f5e44' : '#10b98144',
                  background: isMalicious ? '#f43f5e11' : '#10b98111',
                }}
              >
                <p
                  className="text-4xl font-black tracking-tighter font-mono"
                  style={{ color: isMalicious ? '#f43f5e' : '#10b981' }}
                >
                  {result.verdict?.toUpperCase()}
                </p>
                <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 mt-1 font-bold">
                  {isMalicious ? '⚠ Threat Detected' : '✅ File Appears Clean'}
                </p>
              </div>

              {/* Score badges */}
              <div className="flex gap-6 flex-wrap justify-center">
                <ThreatBadge
                  label="Risk"
                  value={result.risk_score}
                  color={isMalicious ? '#f43f5e' : '#10b981'}
                />
                {result.confidence != null && (
                  <ThreatBadge label="Confidence" value={`${result.confidence}%`} color="#22d3ee" />
                )}
                {result.threat_type && (
                  <ThreatBadge label="Type" value={result.threat_type.slice(0, 4).toUpperCase()} color="#f59e0b" />
                )}
              </div>

              {/* Progress bars */}
              {result.scan_metrics && (
                <div className="w-full space-y-3 pt-2">
                  {result.scan_metrics.map((m, i) => (
                    <ScanProgress key={i} label={m.label} percent={m.percent} color={m.color} />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: intelligence report */}
            <div className="col-span-3 bg-white/[0.03] border border-white/10 rounded-2xl p-10 backdrop-blur-md flex flex-col justify-start space-y-8">

              <div>
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-cyan-500/50 mb-2 font-black italic">
                  System Verdict
                </h3>
                <p
                  className="text-5xl font-black tracking-tighter"
                  style={{ color: isMalicious ? '#f43f5e' : '#10b981' }}
                >
                  {result.verdict?.toUpperCase()}
                </p>
              </div>

              {/* File metadata */}
              {result.file_info && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(result.file_info).map(([k, v]) => (
                    <div key={k} className="bg-black/30 rounded px-4 py-3 border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1">{k}</p>
                      <p className="text-[11px] font-mono text-slate-200 truncate">{v}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Intelligence report */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[11px] uppercase tracking-[0.5em] text-slate-500 font-bold">
                  Intelligence Report
                </h3>
                <div className="bg-black/40 p-8 border-l-4 border-cyan-500 shadow-2xl rounded-r-xl">
                  <ul className="space-y-6">
                    {result.explanation
                      .split('. ')
                      .filter((p) => p.trim())
                      .map((point, index) => (
                        <li key={index} className="flex items-start gap-5 group">
                          <span className="text-cyan-500 font-mono font-bold text-lg leading-none pt-1">
                            [{index + 1}]
                          </span>
                          <p className="text-[15px] text-slate-200 leading-relaxed font-medium group-hover:text-white transition-colors">
                            {point.trim()}{!point.endsWith('.') && '.'}
                          </p>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan-down keyframe */}
      <style>{`
        @keyframes scanDown {
          0%   { top: 0; opacity: 1; }
          90%  { top: 100%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </main>
  );
};

export default Virus;
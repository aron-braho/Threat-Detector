import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { styles } from './AppStyles';
import Phishing from './pages/Phishing'; // Faqja që ke tani
import Dashboard from './pages/Dashboard'; // Faqe e re shembull

function App() {
  return (
    <Router>
      <div className={styles.container}>
        {/* BACKGROUND AMBIENT (Qëndron në çdo faqe) */}
        <div className={styles.bgAmbient}>
          <div className={styles.bgGradient}></div>
          <div className={styles.bgGrid} style={{ backgroundImage: `linear-gradient(#22d3ee 0.5px, transparent 0.5px), linear-gradient(90deg, #22d3ee 0.5px, transparent 0.5px)`, backgroundSize: '60px 60px' }}></div>
          <div className={styles.bgOverlay}></div>
        </div>

        {/* NAVIGATION (Qëndron në çdo faqe) */}
        <nav className={styles.nav}>
          <div className={styles.navContent}>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-[0.2em] text-white">THREAT DETECTOR</span>
                <span className="text-[10px] text-cyan-500/50 uppercase tracking-widest">Multi-Module Interface</span>
              </div>
              
              {/* MENU LINKS */}
              <div className="hidden md:flex gap-6 ml-10">
                <Link to="/" className="text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors">Dashboard</Link>
                <Link to="/analyze" className="text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors text-cyan-400">Phishing</Link>
                <Link to="/history" className="text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors opacity-50 cursor-not-allowed">Logs</Link>
              </div>
            </div>

            <div className="text-[10px] text-right hidden sm:block">
              <p>NODE_STATUS: ONLINE</p>
              <p className="text-cyan-500/50 italic">SECURE_CHANNEL_ACTIVE</p>
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT (Ndryshon këtu) */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<Phishing />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
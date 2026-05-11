import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Phishing from './pages/Phishing';
import { translations } from './translations';

function App() {
  const [lang, setLang] = useState('en');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const t = translations[lang];

  return (
    <Router>
      <div className="flex h-screen bg-[#0b111a] overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          lang={lang} 
          setLang={setLang}
          t={t} 
        />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard t={t} />} />
            <Route path="/analyze" element={<Phishing t={t} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { styles } from '../AppStyles';

const Dashboard = () => (
  <main className={styles.main}>
    <div className={styles.inputCard}>
      <h2 className="text-xl font-bold text-white mb-4 tracking-widest">SYSTEM OVERVIEW</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 border border-white/10">
          <p className="text-[10px] text-slate-500 uppercase">Total Scans</p>
          <p className="text-2xl text-cyan-400 font-bold">1,284</p>
        </div>
        <div className="p-4 bg-white/5 border border-white/10">
          <p className="text-[10px] text-slate-500 uppercase">Threats Blocked</p>
          <p className="text-2xl text-rose-500 font-bold">42</p>
        </div>
      </div>
    </div>
  </main>
);

export default Dashboard;
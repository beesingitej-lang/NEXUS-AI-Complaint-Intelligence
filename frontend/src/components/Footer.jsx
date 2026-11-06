import React from 'react';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 border-t border-navy-800 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">NEXUS</span>
            <span className="text-xs text-slate-500">| AI Complaint Intelligence Platform</span>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Designed for transparent, predictive campus problem resolution. Simple English. No clutter.
          </p>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              College Project Edition
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

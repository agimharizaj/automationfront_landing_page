// TODO: Update contact email and LinkedIn URL before launch
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-16 print:hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <span className="text-white font-black text-xl">A</span>
            </div>
            <span className="font-black text-slate-900 tracking-tighter text-2xl uppercase">AutomationFront</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            <a 
              href="mailto:agimharizaj600@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-orange-600 font-black uppercase text-xs tracking-[0.2em] transition-colors"
            >
              Contact
            </a>
            <a 
              href="https://www.linkedin.com/in/agim-harizaj/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-orange-600 font-black uppercase text-xs tracking-[0.2em] transition-colors"
            >
              LinkedIn
            </a>
          </nav>
          
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest">
            © 2025 AutomationFront. Systems Optimised.
          </div>
        </div>
      </div>
    </footer>
  );
};
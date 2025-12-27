
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-sm font-black uppercase tracking-widest mb-6 border border-orange-500/30">
          <span className="flex h-2 w-2 rounded-full bg-orange-600 mr-2 animate-pulse"></span>
          Operator-Led Insights
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Identify the processes <span className="text-orange-600 italic">killing your team's velocity</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Free 10-minute diagnostic for startup founders. Get a scored report showing automation potential + estimated time savings.
        </p>
        <button
          onClick={onStart}
          className="group inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-black py-5 px-10 rounded-xl shadow-xl shadow-orange-900/40 hover:shadow-orange-900/60 transition-all duration-300 transform active:scale-95"
        >
          Start Diagnosis
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

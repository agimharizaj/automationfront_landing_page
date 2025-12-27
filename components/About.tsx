// TODO: Update LinkedIn URL with your actual profile before launch
import React from 'react';

export const About: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-10 flex justify-center">
          <div className="w-28 h-28 rounded-3xl border-4 border-white shadow-2xl rotate-3 bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center">
            <span className="text-5xl font-black text-white">A</span>
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Operator Built</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-medium italic">
          "I scaled operations at <a href="https://www.thanksben.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline decoration-orange-200 decoration-2 underline-offset-4 transition-all">Ben</a> from 1 to 12 people and then back to 6 over 5 years through heavy automation. I realised that 60% of team burnout stems from avoidable manual friction. I built AutomationFront to help founders identify and eliminate operational bottlenecks before they become fatal."
        </p>
        <a 
          href="https://www.linkedin.com/in/agim-harizaj/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-orange-600 font-black uppercase tracking-widest hover:text-orange-700 inline-flex items-center transition-colors border-b-2 border-orange-200 pb-1"
        >
          Connect on LinkedIn →
        </a>
      </div>
    </section>
  );
};
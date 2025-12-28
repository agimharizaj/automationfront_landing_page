import React from 'react';
import { ClipboardCheck, BarChart3, Calendar } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Analyse Key Workflows",
      description: "Answer 11 questions about your process: team size, tools, error frequency, and time spent on manual work.",
      icon: <ClipboardCheck className="w-8 h-8 text-orange-600" />,
    },
    {
      title: "Receive Precision Score",
      description: "Get your automation score, annual cost breakdown, ROI timeline, and personalized execution roadmap.",
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
    },
    {
      title: "Optional Strategy Call",
      description: "Discuss your specific workflow, tools, and next steps with an automation specialist. 30 minutes, no obligation.",
      icon: <Calendar className="w-8 h-8 text-orange-600" />,
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Systemic Precision</h2>
          <div className="w-20 h-1.5 bg-orange-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md border border-orange-100">
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">{step.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

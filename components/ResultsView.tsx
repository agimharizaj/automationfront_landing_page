import React, { useState, useMemo, useEffect } from 'react';
import { FormState } from '../types';
import { Download, Mail, RefreshCw, CheckCircle2, Zap, Layers, ShieldAlert, TrendingUp, Calendar, Clock, Linkedin, Twitter as X } from 'lucide-react';
import { analytics } from '../analytics';
import { calculateResults } from '../scoring';

interface ResultsViewProps {
  responses: FormState;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ responses, onReset }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    analytics.track('report_viewed', { process: responses.primaryProcess });
  }, [responses.primaryProcess]);

  const results = useMemo(() => calculateResults(responses), [responses]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);
    
    try {
      const response = await fetch('https://formspree.io/f/mdaoepnz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          automationScore: results.totalScore,
          priorityBand: results.priorityBand,
          confidenceLevel: results.confidenceLevel,
          processName: responses.primaryProcess,
          weeklySavings: results.weeklySavings,
          annualValue: results.annualValue,
          breakEvenMonths: results.breakEvenMonths,
          primaryBottleneck: results.bottleneck,
          timestamp: new Date().toISOString(),
          fullResponses: responses
        })
      });
    // Send to n8n webhook for automated email + Airtable
    const n8nResponse = await fetch('https://eduardo-evocative-elevatingly.ngrok-free.dev/webhook/automation-diagnostic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        score: results.totalScore,
        priority: results.priorityBand,
        confidence: results.confidenceLevel,
        annualValue: results.annualValue,
        weeklySavings: results.weeklySavings,
        breakEvenMonths: results.breakEvenMonths,
        processName: responses.primaryProcess,
        bottleneck: results.bottleneck,
        hourlyRate: responses.hourlyRate,
        teamSize: responses.teamSize,
        toolCount: responses.toolCount,
        errorFrequency: responses.errorFrequency,
        recommendations: results.recommendations.slice(0, 3)
      })
    });


      if (response.ok) {
        setSubmitted(true);
        analytics.track('lead_capture_submitted', { score: results.totalScore });
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;

      doc.setFontSize(28);
      doc.setTextColor(249, 115, 22);
      doc.text('AutomationFront', margin, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text('Process Automation Diagnostic Report', margin, yPos);
      yPos += 15;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 12;

      doc.setFontSize(20);
      doc.setTextColor(249, 115, 22);
      doc.text(`Automation Potential: ${results.totalScore}%`, margin, yPos);
      yPos += 8;
      
      doc.setFontSize(12);
      doc.text(`Priority: ${results.priorityBand.toUpperCase()}`, margin, yPos);
      yPos += 6;
      doc.text(`Confidence: ${results.confidenceLevel.toUpperCase()}`, margin, yPos);
      yPos += 12;

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.setFont(undefined, 'bold');
      doc.text('Process Assessed:', margin, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 6;
      const processLines = doc.splitTextToSize(responses.primaryProcess, pageWidth - 2 * margin);
      doc.text(processLines, margin, yPos);
      yPos += processLines.length * 6 + 10;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 12;

      doc.setFontSize(16);
      doc.setTextColor(249, 115, 22);
      doc.setFont(undefined, 'bold');
      doc.text('Key Findings', margin, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont(undefined, 'normal');

      doc.setFont(undefined, 'bold');
      doc.text('Primary Bottleneck:', margin, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 6;
      const bottleneckLines = doc.splitTextToSize(results.bottleneck, pageWidth - 2 * margin - 5);
      doc.text(bottleneckLines, margin + 5, yPos);
      yPos += bottleneckLines.length * 6 + 8;

      doc.setFont(undefined, 'bold');
      doc.text(`Weekly Time Savings: ${results.weeklySavings} hours`, margin, yPos);
      yPos += 8;

      doc.text(`Annual Value Created: $${results.annualValue.toLocaleString()}`, margin, yPos);
      yPos += 8;

      doc.text(`Break-Even Timeline: ${results.breakEvenMonths} months`, margin, yPos);
      yPos += 15;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 12;

      doc.setFontSize(16);
      doc.setTextColor(249, 115, 22);
      doc.setFont(undefined, 'bold');
      doc.text('Expert Recommendations', margin, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);

      results.recommendations.forEach((rec, idx) => {
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFont(undefined, 'bold');
        const titleLines = doc.splitTextToSize(`${idx + 1}. ${rec.title}`, pageWidth - 2 * margin);
        doc.text(titleLines, margin, yPos);
        yPos += titleLines.length * 6 + 4;

        doc.setFont(undefined, 'normal');
        const descLines = doc.splitTextToSize(rec.description, pageWidth - 2 * margin - 5);
        doc.text(descLines, margin + 5, yPos);
        yPos += descLines.length * 6 + 10;
      });

      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos += 10;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 12;
      }

      doc.setFontSize(14);
      doc.setTextColor(249, 115, 22);
      doc.setFont(undefined, 'bold');
      doc.text('Your Current Process State', margin, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.setFont(undefined, 'normal');

      const stateData = [
        { label: 'Team Size', value: responses.teamSize },
        { label: 'Daily Tools', value: responses.toolCount },
        { label: 'Execution Mode', value: responses.executionMode },
        { label: 'Error Frequency', value: responses.errorFrequency },
        { label: 'Person Dependency', value: responses.dependency },
        { label: 'Speed Required', value: responses.speedRequirement },
        { label: 'Documentation Status', value: responses.documentation },
        { label: 'Hourly Cost', value: responses.hourlyRate },
      ];

      stateData.forEach(item => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont(undefined, 'bold');
        doc.text(`${item.label}:`, margin, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(item.value, margin + 50, yPos);
        yPos += 7;
      });

      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `AutomationFront | automationfront.com | Page ${i} of ${totalPages}`,
          pageWidth / 2,
          285,
          { align: 'center' }
        );
      }

      const processSlug = responses.primaryProcess
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);

      const date = new Date().toISOString().split('T')[0];
      const fileName = `AutomationFront-Report-${processSlug}-${date}.pdf`;

      doc.save(fileName);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert("PDF generation failed. Please try using your browser's print function instead.");
    }
  };

const handleShare = (platform: 'linkedin' | 'x') => {
    const shareUrl = 'https://automationfront.vercel.app';
    
    let shareText = '';
    if (platform === 'linkedin') {
      shareText = `Just audited "${responses.primaryProcess}" with AutomationFront:\n\n✅ ${results.totalScore}% automation potential\n💰 $${results.annualValue.toLocaleString()}/year value\n⏱️ ${results.weeklySavings} hours/week saved\n\nIf you're manually running repetitive processes, this free diagnostic is worth 5 minutes.`;
    } else {
      shareText = `Audited my "${responses.primaryProcess}" workflow:\n\n${results.totalScore}% automation score\n$${results.annualValue.toLocaleString()}/year on the table\n\nFree 5-min diagnostic that actually surprised me 👇`;
    }
    
    const url = platform === 'linkedin' 
      ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` 
      : `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-16 px-4 md:py-24">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="bg-[#0F172A] rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-900/40 border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] -mr-12 -mt-12 group-hover:rotate-12 transition-transform duration-1000">
            <Zap className="w-80 h-80 text-orange-600" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="relative shrink-0">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle cx="128" cy="128" r="118" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-slate-800" />
                <circle cx="128" cy="128" r="118" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray={741.4} strokeDashoffset={741.4 - (741.4 * results.totalScore) / 100} className="text-orange-600 transition-all duration-[2500ms] ease-out stroke-round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-black text-white leading-none">{results.totalScore}%</span>
                <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mt-3">Potential</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600/20 text-orange-400 text-xs font-black uppercase tracking-widest border border-orange-500/20">
                System Output
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1]">
                Annual Value: <span className="text-orange-600 underline decoration-orange-900 underline-offset-8 decoration-8">
                  ${results.annualValue.toLocaleString()}
                </span>
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                Primary Friction: <span className="text-orange-400 font-bold">{results.bottleneck}</span> in the {responses.primaryProcess} lifecycle.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center uppercase tracking-tight">
              <Layers className="w-7 h-7 mr-4 text-orange-600" />
              Diagnostics Breakdown
            </h3>
            <div className="space-y-12">
              {results.dimensions.map((dim, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="font-black text-slate-700 uppercase tracking-wide">{dim.label}</span>
                    <span className="text-sm font-black text-slate-400 font-mono">{dim.score}/10</span>
                  </div>
                  <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-1">
                    <div 
                      className="h-full transition-all duration-[1500ms] ease-out rounded-full shadow-inner"
                      style={{ 
                        width: `${dim.score * 10}%`,
                        backgroundColor: dim.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-orange-50 p-10 rounded-[2.5rem] shadow-lg border border-orange-100 flex items-center gap-8 group transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md border border-orange-100">
                <TrendingUp className="w-10 h-10 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-black text-orange-700 uppercase tracking-[0.2em] mb-2">Weekly Leak</p>
                <p className="text-4xl font-black text-orange-900">{results.weeklySavings} Hours</p>
              </div>
            </div>
            <div className="bg-slate-50 p-10 rounded-[2.5rem] shadow-lg border border-slate-200 flex items-center gap-8 group transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md border border-slate-100">
                <Clock className="w-10 h-10 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Break-Even</p>
                <p className="text-4xl font-black text-slate-900">
                  {results.breakEvenMonths} {results.breakEvenMonths === 1 ? 'Month' : 'Months'}
                </p>
              </div>
            </div>
            <div className="bg-[#0F172A] p-10 rounded-[2.5rem] shadow-lg border border-slate-800 flex items-center gap-8 group transition-all">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-slate-700">
                <ShieldAlert className="w-10 h-10 text-orange-50" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Operational Fragility</p>
                <p className="text-4xl font-black text-white">
                  {results.dimensions[2].score >= 7 ? 'HIGH' : 'LOW'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 flex items-center px-6 uppercase tracking-tight">
            <Zap className="w-8 h-8 mr-4 text-orange-500 fill-orange-500" />
            Execution Roadmap
          </h2>
          <div className="grid gap-6">
            {results.recommendations.map((rec, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center transition-all group-hover:rotate-6 shadow-md ${
                  rec.type === 'immediate' ? 'bg-orange-600 text-white' : 
                  rec.type === 'structural' ? 'bg-slate-900 text-white' : 'bg-orange-50 text-orange-600 border border-orange-100'
                }`}>
                  {rec.type === 'immediate' ? <ShieldAlert className="w-7 h-7" /> : 
                   rec.type === 'structural' ? <Layers className="w-7 h-7" /> : <TrendingUp className="w-7 h-7" />}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{rec.title}</h4>
                  </div>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-3xl">
                    {rec.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-8">
          <div className="bg-orange-600 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-8">
              <div className="inline-flex p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Your Diagnostic Report</h2>
              <p className="text-orange-50 text-lg font-medium leading-relaxed">
                We'll email you a detailed breakdown showing why you're losing ${results.annualValue.toLocaleString()}/year, your {results.priorityBand}-priority automation roadmap, and case studies of similar processes we've automated.
              </p>

              {submitted ? (
                <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-md border border-white/20 text-center animate-in zoom-in-95 duration-500">
                  <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-black uppercase">Request Received</h3>
                  <p className="text-orange-100 mt-1 font-bold">Your report will arrive within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <input
                    required
                    type="email"
                    placeholder="founder@company.com"
                    className="w-full px-5 py-4 bg-white text-slate-900 rounded-lg font-bold focus:ring-4 focus:ring-orange-300 outline-none disabled:opacity-50 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-slate-900 text-white font-black rounded-lg hover:bg-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-widest active:scale-95"
                  >
                    {isSubmitting ? 'Sending...' : 'Get My Full Report'}
                  </button>
                  {submitError && (
                    <p className="text-xs text-orange-200 font-bold">
                      Something went wrong. Please try again or email contact@automationfront.com
                    </p>
                  )}
                  <p className="text-[10px] text-orange-200 text-center uppercase tracking-widest font-black">
                    Report delivered within 24 hours • No spam
                  </p>
                </form>
              )}
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-[3rem] p-10 md:p-14 text-white border border-slate-800 relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col h-full justify-between gap-10">
              <div className="space-y-8">
                <div className="inline-flex p-4 bg-slate-800 rounded-2xl border border-slate-700">
                  <Calendar className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Strategy Session</h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  Want to discuss implementation? Book a free 30-minute strategy session to walk through your specific workflow and potential automation roadmap.
                </p>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="https://calendly.com/agim-harizaj/15min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full py-5 bg-orange-600 text-white font-black rounded-lg hover:bg-orange-700 transition-all shadow-lg uppercase text-sm tracking-widest active:scale-95"
                >
                  Schedule Strategy Call →
                </a>
                <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-black">
                  Zero Obligation • Architecture Deep-Dive
                </p>
              </div>
            </div>
          </div>
        </div>




        <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-12 pb-20">
<div className="flex flex-col items-center gap-2">
            <button
              onClick={downloadPDF}
              className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-black transition-all shadow-lg active:scale-95">
              <Download className="w-5 h-5 mr-3" />
              Quick Summary (PDF)
            </button>
            <p className="text-xs text-slate-400 text-center">Basic overview • Detailed report sent via email</p>
          </div>



          
          <div className="flex gap-4">
<button onClick={() => handleShare('linkedin')} className="p-6 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-orange-600 transition-all shadow-lg">
                <Linkedin className="w-7 h-7" />
             </button>
<button onClick={() => handleShare('x')} className="p-6 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-orange-600 transition-all shadow-lg">
   <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
   </svg>
</button>

          </div>

          <button 
            onClick={onReset}
            className="text-slate-400 font-black uppercase tracking-widest hover:text-orange-600 transition-all px-8 py-4 flex items-center text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-3" />
            Recalibrate
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../constants';
import { FormState } from '../types';
import { ArrowLeft, ArrowRight, Check, Info, HelpCircle } from 'lucide-react';

interface DiagnosticFormProps {
  initialState: FormState;
  initialStep: number;
  onComplete: (state: FormState) => void;
  onStepChange: (step: number) => void;
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ 
  initialState, 
  initialStep, 
  onComplete,
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep || 1);
  const [formData, setFormData] = useState<FormState>(initialState);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    onStepChange(currentStep);
    setShowTooltip(false);
  }, [currentStep, onStepChange]);

  const currentQuestion = QUESTIONS[currentStep - 1];
  const progress = (currentStep / QUESTIONS.length) * 100;

  const handleOptionSelect = (id: keyof FormState, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isCurrentStepValid = () => {
    const value = formData[currentQuestion.id];
    return typeof value === 'string' && value.trim().length > 0;
  };

  const applyExample = () => {
    if (currentQuestion.example) {
      handleOptionSelect(currentQuestion.id, currentQuestion.example);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.1)] overflow-hidden min-h-[600px] flex flex-col transition-all duration-500">
      {/* Progress Header */}
      <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black text-orange-600 uppercase tracking-[0.2em]">
            Module {currentStep} / {QUESTIONS.length}
          </span>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {Math.round(progress)}% Optimised
          </span>
        </div>
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-100">
          <div 
            className="h-full bg-orange-600 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-10 py-12 relative">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight flex-1">
              {currentQuestion.text}
            </h2>
            <div className="relative ml-6">
              <button 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-slate-300 hover:text-orange-500 transition-colors p-1"
                aria-label="Context"
              >
                <Info className="w-7 h-7" />
              </button>
              {showTooltip && currentQuestion.tooltip && (
                <div className="absolute right-0 top-12 w-72 bg-slate-900 text-white text-xs p-5 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 border border-slate-800">
                  <p className="font-black mb-2 text-orange-400 uppercase tracking-widest">Operator Context:</p>
                  <p className="leading-relaxed opacity-90 font-medium">{currentQuestion.tooltip}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'radio' && currentQuestion.options?.map((option, idx) => (
              <label 
                key={idx}
                className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                  formData[currentQuestion.id] === option 
                    ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-600/10' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  className="hidden"
                  checked={formData[currentQuestion.id] === option}
                  onChange={() => handleOptionSelect(currentQuestion.id, option)}
                />
                <div className={`w-7 h-7 rounded-full border-2 mr-5 flex items-center justify-center transition-all ${
                  formData[currentQuestion.id] === option ? 'border-orange-600 bg-orange-600 scale-110 shadow-lg shadow-orange-600/20' : 'border-slate-300 bg-white'
                }`}>
                  {formData[currentQuestion.id] === option && <Check className="w-4 h-4 text-white stroke-[4px]" />}
                </div>
                <span className={`text-lg font-black transition-colors ${
                  formData[currentQuestion.id] === option ? 'text-orange-900' : 'text-slate-600'
                }`}>
                  {option}
                </span>
              </label>
            ))}

            {(currentQuestion.type === 'text' || currentQuestion.type === 'textarea') && (
              <div className="space-y-4">
                <div className="relative">
                  {currentQuestion.type === 'text' ? (
                    <input
                      type="text"
                      placeholder={currentQuestion.placeholder}
                      className="w-full p-6 text-lg border-2 border-slate-100 rounded-2xl focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 outline-none transition-all bg-slate-50/30 font-bold text-slate-900 placeholder:text-slate-400"
                      value={formData[currentQuestion.id] || ''}
                      onChange={(e) => handleOptionSelect(currentQuestion.id, e.target.value)}
                    />
                  ) : (
                    <textarea
                      placeholder={currentQuestion.placeholder}
                      rows={5}
                      className="w-full p-6 text-lg border-2 border-slate-100 rounded-2xl focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 outline-none transition-all resize-none bg-slate-50/30 font-bold text-slate-900 placeholder:text-slate-400"
                      value={formData[currentQuestion.id] || ''}
                      onChange={(e) => handleOptionSelect(currentQuestion.id, e.target.value)}
                    />
                  )}
                </div>
                {currentQuestion.example && (
                  <button 
                    onClick={applyExample}
                    className="flex items-center text-xs font-black text-orange-600 hover:text-orange-700 transition-colors py-2 uppercase tracking-widest"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Load Template
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="px-10 py-8 border-t border-slate-100 flex items-center justify-between bg-slate-100/20">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center px-5 py-3 rounded-xl font-black transition-all uppercase text-xs tracking-widest ${
            currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200'
          }`}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
          className={`flex items-center px-12 py-5 rounded-xl font-black shadow-xl transition-all uppercase text-sm tracking-widest ${
            !isCurrentStepValid() 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-600/30 active:scale-95'
          }`}
        >
          {currentStep === QUESTIONS.length ? 'Audit Report' : 'Next Step'}
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
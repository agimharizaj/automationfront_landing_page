import React, { useState, useEffect, useRef } from 'react';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { DiagnosticForm } from './components/DiagnosticForm';
import { ResultsView } from './components/ResultsView';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { FormState } from './types';
import { STORAGE_KEY, CURRENT_STEP_KEY } from './constants';
import { analytics } from './analytics';

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      teamSize: '',
      toolCount: '',
      primaryProcess: '',
      executionMode: '',
      errorFrequency: '',
      dependency: '',
      speedRequirement: '',
      annoyance: '',
      documentation: '',
      timeSavings: '',
      hourlyRate: '',
    };
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = localStorage.getItem(CURRENT_STEP_KEY);
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const [isFinished, setIsFinished] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);

  const sessionStarts = useRef(0);
  const sessionFinishes = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formState));
  }, [formState]);

  useEffect(() => {
    localStorage.setItem(CURRENT_STEP_KEY, currentStep.toString());
  }, [currentStep]);

  const handleStart = () => {
    sessionStarts.current++;
    analytics.track('diagnostic_started', {
      source: 'hero_button',
      session_starts: sessionStarts.current
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentStep(1);
  };

  const handleFinish = (finalState: FormState) => {
    sessionFinishes.current++;
    setFormState(finalState);
    setIsFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    analytics.track('diagnostic_finished', {
      process_name: finalState.primaryProcess,
      manual_hours_leak: finalState.timeSavings,
      session_finishes: sessionFinishes.current
    });
    analytics.logSessionSummary(sessionStarts.current, sessionFinishes.current);
  };

  const resetDiagnostic = () => {
    analytics.track('diagnostic_reset');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_STEP_KEY);
    window.location.reload();
  };

  if (isFinished) {
    return (
      <div className="min-h-screen flex flex-col">
        <ResultsView responses={formState} onReset={resetDiagnostic} />
        <About />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Hero onStart={handleStart} />
      <HowItWorks />
      
      <div ref={formRef} className="py-12 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <DiagnosticForm 
            initialState={formState} 
            initialStep={currentStep}
            onComplete={handleFinish} 
            onStepChange={setCurrentStep}
          />
        </div>
      </div>

      <About />
      <Footer />
    </div>
  );
};

export default App;

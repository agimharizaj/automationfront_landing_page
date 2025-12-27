export interface FormState {
  teamSize: string;
  toolCount: string;
  primaryProcess: string;
  executionMode: string;
  errorFrequency: string;
  dependency: string;
  speedRequirement: string;
  annoyance: string;
  documentation: string;
  timeSavings: string;
  hourlyRate: string;
  email?: string;
}

export interface Question {
  id: keyof FormState;
  text: string;
  tooltip?: string;
  example?: string;
  placeholder?: string;
  type: 'radio' | 'text' | 'textarea';
  options?: string[];
}

export interface DimensionScore {
  label: string;
  score: number;
  color: string;
}

export interface DiagnosticResult {
  totalScore: number;
  priorityBand: 'critical' | 'high' | 'medium' | 'low';
  confidenceLevel: 'high' | 'medium' | 'low';
  dimensions: DimensionScore[];
  bottleneck: string;
  weeklySavings: number;
  annualValue: number;
  breakEvenMonths: number;
  estimatedBuildHours: number;
  recommendations: {
    title: string;
    description: string;
    type: 'immediate' | 'strategic' | 'structural';
  }[];
}

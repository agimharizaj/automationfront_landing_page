
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
  score: number; // 0-10
  color: string;
}

export interface DiagnosticResult {
  totalScore: number;
  dimensions: DimensionScore[];
  bottleneck: string;
  weeklySavings: number;
  annualValue: number;
  recommendations: {
    title: string;
    description: string;
    type: 'immediate' | 'strategic' | 'structural';
  }[];
}

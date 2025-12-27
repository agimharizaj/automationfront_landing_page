
import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'teamSize',
    text: 'How big is your team?',
    tooltip: 'Larger teams suffer more from "communication debt" which automation can solve.',
    type: 'radio',
    options: ['1-5', '6-20', '21-50', '50+'],
  },
  {
    id: 'toolCount',
    text: 'How many tools does your team use daily?',
    tooltip: 'The more tools you use, the higher the risk of data silos and manual context switching.',
    type: 'radio',
    options: ['Less than 5', '5-10', '10-20', '20+'],
  },
  {
    id: 'primaryProcess',
    text: 'Which process takes the most time each week?',
    tooltip: 'Focus on a single recurring workflow rather than general tasks.',
    example: 'Generating monthly investor reports or client onboarding.',
    type: 'text',
    placeholder: 'e.g., customer onboarding, expense approvals, reporting',
  },
  {
    id: 'executionMode',
    text: 'How is this process currently executed?',
    tooltip: 'Manual processes have the highest "Automation Alpha"—the greatest return on effort.',
    type: 'radio',
    options: ['Manually', 'Partially automated', 'Not sure', "It's a mess"],
  },
  {
    id: 'errorFrequency',
    text: 'How often do errors or delays happen in this process?',
    tooltip: 'Frequent errors indicate a process that is too complex for consistent human execution.',
    type: 'radio',
    options: ['Never', 'Sometimes', 'Weekly', 'Daily', 'Constantly'],
  },
  {
    id: 'dependency',
    text: 'Does this process depend on one specific person?',
    tooltip: 'Single-person dependency is a "Bus Factor" risk that creates operational fragility.',
    type: 'radio',
    options: ['Yes', 'No', 'Multiple people can do it'],
  },
  {
    id: 'speedRequirement',
    text: 'How quickly does this process need to run?',
    tooltip: 'Processes requiring "instant" speed are the primary candidates for API-led automation.',
    type: 'radio',
    options: ['Slow (days)', 'Medium (hours)', 'Fast (minutes)', 'Instant'],
  },
  {
    id: 'annoyance',
    text: 'If you could remove one annoyance from this workflow, what would it be?',
    tooltip: 'Identifying the emotional pain point often reveals the true technical bottleneck.',
    example: "Copy-pasting data from the CRM to the invoice generator 20 times a day.",
    type: 'textarea',
    placeholder: 'Describe the biggest pain point',
  },
  {
    id: 'documentation',
    text: 'Do you currently document your processes?',
    tooltip: 'Documentation is the "Pseudo-code" of automation. If you can describe it, we can automate it.',
    type: 'radio',
    options: ['Yes, thoroughly', 'Somewhat', 'No', 'We tried but failed'],
  },
  {
    id: 'timeSavings',
    text: 'What would a fully automated version save you each week?',
    tooltip: 'This helps us calculate your "Hidden Labor Cost"—the money you lose to manual tasks.',
    type: 'radio',
    options: ['1-2 hours', '3-5 hours', '5-10 hours', '10+ hours', 'No idea'],
  },
];

export const STORAGE_KEY = 'automation_front_state';
export const CURRENT_STEP_KEY = 'automation_front_step';

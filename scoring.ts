import { FormState, DiagnosticResult, DimensionScore } from './types';

export const calculateResults = (responses: FormState): DiagnosticResult => {
  const dimensions: DimensionScore[] = [
    {
      label: 'Process Complexity',
      score: calculateComplexityScore(responses),
      color: '#F97316'
    },
    {
      label: 'Manual Burden',
      score: calculateManualBurdenScore(responses),
      color: '#FB923C'
    },
    {
      label: 'Error Frequency',
      score: calculateErrorScore(responses),
      color: '#FDBA74'
    },
    {
      label: 'Speed Requirement',
      score: calculateSpeedScore(responses),
      color: '#FED7AA'
    }
  ];

  const avgDimensionScore = dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;
  const totalScore = Math.round(avgDimensionScore * 10);

  const priorityBand = getPriorityBand(totalScore);
  const confidenceLevel = calculateConfidence(responses);

  const weeklySavings = extractWeeklySavings(responses.timeSavings);
  const hourlyRate = extractHourlyRate(responses.hourlyRate);
  const annualValue = Math.round(weeklySavings * 52 * hourlyRate);

  const estimatedBuildHours = estimateBuildTime(responses, dimensions);
  const breakEvenMonths = calculateBreakEven(estimatedBuildHours, hourlyRate, weeklySavings);

  const bottleneck = responses.annoyance && responses.annoyance.trim().length > 0
    ? responses.annoyance
    : `${responses.executionMode} process with ${responses.errorFrequency.toLowerCase()} error frequency and dependency on ${responses.dependency === 'Yes' ? 'a single person' : 'multiple people'}`;

  const recommendations = generateRecommendations(responses, dimensions, weeklySavings, priorityBand);

  return {
    totalScore,
    priorityBand,
    confidenceLevel,
    dimensions,
    bottleneck,
    weeklySavings,
    annualValue,
    breakEvenMonths,
    estimatedBuildHours,
    recommendations
  };
};

function calculateComplexityScore(r: FormState): number {
  let score = 0;
  
  if (r.toolCount === '20+') score += 3;
  else if (r.toolCount === '10-20') score += 2.5;
  else if (r.toolCount === '5-10') score += 1.5;
  else score += 1;

  if (r.teamSize === '50+') score += 2.5;
  else if (r.teamSize === '21-50') score += 2;
  else if (r.teamSize === '6-20') score += 1.5;
  else score += 1;

  if (r.documentation === 'No' || r.documentation === 'We tried but failed') score += 2.5;
  else if (r.documentation === 'Somewhat') score += 1.5;
  
  return Math.min(score, 10);
}

function calculateManualBurdenScore(r: FormState): number {
  let score = 0;
  
  if (r.executionMode === "It's a mess") score += 4;
  else if (r.executionMode === 'Manually') score += 3.5;
  else if (r.executionMode === 'Not sure') score += 2;
  else score += 1;

  if (r.dependency === 'Yes') score += 3;
  else if (r.dependency === 'Multiple people can do it') score += 2;
  
  if (r.timeSavings === '10+ hours') score += 3;
  else if (r.timeSavings === '5-10 hours') score += 2.5;
  else if (r.timeSavings === '3-5 hours') score += 2;
  
  return Math.min(score, 10);
}

function calculateErrorScore(r: FormState): number {
  const errorMap: Record<string, number> = {
    'Constantly': 10,
    'Daily': 8,
    'Weekly': 6,
    'Sometimes': 3,
    'Never': 1
  };
  return errorMap[r.errorFrequency] || 5;
}

function calculateSpeedScore(r: FormState): number {
  const speedMap: Record<string, number> = {
    'Instant': 10,
    'Fast (minutes)': 7,
    'Medium (hours)': 4,
    'Slow (days)': 2
  };
  return speedMap[r.speedRequirement] || 5;
}

function extractWeeklySavings(timeSavings: string): number {
  if (timeSavings === '10+ hours') return 12;
  if (timeSavings === '5-10 hours') return 7.5;
  if (timeSavings === '3-5 hours') return 4;
  if (timeSavings === '1-2 hours') return 1.5;
  return 3;
}

function extractHourlyRate(hourlyRate: string): number {
  if (hourlyRate === '$120+/hr (Leadership)') return 150;
  if (hourlyRate === '$70-120/hr (Senior)') return 95;
  if (hourlyRate === '$40-70/hr (Mid-level)') return 55;
  if (hourlyRate === '$25-40/hr (Junior)') return 32;
  return 50;
}

function getPriorityBand(score: number): 'critical' | 'high' | 'medium' | 'low' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function calculateConfidence(r: FormState): 'high' | 'medium' | 'low' {
  let confidenceScore = 0;
  
  if (r.documentation === 'Yes, thoroughly') confidenceScore += 3;
  else if (r.documentation === 'Somewhat') confidenceScore += 2;
  else confidenceScore += 0;
  
  if (r.annoyance && r.annoyance.trim().length > 20) confidenceScore += 2;
  if (r.timeSavings !== 'No idea') confidenceScore += 2;
  if (r.executionMode !== 'Not sure') confidenceScore += 1;
  
  if (confidenceScore >= 6) return 'high';
  if (confidenceScore >= 4) return 'medium';
  return 'low';
}

function estimateBuildTime(r: FormState, dimensions: DimensionScore[]): number {
  let hours = 20;
  
  if (r.toolCount === '20+') hours += 30;
  else if (r.toolCount === '10-20') hours += 20;
  else if (r.toolCount === '5-10') hours += 10;
  
  if (r.executionMode === "It's a mess") hours += 15;
  else if (r.executionMode === 'Not sure') hours += 10;
  
  if (r.documentation === 'Yes, thoroughly') hours -= 10;
  
  const errorScore = dimensions.find(d => d.label === 'Error Frequency')?.score || 0;
  if (errorScore >= 8) hours += 10;
  
  return Math.max(hours, 15);
}

function calculateBreakEven(buildHours: number, hourlyRate: number, weeklySavings: number): number {
  const implementationCost = buildHours * hourlyRate;
  const monthlySavings = weeklySavings * 4.33 * hourlyRate;
  
  if (monthlySavings === 0) return 999;
  
  const months = Math.ceil(implementationCost / monthlySavings);
  return Math.min(months, 36);
}

function generateRecommendations(
  r: FormState, 
  dimensions: DimensionScore[], 
  weeklySavings: number,
  priorityBand: 'critical' | 'high' | 'medium' | 'low'
): Array<{title: string; description: string; type: 'immediate' | 'strategic' | 'structural'}> {
  
  const recs = [];
  const processName = r.primaryProcess;
  
  if (priorityBand === 'critical') {
    recs.push({
      title: '🚨 Critical Priority: Automate Immediately',
      description: `Your ${processName} process has an 80%+ automation score. This is actively costing you money every day. The break-even on automation is likely under 3 months. Start this week.`,
      type: 'immediate' as const
    });
  } else if (priorityBand === 'high') {
    recs.push({
      title: 'High-Value Opportunity: Plan Implementation',
      description: `${processName} shows strong automation potential (60-79%). Begin by documenting the workflow end-to-end, then prioritize the highest-friction steps for automation.`,
      type: 'strategic' as const
    });
  } else if (priorityBand === 'medium') {
    recs.push({
      title: 'Moderate ROI: Consider Selective Automation',
      description: `${processName} has some automation potential (40-59%), but full automation may not be cost-effective yet. Focus on automating the most repetitive 20-30% of the workflow.`,
      type: 'strategic' as const
    });
  } else {
    recs.push({
      title: 'Low Priority: Stabilize Before Automating',
      description: `${processName} scores below 40% for automation readiness. Before investing in automation, focus on documenting and stabilizing the process. Automation of unstable processes creates unstable automation.`,
      type: 'structural' as const
    });
  }

  if (r.annoyance && r.annoyance.trim().length > 10) {
    recs.push({
      title: 'Fix the Biggest Pain Point First',
      description: `You mentioned: "${r.annoyance}". This is where to start. Automate or eliminate this specific friction point in "${processName}" before building a comprehensive solution. Quick wins build momentum.`,
      type: 'immediate' as const
    });
  }

  if (r.documentation === 'No' || r.documentation === 'We tried but failed') {
    recs.push({
      title: 'Document Before You Automate',
      description: `Map out "${processName}" step-by-step: what happens, who does it, where data lives, what breaks. Without documentation, you're automating blind. This takes 2-3 hours and reveals exactly what to build.`,
      type: 'immediate' as const
    });
  } else if (r.documentation === 'Somewhat') {
    recs.push({
      title: 'Complete Your Process Documentation',
      description: `You have partial documentation for "${processName}". Fill in the gaps: edge cases, error handling, data sources. Complete docs = clear automation roadmap.`,
      type: 'immediate' as const
    });
  }

  if (r.toolCount === '10-20' || r.toolCount === '20+') {
    recs.push({
      title: `Connect Your ${r.toolCount} Tools`,
      description: `"${processName}" likely involves copying data between multiple tools. Use Zapier, Make, or n8n to connect these systems automatically. Start with the 2-3 tools you touch most often.`,
      type: 'strategic' as const
    });
  }

  if (r.errorFrequency === 'Daily' || r.errorFrequency === 'Constantly') {
    recs.push({
      title: 'Eliminate Error-Prone Manual Steps',
      description: `With ${r.errorFrequency.toLowerCase()} errors in "${processName}", automation isn't optional—it's a reliability fix. Humans make transcription errors, forget steps, and get distracted. Systems don't.`,
      type: 'immediate' as const
    });
  } else if (r.errorFrequency === 'Weekly') {
    recs.push({
      title: 'Reduce Error Rate Through Automation',
      description: `Weekly errors in "${processName}" suggest manual steps that should be systematized. Identify which steps fail most often and automate those first.`,
      type: 'strategic' as const
    });
  }

  if (r.dependency === 'Yes') {
    recs.push({
      title: 'Remove Single-Person Dependency',
      description: `"${processName}" depends on one person. This is an operational risk (bus factor = 1). Build a system—automated or documented—so anyone can execute this process. Start by recording a Loom walkthrough, then automate the repetitive parts.`,
      type: 'structural' as const
    });
  }

  const hourlyRate = extractHourlyRate(r.hourlyRate);
  if (weeklySavings >= 5) {
    recs.push({
      title: `Recover ${weeklySavings} Hours/Week = $${(weeklySavings * 52 * hourlyRate).toLocaleString()}/Year`,
      description: `You're spending ${weeklySavings} hours every week on "${processName}". That's ${Math.round(weeklySavings * 52)} hours annually. Automate the most repetitive 30% of this workflow to unlock 60-70% of the time savings immediately.`,
      type: 'strategic' as const
    });
  } else if (weeklySavings >= 2) {
    recs.push({
      title: `Small Process, Big Impact Over Time`,
      description: `${weeklySavings} hours/week on "${processName}" might not seem like much, but over a year that's ${Math.round(weeklySavings * 52)} hours. Automate it once, benefit forever.`,
      type: 'strategic' as const
    });
  }

  if (r.speedRequirement === 'Instant' || r.speedRequirement === 'Fast (minutes)') {
    recs.push({
      title: 'Build Real-Time Automation',
      description: `"${processName}" needs to run ${r.speedRequirement.toLowerCase()}. Manual execution can't reliably hit this speed. Use APIs, webhooks, or real-time integrations to eliminate the human bottleneck entirely.`,
      type: 'structural' as const
    });
  }

  if (recs.length < 3) {
    recs.push({
      title: 'Start Small: Automate 20% of the Workflow',
      description: `Don't try to automate all of "${processName}" at once. Pick the most repetitive 20%—usually data entry or status updates—and build that first. Prove the ROI, then expand.`,
      type: 'immediate' as const
    });
  }

  return recs.slice(0, 5);
}

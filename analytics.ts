
/**
 * Simple, privacy-first analytics utility.
 * Logs events to console for local monitoring and simulation of tools like Plausible.
 */
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      event,
      timestamp,
      ...properties,
    };

    console.group(`📊 AutomationFront Analytics: ${event}`);
    console.table(logEntry);
    console.groupEnd();
  },

  // Helper to simulate "Completion Rate" summary
  logSessionSummary: (totalStarts: number, totalFinishes: number) => {
    console.log(`📈 Completion Rate: ${((totalFinishes / totalStarts) * 100).toFixed(1)}%`);
  }
};

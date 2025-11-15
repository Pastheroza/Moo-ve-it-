import React from 'react';

// --- PROPS INTERFACE ---
interface AnalysisCardProps {
  distanceHistory: number[];
  aiReport: string;
}

/**
 * A simple SVG line graph component to visualize a time series of data.
 * @param data - An array of numbers to plot.
 */
const Graph: React.FC<{ data: number[] }> = ({ data }) => {
    const width = 200;
    const height = 50;
    // Set a minimum max value to prevent the graph from looking empty with low values
    const maxVal = Math.max(...data, 50); 
    const minVal = 0;
  
    // Convert data points to SVG coordinate strings
    const points = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - minVal) / (maxVal - minVal)) * height;
        return `${x},${y}`;
      })
      .join(' ');
  
    // Display a message if there isn't enough data to draw a line
    if (data.length < 2) {
      return <div className="h-[50px] flex items-center justify-center text-text-primary/50 text-sm">Awaiting more data...</div>
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };
  
/**
 * A card component that displays herd analysis data.
 * It includes a graph for herd cohesion and a text area for AI-generated reports.
 */
export const AnalysisCard: React.FC<AnalysisCardProps> = ({ distanceHistory, aiReport }) => {
    // Get the most recent distance value for display
    const latestDistance = distanceHistory[distanceHistory.length - 1] ?? 0;

  return (
    <div>
        <h3 className="text-lg font-bold text-text-primary/90 mb-3 px-2">Herd Analysis</h3>
        <div className="bg-card-light/50 p-4 rounded-xl space-y-4">
            {/* Cohesion Graph */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-xs text-text-primary/60">Herd Cohesion</p>
                    <p className="font-bold text-text-primary text-sm">
                        Avg. Distance: {latestDistance.toFixed(2)}m
                    </p>
                </div>
                <div className="w-2/5">
                    <Graph data={distanceHistory} />
                </div>
            </div>
             {/* AI Report */}
             <div>
                <p className="text-xs text-text-primary/60 mb-1">AI Herd Analysis</p>
                <div className="text-sm text-text-primary/80 min-h-[40px]">
                   {aiReport}
                </div>
            </div>
        </div>
    </div>
  );
};

import React, { useRef } from 'react';
import type { Cow, Drone, WeatherData, Point, DroneCommand } from '../types';
import { FARM_AREAS, MAP_WIDTH, MAP_HEIGHT, FARM_BUILDING, DRONE_BASE } from '../constants';
import { Card } from './Card';
import { AnalysisCard } from './AnalysisCard';
import { DroneStatusCard } from './DroneStatusCard';

// --- PROPS INTERFACE ---
interface MapSectionProps {
  cows: Cow[];
  drone: Drone;
  weather: WeatherData;
  herdStatus: string;
  distanceHistory: number[];
  aiReport: string;
  onSetDroneTarget: (target: Point) => void;
  droneManualTarget: Point | null;
  onDroneCommand: (command: DroneCommand) => void;
}

// --- SUB-COMPONENTS ---

/** A small component for the map legend. */
const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-sm text-text-primary/80">{label}</span>
    </div>
);

// Icon components for the status bar, providing clear visual indicators.
const SunIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const ThermometerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16.5V3.75m-6 12.75V3.75m-3.75 0h13.5A2.25 2.25 0 0121 6v12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25z" />
    </svg>
);
const HerdIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

/** A reusable component to display a status item with an icon, label, and value. */
const StatusItem: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3 bg-card-light/50 p-3 rounded-xl">
        <div className="text-blue-400">{icon}</div>
        <div>
            <p className="text-xs text-text-primary/60">{label}</p>
            <p className="font-bold text-text-primary text-sm">{value}</p>
        </div>
    </div>
);

/**
 * Determines the color of a cow on the map based on its status.
 * @param status - The current status of the cow.
 * @returns A hex color code string.
 */
const getCowColor = (status: Cow['status']) => {
    switch (status) {
        case 'isolated': return '#facc15'; // yellow-400
        case 'escaped': return '#f87171'; // red-400
        default: return '#4ade80'; // green-400
    }
}

/**
 * The main component for displaying the interactive map and related status dashboards.
 * It renders the farm, cows, and drone, and handles user interactions like clicking to set a drone target.
 */
export const MapSection: React.FC<MapSectionProps> = ({ cows, drone, weather, herdStatus, distanceHistory, aiReport, onSetDroneTarget, droneManualTarget, onDroneCommand }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  /**
   * Handles click events on the SVG map.
   * It transforms the screen coordinates of the click into SVG coordinates
   * and calls the `onSetDroneTarget` callback to update the drone's manual target.
   */
  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const screenCTM = svg.getScreenCTM();
    if (screenCTM) {
        const svgPoint = pt.matrixTransform(screenCTM.inverse());
        onSetDroneTarget({ x: svgPoint.x, y: svgPoint.y });
    }
  };

  /**
   * A boolean flag to determine if the drone is currently at its base.
   * This is used to change its visual appearance to an 'inactive' state.
   */
  const isDroneAtBase =
    drone.status === 'charging' || drone.status === 'idle';

  return (
    <Card className="bg-card-dark overflow-hidden">
        {/* Section Header and Legend */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 px-2">
            <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">Live Pasture Overview</h2>
                <p className="text-text-primary/60">Real-time positions of assets and herd status.</p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 md:mt-0">
                <LegendItem color="bg-green-400" label="Grazing" />
                <LegendItem color="bg-yellow-400" label="Isolated" />
                <LegendItem color="bg-red-400" label="Escaped" />
                <LegendItem color="bg-blue-400" label="Drone (Active)" />
            </div>
        </div>
        {/* Interactive SVG Map */}
        <div className="w-full bg-black/30 rounded-2xl p-2">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                className="w-full h-auto cursor-crosshair"
                preserveAspectRatio="xMidYMid meet"
                onClick={handleMapClick}
            >
                <defs>
                    <radialGradient id="droneGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{stopColor: 'rgba(59, 130, 246, 0.8)'}} />
                        <stop offset="100%" style={{stopColor: 'rgba(59, 130, 246, 0)'}} />
                    </radialGradient>
                </defs>

                {/* Farm Areas */}
                {FARM_AREAS.map(area => (
                    <path key={area.id} d={area.path} fill="rgba(107, 114, 128, 0.1)" stroke="#4a4a4a" strokeWidth="2" strokeDasharray="5,5" />
                ))}

                {/* Farm Building (Barn) */}
                <path d={FARM_BUILDING.path} fill="#5a3a2a" stroke="#3e2a1e" strokeWidth="1.5" />

                {/* Drone Base Station */}
                <g>
                    <circle cx={DRONE_BASE.cx} cy={DRONE_BASE.cy} r={DRONE_BASE.r} fill="#374151" stroke="#9ca3af" strokeWidth="1" />
                    <path d={`M ${DRONE_BASE.cx-6},${DRONE_BASE.cy} h 12 M ${DRONE_BASE.cx},${DRONE_BASE.cy-6} v 12`} stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                </g>

                {/* Render all cows */}
                {cows.map((cow) => (
                    <circle
                        key={cow.id}
                        cx={cow.position.x}
                        cy={cow.position.y}
                        r="4"
                        fill={getCowColor(cow.status)}
                        className="transition-all duration-100 ease-linear"
                    />
                ))}

                {/* Render the manual target marker if it exists */}
                {droneManualTarget && (
                    <g className="pointer-events-none">
                        <path
                            d={`M ${droneManualTarget.x - 10} ${droneManualTarget.y} L ${droneManualTarget.x + 10} ${droneManualTarget.y} M ${droneManualTarget.x} ${droneManualTarget.y - 10} L ${droneManualTarget.x} ${droneManualTarget.y + 10}`}
                            stroke="#f1f1f1" strokeWidth="2" strokeDasharray="2,2" strokeLinecap="round"
                        />
                         <circle cx={droneManualTarget.x} cy={droneManualTarget.y} r="8" fill="none" stroke="#f1f1f1" strokeWidth="1" strokeDasharray="3,3" />
                    </g>
                )}

                {/* Render the drone */}
                <g transform={`translate(${drone.position.x}, ${drone.position.y})`} className="transition-all duration-100 ease-linear">
                    <circle r="15" fill={isDroneAtBase ? 'none' : 'url(#droneGlow)'} />
                    <circle 
                        r="6" 
                        fill={isDroneAtBase ? '#6b7280' : '#3b82f6'} 
                        stroke={isDroneAtBase ? '#4b5563' : '#f1f1f1'} 
                        strokeWidth="1.5" 
                    />
                </g>
            </svg>
        </div>
        {/* Status & Analysis Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Field Status Card */}
            <div>
                 <h3 className="text-lg font-bold text-text-primary/90 mb-3 px-2">Field Status</h3>
                <div className="grid grid-cols-1 gap-4">
                    <StatusItem icon={<SunIcon />} label="Weather" value={weather.condition} />
                    <StatusItem icon={<ThermometerIcon />} label="Temperature" value={`${weather.temperature}°C`} />
                    <StatusItem icon={<HerdIcon />} label="Herd Status" value={herdStatus} />
                </div>
            </div>
            {/* Drone Status Card */}
            <DroneStatusCard drone={drone} onCommand={onDroneCommand} />
            {/* Herd Analysis Card */}
            <AnalysisCard 
                distanceHistory={distanceHistory} 
                aiReport={aiReport}
            />
        </div>
    </Card>
  );
};

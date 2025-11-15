import React from 'react';
import type { Drone, DroneCommand } from '../types';

// --- PROPS INTERFACES ---
interface StatusIndicatorProps {
  status: Drone['status'];
}
interface DroneStatusCardProps {
  drone: Drone;
  onCommand: (command: DroneCommand) => void;
}

// --- SUB-COMPONENTS ---

/**
 * A visual indicator for the drone's current status.
 * It shows a colored dot and a text label corresponding to the status.
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusConfig = {
    patrolling: { color: 'bg-blue-500', text: 'Patrolling' },
    herding: { color: 'bg-yellow-500', text: 'Herding' },
    charging: { color: 'bg-green-500', text: 'Charging' },
    idle: { color: 'bg-gray-500', text: 'Idle' }, // Added style for the new idle state
  };

  const { color, text } = statusConfig[status] || statusConfig.patrolling;

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="font-bold text-text-primary text-sm capitalize">{text}</span>
    </div>
  );
};

/** A reusable, styled button for drone commands. */
const CommandButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button 
        onClick={onClick}
        className="w-full text-center bg-card-dark hover:bg-black/50 text-text-primary/80 hover:text-text-primary font-semibold py-2 px-3 rounded-lg text-sm transition-colors duration-200"
    >
        {children}
    </button>
);

/**
 * A card component that displays the drone's status, including battery level,
 * patrol interval, and command buttons for manual control.
 */
export const DroneStatusCard: React.FC<DroneStatusCardProps> = ({ drone, onCommand }) => {
  /**
   * Determines the color of the battery bar based on the charge level.
   * @param level - The battery percentage (0-100).
   * @returns A Tailwind CSS background color class string.
   */
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-text-primary/90 mb-3 px-2">Drone Status</h3>
      <div className="bg-card-light/50 p-4 rounded-xl space-y-4">
        {/* Drone Status */}
        <div className="flex justify-between items-center">
            <p className="text-xs text-text-primary/60">Status</p>
            <StatusIndicator status={drone.status} />
        </div>
        
        {/* Battery Level */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-text-primary/60">Battery</p>
            <p className="font-bold text-text-primary text-sm">{drone.battery.toFixed(0)}%</p>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${getBatteryColor(drone.battery)}`}
              style={{ width: `${drone.battery}%` }}
            />
          </div>
        </div>

        {/* Patrol Interval */}
        <div className="flex justify-between items-center">
            <p className="text-xs text-text-primary/60">Patrol Interval</p>
            <p className="font-bold text-text-primary text-sm">{drone.patrolInterval} mins</p>
        </div>

        {/* Drone Commands */}
        <div className="border-t border-white/10 pt-4 space-y-2">
             <h4 className="text-xs text-text-primary/60 text-center font-bold uppercase tracking-wider mb-2">Commands</h4>
             <CommandButton onClick={() => onCommand('return-to-base')}>
                Return to Base - charge
             </CommandButton>
             <CommandButton onClick={() => onCommand('herd-isolated')}>
                Herd Isolated Cows
             </CommandButton>
             <CommandButton onClick={() => onCommand('full-scan')}>
                Initiate Patrol and search
             </CommandButton>
        </div>
      </div>
    </div>
  );
};
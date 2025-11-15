/**
 * Represents a 2D point with x and y coordinates.
 * Used for positions of cows, drones, and other map elements.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Represents a single cow in the simulation.
 * It has a unique ID, position, status, and behavioral archetype.
 */
export interface Cow {
  id: string;
  position: Point;
  status: 'grazing' | 'moving' | 'idle' | 'isolated' | 'escaped';
  behavior: 'leader' | 'follower' | 'loner';
}

/**
 * Defines the set of possible manual commands for the drone.
 * `null` means no active command is being executed.
 */
export type DroneCommand = 'return-to-base' | 'herd-isolated' | 'full-scan' | null;

/**
 * Represents the autonomous drone used for herding.
 * It tracks position, status, battery, and movement velocity.
 */
export interface Drone {
  id: string;
  position: Point;
  status: 'patrolling' | 'herding' | 'charging' | 'idle'; // Added 'idle' state
  battery: number;
  patrolInterval: number; // in minutes
  velocity: Point; // Used for the smooth movement simulation
}

/**
 * Defines a specific area on the farm, like a pasture.
 * The `path` is an SVG path data string.
 */
export interface FarmArea {
  id: string;
  name: string;
  path: string;
}

/**
 * Holds weather information for the simulation environment.
 */
export interface WeatherData {
    condition: 'Sunny' | 'Cloudy' | 'Rainy' | string;
    temperature: number;
}

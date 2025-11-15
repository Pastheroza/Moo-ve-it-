import type { Cow, Drone, FarmArea, Point } from './types';

/** The width of the simulation map in virtual units. */
export const MAP_WIDTH = 800;
/** The height of the simulation map in virtual units. */
export const MAP_HEIGHT = 500;

/** The initial state configuration for the drone. */
export const INITIAL_DRONE: Drone = {
  id: 'drone-01',
  position: { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 },
  status: 'patrolling',
  battery: 100,
  patrolInterval: 30,
  velocity: { x: 1, y: 1 }, // Initial velocity for smooth movement
};

// --- Cow Generation Constants ---
/** Total number of cows to simulate in the herd. */
const NUM_COWS = 30;
/** Number of cows that will have the 'leader' behavior. */
const NUM_LEADERS = 3;
/** Number of cows that will have the 'loner' behavior. */
const NUM_LONERS = 4;

/**
 * An array of initial cow states, generated with varying behaviors.
 * This function creates a diverse herd for the simulation.
 */
export const INITIAL_COWS: Cow[] = Array.from({ length: NUM_COWS }, (_, i) => {
  let behavior: Cow['behavior'];
  if (i < NUM_LEADERS) {
    behavior = 'leader';
  } else if (i < NUM_LEADERS + NUM_LONERS) {
    behavior = 'loner';
  } else {
    behavior = 'follower';
  }
  
  return {
    id: `cow-${i + 1}`,
    position: { 
      x: Math.random() * (MAP_WIDTH - 200) + 100, 
      y: Math.random() * (MAP_HEIGHT - 200) + 100
    },
    status: 'grazing',
    behavior,
  };
});

/** An array of farm area definitions, each with an SVG path for rendering. */
export const FARM_AREAS: FarmArea[] = [
  {
    id: 'main-pasture',
    name: 'Main Pasture',
    // A more organic shape with curves and lines for a natural feel
    path: `M40,60 C150,20 300,80 450,50 S650,40 760,80 C790,200 750,400 720,480 L180,480 C130,420 80,450 40,380 C10,250 10,150 40,60 Z`,
  },
];

/** The definition of the main barn building on the farm map. */
export const FARM_BUILDING = {
    id: 'main-barn',
    path: 'M50,470 L50,420 L90,400 L130,420 L130,470 Z',
};

/** The definition and location of the drone's charging base station. */
export const DRONE_BASE = {
    id: 'drone-station',
    cx: 160,
    cy: 450,
    r: 15,
};

/** A predefined set of waypoints for the drone's "full scan" command path. */
export const SCAN_WAYPOINTS: Point[] = [
    { x: 100, y: 100 },
    { x: 700, y: 100 },
    { x: 700, y: 250 },
    { x: 100, y: 250 },
    { x: 100, y: 400 },
    { x: 700, y: 400 },
];

/**
 * A list of example AI-generated reports to cycle through in the UI.
 * This simulates a continuous analysis of the herd's status.
 */
export const AI_REPORT_EXAMPLES = [
    "Herd cohesion is strong, with all animals grazing calmly within the designated pasture. No anomalies detected. Conditions are optimal.",
    "One cow is showing signs of isolation near the northern fence. Recommend visual inspection. The rest of the herd remains stable.",
    "The herd is slowly migrating towards the western pasture. All individuals are accounted for and movement patterns appear normal. Weather is clear.",
    "NOTICE: A cow has breached the geofence near the southern border. Immediate action may be required. Herd status is now critical.",
    "All systems are nominal. The herd is tightly grouped and calm. Drone battery is at 85% and continuing its patrol route as scheduled."
];

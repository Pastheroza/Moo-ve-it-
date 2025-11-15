import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MapSection } from './components/MapSection';
import { FeaturesSection } from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { INITIAL_COWS, INITIAL_DRONE, MAP_WIDTH, MAP_HEIGHT, FARM_AREAS, AI_REPORT_EXAMPLES, DRONE_BASE, SCAN_WAYPOINTS } from './constants';
import type { Cow, Drone, Point, DroneCommand } from './types';

/**
 * A helper function to check if a point is inside a polygon using the Ray Casting algorithm.
 * This is used to determine if a cow has escaped the main pasture area.
 * @param point - The point to check (e.g., a cow's position).
 * @param vs - An array of vertices defining the polygon.
 * @returns `true` if the point is inside the polygon, `false` otherwise.
 */
const isPointInPolygon = (point: Point, vs: Point[]) => {
    const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].x, yi = vs[i].y;
        const xj = vs[j].x, yj = vs[j].y;
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

/**
 * Parses the farm area's SVG path string into an array of polygon points.
 * This is needed for the `isPointInPolygon` check.
 */
const farmPolygonPoints = FARM_AREAS[0].path
    .replace(/[M,C,S,L,Z]/g, ' ')
    .trim()
    .split(/\s+/)
    .reduce((acc, _, i, arr) => {
        if (i % 2 === 0) {
            acc.push({ x: parseFloat(arr[i]), y: parseFloat(arr[i + 1]) });
        }
        return acc;
    }, [] as Point[]);

/**
 * The main application component.
 * It manages the state and logic for the entire simulation.
 */
const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [cows, setCows] = useState<Cow[]>(INITIAL_COWS);
  const [drone, setDrone] = useState<Drone>(INITIAL_DRONE);
  const [herdTarget, setHerdTarget] = useState<Point>({ x: MAP_WIDTH * 0.7, y: MAP_HEIGHT * 0.7 });
  const [distanceHistory, setDistanceHistory] = useState<number[]>([]);
  const [aiReport, setAiReport] = useState(AI_REPORT_EXAMPLES[0]);
  
  // State for manual drone control
  const [droneManualTarget, setDroneManualTarget] = useState<Point | null>(null);
  const [activeDroneCommand, setActiveDroneCommand] = useState<DroneCommand>(null);
  const [scanIndex, setScanIndex] = useState(0);

  // Static simulated dashboard data
  const [weather] = useState({ condition: 'Sunny', temperature: 18 });
  
  /**
   * Handles setting a manual drone target when the user clicks on the map.
   * This awakens the drone if it's idle.
   */
  const handleSetDroneTarget = useCallback((target: Point) => {
    // A command can be issued even while charging, which will interrupt it.
    setDrone(d => ({ ...d, status: 'patrolling' })); // Wake up the drone
    setActiveDroneCommand(null); // Clicking on map overrides any active command
    setDroneManualTarget(target);
  }, []);

  /**
   * Handles executing a drone command from the UI buttons.
   * This awakens the drone if it's idle or charging.
   */
  const handleDroneCommand = useCallback((command: DroneCommand) => {
    if (!command) return;

    setDrone(d => ({ ...d, status: 'patrolling' })); // Wake up the drone
    setActiveDroneCommand(command);
    
    switch (command) {
        case 'return-to-base':
            setDroneManualTarget({ ...DRONE_BASE, x: DRONE_BASE.cx, y: DRONE_BASE.cy });
            break;
        case 'herd-isolated':
            const isolatedCows = cows.filter(c => c.status === 'isolated');
            if (isolatedCows.length > 0) {
                // Find the most isolated cow (farthest from herd center)
                const herdCenter = cows.reduce((acc, cow) => ({ x: acc.x + cow.position.x, y: acc.y + cow.position.y }), { x: 0, y: 0 });
                herdCenter.x /= cows.length;
                herdCenter.y /= cows.length;
                
                let farthestCow = isolatedCows[0];
                let maxDist = 0;
                isolatedCows.forEach(cow => {
                    const dist = Math.sqrt(Math.pow(cow.position.x - herdCenter.x, 2) + Math.pow(cow.position.y - herdCenter.y, 2));
                    if (dist > maxDist) {
                        maxDist = dist;
                        farthestCow = cow;
                    }
                });
                setDroneManualTarget(farthestCow.position);
            }
            break;
        case 'full-scan':
            setScanIndex(0);
            setDroneManualTarget(SCAN_WAYPOINTS[0]);
            break;
    }
  }, [cows]);

  /**
   * The core simulation loop, updating positions of the drone and cows.
   * This function is wrapped in `useCallback` for performance optimization.
   */
  const updatePositions = useCallback(() => {
    // --- DRONE SIMULATION ---
    setDrone(prevDrone => {
        let newStatus = prevDrone.status;
        let newBattery = prevDrone.battery;
        let newPosition = { ...prevDrone.position };
        let newVelocity = { ...prevDrone.velocity };
        let newManualTarget = droneManualTarget;
        let newActiveCommand = activeDroneCommand;
        let newScanIndex = scanIndex;

        // 1. Battery & Status Simulation based on location
        const distToBase = Math.sqrt(Math.pow(prevDrone.position.x - DRONE_BASE.cx, 2) + Math.pow(prevDrone.position.y - DRONE_BASE.cy, 2));
        const atBase = distToBase < DRONE_BASE.r;

        if (atBase) {
             // Only switch to charging/idle if there's no overriding manual command.
             // This prevents the drone from getting stuck at the base after a command is issued.
            if (!newManualTarget && !newActiveCommand) {
                if (prevDrone.battery < 100) {
                    newStatus = 'charging';
                    newBattery = Math.min(100, prevDrone.battery + 0.5);
                } else {
                    newStatus = 'idle';
                    newBattery = 100;
                }
            }
        } else {
            // If the drone is not at its base, it consumes battery unless idle.
            if (newStatus !== 'idle') {
                newBattery = Math.max(0, prevDrone.battery - 0.025);
            }

            // If battery is critically low while away, override current task to return to base.
            if (newBattery < 20) {
                newStatus = 'charging';
                newManualTarget = null;
                newActiveCommand = null;
            }
        }

        // 2. Movement Simulation
        const speedFactor = 0.03; // Reduced speed for more natural movement

        if (newStatus === 'idle') {
            // If idle, do not move. It will be awakened by user commands.
        } else if (newStatus === 'charging') {
            const dx = DRONE_BASE.cx - prevDrone.position.x;
            const dy = DRONE_BASE.cy - prevDrone.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 5) { // Move towards base if not already there
                newPosition.x += dx * 0.05;
                newPosition.y += dy * 0.05;
            }
        } else if (newManualTarget) {
            // Move towards a manually set target
            const dx = newManualTarget.x - prevDrone.position.x;
            const dy = newManualTarget.y - prevDrone.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 10) { // Arrived at target
                if (newActiveCommand === 'full-scan' && newScanIndex < SCAN_WAYPOINTS.length - 1) {
                    newScanIndex++;
                    newManualTarget = SCAN_WAYPOINTS[newScanIndex];
                    setScanIndex(newScanIndex);
                } else { // Command finished or manual target reached
                    if (newActiveCommand === 'return-to-base') {
                        // Let the battery logic handle switching to 'charging' or 'idle'
                    }
                    newManualTarget = null;
                    newActiveCommand = null;
                }
            } else {
                newPosition.x += dx * speedFactor;
                newPosition.y += dy * speedFactor;
            }
        }
        else { // Standard patrolling movement with smooth wandering
            const wanderAngle = (Math.random() - 0.5) * 0.4;
            const cos = Math.cos(wanderAngle);
            const sin = Math.sin(wanderAngle);
            const vx = newVelocity.x * cos - newVelocity.y * sin;
            const vy = newVelocity.x * sin + newVelocity.y * cos;
            newVelocity = { x: vx, y: vy };

            newPosition.x += newVelocity.x;
            newPosition.y += newVelocity.y;

            // Turn around at map boundaries to stay within the area
            const margin = 40;
            if (newPosition.x < margin || newPosition.x > MAP_WIDTH - margin) newVelocity.x *= -1;
            if (newPosition.y < margin || newPosition.y > MAP_HEIGHT - margin) newVelocity.y *= -1;
            newPosition.x = Math.max(margin, Math.min(MAP_WIDTH - margin, newPosition.x));
            newPosition.y = Math.max(margin, Math.min(MAP_HEIGHT - margin, newPosition.y));
        }
        
        // Update states outside the drone setter to avoid stale closures
        setDroneManualTarget(newManualTarget);
        setActiveDroneCommand(newActiveCommand);

        return {
            ...prevDrone,
            position: newPosition,
            status: newStatus,
            battery: newBattery,
            velocity: newVelocity,
        };
    });

    // --- HERD BEHAVIOR SIMULATION ---

    // Occasionally update the herd's general target area to simulate natural migration
    if (Math.random() < 0.005) {
        setHerdTarget({
            x: Math.random() * (MAP_WIDTH - 200) + 100,
            y: Math.random() * (MAP_HEIGHT - 200) + 100,
        });
    }

    // Update each cow's position based on behavior and external forces
    setCows(prevCows => {
        const leaders = prevCows.filter(c => c.behavior === 'leader');
        
        const herdCenter = prevCows.reduce((acc, cow) => ({
            x: acc.x + cow.position.x, y: acc.y + cow.position.y
        }), { x: 0, y: 0 });
        herdCenter.x /= prevCows.length;
        herdCenter.y /= prevCows.length;

        let totalDistance = 0;
        let pairs = 0;

        const newCows = prevCows.map((cow, i) => {
            // Calculate avg distance for cohesion analysis
            for (let j = i + 1; j < prevCows.length; j++) {
                const otherCow = prevCows[j];
                totalDistance += Math.sqrt(Math.pow(cow.position.x - otherCow.position.x, 2) + Math.pow(cow.position.y - otherCow.position.y, 2));
                pairs++;
            }
            
            // --- Cow Movement Logic ---
            let target = { ...herdTarget };
            
            // Reduced movement factors for slower, more realistic movement
            let cohesionFactor = 0.0001;
            let wanderFactor = 0.1;
            let targetFactor = 0.0001;

            // Behavior-specific adjustments
            switch (cow.behavior) {
                case 'leader': targetFactor = 0.0006; wanderFactor = 0.15; break;
                case 'follower':
                    if (leaders.length > 0) {
                        let closestLeader = leaders[0];
                        let minLeaderDist = Infinity;
                        for (const leader of leaders) {
                            const dist = Math.sqrt(Math.pow(cow.position.x - leader.position.x, 2) + Math.pow(cow.position.y - leader.position.y, 2));
                            if (dist < minLeaderDist) { minLeaderDist = dist; closestLeader = leader; }
                        }
                        target = closestLeader.position;
                        targetFactor = 0.0008;
                        cohesionFactor = 0.0002;
                    }
                    break;
                case 'loner': wanderFactor = 0.5; cohesionFactor = 0.00005; targetFactor = 0.00005; break;
            }

            // --- Forces Calculation ---
            // 1. Force towards target (leader or general area)
            const targetDx = target.x - cow.position.x;
            const targetDy = target.y - cow.position.y;
            // 2. Force towards herd center (cohesion)
            const cohesionDx = herdCenter.x - cow.position.x;
            const cohesionDy = herdCenter.y - cow.position.y;
            // 3. Random wandering force
            const wanderDx = (Math.random() - 0.5);
            const wanderDy = (Math.random() - 0.5);
            // 4. Repulsion force from drone
            const repulsionRadius = 80;
            const repulsionFactor = 1.0;
            let repulsionDx = 0, repulsionDy = 0;
            const droneDx = cow.position.x - drone.position.x;
            const droneDy = cow.position.y - drone.position.y;
            const distToDrone = Math.sqrt(droneDx * droneDx + droneDy * droneDy);

            if (distToDrone > 0 && distToDrone < repulsionRadius) {
                const force = (repulsionRadius - distToDrone) / repulsionRadius;
                repulsionDx = (droneDx / distToDrone) * force * repulsionFactor;
                repulsionDy = (droneDy / distToDrone) * force * repulsionFactor;
            }

            // 5. Separation force from other cows (prevents clumping)
            const separationRadius = 15;
            const separationFactor = 0.3;
            let separationDx = 0, separationDy = 0;
            for (const otherCow of prevCows) {
                if (cow.id === otherCow.id) continue;
                const distToOther = Math.sqrt(Math.pow(cow.position.x - otherCow.position.x, 2) + Math.pow(cow.position.y - otherCow.position.y, 2));
                if (distToOther > 0 && distToOther < separationRadius) {
                    const force = (separationRadius - distToOther) / separationRadius;
                    separationDx += (cow.position.x - otherCow.position.x) / distToOther * force * separationFactor;
                    separationDy += (cow.position.y - otherCow.position.y) / distToOther * force * separationFactor;
                }
            }

            // --- Final Position Update ---
            const newX = cow.position.x + (targetDx * targetFactor) + (cohesionDx * cohesionFactor) + (wanderDx * wanderFactor) + repulsionDx + separationDx;
            const newY = cow.position.y + (targetDy * targetFactor) + (cohesionDy * cohesionFactor) + (wanderDy * wanderFactor) + repulsionDy + separationDy;
            
            const newPosition = {
                x: Math.max(0, Math.min(MAP_WIDTH, newX)),
                y: Math.max(0, Math.min(MAP_HEIGHT, newY)),
            };

            // --- Status Update ---
            const distFromCenter = Math.sqrt(Math.pow(newPosition.x - herdCenter.x, 2) + Math.pow(newPosition.y - herdCenter.y, 2));
            const isOutside = !isPointInPolygon(newPosition, farmPolygonPoints);
            let newStatus: Cow['status'] = 'grazing';
            
            const isolationThreshold = cow.behavior === 'loner' ? 150 : 100;
            if (isOutside) newStatus = 'escaped';
            else if (distFromCenter > isolationThreshold) newStatus = 'isolated';

            return { ...cow, position: newPosition, status: newStatus };
        });
        
        const newAvgDistance = pairs > 0 ? totalDistance / pairs : 0;
        setDistanceHistory(prev => [...prev.slice(-29), newAvgDistance]);
        return newCows;
    });
  }, [herdTarget, drone, activeDroneCommand, droneManualTarget, scanIndex]);

  // --- LIFECYCLE HOOKS ---
  // Main simulation interval
  useEffect(() => {
    const simulationInterval = setInterval(updatePositions, 100);
    return () => clearInterval(simulationInterval);
  }, [updatePositions]);

  // AI Report update interval
  useEffect(() => {
    let reportIndex = 0;
    const reportInterval = setInterval(() => {
        reportIndex = (reportIndex + 1) % AI_REPORT_EXAMPLES.length;
        setAiReport(AI_REPORT_EXAMPLES[reportIndex]);
    }, 15000);
    return () => clearInterval(reportInterval);
  }, []);

  // Determine overall herd status for the UI
  const herdStatus = cows.some(c => c.status === 'escaped') ? 'Cow Escaped!' 
                   : cows.some(c => c.status === 'isolated') ? 'Cow Isolated' 
                   : 'All Calm';

  return (
    <div className="bg-base-black min-h-screen">
      <Header />
      <main className="px-4 md:px-6 lg:px-8 py-8 space-y-16">
        <HeroSection />
        <MapSection 
            cows={cows} 
            drone={drone} 
            weather={weather} 
            herdStatus={herdStatus}
            distanceHistory={distanceHistory}
            aiReport={aiReport}
            onSetDroneTarget={handleSetDroneTarget}
            droneManualTarget={droneManualTarget}
            onDroneCommand={handleDroneCommand}
        />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
import fetch from 'node-fetch';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stationMap = require('../src/data/stations.json');

async function run() {
    try {
        console.log('Fetching data...');
        const response = await fetch('https://www.goodservice.io/api/routes/Q');
        const data = await response.json();
        console.log('Data fetched.');

        const directions = ['north', 'south'];

        for (const direction of directions) {
            console.log(`\n--- ${direction.toUpperCase()} ---`);

            if (!data.trips || !data.trips[direction]) {
                console.log('No trips found.');
                continue;
            }

            const now = Math.floor(Date.now() / 1000);
            const stationOrder = data.actual_routings?.[direction]?.[0] || [];
            const stationIndexMap = {};
            stationOrder.forEach((stationId, index) => {
                stationIndexMap[stationId] = index;
            });

            // Flatten and Deduplicate
            const uniqueTrips = new Map();
            Object.values(data.trips[direction]).flat().forEach(trip => {
                if (!uniqueTrips.has(trip.id)) {
                    uniqueTrips.set(trip.id, trip);
                }
            });

            const trips = Array.from(uniqueTrips.values())
                .map(trip => {
                    const arrivalTime = trip.upcoming_stop_arrival_time;
                    const secondsUntilArrival = arrivalTime - now;
                    return { ...trip, secondsUntilArrival };
                })
                .filter(trip => {
                    // Filter for trains arriving within 10 minutes
                    if (trip.secondsUntilArrival <= -60 || trip.secondsUntilArrival > 600) return false;

                    // Filter out trains arriving at the last stop
                    if (direction === 'north' && trip.upcoming_stop === 'Q05') return false;
                    if (direction === 'south' && trip.upcoming_stop === 'D43') return false;

                    // Filter for specific stops requested by user
                    const INTERESTING_STOPS = [
                        'D35', // Kings Highway
                        'D34', // Avenue M
                        'D31', // Newkirk Plaza
                        'D26', // Prospect Park
                        'R30', // DeKalb Av
                        'Q01', // Canal St
                        'R20', // 14 St - Union Sq
                        'R16'  // Times Sq - 42 St
                    ];

                    if (!INTERESTING_STOPS.includes(trip.upcoming_stop)) return false;

                    return true;
                })
                .sort((a, b) => {
                    const indexA = stationIndexMap[a.upcoming_stop] ?? 9999;
                    const indexB = stationIndexMap[b.upcoming_stop] ?? 9999;
                    return indexA - indexB;
                });

            console.log(`Found ${trips.length} trips after filtering.`);

            // Group by station
            const tripsByStation = new Map();
            trips.forEach(trip => {
                if (!tripsByStation.has(trip.upcoming_stop)) {
                    tripsByStation.set(trip.upcoming_stop, []);
                }
                tripsByStation.get(trip.upcoming_stop).push(trip);
            });

            for (const [stationId, stationTrips] of tripsByStation) {
                const nextStop = stationMap[stationId] || stationId;
                console.log(`\nStation: ${nextStop} (${stationId})`);

                // Group by destination
                const tripsByDest = new Map();
                stationTrips.forEach(trip => {
                    const dest = stationMap[trip.destination_stop] || trip.destination_stop;
                    if (!tripsByDest.has(dest)) {
                        tripsByDest.set(dest, []);
                    }
                    tripsByDest.get(dest).push(trip);
                });

                for (const [destination, destTrips] of tripsByDest) {
                    const times = destTrips
                        .map(t => Math.max(0, Math.round(t.secondsUntilArrival / 60)))
                        .sort((a, b) => a - b);
                    console.log(`  To: ${destination} -> ${times.join(', ')} min`);
                }
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

run();

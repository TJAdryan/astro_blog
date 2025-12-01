import fs from 'fs';
import path from 'path';

const fetchStations = async () => {
    try {
        console.log('Fetching stations from goodservice.io...');
        const response = await fetch('https://www.goodservice.io/api/stops');
        if (!response.ok) {
            throw new Error(`Failed to fetch stations: ${response.statusText}`);
        }
        const data = await response.json();

        const stationMap = {};
        data.stops.forEach(stop => {
            stationMap[stop.id] = stop.name;
        });

        const outputPath = path.join(process.cwd(), 'src', 'data', 'stations.json');

        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(stationMap, null, 2));
        console.log(`Successfully saved ${Object.keys(stationMap).length} stations to ${outputPath}`);

    } catch (error) {
        console.error('Error fetching stations:', error);
    }
};

fetchStations();

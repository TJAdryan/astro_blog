import fs from 'fs';
import path from 'path';

const logDailyStatus = async () => {
    try {
        console.log('Fetching Q train status for daily log...');
        const response = await fetch('https://www.goodservice.io/api/routes/Q');
        if (!response.ok) {
            throw new Error(`Failed to fetch status: ${response.statusText}`);
        }
        const data = await response.json();

        // Determine status (reusing logic from component)
        let status = 'Good Service';
        const hasServiceChanges = data.service_change_summaries?.both?.length > 0 ||
            data.service_change_summaries?.north?.length > 0 ||
            data.service_change_summaries?.south?.length > 0;

        const hasDelays = data.service_irregularity_summaries?.north ||
            data.service_irregularity_summaries?.south;

        if (hasServiceChanges) {
            status = 'Service Change';
        } else if (hasDelays) {
            status = 'Delays';
        } else if (data.status === 'Not Scheduled') {
            status = 'Not Scheduled';
        }

        // Collect details
        let details = [];
        if (data.service_change_summaries?.both) details.push(...data.service_change_summaries.both);
        if (data.service_change_summaries?.north) details.push(...data.service_change_summaries.north.map(d => `Northbound: ${d}`));
        if (data.service_change_summaries?.south) details.push(...data.service_change_summaries.south.map(d => `Southbound: ${d}`));

        if (!hasServiceChanges && hasDelays) {
            if (data.service_irregularity_summaries?.north) details.push(`Northbound: ${data.service_irregularity_summaries.north}`);
            if (data.service_irregularity_summaries?.south) details.push(`Southbound: ${data.service_irregularity_summaries.south}`);
        }

        const logEntry = {
            date: new Date().toISOString(),
            status: status,
            details: details
        };

        const logPath = path.join(process.cwd(), 'src', 'data', 'train_log.json');

        let log = [];
        if (fs.existsSync(logPath)) {
            const fileContent = fs.readFileSync(logPath, 'utf-8');
            try {
                log = JSON.parse(fileContent);
            } catch (e) {
                console.error('Error parsing existing log, starting fresh.');
            }
        }

        // Prepend new entry
        log.unshift(logEntry);

        // Keep only last 30 days
        if (log.length > 30) {
            log = log.slice(0, 30);
        }

        fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
        console.log(`Successfully logged status: ${status}`);

    } catch (error) {
        console.error('Error logging daily status:', error);
        process.exit(1);
    }
};

logDailyStatus();

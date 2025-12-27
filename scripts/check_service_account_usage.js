import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsonVar = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON;
if (!jsonVar) {
    console.error("FATAL: GOOGLE_SERVICE_ACCOUNT_JSON not found.");
    process.exit(1);
}

const credentials = JSON.parse(jsonVar);
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

async function checkStorage() {
    console.log("Checking Service Account Storage Usage...");
    console.log(`Service Account Email: ${credentials.client_email}`);

    try {
        // 1. Get About info (Storage Quota)
        const aboutRes = await drive.about.get({
            fields: 'storageQuota, user'
        });

        const quota = aboutRes.data.storageQuota;
        const limit = parseInt(quota.limit);
        const usage = parseInt(quota.usage);
        const usageInMB = (usage / 1024 / 1024).toFixed(2);
        const limitInMB = (limit / 1024 / 1024).toFixed(2);

        console.log("\n--- Storage Quota ---");
        console.log(`Used: ${usageInMB} MB`);
        console.log(`Limit: ${limitInMB} MB`);
        console.log(`Usage %: ${((usage / limit) * 100).toFixed(2)}%`);

        if (usage >= limit) {
            console.error("\n[!] CRITICAL: Storage limit reached!");
        }

        // 2. List Files to see what is taking up space
        console.log("\n--- Listing Files (Top 20) ---");
        const listRes = await drive.files.list({
            pageSize: 20,
            fields: 'files(id, name, size, mimeType, createdTime)',
            orderBy: 'quotaBytesUsed desc' // Show largest files first
        });

        const files = listRes.data.files;
        if (files.length === 0) {
            console.log("No files found visible to this service account.");
        } else {
            console.log(`Found ${files.length} files (listing top by size):`);
            files.forEach(f => {
                const sizeKB = f.size ? (parseInt(f.size) / 1024).toFixed(2) + ' KB' : '0 KB (Google Doc)';
                console.log(`- [${f.createdTime}] ${f.name} (${sizeKB}) [${f.id}]`);
            });
        }

        // Count total files (approx)
        let totalFiles = 0;
        let pageToken = null;
        process.stdout.write("\nCounting total files... ");
        do {
            const countRes = await drive.files.list({
                q: "trashed = false", // Only active files
                fields: 'nextPageToken',
                pageToken: pageToken,
                pageSize: 1000
            });
            // We assume full pages for estimation or count properly? 
            // Actually request is lightweight if we don't ask for file details.
            // But 'files' is not in fields, so we can't count current page size easily without verifying.
            // Let's just do a simpler count check by requesting id only
            const countRes2 = await drive.files.list({
                q: "trashed = false",
                fields: 'nextPageToken, files(id)',
                pageToken: pageToken,
                pageSize: 1000
            });
            totalFiles += countRes2.data.files.length;
            pageToken = countRes2.data.nextPageToken;
            process.stdout.write(".");
        } while (pageToken);
        console.log(`\nTotal Files Found: ${totalFiles}`);

    } catch (error) {
        console.error("Error checking storage:", error);
    }
}

checkStorage();

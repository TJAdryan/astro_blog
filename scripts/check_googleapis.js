
import { google } from 'googleapis';

console.log('Type of google:', typeof google);
console.log('google.drive exists?', !!google.drive);
console.log('google.docs exists?', !!google.docs);

try {
    const drive = google.drive({ version: 'v3' });
    console.log('Drive v3 init success?', !!drive);
} catch (e) {
    console.error('Drive v3 init failed:', e.message);
}

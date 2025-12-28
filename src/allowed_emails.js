// ALLOWLIST CONFIGURATION
// LOADED FROM ENVIRONMENT VARIABLES for security.
// To manage this list, edit your .env file or Netlify Environment Variables.
// Variable Name: ALLOWED_EMAILS
// Format: "email1@example.com,email2@example.com"

const envEmails = import.meta.env.ALLOWED_EMAILS || process.env.ALLOWED_EMAILS || "";

export const ALLOWED_EMAILS = envEmails
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);

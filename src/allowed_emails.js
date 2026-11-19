// ALLOWLIST CONFIGURATION
// LOADED FROM ENVIRONMENT VARIABLES for security.
// To manage this list, edit your .env file or Netlify Environment Variables.
// Variable Name: ALLOWED_EMAILS
// Format: "email1@example.com,email2@example.com"

const envEmails =
    import.meta.env.ALLOWED_EMAILS || process.env.ALLOWED_EMAILS || "";

export const ALLOWED_EMAILS = envEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);

/**
 * Fail-closed check whether an email is on the admin allowlist.
 * Returns false if ALLOWED_EMAILS is unset/empty or if the email does not match.
 */
export function isAuthorizedAdmin(email) {
    if (!email || typeof email !== "string") return false;
    if (ALLOWED_EMAILS.length === 0) return false;
    return ALLOWED_EMAILS.includes(email.trim().toLowerCase());
}

/**
 * Verifies Clerk session and admin allowlist for privileged API routes.
 */
export async function authorizeApiRequest(locals) {
    try {
        const user =
            typeof locals?.currentUser === "function"
                ? await locals.currentUser()
                : null;
        if (!user) {
            return {
                authorized: false,
                response: new Response("Unauthorized: authentication required.", {
                    status: 401,
                }),
            };
        }

        const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
        if (!isAuthorizedAdmin(userEmail)) {
            return {
                authorized: false,
                response: new Response("Forbidden: insufficient permissions.", {
                    status: 403,
                }),
            };
        }

        return { authorized: true, user, userEmail };
    } catch (err) {
        console.error("[Auth] Failed to verify API session:", err);
        return {
            authorized: false,
            response: new Response("Unauthorized", { status: 401 }),
        };
    }
}

import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { authorizeApiRequest } from "./allowed_emails";

const isProtectedApiRoute = createRouteMatcher([
    "/api/add-article",
    "/api/archive-article",
    "/api/submit-summary",
    "/api/submit-tracker",
]);

const isProtectedPageRoute = createRouteMatcher([
    "/private(.*)",
    "/dashboard(.*)",
    "/tracker(.*)",
]);

const SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "X-Permitted-Cross-Domain-Policies": "none",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Content-Security-Policy":
        "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; upgrade-insecure-requests;",
};

function withSecurityHeaders(response) {
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        if (!headers.has(key)) {
            headers.set(key, value);
        }
    }
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

export const onRequest = clerkMiddleware(async (auth, context, next) => {
    const { request, locals } = context;

    if (isProtectedApiRoute(request)) {
        const authResult = await authorizeApiRequest(locals, request);
        if (!authResult.authorized) {
            return withSecurityHeaders(authResult.response);
        }
    } else if (isProtectedPageRoute(request)) {
        const { userId } = auth();
        if (!userId) {
            return withSecurityHeaders(context.redirect("/login"));
        }
    }

    const response = await next();
    return withSecurityHeaders(response);
});

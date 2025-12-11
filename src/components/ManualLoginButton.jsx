
import React from 'react';

export default function ManualLoginButton() {
    const handleLogin = () => {
        if (window.Clerk) {
            window.Clerk.openSignIn({
                afterSignInUrl: '/login', // Force return to hub
                afterSignUpUrl: '/login'
            });
        } else {
            // Fallback if Clerk isn't ready for some reason
            window.location.reload();
        }
    };

    return (
        <button
            onClick={handleLogin}
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 hover:shadow-blue-600/40 border border-blue-500/20 cursor-pointer"
        >
            Authenticate Session
        </button>
    );
}


import React from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/astro/react";

export default function TrackerDashboard({ history }) {
    // Calculate latest TCGA progress from history for the slider visual (optional, can keep or remove)
    const latestEntry = history && history.length > 0 ? history[history.length - 1] : null;
    const currentTcgaProgress = latestEntry ? latestEntry.tcga_progress : 0;

    return (
        <div className="container max-w-4xl mx-auto p-6">
            <div className="hero-section text-center py-12 bg-gradient-to-br from-teal-50 to-transparent rounded-3xl mb-8 border border-teal-100">
                <SignedIn>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 text-gray-900 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-900 to-teal-700">Output</span> <span className="text-teal-500">Tracker</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                        Focus on progress, learning, and reflection.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <UserButton />
                    </div>
                </SignedIn>
                <SignedOut>
                    <h1 className="text-3xl font-black mb-4">Tracker Access</h1>
                    <SignInButton mode="modal">
                        <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
            </div>

            <SignedIn>
                <form action="/api/submit-tracker" method="POST" className="mb-12">
                    <div className="p-8 bg-white rounded-2xl shadow-xl shadow-teal-900/5 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-100">Daily Log</h2>

                        {/* 1. TCGA Progress */}
                        <div className="mb-10">
                            <label className="block text-lg font-bold text-gray-900 mb-3">1. What progress did you make on the TCGA pipeline?</label>
                            <textarea
                                name="tcga_progress_text"
                                rows="4"
                                className="w-full p-4 border border-gray-200 rounded-xl text-base mb-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50/50 transition-all"
                                placeholder="Describe your technical implementation steps..."
                            ></textarea>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-grow">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">GitHub Link (Optional)</label>
                                    <input type="text" name="github_link" className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-teal-500 bg-white" placeholder="https://github.com/..." />
                                </div>
                                <div className="md:w-1/3">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Completion %</label>
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                        <input type="range" name="tcga_progress" min="0" max="100" defaultValue={currentTcgaProgress} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                                        <span className="text-sm font-bold text-teal-700 w-12 text-right">{currentTcgaProgress}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. FHIR/GXP */}
                        <div className="mb-10">
                            <label className="block text-lg font-bold text-gray-900 mb-3">2. What did you learn regarding FHIR and GxP?</label>
                            <textarea
                                name="compliance_notes"
                                rows="4"
                                className="w-full p-4 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/20 transition-all"
                                placeholder="Summarize your regulatory and data standard learnings..."
                            ></textarea>
                            <p className="text-xs text-purple-600 mt-2 font-medium flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                Automatically saves to Google Drive
                            </p>
                        </div>

                        {/* 3. Reflections */}
                        <div className="mb-10">
                            <label className="block text-lg font-bold text-gray-900 mb-3">3. What are you finding interesting / not interesting about this project?</label>
                            <textarea
                                name="reflections"
                                rows="4"
                                className="w-full p-4 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50/20 transition-all"
                                placeholder="Reflect on the work, the tech stack, or the domain..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button type="submit" className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                                <span>Save Daily Log</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                        </div>
                    </div>
                </form>

            </SignedIn>
        </div>
    );
}

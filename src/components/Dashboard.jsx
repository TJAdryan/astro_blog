import React from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/astro/react";

export default function Dashboard({ queue, stats }) {
    const { count, days, avgPerWeek } = stats;

    return (
        <div className="container max-w-4xl mx-auto p-6">
            <div className="hero-section text-center py-9 bg-gradient-to-br from-orange-50/5 to-transparent rounded-2xl mb-8">
                <SignedIn>
                    <h1 className="hero-title text-4xl md:text-5xl font-black mb-2 text-gray-900 leading-tight justify-center gap-x-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800">Article</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300 inline-block">Review</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800">Page</span>
                    </h1>
                    <p className="hero-subtitle text-gray-500 max-w-2xl mx-auto text-lg">
                        Clerk authentication successful
                    </p>
                    <div className="mt-4 flex justify-center">
                        <div className="flex items-center gap-4">
                            <UserButton />
                        </div>
                    </div>
                </SignedIn>
                <SignedOut>
                    <h1 className="hero-title text-4xl md:text-5xl font-black mb-2 text-gray-900 leading-tight justify-center gap-x-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800">Access</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300 inline-block">Denied</span>
                    </h1>
                    <p className="hero-subtitle text-red-600 max-w-2xl mx-auto text-lg mb-6">
                        You must be logged in to view this page.
                    </p>
                    <SignInButton mode="modal">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors shadow-sm">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
            </div>

            <SignedIn>
                <div className="stats-container mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome back to the Challenge!</h2>
                        <div className="flex flex-col gap-2 mt-4 text-lg text-gray-700">
                            <p>
                                You have completed <span className="font-bold text-blue-600">{count}</span> articles in <span className="font-bold text-blue-600">{days}</span> days
                            </p>
                            <p className="text-gray-500 text-base">
                                you are averaging <span className="font-semibold text-green-600">{avgPerWeek}</span> articles per week
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Weekly Reading Challenge</h2>
                        <div className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">
                            {count} Completed
                        </div>
                    </div>

                    <div id="reading-challenge-list">
                        {queue.length === 0 ? (
                            <p className="text-gray-500 italic">No articles in the queue. Wait for Monday!</p>
                        ) : (
                            queue.map((article) => (
                                <div key={article.id} className="border-b border-gray-100 last:border-0 py-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{article.topic}</span>
                                        <span className="text-gray-400 text-xs">{new Date(article.dateAdded).toLocaleDateString()}</span>
                                        <form action="/api/archive-article" method="POST" className="ml-2">
                                            <input type="hidden" name="articleId" value={article.id} />
                                            <input type="hidden" name="articleTitle" value={article.title} />
                                            <input type="hidden" name="articleLink" value={article.link} />
                                            <input type="hidden" name="articleDescription" value={article.summary} />
                                            <button
                                                type="submit"
                                                className="group flex items-center gap-1 text-gray-400 hover:text-red-600 transition-colors text-xs"
                                                title="Archive this article"
                                                onClick={(e) => {
                                                    if (!confirm('Archive this article to \'archived-old papers\'?')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center group-hover:border-red-400">
                                                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span>Archive</span>
                                            </button>
                                        </form>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                            {article.title}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.summary}</p>

                                    <form action="/api/submit-summary" method="POST" className="mt-4">
                                        <input type="hidden" name="articleId" value={article.id} />
                                        <input type="hidden" name="articleTitle" value={article.title} />
                                        <input type="hidden" name="articleLink" value={article.link} />

                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Summary (min 500 chars)</label>
                                        <textarea
                                            name="summary"
                                            rows="6"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="Write your summary here..."
                                            required
                                            minLength="500"
                                        ></textarea>
                                        <div className="flex justify-end mt-2">
                                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium shadow-sm">
                                                Complete & Save to Drive
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </SignedIn>
        </div>
    );
}

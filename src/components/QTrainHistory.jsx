import React from 'react';
import trainLog from '../data/train_log.json';

const QTrainHistory = () => {
    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Service History Log</h3>

                {(!trainLog || trainLog.length === 0) ? (
                    <p className="text-gray-500 italic">No history available.</p>
                ) : (
                    <div className="space-y-6">
                        {trainLog.map((entry, index) => (
                            <div key={index} className="text-sm border-b last:border-0 pb-4 last:pb-0 border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-gray-900 text-lg">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${entry.status === 'Good Service' ? 'bg-green-100 text-green-800' :
                                            entry.status === 'Service Change' ? 'bg-orange-100 text-orange-800' :
                                                entry.status === 'Delays' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {entry.status}
                                    </span>
                                </div>
                                {entry.details && entry.details.length > 0 && (
                                    <ul className="list-disc list-inside text-gray-600 pl-2 space-y-1">
                                        {entry.details.map((detail, i) => (
                                            <li key={i}>{detail}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-center">
                <a href="/q-train" className="text-blue-600 hover:text-blue-800 font-medium">
                    &larr; Back to Live Status
                </a>
            </div>
        </div>
    );
};

export default QTrainHistory;

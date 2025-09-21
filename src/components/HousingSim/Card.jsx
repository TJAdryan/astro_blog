import React from 'react';

export default function Card({ label, value, subValue }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      {subValue && <div className="text-sm text-gray-600 mt-1">{subValue}</div>}
    </div>
  );
}

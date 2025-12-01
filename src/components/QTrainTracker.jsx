import React, { useState, useEffect } from 'react';
import stationMap from '../data/stations.json';

const QTrainTracker = () => {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch from our local proxy
      const response = await fetch('/api/q-train.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();

      setData(result);

      // Determine status based on goodservice.io response
      // 'status' field usually contains "Good Service", "Service Change", "Delays", etc.
      if (result.status === 'Good Service') {
        setStatus('good');
      } else if (result.status === 'Not Scheduled') {
        setStatus('inactive');
      } else {
        setStatus('delays'); // Assume anything else is a delay or change
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching Q train status:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'delays': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'good': return 'Good Service';
      case 'delays': return data?.status || 'Delays / Service Change';
      case 'inactive': return 'Not Scheduled';
      case 'error': return 'Unable to load status';
      default: return 'Loading...';
    }
  };

  const getStationName = (id) => stationMap[id] || id;

  const renderTripList = (trips, direction) => {
    if (!trips || trips.length === 0) return null;

    return (
      <div className="mt-4">
        <h3 className="font-bold text-md mb-2 capitalize">{direction}bound Trains</h3>
        <div className="space-y-3">
          {trips.map((trip) => {
            // Trip ID format often contains info, but we rely on explicit fields if available
            // goodservice.io trips usually have 'upcoming_stop', 'destination_stop'
            // We can try to parse origin from the trip ID or route info if needed, 
            // but goodservice.io doesn't explicitly give "origin" in the trip object easily.
            // However, the trip ID is often like "114850_Q..N16X026" where "N" is direction.
            // We'll focus on Destination and Next Stop as requested.
            // "First stop" is harder without full schedule, but we can show Destination.

            const nextStop = getStationName(trip.upcoming_stop);
            const destination = getStationName(trip.destination_stop);

            return (
              <div key={trip.id} className="bg-white p-3 rounded border border-gray-200 text-sm shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-gray-700">Next Stop:</span> {nextStop}
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {Math.round(trip.time_behind_next_train / 60) || '?'} min away
                  </div>
                </div>
                <div className="mt-1 text-gray-600">
                  <span className="font-medium">To:</span> {destination}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Flatten trips from the nested structure
  const getTrips = (direction) => {
    if (!data?.trips?.[direction]) return [];
    // data.trips.north is an object where keys are route segments, values are arrays of trips
    // We need to combine all arrays
    return Object.values(data.trips[direction]).flat().sort((a, b) => a.upcoming_stop_arrival_time - b.upcoming_stop_arrival_time);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-2xl border-2 border-black">
              Q
            </div>
          </div>
          <div>
            <div className="text-xl font-medium text-black">Q Train Status</div>
            <p className="text-gray-500 text-sm">
              {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Checking...'}
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${getStatusColor()} transition-colors duration-300`}>
          <div className="font-bold text-lg mb-1">{getStatusText()}</div>

          {status === 'delays' && data && (
            <div className="space-y-2 mt-2">
              {/* Display Service Change Summaries */}
              {data.service_change_summaries?.both?.map((text, i) => (
                <p key={`both-${i}`} className="text-sm">{text}</p>
              ))}
              {data.service_change_summaries?.north?.map((text, i) => (
                <p key={`north-${i}`} className="text-sm">Northbound: {text}</p>
              ))}
              {data.service_change_summaries?.south?.map((text, i) => (
                <p key={`south-${i}`} className="text-sm">Southbound: {text}</p>
              ))}

              {/* Display Irregularity Summaries if no main service changes but still delays */}
              {(!data.service_change_summaries?.both?.length &&
                !data.service_change_summaries?.north?.length &&
                !data.service_change_summaries?.south?.length) && (
                  <>
                    {data.service_irregularity_summaries?.north && (
                      <p className="text-sm">Northbound: {data.service_irregularity_summaries.north}</p>
                    )}
                    {data.service_irregularity_summaries?.south && (
                      <p className="text-sm">Southbound: {data.service_irregularity_summaries.south}</p>
                    )}
                  </>
                )}
            </div>
          )}

          {status === 'good' && (
            <p className="text-sm">Service is running on or close to schedule.</p>
          )}
        </div>
      </div>

      {/* Active Trains List */}
      {data && (
        <div className="space-y-6">
          {renderTripList(getTrips('north'), 'north')}
          {renderTripList(getTrips('south'), 'south')}
        </div>
      )}

      <div className="text-xs text-gray-400 text-center">
        Data provided by goodservice.io
      </div>
    </div>
  );
};

export default QTrainTracker;

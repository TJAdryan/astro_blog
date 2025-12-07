import React, { useState, useEffect } from 'react';
import stationMap from '../data/stations.json';
import trainLog from '../data/train_log.json';

const QTrainTracker = () => {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch directly from the API (CORS is enabled)
      const response = await fetch('https://api.subwaynow.app/routes/Q');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();

      setData(result);

      // Determine status based on detailed fields rather than just the top-level string
      const hasServiceChanges = result.service_change_summaries?.both?.length > 0 ||
        result.service_change_summaries?.north?.length > 0 ||
        result.service_change_summaries?.south?.length > 0;

      const hasDelays = result.service_irregularity_summaries?.north ||
        result.service_irregularity_summaries?.south;

      if (hasServiceChanges) {
        setStatus('service-change');
      } else if (hasDelays) {
        setStatus('delays');
      } else if (result.status === 'Not Scheduled') {
        setStatus('inactive');
      } else {
        // Default to good if no specific negative flags found, even if status says "Not Good"
        // This handles minor fluctuations that don't have associated alert text
        setStatus('good');
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
      case 'service-change': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delays': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'good': return 'Good Service';
      case 'service-change': return 'Service Change';
      case 'delays': return 'Delays';
      case 'inactive': return 'Not Scheduled';
      case 'error': return 'Unable to load status';
      default: return 'Loading...';
    }
  };

  const getStationName = (id) => stationMap[id] || id;

  const renderTripList = (trips, direction) => {
    // Group trips by station
    const tripsByStation = new Map();
    if (trips) {
      trips.forEach(trip => {
        if (!tripsByStation.has(trip.upcoming_stop)) {
          tripsByStation.set(trip.upcoming_stop, []);
        }
        tripsByStation.get(trip.upcoming_stop).push(trip);
      });
    }

    const title = direction === 'north' ? 'Northbound' : 'Southbound';

    return (
      <div className="mb-6">
        <h3 className="font-bold text-2xl mb-4 text-gray-800 border-b-2 pb-2">{title} Trains</h3>
        {tripsByStation.size === 0 ? (
          <p className="text-gray-500 italic">No trains arriving in the next 30 mins.</p>
        ) : (
          <div className="space-y-2">
            {Array.from(tripsByStation.entries()).map(([stationId, stationTrips]) => {
              const nextStop = stationMap[stationId] || stationId;

              return (
                <div key={stationId} className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold text-gray-800 text-2xl">
                      {nextStop}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {(() => {
                      // Group trips by destination within this station
                      const tripsByDest = new Map();
                      stationTrips.forEach(trip => {
                        const dest = stationMap[trip.destination_stop] || trip.destination_stop;
                        if (!tripsByDest.has(dest)) {
                          tripsByDest.set(dest, []);
                        }
                        tripsByDest.get(dest).push(trip);
                      });

                      return Array.from(tripsByDest.entries()).map(([destination, destTrips]) => {
                        // Sort times for this destination
                        const times = destTrips
                          .map(t => Math.max(0, Math.round(t.secondsUntilArrival / 60)))
                          .sort((a, b) => a - b);

                        return (
                          <div key={destination} className="flex flex-wrap justify-between items-center bg-gray-50 p-3 rounded gap-2">
                            <div className="text-gray-700">
                              <span className="text-sm font-bold uppercase tracking-wide text-gray-400 mr-2">To</span>
                              <span className="text-xl font-semibold">{destination}</span>
                            </div>
                            <div className="flex gap-2">
                              {times.map((time, i) => (
                                <span key={i} className="text-lg font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded border border-blue-200">
                                  {time} min
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Flatten trips, deduplicate, filter, and sort geographically
  const getTrips = (direction) => {
    if (!data?.trips?.[direction]) return [];

    const now = Math.floor(Date.now() / 1000); // Use local time for countdown, or could use data.timestamp

    // Get station order for geographical sorting
    // We use the first routing as the primary order
    const stationOrder = data.actual_routings?.[direction]?.[0] || [];
    const stationIndexMap = {};
    stationOrder.forEach((stationId, index) => {
      stationIndexMap[stationId] = index;
    });

    // 1. Flatten and Deduplicate
    const uniqueTrips = new Map();
    Object.values(data.trips[direction]).flat().forEach(trip => {
      if (!uniqueTrips.has(trip.id)) {
        uniqueTrips.set(trip.id, trip);
      }
    });

    return Array.from(uniqueTrips.values())
      .map(trip => {
        const arrivalTime = trip.upcoming_stop_arrival_time;
        const secondsUntilArrival = arrivalTime - now;
        return { ...trip, secondsUntilArrival };
      })
      .filter(trip => {
        // Filter for trains arriving within 10 minutes
        if (trip.secondsUntilArrival <= -60 || trip.secondsUntilArrival > 1800) return false;

        // Filter out trains arriving at the last stop
        // Northbound: 96 St (Q05)
        // Southbound: Coney Island (D43)
        if (direction === 'north' && trip.upcoming_stop === 'Q05') return false;
        if (direction === 'south' && trip.upcoming_stop === 'D43') return false;

        // Filter for specific stops requested by user
        const INTERESTING_STOPS = [
          'D35', // Kings Highway
          'D34', // Avenue M
          'D31', // Newkirk Plaza
          'D26', // Prospect Park
          'R30', // DeKalb Av
          'Q01', // Canal St
          'R20', // 14 St - Union Sq
          'R16'  // Times Sq - 42 St
        ];

        if (!INTERESTING_STOPS.includes(trip.upcoming_stop)) return false;

        return true;
      })
      .sort((a, b) => {
        // Sort by station index (geographical order)
        const indexA = stationIndexMap[a.upcoming_stop] ?? 9999;
        const indexB = stationIndexMap[b.upcoming_stop] ?? 9999;
        return indexA - indexB;
      });
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

          {status === 'service-change' && data && (
            <div className="space-y-2 mt-2">
              {data.service_change_summaries?.both?.map((text, i) => (
                <p key={`both-${i}`} className="text-sm">{text}</p>
              ))}
              {data.service_change_summaries?.north?.map((text, i) => (
                <p key={`north-${i}`} className="text-sm">Northbound: {text}</p>
              ))}
              {data.service_change_summaries?.south?.map((text, i) => (
                <p key={`south-${i}`} className="text-sm">Southbound: {text}</p>
              ))}
            </div>
          )}

          {status === 'delays' && data && (
            <div className="space-y-2 mt-2">
              {data.service_irregularity_summaries?.north && (
                <p className="text-sm">Northbound: {data.service_irregularity_summaries.north}</p>
              )}
              {data.service_irregularity_summaries?.south && (
                <p className="text-sm">Southbound: {data.service_irregularity_summaries.south}</p>
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

      {/* Daily Log Section */}
      {trainLog && trainLog.length > 0 && (
        <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Service History</h3>
          <div className="space-y-4">
            {trainLog.map((entry, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-700">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${entry.status === 'Good Service' ? 'bg-green-100 text-green-800' :
                    entry.status === 'Service Change' ? 'bg-orange-100 text-orange-800' :
                      entry.status === 'Delays' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {entry.status}
                  </span>
                </div>
                {entry.details && entry.details.length > 0 && (
                  <ul className="list-disc list-inside text-gray-600 pl-2">
                    {entry.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 text-center">
        Data provided by goodservice.io
      </div>
    </div>
  );
};

export default QTrainTracker;

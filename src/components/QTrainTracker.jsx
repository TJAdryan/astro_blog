import React, { useState, useEffect } from 'react';
import stationMap from '../data/stations.json';

const QTrainTracker = () => {
  const [activeTab, setActiveTab] = useState('q');
  const [qStatus, setQStatus] = useState('loading');
  const [bStatus, setBStatus] = useState('loading');
  const [qData, setQData] = useState(null);
  const [bData, setBData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [bSchedule, setBSchedule] = useState({
    isWeekday: false,
    isBTime: false,
    isCurrentlyScheduled: false,
    nyDate: new Date()
  });

  // Convert current time to US Eastern (New York) Time to check B train operation hours
  const getBTrainScheduleInfo = () => {
    const nyDateString = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const nyDate = new Date(nyDateString);
    
    const day = nyDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = nyDate.getHours();
    
    const isWeekday = day >= 1 && day <= 5;
    const isBTime = hours >= 6 && hours < 23; // 6:00 AM to 10:59 PM
    
    return {
      isWeekday,
      isBTime,
      isCurrentlyScheduled: isWeekday && isBTime,
      nyDate
    };
  };

  const determineStatus = (result) => {
    if (!result) return 'inactive';
    if (result.status === 'Not Scheduled') return 'inactive';

    const hasServiceChanges = result.service_change_summaries?.both?.length > 0 ||
      result.service_change_summaries?.north?.length > 0 ||
      result.service_change_summaries?.south?.length > 0;

    const hasDelays = result.service_irregularity_summaries?.north ||
      result.service_irregularity_summaries?.south;

    if (hasServiceChanges) {
      return 'service-change';
    } else if (hasDelays) {
      return 'delays';
    } else {
      return 'good';
    }
  };

  const fetchData = async () => {
    const scheduleInfo = getBTrainScheduleInfo();
    setBSchedule(scheduleInfo);

    // Concurrently fetch Q and B train schedules
    try {
      const qResponse = await fetch('https://api.subwaynow.app/routes/Q');
      if (qResponse.ok) {
        const qResult = await qResponse.json();
        setQData(qResult);
        const s = determineStatus(qResult);
        setQStatus(s);
      } else {
        setQStatus('error');
      }
    } catch (e) {
      console.error('Error fetching Q train status:', e);
      setQStatus('error');
    }

    try {
      const bResponse = await fetch('https://api.subwaynow.app/routes/B');
      if (bResponse.ok) {
        const bResult = await bResponse.json();
        setBData(bResult);
        const s = determineStatus(bResult);
        setBStatus(s);
      } else {
        setBStatus(scheduleInfo.isCurrentlyScheduled ? 'error' : 'inactive');
      }
    } catch (e) {
      console.error('Error fetching B train status:', e);
      setBStatus(scheduleInfo.isCurrentlyScheduled ? 'error' : 'inactive');
    }

    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (statusVal) => {
    switch (statusVal) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'service-change': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delays': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (statusVal) => {
    switch (statusVal) {
      case 'good': return 'Good Service';
      case 'service-change': return 'Service Change';
      case 'delays': return 'Delays';
      case 'inactive': return 'Not Scheduled';
      case 'error': return 'Unable to load status';
      default: return 'Loading...';
    }
  };

  const getRecommendation = () => {
    if (!bSchedule.isCurrentlyScheduled) {
      return {
        choice: 'Q',
        summary: 'The Q train is your only choice.',
        reason: 'The B train does not run on weekends or late nights (only Weekdays 6:00 AM – 11:00 PM Eastern). The Q is active and ready!'
      };
    }

    if (bStatus === 'inactive') {
      return {
        choice: 'Q',
        summary: 'Take the Q train.',
        reason: 'The B train is not scheduled or currently running on this day. The Q is the reliable option.'
      };
    }

    const getScore = (statusVal) => {
      switch (statusVal) {
        case 'good': return 3;
        case 'service-change': return 2;
        case 'delays': return 1;
        case 'inactive': return 0;
        case 'error': return 0;
        default: return 0;
      }
    };

    const qScore = getScore(qStatus);
    const bScore = getScore(bStatus);

    if (qScore > bScore) {
      return {
        choice: 'Q',
        summary: 'The Q train is currently better.',
        reason: `The Q has good service while the B train is experiencing ${getStatusText(bStatus).toLowerCase()}.`
      };
    } else if (bScore > qScore) {
      return {
        choice: 'B',
        summary: 'The B train is currently better.',
        reason: `The B has good service while the Q train is experiencing ${getStatusText(qStatus).toLowerCase()}.`
      };
    } else {
      if (qStatus === 'good' && bStatus === 'good') {
        return {
          choice: 'BOTH',
          summary: 'Both trains running normally!',
          reason: 'Take the B express for a faster ride in Brooklyn (or West Side 6th Ave access), or the Q local for closer stops (or East Side Broadway access).'
        };
      } else if (qStatus === 'inactive' && bStatus === 'inactive') {
        return {
          choice: 'NONE',
          summary: 'Service unavailable.',
          reason: 'Neither train seems to be scheduled or running. Please check alternative routes.'
        };
      } else {
        return {
          choice: 'EITHER',
          summary: 'Either train (Expect disruptions).',
          reason: `Both lines are experiencing issues ("${getStatusText(qStatus)}"). Check active countdowns to catch the first incoming train.`
        };
      }
    }
  };

  // Flatten trips, deduplicate, filter, and sort geographically
  const getTrips = (routeLetter, direction) => {
    const routeData = routeLetter === 'Q' ? qData : bData;
    if (!routeData?.trips?.[direction]) return [];

    const now = Math.floor(Date.now() / 1000); 

    const stationOrder = routeData.actual_routings?.[direction]?.[0] || [];
    const stationIndexMap = {};
    stationOrder.forEach((stationId, index) => {
      stationIndexMap[stationId] = index;
    });

    const uniqueTrips = new Map();
    Object.values(routeData.trips[direction]).flat().forEach(trip => {
      if (!uniqueTrips.has(trip.id)) {
        uniqueTrips.set(trip.id, trip);
      }
    });

    let candidates = Array.from(uniqueTrips.values())
      .map(trip => {
        const arrivalTime = trip.upcoming_stop_arrival_time;
        const secondsUntilArrival = arrivalTime - now;
        return { ...trip, secondsUntilArrival };
      })
      .filter(trip => {
        if (trip.secondsUntilArrival <= -60 || trip.secondsUntilArrival > 1800) return false;

        // Terminal filtering to prevent noise
        if (routeLetter === 'Q') {
          if (direction === 'north' && trip.upcoming_stop === 'Q05') return false;
          if (direction === 'south' && trip.upcoming_stop === 'D43') return false;
        } else {
          // B train
          if (direction === 'north' && (trip.upcoming_stop === 'D03' || trip.upcoming_stop === 'D13')) return false;
          if (direction === 'south' && trip.upcoming_stop === 'D40') return false;
        }

        // Segment interesting stops by route to keep lists perfectly relevant
        const Q_STOPS = ['D35', 'D34', 'D31', 'D26', 'R30', 'Q01', 'R20', 'R16'];
        const B_STOPS = ['D35', 'D31', 'D26', 'D22', 'D17', 'D16', 'D15'];
        const interestingStops = routeLetter === 'Q' ? Q_STOPS : B_STOPS;

        if (!interestingStops.includes(trip.upcoming_stop)) return false;

        return true;
      });

    const hasNearTrains = candidates.some(t => t.secondsUntilArrival <= 540);

    if (hasNearTrains) {
      candidates = candidates.filter(t => t.secondsUntilArrival <= 540);
    }

    return candidates
      .sort((a, b) => {
        const indexA = stationIndexMap[a.upcoming_stop] ?? 9999;
        const indexB = stationIndexMap[b.upcoming_stop] ?? 9999;
        return indexA - indexB;
      });
  };

  // Get combined, sorted countdowns for shared stations in Helper
  const getQuickArrivals = (stationId, direction) => {
    const arrivals = [];
    
    if (qData) {
      const qTrips = getTrips('Q', direction).filter(t => t.upcoming_stop === stationId);
      qTrips.forEach(trip => {
        arrivals.push({
          route: 'Q',
          seconds: trip.secondsUntilArrival,
          time: Math.max(0, Math.round(trip.secondsUntilArrival / 60))
        });
      });
    }

    if (bData && bSchedule.isCurrentlyScheduled) {
      const bTrips = getTrips('B', direction).filter(t => t.upcoming_stop === stationId);
      bTrips.forEach(trip => {
        arrivals.push({
          route: 'B',
          seconds: trip.secondsUntilArrival,
          time: Math.max(0, Math.round(trip.secondsUntilArrival / 60))
        });
      });
    }

    return arrivals.sort((a, b) => a.seconds - b.seconds).slice(0, 3);
  };

  const renderTripList = (trips, direction, routeLetter) => {
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
                      const tripsByDest = new Map();
                      stationTrips.forEach(trip => {
                        const dest = stationMap[trip.destination_stop] || trip.destination_stop;
                        if (!tripsByDest.has(dest)) {
                          tripsByDest.set(dest, []);
                        }
                        tripsByDest.get(dest).push(trip);
                      });

                      return Array.from(tripsByDest.entries()).map(([destination, destTrips]) => {
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

  const rec = getRecommendation();

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* 1. MTA-Themed Switcher at the very top */}
      <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border border-gray-200">
        <button
          onClick={() => setActiveTab('q')}
          className={`flex-1 py-2 px-3 text-center text-sm font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 ${
            activeTab === 'q'
              ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-[#FCCC0A] text-black font-extrabold text-[10px] flex items-center justify-center border border-black leading-none">Q</span>
          Q Train
        </button>
        <button
          onClick={() => setActiveTab('b')}
          className={`flex-1 py-2 px-3 text-center text-sm font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 ${
            activeTab === 'b'
              ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-[#FF6319] text-white font-extrabold text-[10px] flex items-center justify-center leading-none">B</span>
          B Train
        </button>
        <button
          onClick={() => setActiveTab('helper')}
          className={`flex-1 py-2 px-3 text-center text-sm font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 ${
            activeTab === 'helper'
              ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <span>🚦</span>
          Q vs B Helper
        </button>
      </div>

      {/* 2. Q DETAIL TAB (Identical to original "Regular Q Train" page!) */}
      {activeTab === 'q' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#FCCC0A] flex items-center justify-center text-black font-bold text-2xl border-2 border-black">
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

            <div className={`p-4 rounded-lg border ${getStatusColor(qStatus)} transition-colors duration-300`}>
              <div className="font-bold text-lg mb-1">{getStatusText(qStatus)}</div>

              {qStatus === 'service-change' && qData && (
                <div className="space-y-2 mt-2">
                  {qData.service_change_summaries?.both?.map((text, i) => (
                    <p key={`both-${i}`} className="text-sm">{text}</p>
                  ))}
                  {qData.service_change_summaries?.north?.map((text, i) => (
                    <p key={`north-${i}`} className="text-sm">Northbound: {text}</p>
                  ))}
                  {qData.service_change_summaries?.south?.map((text, i) => (
                    <p key={`south-${i}`} className="text-sm">Southbound: {text}</p>
                  ))}
                </div>
              )}

              {qStatus === 'delays' && qData && (
                <div className="space-y-2 mt-2">
                  {qData.service_irregularity_summaries?.north && (
                    <p className="text-sm">Northbound: {qData.service_irregularity_summaries.north}</p>
                  )}
                  {qData.service_irregularity_summaries?.south && (
                    <p className="text-sm">Southbound: {qData.service_irregularity_summaries.south}</p>
                  )}
                </div>
              )}

              {qStatus === 'good' && (
                <p className="text-sm">Service is running on or close to schedule.</p>
              )}
            </div>
          </div>

          {/* Active Q Trains List */}
          {qData && (
            <div className="space-y-6">
              {renderTripList(getTrips('Q', 'north'), 'north', 'Q')}
              {renderTripList(getTrips('Q', 'south'), 'south', 'Q')}
            </div>
          )}
        </div>
      )}

      {/* 3. B DETAIL TAB (Styled identically to the Q, but for B!) */}
      {activeTab === 'b' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#FF6319] flex items-center justify-center text-white font-bold text-2xl border-2 border-white">
                  B
                </div>
              </div>
              <div>
                <div className="text-xl font-medium text-black">B Train Status</div>
                <p className="text-gray-500 text-sm">
                  {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Checking...'}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${getStatusColor(bStatus)} transition-colors duration-300`}>
              <div className="font-bold text-lg mb-1">{getStatusText(bStatus)}</div>

              {!bSchedule.isCurrentlyScheduled && (
                <p className="text-sm mt-1">The B train operates only on weekdays (Monday – Friday) between 6:00 AM and 11:00 PM Eastern Time.</p>
              )}

              {bStatus === 'service-change' && bData && (
                <div className="space-y-2 mt-2">
                  {bData.service_change_summaries?.both?.map((text, i) => (
                    <p key={`both-${i}`} className="text-sm">{text}</p>
                  ))}
                  {bData.service_change_summaries?.north?.map((text, i) => (
                    <p key={`north-${i}`} className="text-sm">Northbound: {text}</p>
                  ))}
                  {bData.service_change_summaries?.south?.map((text, i) => (
                    <p key={`south-${i}`} className="text-sm">Southbound: {text}</p>
                  ))}
                </div>
              )}

              {bStatus === 'delays' && bData && (
                <div className="space-y-2 mt-2">
                  {bData.service_irregularity_summaries?.north && (
                    <p className="text-sm">Northbound: {bData.service_irregularity_summaries.north}</p>
                  )}
                  {bData.service_irregularity_summaries?.south && (
                    <p className="text-sm">Southbound: {bData.service_irregularity_summaries.south}</p>
                  )}
                </div>
              )}

              {bStatus === 'good' && (
                <p className="text-sm">Service is running on or close to schedule.</p>
              )}
            </div>
          </div>

          {/* Active B Trains List */}
          {bData && bSchedule.isCurrentlyScheduled && (
            <div className="space-y-6">
              {renderTripList(getTrips('B', 'north'), 'north', 'B')}
              {renderTripList(getTrips('B', 'south'), 'south', 'B')}
            </div>
          )}
        </div>
      )}

      {/* 4. HELPER TAB (Commuter Decision Assistant) */}
      {activeTab === 'helper' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Smart Recommendation Card */}
          <div className={`p-5 rounded-xl border-2 bg-gradient-to-br from-white to-gray-50 shadow-md flex flex-col md:flex-row gap-4 items-start transition-all duration-300 ${
            rec.choice === 'Q' ? 'border-[#FCCC0A] shadow-[0_0_15px_rgba(252,204,10,0.1)]' :
            rec.choice === 'B' ? 'border-[#FF6319] shadow-[0_0_15px_rgba(255,99,25,0.1)]' :
            rec.choice === 'BOTH' ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
            'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
          }`}>
            <div className="flex-shrink-0 flex items-center space-x-1 bg-white p-2 rounded-lg border border-gray-200/50 shadow-inner">
              {rec.choice === 'Q' || rec.choice === 'BOTH' || rec.choice === 'EITHER' ? (
                <span className="w-10 h-10 rounded-full bg-[#FCCC0A] text-black font-extrabold text-xl flex items-center justify-center border-2 border-black">Q</span>
              ) : null}
              {rec.choice === 'B' || rec.choice === 'BOTH' || rec.choice === 'EITHER' ? (
                <span className="w-10 h-10 rounded-full bg-[#FF6319] text-white font-extrabold text-xl flex items-center justify-center border-2 border-white">B</span>
              ) : null}
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Brighton Line Assistant</span>
              <h2 className="text-lg font-black text-gray-800">{rec.summary}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{rec.reason}</p>
            </div>
          </div>

          {/* Quick Line Comparison Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Q Line Card */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-[#FCCC0A] text-black font-extrabold flex items-center justify-center border border-black text-sm">Q</span>
                <span className="font-bold text-gray-800 text-sm">Broadway Local / Exp</span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${getStatusColor(qStatus)}`}>
                {getStatusText(qStatus)}
              </div>
            </div>

            {/* B Line Card */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-[#FF6319] text-white font-extrabold flex items-center justify-center text-sm">B</span>
                <span className="font-bold text-gray-800 text-sm">6th Av Express</span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${getStatusColor(bStatus)}`}>
                {getStatusText(bStatus)}
              </div>
            </div>
          </div>

          {/* Quick Shared Stations Countdown (The Brighton Line Race!) */}
          {bSchedule.isCurrentlyScheduled && bStatus !== 'inactive' && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-md font-extrabold text-gray-800 mb-4 flex items-center justify-between">
                <span>⏱️ Brighton Line Race</span>
                <span className="text-xs font-normal text-gray-400">Next Arrivals</span>
              </h3>
              
              <div className="space-y-4">
                {/* Station 1: Kings Highway */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gray-600">Kings Hwy (Southbound)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {getQuickArrivals('D35', 'south').length === 0 ? (
                      <span className="text-xs text-gray-400 italic">No incoming trains</span>
                    ) : (
                      getQuickArrivals('D35', 'south').map((arr, idx) => (
                        <span key={idx} className="flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 bg-gray-50 rounded border border-gray-200">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black leading-none ${
                            arr.route === 'Q' ? 'bg-[#FCCC0A] text-black border border-black' : 'bg-[#FF6319] text-white'
                          }`}>{arr.route}</span>
                          <span className="text-gray-700">{arr.time}m</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Station 2: Prospect Park */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gray-600">Prospect Park (Northbound)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {getQuickArrivals('D26', 'north').length === 0 ? (
                      <span className="text-xs text-gray-400 italic">No incoming trains</span>
                    ) : (
                      getQuickArrivals('D26', 'north').map((arr, idx) => (
                        <span key={idx} className="flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 bg-gray-50 rounded border border-gray-200">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black leading-none ${
                            arr.route === 'Q' ? 'bg-[#FCCC0A] text-black border border-black' : 'bg-[#FF6319] text-white'
                          }`}>{arr.route}</span>
                          <span className="text-gray-700">{arr.time}m</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Classic Footer Actions & Logo Credit */}
      <div className="pt-2 text-center space-y-4">
        <p className="text-xs text-gray-400">
          {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()} NY Time` : 'Checking...'}
        </p>
        
        <div className="text-center pt-2">
          <a
            href="/q-train-history"
            className="inline-flex items-center justify-center px-4 py-2 border border-blue-200 text-base font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Service History Log
          </a>
        </div>

        <div className="text-xs text-gray-400 pt-1">
          Data provided by goodservice.io
        </div>
      </div>
    </div>
  );
};

export default QTrainTracker;

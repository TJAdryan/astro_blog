import React, { useState, useEffect } from 'react';
import stationMap from '../data/stations.json';
const getWeatherDetails = (code) => {
  switch (code) {
    case 0: return { label: 'Clear Sky', emoji: '☀️', bgClass: 'from-amber-50 to-orange-50/20 border-amber-200 dark:from-amber-950/20 dark:to-orange-950/10 dark:border-amber-900/40 text-amber-800 dark:text-amber-300' };
    case 1: return { label: 'Mainly Clear', emoji: '🌤️', bgClass: 'from-sky-50 to-amber-50/20 border-sky-150 dark:from-sky-950/20 dark:to-amber-950/10 dark:border-sky-900/40 text-sky-800 dark:text-sky-300' };
    case 2: return { label: 'Partly Cloudy', emoji: '⛅', bgClass: 'from-slate-50 to-sky-50/20 border-slate-200 dark:from-slate-900/30 dark:to-sky-950/10 dark:border-slate-800 text-slate-800 dark:text-slate-300' };
    case 3: return { label: 'Overcast', emoji: '☁️', bgClass: 'from-slate-100 to-slate-50/50 border-slate-200 dark:from-slate-800/40 dark:to-slate-900/30 dark:border-slate-800 text-slate-700 dark:text-slate-300' };
    case 45:
    case 48: return { label: 'Foggy', emoji: '🌫️', bgClass: 'from-zinc-100 to-zinc-50 border-zinc-200 dark:from-zinc-800/40 dark:to-zinc-900/30 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300' };
    case 51:
    case 53:
    case 55: return { label: 'Drizzle', emoji: '🌧️', bgClass: 'from-cyan-50 to-slate-50 border-cyan-200 dark:from-cyan-950/20 dark:to-slate-900/10 dark:border-cyan-900/40 text-cyan-800 dark:text-cyan-300' };
    case 56:
    case 57: return { label: 'Freezing Drizzle', emoji: '🌧️❄️', bgClass: 'from-cyan-100 to-blue-50 border-cyan-300 dark:from-cyan-900/30 dark:to-blue-950/20 dark:border-cyan-800/60 text-cyan-900 dark:text-cyan-200' };
    case 61:
    case 63:
    case 65: return { label: 'Rain', emoji: '🌧️', bgClass: 'from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950/20 dark:to-cyan-950/10 dark:border-blue-900/40 text-blue-800 dark:text-blue-300' };
    case 66:
    case 67: return { label: 'Freezing Rain', emoji: '🌧️❄️', bgClass: 'from-blue-100 to-indigo-50 border-blue-300 dark:from-blue-900/30 dark:to-indigo-950/20 dark:border-blue-800/60 text-blue-950 dark:text-blue-200' };
    case 71:
    case 73:
    case 75: return { label: 'Snowfall', emoji: '❄️', bgClass: 'from-indigo-50 to-sky-50 border-indigo-200 dark:from-indigo-950/20 dark:to-sky-950/10 dark:border-indigo-900/40 text-indigo-800 dark:text-indigo-300' };
    case 77: return { label: 'Snow Grains', emoji: '❄️', bgClass: 'from-indigo-50 to-sky-50 border-indigo-200 dark:from-indigo-950/20 dark:to-sky-950/10 dark:border-indigo-900/40 text-indigo-800 dark:text-indigo-300' };
    case 80:
    case 81:
    case 82: return { label: 'Rain Showers', emoji: '🌧️', bgClass: 'from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950/20 dark:to-cyan-950/10 dark:border-blue-900/40 text-blue-800 dark:text-blue-300' };
    case 85:
    case 86: return { label: 'Snow Showers', emoji: '❄️', bgClass: 'from-indigo-50 to-sky-50 border-indigo-200 dark:from-indigo-950/20 dark:to-sky-950/10 dark:border-indigo-900/40 text-indigo-800 dark:text-indigo-300' };
    case 95:
    case 96:
    case 99: return { label: 'Thunderstorm', emoji: '⛈️', bgClass: 'from-purple-50 to-slate-50 border-purple-200 dark:from-purple-950/20 dark:to-slate-900/10 dark:border-purple-900/40 text-purple-800 dark:text-purple-300' };
    default: return { label: 'Weather', emoji: '🌤️', bgClass: 'from-slate-50 to-blue-50/20 border-slate-200 dark:from-slate-900/30 dark:to-blue-950/10 dark:border-slate-800 text-slate-800 dark:text-slate-300' };
  }
};

const getCommuteAdvisory = (code, tempMax, tempMin) => {
  if (code === 95 || code === 96 || code === 99) {
    return "⛈️ Storms ahead. Expect potential platform dampness and delays. Keep an eye on status changes!";
  }
  if ([71, 73, 75, 77, 85, 86].includes(code) || [56, 57, 66, 67].includes(code)) {
    return "❄️ Snow or freezing precipitation. Brighton Line runs outdoors; expect ice delays. Dress warmly!";
  }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return "🌧️ Rainy conditions. Platforms might be slippery. Don't forget your umbrella!";
  }
  if (tempMax >= 90) {
    return "🔥 High temperatures. Subway platforms will feel extra hot. Stay hydrated!";
  }
  if (tempMin <= 32) {
    return "🥶 Freezing commute. Wrap up warmly while waiting on outdoor Brighton Line platforms.";
  }
  return "✨ Excellent weather for your commute. Enjoy the walk to your station!";
};

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
  const [weatherData, setWeatherData] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState('loading');

  // Convert current time to US Eastern (New York) Time to check B train operation hours
  const getBTrainScheduleInfo = () => {
    try {
      const now = new Date();
      
      // Use Intl.DateTimeFormat to robustly get the short weekday ("Mon", "Tue", etc.) in NY timezone
      const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short"
      });
      const weekday = weekdayFormatter.format(now);
      
      // Use Intl.DateTimeFormat to robustly get the 24-hour hour in NY timezone
      const hourFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        hour12: false
      });
      const hour = parseInt(hourFormatter.format(now), 10);
      
      const isWeekday = weekday !== 'Sat' && weekday !== 'Sun';
      const isBTime = !isNaN(hour) && hour >= 6 && hour < 22; // B train only operates 6:00 AM to 9:59 PM (inactive after 10:00 PM)
      
      return {
        isWeekday,
        isBTime,
        isCurrentlyScheduled: isWeekday && isBTime,
        nyDate: now
      };
    } catch (e) {
      console.error('Error calculating B train schedule (falling back to Q only):', e);
      // Graceful fallback to prevent script crashes on any environment
      return {
        isWeekday: false,
        isBTime: false,
        isCurrentlyScheduled: false,
        nyDate: new Date()
      };
    }
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

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=40.6782&longitude=-73.9442&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=America/New_York&forecast_days=3'
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        setWeatherStatus('success');
      } else {
        setWeatherStatus('error');
      }
    } catch (e) {
      console.error('Error fetching weather:', e);
      setWeatherStatus('error');
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
    fetchWeather();
    const interval = setInterval(() => {
      fetchData();
      fetchWeather();
    }, 60000); // Refresh every minute
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
    const tripsForDir = routeData.trips[direction];
    if (tripsForDir && typeof tripsForDir === 'object') {
      Object.values(tripsForDir).flat().forEach(trip => {
        if (trip && trip.id && !uniqueTrips.has(trip.id)) {
          uniqueTrips.set(trip.id, trip);
        }
      });
    }

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

  // If B train is not currently scheduled to run, hide the switcher and force tab to Q
  const isBActive = bSchedule.isCurrentlyScheduled;
  const currentTab = isBActive ? activeTab : 'q';

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* 1. MTA-Themed Switcher at the very top (only shown when B train is scheduled to run) */}
      {isBActive && (
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
      )}

      {/* 2. Q DETAIL TAB (Identical to original "Regular Q Train" page!) */}
      {currentTab === 'q' && (
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
      {currentTab === 'b' && (
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
      {currentTab === 'helper' && (
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

      {/* 4.5. 3-Day Commute Weather Widget */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-lg text-gray-800 dark:text-white flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
          <span>🌤️ 3-Day Commute Weather</span>
          <span className="text-xs font-semibold text-gray-400">Brooklyn Forecast</span>
        </h3>

        {weatherStatus === 'loading' && (
          <div className="text-center py-6 text-gray-500 dark:text-slate-400 text-sm">
            Loading weather forecast...
          </div>
        )}

        {weatherStatus === 'error' && (
          <div className="text-center py-6 text-red-500 dark:text-red-400 text-sm">
            ⚠️ Unable to load weather forecast.
          </div>
        )}

        {weatherStatus === 'success' && weatherData && (
          <div className="space-y-4">
            {/* The 3 Columns Grid */}
            <div className="grid grid-cols-3 gap-3">
              {weatherData.daily.time.map((time, index) => {
                const dateObj = new Date(time + 'T00:00:00');
                const dayLabel = index === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                
                const weatherCode = weatherData.daily.weather_code[index];
                const tempMax = Math.round(weatherData.daily.temperature_2m_max[index]);
                const tempMin = Math.round(weatherData.daily.temperature_2m_min[index]);
                const rainProb = Math.round(weatherData.daily.precipitation_probability_max[index]);
                
                const details = getWeatherDetails(weatherCode);

                return (
                  <div key={time} className={`p-3 rounded-xl border flex flex-col items-center text-center justify-between bg-gradient-to-b ${details.bgClass} shadow-sm transition-transform hover:scale-[1.02]`}>
                    <div className="font-bold text-[10px] uppercase tracking-wide opacity-80">
                      {dayLabel}
                    </div>
                    <div className="text-3xl my-2" title={details.label}>
                      {details.emoji}
                    </div>
                    <div className="space-y-1">
                      <div className="font-black text-sm">
                        {tempMax}° <span className="opacity-50 font-medium text-xs">/ {tempMin}°</span>
                      </div>
                      <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-0.5">
                        <span>💧</span> {rainProb}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Commute Advisory Banner */}
            {(() => {
              const todayCode = weatherData.daily.weather_code[0];
              const todayMax = weatherData.daily.temperature_2m_max[0];
              const todayMin = weatherData.daily.temperature_2m_min[0];
              const advisory = getCommuteAdvisory(todayCode, todayMax, todayMin);

              return (
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2.5 shadow-inner">
                  <div className="flex-1 animate-fadeIn">
                    <span className="font-bold text-slate-800 dark:text-white block mb-0.5">Commute Guide</span>
                    {advisory}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

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

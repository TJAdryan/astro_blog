import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import stationMap from '../data/stations.json';
import {
  BRIGHTON_STATIONS,
  MANHATTAN_Q_STATIONS,
  MANHATTAN_B_STATIONS,
  STATION_BY_ID,
  DEFAULT_STATION_ID,
} from '../data/brightonStations.js';

const STORAGE_KEYS = {
  station: 'brighton_selected_station',
  favorites: 'brighton_favorite_stations',
  direction: 'brighton_direction_filter',
  tempUnit: 'brighton_temp_unit',
};

const ROUTE_COLORS = {
  Q: 'bg-[#FCCC0A] text-black border border-black/80',
  B: 'bg-[#FF6319] text-white border border-orange-600/40',
  N: 'bg-[#FCCC0A] text-black border border-black/80',
  R: 'bg-[#FCCC0A] text-black border border-black/80',
  W: 'bg-[#FCCC0A] text-black border border-black/80',
  D: 'bg-[#FF6319] text-white',
  F: 'bg-[#FF6319] text-white',
  M: 'bg-[#FF6319] text-white',
  A: 'bg-[#2850AD] text-white',
  C: 'bg-[#2850AD] text-white',
  E: 'bg-[#2850AD] text-white',
  S: 'bg-[#808183] text-white',
};

const getRouteBulletClass = (routeId) =>
  ROUTE_COLORS[routeId] || 'bg-slate-600 text-white';

const formatNyTime = (dateOrEpoch, { isEpoch = false, includeSeconds = false } = {}) => {
  try {
    const date = isEpoch ? new Date(dateOrEpoch * 1000) : dateOrEpoch;
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      ...(includeSeconds ? { second: '2-digit' } : {}),
    }).format(date);
  } catch {
    return '';
  }
};

const safeReadStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? raw : fallback;
  } catch {
    return fallback;
  }
};

const safeWriteStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or private browsing errors
  }
};

const getWeatherDetails = (code) => {
  switch (code) {
    case 0: return { label: 'Clear Sky', emoji: '☀️', bgClass: 'from-amber-50 to-orange-50/20 border-amber-200 dark:from-amber-950/20 dark:to-orange-950/10 dark:border-amber-900/40 text-amber-800 dark:text-amber-300' };
    case 1: return { label: 'Mainly Clear', emoji: '🌤️', bgClass: 'from-sky-50 to-amber-50/20 border-sky-200 dark:from-sky-950/20 dark:to-amber-950/10 dark:border-sky-900/40 text-sky-800 dark:text-sky-300' };
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
    return '⛈️ Storms ahead. Brighton Line platforms are outdoors south of Prospect Park — expect dampness and potential delays.';
  }
  if ([71, 73, 75, 77, 85, 86].includes(code) || [56, 57, 66, 67].includes(code)) {
    return '❄️ Snow or freezing precipitation. Most of the Brighton Line runs outdoors; expect ice delays and dress warmly!';
  }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return "🌧️ Rainy conditions. Open-cut and elevated Brighton Line platforms may be slick. Don't forget an umbrella!";
  }
  if (tempMax >= 32) {
    return '🔥 Hot day ahead. Outdoor and underground platforms will feel extra warm. Stay hydrated!';
  }
  if (tempMin <= 0) {
    return '🥶 Freezing commute. Bundle up while waiting on outdoor Brighton Line platforms.';
  }
  return '✨ Great weather for your commute. Enjoy the walk to your station!';
};

const getBTrainScheduleInfo = () => {
  try {
    const now = new Date();
    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
    }).format(now);
    const hour = parseInt(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hour12: false,
      }).format(now),
      10
    );

    const isWeekday = weekday !== 'Sat' && weekday !== 'Sun';
    const isBTime = !Number.isNaN(hour) && hour >= 6 && hour < 23;
    return {
      isWeekday,
      isBTime,
      isCurrentlyScheduled: isWeekday && isBTime,
    };
  } catch {
    return { isWeekday: false, isBTime: false, isCurrentlyScheduled: false };
  }
};

const determineStatus = (result) => {
  if (!result) return 'inactive';
  if (result.status === 'Not Scheduled' || result.scheduled === false) return 'inactive';

  const hasServiceChanges =
    result.service_change_summaries?.both?.length > 0 ||
    result.service_change_summaries?.north?.length > 0 ||
    result.service_change_summaries?.south?.length > 0;

  const hasDelays =
    Boolean(result.service_irregularity_summaries?.north) ||
    Boolean(result.service_irregularity_summaries?.south) ||
    Boolean(result.delay_summaries?.north) ||
    Boolean(result.delay_summaries?.south);

  if (hasServiceChanges) return 'service-change';
  if (hasDelays) return 'delays';
  return 'good';
};

const getStatusBadgeClasses = (statusVal) => {
  switch (statusVal) {
    case 'good':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/70';
    case 'service-change':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/70';
    case 'delays':
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/70';
    case 'inactive':
      return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/70';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  }
};

const getStatusText = (statusVal) => {
  switch (statusVal) {
    case 'good': return 'Good Service';
    case 'service-change': return 'Service Change';
    case 'delays': return 'Delays';
    case 'inactive': return 'Off-Hours';
    case 'error': return 'Unavailable';
    default: return 'Checking...';
  }
};

const collectRouteAlerts = (routeData, routeLetter) => {
  if (!routeData) return [];
  const alerts = [];

  (routeData.service_change_summaries?.both || []).forEach((text) =>
    alerts.push({ route: routeLetter, kind: 'change', dir: 'Both Directions', text })
  );
  (routeData.service_change_summaries?.north || []).forEach((text) =>
    alerts.push({ route: routeLetter, kind: 'change', dir: 'Northbound', text })
  );
  (routeData.service_change_summaries?.south || []).forEach((text) =>
    alerts.push({ route: routeLetter, kind: 'change', dir: 'Southbound', text })
  );

  if (routeData.delay_summaries?.north) {
    alerts.push({ route: routeLetter, kind: 'delay', dir: 'Northbound', text: routeData.delay_summaries.north });
  }
  if (routeData.delay_summaries?.south) {
    alerts.push({ route: routeLetter, kind: 'delay', dir: 'Southbound', text: routeData.delay_summaries.south });
  }
  if (routeData.service_irregularity_summaries?.north) {
    alerts.push({ route: routeLetter, kind: 'delay', dir: 'Northbound', text: routeData.service_irregularity_summaries.north });
  }
  if (routeData.service_irregularity_summaries?.south) {
    alerts.push({ route: routeLetter, kind: 'delay', dir: 'Southbound', text: routeData.service_irregularity_summaries.south });
  }

  return alerts;
};

const normalizeStopTrips = (stopData, direction, allowedRoutes, nowSec) => {
  const rawTrips = stopData?.upcoming_trips?.[direction];
  if (!Array.isArray(rawTrips)) return [];

  const seen = new Set();
  const list = [];

  for (const trip of rawTrips) {
    if (!trip || !trip.id || seen.has(trip.id)) continue;
    if (allowedRoutes && !allowedRoutes.has(trip.route_id)) continue;

    const arrivalEpoch =
      trip.estimated_current_stop_arrival_time ??
      trip.current_stop_arrival_time ??
      trip.estimated_upcoming_stop_arrival_time ??
      trip.upcoming_stop_arrival_time;

    if (!arrivalEpoch) continue;
    const secondsUntil = arrivalEpoch - nowSec;
    if (secondsUntil < -30) continue;

    seen.add(trip.id);
    list.push({
      id: trip.id,
      route: trip.route_id,
      destinationStop: trip.destination_stop,
      destinationName: stationMap[trip.destination_stop] || trip.destination_stop || 'Unknown',
      upcomingStop: trip.upcoming_stop,
      upcomingStopName: stationMap[trip.upcoming_stop] || trip.upcoming_stop || null,
      previousStop: trip.previous_stop,
      arrivalEpoch,
      secondsUntil,
      minutes: Math.max(0, Math.round(secondsUntil / 60)),
      isDelayed: Boolean(trip.is_delayed || (trip.delayed_time && trip.delayed_time >= 120)),
      isAssigned: trip.is_assigned !== false,
    });
  }

  return list.sort((a, b) => a.arrivalEpoch - b.arrivalEpoch);
};

const QTrainTracker = () => {
  const [activeTab, setActiveTab] = useState('station'); // 'station' | 'map' | 'helper'
  const [selectedStationId, setSelectedStationId] = useState(DEFAULT_STATION_ID);
  const [favorites, setFavorites] = useState([]);
  const [directionFilter, setDirectionFilter] = useState('both'); // 'both' | 'north' | 'south'
  const [showAllLines, setShowAllLines] = useState(false);
  const [alertsExpanded, setAlertsExpanded] = useState(false);

  const [qStatus, setQStatus] = useState('loading');
  const [bStatus, setBStatus] = useState('loading');
  const [qData, setQData] = useState(null);
  const [bData, setBData] = useState(null);
  const [bSchedule, setBSchedule] = useState({
    isWeekday: false,
    isBTime: false,
    isCurrentlyScheduled: false,
  });

  const [stopData, setStopData] = useState(null);
  const [stopStatus, setStopStatus] = useState('loading');
  const [helperStopData, setHelperStopData] = useState(null);
  const [helperStopId, setHelperStopId] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [weatherData, setWeatherData] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState('loading');
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);
  const [tempUnit, setTempUnit] = useState('C');

  const prefsReadyRef = useRef(false);
  const stopAbortRef = useRef(null);

  const selectedStation = STATION_BY_ID[selectedStationId] || STATION_BY_ID[DEFAULT_STATION_ID];
  const isBActive = bData
    ? bData.scheduled !== false && bStatus !== 'inactive'
    : bSchedule.isCurrentlyScheduled;

  // Hydrate saved user preferences + URL ?station= on client mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlStation = params.get('station');
    const savedStation = safeReadStorage(STORAGE_KEYS.station, null);
    const savedFavsRaw = safeReadStorage(STORAGE_KEYS.favorites, '[]');
    const savedDir = safeReadStorage(STORAGE_KEYS.direction, 'both');
    const savedUnit = safeReadStorage(STORAGE_KEYS.tempUnit, 'C');

    if (urlStation && STATION_BY_ID[urlStation]) {
      setSelectedStationId(urlStation);
    } else if (savedStation && STATION_BY_ID[savedStation]) {
      setSelectedStationId(savedStation);
    }

    try {
      const parsed = JSON.parse(savedFavsRaw);
      if (Array.isArray(parsed)) {
        setFavorites(parsed.filter((id) => Boolean(STATION_BY_ID[id])).slice(0, 5));
      }
    } catch {
      // Ignore malformed stored favorites
    }

    if (['both', 'north', 'south'].includes(savedDir)) {
      setDirectionFilter(savedDir);
    }
    if (['C', 'F'].includes(savedUnit)) {
      setTempUnit(savedUnit);
    }

    prefsReadyRef.current = true;
  }, []);

  // Persist selected station + sync bookmarkable URL param
  useEffect(() => {
    if (!prefsReadyRef.current) return;
    safeWriteStorage(STORAGE_KEYS.station, selectedStationId);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('station', selectedStationId);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore history API restrictions
    }
  }, [selectedStationId]);

  useEffect(() => {
    if (!prefsReadyRef.current) return;
    safeWriteStorage(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!prefsReadyRef.current) return;
    safeWriteStorage(STORAGE_KEYS.direction, directionFilter);
  }, [directionFilter]);

  useEffect(() => {
    if (!prefsReadyRef.current) return;
    safeWriteStorage(STORAGE_KEYS.tempUnit, tempUnit);
  }, [tempUnit]);

  const formatTemp = (celsiusVal) => {
    if (tempUnit === 'F') return Math.round(celsiusVal * 1.8 + 32);
    return Math.round(celsiusVal);
  };

  const fetchWeather = useCallback(async () => {
    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=40.6782&longitude=-73.9442&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/New_York&forecast_days=3'
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
  }, []);

  const fetchRouteData = useCallback(async () => {
    const scheduleInfo = getBTrainScheduleInfo();
    setBSchedule(scheduleInfo);

    const [qRes, bRes] = await Promise.allSettled([
      fetch('https://api.subwaynow.app/routes/Q'),
      fetch('https://api.subwaynow.app/routes/B'),
    ]);

    if (qRes.status === 'fulfilled' && qRes.value.ok) {
      try {
        const qResult = await qRes.value.json();
        setQData(qResult);
        setQStatus(determineStatus(qResult));
      } catch {
        setQStatus('error');
      }
    } else {
      setQStatus('error');
    }

    if (bRes.status === 'fulfilled' && bRes.value.ok) {
      try {
        const bResult = await bRes.value.json();
        setBData(bResult);
        setBStatus(determineStatus(bResult));
      } catch {
        setBStatus(scheduleInfo.isCurrentlyScheduled ? 'error' : 'inactive');
      }
    } else {
      setBStatus(scheduleInfo.isCurrentlyScheduled ? 'error' : 'inactive');
    }

    setLastUpdated(new Date());
  }, []);

  const fetchStopData = useCallback(async (stationId) => {
    if (stopAbortRef.current) {
      stopAbortRef.current.abort();
    }
    const controller = new AbortController();
    stopAbortRef.current = controller;
    setStopStatus('loading');

    try {
      const res = await fetch(`https://api.subwaynow.app/stops/${stationId}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setStopData(json);
      setStopStatus('success');
      setLastUpdated(new Date());
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error(`Error fetching stop ${stationId}:`, err);
      setStopStatus('error');
    }
  }, []);

  // Determine which express station to show in the Q vs B Helper Race
  const raceStationId = useMemo(() => {
    if (selectedStation.corridor === 'brighton' && selectedStation.express) {
      return selectedStation.id;
    }
    if (selectedStation.nearestExpressNorth) {
      return selectedStation.nearestExpressNorth;
    }
    return 'D26'; // Prospect Park fallback for Manhattan stops
  }, [selectedStation]);

  // Fetch helper express station if different from selected station when on helper tab
  useEffect(() => {
    if (activeTab !== 'helper') return;
    if (raceStationId === selectedStationId) {
      setHelperStopId(selectedStationId);
      setHelperStopData(stopData);
      return;
    }

    let cancelled = false;
    fetch(`https://api.subwaynow.app/stops/${raceStationId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json) {
          setHelperStopId(raceStationId);
          setHelperStopData(json);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [activeTab, raceStationId, selectedStationId, stopData]);

  // Initial load & 60s refresh interval
  useEffect(() => {
    fetchRouteData();
    fetchWeather();

    const interval = setInterval(() => {
      fetchRouteData();
      fetchWeather();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchRouteData, fetchWeather]);

  // Fetch stop arrivals whenever selectedStationId changes + every 60s
  useEffect(() => {
    setShowAllLines(false);
    fetchStopData(selectedStationId);

    const interval = setInterval(() => {
      fetchStopData(selectedStationId);
    }, 60000);

    return () => {
      clearInterval(interval);
      if (stopAbortRef.current) stopAbortRef.current.abort();
    };
  }, [selectedStationId, fetchStopData]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchRouteData(), fetchStopData(selectedStationId)]);
    setIsRefreshing(false);
  };

  const handleSelectStation = (stationId, switchToBoard = false) => {
    if (!STATION_BY_ID[stationId]) return;
    setSelectedStationId(stationId);
    if (switchToBoard) setActiveTab('station');
  };

  const toggleFavorite = (stationId) => {
    setFavorites((prev) => {
      if (prev.includes(stationId)) {
        return prev.filter((id) => id !== stationId);
      }
      return [stationId, ...prev].slice(0, 5);
    });
  };

  // All active service alerts across Q and B
  const allAlerts = useMemo(() => {
    const qAlerts = collectRouteAlerts(qData, 'Q');
    const bAlerts = isBActive ? collectRouteAlerts(bData, 'B') : [];
    return [...qAlerts, ...bAlerts];
  }, [qData, bData, isBActive]);

  // Auto-open alerts strip once if active disruptions exist on initial load
  const autoOpenedAlertsRef = useRef(false);
  useEffect(() => {
    if (!autoOpenedAlertsRef.current && allAlerts.length > 0) {
      setAlertsExpanded(true);
      autoOpenedAlertsRef.current = true;
    }
  }, [allAlerts.length]);

  // Stations affected by long headways or delays (for Line Map indicators & station warning)
  const affectedStations = useMemo(() => {
    const set = new Set();
    const scanRoute = (routeData) => {
      if (!routeData) return;
      ['north', 'south'].forEach((dir) => {
        (routeData.service_irregularities?.[dir] || []).forEach((item) => {
          (item.stations_affected || []).forEach((id) => set.add(id));
        });
        (routeData.long_headway_sections?.[dir] || []).forEach((sec) => {
          if (sec.begin) set.add(sec.begin);
          if (sec.end) set.add(sec.end);
        });
        (routeData.delayed_sections?.[dir] || []).forEach((sec) => {
          if (sec.begin) set.add(sec.begin);
          if (sec.end) set.add(sec.end);
        });
      });
    };
    scanRoute(qData);
    if (isBActive) scanRoute(bData);
    return set;
  }, [qData, bData, isBActive]);

  // Map live trains along the 20-stop Brighton corridor from /routes/Q and /routes/B
  const liveCorridorTrains = useMemo(() => {
    const byStation = {};
    const addRouteTrips = (routeData, routeLetter) => {
      if (!routeData?.trips) return;
      ['north', 'south'].forEach((dir) => {
        const dirTrips = routeData.trips[dir];
        if (!dirTrips || typeof dirTrips !== 'object') return;
        const seen = new Set();
        Object.values(dirTrips)
          .flat()
          .forEach((trip) => {
            if (!trip || !trip.id || seen.has(trip.id)) return;
            seen.add(trip.id);
            const stopId = trip.upcoming_stop;
            if (!stopId) return;
            if (!byStation[stopId]) {
              byStation[stopId] = { QN: 0, QS: 0, BN: 0, BS: 0 };
            }
            const key = `${routeLetter}${dir === 'north' ? 'N' : 'S'}`;
            byStation[stopId][key] += 1;
          });
      });
    };
    addRouteTrips(qData, 'Q');
    if (isBActive) addRouteTrips(bData, 'B');
    return byStation;
  }, [qData, bData, isBActive]);

  // Compute other non-Q/B routes available at this stop (e.g., N, R, W at Union Sq or D, F, M at Herald Sq)
  const otherRoutesAtStop = useMemo(() => {
    if (!stopData?.upcoming_trips) return [];
    const routes = new Set();
    ['north', 'south'].forEach((dir) => {
      (stopData.upcoming_trips[dir] || []).forEach((t) => {
        if (t?.route_id && t.route_id !== 'Q' && t.route_id !== 'B') {
          routes.add(t.route_id);
        }
      });
    });
    return Array.from(routes).sort();
  }, [stopData]);

  // Parse upcoming arrivals for selected station
  const nowSec = Math.floor(Date.now() / 1000);
  const allowedRoutes = showAllLines ? null : new Set(['Q', 'B']);
  const northArrivals = useMemo(
    () => normalizeStopTrips(stopData, 'north', allowedRoutes, nowSec).slice(0, 5),
    [stopData, showAllLines, lastUpdated]
  );
  const southArrivals = useMemo(
    () => normalizeStopTrips(stopData, 'south', allowedRoutes, nowSec).slice(0, 5),
    [stopData, showAllLines, lastUpdated]
  );

  const isManhattanStop = selectedStation.corridor !== 'brighton';
  const dirLabels = isManhattanStop
    ? { north: 'Uptown / Bronx', south: 'Brooklyn-bound (Brighton)' }
    : { north: 'Manhattan-bound', south: 'Coney Island / Brighton Beach' };

  const getRecommendation = () => {
    if (!isBActive) {
      return {
        choice: 'Q',
        summary: 'Take the Q train (B is off-hours).',
        reason:
          'The B train runs weekdays roughly 6:00 AM – 10:30 PM ET (excluding weekends and MTA holidays). The Q runs local along the entire Brighton Line 24/7.',
      };
    }

    const scoreOf = (statusVal) => {
      switch (statusVal) {
        case 'good': return 3;
        case 'service-change': return 2;
        case 'delays': return 1;
        default: return 0;
      }
    };

    const qScore = scoreOf(qStatus);
    const bScore = scoreOf(bStatus);

    if (qScore > bScore) {
      return {
        choice: 'Q',
        summary: 'The Q train is currently running better.',
        reason: `The Q has ${getStatusText(qStatus).toLowerCase()} while the B is reporting ${getStatusText(bStatus).toLowerCase()}.`,
      };
    }
    if (bScore > qScore) {
      return {
        choice: 'B',
        summary: 'The B train is currently running better.',
        reason: `The B has ${getStatusText(bStatus).toLowerCase()} while the Q is reporting ${getStatusText(qStatus).toLowerCase()}.`,
      };
    }
    if (qStatus === 'good' && bStatus === 'good') {
      return {
        choice: 'BOTH',
        summary: 'Both Q and B are running smoothly.',
        reason:
          'Take the B express for faster travel between Brighton Beach and Prospect Park (or 6th Ave in Manhattan), or the Q for local stops and Broadway / 2nd Ave.',
      };
    }
    return {
      choice: 'EITHER',
      summary: 'Both lines have active alerts — take the first train.',
      reason: `Both Q and B are reporting disruptions (${getStatusText(qStatus).toLowerCase()}). Watch the live race below to catch whichever arrives first.`,
    };
  };

  const rec = getRecommendation();
  const isPinned = favorites.includes(selectedStationId);

  const renderArrivalList = (arrivals, direction) => {
    const label = dirLabels[direction];
    const isTerminalDirection = selectedStation.terminalDirection === direction;
    const isManhattanBOnlyOffHours =
      selectedStation.corridor === 'manhattan-b' && !isBActive && !showAllLines;

    return (
      <div className="q-station-card bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <span aria-hidden="true">{direction === 'north' ? '↑' : '↓'}</span>
            {label}
          </h3>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {direction === 'north' ? 'Northbound' : 'Southbound'}
          </span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-800/80">
          {stopStatus === 'loading' && !stopData ? (
            <div className="p-4 text-sm text-slate-400 dark:text-slate-500 animate-pulse">
              Loading live arrivals for {selectedStation.name}...
            </div>
          ) : stopStatus === 'error' ? (
            <div className="p-4 text-sm text-red-600 dark:text-red-400">
              Unable to load live arrivals right now. Tap refresh to try again.
            </div>
          ) : isTerminalDirection ? (
            <div className="p-4 text-xs text-slate-500 dark:text-slate-400">
              {direction === 'south'
                ? 'Southern terminal — trains arriving here end service. Check Manhattan-bound departures above.'
                : 'Northern terminal — trains arriving here end service. Check Brooklyn-bound departures below.'}
            </div>
          ) : isManhattanBOnlyOffHours ? (
            <div className="p-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p>
                The <strong>B</strong> train is off-hours right now (runs weekdays ~6 AM–10:30 PM ET). Take the <strong>Q</strong> from Broadway instead:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectStation('R17')}
                  className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-bold hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
                >
                  34 St - Herald Sq (Q) →
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectStation('R16')}
                  className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-bold hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
                >
                  Times Sq - 42 St (Q) →
                </button>
              </div>
            </div>
          ) : arrivals.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400 italic">
              No upcoming {showAllLines ? '' : 'Q/B '}trains reported right now.
            </div>
          ) : (
            arrivals.map((trip) => {
              const primaryLocation =
                trip.upcomingStop === selectedStationId
                  ? trip.minutes <= 1
                    ? 'Approaching platform'
                    : `Next: ${selectedStation.name}`
                  : trip.upcomingStopName
                    ? `${trip.previousStop ? 'Next:' : 'At'} ${trip.upcomingStopName}`
                    : trip.destinationName;

              return (
                <div
                  key={trip.id}
                  className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-extrabold text-sm shadow-sm ${getRouteBulletClass(trip.route)}`}
                      aria-label={`${trip.route} train`}
                    >
                      {trip.route}
                    </span>
                    <div className="min-w-0">
                      <div className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug truncate">
                        {primaryLocation}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="truncate">To {trip.destinationName}</span>
                        {trip.isDelayed && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase">
                            Delayed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <span className="q-arrival-pill inline-block text-sm sm:text-base font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800/70 tabular-nums">
                      {trip.minutes === 0 ? 'Due' : `${trip.minutes} min`}
                    </span>
                    <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums">
                      {formatNyTime(trip.arrivalEpoch, { isEpoch: true })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Race station arrivals for Helper tab
  const raceStation = STATION_BY_ID[raceStationId] || STATION_BY_ID['D26'];
  const activeRaceData = raceStationId === selectedStationId ? stopData : helperStopData;
  const raceNorth = useMemo(
    () => normalizeStopTrips(activeRaceData, 'north', new Set(['Q', 'B']), nowSec).slice(0, 4),
    [activeRaceData, lastUpdated]
  );
  const raceSouth = useMemo(
    () => normalizeStopTrips(activeRaceData, 'south', new Set(['Q', 'B']), nowSec).slice(0, 4),
    [activeRaceData, lastUpdated]
  );

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      {/* 1. Collapsible Brooklyn Weather Banner */}
      {weatherStatus === 'success' && weatherData && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
          <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
              aria-expanded={isWeatherExpanded}
              className="flex-1 flex items-center gap-3 text-left focus:outline-none"
            >
              <span className="text-2xl" aria-hidden="true">
                {getWeatherDetails(weatherData.daily.weather_code[0]).emoji}
              </span>
              <div>
                <h2 className="font-extrabold text-sm text-gray-800 dark:text-white leading-tight">
                  Brooklyn Weather: {formatTemp(weatherData.daily.temperature_2m_max[0])}°{tempUnit} / {formatTemp(weatherData.daily.temperature_2m_min[0])}°{tempUnit}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold mt-0.5">
                  {getWeatherDetails(weatherData.daily.weather_code[0]).label} • {isWeatherExpanded ? 'Hide forecast' : '3-day commute forecast'}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <div
                className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 border border-gray-200 dark:border-slate-700 text-[10px] font-black"
                role="group"
                aria-label="Temperature unit"
              >
                <button
                  type="button"
                  onClick={() => setTempUnit('C')}
                  aria-pressed={tempUnit === 'C'}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    tempUnit === 'C'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm'
                      : 'text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200'
                  }`}
                >
                  °C
                </button>
                <button
                  type="button"
                  onClick={() => setTempUnit('F')}
                  aria-pressed={tempUnit === 'F'}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    tempUnit === 'F'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm'
                      : 'text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200'
                  }`}
                >
                  °F
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
                aria-label={isWeatherExpanded ? 'Collapse weather forecast' : 'Expand weather forecast'}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${isWeatherExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {isWeatherExpanded && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-slate-800/80 pt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {weatherData.daily.time.map((time, index) => {
                  const dateObj = new Date(`${time}T00:00:00`);
                  const dayLabel =
                    index === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  const weatherCode = weatherData.daily.weather_code[index];
                  const tempMax = weatherData.daily.temperature_2m_max[index];
                  const tempMin = weatherData.daily.temperature_2m_min[index];
                  const rainProb = Math.round(weatherData.daily.precipitation_probability_max[index]);
                  const details = getWeatherDetails(weatherCode);

                  return (
                    <div
                      key={time}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center justify-between bg-gradient-to-b ${details.bgClass} shadow-sm`}
                    >
                      <div className="font-bold text-[10px] uppercase tracking-wide opacity-80">
                        {dayLabel}
                      </div>
                      <div className="text-3xl my-2" title={details.label}>
                        {details.emoji}
                      </div>
                      <div className="space-y-1">
                        <div className="font-extrabold text-lg sm:text-xl text-gray-800 dark:text-white">
                          {formatTemp(tempMax)}°{' '}
                          <span className="opacity-60 font-semibold text-sm text-gray-500 dark:text-slate-400">
                            / {formatTemp(tempMin)}°
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-0.5">
                          <span aria-hidden="true">💧</span> {rainProb}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-800 dark:text-white block mb-0.5">
                  Brighton Line Commute Guide
                </span>
                {getCommuteAdvisory(
                  weatherData.daily.weather_code[0],
                  weatherData.daily.temperature_2m_max[0],
                  weatherData.daily.temperature_2m_min[0]
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Live Corridor Status Card (Q + B always visible with transparent B schedule) */}
      <div className="q-status-card bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Q Status */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="q-tracker-bullet relative w-9 h-9 rounded-full bg-[#FCCC0A] flex-shrink-0 flex items-center justify-center text-black font-extrabold text-lg border-2 border-black">
                Q
                <svg
                  className="q-tracker-santa-cap"
                  viewBox="0 0 120 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="qt-santa-red" x1="15" y1="10" x2="95" y2="75" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ef233c" />
                      <stop offset="55%" stopColor="#d90429" />
                      <stop offset="100%" stopColor="#8d0801" />
                    </linearGradient>
                    <linearGradient id="qt-santa-brim" x1="10" y1="45" x2="80" y2="85" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="75%" stopColor="#f8fafc" />
                      <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M18 52 C22 18, 56 6, 84 20 C98 27, 105 44, 102 64 C96 58, 89 48, 80 45 C72 42, 74 58, 76 66 Z"
                    fill="url(#qt-santa-red)"
                  />
                  <path
                    d="M8 50 C6 42, 16 38, 26 41 C34 38, 46 41, 56 46 C66 49, 78 55, 84 64 C88 71, 82 80, 72 79 C62 78, 52 74, 40 69 C28 64, 16 61, 10 56 C7 54, 8 52, 8 50 Z"
                    fill="url(#qt-santa-brim)"
                  />
                  <circle cx="101" cy="69" r="14" fill="#ffffff" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Local · 24/7
                </div>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-md border text-[11px] font-extrabold ${getStatusBadgeClasses(qStatus)}`}>
                  {getStatusText(qStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* B Status */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-extrabold text-lg border-2 ${
                  isBActive
                    ? 'bg-[#FF6319] text-white border-orange-600/30'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-400/40'
                }`}
              >
                B
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Express · Wkdy
                </div>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-md border text-[11px] font-extrabold ${getStatusBadgeClasses(isBActive ? bStatus : 'inactive')}`}>
                  {getStatusText(isBActive ? bStatus : 'inactive')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Off-hours B train clarity banner */}
        {!isBActive && (
          <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <strong>B Train is off-hours</strong> (runs weekdays ~6:00 AM–10:30 PM ET). The <strong>Q</strong> serves all 20 Brighton Line stations local 24/7.
          </p>
        )}

        {/* Expandable Active Alerts */}
        {allAlerts.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5">
            <button
              type="button"
              onClick={() => setAlertsExpanded(!alertsExpanded)}
              aria-expanded={alertsExpanded}
              className="w-full flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline"
            >
              <span>
                ⚠️ {allAlerts.length} Active Service {allAlerts.length === 1 ? 'Alert' : 'Alerts'}
              </span>
              <span>{alertsExpanded ? 'Hide' : 'Show'}</span>
            </button>
            {alertsExpanded && (
              <div className="mt-2 space-y-2">
                {allAlerts.map((alert, i) => (
                  <div
                    key={`${alert.route}-${i}`}
                    className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                      alert.kind === 'change'
                        ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/60 text-orange-900 dark:text-orange-200'
                        : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <span className="font-extrabold mr-1.5">
                      [{alert.route} · {alert.dir}]
                    </span>
                    {alert.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Primary View Switcher */}
      <div
        role="tablist"
        aria-label="Brighton Line views"
        className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl flex gap-1 border border-slate-200 dark:border-slate-700"
      >
        {[
          { id: 'station', label: 'My Station', icon: '🚏' },
          { id: 'map', label: 'Line Map', icon: '🗺️' },
          { id: 'helper', label: 'Q vs B Helper', icon: '🚦' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-2.5 text-center text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4A. MY STATION TAB */}
      {activeTab === 'station' && (
        <div role="tabpanel" aria-label="My Station live board" className="space-y-4">
          {/* Station Picker & Pinned Stops Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="brighton-station-select"
                className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Your Station
              </label>
              <button
                type="button"
                onClick={() => toggleFavorite(selectedStationId)}
                aria-pressed={isPinned}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  isPinned
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span aria-hidden="true">{isPinned ? '★' : '☆'}</span>
                {isPinned ? 'Pinned' : 'Pin Stop'}
              </button>
            </div>

            <select
              id="brighton-station-select"
              value={selectedStationId}
              onChange={(e) => handleSelectStation(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FCCC0A]"
            >
              <optgroup label="BMT Brighton Line — Brooklyn (North → South)">
                {BRIGHTON_STATIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.express ? 'Q · B Express' : 'Q Local'})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Manhattan — Q Train (Broadway / 2nd Ave)">
                {MANHATTAN_Q_STATIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Q)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Manhattan — B Train (6th Ave)">
                {MANHATTAN_B_STATIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (B)
                  </option>
                ))}
              </optgroup>
            </select>

            {/* Station metadata line */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedStation.lines.map((line) => (
                  <span
                    key={line}
                    className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[11px] font-extrabold ${getRouteBulletClass(line)}`}
                  >
                    {line}
                  </span>
                ))}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {selectedStation.area}
                </span>
                {stopData?.secondary_name && (
                  <span>· {stopData.secondary_name}</span>
                )}
              </div>
              {selectedStation.transfers && (
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Transfers: {selectedStation.transfers}
                </span>
              )}
            </div>

            {/* Pinned Favorite Station Quick-Switch Chips */}
            {favorites.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1">
                  Pinned:
                </span>
                {favorites.map((favId) => {
                  const st = STATION_BY_ID[favId];
                  if (!st) return null;
                  const active = favId === selectedStationId;
                  return (
                    <button
                      key={favId}
                      type="button"
                      onClick={() => handleSelectStation(favId)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        active
                          ? 'bg-slate-900 dark:bg-[#FCCC0A] text-white dark:text-black'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {st.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Direction Filter + Optional All-Lines Transfer Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                {[
                  { id: 'both', label: 'Both' },
                  { id: 'north', label: isManhattanStop ? 'Uptown ↑' : 'Manhattan ↑' },
                  { id: 'south', label: isManhattanStop ? 'Brooklyn ↓' : 'Southbound ↓' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDirectionFilter(opt.id)}
                    aria-pressed={directionFilter === opt.id}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      directionFilter === opt.id
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {otherRoutesAtStop.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllLines((v) => !v)}
                  aria-pressed={showAllLines}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    showAllLines
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {showAllLines ? 'Showing All Lines' : `+ Show ${otherRoutesAtStop.join('/')}`}
                </button>
              )}
            </div>
          </div>

          {/* Contextual Alert if this station is flagged in headway/delay irregularities */}
          {affectedStations.has(selectedStationId) && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-xs text-amber-900 dark:text-amber-200 font-semibold">
              ⚠️ Longer wait times or delays are currently reported near <strong>{selectedStation.name}</strong>. Check the active alerts above for details.
            </div>
          )}

          {/* Local-to-Express Transfer Tip on Q-only Brighton stops while B is running */}
          {selectedStation.corridor === 'brighton' && !selectedStation.express && isBActive && (
            <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/25 border border-orange-200/80 dark:border-orange-900/50 text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
              <span>
                <strong>Local stop:</strong> Transfer to the{' '}
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#FF6319] text-white font-extrabold text-[10px] align-middle">
                  B
                </span>{' '}
                express at:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedStation.nearestExpressNorth && STATION_BY_ID[selectedStation.nearestExpressNorth] && (
                  <button
                    type="button"
                    onClick={() => handleSelectStation(selectedStation.nearestExpressNorth)}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-300 font-bold hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                  >
                    ↑ {STATION_BY_ID[selectedStation.nearestExpressNorth].name}
                  </button>
                )}
                {selectedStation.nearestExpressSouth && STATION_BY_ID[selectedStation.nearestExpressSouth] && (
                  <button
                    type="button"
                    onClick={() => handleSelectStation(selectedStation.nearestExpressSouth)}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-300 font-bold hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                  >
                    ↓ {STATION_BY_ID[selectedStation.nearestExpressSouth].name}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Live Arrival Boards */}
          <div className="space-y-4" aria-live="polite">
            {(directionFilter === 'both' || directionFilter === 'north') &&
              renderArrivalList(northArrivals, 'north')}
            {(directionFilter === 'both' || directionFilter === 'south') &&
              renderArrivalList(southArrivals, 'south')}
          </div>
        </div>
      )}

      {/* 4B. INTERACTIVE 20-STOP BRIGHTON LINE MAP TAB */}
      {activeTab === 'map' && (
        <div
          role="tabpanel"
          aria-label="Interactive BMT Brighton Line corridor map"
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden"
        >
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/70 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                BMT Brighton Line — All 20 Stops
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tap any station for live countdowns · Live train positions shown
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold flex-shrink-0">
              <span className="px-1.5 py-0.5 rounded bg-[#FCCC0A] text-black">Q</span>
              <span
                className={`px-1.5 py-0.5 rounded ${
                  isBActive
                    ? 'bg-[#FF6319] text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 line-through'
                }`}
              >
                B
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {BRIGHTON_STATIONS.map((station, idx) => {
              const trains = liveCorridorTrains[station.id];
              const isSelected = station.id === selectedStationId;
              const isFav = favorites.includes(station.id);
              const hasAlert = affectedStations.has(station.id);
              const bStopsHere = station.express;
              const bTrackContinues = idx < BRIGHTON_STATIONS.findIndex((s) => s.id === 'D40');
              const isBSection = idx <= BRIGHTON_STATIONS.findIndex((s) => s.id === 'D40');

              return (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => handleSelectStation(station.id, true)}
                  className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left transition-colors ${
                    isSelected
                      ? 'bg-amber-50/90 dark:bg-amber-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Dual Q / B track graphic */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 w-9 justify-center relative self-stretch">
                      {/* Q Track (all 20 stops; continues north to Manhattan, terminates at Coney Island) */}
                      <div className="relative flex items-center justify-center w-3.5 h-full">
                        <span
                          className={`w-1 bg-[#FCCC0A] absolute top-[-10px] ${
                            idx === BRIGHTON_STATIONS.length - 1 ? 'bottom-1/2' : 'bottom-[-10px]'
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={`relative z-10 w-3 h-3 rounded-full border-2 ${
                            isSelected
                              ? 'bg-slate-900 dark:bg-white border-[#FCCC0A] scale-110'
                              : 'bg-white dark:bg-slate-900 border-[#d4a900]'
                          }`}
                        />
                      </div>

                      {/* B Express Track (DeKalb Av -> Brighton Beach) */}
                      <div className="relative flex items-center justify-center w-3.5 h-full">
                        {isBSection && (
                          <span
                            className={`w-1 absolute ${idx === 0 ? 'top-1/2' : 'top-[-10px]'} ${
                              bTrackContinues ? 'bottom-[-10px]' : 'bottom-1/2'
                            } ${isBActive ? 'bg-[#FF6319]' : 'bg-slate-300 dark:bg-slate-700'}`}
                            aria-hidden="true"
                          />
                        )}
                        {bStopsHere && (
                          <span
                            className={`relative z-10 w-3 h-3 rounded-full border-2 ${
                              isBActive
                                ? isSelected
                                  ? 'bg-[#FF6319] border-white dark:border-slate-900 scale-110'
                                  : 'bg-white dark:bg-slate-900 border-[#FF6319]'
                                : 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600'
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    {/* Station Name & Meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-sm truncate ${
                            station.express
                              ? 'font-extrabold text-slate-900 dark:text-white'
                              : 'font-semibold text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {station.name}
                        </span>
                        {isFav && (
                          <span className="text-amber-500 text-xs" title="Pinned station">
                            ★
                          </span>
                        )}
                        {hasAlert && (
                          <span
                            className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"
                            title="Delays or long headways reported here"
                          />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {station.express ? 'Express · Q & B' : 'Local · Q only'}
                        {station.transfers ? ` · ${station.transfers}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Live trains currently approaching this stop */}
                  <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
                    {trains?.QN > 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded bg-[#FCCC0A] text-black text-[10px] font-black leading-none"
                        title={`${trains.QN} Northbound Q approaching`}
                      >
                        Q↑{trains.QN > 1 ? trains.QN : ''}
                      </span>
                    )}
                    {trains?.QS > 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded bg-[#FCCC0A]/80 text-black border border-black/20 text-[10px] font-black leading-none"
                        title={`${trains.QS} Southbound Q approaching`}
                      >
                        Q↓{trains.QS > 1 ? trains.QS : ''}
                      </span>
                    )}
                    {trains?.BN > 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded bg-[#FF6319] text-white text-[10px] font-black leading-none"
                        title={`${trains.BN} Northbound B approaching`}
                      >
                        B↑{trains.BN > 1 ? trains.BN : ''}
                      </span>
                    )}
                    {trains?.BS > 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded bg-[#FF6319]/80 text-white text-[10px] font-black leading-none"
                        title={`${trains.BS} Southbound B approaching`}
                      >
                        B↓{trains.BS > 1 ? trains.BS : ''}
                      </span>
                    )}
                    <span className="text-slate-300 dark:text-slate-600 text-xs ml-0.5" aria-hidden="true">
                      ›
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4C. Q vs B HELPER TAB */}
      {activeTab === 'helper' && (
        <div role="tabpanel" aria-label="Q vs B commuter decision helper" className="space-y-4">
          {/* Smart Recommendation Card */}
          <div
            className={`p-5 rounded-2xl border-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 shadow-sm flex gap-4 items-start ${
              rec.choice === 'Q'
                ? 'border-[#FCCC0A]'
                : rec.choice === 'B'
                  ? 'border-[#FF6319]'
                  : rec.choice === 'BOTH'
                    ? 'border-emerald-500'
                    : 'border-amber-500'
            }`}
          >
            <div className="flex-shrink-0 flex items-center space-x-1 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
              {(rec.choice === 'Q' || rec.choice === 'BOTH' || rec.choice === 'EITHER') && (
                <span className="w-9 h-9 rounded-full bg-[#FCCC0A] text-black font-extrabold text-lg flex items-center justify-center border-2 border-black">
                  Q
                </span>
              )}
              {(rec.choice === 'B' || rec.choice === 'BOTH' || rec.choice === 'EITHER') && (
                <span className="w-9 h-9 rounded-full bg-[#FF6319] text-white font-extrabold text-lg flex items-center justify-center">
                  B
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Brighton Line Assistant
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                {rec.summary}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {rec.reason}
              </p>
            </div>
          </div>

          {/* Personalized Express Race Card */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  ⏱️ Brighton Line Race — {raceStation.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {raceStationId === selectedStationId
                    ? 'Comparing next Q & B arrivals at your selected express stop.'
                    : `Nearest shared Q/B express hub to ${selectedStation.name}.`}
                </p>
              </div>
              {raceStationId !== selectedStationId && (
                <button
                  type="button"
                  onClick={() => handleSelectStation(raceStationId, true)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
                >
                  Open stop →
                </button>
              )}
            </div>

            {[
              { dir: 'north', title: 'Manhattan-bound ↑', trips: raceNorth },
              { dir: 'south', title: 'Southbound (Coney Island / Brighton) ↓', trips: raceSouth },
            ].map((section) => (
              <div key={section.dir} className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {section.title}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {!activeRaceData && helperStopId !== raceStationId ? (
                    <span className="text-xs text-slate-400 animate-pulse">Loading...</span>
                  ) : section.trips.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No upcoming Q/B trains reported</span>
                  ) : (
                    section.trips.map((arr) => (
                      <span
                        key={arr.id}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black leading-none ${getRouteBulletClass(arr.route)}`}
                        >
                          {arr.route}
                        </span>
                        <span className="text-slate-800 dark:text-slate-100 tabular-nums">
                          {arr.minutes === 0 ? 'Due' : `${arr.minutes}m`}
                        </span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Quick Express Station Switcher */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2">
                Jump to any Brighton express stop:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BRIGHTON_STATIONS.filter((s) => s.express).map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => handleSelectStation(exp.id)}
                    className={`px-2 py-1 rounded-md text-xs font-bold transition-colors ${
                      raceStationId === exp.id
                        ? 'bg-slate-900 dark:bg-[#FCCC0A] text-white dark:text-black'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {exp.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Footer Controls & Attribution */}
      <div className="pt-1 text-center space-y-3">
        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            {lastUpdated
              ? `Updated ${formatNyTime(lastUpdated, { includeSeconds: true })} NY Time`
              : 'Checking live feeds...'}
          </span>
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefreshing ? 'Refreshing' : 'Refresh'}
          </button>
        </div>

        <div className="pt-1">
          <a
            href="/q-train-history"
            className="inline-flex items-center justify-center px-4 py-2 border border-blue-200 dark:border-blue-800/70 text-sm font-semibold rounded-lg text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View Service History Log
          </a>
        </div>

        <div className="text-xs text-slate-400 dark:text-slate-500">
          Real-time transit data provided by Subway Now (goodservice.io) · Auto-refreshes every 60s
        </div>
      </div>
    </div>
  );
};

export default QTrainTracker;

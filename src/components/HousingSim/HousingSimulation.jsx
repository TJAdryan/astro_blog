
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import weights from './housing_weights.json';

// --- Constants from JSON ---
// --- Updates to JSON need to be reflected
const HOMES_TOTAL = weights.HOMES_TOTAL;
const INITIAL_SEED = weights.INITIAL_SEED;
const POPULATION_GROWTH_RATE = weights.POPULATION_GROWTH_RATE;
const INCOME_GROWTH_RATE = weights.INCOME_GROWTH_RATE;
const AFFORDABILITY_MULTIPLIER = weights.AFFORDABILITY_MULTIPLIER;
const BASE_APPRECIATION = weights.BASE_APPRECIATION;
const INITIAL_VACANCY_RATE = weights.INITIAL_VACANCY_RATE;
const RENTAL_TURNOVER_RATE = weights.RENTAL_TURNOVER_RATE;
const RE_ENTRANT_RATE = weights.RE_ENTRANT_RATE;
const STR_CONVERSION_CHANCE = weights.STR_CONVERSION_CHANCE;
const STR_CAP_RATE = weights.STR_CAP_RATE;
const MAX_RENT_INCREASE = weights.MAX_RENT_INCREASE;
const HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE = weights.HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE;
const FORECLOSURE_RATE = weights.FORECLOSURE_RATE;
const INCOME_TIERS = weights.INCOME_TIERS;



// --- Helper Components ---
const Card = ({ label, value, subValue }) => (
  <div className="bg-slate-850 border border-slate-800/80 p-4 rounded-2xl text-center shadow-md transition-all hover:border-slate-700/60">
    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">{label}</label>
    <span className="text-lg md:text-xl font-extrabold text-white block">{value}</span>
    {subValue && <span className="block text-xs font-semibold mt-1">{subValue}</span>}
  </div>
);

// --- Main App Component ---
// Default values for simulation
const DEFAULT_VALUES = {
  initialHomeowners: 225,
  initialLandlords: 75,
  initialSeekersCount: 36,
  newHomes: 3,
  turnoverRate: 4,
  landlordCap: 45,
  yearsToRun: 10
};

export default function HousingSimulation() {
  // --- Sort State ---
  const [sortBy, setSortBy] = useState('color'); // 'color', 'price', 'id'
  
  const sortHouses = useCallback((houses, sortType) => {
    const sortedHouses = [...houses];
    switch (sortType) {
      case 'color':
        return sortedHouses.sort((a, b) => {
          // Color order: green (OwnerOccupied), dark blue (LTR-Occupied), light blue (LTR-Vacant), purple (STR)
          const getColorOrder = (home) => {
            if (home.status === 'OwnerOccupied') return 0;
            if (home.usage === 'LongTermRental' && home.status === 'Occupied') return 1;
            if (home.usage === 'LongTermRental' && home.status === 'Vacant') return 2;
            if (home.usage === 'ShortTermRental') return 3;
            return 4;
          };
          return getColorOrder(a) - getColorOrder(b);
        });
      case 'price':
        return sortedHouses.sort((a, b) => a.price - b.price);
      case 'id':
        return sortedHouses.sort((a, b) => {
          const idA = parseInt(a.id.split('_')[1]);
          const idB = parseInt(b.id.split('_')[1]);
          return idA - idB;
        });
      default:
        return sortedHouses;
    }
  }, []);

  // --- Simulation Variables ---
  const [initialHomeowners, setInitialHomeowners] = useState(DEFAULT_VALUES.initialHomeowners);
  const [initialLandlords, setInitialLandlords] = useState(DEFAULT_VALUES.initialLandlords);
  const [initialSeekersCount, setInitialSeekersCount] = useState(DEFAULT_VALUES.initialSeekersCount);
  const [newHomes, setNewHomes] = useState(DEFAULT_VALUES.newHomes);
  const [turnoverRate, setTurnoverRate] = useState(DEFAULT_VALUES.turnoverRate);
  const [landlordCap, setLandlordCap] = useState(DEFAULT_VALUES.landlordCap);
  const [yearsToRun, setYearsToRun] = useState(DEFAULT_VALUES.yearsToRun);

  // Function to handle balanced updates between homeowners and landlords
  const updateBalancedOwnership = useCallback((type, newValue) => {
    const totalHomes = HOMES_TOTAL;
    newValue = Math.max(0, Math.min(newValue, totalHomes)); // Ensure value is between 0 and total homes
    
    if (type === 'homeowners') {
      setInitialHomeowners(newValue);
      setInitialLandlords(totalHomes - newValue);
    } else if (type === 'landlords') {
      setInitialLandlords(newValue);
      setInitialHomeowners(totalHomes - newValue);
    }
  }, []);
  
  // --- Simulation State (runs the model) ---
  const [year, setYear] = useState(1);
  const [housingStock, setHousingStock] = useState([]);
  const [seekerPool, setSeekerPool] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(500);
  const [collapseTriggered, setCollapseTriggered] = useState(false);
  const nextHomeId = useRef(HOMES_TOTAL);  // Start after initial homes

  // --- Display State (shown on screen) ---
  const [displayData, setDisplayData] = useState({});

  // --- Refs ---
  const unsoldInventory = useRef([]);
  const marketResults = useRef({});
  const initialStats = useRef({});
  const nextSeekerId = useRef(0);
  const seededRandom = useRef(createSeededRandom(INITIAL_SEED));
  const cumulativeIncomeGrowth = useRef(1.0);
  const totalLandlordCapital = useRef(0);
  const totalLandlordReturn = useRef(0);

  // --- Utility Functions ---
  function createSeededRandom(seed) {
    let state = seed;
    return function() {
      state = (state * 1664525 + 1013904223) % 2**32;
      return state / 2**32;
    };
  }

  const getPercentChange = (initial, current) => {
    if (initial === 0 || !initial) return 'N/A';
    const change = ((current - initial) / initial) * 100;
    const color = change >= 0 ? 'text-emerald-400' : 'text-rose-455 text-rose-400';
    return <span className={`${color} font-mono font-bold`}>{`${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}</span>;
  };
  
  // --- Data Computation for Display ---
  const computeDisplayData = useCallback((stock, seekers, initial, yearStats) => {
    const currentTotals = stock.reduce((acc, home) => {
      if (home.ownerType) acc[home.ownerType] = (acc[home.ownerType] || 0) + 1;
      return acc;
    }, { homeowner: 0, landlord: 0 });

    const prices = stock.map(h => h.price).sort((a,b)=>a-b);
    const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length/2)] : 0;
    
    const rents = stock.filter(h => h.ownerType !== 'homeowner').map(h => h.rent).sort((a,b)=>a-b);
    const medianRent = rents.length > 0 ? rents[Math.floor(rents.length/2)] : 0;

    const vacantRentals = stock.filter(h => h.status === 'Vacant' && h.usage === 'LongTermRental').length;
    const totalRentals = stock.filter(h => h.ownerType !== 'homeowner' && h.usage === 'LongTermRental').length;
    const vacancyRate = totalRentals > 0 ? ((vacantRentals / totalRentals) * 100).toFixed(1) + '%' : 'N/A';
    
    const incomes = seekers.map(s => s.income).sort((a,b)=>a-b);
    const medianIncome = incomes.length > 0 ? incomes[Math.floor(incomes.length/2)] : 0;
    
    const medianRentBurden = (medianIncome > 0 && medianRent > 0)
      ? `${(((medianRent * 12) / medianIncome) * 100).toFixed(1)}%`
      : 'N/A';

    const homeownerIncomes = stock.filter(h => h.ownerType === 'homeowner' && h.ownerIncome).map(h => h.ownerIncome).sort((a, b) => a - b);
    const medianHomeownerIncome = homeownerIncomes.length > 0 ? homeownerIncomes[Math.floor(homeownerIncomes.length / 2)] : 0;

    const housedPopulation = stock.filter(h => 
      h.usage !== 'ShortTermRental' && 
      (h.status === 'OwnerOccupied' || h.status === 'Occupied')
    ).length;
    const totalPopulation = housedPopulation + seekers.length;
    // Calculate real mortgage eligibility considering market conditions
    const landlordOwnershipRatio = stock.filter(h => h.ownerType === 'landlord').length / stock.length;
    const canBuyersPurchase = landlordOwnershipRatio < (landlordCap / 100);
    
    // Calculate affordability based on lowest-priced available homes
    const availableHomes = stock.filter(h => h.status === 'Unsold' || h.status === 'UnsoldNew');
    const lowestPrice = availableHomes.length > 0 
      ? Math.min(...availableHomes.map(h => h.price))
      : medianPrice;
    
    // Only count mortgage eligible if they can actually buy (landlord cap not reached AND can afford cheapest home)
    const mortgageEligible = canBuyersPurchase ? 
      seekers.filter(s => s.income * AFFORDABILITY_MULTIPLIER >= lowestPrice).length : 0;
    
    const shortTermRentals = stock.filter(h => h.usage === 'ShortTermRental').length;

  setDisplayData({
      seekerCount: seekers.length,
      vacantRentals,
      vacancyRate,
      medianIncome,
      medianHomeownerIncome,
      medianPrice,
      medianRent,
      homeowners: currentTotals.homeowner,
      landlords: currentTotals.landlord,
      totalHomes: stock.length,
      pctOwnerOccupied: getPercentChange(initial.ownerOccupied, currentTotals.homeowner),
      pctLandlords: getPercentChange(initial.landlords, currentTotals.landlord),
      pctMedianPrice: getPercentChange(initial.medianPrice, medianPrice),
      pctMedianRent: getPercentChange(initial.medianRent, medianRent),
      pctMedianIncome: getPercentChange(initial.medianIncome, medianIncome),
      pctMedianHomeownerIncome: getPercentChange(initial.medianHomeownerIncome, medianHomeownerIncome),
      medianRentBurden,
      totalPopulation,
      mortgageEligible,
      shortTermRentals,
      landlordConcentration: yearStats.landlordConcentration,
      approvalRate: yearStats.approvalRate,
      supplyDeficit: yearStats.supplyDeficit,
    });
  }, []);

  // --- Core Simulation Logic ---
  const setupSimulation = useCallback(() => {
    unsoldInventory.current = [];
    nextSeekerId.current = 0;
    seededRandom.current = createSeededRandom(INITIAL_SEED);
    cumulativeIncomeGrowth.current = 1.0;
    marketResults.current = {
      purchasesByHomeowner: 0, purchasesByLandlord: 0,
      convertedToShortTerm: 0, displacements: 0,
      totalSupplyDeficit: 0,
      pushedToHomelessness: 0,
    };
    totalLandlordCapital.current = 0;
    totalLandlordReturn.current = 0;
    
    const generateTieredIncomes = (count) => {
        const incomes = [];
        const randomInRange = (min, max) => min + seededRandom.current() * (max - min);

        const { INCOME_TIERS } = weights;
        const topCount = Math.floor(count * INCOME_TIERS.top.percent);
        const middleCount = Math.floor(count * INCOME_TIERS.middle.percent);
        const bottomCount = count - topCount - middleCount;

        for (let i = 0; i < topCount; i++) incomes.push(randomInRange(...INCOME_TIERS.top.range));
        for (let i = 0; i < middleCount; i++) incomes.push(randomInRange(...INCOME_TIERS.middle.range));
        for (let i = 0; i < bottomCount; i++) incomes.push(randomInRange(...INCOME_TIERS.bottom.range));

        return incomes.sort((a,b) => a-b);
    };
    
    const generateHomeownerIncomes = (count) => {
        const incomes = [];
        const randomInRange = (min, max) => min + seededRandom.current() * (max - min);
        const { INCOME_TIERS } = weights;
        
        // Calculate exact counts for each tier
        const topCount = Math.floor(count * INCOME_TIERS.top.percent);
        const middleCount = Math.floor(count * INCOME_TIERS.middle.percent);
        const bottomCount = count - topCount - middleCount;
        
        // Generate exact number of incomes for each tier
        for (let i = 0; i < topCount; i++) {
            incomes.push(randomInRange(...INCOME_TIERS.top.range));
        }
        for (let i = 0; i < middleCount; i++) {
            incomes.push(randomInRange(...INCOME_TIERS.middle.range));
        }
        for (let i = 0; i < bottomCount; i++) {
            incomes.push(randomInRange(...INCOME_TIERS.bottom.range));
        }
        
        // Return unsorted incomes to avoid sequential assignment bias
        return incomes;
    };

    const generateRandomData = (count, median, spread) => {
        const data = [];
        for(let i = 0; i < count; i++) {
            // Generate more evenly distributed prices around the median
            const deviation = (seededRandom.current() - 0.5) * 2 * spread;
            data.push(Math.max(median + deviation, median * 0.5)); // Ensure no prices below 50% of median
        }
        return data;
    };

    const initialPrices = generateRandomData(HOMES_TOTAL, 350000, 100000);
    const initialIncomes = generateTieredIncomes(initialSeekersCount);
    
    let adjHomeowners = initialHomeowners;
    let adjLandlords = initialLandlords;
    
    // Shuffle the array of indices to randomly assign properties
    const indices = Array.from({length: HOMES_TOTAL}, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom.current() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Split indices into landlord and homeowner groups
    const landlordIndices = indices.slice(0, adjLandlords);
    const homeownerIndices = indices.slice(adjLandlords);
    if (adjHomeowners + adjLandlords !== HOMES_TOTAL) {
      adjLandlords = HOMES_TOTAL - adjHomeowners;
    }
    
    // Use a different distribution for initial homeowners (40/45/15 split)
    const generateInitialHomeownerIncomes = (count) => {
        const incomes = [];
        const randomInRange = (min, max) => min + seededRandom.current() * (max - min);
        const { INCOME_TIERS } = weights;
        
        // Different percentages for homeowners
        const topCount = Math.floor(count * 0.15);  // 15% high income
        const middleCount = Math.floor(count * 0.45); // 45% middle income
        const bottomCount = count - topCount - middleCount; // 40% lower income
        
        for (let i = 0; i < topCount; i++) incomes.push(randomInRange(...INCOME_TIERS.top.range));
        for (let i = 0; i < middleCount; i++) incomes.push(randomInRange(...INCOME_TIERS.middle.range));
        for (let i = 0; i < bottomCount; i++) incomes.push(randomInRange(...INCOME_TIERS.bottom.range));
        
        return incomes;
    };
    
    const initialHomeownerIncomes = generateInitialHomeownerIncomes(adjHomeowners);

    let homeownerIncomeIndex = 0;

    // Create an array of indices and shuffle it for random assignment of properties
    const shuffledIndices = Array.from({ length: HOMES_TOTAL }, (_, i) => i);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom.current() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }

    // Use the first adjLandlords indices for landlord properties
    const randomLandlordIndices = shuffledIndices.slice(0, adjLandlords);

    const newHousingStock = Array.from({ length: HOMES_TOTAL }, (_, i) => {
      const isLandlord = randomLandlordIndices.includes(i);
      const ownerType = isLandlord ? 'landlord' : 'homeowner';
      const price = initialPrices[i];
      const usage = (isLandlord && randomLandlordIndices.indexOf(i) < 3) ? 'ShortTermRental' : 'LongTermRental';
      let status;
      let ownerIncome = null;

      if (ownerType === 'homeowner') {
        status = 'OwnerOccupied';
        ownerIncome = initialHomeownerIncomes[homeownerIncomeIndex++];
      } else {
        if (usage === 'ShortTermRental') status = 'Occupied';
        else status = seededRandom.current() < INITIAL_VACANCY_RATE ? 'Vacant' : 'Occupied';
      }
      
      let rent;
      if (usage === 'ShortTermRental') {
        // STR rent calculation:
        // Base nightly rate is roughly 0.1% of home value
        const nightlyRate = price * 0.001;
        // Assume 65% occupancy (typical for STR)
        const avgNightsPerMonth = 19.5; // 65% of 30 days
        rent = nightlyRate * avgNightsPerMonth;
      } else {
        // Regular long-term rental calculation
        const rentSpread = (price / 350000);
        rent = 1800 * rentSpread + (seededRandom.current() - 0.5) * 100;
      }
      
      if (ownerType === 'landlord') {
        totalLandlordCapital.current += price;
      }
      return { 
        id: `h_${i}`, 
        ownerType, 
        usage, 
        price, 
        rent, 
        status, 
        ownerIncome, 
        originalPrice: ownerType === 'landlord' ? price : undefined, 
        cumulativeRent: ownerType === 'landlord' ? 0 : undefined,
        nightlyRate: usage === 'ShortTermRental' ? rent / 19.5 : undefined 
      };
    });
    
    const newSeekerPool = Array.from({ length: initialSeekersCount }, (_, i) => ({
        id: `s_${nextSeekerId.current++}`,
        income: initialIncomes[i]
    }));
    
    const ownerOccupied = newHousingStock.filter(h => h.ownerType === 'homeowner').length;
    const landlords = newHousingStock.filter(h => h.ownerType === 'landlord').length;
    const prices = newHousingStock.map(h => h.price).sort((a,b)=>a-b);
    const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length/2)] : 0;
    const rents = newHousingStock.filter(h => h.ownerType !== 'homeowner').map(h => h.rent).sort((a,b)=>a-b);
    const medianRent = rents.length > 0 ? rents[Math.floor(rents.length/2)] : 0;
    const incomes = newSeekerPool.map(s => s.income).sort((a,b)=>a-b);
    const medianIncome = incomes.length > 0 ? incomes[Math.floor(incomes.length/2)] : 0;
    const homeownerIncomes = newHousingStock.filter(h => h.ownerType === 'homeowner' && h.ownerIncome).map(h => h.ownerIncome).sort((a, b) => a - b);
    const medianHomeownerIncome = homeownerIncomes.length > 0 ? homeownerIncomes[Math.floor(homeownerIncomes.length / 2)] : 0;
    initialStats.current = {
      ownerOccupied, landlords, medianPrice, medianRent, medianIncome, medianHomeownerIncome,
    };

    setHousingStock(sortHouses(newHousingStock, sortBy));
    setSeekerPool(newSeekerPool);

    const landlordConcentration = newHousingStock.filter(h => h.ownerType === 'landlord').length / newHousingStock.length;
    computeDisplayData(newHousingStock, newSeekerPool, initialStats.current, {
        landlordConcentration,
        approvalRate: 0.8,
        supplyDeficit: 0,
    });
  }, [initialSeekersCount, initialHomeowners, initialLandlords, computeDisplayData]);

  const advanceYear = useCallback(() => {
    const newStock = structuredClone(housingStock);
    let newSeekerPool = structuredClone(seekerPool);
    const randomInRange = (min, max) => min + seededRandom.current() * (max - min);

    let zoningApprovalChance = 0.8;
    let supplyDeficit = 0;

    if (collapseTriggered) {
        const collapseAffordabilityMultiplier = 1.5;
        
        const foreclosedHomes = newStock.filter(h => h.ownerType === 'homeowner' && seededRandom.current() < FORECLOSURE_RATE);

        foreclosedHomes.forEach(home => {
            newSeekerPool.push({ id: `s_${nextSeekerId.current++}`, income: randomInRange(...INCOME_TIERS.bottom.range) });
            const affordableSeekers = newSeekerPool.filter(s => s.income * collapseAffordabilityMultiplier >= home.price);
            const landlordWins = seededRandom.current() < 0.80; 

            if (landlordWins || affordableSeekers.length === 0) {
                home.ownerType = 'landlord';
                home.ownerIncome = null;
                home.usage = 'LongTermRental';
                home.status = 'Vacant';
                marketResults.current.purchasesByLandlord++;
            } else {
                const buyer = affordableSeekers.sort((a,b) => b.income - a.income)[0];
                home.ownerType = 'homeowner';
                home.ownerIncome = buyer.income;
                home.status = 'OwnerOccupied';
                marketResults.current.purchasesByHomeowner++;
                newSeekerPool = newSeekerPool.filter(s => s.id !== buyer.id);
            }
        });
        setCollapseTriggered(false);
    
    } else {
      unsoldInventory.current.forEach(home => {
        home.price *= 0.95;
      });

      cumulativeIncomeGrowth.current *= (1 + INCOME_GROWTH_RATE);
      newSeekerPool.forEach(seeker => { seeker.income *= (1 + INCOME_GROWTH_RATE); });
      newStock.forEach(home => { if(home.ownerIncome) home.ownerIncome *= (1 + INCOME_GROWTH_RATE); });
      
      const housedPopulation = newStock.filter(h => h.status !== 'Vacant' && h.usage !== 'ShortTermRental').length;
      const newEntrantCount = Math.floor((housedPopulation + newSeekerPool.length) * POPULATION_GROWTH_RATE);

      for (let i = 0; i < newEntrantCount; i++) {
        const roll = seededRandom.current();
        let baseIncome;
        if (roll < INCOME_TIERS.top.percent) baseIncome = randomInRange(...INCOME_TIERS.top.range);
        else if (roll < INCOME_TIERS.top.percent + INCOME_TIERS.middle.percent) baseIncome = randomInRange(...INCOME_TIERS.middle.range);
        else baseIncome = randomInRange(...INCOME_TIERS.bottom.range);
        newSeekerPool.push({ id: nextSeekerId.current++, income: baseIncome * cumulativeIncomeGrowth.current });
      }

      // Always include all unsold homes in the for-sale pool
      const unsoldHomes = newStock.filter(h => h.status === 'Unsold' || h.status === 'UnsoldNew');
      
      // Calculate homes that could newly enter the market
      const homesForSaleIndices = new Set();
      const newListingsCount = Math.floor(newStock.length * (turnoverRate / 100));
      while (homesForSaleIndices.size < newListingsCount && homesForSaleIndices.size < newStock.length) {
        const idx = Math.floor(seededRandom.current() * newStock.length);
        // Only add if it's not already unsold
        if (!unsoldHomes.includes(newStock[idx])) {
          homesForSaleIndices.add(idx);
        }
      }
      const newListings = Array.from(homesForSaleIndices).map(index => newStock[index]);

      // Calculate current median price for market context
      const currentPrices = [...newStock].map(h => h.price).sort((a,b) => a-b);
      const medianHomePrice = currentPrices[Math.floor(currentPrices.length/2)];

      // Combine new listings with existing unsold inventory
      const allForSale = [...newListings, ...unsoldHomes];
      unsoldInventory.current = [];

      newStock.forEach(home => {
        if (home.ownerType !== 'homeowner' && home.usage === 'LongTermRental' && home.status === 'Occupied' && seededRandom.current() < RENTAL_TURNOVER_RATE) {
            home.status = 'Vacant';
            if (seededRandom.current() < RE_ENTRANT_RATE) {
              const roll = seededRandom.current();
              let baseIncome;
              if (roll < INCOME_TIERS.top.percent) baseIncome = randomInRange(...INCOME_TIERS.top.range);
              else if (roll < INCOME_TIERS.top.percent + INCOME_TIERS.middle.percent) baseIncome = randomInRange(...INCOME_TIERS.middle.range);
              else baseIncome = randomInRange(...INCOME_TIERS.bottom.range);
              newSeekerPool.push({ id: `s_${nextSeekerId.current++}`, income: baseIncome * cumulativeIncomeGrowth.current });
            }
        }
      });

      // Calculate current market metrics
      const marketPrices = newStock.map(h => h.price).sort((a,b)=>a-b);
      const currentMedianPrice = marketPrices.length > 0 ? marketPrices[Math.floor(marketPrices.length/2)] : 0;
      
      const sellProperty = (home, medianPrice, isProtectedSale = false) => {
        const originalOwnerType = home.ownerType;
        if (originalOwnerType === 'landlord') {
          if (typeof home.originalPrice === 'number') {
            totalLandlordReturn.current += (home.price - home.originalPrice) + (home.cumulativeRent || 0);
            totalLandlordCapital.current -= home.originalPrice;
          }
        }
        // First, determine who can afford the home
        const affordableSeekers = newSeekerPool.filter(s => {
          const canAfford = s.income * AFFORDABILITY_MULTIPLIER >= home.price;
          // More lenient payment ratio check - using net price after down payment
          const downPayment = home.price * 0.20; // Assume 20% down payment
          const loanAmount = home.price - downPayment;
          const monthlyPayment = (loanAmount / AFFORDABILITY_MULTIPLIER) / 12;
          const monthlyIncome = s.income / 12;
          const paymentRatio = monthlyPayment / monthlyIncome;
          return canAfford && paymentRatio <= 0.36; // 36% DTI ratio max, more standard
        });
        
        const seekerInTheRunning = affordableSeekers.length > 0;
        
        const landlordOwnershipRatio = newStock.filter(h => h.ownerType === 'landlord').length / newStock.length;
        const landlordAllowed = landlordOwnershipRatio < (landlordCap / 100);

        // Determine winner based on market conditions
        let winnerType;

        // Always prioritize seeker if they can afford it and landlords are at cap
        if (!landlordAllowed && seekerInTheRunning) {
          winnerType = 'seeker';
        }
        // Protected sales (like foreclosures) strongly favor seekers
        else if (isProtectedSale && seekerInTheRunning) {
          winnerType = 'seeker';
        }
        // If landlords are allowed and home is significantly above median, they have advantage
        else if (landlordAllowed && home.price > currentMedianPrice * 1.2) {
          // But seekers still have a decent chance
          winnerType = seekerInTheRunning && seededRandom.current() > 0.7 ? 'seeker' : 'landlord';
        }
        // If no seekers can afford it and landlords can buy, it goes to landlord
        else if (landlordAllowed && !seekerInTheRunning) {
          winnerType = 'landlord';
        }
        // If landlords are restricted, treat all homes equally in seeker competition
        else if (!landlordAllowed && seekerInTheRunning) {
          winnerType = 'seeker';
        }
        // Normal competitive situation - give seekers better odds
        else if (landlordAllowed && seekerInTheRunning) {
          const CASH_OFFER_ADVANTAGE = 0.4; // Reduced from 0.6 to give seekers much better chance
          // Landlords only have advantage on more expensive homes
          if (seededRandom.current() < CASH_OFFER_ADVANTAGE && home.price > currentMedianPrice) {
            winnerType = 'landlord';
          } else {
            winnerType = 'seeker';
          }
        }
        // If we get here and no winner determined, we can't process the sale
        else {
          return;
        }

        const processWinner = (type) => {
          const wasOccupiedRental = home.ownerType !== 'homeowner' && home.status === 'Occupied';
          if (type === 'seeker') {
            const buyer = affordableSeekers.sort((a,b) => b.income - a.income)[0];
            home.ownerType = 'homeowner';
            home.usage = 'LongTermRental';
            home.status = 'OwnerOccupied';
            home.ownerIncome = buyer.income;
            home.originalPrice = home.price;
            home.cumulativeRent = 0;
            marketResults.current.purchasesByHomeowner++;
            newSeekerPool = newSeekerPool.filter(s => s.id !== buyer.id);
            if (wasOccupiedRental) {
              const roll = seededRandom.current();
              let baseIncome;
              if (roll < INCOME_TIERS.top.percent) baseIncome = randomInRange(...INCOME_TIERS.top.range);
              else if (roll < INCOME_TIERS.top.percent + INCOME_TIERS.middle.percent) baseIncome = randomInRange(...INCOME_TIERS.middle.range);
              else baseIncome = randomInRange(...INCOME_TIERS.bottom.range);
              newSeekerPool.push({ id: nextSeekerId.current++, income: baseIncome * cumulativeIncomeGrowth.current });
              
              marketResults.current.displacements++;
              const HOMELESSNESS_RISK_FACTOR = 0.15;
              if (seededRandom.current() < HOMELESSNESS_RISK_FACTOR) {
                  marketResults.current.pushedToHomelessness++;
              }
            }
          } else { 
            if(home.ownerType !== type) marketResults.current.purchasesByLandlord++;
            home.ownerType = 'landlord';
            home.ownerIncome = null;
            if (typeof home.price === 'number') {
              totalLandlordCapital.current += home.price;
            }
            home.originalPrice = home.price;
            home.cumulativeRent = 0;
            const strRatio = newStock.filter(h => h.usage === 'ShortTermRental').length / newStock.length;
            if (strRatio < STR_CAP_RATE && seededRandom.current() < STR_CONVERSION_CHANCE) {
              home.usage = 'ShortTermRental';
              marketResults.current.convertedToShortTerm++;
            } else {
              home.usage = 'LongTermRental';
            }
            if (wasOccupiedRental) {
                home.status = 'Occupied';
            } else {
                if (newSeekerPool.length > 0) {
                    home.status = 'Occupied';
                    newSeekerPool.shift();
                } else {
                    home.status = 'Vacant';
                }
            }
          }
              
          if (originalOwnerType === 'homeowner') {
            const sellerIncome = randomInRange(INCOME_TIERS.middle.range[0], INCOME_TIERS.top.range[0]);
            newSeekerPool.unshift({ id: `s_${nextSeekerId.current++}`, income: sellerIncome * cumulativeIncomeGrowth.current });
          }
        };
        processWinner(winnerType);
      };
      
      allForSale.forEach(home => {
        const beforeOwner = home.ownerType;
        const beforeStatus = home.status;
        if (home.ownerType === 'homeowner' && seededRandom.current() < HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE) {
          sellProperty(home, currentMedianPrice, true);
        } else {
          sellProperty(home, currentMedianPrice, false);
        }
        if (home.ownerType === beforeOwner && home.status === beforeStatus) {
          unsoldInventory.current.push(home);
        }
      });

      const landlordOwnershipRatio = newStock.filter(h => h.ownerType === 'landlord').length / newStock.length;
      zoningApprovalChance = 0.80;
      if (landlordOwnershipRatio > 0.30) {
        zoningApprovalChance -= (landlordOwnershipRatio - 0.30) * 2;
      }
      if (zoningApprovalChance < 0.1) zoningApprovalChance = 0.1;

      let actualHomesBuilt = 0;
      for (let i = 0; i < newHomes; i++) {
          if (seededRandom.current() < zoningApprovalChance) {
              actualHomesBuilt++;
              // Price new homes at median market price
              const newPrice = currentMedianPrice;
              const newHome = { 
                id: `h_${nextHomeId.current++}`, 
                price: newPrice, 
                rent: newPrice * 0.005, 
                status: 'UnsoldNew',
                ownerType: null,
                ownerIncome: null 
              };
              newStock.push(newHome);
              // If landlords are at cap, treat new homes like protected sales to favor seekers
              const isProtected = landlordOwnershipRatio >= (landlordCap / 100);
              sellProperty(newHome, currentMedianPrice, isProtected);
        if (!newHome.ownerType || newHome.status === 'UnsoldNew') {
          unsoldInventory.current.push(newHome);
        }
          }
      }
      supplyDeficit = newHomes - actualHomesBuilt;
      marketResults.current.totalSupplyDeficit += supplyDeficit;
    }

    const totalRentals = newStock.filter(h => h.ownerType !== 'homeowner' && h.usage === 'LongTermRental').length;
    const minVacant = Math.ceil(totalRentals * 0.015);
    let vacantUnits = newStock.filter(home => home.status === 'Vacant' && home.usage === 'LongTermRental');
    newSeekerPool.sort(() => seededRandom.current() - 0.5);
    vacantUnits.forEach((unit, idx) => {
      if (newSeekerPool.length > 0 && idx >= minVacant) {
        unit.status = 'Occupied';
        newSeekerPool.shift();
      }
    });

    const unhousedSeekers = newSeekerPool.length;
    // Appreciation rate is variable: for every 3 unsold homes, homes depreciate 1%
     const unsoldCount = unsoldInventory.current.length;
    // Calculate market conditions
    const landlordFactor = newStock.filter(h => h.ownerType === 'landlord').length / newStock.length;
    const canAddLandlords = landlordFactor < (landlordCap / 100);
    const unsoldRatio = unsoldCount / newStock.length;
    const seekerRatio = seekerPool.length / newStock.length;

    // Calculate how many seekers can actually buy
    const medianHomePrice = [...newStock].sort((a,b) => a.price - b.price)[Math.floor(newStock.length/2)].price;
    const qualifiedBuyers = seekerPool.filter(s => s.income * AFFORDABILITY_MULTIPLIER >= medianHomePrice).length;
    const qualifiedRatio = qualifiedBuyers / seekerPool.length;
    
    // Different rates for different market conditions
    const baseAppreciation = BASE_APPRECIATION;
    let depreciationRate = -0.05; // Start with 5% base depreciation
    
    // Make depreciation more severe when market is stuck
    if (!canAddLandlords) {
      depreciationRate = -0.10; // 10% depreciation when landlords are capped
      if (qualifiedBuyers === 0) {
        depreciationRate = -0.15; // 15% depreciation when no one can buy
      }
    }
    
    // Calculate appreciation based on market conditions
    let marketAppreciation = baseAppreciation;
    
    // Add appreciation based on market pressure
    if (canAddLandlords && qualifiedBuyers > 0) {
      // Add up to 5% based on ratio of qualified buyers
      marketAppreciation += qualifiedRatio * 0.05;
      
      // Add up to 3% based on seeker demand
      marketAppreciation += Math.min(0.03, seekerRatio * 0.1);
      
      // Add up to 4% for low inventory
      if (unsoldRatio < 0.05) {
        marketAppreciation += 0.04;
      } else if (unsoldRatio < 0.1) {
        marketAppreciation += 0.02;
      }
      
      // Population growth pressure
      const populationGrowth = POPULATION_GROWTH_RATE * cumulativeIncomeGrowth.current;
      marketAppreciation += populationGrowth * 0.5; // Add up to 2% based on population growth
    }
    
    // Cap the appreciation
    if (marketAppreciation > 0.12) marketAppreciation = 0.12; // Max 12% appreciation
    
    // Calculate rent changes
    let rentIncreaseRate = marketAppreciation + (unhousedSeekers * 0.001);
    if (rentIncreaseRate < 0) rentIncreaseRate = 0;
    if (rentIncreaseRate > MAX_RENT_INCREASE) rentIncreaseRate = MAX_RENT_INCREASE;
    
    newStock.forEach(home => {
      if (home.status === 'Unsold' || home.status === 'UnsoldNew') {
        // Unsold homes depreciate
        home.price *= (1 + depreciationRate);
      } else {
        // Other homes appreciate based on market conditions
        home.price *= (1 + marketAppreciation);
      }
      
      // Handle rent adjustments
      if (home.ownerType !== 'homeowner') {
        if (home.usage === 'ShortTermRental') {
          // Recalculate STR rates based on new home value and seasonal factors
          const baseNightlyRate = home.price * 0.001;
          const seasonalMultiplier = 1 + (Math.sin(year * Math.PI / 6) * 0.2); // ±20% seasonal variation
          home.nightlyRate = baseNightlyRate * seasonalMultiplier;
          // Adjust occupancy rate based on market conditions (65% base)
          const baseNights = 19.5; // 65% of 30 days
          const occupancyMultiplier = Math.max(0.8, Math.min(1.2, 1 + (unhousedSeekers / newStock.length))); // ±20% based on demand
          const avgNightsPerMonth = baseNights * occupancyMultiplier;
          home.rent = home.nightlyRate * avgNightsPerMonth;
        } else {
          // Regular rental increases
          home.rent *= (1 + rentIncreaseRate);
        }
        
        if (typeof home.cumulativeRent === 'number') {
          home.cumulativeRent += home.rent;
        }
      }
    });

    setHousingStock(sortHouses(newStock, sortBy));
    setSeekerPool(newSeekerPool);
    setYear(prevYear => prevYear + 1);

    const landlordConcentration = newStock.filter(h => h.ownerType === 'landlord').length / newStock.length;
    computeDisplayData(newStock, newSeekerPool, initialStats.current, {
        landlordConcentration,
        approvalRate: zoningApprovalChance,
        supplyDeficit,
    });
  }, [housingStock, seekerPool, turnoverRate, newHomes, computeDisplayData, collapseTriggered, landlordCap]);

  useEffect(() => {
    setupSimulation();
  }, [setupSimulation]);

  useEffect(() => {
    if (!simulationRunning) return;
    const intervalId = setInterval(() => {
      if (year >= yearsToRun) { setSimulationRunning(false); return; }
      advanceYear();
    }, simulationSpeed);
    return () => clearInterval(intervalId);
  }, [simulationRunning, yearsToRun, advanceYear, year, simulationSpeed]);

  const handleRunSimulation = () => setSimulationRunning(prev => !prev);
  const handleReset = () => {
  window.location.reload();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 font-sans mt-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
            U.S. Housing Market Simulation
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Macroeconomic model of regional listing volumes, inventory level indices, foreclosure rates, and market pricing dynamics.
          </p>
        </div>
        
        {/* Status display */}
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
          collapseTriggered 
            ? 'bg-rose-500/10 text-rose-455 text-rose-400 border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {collapseTriggered ? 'Market Crash Mode' : 'Standard Market'}
        </div>
      </div>

      {/* Info link banner */}
      <div className="mb-6 p-4 bg-slate-950/40 border border-slate-800 rounded-2xl text-xs md:text-sm text-slate-400 flex items-center gap-3">
        <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>
          To read about the mechanics of this simulation and download the source code, see the article: {' '}
          <a href="https://nextvaldata.com/blog/2025-09-14-an-imperfect-model-for-an-imperfect-market/" className="text-indigo-455 text-indigo-400 hover:text-indigo-300 underline font-semibold" target="_blank" rel="noopener noreferrer">An Imperfect Model for an Imperfect Market</a>.
        </span>
      </div>

      <main>
        {/* Statistics section */}
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-455 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Current Market Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8 w-full">
          <Card label="Total Population" value={displayData.totalPopulation} subValue="Housed & Seeking" />
          <Card label="Seeking Housing" value={displayData.seekerCount} />
          <Card label="Homeowners" value={displayData.homeowners} subValue={displayData.pctOwnerOccupied} />
          <Card label="Landlords" value={displayData.landlords} subValue={displayData.pctLandlords} />
          <Card label="Mortgage-Eligible" value={displayData.mortgageEligible} subValue="Cheapest Home Capable" />
          <Card label="Median Price" value={displayData.medianPrice ? `$${Math.round(displayData.medianPrice / 1000)}k` : 'N/A'} subValue={displayData.pctMedianPrice} />
          <Card label="Median Seeker Income" value={displayData.seekerCount > 0 ? `$${Math.round((displayData.medianIncome || 0)/1000)}k` : 'N/A'} subValue={displayData.pctMedianIncome} />
          <Card label="Median Homeowner Income" value={displayData.medianHomeownerIncome > 0 ? `$${Math.round(displayData.medianHomeownerIncome / 1000)}k` : 'N/A'} subValue={displayData.pctMedianHomeownerIncome} />
          <Card label="Median Rent" value={displayData.medianRent ? `$${Math.round(displayData.medianRent)}` : 'N/A'} subValue={displayData.pctMedianRent} />
          <Card label="Median Rent Burden" value={displayData.medianRentBurden} subValue="% of Seeker Income" />
          <Card label="Vacant Rentals" value={displayData.vacantRentals} subValue={`${displayData.vacancyRate} Rental Vacancy`} />
          <Card label="Short-Term Rentals" value={displayData.shortTermRentals} subValue="Total Units" />
        </div>

        {/* Visual housing grid */}
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-455 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V4zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V4zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Regional Housing Stock Map
        </h3>
        <div id="housing-visual-grid" className="grid grid-cols-[repeat(40,1fr)] gap-2 p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto w-full max-w-none">
          {housingStock.map((home, idx) => {
            let fill = '#64748b'; // default slate-500 gray
            if (home.status === 'OwnerOccupied') fill = '#10b981'; // emerald green
            else if (home.usage === 'LongTermRental' && home.status === 'Occupied') fill = '#3b82f6'; // vibrant blue
            else if (home.usage === 'LongTermRental' && home.status === 'Vacant') fill = '#93c5fd'; // light blue
            else if (home.status === 'UnsoldNew' || home.status === 'Unsold') fill = '#ffbf00'; // yellow
            else if (home.usage === 'ShortTermRental') fill = '#a21caf'; // purple
            
            const formatPrice = (price) => `$${Math.round(price).toLocaleString()}`;
            const getTooltipText = (home) => {
              let text = `ID: ${home.id}\nPrice: ${formatPrice(home.price)}`;
              if (home.ownerType === 'landlord' && home.rent) {
                if (home.usage === 'ShortTermRental') {
                  text += `\nNightly Rate: ${formatPrice(home.nightlyRate)}`;
                  text += `\nMonthly Revenue: ${formatPrice(home.rent)}`;
                } else {
                  text += `\nRent: ${formatPrice(home.rent)}/month`;
                }
              }
              return text;
            };
            
            const isTopRow = idx < 40;
            return (
              <div key={home.id} className="group relative transition-transform duration-150 hover:scale-110">
                <svg width="27" height="27" viewBox="0 0 24 24" className="mx-auto cursor-help" style={{height: '1.6875rem', width: '1.6875rem'}}>
                  <rect x="6" y="10" width="12" height="8" rx="1.5" fill={fill} />
                  <polygon points="12,3 4,11 20,11" fill={fill} />
                </svg>
                <div className={`absolute z-20 ${isTopRow ? 'top-full mt-2' : 'bottom-full mb-2'} left-1/2 transform -translate-x-1/2 px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl shadow-xl whitespace-pre opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}>
                  {getTooltipText(home)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls, Legend & Filters block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Main Simulation Actions Card */}
          <div className="lg:col-span-8 bg-slate-850 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4 w-full">
              <div className="flex gap-3 items-center">
                <button 
                  onClick={handleRunSimulation} 
                  className={`font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider text-white transition-all shadow-md ${
                    simulationRunning ? 'bg-orange-500 hover:bg-orange-655 hover:bg-orange-600' : 'bg-green-655 hover:bg-green-600 bg-green-600'
                  }`}
                >
                  {simulationRunning ? 'Pause' : 'Run'}
                </button>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Years to Run:</span>
                  <input 
                    type="number" 
                    value={yearsToRun} 
                    onChange={e => setYearsToRun(Math.max(0, Number(e.target.value)))} 
                    className="w-14 px-2 py-1 bg-slate-900 border border-slate-850 rounded-lg text-center font-bold text-white text-xs" 
                  />
                </div>
              </div>
              
              <div className="text-sm font-black text-white flex items-center gap-2 ml-auto">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Current Cycle</span>
                <span className="font-mono text-base text-indigo-400">Year {year}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button 
                onClick={handleReset} 
                disabled={simulationRunning} 
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700/80 px-4 py-2 rounded-xl text-xs text-slate-350 transition-all font-bold disabled:opacity-50"
              >
                Reset
              </button>
              <button 
                onClick={advanceYear} 
                disabled={simulationRunning} 
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700/80 px-4 py-2 rounded-xl text-xs text-slate-350 transition-all font-bold disabled:opacity-50"
              >
                Advance Year
              </button>
              <button 
                onClick={() => setCollapseTriggered(true)} 
                disabled={simulationRunning || collapseTriggered} 
                className="font-bold border border-red-500/30 hover:border-red-500 text-red-400 px-4 py-2 rounded-xl bg-red-950/10 hover:bg-red-950/30 text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
              >
                Trigger Mortgage Collapse
              </button>
            </div>
          </div>

          {/* Map Legend Card */}
          <div className="lg:col-span-4 bg-slate-850 p-5 rounded-2xl border border-slate-800 flex flex-col justify-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-800 pb-2">
              Status Map Legend
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background:'#10b981'}}></div>Owner Occupied</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background:'#3b82f6'}}></div>Rental Occupied</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background:'#93c5fd'}}></div>Rental Vacant</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background:'#a21caf'}}></div>Short-Term Rental</div>
              <div className="flex items-center gap-2 col-span-2"><div className="w-3 h-3 rounded-full" style={{background:'#ffbf00'}}></div>Unsold Homes / Listings</div>
            </div>
          </div>
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-4 py-3 px-5 bg-slate-850 rounded-2xl border border-slate-800 mt-6 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Sort Map by:</span>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setSortBy('color');
                setHousingStock(prev => sortHouses([...prev], 'color'));
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider ${
                sortBy === 'color' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
              }`}
            >
              Status Color
            </button>
            <button 
              onClick={() => {
                setSortBy('price');
                setHousingStock(prev => sortHouses([...prev], 'price'));
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider ${
                sortBy === 'price' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
              }`}
            >
              Price
            </button>
            <button 
              onClick={() => {
                setSortBy('id');
                setHousingStock(prev => sortHouses([...prev], 'id'));
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider ${
                sortBy === 'id' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
              }`}
            >
              Lot ID
            </button>
          </div>
        </div>

        {/* Parameters input grid */}
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 mt-6">
          <h4 className="text-sm font-bold text-slate-305 text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Simulation Variables
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Init Owners</label>
              <input
                type="number"
                value={initialHomeowners}
                onChange={e => updateBalancedOwnership('homeowners', Number(e.target.value))}
                className="mt-1 px-2.5 py-1.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-lg text-white font-bold text-xs w-full text-center"
                min="0"
                max={HOMES_TOTAL}
              />
            </div>
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Init Landlords</label>
              <input
                type="number"
                value={initialLandlords}
                onChange={e => updateBalancedOwnership('landlords', Number(e.target.value))}
                className="mt-1 px-2.5 py-1.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-lg text-white font-bold text-xs w-full text-center"
                min="0"
                max={HOMES_TOTAL}
              />
            </div>
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Seeker Pool</label>
              <input
                type="number"
                value={initialSeekersCount}
                onChange={e => setInitialSeekersCount(Number(e.target.value))}
                className="mt-1 px-2.5 py-1.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-lg text-white font-bold text-xs w-full text-center"
              />
            </div>
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">New Homes/Yr</label>
              <input
                type="number"
                value={newHomes}
                onChange={e => setNewHomes(Number(e.target.value))}
                className="mt-1 px-2.5 py-1.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-lg text-white font-bold text-xs w-full text-center"
              />
            </div>
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Turnover %</label>
              <input
                type="number"
                value={turnoverRate}
                onChange={e => setTurnoverRate(Number(e.target.value))}
                className="mt-1 px-2.5 py-1.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-lg text-white font-bold text-xs w-full text-center"
              />
            </div>
            <div className="flex flex-col bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Landlord Cap %</label>
              <input
                type="number"
                value={landlordCap}
                onChange={e => setLandlordCap(Number(e.target.value))}
                className="mt-1 px-2.5 py-1.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-lg text-white font-bold text-xs w-full text-center"
              />
            </div>
          </div>
        </div>

        {/* Results section */}
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 mt-8 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-455 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Simulation Aggregated Results
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mt-4 mb-4 w-full">
          <Card label="Total Unsold Homes" value={housingStock.filter(h => h.status === 'Unsold' || h.status === 'UnsoldNew').length} />
          <Card label="Homeowner Purchases" value={marketResults.current.purchasesByHomeowner || 0} />
          <Card label="Landlord Purchases" value={marketResults.current.purchasesByLandlord || 0} />
          <Card label="Converted to STR" value={marketResults.current.convertedToShortTerm || 0} />
          <Card label="Displacements" value={marketResults.current.displacements || 0} />
        </div>
      </main>
    </div>
  );
}

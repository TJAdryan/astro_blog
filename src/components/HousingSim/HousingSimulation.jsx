
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import weights from './housing_weights.json';

// --- Constants from JSON ---
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
  <div className="bg-white p-3 rounded-lg shadow text-center">
    <label className="block text-xs text-gray-500 mb-1 font-medium">{label}</label>
    <span className="text-xl font-bold text-gray-800">{value}</span>
    {subValue && <span className="block text-sm font-bold text-green-600">{subValue}</span>}
  </div>
);

// --- Main App Component ---
export default function HousingSimulation() {
  // --- Input State (configurable by user) ---
  const [turnoverRate, setTurnoverRate] = useState(4);
  const [newHomes, setNewHomes] = useState(3);
  const [yearsToRun, setYearsToRun] = useState(10); 
  const [initialSeekersCount, setInitialSeekersCount] = useState(36);
  const [initialHomeowners, setInitialHomeowners] = useState(225);
  const [initialLandlords, setInitialLandlords] = useState(75);
  const [landlordCap, setLandlordCap] = useState(45);
  
  // --- Simulation State (runs the model) ---
  const [year, setYear] = useState(1);
  const [housingStock, setHousingStock] = useState([]);
  const [seekerPool, setSeekerPool] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(500);
  const [collapseTriggered, setCollapseTriggered] = useState(false);

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
    const color = change >= 0 ? 'text-green-600' : 'text-red-600';
    return <span className={color}>{`${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}</span>;
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
    const mortgageEligible = seekers.filter(s => s.income * AFFORDABILITY_MULTIPLIER >= medianPrice).length;
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
        const topCount = Math.floor(count * 0.50);
        const middleCount = count - topCount;
        for (let i = 0; i < topCount; i++) incomes.push(randomInRange(...INCOME_TIERS.top.range));
        for (let i = 0; i < middleCount; i++) incomes.push(randomInRange(...INCOME_TIERS.middle.range));
        return incomes.sort((a, b) => a - b);
    };

    const generateSortedData = (count, median, spread) => {
        const data = [median];
        for(let i = 1; i <= Math.floor((count - 1) / 2); i++) {
            data.push(median + seededRandom.current() * i * spread);
            data.unshift(median - seededRandom.current() * i * spread);
        }
        if (count % 2 === 0) {
           data.push(median + seededRandom.current() * (count/2) * spread);
        }
        return data.sort((a,b) => a-b);
    };

    const initialPrices = generateSortedData(HOMES_TOTAL, 350000, 1000);
    const initialIncomes = generateTieredIncomes(initialSeekersCount);
    
    let adjHomeowners = initialHomeowners;
    let adjLandlords = initialLandlords;
    if (adjHomeowners + adjLandlords !== HOMES_TOTAL) {
      adjLandlords = HOMES_TOTAL - adjHomeowners;
    }
    
    const initialHomeownerIncomes = generateHomeownerIncomes(adjHomeowners);
    let homeownerIncomeIndex = 0;

    const newHousingStock = Array.from({ length: HOMES_TOTAL }, (_, i) => {
      const ownerType = i < adjLandlords ? 'landlord' : 'homeowner';
      const price = initialPrices[i];
      const usage = (ownerType === 'landlord' && i < 3) ? 'ShortTermRental' : 'LongTermRental';
      let status;
      let ownerIncome = null;

      if (ownerType === 'homeowner') {
        status = 'OwnerOccupied';
        ownerIncome = initialHomeownerIncomes[homeownerIncomeIndex++];
      } else {
        if (usage === 'ShortTermRental') status = 'Occupied';
        else status = seededRandom.current() < INITIAL_VACANCY_RATE ? 'Vacant' : 'Occupied';
      }
      
      const rentSpread = (price / 350000);
      const rent = 2000 * rentSpread + (seededRandom.current() - 0.5) * 100;
      if (ownerType === 'landlord') {
        totalLandlordCapital.current += price;
      }
      return { id: i, ownerType, usage, price, rent, status, ownerIncome, originalPrice: ownerType === 'landlord' ? price : undefined, cumulativeRent: ownerType === 'landlord' ? 0 : undefined };
    });
    
    const newSeekerPool = Array.from({ length: initialSeekersCount }, (_, i) => ({
        id: nextSeekerId.current++,
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

    setHousingStock(newHousingStock);
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
        console.log("--- MORTGAGE COLLAPSE YEAR TRIGGERED ---");
        const collapseAffordabilityMultiplier = 1.5;
        
        const foreclosedHomes = newStock.filter(h => h.ownerType === 'homeowner' && seededRandom.current() < FORECLOSURE_RATE);

        foreclosedHomes.forEach(home => {
            newSeekerPool.push({ id: nextSeekerId.current++, income: randomInRange(...INCOME_TIERS.bottom.range) });
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

      const homesForSaleIndices = new Set();
      const homesForSaleCount = Math.floor(newStock.length * (turnoverRate / 100));
      while (homesForSaleIndices.size < homesForSaleCount && homesForSaleIndices.size < newStock.length) {
        homesForSaleIndices.add(Math.floor(seededRandom.current() * newStock.length));
      }
      const homesForSale = Array.from(homesForSaleIndices).map(index => newStock[index]);

      const allForSale = [...homesForSale, ...unsoldInventory.current];
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
              newSeekerPool.push({ id: nextSeekerId.current++, income: baseIncome * cumulativeIncomeGrowth.current });
            }
        }
      });

      const currentPrices = newStock.map(h => h.price).sort((a,b)=>a-b);
      const currentMedianPrice = currentPrices.length > 0 ? currentPrices[Math.floor(currentPrices.length/2)] : 0;
      
      const sellProperty = (home, medianPrice, isProtectedSale = false) => {
        const originalOwnerType = home.ownerType;
        if (originalOwnerType === 'landlord') {
          if (typeof home.originalPrice === 'number') {
            totalLandlordReturn.current += (home.price - home.originalPrice) + (home.cumulativeRent || 0);
            totalLandlordCapital.current -= home.originalPrice;
          }
        }
        const affordableSeekers = newSeekerPool.filter(s => s.income * AFFORDABILITY_MULTIPLIER >= home.price);
        const seekerInTheRunning = affordableSeekers.length > 0;
        
        const landlordOwnershipRatio = newStock.filter(h => h.ownerType === 'landlord').length / newStock.length;
        const landlordAllowed = landlordOwnershipRatio < (landlordCap / 100);

        let winnerType;

        if (isProtectedSale && seekerInTheRunning) {
          winnerType = 'seeker';
        } else if (!landlordAllowed && seekerInTheRunning) {
          winnerType = 'seeker';
        } else if (landlordAllowed && !seekerInTheRunning) {
          winnerType = 'landlord';
        } else if (landlordAllowed && seekerInTheRunning) {
          const CASH_OFFER_ADVANTAGE = 0.75;
          if (seededRandom.current() < CASH_OFFER_ADVANTAGE) {
            winnerType = 'landlord';
          } else {
            winnerType = 'seeker';
          }
        } else {
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
            newSeekerPool.unshift({ id: nextSeekerId.current++, income: sellerIncome * cumulativeIncomeGrowth.current });
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
              const newPrice = currentMedianPrice * 1.15;
              const newHome = { id: newStock.length + 1 + i, price: newPrice, rent: newPrice * 0.005, status: 'Vacant', ownerIncome: null };
              newStock.push(newHome);
              sellProperty(newHome, currentMedianPrice, false);
        if (newHome.ownerType === undefined || newHome.status === 'Vacant') {
          newHome.status = 'Unsold';
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
    let appreciationRate;
    if (unsoldCount === 0) {
      appreciationRate = BASE_APPRECIATION + 0.01 + (unhousedSeekers * 0.0005) + ((3 - newHomes) * 0.01);
    } else {
      appreciationRate = BASE_APPRECIATION - 0.005 * Math.floor(unsoldCount / 3) + (unhousedSeekers * 0.0005) + ((3 - newHomes) * 0.01);
      if (appreciationRate < -0.01) appreciationRate = -0.01;
    }
  let rentIncreaseRate = appreciationRate + (unhousedSeekers * 0.001);
  if (rentIncreaseRate < 0) rentIncreaseRate = 0;
  if (rentIncreaseRate > MAX_RENT_INCREASE) rentIncreaseRate = MAX_RENT_INCREASE;
    
    newStock.forEach(home => {
      home.price *= (1 + appreciationRate);
      if (home.ownerType !== 'homeowner') {
        home.rent *= (1 + rentIncreaseRate);
        if (typeof home.cumulativeRent === 'number') {
          home.cumulativeRent += home.rent;
        }
      }
    });

    setHousingStock(newStock);
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
    setSimulationRunning(false);
    setCollapseTriggered(false);
    setYear(1);
    setTurnoverRate(4);
    setNewHomes(3);
    setYearsToRun(10);
    setInitialSeekersCount(36);
    setInitialHomeowners(225);
    setInitialLandlords(75);
    setLandlordCap(45);
    setSimulationSpeed(500);
    setupSimulation();
  };

  return (
    <div className="bg-slate-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
  <div className="max-w-7xl mx-auto">

        
  <div className="space-y-2 mb-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="bg-white p-3 rounded-lg shadow flex gap-4 items-center">
            <div>
              <label className="text-xs font-medium text-gray-500 block">Sale Turnover (%)</label>
              <input type="number" value={turnoverRate} onChange={e => setTurnoverRate(Math.max(0, Number(e.target.value)))} className="w-24 p-1 border rounded-md text-center"/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block">New Homes / Year</label>
              <input type="number" value={newHomes} onChange={e => setNewHomes(Math.max(0, Number(e.target.value)))} className="w-24 p-1 border rounded-md text-center"/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block">Initial Seekers</label>
              <input type="number" value={initialSeekersCount} onChange={e => setInitialSeekersCount(Math.max(0, Number(e.target.value)))} className="w-24 p-1 border rounded-md text-center"/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block">Landlord Cap (%)</label>
              <input type="number" value={landlordCap} onChange={e => setLandlordCap(Math.max(0, Number(e.target.value)))} className="w-24 p-1 border rounded-md text-center"/>
            </div>
          </div>
           <div className="bg-white p-3 rounded-lg shadow flex gap-4 items-center">
            <div>
              <label className="text-xs font-medium text-gray-500 block">Homeowners</label>
              <input type="number" value={initialHomeowners} min={0} max={HOMES_TOTAL} onChange={e => setInitialHomeowners(Math.max(0, Number(e.target.value)))} className="w-24 p-1 border rounded-md text-center" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block">Landlords</label>
              <input type="number" value={initialLandlords} min={0} max={HOMES_TOTAL} onChange={e => setInitialLandlords(Math.max(0, Number(e.target.value)))} className="w-24 p-1 border rounded-md text-center" />
            </div>
          </div>
        </div>
      </div>
        </div>
        
        <main>
          <h3 className="text-2xl font-bold text-center mb-4">Current Market Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8 w-full">
            <Card label="Total Population" value={displayData.totalPopulation} subValue="Housed & Seeking" />
            <Card label="Seeking Housing" value={displayData.seekerCount} />
            <Card label="Homeowners" value={displayData.homeowners} subValue={displayData.pctOwnerOccupied} />
            <Card label="Landlords" value={displayData.landlords} subValue={displayData.pctLandlords} />
            <Card label="Mortgage-Eligible Seekers" value={displayData.mortgageEligible} subValue="Can Afford Median Home" />
            <Card label="Median Home Price" value={`$${Math.round((displayData.medianPrice || 0) / 1000)}k`} subValue={displayData.pctMedianPrice} />
            <Card label="Median Seeker Income" 
                  value={displayData.seekerCount > 0 ? `$${Math.round((displayData.medianIncome || 0)/1000)}k` : 'N/A'} 
                  subValue={displayData.pctMedianIncome} />
            <Card 
              label="Median Homeowner Income" 
              value={displayData.medianHomeownerIncome > 0 ? `$${Math.round(displayData.medianHomeownerIncome / 1000)}k` : 'N/A'}
              subValue={displayData.pctMedianHomeownerIncome}
            />
            <Card label="Median Rent" value={`$${Math.round(displayData.medianRent || 0)}`} subValue={displayData.pctMedianRent} />
            <Card label="Median Rent Burden" value={displayData.medianRentBurden} subValue="% of Median Seeker Income" />
            <Card label="Vacant Rental Units" value={displayData.vacantRentals} subValue={`${displayData.vacancyRate} Rental Rate`} />
            <Card label="Short-Term Rentals" value={displayData.shortTermRentals} subValue="Total Units" />
          </div>



          <div id="housing-visual-grid" className="grid grid-cols-30 gap-0.5 p-4 bg-gray-300 rounded-lg mx-auto w-full overflow-x-auto">
            {[...housingStock]
              .sort((a, b) => {
                // Group by: OwnerOccupied, Rental Occupied, Rental Vacant, Unsold New, ShortTermRental
                const getSortPriority = (home) => {
                  if (home.status === 'OwnerOccupied') return 0;
                  if (home.usage === 'LongTermRental' && home.status === 'Occupied') return 1;
                  if (home.usage === 'LongTermRental' && home.status === 'Vacant') return 2;
                  if (home.status === 'UnsoldNew') return 3;
                  if (home.usage === 'ShortTermRental') return 4;
                  return 5;
                };
                // Within each group, sort by price descending for visual trend
                const priA = getSortPriority(a);
                const priB = getSortPriority(b);
                if (priA !== priB) return priA - priB;
                return (b.price || 0) - (a.price || 0);
              })
              .map(home => {
                // Color palette: group similar types with related shades
                let fill = '#9ca3af'; // default gray
                if (home.status === 'OwnerOccupied') fill = '#22c55e'; // green
                else if (home.usage === 'LongTermRental' && home.status === 'Occupied') fill = '#1e40af'; // dark blue
                else if (home.usage === 'LongTermRental' && home.status === 'Vacant') fill = '#60a5fa'; // light blue
                else if (home.status === 'UnsoldNew' || home.status === 'Unsold') fill = '#ffbf00'; // yellow for all unsold homes
                else if (home.usage === 'ShortTermRental') fill = '#a21caf'; // purple
                return (
                  <svg key={home.id} width="36" height="36" viewBox="0 0 24 24" className="mx-auto" style={{height: '2.25rem', width: '2.25rem'}}>
                    <rect x="6" y="10" width="12" height="8" rx="2" fill={fill} />
                    <polygon points="12,4 4,12 20,12" fill={fill} />
                  </svg>
                );
              })}
          </div>

           <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm p-4 bg-white rounded-lg shadow">
           <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm p-4 bg-white rounded-lg shadow">
            <div className="flex gap-3 items-center justify-center">
              <button onClick={handleRunSimulation} className={`font-bold px-4 py-2 rounded-md text-white ${simulationRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>{simulationRunning ? 'Pause' : 'Run'}</button>
              <input type="number" value={yearsToRun} onChange={e => setYearsToRun(Math.max(0, Number(e.target.value)))} className="w-16 p-1 border rounded-md text-center" />
            </div>
            <div className="flex items-center gap-4 justify-center mt-2">
              <button onClick={handleReset} disabled={simulationRunning} className="border border-gray-400 px-3 py-2 rounded-md bg-white hover:bg-gray-100">Reset</button>
              <button onClick={advanceYear} disabled={simulationRunning} className="border border-gray-400 px-3 py-2 rounded-md bg-white hover:bg-gray-100">Advance Year</button>
              <button onClick={() => setCollapseTriggered(true)} disabled={simulationRunning || collapseTriggered} className="font-bold border border-red-500 text-red-600 px-3 py-2 rounded-md bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed">Trigger Mortgage Collapse</button>
              <div className="text-2xl font-bold">Year: <span>{year}</span></div>
            </div>
          </div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{background:'#22c55e'}}></div>Owner Occupied</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{background:'#1e40af'}}></div>Rental Occupied</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{background:'#60a5fa'}}></div>Rental Vacant</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{background:'#a21caf'}}></div>Short-Term Rental</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{background:'#ffbf00'}}></div>Unsold Homes</div>
           </div>

           <hr className="my-5" />

          <h3 className="text-2xl font-bold text-center mb-2">Simulation Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-4 mb-4 w-full">
            <Card label="Total Unsold Homes" value={housingStock.filter(h => h.status === 'Unsold' || h.status === 'UnsoldNew').length} />
            <Card label="Homeowner Purchases" value={marketResults.current.purchasesByHomeowner} />
            <Card label="Landlord Purchases" value={marketResults.current.purchasesByLandlord} />
            <Card label="Converted to STR" value={marketResults.current.convertedToShortTerm} />
            <Card label="Displacements" value={marketResults.current.displacements} />
          </div>
        </main>
      </div>
    </div>
  );
}
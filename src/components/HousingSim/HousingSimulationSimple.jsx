import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Simulation Constants (the "weights and measures") ---
// These are all defined here to make the simulation self-contained.
// You can easily adjust these values to see how they impact the outcome.
const HOMES_TOTAL = 300;
const INITIAL_SEED = 12345;
const POPULATION_GROWTH_RATE = 0.01;
const INCOME_GROWTH_RATE = 0.01;
const AFFORDABILITY_MULTIPLIER = 3.5;
const BASE_APPRECIATION = 0.02;
const INITIAL_VACANCY_RATE = 0.03;
const RENTAL_TURNOVER_RATE = 0.15;
const RE_ENTRANT_RATE = 0.50;
const STR_CONVERSION_CHANCE = 0.05;
const STR_CAP_RATE = 0.10;
const MAX_RENT_INCREASE = 0.15;
const HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE = 0.20;
const FORECLOSURE_RATE = 0.05;
const INCOME_TIERS = {
    top: { percent: 0.2, range: [100000, 250000] },
    middle: { percent: 0.5, range: [50000, 100000] },
    bottom: { percent: 0.3, range: [25000, 50000] }
};

// --- Helper Components ---
const Card = ({ label, value, subValue }) => (
    <div className="bg-white p-3 rounded-lg shadow text-center flex flex-col items-center justify-center">
        <label className="block text-xs text-gray-500 mb-1 font-medium">{label}</label>
        <span className="text-xl font-bold text-gray-800">{value}</span>
        {subValue && <span className="block text-sm font-bold text-green-600">{subValue}</span>}
    </div>
);

// --- Core Simulation Logic ---
// These functions are now inside the main file, making the app self-contained.

let seededRandom;
let nextSeekerId;
let cumulativeIncomeGrowth;
let marketResults;
let totalLandlordCapital;
let totalLandlordReturn;
let unsoldInventory;

function createSeededRandom(seed) {
    let state = seed;
    return function () {
        state = (state * 1664525 + 1013904223) % 2 ** 32;
        return state / 2 ** 32;
    };
}

function generateTieredIncomes(count, isHomeownerIncomes = false) {
    const incomes = [];
    const randomInRange = (min, max) => min + seededRandom() * (max - min);

    let topCount, middleCount, bottomCount;
    if (isHomeownerIncomes) {
        topCount = Math.floor(count * 0.50);
        middleCount = count - topCount;
        bottomCount = 0;
    } else {
        topCount = Math.floor(count * INCOME_TIERS.top.percent);
        middleCount = Math.floor(count * INCOME_TIERS.middle.percent);
        bottomCount = count - topCount - middleCount;
    }

    for (let i = 0; i < topCount; i++) incomes.push(randomInRange(...INCOME_TIERS.top.range));
    for (let i = 0; i < middleCount; i++) incomes.push(randomInRange(...INCOME_TIERS.middle.range));
    for (let i = 0; i < bottomCount; i++) incomes.push(randomInRange(...INCOME_TIERS.bottom.range));

    return incomes.sort((a, b) => a - b);
}

function generateSortedData(count, median, spread) {
    const data = [median];
    for (let i = 1; i <= Math.floor((count - 1) / 2); i++) {
        data.push(median + seededRandom() * i * spread);
        data.unshift(median - seededRandom() * i * spread);
    }
    if (count % 2 === 0) {
        data.push(median + seededRandom() * (count / 2) * spread);
    }
    return data.sort((a, b) => a - b);
}

function setupSimulation(params) {
    const { initialSeekersCount, initialHomeowners, initialLandlords } = params;

    unsoldInventory = [];
    nextSeekerId = 0;
    seededRandom = createSeededRandom(INITIAL_SEED);
    cumulativeIncomeGrowth = 1.0;
    marketResults = {
        purchasesByHomeowner: 0,
        purchasesByLandlord: 0,
        convertedToShortTerm: 0,
        displacements: 0,
        totalSupplyDeficit: 0,
        pushedToHomelessness: 0,
    };
    totalLandlordCapital = 0;
    totalLandlordReturn = 0;

    const initialPrices = generateSortedData(HOMES_TOTAL, 350000, 1000);
    const initialSeekerIncomes = generateTieredIncomes(initialSeekersCount);

    let adjHomeowners = initialHomeowners;
    let adjLandlords = initialLandlords;
    if (adjHomeowners + adjLandlords !== HOMES_TOTAL) {
        adjLandlords = HOMES_TOTAL - adjHomeowners;
    }

    const initialHomeownerIncomes = generateTieredIncomes(adjHomeowners, true);
    let homeownerIncomeIndex = 0;

    const housingStock = Array.from({ length: HOMES_TOTAL }, (_, i) => {
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
            else status = seededRandom() < INITIAL_VACANCY_RATE ? 'Vacant' : 'Occupied';
        }

        const rentSpread = (price / 350000);
        const rent = 2000 * rentSpread + (seededRandom() - 0.5) * 100;
        if (ownerType === 'landlord') {
            totalLandlordCapital += price;
        }

        return { id: i, ownerType, usage, price, rent, status, ownerIncome, originalPrice: ownerType === 'landlord' ? price : undefined, cumulativeRent: ownerType === 'landlord' ? 0 : undefined };
    });

    const seekerPool = Array.from({ length: initialSeekersCount }, (_, i) => ({
        id: nextSeekerId++,
        income: initialSeekerIncomes[i]
    }));

    const colorOrderSort = (a, b) => {
        const getColorOrder = (home) => {
            if (home.status === 'OwnerOccupied') return 0;
            if (home.usage === 'LongTermRental' && home.status === 'Occupied') return 1;
            if (home.usage === 'LongTermRental' && home.status === 'Vacant') return 2;
            if (home.usage === 'ShortTermRental') return 3;
            return 4;
        };
        return getColorOrder(a) - getColorOrder(b);
    };

    housingStock.sort(colorOrderSort);

    return {
        housingStock,
        seekerPool,
        marketResults,
        initialStats: {
            ownerOccupied: housingStock.filter(h => h.ownerType === 'homeowner').length,
            landlords: housingStock.filter(h => h.ownerType === 'landlord').length,
            medianPrice: housingStock.map(h => h.price).sort((a, b) => a - b)[Math.floor(housingStock.length / 2)],
            medianRent: housingStock.filter(h => h.ownerType !== 'homeowner').map(h => h.rent).sort((a, b) => a - b)[Math.floor(housingStock.filter(h => h.ownerType !== 'homeowner').length / 2)],
            medianIncome: seekerPool.map(s => s.income).sort((a, b) => a - b)[Math.floor(seekerPool.length / 2)],
            medianHomeownerIncome: housingStock.filter(h => h.ownerType === 'homeowner' && h.ownerIncome).map(h => h.ownerIncome).sort((a, b) => a - b)[Math.floor(housingStock.filter(h => h.ownerType === 'homeowner' && h.ownerIncome).length / 2)]
        }
    };
}

function advanceYear(currentState, params) {
    const { turnoverRate, newHomes, landlordCap, collapseTriggered } = params;

    let { housingStock, seekerPool, marketResults } = structuredClone(currentState);
    marketResults.purchasesByHomeowner = 0;
    marketResults.purchasesByLandlord = 0;
    marketResults.convertedToShortTerm = 0;
    marketResults.displacements = 0;
    marketResults.totalSupplyDeficit = 0;
    marketResults.pushedToHomelessness = 0;
    const randomInRange = (min, max) => min + seededRandom() * (max - min);

    if (collapseTriggered) {
        const collapseAffordabilityMultiplier = 1.5;
        const foreclosedHomes = housingStock.filter(h => h.ownerType === 'homeowner' && seededRandom() < FORECLOSURE_RATE);

        foreclosedHomes.forEach(home => {
            seekerPool.push({ id: nextSeekerId++, income: randomInRange(...INCOME_TIERS.bottom.range) });
            const affordableSeekers = seekerPool.filter(s => s.income * collapseAffordabilityMultiplier >= home.price);
            const landlordWins = seededRandom() < 0.80;

            if (landlordWins || affordableSeekers.length === 0) {
                home.ownerType = 'landlord';
                home.ownerIncome = null;
                home.usage = 'LongTermRental';
                home.status = 'Vacant';
                marketResults.purchasesByLandlord++;
            } else {
                const buyer = affordableSeekers.sort((a, b) => b.income - a.income)[0];
                home.ownerType = 'homeowner';
                home.ownerIncome = buyer.income;
                home.status = 'OwnerOccupied';
                marketResults.purchasesByHomeowner++;
                seekerPool = seekerPool.filter(s => s.id !== buyer.id);
            }
        });
        return { housingStock, seekerPool, marketResults, yearStats: { landlordConcentration: 0, approvalRate: 0, supplyDeficit: 0 } };
    }

    unsoldInventory.forEach(home => {
        home.price *= 0.95;
    });

    cumulativeIncomeGrowth *= (1 + INCOME_GROWTH_RATE);
    seekerPool.forEach(seeker => { seeker.income *= (1 + INCOME_GROWTH_RATE); });
    housingStock.forEach(home => { if (home.ownerIncome) home.ownerIncome *= (1 + INCOME_GROWTH_RATE); });

    const housedPopulation = housingStock.filter(h => h.status !== 'Vacant' && h.usage !== 'ShortTermRental').length;
    const newEntrantCount = Math.floor((housedPopulation + seekerPool.length) * POPULATION_GROWTH_RATE);
    for (let i = 0; i < newEntrantCount; i++) {
        const roll = seededRandom();
        let baseIncome;
        if (roll < INCOME_TIERS.top.percent) baseIncome = randomInRange(...INCOME_TIERS.top.range);
        else if (roll < INCOME_TIERS.top.percent + INCOME_TIERS.middle.percent) baseIncome = randomInRange(...INCOME_TIERS.middle.range);
        else baseIncome = randomInRange(...INCOME_TIERS.bottom.range);
        seekerPool.push({ id: nextSeekerId++, income: baseIncome * cumulativeIncomeGrowth });
    }

    const homesForSaleIndices = new Set();
    const homesForSaleCount = Math.floor(housingStock.length * (turnoverRate / 100));
    while (homesForSaleIndices.size < homesForSaleCount && homesForSaleIndices.size < housingStock.length) {
        homesForSaleIndices.add(Math.floor(seededRandom() * housingStock.length));
    }
    const homesForSale = Array.from(homesForSaleIndices).map(index => housingStock[index]);
    const allForSale = [...homesForSale, ...unsoldInventory];
    unsoldInventory = [];

    housingStock.forEach(home => {
        if (home.ownerType !== 'homeowner' && home.usage === 'LongTermRental' && home.status === 'Occupied' && seededRandom() < RENTAL_TURNOVER_RATE) {
            home.status = 'Vacant';
            if (seededRandom() < RE_ENTRANT_RATE) {
                const newIncome = generateTieredIncomes(1)[0];
                seekerPool.push({ id: nextSeekerId++, income: newIncome * cumulativeIncomeGrowth });
            }
        }
    });

    const currentPrices = housingStock.map(h => h.price).sort((a, b) => a - b);
    const currentMedianPrice = currentPrices.length > 0 ? currentPrices[Math.floor(currentPrices.length / 2)] : 0;
    const sellProperty = (home, isProtectedSale = false) => {
        const originalOwnerType = home.ownerType;
        if (originalOwnerType === 'landlord' && typeof home.originalPrice === 'number') {
            totalLandlordReturn += (home.price - home.originalPrice) + (home.cumulativeRent || 0);
            totalLandlordCapital -= home.originalPrice;
        }

        const affordableSeekers = seekerPool.filter(s => s.income * AFFORDABILITY_MULTIPLIER >= home.price);
        const seekerInTheRunning = affordableSeekers.length > 0;
        const landlordOwnershipRatio = housingStock.filter(h => h.ownerType === 'landlord').length / housingStock.length;
        const landlordAllowed = landlordOwnershipRatio < (landlordCap / 100);
        let winnerType;

        if (isProtectedSale && seekerInTheRunning) { winnerType = 'seeker'; }
        else if (!landlordAllowed && seekerInTheRunning) { winnerType = 'seeker'; }
        else if (landlordAllowed && !seekerInTheRunning) { winnerType = 'landlord'; }
        else if (landlordAllowed && seekerInTheRunning) {
            const CASH_OFFER_ADVANTAGE = 0.75;
            winnerType = seededRandom() < CASH_OFFER_ADVANTAGE ? 'landlord' : 'seeker';
        } else { return; }

        const wasOccupiedRental = home.ownerType !== 'homeowner' && home.status === 'Occupied';
        if (winnerType === 'seeker') {
            const buyer = affordableSeekers.sort((a, b) => b.income - a.income)[0];
            home.ownerType = 'homeowner';
            home.usage = 'LongTermRental';
            home.status = 'OwnerOccupied';
            home.ownerIncome = buyer.income;
            home.originalPrice = home.price;
            home.cumulativeRent = 0;
            marketResults.purchasesByHomeowner++;
            seekerPool = seekerPool.filter(s => s.id !== buyer.id);
            if (wasOccupiedRental) {
                const newIncome = generateTieredIncomes(1)[0];
                seekerPool.push({ id: nextSeekerId++, income: newIncome * cumulativeIncomeGrowth });
                marketResults.displacements++;
                const HOMELESSNESS_RISK_FACTOR = 0.15;
                if (seededRandom() < HOMELESSNESS_RISK_FACTOR) {
                    marketResults.pushedToHomelessness++;
                }
            }
        } else {
            if (home.ownerType !== winnerType) marketResults.purchasesByLandlord++;
            home.ownerType = 'landlord';
            home.ownerIncome = null;
            if (typeof home.price === 'number') totalLandlordCapital += home.price;
            home.originalPrice = home.price;
            home.cumulativeRent = 0;
            const strRatio = housingStock.filter(h => h.usage === 'ShortTermRental').length / housingStock.length;
            if (strRatio < STR_CAP_RATE && seededRandom() < STR_CONVERSION_CHANCE) {
                home.usage = 'ShortTermRental';
                marketResults.convertedToShortTerm++;
            } else {
                home.usage = 'LongTermRental';
            }
            if (wasOccupiedRental) {
                home.status = 'Occupied';
            } else {
                if (seekerPool.length > 0) {
                    home.status = 'Occupied';
                    seekerPool.shift();
                } else {
                    home.status = 'Vacant';
                }
            }
        }

        if (originalOwnerType === 'homeowner') {
            const sellerIncome = randomInRange(INCOME_TIERS.middle.range[0], INCOME_TIERS.top.range[0]);
            seekerPool.unshift({ id: nextSeekerId++, income: sellerIncome * cumulativeIncomeGrowth });
        }
    };

    allForSale.forEach(home => {
        const beforeOwner = home.ownerType;
        const beforeStatus = home.status;
        if (home.ownerType === 'homeowner' && seededRandom() < HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE) {
            sellProperty(home, true);
        } else {
            sellProperty(home, false);
        }
        if (home.ownerType === beforeOwner && home.status === beforeStatus) {
            unsoldInventory.push(home);
        }
    });

    const landlordOwnershipRatio = housingStock.filter(h => h.ownerType === 'landlord').length / housingStock.length;
    let zoningApprovalChance = 0.80;
    if (landlordOwnershipRatio > 0.30) {
        zoningApprovalChance -= (landlordOwnershipRatio - 0.30) * 2;
    }
    if (zoningApprovalChance < 0.1) zoningApprovalChance = 0.1;

    let actualHomesBuilt = 0;
    for (let i = 0; i < newHomes; i++) {
        if (seededRandom() < zoningApprovalChance) {
            actualHomesBuilt++;
            const newPrice = currentMedianPrice * 1.15;
            const newHome = { id: housingStock.length + 1 + i, price: newPrice, rent: newPrice * 0.005, status: 'Vacant', ownerIncome: null };
            housingStock.push(newHome);
            sellProperty(newHome, false);
            if (newHome.ownerType === undefined || newHome.status === 'Vacant') {
                newHome.status = 'Unsold';
                unsoldInventory.push(newHome);
            }
        }
    }
    const supplyDeficit = newHomes - actualHomesBuilt;
    marketResults.totalSupplyDeficit += supplyDeficit;

    const totalRentals = housingStock.filter(h => h.ownerType !== 'homeowner' && h.usage === 'LongTermRental').length;
    const minVacant = Math.ceil(totalRentals * 0.015);
    const vacantUnits = housingStock.filter(home => home.status === 'Vacant' && home.usage === 'LongTermRental');
    seekerPool.sort(() => seededRandom() - 0.5);
    vacantUnits.forEach((unit, idx) => {
        if (seekerPool.length > 0 && idx >= minVacant) {
            unit.status = 'Occupied';
            seekerPool.shift();
        }
    });

    const unhousedSeekers = seekerPool.length;
    const unsoldCount = unsoldInventory.length;
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

    housingStock.forEach(home => {
        home.price *= (1 + appreciationRate);
        if (home.ownerType !== 'homeowner') {
            home.rent *= (1 + rentIncreaseRate);
            if (typeof home.cumulativeRent === 'number') {
                home.cumulativeRent += home.rent;
            }
        }
    });

    return {
        housingStock,
        seekerPool,
        marketResults,
        yearStats: {
            landlordConcentration: housingStock.filter(h => h.ownerType === 'landlord').length / housingStock.length,
            approvalRate: zoningApprovalChance,
            supplyDeficit,
        }
    };
}

// --- Main App Component ---
export default function App() {
    const [turnoverRate, setTurnoverRate] = useState(4);
    const [newHomes, setNewHomes] = useState(3);
    const [yearsToRun, setYearsToRun] = useState(10);
    const [initialSeekersCount, setInitialSeekersCount] = useState(36);
    const [initialHomeowners, setInitialHomeowners] = useState(225);
    const [initialLandlords, setInitialLandlords] = useState(75);
    const [landlordCap, setLandlordCap] = useState(45);

    const [year, setYear] = useState(1);
    const [housingStock, setHousingStock] = useState([]);
    const [seekerPool, setSeekerPool] = useState([]);
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [simulationSpeed, setSimulationSpeed] = useState(500);
    const [collapseTriggered, setCollapseTriggered] = useState(false);
    const [displayData, setDisplayData] = useState({});

    const marketResults = useRef({});
    const initialStats = useRef({});
    const simulationIntervalRef = useRef(null);

    const getPercentChange = (initial, current) => {
        if (initial === 0 || !initial) return 'N/A';
        const change = ((current - initial) / initial) * 100;
        const color = change >= 0 ? 'text-green-600' : 'text-red-600';
        return <span className={color}>{`${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}</span>;
    };

    const computeDisplayData = useCallback((stock, seekers, initial, yearStats) => {
        const currentTotals = stock.reduce((acc, home) => {
            if (home.ownerType) acc[home.ownerType] = (acc[home.ownerType] || 0) + 1;
            return acc;
        }, { homeowner: 0, landlord: 0 });

        const prices = stock.map(h => h.price).sort((a, b) => a - b);
        const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;

        const rents = stock.filter(h => h.ownerType !== 'homeowner').map(h => h.rent).sort((a, b) => a - b);
        const medianRent = rents.length > 0 ? rents[Math.floor(rents.length / 2)] : 0;

        const vacantRentals = stock.filter(h => h.status === 'Vacant' && h.usage === 'LongTermRental').length;
        const totalRentals = stock.filter(h => h.ownerType !== 'homeowner' && h.usage === 'LongTermRental').length;
        const vacancyRate = totalRentals > 0 ? ((vacantRentals / totalRentals) * 100).toFixed(1) + '%' : 'N/A';

        const incomes = seekers.map(s => s.income).sort((a, b) => a - b);
        const medianIncome = incomes.length > 0 ? incomes[Math.floor(incomes.length / 2)] : 0;

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
        const mortgageEligible = seekers.filter(s => s.income * 3.5 >= medianPrice).length;
        const shortTermRentals = stock.filter(h => h.usage === 'ShortTermRental').length;

        const unsoldCount = stock.filter(h => h.status === 'Unsold' || h.status === 'UnsoldNew').length;

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
            landlordConcentration: yearStats?.landlordConcentration,
            approvalRate: yearStats?.approvalRate,
            supplyDeficit: yearStats?.supplyDeficit,
            unsoldCount,
        });
    }, []);

    const handleSetup = useCallback(() => {
        const { housingStock, seekerPool, marketResults: initialMarketResults, initialStats: initial } = setupSimulation({
            initialSeekersCount, initialHomeowners, initialLandlords
        });
        setHousingStock(housingStock);
        setSeekerPool(seekerPool);
        marketResults.current = initialMarketResults;
        initialStats.current = initial;
        setYear(1);
        computeDisplayData(housingStock, seekerPool, initialStats.current, null);
    }, [initialSeekersCount, initialHomeowners, initialLandlords, computeDisplayData]);

    const handleAdvanceYear = useCallback(() => {
        const { housingStock: newStock, seekerPool: newSeekers, marketResults: newResults, yearStats } = advanceYear({
            housingStock, seekerPool, marketResults: marketResults.current
        }, {
            turnoverRate, newHomes, landlordCap, collapseTriggered
        });
        setHousingStock(newStock);
        setSeekerPool(newSeekers);
        marketResults.current = newResults;
        setYear(prevYear => prevYear + 1);
        setCollapseTriggered(false);
        computeDisplayData(newStock, newSeekers, initialStats.current, yearStats);
    }, [housingStock, seekerPool, turnoverRate, newHomes, landlordCap, collapseTriggered, computeDisplayData]);

    useEffect(() => {
        handleSetup();
    }, [handleSetup]);

    useEffect(() => {
        if (!simulationRunning) {
            clearInterval(simulationIntervalRef.current);
            return;
        }
        if (year > yearsToRun) {
            setSimulationRunning(false);
            return;
        }
        simulationIntervalRef.current = setInterval(() => {
            handleAdvanceYear();
        }, simulationSpeed);
        return () => clearInterval(simulationIntervalRef.current);
    }, [simulationRunning, yearsToRun, handleAdvanceYear, year, simulationSpeed]);

    const handleRunSimulation = () => setSimulationRunning(prev => !prev);
    const handleReset = () => {
        clearInterval(simulationIntervalRef.current);
        handleSetup();
        setSimulationRunning(false);
        setYear(1);
    };

    const getColorOrder = (home) => {
        if (home.status === 'OwnerOccupied') return 0;
        if (home.usage === 'LongTermRental' && home.status === 'Occupied') return 1;
        if (home.usage === 'LongTermRental' && home.status === 'Vacant') return 2;
        if (home.usage === 'ShortTermRental') return 3;
        return 4;
    };

    const housingGridItems = housingStock
        .slice()
        .sort((a, b) => getColorOrder(a) - getColorOrder(b))
        .map(home => {
            let fill = '#9ca3af';
            if (home.status === 'OwnerOccupied') fill = '#22c55e';
            else if (home.usage === 'LongTermRental' && home.status === 'Occupied') fill = '#1e40af';
            else if (home.usage === 'LongTermRental' && home.status === 'Vacant') fill = '#60a5fa';
            else if (home.status === 'UnsoldNew' || home.status === 'Unsold') fill = '#ffbf00';
            else if (home.usage === 'ShortTermRental') fill = '#a21caf';
            return (
                <svg key={home.id} width="27" height="27" viewBox="0 0 24 24" className="mx-auto" style={{ height: '1.6875rem', width: '1.6875rem' }}>
                    <rect x="6" y="10" width="12" height="8" rx="2" fill={fill} />
                    <polygon points="12,4 4,12 20,12" fill={fill} />
                </svg>
            );
        });

    return (
        <div className="bg-slate-50 font-sans min-h-screen p-4 md:p-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Housing Market Simulation</h1>
            <div className="space-y-4 mb-8 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 bg-white rounded-xl shadow-lg">
                    <div className="flex-1 min-w-0">
                        <label className="text-xs font-medium text-gray-500 block">Sale Turnover (%)</label>
                        <input type="number" value={turnoverRate} onChange={e => setTurnoverRate(Math.max(0, Number(e.target.value)))} className="w-full p-2 border rounded-md text-center"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="text-xs font-medium text-gray-500 block">New Homes / Year</label>
                        <input type="number" value={newHomes} onChange={e => setNewHomes(Math.max(0, Number(e.target.value)))} className="w-full p-2 border rounded-md text-center"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="text-xs font-medium text-gray-500 block">Initial Seekers</label>
                        <input type="number" value={initialSeekersCount} onChange={e => setInitialSeekersCount(Math.max(0, Number(e.target.value)))} className="w-full p-2 border rounded-md text-center"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="text-xs font-medium text-gray-500 block">Landlord Cap (%)</label>
                        <input type="number" value={landlordCap} onChange={e => setLandlordCap(Math.max(0, Number(e.target.value)))} className="w-full p-2 border rounded-md text-center"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="text-xs font-medium text-gray-500 block">Initial Homeowners</label>
                        <input type="number" value={initialHomeowners} min={0} max={HOMES_TOTAL} onChange={e => setInitialHomeowners(Math.max(0, Number(e.target.value)))} className="w-full p-2 border rounded-md text-center" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="text-xs font-medium text-gray-500 block">Initial Landlords</label>
                        <input type="number" value={initialLandlords} min={0} max={HOMES_TOTAL} onChange={e => setInitialLandlords(Math.max(0, Number(e.target.value)))} className="w-full p-2 border rounded-md text-center" />
                    </div>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-lg flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={handleRunSimulation} className={`font-bold px-6 py-2 rounded-md text-white transition-colors ${simulationRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>{simulationRunning ? 'Pause' : 'Run'}</button>
                        <div className="flex flex-col items-center">
                            <label className="text-xs font-medium text-gray-500">Years to Run</label>
                            <input type="number" value={yearsToRun} onChange={e => setYearsToRun(Math.max(0, Number(e.target.value)))} className="w-16 p-1 border rounded-md text-center" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-extrabold text-gray-900">Year: <span>{year}</span></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleReset} disabled={simulationRunning} className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Reset</button>
                        <button onClick={handleAdvanceYear} disabled={simulationRunning} className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Advance Year</button>
                        <button onClick={() => setCollapseTriggered(true)} disabled={simulationRunning || collapseTriggered} className="font-bold border border-red-500 text-red-600 px-4 py-2 rounded-md bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Trigger Mortgage Collapse</button>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">Current Market Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8 w-full">
                    <Card label="Total Population" value={displayData.totalPopulation} subValue="Housed & Seeking" />
                    <Card label="Seeking Housing" value={displayData.seekerCount} />
                    <Card label="Homeowners" value={displayData.homeowners} subValue={displayData.pctOwnerOccupied} />
                    <Card label="Landlords" value={displayData.landlords} subValue={displayData.pctLandlords} />
                    <Card label="Eligible to Buy" value={displayData.mortgageEligible} subValue="Can Afford Median Home" />
                    <Card label="Median Home Price" value={`$${Math.round((displayData.medianPrice || 0) / 1000)}k`} subValue={displayData.pctMedianPrice} />
                    <Card label="Median Seeker Income"
                        value={displayData.seekerCount > 0 ? `$${Math.round((displayData.medianIncome || 0) / 1000)}k` : 'N/A'}
                        subValue={displayData.pctMedianIncome} />
                    <Card
                        label="Median Homeowner Income"
                        value={displayData.medianHomeownerIncome > 0 ? `$${Math.round(displayData.medianHomeownerIncome / 1000)}k` : 'N/A'}
                        subValue={displayData.pctMedianHomeownerIncome}
                    />
                    <Card label="Median Rent" value={`$${Math.round(displayData.medianRent || 0)}`} subValue={displayData.pctMedianRent} />
                    <Card label="Median Rent Burden" value={displayData.medianRentBurden} subValue="% of Seeker Income" />
                    <Card label="Vacant Rentals" value={displayData.vacantRentals} subValue={`${displayData.vacancyRate} Vacancy Rate`} />
                    <Card label="Unsold Homes" value={displayData.unsoldCount} />
                </div>

                <div id="housing-visual-grid" className="grid grid-cols-[repeat(40,1fr)] gap-[1px] p-4 bg-gray-200 rounded-lg overflow-x-auto shadow-inner">
                    {housingGridItems}
                </div>

                <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm p-4 bg-white rounded-lg shadow-md">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: '#22c55e' }}></div>Owner Occupied</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: '#1e40af' }}></div>Rental Occupied</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: '#60a5fa' }}></div>Rental Vacant</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: '#a21caf' }}></div>Short-Term Rental</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: '#ffbf00' }}></div>Unsold Homes</div>
                </div>

                <hr className="my-5" />

                <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">Simulation Results</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-4 mb-4 w-full">
                    <Card label="Homeowner Purchases" value={marketResults.current.purchasesByHomeowner} />
                    <Card label="Landlord Purchases" value={marketResults.current.purchasesByLandlord} />
                    <Card label="Converted to STR" value={marketResults.current.convertedToShortTerm} />
                    <Card label="Displacements" value={marketResults.current.displacements} />
                    <Card label="Pushed to Homelessness" value={marketResults.current.pushedToHomelessness} />
                </div>
            </main>
        </div>
    );
}

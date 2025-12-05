import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef, useEffect } from "react";
/* empty css                       */
const HOMES_TOTAL$1 = 300;
const INITIAL_SEED$1 = 12345;
const POPULATION_GROWTH_RATE$1 = 0.04;
const INCOME_GROWTH_RATE$1 = 0.025;
const AFFORDABILITY_MULTIPLIER$1 = 3.5;
const BASE_APPRECIATION$1 = 0.015;
const INITIAL_VACANCY_RATE$1 = 0.05;
const RENTAL_TURNOVER_RATE$1 = 0.1;
const RE_ENTRANT_RATE$1 = 0.75;
const STR_CONVERSION_CHANCE$1 = 0.05;
const STR_CAP_RATE$1 = 0.03;
const MAX_RENT_INCREASE$1 = 0.06;
const HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE$1 = 0.9;
const FORECLOSURE_RATE$1 = 0.15;
const INCOME_TIERS$1 = { "bottom": { "range": [4e4, 8e4] }, "middle": { "percent": 0.25, "range": [80001, 15e4] }, "top": { "percent": 0.05, "range": [150001, 5e5] } };
const weights = {
  HOMES_TOTAL: HOMES_TOTAL$1,
  INITIAL_SEED: INITIAL_SEED$1,
  POPULATION_GROWTH_RATE: POPULATION_GROWTH_RATE$1,
  INCOME_GROWTH_RATE: INCOME_GROWTH_RATE$1,
  AFFORDABILITY_MULTIPLIER: AFFORDABILITY_MULTIPLIER$1,
  BASE_APPRECIATION: BASE_APPRECIATION$1,
  INITIAL_VACANCY_RATE: INITIAL_VACANCY_RATE$1,
  RENTAL_TURNOVER_RATE: RENTAL_TURNOVER_RATE$1,
  RE_ENTRANT_RATE: RE_ENTRANT_RATE$1,
  STR_CONVERSION_CHANCE: STR_CONVERSION_CHANCE$1,
  STR_CAP_RATE: STR_CAP_RATE$1,
  MAX_RENT_INCREASE: MAX_RENT_INCREASE$1,
  HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE: HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE$1,
  FORECLOSURE_RATE: FORECLOSURE_RATE$1,
  INCOME_TIERS: INCOME_TIERS$1
};
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
const Card = ({ label, value, subValue }) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg shadow text-center", children: [
  /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1 font-medium", children: label }),
  /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-gray-800", children: value }),
  subValue && /* @__PURE__ */ jsx("span", { className: "block text-sm font-bold text-green-600", children: subValue })
] });
const DEFAULT_VALUES = {
  initialHomeowners: 225,
  initialLandlords: 75,
  initialSeekersCount: 36,
  newHomes: 3,
  turnoverRate: 4,
  landlordCap: 45,
  yearsToRun: 10
};
function HousingSimulation() {
  const [sortBy, setSortBy] = useState("color");
  const sortHouses = useCallback((houses, sortType) => {
    const sortedHouses = [...houses];
    switch (sortType) {
      case "color":
        return sortedHouses.sort((a, b) => {
          const getColorOrder = (home) => {
            if (home.status === "OwnerOccupied") return 0;
            if (home.usage === "LongTermRental" && home.status === "Occupied") return 1;
            if (home.usage === "LongTermRental" && home.status === "Vacant") return 2;
            if (home.usage === "ShortTermRental") return 3;
            return 4;
          };
          return getColorOrder(a) - getColorOrder(b);
        });
      case "price":
        return sortedHouses.sort((a, b) => a.price - b.price);
      case "id":
        return sortedHouses.sort((a, b) => {
          const idA = parseInt(a.id.split("_")[1]);
          const idB = parseInt(b.id.split("_")[1]);
          return idA - idB;
        });
      default:
        return sortedHouses;
    }
  }, []);
  const [initialHomeowners, setInitialHomeowners] = useState(DEFAULT_VALUES.initialHomeowners);
  const [initialLandlords, setInitialLandlords] = useState(DEFAULT_VALUES.initialLandlords);
  const [initialSeekersCount, setInitialSeekersCount] = useState(DEFAULT_VALUES.initialSeekersCount);
  const [newHomes, setNewHomes] = useState(DEFAULT_VALUES.newHomes);
  const [turnoverRate, setTurnoverRate] = useState(DEFAULT_VALUES.turnoverRate);
  const [landlordCap, setLandlordCap] = useState(DEFAULT_VALUES.landlordCap);
  const [yearsToRun, setYearsToRun] = useState(DEFAULT_VALUES.yearsToRun);
  const updateBalancedOwnership = useCallback((type, newValue) => {
    const totalHomes = HOMES_TOTAL;
    newValue = Math.max(0, Math.min(newValue, totalHomes));
    if (type === "homeowners") {
      setInitialHomeowners(newValue);
      setInitialLandlords(totalHomes - newValue);
    } else if (type === "landlords") {
      setInitialLandlords(newValue);
      setInitialHomeowners(totalHomes - newValue);
    }
  }, []);
  const [year, setYear] = useState(1);
  const [housingStock, setHousingStock] = useState([]);
  const [seekerPool, setSeekerPool] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(500);
  const [collapseTriggered, setCollapseTriggered] = useState(false);
  const nextHomeId = useRef(HOMES_TOTAL);
  const [displayData, setDisplayData] = useState({});
  const unsoldInventory = useRef([]);
  const marketResults = useRef({});
  const initialStats = useRef({});
  const nextSeekerId = useRef(0);
  const seededRandom = useRef(createSeededRandom(INITIAL_SEED));
  const cumulativeIncomeGrowth = useRef(1);
  const totalLandlordCapital = useRef(0);
  const totalLandlordReturn = useRef(0);
  function createSeededRandom(seed) {
    let state = seed;
    return function() {
      state = (state * 1664525 + 1013904223) % 2 ** 32;
      return state / 2 ** 32;
    };
  }
  const getPercentChange = (initial, current) => {
    if (initial === 0 || !initial) return "N/A";
    const change = (current - initial) / initial * 100;
    const color = change >= 0 ? "text-green-600" : "text-red-600";
    return /* @__PURE__ */ jsx("span", { className: color, children: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%` });
  };
  const computeDisplayData = useCallback((stock, seekers, initial, yearStats) => {
    const currentTotals = stock.reduce((acc, home) => {
      if (home.ownerType) acc[home.ownerType] = (acc[home.ownerType] || 0) + 1;
      return acc;
    }, { homeowner: 0, landlord: 0 });
    const prices = stock.map((h) => h.price).sort((a, b) => a - b);
    const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;
    const rents = stock.filter((h) => h.ownerType !== "homeowner").map((h) => h.rent).sort((a, b) => a - b);
    const medianRent = rents.length > 0 ? rents[Math.floor(rents.length / 2)] : 0;
    const vacantRentals = stock.filter((h) => h.status === "Vacant" && h.usage === "LongTermRental").length;
    const totalRentals = stock.filter((h) => h.ownerType !== "homeowner" && h.usage === "LongTermRental").length;
    const vacancyRate = totalRentals > 0 ? (vacantRentals / totalRentals * 100).toFixed(1) + "%" : "N/A";
    const incomes = seekers.map((s) => s.income).sort((a, b) => a - b);
    const medianIncome = incomes.length > 0 ? incomes[Math.floor(incomes.length / 2)] : 0;
    const medianRentBurden = medianIncome > 0 && medianRent > 0 ? `${(medianRent * 12 / medianIncome * 100).toFixed(1)}%` : "N/A";
    const homeownerIncomes = stock.filter((h) => h.ownerType === "homeowner" && h.ownerIncome).map((h) => h.ownerIncome).sort((a, b) => a - b);
    const medianHomeownerIncome = homeownerIncomes.length > 0 ? homeownerIncomes[Math.floor(homeownerIncomes.length / 2)] : 0;
    const housedPopulation = stock.filter(
      (h) => h.usage !== "ShortTermRental" && (h.status === "OwnerOccupied" || h.status === "Occupied")
    ).length;
    const totalPopulation = housedPopulation + seekers.length;
    const landlordOwnershipRatio = stock.filter((h) => h.ownerType === "landlord").length / stock.length;
    const canBuyersPurchase = landlordOwnershipRatio < landlordCap / 100;
    const availableHomes = stock.filter((h) => h.status === "Unsold" || h.status === "UnsoldNew");
    const lowestPrice = availableHomes.length > 0 ? Math.min(...availableHomes.map((h) => h.price)) : medianPrice;
    const mortgageEligible = canBuyersPurchase ? seekers.filter((s) => s.income * AFFORDABILITY_MULTIPLIER >= lowestPrice).length : 0;
    const shortTermRentals = stock.filter((h) => h.usage === "ShortTermRental").length;
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
      supplyDeficit: yearStats.supplyDeficit
    });
  }, []);
  const setupSimulation = useCallback(() => {
    unsoldInventory.current = [];
    nextSeekerId.current = 0;
    seededRandom.current = createSeededRandom(INITIAL_SEED);
    cumulativeIncomeGrowth.current = 1;
    marketResults.current = {
      purchasesByHomeowner: 0,
      purchasesByLandlord: 0,
      convertedToShortTerm: 0,
      displacements: 0,
      totalSupplyDeficit: 0,
      pushedToHomelessness: 0
    };
    totalLandlordCapital.current = 0;
    totalLandlordReturn.current = 0;
    const generateTieredIncomes = (count) => {
      const incomes2 = [];
      const randomInRange = (min, max) => min + seededRandom.current() * (max - min);
      const { INCOME_TIERS: INCOME_TIERS2 } = weights;
      const topCount = Math.floor(count * INCOME_TIERS2.top.percent);
      const middleCount = Math.floor(count * INCOME_TIERS2.middle.percent);
      const bottomCount = count - topCount - middleCount;
      for (let i = 0; i < topCount; i++) incomes2.push(randomInRange(...INCOME_TIERS2.top.range));
      for (let i = 0; i < middleCount; i++) incomes2.push(randomInRange(...INCOME_TIERS2.middle.range));
      for (let i = 0; i < bottomCount; i++) incomes2.push(randomInRange(...INCOME_TIERS2.bottom.range));
      return incomes2.sort((a, b) => a - b);
    };
    const generateRandomData = (count, median, spread) => {
      const data = [];
      for (let i = 0; i < count; i++) {
        const deviation = (seededRandom.current() - 0.5) * 2 * spread;
        data.push(Math.max(median + deviation, median * 0.5));
      }
      return data;
    };
    const initialPrices = generateRandomData(HOMES_TOTAL, 35e4, 1e5);
    const initialIncomes = generateTieredIncomes(initialSeekersCount);
    let adjHomeowners = initialHomeowners;
    let adjLandlords = initialLandlords;
    const indices = Array.from({ length: HOMES_TOTAL }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom.current() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    indices.slice(0, adjLandlords);
    indices.slice(adjLandlords);
    if (adjHomeowners + adjLandlords !== HOMES_TOTAL) {
      adjLandlords = HOMES_TOTAL - adjHomeowners;
    }
    const generateInitialHomeownerIncomes = (count) => {
      const incomes2 = [];
      const randomInRange = (min, max) => min + seededRandom.current() * (max - min);
      const { INCOME_TIERS: INCOME_TIERS2 } = weights;
      const topCount = Math.floor(count * 0.15);
      const middleCount = Math.floor(count * 0.45);
      const bottomCount = count - topCount - middleCount;
      for (let i = 0; i < topCount; i++) incomes2.push(randomInRange(...INCOME_TIERS2.top.range));
      for (let i = 0; i < middleCount; i++) incomes2.push(randomInRange(...INCOME_TIERS2.middle.range));
      for (let i = 0; i < bottomCount; i++) incomes2.push(randomInRange(...INCOME_TIERS2.bottom.range));
      return incomes2;
    };
    const initialHomeownerIncomes = generateInitialHomeownerIncomes(adjHomeowners);
    let homeownerIncomeIndex = 0;
    const shuffledIndices = Array.from({ length: HOMES_TOTAL }, (_, i) => i);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom.current() * (i + 1));
      [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    const randomLandlordIndices = shuffledIndices.slice(0, adjLandlords);
    const newHousingStock = Array.from({ length: HOMES_TOTAL }, (_, i) => {
      const isLandlord = randomLandlordIndices.includes(i);
      const ownerType = isLandlord ? "landlord" : "homeowner";
      const price = initialPrices[i];
      const usage = isLandlord && randomLandlordIndices.indexOf(i) < 3 ? "ShortTermRental" : "LongTermRental";
      let status;
      let ownerIncome = null;
      if (ownerType === "homeowner") {
        status = "OwnerOccupied";
        ownerIncome = initialHomeownerIncomes[homeownerIncomeIndex++];
      } else {
        if (usage === "ShortTermRental") status = "Occupied";
        else status = seededRandom.current() < INITIAL_VACANCY_RATE ? "Vacant" : "Occupied";
      }
      let rent;
      if (usage === "ShortTermRental") {
        const nightlyRate = price * 1e-3;
        const avgNightsPerMonth = 19.5;
        rent = nightlyRate * avgNightsPerMonth;
      } else {
        const rentSpread = price / 35e4;
        rent = 1800 * rentSpread + (seededRandom.current() - 0.5) * 100;
      }
      if (ownerType === "landlord") {
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
        originalPrice: ownerType === "landlord" ? price : void 0,
        cumulativeRent: ownerType === "landlord" ? 0 : void 0,
        nightlyRate: usage === "ShortTermRental" ? rent / 19.5 : void 0
      };
    });
    const newSeekerPool = Array.from({ length: initialSeekersCount }, (_, i) => ({
      id: `s_${nextSeekerId.current++}`,
      income: initialIncomes[i]
    }));
    const ownerOccupied = newHousingStock.filter((h) => h.ownerType === "homeowner").length;
    const landlords = newHousingStock.filter((h) => h.ownerType === "landlord").length;
    const prices = newHousingStock.map((h) => h.price).sort((a, b) => a - b);
    const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;
    const rents = newHousingStock.filter((h) => h.ownerType !== "homeowner").map((h) => h.rent).sort((a, b) => a - b);
    const medianRent = rents.length > 0 ? rents[Math.floor(rents.length / 2)] : 0;
    const incomes = newSeekerPool.map((s) => s.income).sort((a, b) => a - b);
    const medianIncome = incomes.length > 0 ? incomes[Math.floor(incomes.length / 2)] : 0;
    const homeownerIncomes = newHousingStock.filter((h) => h.ownerType === "homeowner" && h.ownerIncome).map((h) => h.ownerIncome).sort((a, b) => a - b);
    const medianHomeownerIncome = homeownerIncomes.length > 0 ? homeownerIncomes[Math.floor(homeownerIncomes.length / 2)] : 0;
    initialStats.current = {
      ownerOccupied,
      landlords,
      medianPrice,
      medianRent,
      medianIncome,
      medianHomeownerIncome
    };
    setHousingStock(sortHouses(newHousingStock, sortBy));
    setSeekerPool(newSeekerPool);
    const landlordConcentration = newHousingStock.filter((h) => h.ownerType === "landlord").length / newHousingStock.length;
    computeDisplayData(newHousingStock, newSeekerPool, initialStats.current, {
      landlordConcentration,
      approvalRate: 0.8,
      supplyDeficit: 0
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
      const foreclosedHomes = newStock.filter((h) => h.ownerType === "homeowner" && seededRandom.current() < FORECLOSURE_RATE);
      foreclosedHomes.forEach((home) => {
        newSeekerPool.push({ id: `s_${nextSeekerId.current++}`, income: randomInRange(...INCOME_TIERS.bottom.range) });
        const affordableSeekers = newSeekerPool.filter((s) => s.income * collapseAffordabilityMultiplier >= home.price);
        const landlordWins = seededRandom.current() < 0.8;
        if (landlordWins || affordableSeekers.length === 0) {
          home.ownerType = "landlord";
          home.ownerIncome = null;
          home.usage = "LongTermRental";
          home.status = "Vacant";
          marketResults.current.purchasesByLandlord++;
        } else {
          const buyer = affordableSeekers.sort((a, b) => b.income - a.income)[0];
          home.ownerType = "homeowner";
          home.ownerIncome = buyer.income;
          home.status = "OwnerOccupied";
          marketResults.current.purchasesByHomeowner++;
          newSeekerPool = newSeekerPool.filter((s) => s.id !== buyer.id);
        }
      });
      setCollapseTriggered(false);
    } else {
      unsoldInventory.current.forEach((home) => {
        home.price *= 0.95;
      });
      cumulativeIncomeGrowth.current *= 1 + INCOME_GROWTH_RATE;
      newSeekerPool.forEach((seeker) => {
        seeker.income *= 1 + INCOME_GROWTH_RATE;
      });
      newStock.forEach((home) => {
        if (home.ownerIncome) home.ownerIncome *= 1 + INCOME_GROWTH_RATE;
      });
      const housedPopulation = newStock.filter((h) => h.status !== "Vacant" && h.usage !== "ShortTermRental").length;
      const newEntrantCount = Math.floor((housedPopulation + newSeekerPool.length) * POPULATION_GROWTH_RATE);
      for (let i = 0; i < newEntrantCount; i++) {
        const roll = seededRandom.current();
        let baseIncome;
        if (roll < INCOME_TIERS.top.percent) baseIncome = randomInRange(...INCOME_TIERS.top.range);
        else if (roll < INCOME_TIERS.top.percent + INCOME_TIERS.middle.percent) baseIncome = randomInRange(...INCOME_TIERS.middle.range);
        else baseIncome = randomInRange(...INCOME_TIERS.bottom.range);
        newSeekerPool.push({ id: nextSeekerId.current++, income: baseIncome * cumulativeIncomeGrowth.current });
      }
      const unsoldHomes = newStock.filter((h) => h.status === "Unsold" || h.status === "UnsoldNew");
      const homesForSaleIndices = /* @__PURE__ */ new Set();
      const newListingsCount = Math.floor(newStock.length * (turnoverRate / 100));
      while (homesForSaleIndices.size < newListingsCount && homesForSaleIndices.size < newStock.length) {
        const idx = Math.floor(seededRandom.current() * newStock.length);
        if (!unsoldHomes.includes(newStock[idx])) {
          homesForSaleIndices.add(idx);
        }
      }
      const newListings = Array.from(homesForSaleIndices).map((index) => newStock[index]);
      const currentPrices = [...newStock].map((h) => h.price).sort((a, b) => a - b);
      currentPrices[Math.floor(currentPrices.length / 2)];
      const allForSale = [...newListings, ...unsoldHomes];
      unsoldInventory.current = [];
      newStock.forEach((home) => {
        if (home.ownerType !== "homeowner" && home.usage === "LongTermRental" && home.status === "Occupied" && seededRandom.current() < RENTAL_TURNOVER_RATE) {
          home.status = "Vacant";
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
      const marketPrices = newStock.map((h) => h.price).sort((a, b) => a - b);
      const currentMedianPrice = marketPrices.length > 0 ? marketPrices[Math.floor(marketPrices.length / 2)] : 0;
      const sellProperty = (home, medianPrice, isProtectedSale = false) => {
        const originalOwnerType = home.ownerType;
        if (originalOwnerType === "landlord") {
          if (typeof home.originalPrice === "number") {
            totalLandlordReturn.current += home.price - home.originalPrice + (home.cumulativeRent || 0);
            totalLandlordCapital.current -= home.originalPrice;
          }
        }
        const affordableSeekers = newSeekerPool.filter((s) => {
          const canAfford = s.income * AFFORDABILITY_MULTIPLIER >= home.price;
          const downPayment = home.price * 0.2;
          const loanAmount = home.price - downPayment;
          const monthlyPayment = loanAmount / AFFORDABILITY_MULTIPLIER / 12;
          const monthlyIncome = s.income / 12;
          const paymentRatio = monthlyPayment / monthlyIncome;
          return canAfford && paymentRatio <= 0.36;
        });
        const seekerInTheRunning = affordableSeekers.length > 0;
        const landlordOwnershipRatio2 = newStock.filter((h) => h.ownerType === "landlord").length / newStock.length;
        const landlordAllowed = landlordOwnershipRatio2 < landlordCap / 100;
        let winnerType;
        if (!landlordAllowed && seekerInTheRunning) {
          winnerType = "seeker";
        } else if (isProtectedSale && seekerInTheRunning) {
          winnerType = "seeker";
        } else if (landlordAllowed && home.price > currentMedianPrice * 1.2) {
          winnerType = seekerInTheRunning && seededRandom.current() > 0.7 ? "seeker" : "landlord";
        } else if (landlordAllowed && !seekerInTheRunning) {
          winnerType = "landlord";
        } else if (!landlordAllowed && seekerInTheRunning) {
          winnerType = "seeker";
        } else if (landlordAllowed && seekerInTheRunning) {
          const CASH_OFFER_ADVANTAGE = 0.4;
          if (seededRandom.current() < CASH_OFFER_ADVANTAGE && home.price > currentMedianPrice) {
            winnerType = "landlord";
          } else {
            winnerType = "seeker";
          }
        } else {
          return;
        }
        const processWinner = (type) => {
          const wasOccupiedRental = home.ownerType !== "homeowner" && home.status === "Occupied";
          if (type === "seeker") {
            const buyer = affordableSeekers.sort((a, b) => b.income - a.income)[0];
            home.ownerType = "homeowner";
            home.usage = "LongTermRental";
            home.status = "OwnerOccupied";
            home.ownerIncome = buyer.income;
            home.originalPrice = home.price;
            home.cumulativeRent = 0;
            marketResults.current.purchasesByHomeowner++;
            newSeekerPool = newSeekerPool.filter((s) => s.id !== buyer.id);
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
            if (home.ownerType !== type) marketResults.current.purchasesByLandlord++;
            home.ownerType = "landlord";
            home.ownerIncome = null;
            if (typeof home.price === "number") {
              totalLandlordCapital.current += home.price;
            }
            home.originalPrice = home.price;
            home.cumulativeRent = 0;
            const strRatio = newStock.filter((h) => h.usage === "ShortTermRental").length / newStock.length;
            if (strRatio < STR_CAP_RATE && seededRandom.current() < STR_CONVERSION_CHANCE) {
              home.usage = "ShortTermRental";
              marketResults.current.convertedToShortTerm++;
            } else {
              home.usage = "LongTermRental";
            }
            if (wasOccupiedRental) {
              home.status = "Occupied";
            } else {
              if (newSeekerPool.length > 0) {
                home.status = "Occupied";
                newSeekerPool.shift();
              } else {
                home.status = "Vacant";
              }
            }
          }
          if (originalOwnerType === "homeowner") {
            const sellerIncome = randomInRange(INCOME_TIERS.middle.range[0], INCOME_TIERS.top.range[0]);
            newSeekerPool.unshift({ id: `s_${nextSeekerId.current++}`, income: sellerIncome * cumulativeIncomeGrowth.current });
          }
        };
        processWinner(winnerType);
      };
      allForSale.forEach((home) => {
        const beforeOwner = home.ownerType;
        const beforeStatus = home.status;
        if (home.ownerType === "homeowner" && seededRandom.current() < HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE) {
          sellProperty(home, currentMedianPrice, true);
        } else {
          sellProperty(home, currentMedianPrice, false);
        }
        if (home.ownerType === beforeOwner && home.status === beforeStatus) {
          unsoldInventory.current.push(home);
        }
      });
      const landlordOwnershipRatio = newStock.filter((h) => h.ownerType === "landlord").length / newStock.length;
      zoningApprovalChance = 0.8;
      if (landlordOwnershipRatio > 0.3) {
        zoningApprovalChance -= (landlordOwnershipRatio - 0.3) * 2;
      }
      if (zoningApprovalChance < 0.1) zoningApprovalChance = 0.1;
      let actualHomesBuilt = 0;
      for (let i = 0; i < newHomes; i++) {
        if (seededRandom.current() < zoningApprovalChance) {
          actualHomesBuilt++;
          const newPrice = currentMedianPrice;
          const newHome = {
            id: `h_${nextHomeId.current++}`,
            price: newPrice,
            rent: newPrice * 5e-3,
            status: "UnsoldNew",
            ownerType: null,
            ownerIncome: null
          };
          newStock.push(newHome);
          const isProtected = landlordOwnershipRatio >= landlordCap / 100;
          sellProperty(newHome, currentMedianPrice, isProtected);
          if (!newHome.ownerType || newHome.status === "UnsoldNew") {
            unsoldInventory.current.push(newHome);
          }
        }
      }
      supplyDeficit = newHomes - actualHomesBuilt;
      marketResults.current.totalSupplyDeficit += supplyDeficit;
    }
    const totalRentals = newStock.filter((h) => h.ownerType !== "homeowner" && h.usage === "LongTermRental").length;
    const minVacant = Math.ceil(totalRentals * 0.015);
    let vacantUnits = newStock.filter((home) => home.status === "Vacant" && home.usage === "LongTermRental");
    newSeekerPool.sort(() => seededRandom.current() - 0.5);
    vacantUnits.forEach((unit, idx) => {
      if (newSeekerPool.length > 0 && idx >= minVacant) {
        unit.status = "Occupied";
        newSeekerPool.shift();
      }
    });
    const unhousedSeekers = newSeekerPool.length;
    const unsoldCount = unsoldInventory.current.length;
    const landlordFactor = newStock.filter((h) => h.ownerType === "landlord").length / newStock.length;
    const canAddLandlords = landlordFactor < landlordCap / 100;
    const unsoldRatio = unsoldCount / newStock.length;
    const seekerRatio = seekerPool.length / newStock.length;
    const medianHomePrice = [...newStock].sort((a, b) => a.price - b.price)[Math.floor(newStock.length / 2)].price;
    const qualifiedBuyers = seekerPool.filter((s) => s.income * AFFORDABILITY_MULTIPLIER >= medianHomePrice).length;
    const qualifiedRatio = qualifiedBuyers / seekerPool.length;
    const baseAppreciation = BASE_APPRECIATION;
    let depreciationRate = -0.05;
    if (!canAddLandlords) {
      depreciationRate = -0.1;
      if (qualifiedBuyers === 0) {
        depreciationRate = -0.15;
      }
    }
    let marketAppreciation = baseAppreciation;
    if (canAddLandlords && qualifiedBuyers > 0) {
      marketAppreciation += qualifiedRatio * 0.05;
      marketAppreciation += Math.min(0.03, seekerRatio * 0.1);
      if (unsoldRatio < 0.05) {
        marketAppreciation += 0.04;
      } else if (unsoldRatio < 0.1) {
        marketAppreciation += 0.02;
      }
      const populationGrowth = POPULATION_GROWTH_RATE * cumulativeIncomeGrowth.current;
      marketAppreciation += populationGrowth * 0.5;
    }
    if (marketAppreciation > 0.12) marketAppreciation = 0.12;
    let rentIncreaseRate = marketAppreciation + unhousedSeekers * 1e-3;
    if (rentIncreaseRate < 0) rentIncreaseRate = 0;
    if (rentIncreaseRate > MAX_RENT_INCREASE) rentIncreaseRate = MAX_RENT_INCREASE;
    newStock.forEach((home) => {
      if (home.status === "Unsold" || home.status === "UnsoldNew") {
        home.price *= 1 + depreciationRate;
      } else {
        home.price *= 1 + marketAppreciation;
      }
      if (home.ownerType !== "homeowner") {
        if (home.usage === "ShortTermRental") {
          const baseNightlyRate = home.price * 1e-3;
          const seasonalMultiplier = 1 + Math.sin(year * Math.PI / 6) * 0.2;
          home.nightlyRate = baseNightlyRate * seasonalMultiplier;
          const baseNights = 19.5;
          const occupancyMultiplier = Math.max(0.8, Math.min(1.2, 1 + unhousedSeekers / newStock.length));
          const avgNightsPerMonth = baseNights * occupancyMultiplier;
          home.rent = home.nightlyRate * avgNightsPerMonth;
        } else {
          home.rent *= 1 + rentIncreaseRate;
        }
        if (typeof home.cumulativeRent === "number") {
          home.cumulativeRent += home.rent;
        }
      }
    });
    setHousingStock(sortHouses(newStock, sortBy));
    setSeekerPool(newSeekerPool);
    setYear((prevYear) => prevYear + 1);
    const landlordConcentration = newStock.filter((h) => h.ownerType === "landlord").length / newStock.length;
    computeDisplayData(newStock, newSeekerPool, initialStats.current, {
      landlordConcentration,
      approvalRate: zoningApprovalChance,
      supplyDeficit
    });
  }, [housingStock, seekerPool, turnoverRate, newHomes, computeDisplayData, collapseTriggered, landlordCap]);
  useEffect(() => {
    setupSimulation();
  }, [setupSimulation]);
  useEffect(() => {
    if (!simulationRunning) return;
    const intervalId = setInterval(() => {
      if (year >= yearsToRun) {
        setSimulationRunning(false);
        return;
      }
      advanceYear();
    }, simulationSpeed);
    return () => clearInterval(intervalId);
  }, [simulationRunning, yearsToRun, advanceYear, year, simulationSpeed]);
  const handleRunSimulation = () => setSimulationRunning((prev) => !prev);
  const handleReset = () => {
    window.location.reload();
  };
  return /* @__PURE__ */ jsx("div", { style: { width: "100%", maxWidth: "100vw", margin: 0, padding: 0 }, className: "bg-slate-50 font-sans min-h-screen", children: /* @__PURE__ */ jsxs("div", { style: { width: "100%", maxWidth: "100vw", margin: 0, padding: 0 }, children: [
    /* @__PURE__ */ jsx("div", { className: "text-center py-4 bg-white border-b border-gray-100", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
      "To read about this simulation and get the code to run it locally, ",
      /* @__PURE__ */ jsx("a", { href: "https://nextvaldata.com/blog/2025-09-14-an-imperfect-model-for-an-imperfect-market/", className: "text-blue-600 hover:text-blue-800 underline", target: "_blank", rel: "noopener noreferrer", children: "click here" }),
      "."
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4 items-center justify-center", children: /* @__PURE__ */ jsx("div", {}) }) }) }),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-center mb-4", children: "Current Market Stats" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-4 mb-8 w-full", children: [
        /* @__PURE__ */ jsx(Card, { label: "Total Population", value: displayData.totalPopulation, subValue: "Housed & Seeking" }),
        /* @__PURE__ */ jsx(Card, { label: "Seeking Housing", value: displayData.seekerCount }),
        /* @__PURE__ */ jsx(Card, { label: "Homeowners", value: displayData.homeowners, subValue: displayData.pctOwnerOccupied }),
        /* @__PURE__ */ jsx(Card, { label: "Landlords", value: displayData.landlords, subValue: displayData.pctLandlords }),
        /* @__PURE__ */ jsx(Card, { label: "Mortgage-Eligible Seekers", value: displayData.mortgageEligible, subValue: "Can Afford Median Home" }),
        /* @__PURE__ */ jsx(Card, { label: "Median Home Price", value: `$${Math.round((displayData.medianPrice || 0) / 1e3)}k`, subValue: displayData.pctMedianPrice }),
        /* @__PURE__ */ jsx(
          Card,
          {
            label: "Median Seeker Income",
            value: displayData.seekerCount > 0 ? `$${Math.round((displayData.medianIncome || 0) / 1e3)}k` : "N/A",
            subValue: displayData.pctMedianIncome
          }
        ),
        /* @__PURE__ */ jsx(
          Card,
          {
            label: "Median Homeowner Income",
            value: displayData.medianHomeownerIncome > 0 ? `$${Math.round(displayData.medianHomeownerIncome / 1e3)}k` : "N/A",
            subValue: displayData.pctMedianHomeownerIncome
          }
        ),
        /* @__PURE__ */ jsx(Card, { label: "Median Rent", value: `$${Math.round(displayData.medianRent || 0)}`, subValue: displayData.pctMedianRent }),
        /* @__PURE__ */ jsx(Card, { label: "Median Rent Burden", value: displayData.medianRentBurden, subValue: "% of Median Seeker Income" }),
        /* @__PURE__ */ jsx(Card, { label: "Vacant Rental Units", value: displayData.vacantRentals, subValue: `${displayData.vacancyRate} Rental Rate` }),
        /* @__PURE__ */ jsx(Card, { label: "Short-Term Rentals", value: displayData.shortTermRentals, subValue: "Total Units" })
      ] }),
      /* @__PURE__ */ jsx("div", { id: "housing-visual-grid", className: "grid grid-cols-[repeat(40,1fr)] gap-2 p-4 bg-gray-200 rounded-lg overflow-x-auto shadow-inner w-full max-w-none", children: housingStock.map((home, idx) => {
        let fill = "#9ca3af";
        if (home.status === "OwnerOccupied") fill = "#22c55e";
        else if (home.usage === "LongTermRental" && home.status === "Occupied") fill = "#1e40af";
        else if (home.usage === "LongTermRental" && home.status === "Vacant") fill = "#60a5fa";
        else if (home.status === "UnsoldNew" || home.status === "Unsold") fill = "#ffbf00";
        else if (home.usage === "ShortTermRental") fill = "#a21caf";
        const formatPrice = (price) => `$${Math.round(price).toLocaleString()}`;
        const getTooltipText = (home2) => {
          let text = `ID: ${home2.id}
Price: ${formatPrice(home2.price)}`;
          if (home2.ownerType === "landlord" && home2.rent) {
            if (home2.usage === "ShortTermRental") {
              text += `
Nightly Rate: ${formatPrice(home2.nightlyRate)}`;
              text += `
Monthly Revenue: ${formatPrice(home2.rent)}`;
            } else {
              text += `
Rent: ${formatPrice(home2.rent)}/month`;
            }
          }
          return text;
        };
        const isTopRow = idx < 40;
        return /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
          /* @__PURE__ */ jsxs("svg", { width: "27", height: "27", viewBox: "0 0 24 24", className: "mx-auto", style: { height: "1.6875rem", width: "1.6875rem" }, children: [
            /* @__PURE__ */ jsx("rect", { x: "6", y: "10", width: "12", height: "8", rx: "2", fill }),
            /* @__PURE__ */ jsx("polygon", { points: "12,4 4,12 20,12", fill })
          ] }),
          /* @__PURE__ */ jsx("div", { className: `absolute z-10 ${isTopRow ? "top-full mt-2" : "bottom-full mb-2"} left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-pre opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`, children: getTooltipText(home) })
        ] }, home.id);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center flex-wrap gap-6 mt-4 text-sm p-4 bg-white rounded-lg shadow", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center flex-wrap gap-6 mt-4 text-sm p-4 bg-white rounded-lg shadow", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 items-center justify-center", children: [
            /* @__PURE__ */ jsx("button", { onClick: handleRunSimulation, className: `font-bold px-4 py-2 rounded-md text-white ${simulationRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"}`, children: simulationRunning ? "Pause" : "Run" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: yearsToRun, onChange: (e) => setYearsToRun(Math.max(0, Number(e.target.value))), className: "w-16 p-1 border rounded-md text-center" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 justify-center mt-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: handleReset, disabled: simulationRunning, className: "border border-gray-400 px-3 py-2 rounded-md bg-white hover:bg-gray-100", children: "Reset" }),
            /* @__PURE__ */ jsx("button", { onClick: advanceYear, disabled: simulationRunning, className: "border border-gray-400 px-3 py-2 rounded-md bg-white hover:bg-gray-100", children: "Advance Year" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setCollapseTriggered(true), disabled: simulationRunning || collapseTriggered, className: "font-bold border border-red-500 text-red-600 px-3 py-2 rounded-md bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Trigger Mortgage Collapse" }),
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
              "Year: ",
              /* @__PURE__ */ jsx("span", { children: year })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full", style: { background: "#22c55e" } }),
          "Owner Occupied"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full", style: { background: "#1e40af" } }),
          "Rental Occupied"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full", style: { background: "#60a5fa" } }),
          "Rental Vacant"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full", style: { background: "#a21caf" } }),
          "Short-Term Rental"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full", style: { background: "#ffbf00" } }),
          "Unsold Homes"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4 py-3 bg-white border-t border-gray-200", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Sort by:" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSortBy("color");
              setHousingStock((prev) => sortHouses([...prev], "color"));
            },
            className: `px-3 py-1 rounded transition-colors ${sortBy === "color" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            children: "Color"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSortBy("price");
              setHousingStock((prev) => sortHouses([...prev], "price"));
            },
            className: `px-3 py-1 rounded transition-colors ${sortBy === "price" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            children: "Price"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSortBy("id");
              setHousingStock((prev) => sortHouses([...prev], "id"));
            },
            className: `px-3 py-1 rounded transition-colors ${sortBy === "id" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            children: "ID"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-2 rounded-lg shadow mt-2", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-base font-semibold text-center mb-2", children: "Simulation Variables" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-600", children: "Initial Homeowners" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: initialHomeowners,
                onChange: (e) => updateBalancedOwnership("homeowners", Number(e.target.value)),
                className: "mt-0.5 px-1 py-0.5 border rounded text-sm w-full",
                min: "0",
                max: HOMES_TOTAL
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-600", children: "Initial Landlords" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: initialLandlords,
                onChange: (e) => updateBalancedOwnership("landlords", Number(e.target.value)),
                className: "mt-0.5 px-1 py-0.5 border rounded text-sm w-full",
                min: "0",
                max: HOMES_TOTAL
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-600", children: "Initial Seekers" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: initialSeekersCount,
                onChange: (e) => setInitialSeekersCount(Number(e.target.value)),
                className: "mt-0.5 px-1 py-0.5 border rounded text-sm w-full"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-600", children: "New Homes/Year" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: newHomes,
                onChange: (e) => setNewHomes(Number(e.target.value)),
                className: "mt-0.5 px-1 py-0.5 border rounded text-sm w-full"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-600", children: "Turnover (%)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: turnoverRate,
                onChange: (e) => setTurnoverRate(Number(e.target.value)),
                className: "mt-0.5 px-1 py-0.5 border rounded text-sm w-full"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-gray-600", children: "Landlord Cap (%)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: landlordCap,
                onChange: (e) => setLandlordCap(Number(e.target.value)),
                className: "mt-0.5 px-1 py-0.5 border rounded text-sm w-full"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "my-5" }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-center mb-2", children: "Simulation Results" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-4 mb-4 w-full", children: [
        /* @__PURE__ */ jsx(Card, { label: "Total Unsold Homes", value: housingStock.filter((h) => h.status === "Unsold" || h.status === "UnsoldNew").length }),
        /* @__PURE__ */ jsx(Card, { label: "Homeowner Purchases", value: marketResults.current.purchasesByHomeowner }),
        /* @__PURE__ */ jsx(Card, { label: "Landlord Purchases", value: marketResults.current.purchasesByLandlord }),
        /* @__PURE__ */ jsx(Card, { label: "Converted to STR", value: marketResults.current.convertedToShortTerm }),
        /* @__PURE__ */ jsx(Card, { label: "Displacements", value: marketResults.current.displacements })
      ] })
    ] })
  ] }) });
}
export {
  HousingSimulation as H
};

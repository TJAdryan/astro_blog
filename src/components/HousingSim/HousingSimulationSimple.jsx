// --- Income Distribution Constants ---
const INCOME_TIERS = {
  bottom: { percent: 0.70, range: [40000, 80000] },
  middle: { percent: 0.25, range: [80001, 150000] },
  top:    { percent: 0.05, range: [150001, 500000] }
};
import React, { useState, useRef } from 'react';

// --- Constants ---
const HOMES_TOTAL = 300;
const AFFORDABILITY_MULTIPLIER = 4;
const INITIAL_SEED = 42;
const MIN_POP_GROWTH = 0.01; // 1%
const MAX_POP_GROWTH = 0.06; // 6%
const MIN_LANDLORD_CAP = 1; // 1%
const MIN_TURNOVER_RATE = 1; // 1%
const MIN_YEARS_TO_RUN = 1;
const MIN_NEW_HOMES = 0;
const MAX_NEW_HOMES = 10;

function generateInitialHousingStock({ homeowners, landlords, homesTotal, nextHomeId }) {
  // Generate sorted home prices (simple linear spread for now)
  const basePrice = 350000;
  const priceSpread = 100000;
  const prices = Array.from({ length: homesTotal }, (_, i) => basePrice + (i - homesTotal/2) * (priceSpread / homesTotal));
  const defaultOwnerIncome = 70000; // Set a default income for owner-occupied homes

  // Assign ownerType and status
  const stock = [];
  let h = 0;
  for (; h < landlords; h++) {
    stock.push({
      id: nextHomeId.current++,
      price: prices[h],
      ownerType: 'landlord',
      status: 'Occupied', // Already rented at start
      usage: 'LongTermRental',
      ownerIncome: null,
    });
  }
  for (; h < landlords + homeowners; h++) {
    stock.push({
      id: nextHomeId.current++,
      price: prices[h],
      ownerType: 'homeowner',
      status: 'OwnerOccupied',
      usage: 'OwnerOccupied',
      ownerIncome: defaultOwnerIncome, // Set default income
    });
  }
  for (; h < homesTotal; h++) {
    stock.push({
      id: nextHomeId.current++,
      price: prices[h],
      ownerType: 'none',
      status: 'Vacant',
      usage: 'LongTermRental',
      ownerIncome: null,
    });
  }
  return stock;
}


function generateInitialSeekers({ seekersCount, nextSeekerId }) {
  // Use tiered income distribution for realism
  const incomes = [];
  const randomInRange = (min, max) => min + Math.random() * (max - min);
  const topCount = Math.floor(seekersCount * INCOME_TIERS.top.percent);
  const middleCount = Math.floor(seekersCount * INCOME_TIERS.middle.percent);
  const bottomCount = seekersCount - topCount - middleCount;
  for (let i = 0; i < topCount; i++) incomes.push(randomInRange(...INCOME_TIERS.top.range));
  for (let i = 0; i < middleCount; i++) incomes.push(randomInRange(...INCOME_TIERS.middle.range));
  for (let i = 0; i < bottomCount; i++) incomes.push(randomInRange(...INCOME_TIERS.bottom.range));
  incomes.sort((a, b) => a - b);
  return incomes.map(income => ({
    id: nextSeekerId.current++,
    income
  }));
}

function generateYearlySeekers({ population, growthRate, nextSeekerId }) {
  // Use tiered income distribution for new seekers as well
  const newSeekersCount = Math.max(1, Math.floor(population * growthRate));
  const incomes = [];
  const randomInRange = (min, max) => min + Math.random() * (max - min);
  const topCount = Math.floor(newSeekersCount * INCOME_TIERS.top.percent);
  const middleCount = Math.floor(newSeekersCount * INCOME_TIERS.middle.percent);
  const bottomCount = newSeekersCount - topCount - middleCount;
  for (let i = 0; i < topCount; i++) incomes.push(randomInRange(...INCOME_TIERS.top.range));
  for (let i = 0; i < middleCount; i++) incomes.push(randomInRange(...INCOME_TIERS.middle.range));
  for (let i = 0; i < bottomCount; i++) incomes.push(randomInRange(...INCOME_TIERS.bottom.range));
  incomes.sort((a, b) => a - b);
  return incomes.map(income => ({
    id: nextSeekerId.current++,
    income
  }));
}

function selectHomesForSale(housingStock, turnoverRate, newHomesArr) {
  // Exclude vacant/new homes from turnover selection
  const eligible = housingStock.filter(h => h.ownerType === 'homeowner' || h.ownerType === 'landlord');
  const numForSale = Math.max(1, Math.floor(eligible.length * (turnoverRate / 100)));
  // Shuffle eligible homes
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  const turnoverForSale = shuffled.slice(0, numForSale);
  // Combine with new homes
  return [...turnoverForSale, ...newHomesArr];
}

function matchSeekersToHomes(seekerPool, homesForSale) {
  // Sort seekers by income descending, homes by price descending
  const seekers = [...seekerPool].sort((a, b) => b.income - a.income);
  const homes = [...homesForSale].sort((a, b) => b.price - a.price);
  const boughtHomeIds = new Set();
  const matchedSeekers = new Set();
  let purchases = 0;


    // 5a. Landlords: 90% for first new home, if successful 95% for each remaining, else 75% for each remaining
    let firstSuccess = false;
    if (newHomesArr.length > 0 && currentLandlordCount < maxLandlordHomes) {
      if (Math.random() < 0.9) {
        landlordBoughtIds.add(newHomesArr[0].id);
        currentLandlordCount++;
        landlordPurchases++;
        firstSuccess = true;
      }
    }
    if (newHomesArr.length > 1) {
      for (let i = 1; i < newHomesArr.length; i++) {
        if (currentLandlordCount >= maxLandlordHomes) break;
        const chance = firstSuccess ? 0.95 : 0.75;
        if (Math.random() < chance) {
          landlordBoughtIds.add(newHomesArr[i].id);
          currentLandlordCount++;
          landlordPurchases++;
        }
      }
    }

    seekers.forEach(seeker => {
    const idx = homes.findIndex(home => !boughtHomeIds.has(home.id) && seeker.income * AFFORDABILITY_MULTIPLIER >= home.price && home.ownerType === 'none');
    if (idx !== -1) {
      boughtHomeIds.add(homes[idx].id);
      matchedSeekers.add(seeker.id);
      purchases++;
    }
  });

  return {
    boughtHomeIds,
    matchedSeekers,
    purchases,
  };
}

function matchLandlordsAndSeekersToHomes({
  seekerPool,
  homesForSale,
  housingStock,
  landlordCap,
  year,
}) {
  // 1. Landlords buy up to landlordCap% of total homes (including existing holdings)
  const totalHomes = housingStock.length;
  const maxLandlordHomes = Math.floor((landlordCap / 100) * totalHomes);
  let currentLandlordCount = housingStock.filter(h => h.ownerType === 'landlord').length;
  const homes = [...homesForSale].sort((a, b) => b.price - a.price);
  const landlordBoughtIds = new Set();
  let landlordPurchases = 0;

  // Landlords buy vacant/for-sale homes until cap is reached
  for (let i = 0; i < homes.length && currentLandlordCount < maxLandlordHomes; i++) {
    const home = homes[i];
    if (!landlordBoughtIds.has(home.id)) {
      landlordBoughtIds.add(home.id);
      currentLandlordCount++;
      landlordPurchases++;
    }
  }

  // 2. Seekers buy the most expensive home they can afford from remaining homes
  const seekers = [...seekerPool].sort((a, b) => b.income - a.income);
  const seekerBoughtIds = new Set();
  const matchedSeekers = new Set();
  let seekerPurchases = 0;

  seekers.forEach(seeker => {
    // Find the most expensive home the seeker can afford
    let bestIdx = -1;
    let bestPrice = -Infinity;
    for (let i = 0; i < homes.length; i++) {
      const home = homes[i];
      if (
        !landlordBoughtIds.has(home.id) &&
        !seekerBoughtIds.has(home.id) &&
        seeker.income * AFFORDABILITY_MULTIPLIER >= home.price &&
        home.price > bestPrice
      ) {
        bestIdx = i;
        bestPrice = home.price;
      }
    }
    if (bestIdx !== -1) {
      seekerBoughtIds.add(homes[bestIdx].id);
      matchedSeekers.add(seeker.id);
      seekerPurchases++;
    }
  });

  return {
    landlordBoughtIds,
    landlordPurchases,
    seekerBoughtIds,
    matchedSeekers,
    seekerPurchases,
  };
}

export default function HousingSimulationSimple() {
  // --- User Input State ---
  const [initialHomeowners, setInitialHomeowners] = useState(225);
  const [initialLandlords, setInitialLandlords] = useState(75);
  const [initialSeekers, setInitialSeekers] = useState(36);
  const [newHomes, setNewHomes] = useState  (3);
  const [turnoverRate, setTurnoverRate] = useState(4); // percent
  const [landlordCap, setLandlordCap] = useState(45); // percent
  const [simulationSpeed, setSimulationSpeed] = useState(250); // ms
  const [yearsToRun, setYearsToRun] = useState(10);
  const [populationGrowth, setPopulationGrowth] = useState(0.03); // 3% default

  // --- Refs for unique IDs ---
  const nextHomeId = useRef(0);
  const nextSeekerId = useRef(0);

  // Ensure landlordCap, turnoverRate, yearsToRun, and newHomes cannot go below/above their limits
  const handleLandlordCapChange = (val) => setLandlordCap(Math.max(MIN_LANDLORD_CAP, val));
  const handleTurnoverRateChange = (val) => setTurnoverRate(Math.max(MIN_TURNOVER_RATE, val));
  const handleYearsToRunChange = (val) => setYearsToRun(Math.max(MIN_YEARS_TO_RUN, val));
  const handleNewHomesChange = (val) => setNewHomes(Math.max(MIN_NEW_HOMES, Math.min(MAX_NEW_HOMES, val)));

  // --- Initialization ---
  const [housingStock, setHousingStock] = useState(() =>
    generateInitialHousingStock({
      homeowners: initialHomeowners,
      landlords: initialLandlords,
      homesTotal: HOMES_TOTAL,
      nextHomeId,
    })
  );
  // Start with an initial pool of 30 seekers
  const [seekerPool, setSeekerPool] = useState(() =>
    generateInitialSeekers({
      seekersCount: 30,
      nextSeekerId,
    })
  );

  // --- Yearly Simulation Step (advanceYear) ---
  // 1. Build new homes (fixed price)
  // 2. Mark homes for sale (turnover, new builds)
  // 3. Match buyers to homes:
  //    a. Landlords buy X% of owner-occupied resales (subject to cap)
  //    b. Seekers buy most expensive homes they can afford
  //    c. Landlords buy Y% of new construction (subject to cap)
  //    d. Seekers buy any remaining homes they can afford
  //    e. Mark any unsold homes
  // 4. Update rentals (assign renters to vacant rentals)
  // 5. Update incomes (optional, if income growth is desired)
  // 6. Update display data (stats for UI)

  // --- UI Rendering ---
  // - Render user input controls
  // - Render simulation stats and charts
  // - Render controls for running, pausing, resetting

  // State for testing the matching process
  const [homesForSale, setHomesForSale] = useState([]);
  const [matchingRun, setMatchingRun] = useState(false);
  const [year, setYear] = useState(1);
  const [homesBought, setHomesBought] = useState(0);
  const [landlordBought, setLandlordBought] = useState(0);
  const [landlordBoughtHomes, setLandlordBoughtHomes] = useState([]);
  const [unsoldHomes, setUnsoldHomes] = useState([]);
  const [seekerBuyingPower, setSeekerBuyingPower] = useState([]);
  const [seekerDebugAttempts, setSeekerDebugAttempts] = useState([]);

  // Example: Run matching step (placeholder logic)
  const runMatchingStep = () => {
    // For now, just select homes for sale and show counts
    // (Replace with real matching logic later)
    const newHomesArr = [];
    const forSale = selectHomesForSale(housingStock, turnoverRate, newHomesArr);
    setHomesForSale(forSale);
    setMatchingRun(true);
  };

  // Example: Run yearly simulation step
  const runSimulationStep = () => {
    // 1. Calculate current population (housed + seekers)
    const housed = housingStock.filter(h => h.status === 'OwnerOccupied' || h.status === 'Occupied').length;
    const totalPopulation = housed + seekerPool.length;

    // 2. Top 10% of renters (by income) enter the seeker pool
    const renters = housingStock.filter(h => h.ownerType === 'landlord' && h.status === 'Occupied');
    // Assign incomes to renters using the same tiered distribution as seekers
    function generateRenterIncomes(count) {
      const incomes = [];
      const topCount = Math.floor(count * INCOME_TIERS.top.percent);
      const middleCount = Math.floor(count * INCOME_TIERS.middle.percent);
      const bottomCount = count - topCount - middleCount;
      const randomInRange = (min, max) => min + Math.random() * (max - min);
      for (let i = 0; i < topCount; i++) incomes.push(randomInRange(...INCOME_TIERS.top.range));
      for (let i = 0; i < middleCount; i++) incomes.push(randomInRange(...INCOME_TIERS.middle.range));
      for (let i = 0; i < bottomCount; i++) incomes.push(randomInRange(...INCOME_TIERS.bottom.range));
      incomes.sort((a, b) => a - b);
      return incomes;
    }
    const renterIncomeList = generateRenterIncomes(renters.length);
    const renterIncomes = renters.map((r, idx) => ({
      id: r.id,
      income: Math.round(renterIncomeList[idx])
    }));
    renterIncomes.sort((a, b) => b.income - a.income);
    const top10Count = Math.max(1, Math.floor(renterIncomes.length * 0.10));
    const topRenters = renterIncomes.slice(0, top10Count);
    // Add these renters to the seeker pool as new seekers (assign new IDs)
    const topRentersAsSeekers = topRenters.map(r => ({
      id: nextSeekerId.current++,
      income: r.income
    }));
    // 3. Generate new seekers for this year
    const newSeekers = generateYearlySeekers({
      population: totalPopulation,
      growthRate: populationGrowth,
      nextSeekerId,
    });
    const updatedSeekers = [...seekerPool, ...topRentersAsSeekers, ...newSeekers];

    // 3. Build new homes (fixed price)
    const basePrice = 350000;
    const priceSpread = 100000;
    const newHomesArr = Array.from({ length: newHomes }, (_, i) => ({
      id: nextHomeId.current++,
      price: basePrice + (Math.random() - 0.5) * priceSpread,
      ownerType: 'none',
      status: 'Vacant',
      usage: 'LongTermRental',
      ownerIncome: null,
    }));
    const updatedStock = [...housingStock, ...newHomesArr];

    // 4. Select homes for sale (turnover + new homes)
    const homesForSaleArr = selectHomesForSale(updatedStock, turnoverRate, newHomesArr);

    // 5. Seekers get first chance to buy homes, but only succeed with 75% probability
    // 5a. Seekers try to buy homes
    const seekers = [...updatedSeekers].sort((a, b) => b.income - a.income);
    const homes = [...homesForSaleArr].sort((a, b) => b.price - a.price);
    const seekerBoughtIds = new Set();
    const matchedSeekers = new Set();
    let seekerPurchases = 0;
    const seekerDebugAttemptsArr = [];
  let currentLandlordCount = updatedStock.filter(h => h.ownerType === 'landlord').length;
  const totalHomes = updatedStock.length;
  const maxLandlordHomes = Math.floor((landlordCap / 100) * totalHomes);
  const landlordBoughtIds = new Set();
  let landlordPurchases = 0;
  seekers.forEach(seeker => {
      let tried = false;
      for (let i = 0; i < homes.length; i++) {
        const home = homes[i];
        if (!seekerBoughtIds.has(home.id) && !landlordBoughtIds.has(home.id) && seeker.income * AFFORDABILITY_MULTIPLIER >= home.price) {
          tried = true;
          const roll = Math.random();
          seekerDebugAttemptsArr.push({
            seekerId: seeker.id,
            seekerIncome: seeker.income,
            homeId: home.id,
            homePrice: home.price,
            success: roll < 0.75,
            roll: roll
          });
          if (roll < 0.75) {
            seekerBoughtIds.add(home.id);
            matchedSeekers.add(seeker.id);
            seekerPurchases++;
            break; // Stop after first success
          } else if (currentLandlordCount < maxLandlordHomes) {
            landlordBoughtIds.add(home.id);
            currentLandlordCount++;
            landlordPurchases++;
            break; // Landlord buys immediately after seeker fails
          }
        }
      }
      if (!tried) {
        seekerDebugAttemptsArr.push({
          seekerId: seeker.id,
          seekerIncome: seeker.income,
          homeId: null,
          homePrice: null,
          success: false,
          roll: null,
          reason: 'No affordable homes'
        });
      }
    });
    setSeekerDebugAttempts(seekerDebugAttemptsArr);

    // 5b. Landlords buy from remaining homes up to cap
    // (No need to redeclare variables, just continue using the same ones)
    for (let i = 0; i < homes.length && currentLandlordCount < maxLandlordHomes; i++) {
      const home = homes[i];
      if (!seekerBoughtIds.has(home.id) && !landlordBoughtIds.has(home.id)) {
        landlordBoughtIds.add(home.id);
        currentLandlordCount++;
        landlordPurchases++;
      }
    }

    // 6. Update housing stock: assign ownerType and status for bought homes
    let newStock = updatedStock.map(home => {
      if (landlordBoughtIds.has(home.id)) {
        return {
          ...home,
          ownerType: 'landlord',
          status: 'Occupied', // Immediately occupied after purchase
          usage: 'LongTermRental',
          ownerIncome: null,
        };
      }
      if (seekerBoughtIds.has(home.id)) {
        return {
          ...home,
          ownerType: 'homeowner',
          status: 'OwnerOccupied',
          usage: 'OwnerOccupied',
          ownerIncome: updatedSeekers.find(s => matchedSeekers.has(s.id))?.income || home.ownerIncome,
        };
      }
      return home;
    });
    // After buying, assign renters: all landlord-owned homes that are not vacant or short-term rentals are occupied by a tenant
    newStock = newStock.map(home => {
      if (
        home.ownerType === 'landlord' &&
        home.status !== 'Vacant' &&
        home.usage !== 'ShortTermRental'
      ) {
        return { ...home, status: 'Occupied' };
      }
      return home;
    });
    // Remove matched seekers from pool
    const remainingSeekers = updatedSeekers.filter(s => !matchedSeekers.has(s.id));

    setSeekerPool(remainingSeekers);
    setHousingStock(newStock);
    setHomesForSale(homesForSaleArr);
    setHomesBought(seekerPurchases);
    setLandlordBought(landlordPurchases);
    setLandlordBoughtHomes(
      homesForSaleArr.filter(h => landlordBoughtIds.has(h.id))
    );
    // Find unsold homes for sale (not bought by landlord or seeker)
    setUnsoldHomes(
      homesForSaleArr.filter(
        h =>
          !landlordBoughtIds.has(h.id) &&
          !seekerBoughtIds.has(h.id)
      )
    );
    setMatchingRun(true);
    setYear(y => y + 1);
    setSeekerBuyingPower(
      updatedSeekers
        .map(s => ({
          id: s.id,
          income: Math.round(s.income),
          buyingPower: Math.round(s.income * AFFORDABILITY_MULTIPLIER),
        }))
        .sort((a, b) => b.buyingPower - a.buyingPower)
    );
  };

  return (
    <div>
      {/* User input controls */}
      <button onClick={runSimulationStep}>Run Simulation Step</button>
      {matchingRun && (
        <div>
          <div style={{marginTop: '1em'}}>
            <b>Population Breakdown:</b>
            {(() => {
              const numSeekers = seekerPool.length;
              const numHomeowners = housingStock.filter(h => h.ownerType === 'homeowner').length;
              const numRenters = housingStock.filter(h => h.ownerType === 'landlord' && h.status === 'Occupied').length;
              const total = numSeekers + numHomeowners + numRenters;
              return (
                <div>
                  <span>{`Seekers: ${numSeekers}`}</span><br />
                  <span>{`Homeowners: ${numHomeowners}`}</span><br />
                  <span>{`Renters: ${numRenters}`}</span><br />
                  <span style={{fontWeight: 'bold'}}>{`Total: ${total}`}</span>
                </div>
              );
            })()}
          </div>
          <div style={{marginTop: '1em'}}>
            <div>Year: {year - 1}</div>
            <div>Homes for sale this step: {homesForSale.length}</div>
            <div>Seekers in market: {seekerPool.length}</div>
            <div>Homes bought by landlords: {landlordBought}</div>
            <div>Homes bought by seekers: {homesBought}</div>
            <div style={{marginTop: '1em'}}>
              <b>All Homes For Sale (ID, Price):</b>
              <ul>
                {homesForSale.map(h => (
                  <li key={h.id}>ID: {h.id}, Price: {Math.round(h.price).toLocaleString()}</li>
                ))}
              </ul>
            </div>
            <div style={{marginTop: '1em'}}>
              <b>Landlord Purchases (ID, Price):</b>
              <ul>
                {[...landlordBoughtHomes]
                  .sort((a, b) => Math.round(b.price) - Math.round(a.price))
                  .map(h => (
                    <li key={h.id}>ID: {h.id}, Price: {Math.round(h.price).toLocaleString()}</li>
                  ))}
              </ul>
            </div>
            <div style={{marginTop: '1em'}}>
              <b>Unsold Homes (ID, Price):</b>
              <ul>
                {[...unsoldHomes]
                  .sort((a, b) => Math.round(b.price) - Math.round(a.price))
                  .map(h => (
                    <li key={h.id}>ID: {h.id}, Price: {Math.round(h.price).toLocaleString()}</li>
                  ))}
              </ul>
            </div>
            <div style={{marginTop: '1em'}}>
              <b>Seekers' Buying Power:</b>
              <ul>
                {seekerBuyingPower.map(s => (
                  <li key={s.id}>ID: {s.id}, Income: {s.income.toLocaleString()}, Buying Power: {s.buyingPower.toLocaleString()}</li>
                ))}
              </ul>
            </div>
            <div style={{marginTop: '1em'}}>
              <b>Total Income of Top 5% of Everyone (Seekers + Homeowners):</b>
              <div>
                {(() => {
                  // Gather all incomes: seekers and homeowners
                  const seekerIncomes = seekerBuyingPower.map(s => s.income);
                  const homeownerIncomes = housingStock
                    .filter(h => h.ownerType === 'homeowner' && h.ownerIncome)
                    .map(h => Math.round(h.ownerIncome));
                  const allIncomes = [...seekerIncomes, ...homeownerIncomes].sort((a, b) => b - a);
                  if (allIncomes.length === 0) return null;
                  const topCount = Math.max(1, Math.floor(allIncomes.length * 0.05));
                  const total = allIncomes.slice(0, topCount).reduce((sum, inc) => sum + inc, 0);
                  return (
                    <>
                      <span>{`$${Math.round(total).toLocaleString()}`}</span>
                      <br />
                      <span style={{fontSize: '0.9em', color: '#555'}}>
                        {`(Number of individuals: ${topCount} out of ${allIncomes.length})`}
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
            <div style={{marginTop: '1em'}}>
              <b>All Home Prices (rounded, descending):</b>
              <ul>
                {[...housingStock]
                  .map(h => Math.round(h.price))
                  .sort((a, b) => b - a)
                  .map((price, idx) => (
                    <li key={idx}>${price.toLocaleString()}</li>
                  ))}
              </ul>
            </div>
          </div>
          <div style={{marginTop: '1em'}}>
            <b>Seeker Purchase Attempts (Debug):</b>
            <ul>
              {seekerDebugAttempts.map((attempt, idx) => (
                <li key={idx}>
                  Seeker {attempt.seekerId} (income: ${attempt.seekerIncome?.toLocaleString()})
                  {attempt.homeId !== null
                    ? ` tried home ${attempt.homeId} ($${Math.round(attempt.homePrice).toLocaleString()}) - ` +
                      (attempt.success ? 'SUCCESS' : `FAIL (roll: ${attempt.roll?.toFixed(2)})`)
                    : ' could not afford any home.'}
                  {attempt.reason ? ` (${attempt.reason})` : ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

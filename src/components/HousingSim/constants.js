export const HOMES_TOTAL = 300;
export const INITIAL_SEED = 12345;
export const INITIAL_VACANCY_RATE = 0.05;
export const RENTAL_TURNOVER_RATE = 0.15;
export const RE_ENTRANT_RATE = 0.5;
export const FORECLOSURE_RATE = 0.15;
export const AFFORDABILITY_MULTIPLIER = 4;
export const BASE_APPRECIATION = 0.02;
export const MAX_RENT_INCREASE = 0.15;
export const STR_CAP_RATE = 0.10;
export const STR_CONVERSION_CHANCE = 0.20;
export const HOMEOWNER_TO_HOMEOWNER_SALE_CHANCE = 0.10;
export const POPULATION_GROWTH_RATE = 0.02;
export const INCOME_GROWTH_RATE = 0.03;

export const INCOME_TIERS = {
    top: {
        percent: 0.05,  // 95th percentile and up
        range: [150000, 400000]
    },
    upper_middle: {
        percent: 0.24,  // 71-94th percentile
        range: [81000, 149999]
    },
    lower_middle: {
        percent: 0.41,  // 30-70th percentile
        range: [50000, 80999]
    },
    bottom: {
        percent: 0.30,  // 0-29th percentile
        range: [30000, 49999]
    }
};

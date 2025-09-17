### 1. Model Parameters
The initial state and rules of the simulation are controlled by the following inputs:

Sale Turnover (%): The percentage of the total housing stock that is listed for sale each year due to normal market churn.

New Homes / Year: The target number of new housing units to be introduced into the market annually. The actual number built is subject to the New Home Approval Rate.

Initial Seekers: The initial unhoused population seeking housing at the start of the simulation.

Landlord Cap (%): A regulatory ceiling that sets the maximum allowable market share for the investor class (landlords).

Homeowners & Landlords: The initial distribution of property ownership between owner-occupants and investors.

Years to Run: The duration of the simulation when executed automatically.

### 2. Simulation Controls
Run/Pause: Toggles the automatic, year-over-year progression of the simulation.

Advance Year: Manually progresses the simulation by a single year.

Reset: Reverts the simulation to the initial parameters defined in the input fields.

Trigger Mortgage Collapse: Introduces a one-time market shock in the next year, characterized by a high rate of homeowner foreclosures.

### 3. Dashboard Metrics & Visualization
The simulation's outputs are displayed across several sections.

#### Visual Grid & Legend
A color-coded grid represents every housing unit in the simulation, grouped by status for clear analysis of market composition.

<span class="inline-block w-4 h-4 rounded-full bg-green-500 mr-2 align-middle"></span>Owner Occupied: Property owned and occupied by the owner.

<span class="inline-block w-4 h-4 rounded-full bg-blue-800 mr-2 align-middle"></span>Rental Occupied: Investor-owned property with a tenant.

<span class="inline-block w-4 h-4 rounded-full bg-blue-400 mr-2 align-middle"></span>Rental Vacant: Investor-owned property available for rent.

<span class="inline-block w-4 h-4 rounded-full bg-[#ffbf00] mr-2 align-middle"></span>Unsold Homes: Newly built units that failed to sell in their first year.

<span class="inline-block w-4 h-4 rounded-full bg-purple-500 mr-2 align-middle"></span>Short-Term Rental: Investor-owned property used for short-term lets.

#### Key Performance Indicators
Current Market Stats: Displays primary market indicators such as Median Home Price, Median Rent, and Median Rent Burden.

Political & Supply Metrics: Tracks variables related to supply constraints.

Landlord Concentration: The market share percentage held by the investor class.

New Home Approval Rate: A dynamic variable modeling the impact of market concentration on new supply.

Annual Supply Deficit: The difference between potential new homes and the number actually built.

Cumulative Market Activity: Tracks aggregate outcomes over the entire simulation run.

Displacements: The number of tenants forced to re-enter the seeker pool after their rental unit was sold.

Total Housing Not Built: The cumulative supply deficit.

Pushed into Homelessness: A probabilistic metric tracking displaced households that fail to find new housing.

### 4. Key Dynamics to Observe
The simulation is designed to model the interaction between several key variables. As you run scenarios, pay particular attention to the following relationships:

The correlation between the size of the Seeking Housing pool and the annual price/rent appreciation rates.

The effect of rising Landlord Concentration on the New Home Approval Rate and the resulting Supply Deficit.

The relationship between the Displacements metric and the Pushed into Homelessness outcome.

The impact of the Landlord Cap in preventing or merely delaying a market failure state.
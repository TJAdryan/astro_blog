import React, { useState } from 'react';

export default function SimulationInstructions() {
const [show, setShow] = useState(false);

return (
<div className="mb-8 flex flex-col items-center w-full">
    <button
    className="px-4 py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mx-auto"
    onClick={() => setShow((s) => !s)}
    aria-expanded={show}
    aria-controls="sim-instructions"
    >
    {show ? 'Hide Instructions' : 'Show Instructions'}
    </button>
    {show && (
    <div
        id="sim-instructions"
        className="prose prose-blue bg-gray-50 border border-gray-200 rounded p-6 shadow-sm w-full max-w-4xl mx-auto"
    >
        <h3>Simulation Documentation</h3>
        <p>
        This simulation models the economic feedback loops within a closed housing market. It allows for the observation of market dynamics under various initial conditions, rules, and economic pressures.
        </p>
        <hr />

        <h4>1. Model Parameters</h4>
        <p>The initial state and rules of the simulation are controlled by the following inputs:</p>
        <ul>
        <li><strong>Sale Turnover (%):</strong> The percentage of the total housing stock that is listed for sale each year due to normal market churn.</li>
        <li><strong>New Homes / Year:</strong> The target number of new housing units to be introduced into the market annually. The actual number built is subject to the <strong>New Home Approval Rate</strong>.</li>
        <li><strong>Initial Seekers:</strong> The initial unhoused population seeking housing at the start of the simulation.</li>
        <li><strong>Landlord Cap (%):</strong> A regulatory ceiling that sets the maximum allowable market share for the investor class (landlords).</li>
        <li><strong>Homeowners & Landlords:</strong> The initial distribution of property ownership between owner-occupants and investors.</li>
        </ul>

        <h4>2. Simulation Controls</h4>
        <ul>
        <li><strong>Run/Pause:</strong> Toggles the automatic, year-over-year progression of the simulation.</li>
        <li><strong>Advance Year:</strong> Manually progresses the simulation by a single year.</li>
        <li><strong>Reset:</strong> Reverts the simulation to the initial parameters defined in the input fields.</li>
        <li><strong>Trigger Mortgage Collapse:</strong> Introduces a one-time market shock in the next year, characterized by a high rate of homeowner foreclosures.</li>
        </ul>
        <hr />

        <h4>3. Dashboard Metrics & Visualization</h4>
        <h5>Visual Grid & Legend</h5>
        <p>A color-coded grid represents every housing unit, grouped by status for clear analysis of market composition.</p>
        <ul>
        <li><span style={{backgroundColor: '#22c55e', display: 'inline-block', width: '1em', height: '1em', borderRadius: '50%', marginRight: '0.5em', verticalAlign: 'middle'}}></span><strong>Owner Occupied:</strong> Property owned and occupied by the owner.</li>
        <li><span style={{backgroundColor: '#1e40af', display: 'inline-block', width: '1em', height: '1em', borderRadius: '50%', marginRight: '0.5em', verticalAlign: 'middle'}}></span><strong>Rental Occupied:</strong> Investor-owned property with a tenant.</li>
        <li><span style={{backgroundColor: '#60a5fa', display: 'inline-block', width: '1em', height: '1em', borderRadius: '50%', marginRight: '0.5em', verticalAlign: 'middle'}}></span><strong>Rental Vacant:</strong> Investor-owned property available for rent.</li>
        <li><span style={{backgroundColor: '#ffbf00', display: 'inline-block', width: '1em', height: '1em', borderRadius: '50%', marginRight: '0.5em', verticalAlign: 'middle'}}></span><strong>Unsold New Construction:</strong> Newly built units that failed to sell in their first year.</li>
        <li><span style={{backgroundColor: '#a21caf', display: 'inline-block', width: '1em', height: '1em', borderRadius: '50%', marginRight: '0.5em', verticalAlign: 'middle'}}></span><strong>Short-Term Rental:</strong> Investor-owned property used for short-term lets.</li>
        </ul>
        
        <h5>Key Performance Indicators</h5>
        <ul>
            <li><strong>Current Market Stats:</strong> Displays primary indicators such as <strong>Median Home Price</strong>, <strong>Median Rent</strong>, and <strong>Median Rent Burden</strong>.</li>
            <li><strong>Political & Supply Metrics:</strong> Tracks variables related to supply constraints, including <strong>Landlord Concentration</strong> and the resulting <strong>New Home Approval Rate</strong>.</li>
            <li><strong>Cumulative Market Activity:</strong> Tracks aggregate outcomes, including tenant <strong>Displacements</strong> and the probabilistic <strong>Pushed into Homelessness</strong> metric.</li>
        </ul>
        <hr />

        <h4>4. Key Dynamics to Observe</h4>
        <p>The simulation is designed to model the interaction between several key variables. As you run scenarios, pay particular attention to the following relationships:</p>
        <ol>
        <li>The correlation between the size of the <strong>Seeking Housing</strong> pool and the annual <strong>price/rent appreciation rates</strong>.</li>
        <li>The effect of rising <strong>Landlord Concentration</strong> on the <strong>New Home Approval Rate</strong> and the resulting <strong>Supply Deficit</strong>.</li>
        <li>The relationship between the <strong>Displacements</strong> metric and the <strong>Pushed into Homelessness</strong> outcome.</li>
        </ol>
    </div>
    )}
</div>
);
}
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
          className="prose prose-blue bg-gray-50 border border-gray-200 rounded p-4 shadow-sm w-full max-w-7xl mx-auto px-4"
        >
          <h3>How to Use the Housing Market Simulation</h3>
          <ol>
            <li>
              <strong>Adjust Simulation Inputs</strong>
              <ul>
                <li><strong>Sale Turnover (%)</strong>: The percent of homes that go up for sale each year.</li>
                <li><strong>New Homes / Year</strong>: How many new homes are built each year.</li>
                <li><strong>Initial Seekers</strong>: Number of people/families looking for housing at the start.</li>
                <li><strong>Landlord Cap (%)</strong>: The maximum percent of homes that can be owned by landlords.</li>
                <li><strong>Homeowners</strong>: Initial number of homes owned by homeowners.</li>
                <li><strong>Landlords</strong>: Initial number of homes owned by landlords.</li>
                <li><strong>Years to Run</strong>: How many years the simulation will run when started.</li>
              </ul>
            </li>
            <li>
              <strong>Run or Pause the Simulation</strong>
              <ul>
                <li>Click the <strong>Run</strong> button to start the simulation. The button will change to <strong>Pause</strong> while running.</li>
                <li>Click <strong>Pause</strong> to stop the simulation at any time.</li>
              </ul>
            </li>
            <li>
              <strong>Advance Year or Reset</strong>
              <ul>
                <li>Use <strong>Advance Year</strong> to step forward one year at a time (only when paused).</li>
                <li>Use <strong>Reset</strong> to return all settings and the simulation to their starting values.</li>
              </ul>
            </li>
            <li>
              <strong>Trigger Mortgage Collapse</strong>
              <ul>
                <li>Click <strong>Trigger Mortgage Collapse</strong> to simulate a year with a high rate of foreclosures (only available when paused).</li>
              </ul>
            </li>
            <li>
              <strong>View Results</strong>
              <ul>
                <li>The dashboard shows:</li>
                <ul>
                  <li>Current market stats (population, seekers, home prices, rents, incomes, etc.).</li>
                  <li>A visual grid of all homes, color-coded by status and type.</li>
                  <li>Cumulative market activity (purchases, conversions, displacements).</li>
                </ul>
              </ul>
            </li>
            <li>
              <strong>Legend</strong>
              <ul>
                <li>Colored dots explain the meaning of each home type/status in the visual grid.</li>
              </ul>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}

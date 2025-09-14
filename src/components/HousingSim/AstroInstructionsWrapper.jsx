import React, { useState } from 'react';
import SimulationInstructions from './SimulationInstructions.astro';

export default function AstroInstructionsWrapper({ show }) {
  if (!show) return null;
  return <SimulationInstructions />;
}

---
title: "An Imperfect Model for an Imperfect Market"
description: "A simulation-based exploration of how market forces affect housing utility and affordability."
pubDate: 2025-09-14
---

<div style="text-align:center; margin:2em 0;">
  <a href="/simulation" style="display:inline-block; background:#ffd700; color:#222; border:2px solid #bfa500; border-radius:8px; padding:1em 2.5em; font-size:1.5em; font-weight:bold; text-decoration:none; box-shadow:0 2px 8px rgba(0,0,0,0.10); transition:background 0.2s;">
    TAKE ME TO THE SIMULATION
  </a>
</div>

> **Homeownership: A Shifting Foundation**  
> For generations, homeownership has been a cornerstone of the American narrative—a key marker of financial stability and a primary vehicle for building wealth. The 2008 financial crisis, however, fundamentally reshaped this landscape, and its aftershocks continue to define the market today.

---

### The Post-2008 Housing Landscape

To understand the modern housing market, it's crucial to look at the data. According to the U.S. Census Bureau, the national homeownership rate ([see the data on FRED](https://fred.stlouisfed.org/series/RHORUSQ156N)) was **67.8%** in the first quarter of 2008. In the aftermath of the crisis, it entered a prolonged decline, hitting a generational low of **62.9%** in 2016. While the rate has since recovered to roughly **66%** as of mid-2025, it highlights a market that is fundamentally more complex than it was a generation ago.

This new environment is shaped by a series of rational, yet often competing, economic forces:

- For an existing homeowner, rising property values feel like a clear financial win.
- For a seller, accepting the highest bid is the logical outcome of an efficient market.
- For an institutional investor or local landlord, purchasing properties to meet rental demand is a sound business decision based on established metrics.

None of these actions are inherently disruptive. Yet, when aggregated, they can produce collective outcomes that are challenging for the community as a whole, particularly for first-time buyers. A home's soaring market price may increase the paper wealth of its owner, but its fundamental utility—as a place to live—remains unchanged. This growing gap between an asset's market price and its practical value is a defining feature of the post-2008 economy.

---

### Modeling the Market

How do these individual, logical decisions create complex feedback loops that drive up prices and impact affordability? To explore this question and visualize how these forces interact, I developed a simulation that models the behavior of different actors within a simplified housing market.

---

> **Try It Yourself: Interactive Housing Simulation**  
> [Interactive Housing Simulation](https://github.com/TJAdryan/astro_blog/blob/main/src/components/HousingSim/HousingSimulation.jsx)

> **Simulation Parameters:**  
> The weights and constants used in the simulation are available in  
> [`housing_weights.json`](https://github.com/TJAdryan/astro_blog/blob/main/src/components/HousingSim/housing_weights.json)

---

#### **Download & Run the Simulation Locally**

**Requirements:**  
- [Node.js](https://nodejs.org/) and npm

**Setup Instructions:**
1. Download the code above or clone the repository:
   ```bash
   git clone https://github.com/TJAdryan/astro_blog.git
   cd astro_blog
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the local address shown in the terminal (usually http://localhost:3000).

> You only need the code in `src/components/HousingSim/HousingSimulation.jsx` to experiment with the simulation logic, but running the full project gives you the interactive UI.

---

### The Widening Gaps: From Credentials to Housing

As much as I tried to make this an impartial look at a simplified version of today's housing market, I have opinions and probably some biases. It’s a symptom of a larger economic reality defined by two powerful trends: the rising bar for entry and the shifting psychological rewards for clearing it.

**1. Credential Inflation**  
More jobs now require a bachelor's degree, even when the work hasn't become more complex. Research from Harvard Business School, such as the ["Dismissed by Degrees" report](https://www.hbs.edu/managing-the-future-of-work/Documents/dismissed-by-degrees.pdf), shows that this often functions as a screening tool in a crowded labor market, rather than a true measure of skill, creating costly barriers for individuals without improving performance.

**2. The Psychology of Inequality**  
For years, the prevailing wisdom came from a 2010 study by Daniel Kahneman and Angus Deaton ([see the original PNAS study](https://www.pnas.org/doi/10.1073/pnas.1011492107)). They found that while life satisfaction continued to rise with income, day-to-day emotional well-being tended to plateau at around $75,000 per year.

However, a more recent 2023 study by Kahneman and Matthew Killingsworth refined this view, finding that for most people, happiness does continue to rise with income ([see the study in PNAS](https://www.pnas.org/doi/10.1073/pnas.2208661120)). The critical context is inequality. The Relative Income Hypothesis suggests our happiness is deeply tied to our economic standing relative to others. In a society with vast wealth gaps, each additional dollar has a higher "happiness utility" because it buys insulation from precarity and a greater sense of status and security.

---


### The Appreciation Trap

Home prices rise, creating "paper wealth" for owners, but this increase does not improve a home's utility as shelter. Owners often oppose development that could make housing more affordable, seeking to protect their appreciation. Meanwhile, investors with a cash advantage win bidding wars, efficiently turning homes into vehicles for rental income rather than family shelter. The conversion of homes to short-term rentals further maximizes financial returns but reduces the supply of long-term housing, increasing scarcity and raising costs for the broader community.

---

#### The Dashboard of the Divide

The simulation's dashboard reveals the measurable outcomes of these dynamics:

- **Median Homeowner Income** (the asset owners) pulls away from
- **Median Seeker Income** (those seeking the utility of shelter)
- **Median Rent Burden** shows the direct cost of renting a home's utility when you cannot afford to buy the asset itself

It is the real-time measurement of the market decoupling from the community it's meant to serve.

---


#### Realigning Price and Purpose

This model, I hope, doesn't have a conclusion. I built it to help as tool to broaden my understanding.  If it fails to that for you, I regret that.   That is why I included the code. I would love to see other people's models.  I think at the very least this is a good place for anyone trying to better understand how markets work.  

But this is just one interpretation—an imperfect model for an imperfect market. If you find flaws in my logic, I would love to hear them. I know I have bias, as much as I like to see myself as logical and clear minded, I am well aware I am often wrong before I am right.  I also welcome idealogical criticism, should you be intersted in providing it.


Best,
Dominick

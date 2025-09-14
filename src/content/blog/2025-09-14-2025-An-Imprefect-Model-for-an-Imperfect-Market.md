An Imperfect Model for an Imperfect Market
We all want the best lives we can have. That’s a fundamental human drive. We work hard, we save, and we try to make decisions that will give us and our families stability and security. For generations, owning a home was the cornerstone of that dream.

But what happens when the very market forces that seem to reward our efforts start to work against the community as a whole? A rising home value feels like a personal win. The ability to sell your property quickly to the highest bidder feels like an efficient market. None of these actions are malicious. They are rational, individual choices.

Yet, we see the collective results seem to work very well for a few people and not as well for everyone else. A more expensive home may lead to greater paper wealth, but has it changed its underlying utility? This dynamic isn't unique; we see it in other areas, like an elite college education that costs many multiples of what it used to without a proportional increase in the incomes of its graduates. The price of an asset becomes disconnected from its practical value.

This simulation is an attempt to model how this process unfolds specifically within the housing market.

You can run the simulation and test these scenarios yourself here:
Interactive Housing Simulation

If you want to download the code:
https://github.com/TJAdryan/astro_blog/blob/main/src/components/HousingSim/HousingSimulation.jsx

If you want to run the simulation locally:

1. Make sure you have [Node.js](https://nodejs.org/) and npm installed.
2. Download the code above or clone the repository:
   ```bash
   git clone https://github.com/TJAdryan/astro_blog.git
   cd astro_blog
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the local address shown in the terminal (usually http://localhost:3000).

You only need the code in `src/components/HousingSim/HousingSimulation.jsx` to experiment with the simulation logic, but running the full project gives you the interactive UI.

The Widening Gaps: From Credentials to Housing
The struggle for housing doesn't happen in a vacuum. It’s a symptom of a larger economic reality defined by two powerful trends: the rising bar for entry and the shifting psychological rewards for clearing it.

First, we face "credential inflation." More and more jobs now require a bachelor's degree, not because the work has become more complex, but because the degree itself has become a screening tool in a crowded labor market. This forces individuals to invest heavily in a credential that may not increase their on-the-job performance, simply to get a foot in the door.

Second, the psychological engine driving this competition has been thrown into overdrive by inequality. For years, the prevailing wisdom came from a 2010 study by Daniel Kahneman and Angus Deaton, which found that emotional well-being, or day-to-day happiness, tended to plateau at an income of around $75,000. Beyond that, more money didn't seem to make people happier.

However, a more recent 2023 study by Kahneman and Matthew Killingsworth refined this view. They found that for most people, happiness does continue to rise with income. The critical context is inequality. The Relative Income Hypothesis suggests our happiness is deeply tied to our economic standing relative to others. In a society with vast wealth gaps, each additional dollar has a higher "happiness utility" because it buys insulation from precarity and a greater sense of status and security. The goalposts for a "good life" keep moving.

Case Study: When Shelter Becomes a Financial Asset
These pressures—the need for credentials to get ahead and the psychological drive for a higher relative income—converge with devastating effect in the housing market. Here, the conflict between a home's utility as shelter and its function as a financial asset becomes painfully clear.

The Appreciation Trap: The model shows home prices rising, creating "paper wealth." But this rising price doesn't improve the home's utility. For those who own the asset, their balance sheet looks great. For those who need the shelter, the asset's rising cost creates an ever-higher barrier, forcing them into a more precarious and expensive race.

The 'Efficient' Transfer of Utility: In the simulation, investors with a "cash advantage" often win bidding wars. From a purely financial perspective, the market is working efficiently. But from a utility perspective, a property that provided shelter for a family is now a vehicle for generating rental income, prioritizing its financial return over its residential purpose.

Maximizing Returns, Reducing Shelter: The clearest example is converting a home to a short-term rental. This is a rational choice to maximize an asset's financial return. But for the community, it removes a unit of long-term shelter, increasing scarcity and raising housing costs for everyone else.

The Dashboard of the Divide
The simulation's dashboard reveals the measurable outcomes of these dynamics. You can watch the Median Homeowner Income (the asset owners) pull away from the Median Seeker Income (those seeking the utility of shelter). The rising Median Rent Burden shows the direct cost of renting a home's utility when you cannot afford to buy the asset itself. It is the real-time measurement of the market decoupling from the community it's meant to serve.

Realigning Price and Purpose
This model, I hope doesn't have a conclusion. I built it to help me think through something I was trying to understand better. 

But this is just one interpretation—an imperfect model for an imperfect market. If you find flaws in my logic, I would love to hear them, I know I have bias, as much as I like to see myself as logical and clear minded.  I sincerely ask you to consider where my thinking might be wrong, where the model falls short, and how we can all better understand these complex forces. Please share your thoughts in the comments and help me see what I'm missing.
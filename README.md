This is a [Banzai GameFi](https://banzai.meme) new dApp, created using Next.js, AppKit, Wagmi, Viem, Redux Toolkit.

Game concept: 
* Users participate in the game by sending stakes of an equal amount of tokens to the smart contract, for example, 0.1 ETH per stake.
* Once the game pool is filled with 10 stakes, the smart contract randomly selects one winner, who receives 90% of the total pool (in this example, 0.9 ETH).
* Each stake gives a 10% chance to win, and a user can submit up to 5 stakes per round, increasing their chance of winning to 10–50%.
* The remaining 10% of the pool is reserved as a reward for developers and the ecosystem. Fees collected by the smart contract are used to purchase $BANZAI tokens.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pools list
![Screen](screenshots/pool_list.png)

## Pool page
![Screen](screenshots/pool_page.png)

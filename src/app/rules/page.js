'use client'

import styles from './page.module.css'
import poolsConf from '@/config/pools'
import { Box, Typography, Button, Link } from '@mui/material'

export default function Home() {
  return (
    <div className={styles.page}>
        <main className={styles.main}>
          <Typography variant='h5' sx={{ textAlign: 'center' }}>Game Rules</Typography>
          <ol>
            <li>
              Users participate in the game by sending stakes of an equal amount of tokens to the smart contract, for example, 0.1 ETH per stake.
            </li>
            <li>
              Once the game pool is filled with 10 stakes, the smart contract randomly selects one winner, who receives 90% of the total pool (in this example, 0.9 ETH).
            </li>
            <li>
              Each stake gives a 10% chance to win, and a user can submit up to 5 stakes per round, increasing their chance of winning to 10–50%.
            </li>
            <li>
              Each user can send up to 5 stakes in one round. So chance to win can be from 10 to 50 percent
            </li>
            <li>
              The remaining 10% of the pool is reserved as a reward for developers and the ecosystem. Fees collected by the smart contract are used to purchase $BANZAI tokens.
            </li>
          </ol>

          <img src='/icons/pool_scheme.png' className={styles.scheme} />
        </main>
    </div>
  );
}

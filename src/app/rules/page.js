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
              Users send stakes of same amount to smart contract. For example 0.1 eth
            </li>
            <li>
              When game pool is filled with 10 stakes, one random winner detected by smart contract and
              it sends to his wallet 9 stakes amount (90% of pool). In this example: 0.9 eth
            </li>
            <li>
              One stake has 10% chance to win. 
            </li>
            <li>
              Each user can send up to 5 stakes in one round. So chance to win can be from 10 to 50 percent
            </li>
            <li>
              10% from each round is reward for developers and ecosystem. Fees earned by smart contracts are 
              used to buy $BANZAI token.
            </li>

          </ol>
          <img src='/icons/pool_scheme.png' className={styles.scheme} />
        </main>
    </div>
  );
}

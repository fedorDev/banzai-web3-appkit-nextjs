'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import poolsConf from '@/config/pools'
import { Box, Typography, Button, Stack, Link } from '@mui/material'
import PoolListItem from '@/components/PoolListItem'

export default function Home() {
  return (
    <div className={styles.page}>
        <main className={styles.main}>
          <Typography variant='h5' sx={{ textAlign: 'center' }}>Links</Typography>
          <ol>
            <li>
              X: <Link href='https://x.com/Banzai_GameFi'>https://x.com/Banzai_GameFi</Link>
            </li>
            <li>
              dAppRadar: <Link href='https://dappradar.com/dapp/banzai-gamefi/'>
                https://dappradar.com/dapp/banzai-gamefi/
              </Link>
            </li>
            <li>
              TheDappList: <Link href='https://thedapplist.com/project/banzai-gamefi?source=thedapplist'>
                https://thedapplist.com/project/banzai-gamefi
              </Link>
            </li>
            <li>
              Four meme launchpad: <Link href='https://four.meme/token/0xa28f31e578aa8cf563782073aaa53478ed5bce6b'>
                https://four.meme/token/0xa28f31e578aa8cf563782073aaa53478ed5bce6b
              </Link>
            </li>
          </ol>
        </main>
    </div>
  );
}

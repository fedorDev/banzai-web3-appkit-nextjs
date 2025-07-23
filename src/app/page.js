'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import poolsConf from '@/config/pools'
import { Box, Typography, Button, Stack } from '@mui/material'
import PoolListItem from '@/components/PoolListItem'
import LastWinners from '@/components/LastWinners'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRates } from '@/store/ratesSlice'

export default function Home() {
  const [activity, setActivity] = useState({})
  const { address, isConnected } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const router = useRouter()

  const [pools, setPools] = useState(false)
  const rates = useSelector((state) => state.rates.rates)
  const dispatch = useDispatch()

  const chain = useMemo(() => {
    if (chainId == 1) return 'eth'
    return 'bsc'
  }, [chainId])

  useEffect(() => {
    if (!isConnected) setPools(false)
    if (isConnected) setPools(poolsConf[chainId == 1 ? 'eth' : 'bsc'])
  }, [isConnected, chainId])

  const loadActivity = async () => {
    const req = await fetch('/api/pools-activity').catch((err) => false)
    if (!req || !req.ok) return false

    const data = await req.json()
    if (data && data.state) {
      setActivity(data.state)
    }      
  }

  useEffect(() => {
    dispatch(fetchRates())
    loadActivity()
  }, [dispatch])

  const openPool = (address) => {
    router.push(`/${chain}/${address}/`)
  }

  console.log('got RATES', rates)

  return (
    <div className={styles.page}>
      {!pools && (
        <main className={styles.main}>
          <LastWinners />

          <Image
            className={styles.logo}
            src="/icons/big-flag.png"
            alt="Banzai GameFi"
            width='160'
            height='160'
            priority
          /> 

          <Typography sx={{ maxWidth: '580px' }}>
            Banzai is a Play-To-Earn crypto game. After every 10 transactions 1 random winner selected
            by smart contract. Learn more about <Link href='/rules' color='#000'>how to play</Link>.
          </Typography>

          <Typography variant='h5' className={styles.ttl}>
            Getting started
          </Typography>
          <ol>
            <li>Connect your Wallet</li>
            <li>Toggle chain to see game pools</li>
            <li>Send your BNB or ETH stake to pool</li>
          </ol>
        </main>
      )}

      {pools && pools.length > 0 && (
        <main className={styles.main}>        
          <LastWinners />
          <Typography variant='h5'>Pools available:</Typography>
          <Stack direction='column'>
            {pools.map((pool) => (
              <PoolListItem
                data={pool}
                mode={chain}
                key={pool.address}
                players={activity[pool.address]}
              />
            ))}
          </Stack>

          <Box className='switch-network'>Switch network: <appkit-network-button /></Box>
        </main>
      )}

    </div>
  );
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SnackbarProvider } from 'notistack'
import Image from 'next/image'
import styles from "./page.module.css"
import { wagmiAdapter } from '@/config'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import poolsConf from '@/config/pools'
import { Box, Grid, Typography, Link } from '@mui/material'
import PoolCard from '@/components/PoolCard'
import ActivityCard from '@/components/ActivityCard'

export default function PoolPage() {
  const { address, isConnected } = useAppKitAccount()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const [pool, setPool] = useState(false)

  const router = useRouter()
  const raw = usePathname()
  const params = raw.split('/').slice(1)

  const loadPoolData = () => {
    const chain = params[0]
    const pools = poolsConf[chain]
    if (!pools) return false

    pools.forEach((item) => {
      if (item.address == params[1]) setPool(item)
    })
  }

  const loadRates = async () => {
    const req = await fetch('/api/coin-prices').catch((err) => false)
    if (!req || !req.ok) return false

    const data = await req.json()
    if (data && data.rates) {
      window.latest_rates = data.rates // set global
    }    
  }

  useEffect(() => {
    loadRates()
  }, [])

  useEffect(() => {
    let chain = false

    if (isConnected) {
      chain = chainId == 1 ? 'eth' : 'bsc'
    }

    if (chain) {
      // if wrong chain is selected in wallet, switch network
      if (params[0] != chain) {
        switchNetwork(wagmiAdapter.networks[ params[0] == 'bsc' ? 1 : 0 ])
      } else {
        loadPoolData(chain)
      }
    }

    // if disconnected
    if (!isConnected || !params[1]) setPool(false)
  }, [isConnected, chainId])

  return (
    <div className={styles.page}>
      <SnackbarProvider>
      {!isConnected && (
        <main className={styles.main}>
          <Box sx={{ marginTop: '60px' }}>
            <Typography variant='h5'>Please connect Wallet!</Typography>
          </Box>
        </main>
      )}

      {isConnected && !pool && (
        <main className={styles.main}>
          <Box sx={{ marginTop: '60px' }}>
            <Typography variant='h5'>404 - pool not found!</Typography>
          </Box>
        </main>
      )}

      {isConnected && pool && (
        <main className={styles.main}>
          <Grid container spacing={2} sx={{ marginBottom: '30px' }}>
            <Grid item xs={12} md={6}>
              <PoolCard
                data={pool}
                mode={params[0]}
                address={address}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ActivityCard contract={pool} mode={params[0]} address={address} />
            </Grid>
          </Grid>

          <Link href='/' className='back-link' underline='none' color='inherit'>
            <KeyboardReturnIcon /> Back to pool list
          </Link>
        </main>
      )}

      </SnackbarProvider>
    </div>
  );
}

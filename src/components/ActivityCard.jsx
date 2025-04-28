'use client'

import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import Davatar from '@davatar/react'
import {
  Button,
  Box,
  CircularProgress,
  Stack,
  Tooltip,
  Typography,
  IconButton,
  Link,
  useMediaQuery,
} from '@mui/material'
import { shortAddr, rewards, getTxLink } from '@/helpers/utils'

let playerCnt = 0
const creator = '90fe1986092Ec963C4e9368837D02CB297f545Fe'

const ActivityItem = ({ data, mode, price }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  let formatted = ''
  let p = false

  if (price > 0) {
    p = data.value * price
    formatted = isMobile ? Math.floor(p) : p.toFixed(2)
  }

  if (data.type === 'win') {
    return (
      <Box className='activity-win'>
        <Link
          href={getTxLink(mode, data.hash)}
          target='_blank' underline='none'
          color='inherit'
        >
        <Box className='player-info'>
          <Davatar
            size={24}
            address={data.to}
            generatedAvatarType='blockies'
          />

          <Box className='activity-txt'>
            {shortAddr(data.to)} won {data.value} {rewards[mode]}
            {p && (<em> (${formatted})</em>)}
          </Box>
        </Box>
        </Link>
        <span>{dayjs.unix(data.timestamp).fromNow(true)} ago</span>
      </Box>
    )
  }

  return (
    <Box className='activity-stake'>
      <Link
        href={getTxLink(mode, data.hash)}
        target='_blank' underline='none'
        color='inherit'
        >
        <Box className='player-info'>
          <Davatar
            size={24}
            address={data.from}
            generatedAvatarType='blockies'
          />
          <Box className='activity-txt'>
            {shortAddr(data.from)} staked {data.value} {rewards[mode]}
            {p && (<em> (${formatted})</em>)}
          </Box>
        </Box>
      </Link>
      <span>{dayjs.unix(data.timestamp).fromNow(true)} ago</span>
    </Box>
  )
}

let updater

const ActivityCard = ({ contract, mode, address }) => {
  const [list, setList] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [price, setPrice] = useState(0)

  const loadActivity = async () => {
    const req = await fetch(`/api/pool-transactions/?mode=${mode}&address=${contract.address}`)

    if (!req || !req.ok) return false
    const data = await req.json()
    setLoaded(true)
    setList(data.transactions)
  }

  useEffect(() => {
    if (window.latest_rates && window.latest_rates[mode]) {
      setPrice(window.latest_rates[mode])
    }

    updater = setInterval(loadActivity, 20000)

    loadActivity()
    return () => {
      clearInterval(updater)
    }
  }, [])

  return (
    <Box className='activity-card'>
      <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center' }}>
        Activity
      </Typography>
      <Typography variant='body' sx={{ textAlign: 'center', fontSize: '10px' }}>
        <em>Data on this page is reloading every 20 sec. No need to reload page.</em>
      </Typography>
      {!loaded && (
        <Box sx={{ minHeight: '200px', paddingTop: '80px' }}>
          <CircularProgress />
        </Box>
      )}

      {loaded && list.length < 1 && (
        <Box sx={{ minHeight: '200px' }}>
          There is no activity in this pool yet.
        </Box>
      )}
      <Stack spacing={1} sx={{ width: '100%' }}>
        {loaded && list.map((item) => (
          <ActivityItem data={item} key={item.hash} mode={mode} price={price} />
        ))}
      </Stack>
    </Box>
  )
}

export default ActivityCard

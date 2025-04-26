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
} from '@mui/material'
import { shortAddr, rewards } from '@/helpers/utils'

let playerCnt = 0
const creator = '90fe1986092Ec963C4e9368837D02CB297f545Fe'

const ActivityItem = ({ data, mode }) => {
  if (data.type === 'win') {
    return (
      <Box className='activity-win'>
        <Box className='player-info'>
          <Davatar
            size={24}
            address={data.to}
            generatedAvatarType='blockies'
          />

          <Box className='activity-txt'>
            {shortAddr(data.to)} won {data.value} {rewards[mode]}
          </Box>
        </Box>
        <span>{dayjs.unix(data.timestamp).fromNow(true)} ago</span>
      </Box>
    )
  }

  return (
    <Box className='activity-stake'>
      <Box className='player-info'>
        <Davatar
          size={24}
          address={data.from}
          generatedAvatarType='blockies'
        />
        <Box className='activity-txt'>
          {shortAddr(data.from)} staked {data.value} {rewards[mode]}
        </Box>
      </Box>
      <span>{dayjs.unix(data.timestamp).fromNow(true)} ago</span>
    </Box>
  )
}

let updater

const ActivityCard = ({ contract, mode, address }) => {
  const [list, setList] = useState([])
  const [loaded, setLoaded] = useState(false)

  const loadActivity = async () => {
    const req = await fetch(`/api/pool-transactions/?mode=${mode}&address=${contract.address}`)

    if (!req || !req.ok) return false
    const data = await req.json()
    setLoaded(true)
    setList(data.transactions)
  }

  useEffect(() => {
    updater = setInterval(loadActivity, 20000)
    loadActivity()
    return () => {
      clearInterval(updater)
    }
  }, [])

  return (
    <Box className='activity-card'>
      <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center' }}>
        Activity:
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
          <ActivityItem data={item} key={item.hash} mode={mode} />
        ))}
      </Stack>
    </Box>
  )
}

export default ActivityCard

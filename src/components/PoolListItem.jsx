import { useState, useEffect } from 'react'
import {
  Button,
  Box,
  Stack,
  Grid,
  Tooltip,
  Typography,
  TextField,
  IconButton,
  useMediaQuery,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { shortAddr, rewards } from '@/helpers/utils'

let playerCnt = 0

const PoolListItem = ({ data, mode }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const router = useRouter()

  const openPool = () => {
    router.push(`/${mode}/${data.address}`)
  }

  return (
    <Box className={isMobile ? 'pool-list-item-mob' : 'pool-list-item'} onClick={openPool}>
      <img src={`/icons/coins/${mode}.png`} />
      <Box sx={{ width: '200px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
        <div>{data.title}</div>
        <span className='pool-list-subtitle'>Stake: {data.stake} {rewards[mode]},  Reward: {data.stake*9} {rewards[mode]}</span>
      </Box>

      <Box sx={{ position: 'absolute', right: '10px' }}>
        <ChevronRightIcon />
      </Box>
    </Box>
  )
}

export default PoolListItem

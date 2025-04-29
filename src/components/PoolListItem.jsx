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

const PoolListItem = ({ data, mode, rates }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const router = useRouter()
  const [price, setPrice] = useState(0)

  const openPool = () => {
    router.push(`/${mode}/${data.address}`)
  }

  useEffect(() => {
    if (rates && rates[mode]) {
      setPrice(rates[mode])
    }
  }, [rates])

  const fmt = data.stake*9*price

  return (
    <Box className={isMobile ? 'pool-list-item-mob' : 'pool-list-item'} onClick={openPool}>
      <img src={`/icons/coins/${mode}.png`} />
      <Box sx={{ width: '280px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
        <div>{data.title}</div>
        <span className='pool-list-subtitle'>
          Stake: {data.stake} {rewards[mode]},  Reward: {data.stake*9} {rewards[mode]}
          {price > 0 && (<em> (${Math.floor(fmt)})</em>)}
        </span>
      </Box>

      <Box sx={{ position: 'absolute', right: '10px' }}>
        <ChevronRightIcon />
      </Box>
    </Box>
  )
}

export default PoolListItem

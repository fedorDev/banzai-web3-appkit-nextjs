import { useState, useEffect } from 'react'
import {
  Button,
  Box,
  CircularProgress,
  Stack,
  Grid,
  Tooltip,
  Typography,
  TextField,
  IconButton,
  useMediaQuery,
} from '@mui/material'
import { circularProgressClasses } from '@mui/material/CircularProgress'
import { useRouter } from 'next/navigation'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { shortAddr, rewards } from '@/helpers/utils'

let playerCnt = 0

function CircularProgressWithIcon(props) {
  return (
    <Box sx={{ position: 'relative', display: 'flex', marginRight: '8px' }}>
      <CircularProgress
        variant="determinate" value={100}
        sx={(theme) => ({
          height: '40px',
          width: '40px',
          color: props.mode == 'bsc' ? '#faf0b9' : '#bad0fa',
        })}
      />
      <CircularProgress
        variant="determinate" value={props.value*10}
        sx={(theme) => ({
          position: 'absolute',
          height: '40px',
          width: '40px',
          color: props.mode == 'bsc' ? '#F0B90B' : '#2a61ca',
        })}
      />
      <Box
        sx={{
          top: '4px',
          right: '4px',
          width: '32px',
          height: '32px',
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={`/icons/coins/${props.mode}.png`} />
      </Box>
    </Box>
  );
}

const PoolListItem = ({ data, mode, rates, players }) => {
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
      <CircularProgressWithIcon value={players} mode={mode} />
      <Box sx={{ width: '280px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
        <div>{data.title}</div>
        <span className='pool-list-subtitle'>
          Stake: {data.stake} {rewards[mode]},  Reward: {(data.stake*9).toFixed(1)} {rewards[mode]}
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

'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  Box,
  Stack,
  Tooltip,
  Typography,
  IconButton,
  useMediaQuery,
} from '@mui/material'
import { useReadContract, useWriteContract, useSendTransaction } from 'wagmi'
import GameAbi from '@/abi/Game.json'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import { useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { shortAddr, rewards } from '@/helpers/utils'
import { parseEther } from 'viem'

const creator = '0x90fe1986092Ec963C4e9368837D02CB297f545Fe'
let updater

const PoolCard = ({ data, mode, address }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const rates = useSelector((state) => state.rates.rates)
  const contractData = useReadContract({
    address: data.address,
    abi: GameAbi,
    functionName: 'showPool',
  })
  const { writeContractAsync } = useWriteContract()
  const { sendTransactionAsync } = useSendTransaction()

  const { enqueueSnackbar } = useSnackbar()
  const [chance, setChance] = useState(0)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [pool, setPool] = useState([])
  const [price, setPrice] = useState(0)
  const [lastWinner, setLastWinner] = useState(false)

  const progress = (pool.length / data.players) * 100
  const provider = false

  const getLastWinner = async () => {
    const result = await provider.request({
      method: "eth_call",
      params: [{
        to: data.address,
        data: '0xfe188184',
      }],
    }).catch((err) => {
      enqueueSnackbar(JSON.stringify(err), { variant: 'error' })
    })

    if (Number(result) > 0) {
      const p = result.substring(26)
      setLastWinner(address.includes(p) ? 'You!' : shortAddr(p, '0x'))
    }
  }

  const claimRewards = async () => {
    const req = await writeContractAsync({
      address: data.address,
      abi: GameAbi,
      functionName: 'claimReward',
    }).catch((err) => {
      enqueueSnackbar('Failed to get rewards', { variant: 'error' })
      return false
    })

    if (req) {
      setLoadingBtn(true)
      enqueueSnackbar(`Getting reward...`, { variant: 'success' })
      setTimeout(contractData.refetch(), 2000)
    }
  }

  const parsePoolData = () => {
    let c = 0
    setLoadingBtn(false)
    const lowAddr = address.toLowerCase()
    pool.forEach((item) => {
      if (item.toLowerCase() == lowAddr) c++
    })
    setChance((c/data.players)*100)
  }

  const addStake = async () => {
    const res = await sendTransactionAsync({
      to: data.address,
      value: parseEther(`${data.stake}`),
    }).catch((err) => {
      if (!isMobile) enqueueSnackbar('Failed to send stake', { variant: 'error' })
      return false
    })

    if (res) {
      setLoadingBtn(true)
      if (!isMobile) enqueueSnackbar('Added your stake!', { variant: 'success' })
    }
  }

  useEffect(() => {
    if (contractData.error) console.log(contractData.error)
    if (contractData.data) setPool(contractData.data)
    // console.log('LOADING', contractData)
  }, [contractData])

  useEffect(() => {
    parsePoolData()
    if (rates && rates[mode]) {
      setPrice(rates[mode])
    }
  }, [pool])

  useEffect(() => {
    updater = setInterval(() => {
      setLoadingBtn(false)
      contractData.refetch()
    }, 20000)

    return () => {
      clearInterval(updater)
    }
  }, [])

  const getLink = () => {
    if (mode == 'bsc') return `https://bscscan.com/address/${data.address}`

    return `https://etherscan.io/address/${data.address}`
  }

  const isCreator = address == creator
  const p = data.prize * price

  return (
    <Box className='pool-card'>
      <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center' }}>
        {data.title} Pool
      </Typography>

      <Typography
        variant='h6'
        sx={{ display: 'flex', alignItems: 'center' }}>
        <span>Prize: {data.prize}</span>
        <img className={'coin-big'} src={`/icons/coins/${mode}.png`} />
        {price > 0 && (<em style={{ color: '#bbb', fontSize: '14px' }}> (${p.toFixed(1)})</em>)}
      </Typography>
      
      <Box sx={{ height: '150px' }}>
        <Gauge
          width={240}
          // height={140}
          value={progress}
          startAngle={-90}
          endAngle={90}
          text={({ value, valueMax }) => `${pool.length} / ${data.players}`}
          sx={(theme) => ({
            [`& .${gaugeClasses.valueArc}`]: {
              fill: mode == 'bsc' ? '#F0B90B' : '#2a61ca',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: mode == 'bsc' ? '#faf0b9' : '#bad0fa',
            },
          })}
        />
      </Box>
      Your chance: {chance.toFixed(1)}%

      <Stack direction='row' spacing={2}>
        {pool.length >= data.players && (
          <Button
            variant='contained'
            color='secondary'
          >
            Please wait
          </Button>
        )}
        {pool.length < data.players && (
          <Button
            variant='contained'
            onClick={addStake}
            loading={loadingBtn}
            // disabled={true}
          >
            Stake {data.stake} {rewards[mode]}
          </Button>
        )}
        <Button
          variant='contained'
          sx={{ bgcolor: 'primary.light' }}
          onClick={() => {
            navigator.clipboard.writeText(data.address)
            enqueueSnackbar('Copied address of contract', { variant: 'success' })
          }}
        >
          <img src='/icons/copy.svg' style={{ width: '24px', height: '24px' }}/>
        </Button>
        <Button variant='contained' href={getLink()} target='_blank'>
          <img src='/icons/block-explorer.png' style={{ width: '36px', height: '36px' }}/>
        </Button>    
            
        {isCreator && (
          <Button variant='contained' color='secondary' onClick={claimRewards}>Rewards</Button>            
        )}
      </Stack>
    </Box>
  )
}

export default PoolCard

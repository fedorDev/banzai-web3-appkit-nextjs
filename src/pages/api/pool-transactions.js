import _ from 'lodash'
import { parseEther, formatEther } from 'viem'
import poolsConf from '@/config/pools'

const ETH_API_KEY = process.env.ETH_API_KEY
const BSC_API_KEY = process.env.BSC_API_KEY

export const config = {
  api: {
    bodyParser: false,
  },
}

const lastUpdated = {}
const allowedChains = ['eth', 'bsc']

const cache = {}

function isValidAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

async function reloadData(pool, chain) {
  console.log('POOL', pool)
  const result = []
  let url = `https://api.${chain == 'eth' ? 'etherscan' : 'bscscan'}.com/api?module=account`
  url += `&action=txlistinternal&address=${pool.address}&page=1&offset=5&sort=desc`
  url += `&apikey=${chain == 'eth' ? ETH_API_KEY : BSC_API_KEY}`

  // &startblock=0
  // &endblock=2702578
  const req = await fetch(url).catch((err) => {
    return false
  })

  if (req && req.ok) {
    const data = await req.json()
    if (data.result) {
      data.result.forEach((i) => {
        const d = {
          value: formatEther(i.value),
          hash: i.hash,
          block: i.blockNumber,
          from: i.from,
          to: i.to,
          timestamp: i.timeStamp*1,
          type: 'win',
        }

        if (d.value == `${pool.stake*9}` && !Number(i.isError)) result.push(d)
      })
    }
  }

  let urlTx = `https://api.${chain == 'eth' ? 'etherscan' : 'bscscan'}.com/api?module=account`
  urlTx += `&action=txlist&address=${pool.address}&page=1&offset=20&sort=desc`
  urlTx += `&apikey=${chain == 'eth' ? ETH_API_KEY : BSC_API_KEY}`

  // &startblock=0
  // &endblock=2702578
  const reqTx = await fetch(urlTx).catch((err) => {
    return false
  })

  if (reqTx && reqTx.ok) {
    const data = await reqTx.json()
    if (data.result) {
      data.result.forEach((i) => {
        const d = {
          value: formatEther(i.value),
          hash: i.hash,
          block: i.blockNumber,
          from: i.from,
          to: i.to,
          timestamp: i.timeStamp*1,
          type: 'stake',
        }

        if (d.value == `${pool.stake}` && !Number(i.isError)) result.push(d)
      })
    }
  }

  cache[pool.address] = _.orderBy(result, ['timestamp'], ['desc']).slice(0, 16)
}

const handler = async (req, res) => {
  const addr = req.query.address

  if (!addr || !isValidAddress(addr)) {
    return res.json({ error: 'Wrong address' })
  }

  if (!req.query.mode || !allowedChains.includes(req.query.mode)) {
    return res.json({ error: 'Wrong chain parameter'})
  }

  const pools = poolsConf[req.query.mode]
  const pool = pools.filter((i) => i.address === addr)
  if (!pool || pool.length != 1) {
    return res.json({ error: 'Wrong address' })
  }

  const now = Date.now()
  if (!lastUpdated[addr] || !cache[addr] || now > lastUpdated[addr] + 20*1000) {
    console.log('Need update!')
    lastUpdated[addr] = now
    await reloadData(pool[0], req.query.mode)
    // force reload cache
  } else {
    console.log('Use cache')
  }

  res.status(200).json({ transactions: cache[addr] })
}

export default handler

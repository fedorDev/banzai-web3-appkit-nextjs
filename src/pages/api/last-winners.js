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

const allowedChains = ['eth', 'bsc']
let lastUpdated = false
let cache = []

function isValidAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

async function reloadData(pool, chain) {
  console.log('called reloadData', pool, chain)

  let url = `https://api.${chain == 'eth' ? 'etherscan' : 'bscscan'}.com/api?module=account`
  url += `&action=txlistinternal&address=${pool.address}&page=1&offset=5&sort=desc`
  url += `&apikey=${chain == 'eth' ? ETH_API_KEY : BSC_API_KEY}`

  // &startblock=0
  // &endblock=2702578
  const req = await fetch(url).catch((err) => {
    console.log('FAILED', err)
    return false
  })

  if (req && req.ok) {
    const data = await req.json()
    console.log('DATA', data)
    if (data.result) {
      data.result.forEach((i) => {
        const d = {
          value: formatEther(i.value),
          hash: i.hash,
          block: i.blockNumber,
          from: i.from,
          to: i.to,
          chain,
          timestamp: i.timeStamp*1,
        }

        if (d.value == `${pool.stake*9}` && !Number(i.isError)) cache.push(d)
      })
    }
  }
}

const handler = async (req, res) => {
  const now = Date.now()
  if (!lastUpdated || !cache || now > lastUpdated + 3*60*1000) {
    lastUpdated = now
    cache = []
    await Promise.allSettled(poolsConf.eth.map((pool) => reloadData(pool, 'eth')))
    await Promise.allSettled(poolsConf.bsc.map((pool) => reloadData(pool, 'bsc')))

    const c = _.orderBy(cache, ['timestamp'], ['desc'])
    cache = c
    // force reload cache
  } else {
    console.log('Use cache')
  }

  res.status(200).json({ winners: cache })
}

export default handler

import _ from 'lodash'
import { parseEther, formatEther } from 'viem'
import poolsConf from '@/config/pools'

const API_KEY = process.env.COINMARKET_API_KEY

export const config = {
  api: {
    bodyParser: false,
  },
}

let lastUpdated = false
let cache = {}
let updater = false

async function reloadData() {
  const req = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH,BNB,SOL', {
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY,
    },
  }).catch((err) => {
    console.log('failed', err)
    return false
  })
  
  if (!req || !req.ok) return false
  const response = await req.json()
  Object.keys(response.data).forEach((ticker) => {
    const k = ticker.toLowerCase()

    if (response.data[ticker].quote && response.data[ticker].quote.USD.price) {
      cache[k] = response.data[ticker].quote.USD.price
      if (k === 'bnb') cache.bsc = cache[k] // duplicate
    }
  })
  const now = Date.now()
  lastUpdated = now
}

const handler = async (req, res) => {
  if (!updater) {
    updater = setInterval(reloadData, 5*60*1000) // every 5 mins
    // init data in cache
    await reloadData()
  }

  res.status(200).json({ rates: cache, last_updated: lastUpdated })
}

export default handler

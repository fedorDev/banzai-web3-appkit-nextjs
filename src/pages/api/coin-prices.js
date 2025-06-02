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
  // proxy request to GoLang service
  const req = await fetch('http://data.banzai.meme:8082/rates').catch((err) => {
    console.log('failed', err)
    return false
  })
  
  if (!req || !req.ok) return false
  const response = await req.json()
  response.forEach((item) => {
    cache[item.ticker] = item.price
    if (item.ticker === 'bnb') cache.bsc = item.price // duplicate
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


export const rewards = {
  'bsc': 'BNB',
  'eth': 'Eth',
  'sol': 'SOL',
}

export const shortAddr = (val, prefix) => {
  if (prefix) return prefix + val.substring(0, 5) + '..'+ val.slice(-5)
  return val.substring(0, 6) + '..'+ val.slice(-4)
}

export const getTxLink = (mode, hash) => {
  if (mode == 'bsc') return `https://bscscan.com/tx/${hash}`
  return `https://etherscan.io/tx/${hash}`
}
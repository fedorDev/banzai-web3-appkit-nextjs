
export const rewards = {
  'bsc': 'BNB',
  'eth': 'Eth',
  'sol': 'SOL',
}

export const shortAddr = (val, prefix) => {
  if (prefix) return prefix + val.substring(0, 5) + '..'+ val.slice(-5)
  return val.substring(0, 7) + '..'+ val.slice(-5)
}

import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, bsc } from '@reown/appkit/networks'

export const projectId = process.env.APPKIT_API_KEY

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, bsc]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  /*
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
  }, */
})

export const config = wagmiAdapter.wagmiConfig

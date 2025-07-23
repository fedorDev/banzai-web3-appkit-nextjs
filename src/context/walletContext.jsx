'use client'

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react' 
import React from 'react'
import { cookieToInitialState, WagmiProvider } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Banzai Game 2.0',
  description: 'AppKit Example',
  url: 'https://banzai.meme', // origin must match your domain & subdomain
  icons: ['https://banzai.meme/icons/big-flag.png']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  // defaultNetwork: mainnet,
  metadata: metadata,
  themeMode: 'light',
  features: {
    connectMethodsOrder: ['wallet'],
    swaps: false,
    analytics: false,
  }
})

function ContextProvider({ children }) {

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
    
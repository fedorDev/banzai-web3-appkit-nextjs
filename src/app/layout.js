'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
// import { headers } from 'next/headers'
import ContextProvider from '@/context/walletContext'
import { Provider } from 'react-redux'
import store from '@/store/store'
import { AppBar, Box } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ContextProvider>
          <Provider store={store}>
            <Box className='header'>
              <Box>
                <Link href='/'>
                  <img src='/banzai_logo.png' alt='Banzai GameFi' height='50' />
                </Link>
              </Box>
              <Box>
                <appkit-button />
              </Box>
            </Box>
            {children}

            <footer className={'footer'}>
              <Link href="/leaderboard">
                <Image
                  aria-hidden
                  src="/crown.svg"
                  alt="Winners"
                  width={16}
                  height={16}
                />
                Leaderboard
              </Link>

              <Link href="/rules">
                <Image
                  aria-hidden
                  src="/file.svg"
                  alt="Rules"
                  width={16}
                  height={16}
                />
                Game rules
              </Link>
              <a
                href="https://four.meme/token/0xa28f31e578aa8cf563782073aaa53478ed5bce6b"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/window.svg"
                  alt="Window icon"
                  width={16}
                  height={16}
                />
                $BANZAI Token
              </a>
              <Link href="/links">
                <Image
                  aria-hidden
                  src="/globe.svg"
                  alt="Globe icon"
                  width={16}
                  height={16}
                />
                Links
              </Link>
              <GoogleAnalytics gaId="G-D1CQDQ5DJ3" />
            </footer>
          </Provider>
        </ContextProvider>
      </body>
    </html>
  );
}

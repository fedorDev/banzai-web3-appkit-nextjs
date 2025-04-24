// 'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import ContextProvider from '@/context/walletContext'
import { AppBar, Box, Link } from '@mui/material'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const d = await headers()
  const cookies = d.get('cookie')

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ContextProvider cookies={cookies}>
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
        </ContextProvider>
      </body>
    </html>
  );
}

'use client'

import { useState, useEffect } from 'react'
import Slider from "react-slick"
import { Box, Stack, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/navigation'
import Davatar from '@davatar/react'
import { shortAddr, rewards, getTxLink } from '@/helpers/utils'
import dayjs from 'dayjs'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const LastWinnersCarousel = ({ rates }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [list, setList] = useState([])
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    // cssEase: "linear"
  }

  const loadWinnersList = async () => {
    const req = await fetch('/api/last-winners/')
  
    if (!req || !req.ok) return false
    const data = await req.json()
    setList(data.winners || [])
  }

  useEffect(() => {
    loadWinnersList()
  }, [])

  if (!list || list.length < 1) return (
    <Box sx={{ width: 320, height: 40, marginTop: isMobile ? '50px' : 0 }} className='slider-container'>
      {' '}
    </Box>
  )

  return (
    <Box sx={{ width: isMobile ? 320 : 460, height: 40, marginTop: isMobile ? '50px' : 0 }} className='slider-container'>
      <Slider {...settings}>
        {list.map((item) => {
          let p = false

          if (!isMobile && rates && rates[item.chain]) {
            p = item.value * rates[item.chain]
          }

          return (
            <Box className='activity-win' key={item.hash}>
              <Box className='player-info'>
                <Davatar
                  size={24}
                  address={item.to}
                  generatedAvatarType='blockies'
                />

                <Box className='activity-txt'>
                  {shortAddr(item.to)} won {item.value} {rewards[item.chain]} {p && (<em>({p.toFixed(2)} USD)</em>)}
                </Box>
              </Box>
              <span>{dayjs.unix(item.timestamp).fromNow(true)} ago</span>
            </Box>
          )
        })}
      </Slider>
    </Box>
  )
}

export default LastWinnersCarousel

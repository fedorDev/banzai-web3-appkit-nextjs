'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Slider from "react-slick"
import { Box, Stack, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/navigation'
import Davatar from '@davatar/react'
import { shortAddr, rewards, getTxLink } from '@/helpers/utils'
import dayjs from 'dayjs'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const LastWinnersCarousel = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [list, setList] = useState([])
  const rates = useSelector((state) => state.rates.rates)
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    // cssEase: "linear"
  }

  const loadWinnersList = async () => {
    const req = await fetch('/api/last-winners')
  
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

  console.log(rates, 'RATES')

  return (
    <Box sx={{ width: isMobile ? 320 : 460, height: 40, marginTop: isMobile ? '50px' : 0 }} className='slider-container'>
      <Slider {...settings}>
        {list.map((item, ind) => {
          let p = false

          if (!isMobile && rates && rates[item.chain]) {
            p = item.profit * rates[item.chain]
          }

          return (
            <Box className='activity-win' key={`${item.address}_${ind}`}>
              <Box className='player-info'>
                <Davatar
                  size={24}
                  address={item.address}
                  generatedAvatarType='blockies'
                />

                <Box className='activity-txt'>
                  {shortAddr(item.address)} won {item.profit} {rewards[item.chain]} {p && (<em>({p.toFixed(2)} USD)</em>)}
                </Box>
              </Box>
              {/* <span>{dayjs.unix(item.timestamp).fromNow(true)} ago</span> */}
            </Box>
          )
        })}
      </Slider>
    </Box>
  )
}

export default LastWinnersCarousel

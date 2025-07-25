'use client'
import _ from 'lodash'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import Davatar from '@davatar/react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRates } from '@/store/ratesSlice'
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Table,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Link,
  Paper,
  useMediaQuery,
 } from '@mui/material'
import { shortAddr } from '@/helpers/utils'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function LeaderboardPage() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const dispatch = useDispatch()
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [loading, setLoading] = useState(true)

  const getWinners = async () => {
    const req = await fetch('/api/leaderboard')

    if (req && req.ok) {
      const data = await req.json()

      let sum = 0
      let rounds = 0
      data.forEach((item) => {
        sum += item.profit_usd
        rounds += item.rounds
      })

      setList(data)
      setLoading(false)
      setTotal(sum)
      setTotalRounds(rounds)
    }
  }

  useEffect(() => {
    dispatch(fetchRates())
    getWinners()
  }, [dispatch])

  const formatProfit = (val) => {
    if (!val.profit_eth) return `${val.profit_bnb} BNB`
    if (!val.profit_bnb) return `${val.profit_eth} ETH`

    return `${val.profit_eth} ETH, ${val.profit_bnb} BNB`
  }

  if (loading) return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CircularProgress />
      </main>
    </div>
  )

  if (isMobile) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <Typography variant='h5' sx={{ textAlign: 'center' }}>Winners</Typography>

          {total > 0 && (
            <span>Rounds played: {totalRounds}<br/>Total payouts: {total.toFixed(2)} USD</span>
          )}

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 330 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell sx={{ padding: '8px' }}>Player</StyledTableCell>
                  <StyledTableCell sx={{ padding: '8px' }}>Rounds</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row, ind) => (
                  <StyledTableRow key={row.address}>
                    <StyledTableCell sx={{ padding: '8px' }}>
                      <Davatar
                        size={28}
                        address={row.address}
                        generatedAvatarType='blockies'
                      />                      
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      <span className={styles.address}>
                        {ind+1}. {shortAddr(row.address)}
                      </span><br/>
                      Profit: {row.profit_usd} USD
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.rounds}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
        <main className={styles.main}>
          <Typography variant='h5' sx={{ textAlign: 'center' }}>Winners</Typography>

          {total > 0 && (
            <Typography variant='h6'>Rounds played: {totalRounds}. Total payouts: {total.toFixed(2)} USD</Typography>
          )}

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>Player</StyledTableCell>
                  <StyledTableCell align="right">Rounds</StyledTableCell>
                  <StyledTableCell align="right">Profits</StyledTableCell>
                  <StyledTableCell align="right">Summary *aprox</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row, ind) => (
                  <StyledTableRow key={row.address}>
                    <StyledTableCell>
                      <Davatar
                        size={28}
                        address={row.address}
                        generatedAvatarType='blockies'
                      />                      
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <span className={styles.address}>
                        {ind+1}. {row.address}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.rounds}</StyledTableCell>
                    <StyledTableCell align="right">{formatProfit(row)}</StyledTableCell>
                    <StyledTableCell align="right">{row.profit_usd} USD</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
    </div>
  );
}

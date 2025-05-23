'use client'

import styles from './page.module.css'
import { useState, useEffect } from 'react'
import poolsConf from '@/config/pools'
import {
  Box,
  Button,
  Typography,
  Table,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Link,
  Paper,
 } from '@mui/material'

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

export default function Home() {
  const [list, setList] = useState([])

  const loadRates = async () => {
    const req = await fetch('/api/coin-prices').catch((err) => false)
    if (!req || !req.ok) return false

    const data = await req.json()
    if (data && data.rates) {
      window.latest_rates = data.rates // set global
    }

    getWinners()
  }

  const getWinners = async () => {
    const req = await fetch('/api/leaderboard')

    if (req && req.ok) {
      const data = await req.json()
      setList(data.leaderboard)
    }
  }

  useEffect(() => {
    loadRates()
  }, [])

  const formatProfit = (val) => {
    if (!val.eth) return `${val.bsc} BNB`
    if (!val.bsc) return `${val.eth} ETH`

    return `${val.eth} ETH, ${val.bsc} BNB`
  }

  const sumProfit = (val) => {
    let sum = 0

    if (val.eth && window.latest_rates) {
      sum += val.eth * window.latest_rates.eth
    }

    if (val.bsc && window.latest_rates) {
      sum += val.bsc * window.latest_rates.bnb
    }

    return sum.toFixed(2)
  }

  return (
    <div className={styles.page}>
        <main className={styles.main}>
          <Typography variant='h5' sx={{ textAlign: 'center' }}>Winners</Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Player</StyledTableCell>
                  <StyledTableCell align="right">X Username</StyledTableCell>
                  <StyledTableCell align="right">Rounds</StyledTableCell>
                  <StyledTableCell align="right">Profits</StyledTableCell>
                  <StyledTableCell align="right">Summary *aprox</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row) => (
                  <StyledTableRow key={row.address}>
                    <StyledTableCell component="th" scope="row">
                      <span className={styles.address}>
                        {row.address}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.username && (
                        <Link href={`https://x.com/${row.username}`} target='_blank'>
                          {row.username}
                        </Link>
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.rounds}</StyledTableCell>
                    <StyledTableCell align="right">{formatProfit(row.profits)}</StyledTableCell>
                    <StyledTableCell align="right">{sumProfit(row.profits)} USD</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
    </div>
  );
}

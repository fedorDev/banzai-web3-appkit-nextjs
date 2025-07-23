import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRates = createAsyncThunk('rates/fetchRates', async () => {
  const response = await fetch('/api/coin-prices');
  if (!response.ok) throw new Error('Failed to fetch rates');
  const data = await response.json();
  return data.rates;
});

const ratesSlice = createSlice({
  name: 'rates',
  initialState: {
    rates: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload;
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ratesSlice.reducer; 
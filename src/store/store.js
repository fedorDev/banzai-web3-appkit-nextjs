import { configureStore } from '@reduxjs/toolkit';
import ratesReducer from './ratesSlice';

const store = configureStore({
  reducer: {
    rates: ratesReducer,
  },
});

export default store; 
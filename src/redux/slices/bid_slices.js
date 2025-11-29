import { createSlice } from '@reduxjs/toolkit';
import {
  getAllWinningBidsAsync,
  getAllBidsAsync,
} from '../services/bid_services';

const initialState = {
  winningBidsList: [],
  allBidsList: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {
    clearBidError: (state) => {
      state.error = null;
    },
    clearWinningBids: (state) => {
      state.winningBidsList = [];
    },
  },
  extraReducers: (builder) => {
    // Get all winning bids
    builder
      .addCase(getAllWinningBidsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWinningBidsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.winningBidsList = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllWinningBidsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch winning bids';
      });

    // Get all bids
    builder
      .addCase(getAllBidsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBidsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.allBidsList = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllBidsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bids';
      });
  },
});

export const { clearBidError, clearWinningBids } = bidSlice.actions;
export default bidSlice.reducer;


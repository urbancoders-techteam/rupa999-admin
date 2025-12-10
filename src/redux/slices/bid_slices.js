import { createSlice } from '@reduxjs/toolkit';
import {
  getAllWinningBidsAsync,
  getAllBidsAsync,
  getBidDataResultAsync,
  getProfitBidsAsync,
} from '../services/bid_services';

const initialState = {
  winningBidsList: [],
  allBidsList: [],
  bidDataResult: [],
  profitBidsList: [],
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

    // Get bid data result
    builder
      .addCase(getBidDataResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBidDataResultAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bidDataResult = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getBidDataResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bid data result';
      });

    // Get profit bids
    builder
      .addCase(getProfitBidsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfitBidsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profitBidsList = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getProfitBidsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profit bids';
      });
  },
});

export const { clearBidError, clearWinningBids } = bidSlice.actions;
export default bidSlice.reducer;


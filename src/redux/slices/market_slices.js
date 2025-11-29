import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getAllMarketsAsync,
  getMarketByIdAsync,
  createMarketAsync,
  updateMarketAsync,
  deleteMarketAsync,
} from '../services/market_services';

const initialState = {
  marketList: [],
  currentMarket: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearMarketError: (state) => {
      state.error = null;
    },
    clearCurrentMarket: (state) => {
      state.currentMarket = null;
    },
  },
  extraReducers: (builder) => {
    // Get all markets
    builder
      .addCase(getAllMarketsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMarketsAsync.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.marketList = payload?.data || [];
        if (payload) {
          state.pagination = {
            page: payload.pagination.page || 1,
            limit: payload.pagination.limit || 10,
            total: payload.pagination.total || 0,
            totalPages: payload.pagination.totalPages || 0,
          };
        }
      })
      .addCase(getAllMarketsAsync.rejected, (state, {payload} ) => {
        state.loading = false;
        state.error = payload?.message || 'Failed to fetch markets';
      });

    // Get market by ID
    builder
      .addCase(getMarketByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMarket = action.payload?.data || null;
      })
      .addCase(getMarketByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch market';
      });

    // Create market
    builder
      .addCase(createMarketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMarketAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.marketList.unshift(action.payload.data);
        }
      })
      .addCase(createMarketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create market';
      });

    // Update market
    builder
      .addCase(updateMarketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMarketAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMarket = action.payload?.data;
        if (updatedMarket) {
          const index = state.marketList.findIndex((market) => market._id === updatedMarket._id);
          if (index !== -1) {
            state.marketList[index] = updatedMarket;
          }
          if (state.currentMarket?._id === updatedMarket._id) {
            state.currentMarket = updatedMarket;
          }
        }
      })
      .addCase(updateMarketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update market';
      });

    // Delete market
    builder
      .addCase(deleteMarketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMarketAsync.fulfilled, (state, action) => {
        state.loading = false;
        const marketId = action.meta.arg;
        state.marketList = state.marketList.filter((market) => market._id !== marketId);
        if (state.currentMarket?._id === marketId) {
          state.currentMarket = null;
        }
      })
      .addCase(deleteMarketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete market';
      });
  },
});

export const { clearMarketError, clearCurrentMarket } = marketSlice.actions;
export default marketSlice.reducer;

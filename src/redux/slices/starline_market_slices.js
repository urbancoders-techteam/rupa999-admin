import { createSlice } from '@reduxjs/toolkit';
import {
  getAllStarlineMarketsAsync,
  getStarlineMarketByIdAsync,
  createStarlineMarketAsync,
  updateStarlineMarketAsync,
  deleteStarlineMarketAsync,
} from '../services/starline_market_services';

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

const starlineMarketSlice = createSlice({
  name: 'starlineMarket',
  initialState,
  reducers: {
    clearStarlineMarketError: (state) => {
      state.error = null;
    },
    clearCurrentStarlineMarket: (state) => {
      state.currentMarket = null;
    },
  },
  extraReducers: (builder) => {
    // Get all starline markets
    builder
      .addCase(getAllStarlineMarketsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStarlineMarketsAsync.fulfilled, (state, { payload }) => {
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
      .addCase(getAllStarlineMarketsAsync.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.message || 'Failed to fetch starline markets';
      });

    // Get starline market by ID
    builder
      .addCase(getStarlineMarketByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStarlineMarketByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMarket = action.payload?.data || null;
      })
      .addCase(getStarlineMarketByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch starline market';
      });

    // Create starline market
    builder
      .addCase(createStarlineMarketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStarlineMarketAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.marketList.unshift(action.payload.data);
        }
      })
      .addCase(createStarlineMarketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create starline market';
      });

    // Update starline market
    builder
      .addCase(updateStarlineMarketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStarlineMarketAsync.fulfilled, (state, action) => {
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
      .addCase(updateStarlineMarketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update starline market';
      });

    // Delete starline market
    builder
      .addCase(deleteStarlineMarketAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStarlineMarketAsync.fulfilled, (state, action) => {
        state.loading = false;
        const marketId = action.meta.arg;
        state.marketList = state.marketList.filter((market) => market._id !== marketId);
        if (state.currentMarket?._id === marketId) {
          state.currentMarket = null;
        }
      })
      .addCase(deleteStarlineMarketAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete starline market';
      });
  },
});

export const { clearStarlineMarketError, clearCurrentStarlineMarket } = starlineMarketSlice.actions;
export default starlineMarketSlice.reducer;

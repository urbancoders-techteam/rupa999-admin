import { createSlice } from '@reduxjs/toolkit';
import {
  getAllMarketResultsAsync,
  getMarketResultByIdAsync,
  createMarketResultAsync,
  updateMarketResultAsync,
  deleteMarketResultAsync,
  revertMarketResultAsync,
} from '../services/market_result_services';

const initialState = {
  resultList: [],
  resultById: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const marketResultSlice = createSlice({
  name: 'marketResult',
  initialState,
  reducers: {
    clearMarketResultError: (state) => {
      state.error = null;
    },
    clearMarketResultById: (state) => {
      state.resultById = null;
    },
  },
  extraReducers: (builder) => {
    // Get all market results
    builder
      .addCase(getAllMarketResultsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMarketResultsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.resultList = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllMarketResultsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch market results';
      });

    // Get market result by ID
    builder
      .addCase(getMarketResultByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketResultByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.resultById = action.payload?.data || null;
      })
      .addCase(getMarketResultByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch market result';
      });

    // Create market result
    builder
      .addCase(createMarketResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMarketResultAsync.fulfilled, (state, action) => {
        state.loading = false;
         state.resultList = action.payload?.data || action.payload?.result;
      })
      .addCase(createMarketResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create market result';
      });

    // Update market result
    builder
      .addCase(updateMarketResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMarketResultAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedResult = action.payload?.data || action.payload?.result;
        if (updatedResult) {
          const index = state.resultList.findIndex((result) => result._id === updatedResult._id);
          if (index !== -1) {
            state.resultList[index] = updatedResult;
          }
          if (state.resultById?._id === updatedResult._id) {
            state.resultById = updatedResult;
          }
        }
      })
      .addCase(updateMarketResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update market result';
      });

    // Delete market result
    builder
      .addCase(deleteMarketResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMarketResultAsync.fulfilled, (state, action) => {
        state.loading = false;
        const resultId = action.meta.arg;
        state.resultList = state.resultList.filter((result) => result._id !== resultId);
        if (state.resultById?._id === resultId) {
          state.resultById = null;
        }
      })
      .addCase(deleteMarketResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete market result';
      });

    // Revert market result
    builder
      .addCase(revertMarketResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revertMarketResultAsync.fulfilled, (state, action) => {
        state.loading = false;
        const revertedResult = action.payload?.data || action.payload?.result;
        if (revertedResult) {
          const index = state.resultList.findIndex((result) => result._id === revertedResult._id);
          if (index !== -1) {
            state.resultList[index] = revertedResult;
          }
          if (state.resultById?._id === revertedResult._id) {
            state.resultById = revertedResult;
          }
        }
      })
      .addCase(revertMarketResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to revert market result';
      });
  },
});

export const { clearMarketResultError, clearMarketResultById } = marketResultSlice.actions;
export default marketResultSlice.reducer;


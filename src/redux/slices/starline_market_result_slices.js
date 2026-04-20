import { createSlice } from '@reduxjs/toolkit';
import {
  getAllStarlineMarketResultsAsync,
  getStarlineMarketResultByIdAsync,
  createStarlineMarketResultAsync,
  updateStarlineMarketResultAsync,
  deleteStarlineMarketResultAsync,
  revertStarlineMarketResultAsync,
} from '../services/starline_market_result_services';

const initialState = {
  resultList: [],
  currentResult: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const starlineMarketResultSlice = createSlice({
  name: 'starlineMarketResult',
  initialState,
  reducers: {
    clearStarlineMarketResultError: (state) => {
      state.error = null;
    },
    clearCurrentStarlineMarketResult: (state) => {
      state.currentResult = null;
    },
  },
  extraReducers: (builder) => {
    // Get all starline market results
    builder
      .addCase(getAllStarlineMarketResultsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStarlineMarketResultsAsync.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resultList = payload?.data || [];
        if (payload?.pagination) {
          state.pagination = {
            page: payload.pagination.page || 1,
            limit: payload.pagination.limit || 10,
            total: payload.pagination.total || 0,
            totalPages: payload.pagination.totalPages || 0,
          };
        }
      })
      .addCase(getAllStarlineMarketResultsAsync.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.message || 'Failed to fetch starline market results';
      });

    // Get starline market result by ID
    builder
      .addCase(getStarlineMarketResultByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStarlineMarketResultByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResult = action.payload?.data || null;
      })
      .addCase(getStarlineMarketResultByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch starline market result';
      });

    // Create starline market result
    builder
      .addCase(createStarlineMarketResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStarlineMarketResultAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.resultList.unshift(action.payload.data);
        }
      })
      .addCase(createStarlineMarketResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create starline market result';
      });

    // Update starline market result
    builder
      .addCase(updateStarlineMarketResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStarlineMarketResultAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedResult = action.payload?.data;
        if (updatedResult) {
          const index = state.resultList.findIndex((result) => result._id === updatedResult._id);
          if (index !== -1) {
            state.resultList[index] = updatedResult;
          }
          if (state.currentResult?._id === updatedResult._id) {
            state.currentResult = updatedResult;
          }
        }
      })
      .addCase(updateStarlineMarketResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update starline market result';
      });

    // Delete starline market result
    builder
      .addCase(deleteStarlineMarketResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStarlineMarketResultAsync.fulfilled, (state, action) => {
        state.loading = false;
        const resultId = action.meta.arg;
        state.resultList = state.resultList.filter((result) => result._id !== resultId);
        if (state.currentResult?._id === resultId) {
          state.currentResult = null;
        }
      })
      .addCase(deleteStarlineMarketResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete starline market result';
      });

    // Revert starline market result
    builder
      .addCase(revertStarlineMarketResultAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revertStarlineMarketResultAsync.fulfilled, (state, action) => {
        state.loading = false;
        const resultId = action.meta.arg;
        state.resultList = state.resultList.filter((result) => result._id !== resultId);
        if (state.currentResult?._id === resultId) {
          state.currentResult = null;
        }
      })
      .addCase(revertStarlineMarketResultAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to revert starline market result';
      });
  },
});

export const { clearStarlineMarketResultError, clearCurrentStarlineMarketResult } =
  starlineMarketResultSlice.actions;
export default starlineMarketResultSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  getAllBidsAsync,
  getAllWinningBidsAsync,
  getBidDataResultAsync,
  getProfitBidsAsync,
  getYearlyProfitBidsAsync,
  getBidRecordsByDigitAndTypeAsync,
} from '../services/bid_services';

const initialState = {
  winningBidsList: [],
  allBidsList: [],
  bidDataResult: [],
  bidRecordsList: [],
  profitBidsList: {
    totalAmount: 0,
    winAmount: 0,
    profits: 0,
  },
  yearlyProfitBidsList: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [],
  },
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
        // API returns { message, data: { totalAmount, winAmount, profits } }
        const data = action.payload?.data || {};
        state.profitBidsList = {
          totalAmount: data.totalAmount || 0,
          winAmount: data.winAmount || 0,
          profits: data.profits || 0,
        };
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getProfitBidsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profit bids';
        // On error, set default values
        state.profitBidsList = {
          totalAmount: 0,
          winAmount: 0,
          profits: 0,
        };
      });

    // Get yearly profit bids
    builder
      .addCase(getYearlyProfitBidsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getYearlyProfitBidsAsync.fulfilled, (state, action) => {
        state.loading = false;
        // API returns { message, data: { categories, series } }
        const responseData = action.payload?.data || {};

        // If no data, default to current year with all zeros
        if (!responseData.series || responseData.series.length === 0) {
          const currentYear = new Date().getFullYear();
          const zeroData = new Array(12).fill(0);
          state.yearlyProfitBidsList = {
            categories: responseData.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
              {
                year: currentYear.toString(),
                data: [
                  { name: 'Total Amount', data: zeroData },
                  { name: 'Total Win Amount', data: zeroData },
                  { name: 'Profit', data: zeroData },
                ],
              },
            ],
          };
        } else {
          state.yearlyProfitBidsList = {
            categories: responseData.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: responseData.series || [],
          };
        }
      })
      .addCase(getYearlyProfitBidsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch yearly profit bids';
        // On error, also default to current year with zeros
        const currentYear = new Date().getFullYear();
        const zeroData = new Array(12).fill(0);
        state.yearlyProfitBidsList = {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          series: [
            {
              year: currentYear.toString(),
              data: [
                { name: 'Total Amount', data: zeroData },
                { name: 'Total Win Amount', data: zeroData },
                { name: 'Profit', data: zeroData },
              ],
            },
          ],
        };
      });

    // Get bid records by digit and type
    builder
      .addCase(getBidRecordsByDigitAndTypeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBidRecordsByDigitAndTypeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bidRecordsList = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getBidRecordsByDigitAndTypeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bid records';
        state.bidRecordsList = [];
      });
  },
});

export const { clearBidError, clearWinningBids } = bidSlice.actions;
export default bidSlice.reducer;


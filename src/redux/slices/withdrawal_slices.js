import { createSlice } from '@reduxjs/toolkit';
import {
  approveWithdrawalRequestAsync,
  getPendingWithdrawalCountAsync,
  rejectWithdrawalRequestAsync,
} from '../services/withdrawal_services';

const initialState = {
  pendingCount: 0,
  loading: false,
  error: null,
};

const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Pending count - drives the "Withdraw History" sidebar badge
    builder
      .addCase(getPendingWithdrawalCountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingWithdrawalCountAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingCount = action.payload?.pagination?.total || 0;
      })
      .addCase(getPendingWithdrawalCountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch pending withdrawal count';
      });

    // Approving or rejecting always clears one pending request, so drop the
    // badge straight away instead of waiting for the next poll.
    builder.addMatcher(
      (action) =>
        action.type === approveWithdrawalRequestAsync.fulfilled.type ||
        action.type === rejectWithdrawalRequestAsync.fulfilled.type,
      (state) => {
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      }
    );
  },
});

export default withdrawalSlice.reducer;

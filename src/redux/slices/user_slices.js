import { createSlice } from '@reduxjs/toolkit';
import {
  deleteUserAsync,
  getAllUsersAsync,
  getUserByIdAsync,
  updateUserStatusAsync,
  getUserLedgersAsync,
  addDeductBalanceAsync,
} from '../services/user_services';

const initialState = {
  userList: [],
  userById: null,
  transactionsList: [],
  loading: false,
  transactionsLoading: false,
  error: null,
  transactionsError: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  transactionsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserById: (state) => {
      state.userById = null;
    },
  },
  extraReducers: (builder) => {
    // Get all users
    builder
      .addCase(getAllUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload?.data || [];
        if (action.payload) {
          state.pagination = {
            page: action.payload.currentPage || 1,
            limit: action.payload.limit || 10,
            total: action.payload.totalItems || 0,
            totalPages: action.payload.totalPages || 0,
          };
        }
      })
      .addCase(getAllUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      });

    // Get user by ID
    builder
      .addCase(getUserByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userById = action.payload?.data || action.payload?.user || null;
      })
      .addCase(getUserByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user';
      });

    // Update user status
    builder
      .addCase(updateUserStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update user in list if exists
        const updatedUser = action.payload?.user || action.payload?.data;
        if (updatedUser) {
          const index = state.userList.findIndex((user) => user._id === updatedUser._id);
          if (index !== -1) {
            state.userList[index] = updatedUser;
          }
        }
      })
      .addCase(updateUserStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update user status';
      });

    // Delete user
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Remove user from list
        const deletedId = action.meta.arg;
        state.userList = state.userList.filter((user) => user._id !== deletedId);
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete user';
      });

    // Get user ledgers
    builder
      .addCase(getUserLedgersAsync.pending, (state) => {
        state.transactionsLoading = true;
        state.transactionsError = null;
      })
      .addCase(getUserLedgersAsync.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsList = action.payload?.data || [];
        if (action.payload) {
          state.transactionsPagination = {
            page: action.payload.currentPage || 1,
            limit: action.payload.limit || 10,
            total: action.payload.totalItems || 0,
            totalPages: action.payload.totalPages || 0,
          };
        }
      })
      .addCase(getUserLedgersAsync.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsError = action.payload?.message || 'Failed to fetch ledgers';
      });

    // Add or deduct balance
    builder
      .addCase(addDeductBalanceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDeductBalanceAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update user balance in list if exists
        const updatedUser = action.payload?.user;
        if (updatedUser) {
          const index = state.userList.findIndex((user) => user._id === updatedUser._id);
          if (index !== -1) {
            state.userList[index] = { ...state.userList[index], ...updatedUser };
          }
        }
      })
      .addCase(addDeductBalanceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update balance';
      });
  },
});

export const { clearUserError, clearUserById } = userSlice.actions;
export default userSlice.reducer;


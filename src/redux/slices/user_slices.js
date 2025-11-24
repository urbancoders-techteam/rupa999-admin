import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  deleteUserAsync,
  getAllUsersAsync,
  getUserByIdAsync,
  updateUserStatusAsync,
  getUserLedgersAsync,
  addDeductBalanceAsync,
  getUserBidsAsync,
  getAllLedgersAsync,
} from '../services/user_services';

const initialState = {
  userList: [],
  userById: null,
  selectedUserName: null,
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
  bidHistoryList: [],
  bidHistoryLoading: false,
  bidHistoryError: null,
  bidHistoryPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  allLedgersList: [],
  allLedgersLoading: false,
  allLedgersError: null,
  allLedgersPagination: {
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
    setSelectedUserName: (state, action) => {
      state.selectedUserName = action.payload;
    },
    clearSelectedUserName: (state) => {
      state.selectedUserName = null;
    },
  },
  extraReducers: (builder) => {
    // Get all users ----------
    builder.addMatcher(isAnyOf(getAllUsersAsync.pending), (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isAnyOf(getAllUsersAsync.fulfilled), (state, { payload }) => {
      state.loading = false;
      state.userList = payload?.data || [];
      if (payload) {
        state.pagination = {
          page: payload.currentPage || 1,
          limit: payload.limit || 10,
          total: payload.totalItems || 0,
          totalPages: payload.totalPages || 0,
        };
      }
    });

    builder.addMatcher(isAnyOf(getAllUsersAsync.rejected), (state, { payload }) => {
      state.loading = false;
      state.error = payload?.message || 'Failed to fetch users';
    });
    // -------------

    // Get user by ID ----------
    builder.addMatcher(isAnyOf(getUserByIdAsync.pending), (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isAnyOf(getUserByIdAsync.fulfilled), (state, { payload }) => {
      state.loading = false;
      state.userById = payload?.data || payload?.user || null;
    });

    builder.addMatcher(isAnyOf(getUserByIdAsync.rejected), (state, { payload }) => {
      state.loading = false;
      state.error = payload?.message || 'Failed to fetch user';
    });
    // -------------

    // Update user status ----------
    builder.addMatcher(isAnyOf(updateUserStatusAsync.pending), (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isAnyOf(updateUserStatusAsync.fulfilled), (state, { payload }) => {
      state.loading = false;
      // Update user in list if exists
      const updatedUser = payload?.user || payload?.data;
      if (updatedUser) {
        const index = state.userList.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.userList[index] = updatedUser;
        }
      }
    });

    builder.addMatcher(isAnyOf(updateUserStatusAsync.rejected), (state, { payload }) => {
      state.loading = false;
      state.error = payload?.message || 'Failed to update user status';
    });
    // -------------

    // Delete user ----------
    builder.addMatcher(isAnyOf(deleteUserAsync.pending), (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isAnyOf(deleteUserAsync.fulfilled), (state, { meta }) => {
      state.loading = false;
      // Remove user from list
      const deletedId = meta.arg;
      state.userList = state.userList.filter((user) => user._id !== deletedId);
    });

    builder.addMatcher(isAnyOf(deleteUserAsync.rejected), (state, { payload }) => {
      state.loading = false;
      state.error = payload?.message || 'Failed to delete user';
    });
    // -------------

    // Get user ledgers ----------
    builder.addMatcher(isAnyOf(getUserLedgersAsync.pending), (state) => {
      state.transactionsLoading = true;
      state.transactionsError = null;
    });

    builder.addMatcher(isAnyOf(getUserLedgersAsync.fulfilled), (state, { payload }) => {
      state.transactionsLoading = false;
      state.transactionsList = payload?.data || [];
      if (payload) {
        state.transactionsPagination = {
          page: payload.pagination.page || 1,
          limit: payload.pagination.limit || 10,
          total: payload.pagination.total || 0,
          totalPages: payload.pagination.totalPages || 0,
        };
      }
    });

    builder.addMatcher(isAnyOf(getUserLedgersAsync.rejected), (state, { payload }) => {
      state.transactionsLoading = false;
      state.transactionsError = payload?.message || 'Failed to fetch ledgers';
    });
    // -------------

    // Add or deduct balance ----------
    builder.addMatcher(isAnyOf(addDeductBalanceAsync.pending), (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(isAnyOf(addDeductBalanceAsync.fulfilled), (state, { payload }) => {
      state.loading = false;
      // Update user balance in list if exists
      const updatedUser = payload?.user;
      if (updatedUser) {
        const index = state.userList.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.userList[index] = { ...state.userList[index], ...updatedUser };
        }
      }
    });

    builder.addMatcher(isAnyOf(addDeductBalanceAsync.rejected), (state, { payload }) => {
      state.loading = false;
      state.error = payload?.message || 'Failed to update balance';
    });
    // -------------

    // Get user bids ----------
    builder.addMatcher(isAnyOf(getUserBidsAsync.pending), (state) => {
      state.bidHistoryLoading = true;
      state.bidHistoryError = null;
    });

    builder.addMatcher(isAnyOf(getUserBidsAsync.fulfilled), (state, { payload }) => {
      state.bidHistoryLoading = false;
      state.bidHistoryList = payload?.data || [];
      if (payload) {
        state.bidHistoryPagination = {
          page: payload.currentPage || 1,
          limit: payload.limit || 10,
          total: payload.totalItems || 0,
          totalPages: payload.totalPages || 0,
        };
      }
    });

    builder.addMatcher(isAnyOf(getUserBidsAsync.rejected), (state, { payload }) => {
      state.bidHistoryLoading = false;
      state.bidHistoryError = payload?.message || 'Failed to fetch bid history';
    });
    // -------------

    // Get all ledgers ----------
    builder.addMatcher(isAnyOf(getAllLedgersAsync.pending), (state) => {
      state.allLedgersLoading = true;
      state.allLedgersError = null;
    });

    builder.addMatcher(isAnyOf(getAllLedgersAsync.fulfilled), (state, { payload }) => {
      state.allLedgersLoading = false;
      state.allLedgersList = payload?.data || [];
      if (payload?.pagination) {
        state.allLedgersPagination = {
          page: payload.pagination.page || 1,
          limit: payload.pagination.limit || 10,
          total: payload.pagination.total || 0,
          totalPages: payload.pagination.totalPages || 0,
        };
      }
    });

    builder.addMatcher(isAnyOf(getAllLedgersAsync.rejected), (state, { payload }) => {
      state.allLedgersLoading = false;
      state.allLedgersError = payload?.message || 'Failed to fetch ledgers';
    });
    // -------------
  },
});

export const { clearUserError, clearUserById, setSelectedUserName, clearSelectedUserName } = userSlice.actions;
export default userSlice.reducer;


import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { staffLoginAsync, changePasswordAsync } from '../services/auth_services';

const initialState = {
  token: false,
  isSubmitting: false,
  admin: {},
  changePasswordLoading: false,
  changePasswordError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearChangePasswordError: (state) => {
      state.changePasswordError = null;
    },
  },
  extraReducers: (builder) => {
    // Login User ----------
    builder.addMatcher(isAnyOf(staffLoginAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(staffLoginAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
      state.token = payload?.access_token || false;
      state.admin = payload?.admin || payload?.data?.admin || {};
      // Store token in localStorage if not already stored
      if (payload?.access_token && !localStorage.getItem('token')) {
        localStorage.setItem('token', payload.access_token);
      }
    });
    builder.addMatcher(isAnyOf(staffLoginAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Change Password ----------
    builder.addMatcher(isAnyOf(changePasswordAsync.pending), (state) => {
      state.changePasswordLoading = true;
      state.changePasswordError = null;
    });
    builder.addMatcher(isAnyOf(changePasswordAsync.fulfilled), (state) => {
      state.changePasswordLoading = false;
      state.changePasswordError = null;
    });
    builder.addMatcher(isAnyOf(changePasswordAsync.rejected), (state, { payload }) => {
      state.changePasswordLoading = false;
      state.changePasswordError = payload?.message || 'Failed to change password';
    });
    // -------------
  },
});

export const { clearAlert, clearChangePasswordError } = authSlice.actions;
export default authSlice.reducer;

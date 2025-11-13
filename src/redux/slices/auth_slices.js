import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { staffLoginAsync } from '../services/auth_services';

const initialState = {
  token: false,
  isSubmitting: false,
  user: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    // Login User ----------
    builder.addMatcher(isAnyOf(staffLoginAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(staffLoginAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
      state.token = payload?.access_token || false;
      state.user = payload?.admin || payload?.data?.admin || {};
      // Store token in localStorage if not already stored
      if (payload?.access_token && !localStorage.getItem('token')) {
        localStorage.setItem('token', payload.access_token);
      }
    });
    builder.addMatcher(isAnyOf(staffLoginAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
  },
});

export const { clearAlert } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  uploadApkAsync,
  getApkInfoAsync,
  getAllApksAsync,
} from '../services/apk_services';

const initialState = {
  apkInfo: null,
  apkList: [],
  loading: false,
  error: null,
};

const apkSlice = createSlice({
  name: 'apk',
  initialState,
  reducers: {
    clearApkError: (state) => {
      state.error = null;
    },
    clearApkInfo: (state) => {
      state.apkInfo = null;
    },
  },
  extraReducers: (builder) => {
    // Upload APK
    builder
      .addCase(uploadApkAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadApkAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.apkInfo = action.payload.data;
        }
      })
      .addCase(uploadApkAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to upload APK';
      });

    // Get APK info
    builder
      .addCase(getApkInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApkInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.apkInfo = action.payload?.data || null;
      })
      .addCase(getApkInfoAsync.rejected, (state) => {
        state.loading = false;
        // Don't set error if no APK exists
        state.apkInfo = null;
      });

    // Get all APKs
    builder
      .addCase(getAllApksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllApksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.apkList = action.payload?.data || [];
      })
      .addCase(getAllApksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch APKs';
      });
  },
});

export const { clearApkError, clearApkInfo } = apkSlice.actions;
export default apkSlice.reducer;

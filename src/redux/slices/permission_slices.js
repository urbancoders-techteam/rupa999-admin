import { createSlice } from '@reduxjs/toolkit';
import {
  getAllRoutesAsync,
  getPermissionByRoleIdAsync,
  createPermissionAsync,
} from '../services/auth_role_permission';

const initialState = {
  routes: [],
  permissions: [],
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    clearPermissionError: (state) => {
      state.error = null;
    },
    clearPermissions: (state) => {
      state.permissions = [];
    },
  },
  extraReducers: (builder) => {
    // Get all routes
    builder
      .addCase(getAllRoutesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRoutesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload?.data || [];
      })
      .addCase(getAllRoutesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch routes';
      });

    // Get permissions by role ID
    builder
      .addCase(getPermissionByRoleIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPermissionByRoleIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload?.data || [];
      })
      .addCase(getPermissionByRoleIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch permissions';
      });

    // Create permissions
    builder
      .addCase(createPermissionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermissionAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPermissionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create permissions';
      });
  },
});

export const { clearPermissionError, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;


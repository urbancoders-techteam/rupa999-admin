import { createSlice } from '@reduxjs/toolkit';
import {
  getAllRolesAsync,
  getRoleByIdAsync,
  createRoleAsync,
  updateRoleAsync,
  deleteRoleAsync,
} from '../services/role_services';

const initialState = {
  roleList: [],
  currentRole: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    // Get all roles
    builder
      .addCase(getAllRolesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRolesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.roleList = action.payload?.data?.roles || action.payload?.data || [];
        if (action.payload?.data?.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.data.pagination,
          };
        } else if (action.payload?.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }
      })
      .addCase(getAllRolesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch roles';
      });

    // Get role by ID
    builder
      .addCase(getRoleByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload?.data || null;
      })
      .addCase(getRoleByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch role';
      });

    // Create role
    builder
      .addCase(createRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoleAsync.fulfilled, (state, action) => {
        state.loading = false;
        const newRole = action.payload?.data;
        if (newRole) {
          state.roleList.push(newRole);
        }
      })
      .addCase(createRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create role';
      });

    // Update role
    builder
      .addCase(updateRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoleAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRole = action.payload?.data;
        if (updatedRole) {
          const index = state.roleList.findIndex((role) => role._id === updatedRole._id);
          if (index !== -1) {
            state.roleList[index] = updatedRole;
          }
          if (state.currentRole?._id === updatedRole._id) {
            state.currentRole = updatedRole;
          }
        }
      })
      .addCase(updateRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update role';
      });

    // Delete role
    builder
      .addCase(deleteRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoleAsync.fulfilled, (state, action) => {
        state.loading = false;
        const roleId = action.meta.arg;
        state.roleList = state.roleList.filter((role) => role._id !== roleId);
        if (state.currentRole?._id === roleId) {
          state.currentRole = null;
        }
      })
      .addCase(deleteRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete role';
      });
  },
});

export const { clearRoleError, clearCurrentRole } = roleSlice.actions;
export default roleSlice.reducer;


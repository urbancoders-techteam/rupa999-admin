import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getAllStaffAsync,
  getStaffByIdAsync,
  createStaffAsync,
  updateStaffAsync,
  deleteStaffAsync,
  getStaffProfileAsync,
} from '../services/staff_services';

const initialState = {
  staffList: [],
  currentStaff: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearStaffError: (state) => {
      state.error = null;
    },
    clearCurrentStaff: (state) => {
      state.currentStaff = null;
    },
  },
  extraReducers: (builder) => {
    // Get all staff
    builder
      .addCase(getAllStaffAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStaffAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllStaffAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch staff';
      });

    // Get staff by ID
    builder
      .addCase(getStaffByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStaff = action.payload?.data || null;
      })
      .addCase(getStaffByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch staff';
      });

    // Create staff
    builder
      .addCase(createStaffAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaffAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.admin) {
          state.staffList.push(action.payload.admin);
        }
      })
      .addCase(createStaffAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create staff';
      });

    // Update staff
    builder
      .addCase(updateStaffAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaffAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStaff = action.payload?.data;
        if (updatedStaff) {
          const index = state.staffList.findIndex((staff) => staff._id === updatedStaff._id);
          if (index !== -1) {
            state.staffList[index] = updatedStaff;
          }
          if (state.currentStaff?._id === updatedStaff._id) {
            state.currentStaff = updatedStaff;
          }
        }
      })
      .addCase(updateStaffAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update staff';
      });

    // Delete staff
    builder
      .addCase(deleteStaffAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaffAsync.fulfilled, (state, action) => {
        state.loading = false;
        const staffId = action.meta.arg;
        state.staffList = state.staffList.filter((staff) => staff._id !== staffId);
        if (state.currentStaff?._id === staffId) {
          state.currentStaff = null;
        }
      })
      .addCase(deleteStaffAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete staff';
      });

    // Get staff profile
    builder
      .addCase(getStaffProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStaff = action.payload?.admin || null;
      })
      .addCase(getStaffProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      });
  },
});

export const { clearStaffError, clearCurrentStaff } = staffSlice.actions;
export default staffSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';
import {
  getAllNotificationsAsync,
  getNotificationByIdAsync,
  createNotificationAsync,
  deleteNotificationAsync,
} from '../services/notification_services';

const initialState = {
  notificationList: [],
  currentNotification: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    clearCurrentNotification: (state) => {
      state.currentNotification = null;
    },
  },
  extraReducers: (builder) => {
    // Get all notifications
    builder
      .addCase(getAllNotificationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNotificationsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationList = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllNotificationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch notifications';
      });

    // Get notification by ID
    builder
      .addCase(getNotificationByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotificationByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNotification = action.payload?.data || null;
      })
      .addCase(getNotificationByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch notification';
      });

    // Create notification
    builder
      .addCase(createNotificationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotificationAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally add to list
        if (action.payload?.data) {
          state.notificationList.unshift(action.payload.data);
        }
      })
      .addCase(createNotificationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create notification';
      });


    // Delete notification
    builder
      .addCase(deleteNotificationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from list if deleted
        const deletedId = action.meta.arg;
        state.notificationList = state.notificationList.filter(
          (n) => n._id !== deletedId
        );
        if (state.currentNotification?._id === deletedId) {
          state.currentNotification = null;
        }
      })
      .addCase(deleteNotificationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete notification';
      });
  },
});

export const { clearNotificationError, clearCurrentNotification } = notificationSlice.actions;
export default notificationSlice.reducer;


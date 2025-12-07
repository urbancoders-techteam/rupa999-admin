import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all notifications (only announcement type for admin)
export const getAllNotificationsAsync = createAsyncThunk(
  'notification/getAll',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/notifications',
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        type: 'announcement', // Only show announcement type in admin
      },
    })
);

// Get notification by ID
export const getNotificationByIdAsync = createAsyncThunk(
  'notification/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/notifications/${id}`,
      method: 'get',
    })
);

// Create notification
export const createNotificationAsync = createAsyncThunk(
  'notification/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/notifications',
      method: 'post',
      data,
    })
);


// Delete notification
export const deleteNotificationAsync = createAsyncThunk(
  'notification/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/notifications/${id}`,
      method: 'delete',
    })
);


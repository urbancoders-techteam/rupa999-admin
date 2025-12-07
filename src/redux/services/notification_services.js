import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all notifications
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

// Update notification
export const updateNotificationAsync = createAsyncThunk(
  'notification/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/notifications/${id}`,
      method: 'patch',
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


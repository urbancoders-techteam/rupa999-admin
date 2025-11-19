import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all users (for admin)
export const getAllUsersAsync = createAsyncThunk(
  'user/getAll',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/users/admin',
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        status: params.status || '',
      },
    })
);

// Get user by ID
export const getUserByIdAsync = createAsyncThunk(
  'user/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${id}`,
      method: 'get',
    })
);

// Update user status
export const updateUserStatusAsync = createAsyncThunk(
  'user/updateStatus',
  async ({ id, status }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${id}/status`,
      method: 'put',
      data: { status },
    })
);

// Delete user
export const deleteUserAsync = createAsyncThunk(
  'user/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${id}`,
      method: 'delete',
    })
);

// Change user password by ID (Admin only)
export const changeUserPasswordAsync = createAsyncThunk(
  'user/changePassword',
  async ({ id, password, cpassword }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${id}/password`,
      method: 'put',
      data: { password, cpassword },
    })
);


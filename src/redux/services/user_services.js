import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Create user (register)
export const createUserAsync = createAsyncThunk(
  'user/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/users/register',
      method: 'post',
      data: {
        name: data.name,
        number: data.number,
        password: data.password,
      },
    })
);

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

// Get user ledgers
export const getUserLedgersAsync = createAsyncThunk(
  'user/getUserLedgers',
  async ({ userId, ...params } = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${userId}/ledgers`,
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        particulars: params.particulars || '',
      },
    })
);

// Add or deduct balance (Admin only)
export const addDeductBalanceAsync = createAsyncThunk(
  'user/addDeductBalance',
  async ({ id, amount, action }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${id}/balance`,
      method: 'put',
      data: { amount, action },
    })
);

// Get user bids
export const getUserBidsAsync = createAsyncThunk(
  'user/getUserBids',
  async ({ userId, ...params } = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${userId}/bids`,
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        gameType: params.gameType || '',
        status: params.status || '',
      },
    })
);

// Get all ledgers (Admin only)
export const getAllLedgersAsync = createAsyncThunk(
  'user/getAllLedgers',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/ledgers',
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        particulars: params.particulars || '',
      },
    })
);

// Get all bids (Admin only)
export const getAllBidsAsync = createAsyncThunk(
  'user/getAllBids',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/bids',
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        gameType: params.gameType || '',
        status: params.status || '',
      },
    })
);


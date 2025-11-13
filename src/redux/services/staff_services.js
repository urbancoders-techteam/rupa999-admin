import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all staff (admins)
export const getAllStaffAsync = createAsyncThunk(
  'staff/getAll',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin',
      method: 'get',
      params,
    })
);

// Get staff by ID
export const getStaffByIdAsync = createAsyncThunk(
  'staff/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/admin/${id}`,
      method: 'get',
    })
);

// Create staff
export const createStaffAsync = createAsyncThunk(
  'staff/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/register',
      method: 'post',
      data,
    })
);

// Update staff
export const updateStaffAsync = createAsyncThunk(
  'staff/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/admin/${id}`,
      method: 'patch',
      data,
    })
);

// Delete staff
export const deleteStaffAsync = createAsyncThunk(
  'staff/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/admin/${id}`,
      method: 'delete',
    })
);

// Get current admin profile
export const getStaffProfileAsync = createAsyncThunk(
  'staff/getProfile',
  async (_, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/profile',
      method: 'get',
    })
);


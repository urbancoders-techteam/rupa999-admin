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

// Change a staff member's password (admin-initiated, by admin ID)
export const changeStaffPasswordAsync = createAsyncThunk(
  'staff/changePassword',
  async ({ id, password, cpassword }, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/change-password',
      method: 'post',
      data: { adminId: id, newPassword: password, cpassword },
    })
);

// Update staff status (active/inactive)
export const updateStaffStatusAsync = createAsyncThunk(
  'staff/updateStatus',
  async ({ id, status }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/admin/${id}/status`,
      method: 'patch',
      data: { status },
    })
);

// Get dashboard statistics
export const getDashboardStatsAsync = createAsyncThunk(
  'staff/getDashboardStats',
  async (_, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/dashboard/stats',
      method: 'get',
    })
);


import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all routes
export const getAllRoutesAsync = createAsyncThunk(
  'permission/allRoute',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/routes',
      method: 'get',
      params,
    })
);

// Get permission by role ID
export const getPermissionByRoleIdAsync = createAsyncThunk(
  'permission/permissionByRoleId',
  async (roleId, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/permissions/${roleId}`,
      method: 'get',
    })
);

// Create permissions for a role
export const createPermissionAsync = createAsyncThunk(
  'permission/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/permissions',
      method: 'post',
      data,
    })
);


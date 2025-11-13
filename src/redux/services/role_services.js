import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all roles (with pagination and search)
export const getAllRolesAsync = createAsyncThunk(
  'role/getAll',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/roles',
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
      },
    })
);

// Get role by ID
export const getRoleByIdAsync = createAsyncThunk(
  'role/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/roles/${id}`,
      method: 'get',
    })
);

// Create role
export const createRoleAsync = createAsyncThunk(
  'role/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/roles',
      method: 'post',
      data: {
        roleName: data.roleName || data.designationName,
      },
    })
);

// Update role
export const updateRoleAsync = createAsyncThunk(
  'role/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/roles/${id}`,
      method: 'patch',
      data: {
        roleName: data.roleName || data.designationName,
      },
    })
);

// Delete role
export const deleteRoleAsync = createAsyncThunk(
  'role/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/roles/${id}`,
      method: 'delete',
    })
);


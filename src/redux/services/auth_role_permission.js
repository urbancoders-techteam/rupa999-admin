import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// all route path
export const getAllRoutesAsync = createAsyncThunk('permission/allRoute', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/api/v1/route`,
    params,
  })
);

// get permission by roile id
export const getPermissionByRoleIdAsync = createAsyncThunk(
  'permission/permissionByRoleId',
  async ({ id }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/api/v1/permission/${id}`,
      method: 'get',
    })
);


export const addPermissionByRoleIdAsync = createAsyncThunk('permission/addPermissionByRoleId', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/api/v1/permission/create',
    method: 'post',
    data,
  })
);


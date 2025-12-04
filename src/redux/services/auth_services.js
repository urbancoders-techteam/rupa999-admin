import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

export const staffLoginAsync = createAsyncThunk('api/account', async (data, toolkit) =>AxiosClient({
        toolkit,
        url: '/admin/login',
        method: 'post',
        data,
    })
);

// Change admin password
export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/change-password',
      method: 'post',
      data,
    })
);
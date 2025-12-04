import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get Help and Support data
export const getHelpSupportAsync = createAsyncThunk(
  'helpSupport/get',
  async (_, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/help-support',
      method: 'get',
    })
);

// Create or update Help and Support data
export const updateHelpSupportAsync = createAsyncThunk(
  'helpSupport/update',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/help-support',
      method: 'post',
      data,
    })
);


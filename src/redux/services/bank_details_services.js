import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get bank details by user ID (Admin only)
export const getBankDetailsByUserIdAsync = createAsyncThunk(
  'bankDetails/getByUserId',
  async (userId, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${userId}/bank-details`,
      method: 'get',
    })
);


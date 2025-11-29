import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all withdrawal requests
export const getAllWithdrawalRequestsAsync = createAsyncThunk(
  'withdrawal/getAll',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/withdrawals',
      method: 'get',
      params,
    })
);

// Approve withdrawal request
export const approveWithdrawalRequestAsync = createAsyncThunk(
  'withdrawal/approve',
  async ({ id, remarks }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/admin/withdrawals/${id}/approve`,
      method: 'patch',
      data: { remarks },
    })
);

// Reject withdrawal request
export const rejectWithdrawalRequestAsync = createAsyncThunk(
  'withdrawal/reject',
  async ({ id, remarks }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/admin/withdrawals/${id}/reject`,
      method: 'patch',
      data: { remarks },
    })
);


import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all winning bids (for admin)
export const getAllWinningBidsAsync = createAsyncThunk(
  'bid/getAllWinning',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/bids/winning',
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        userId: params.userId || '',
        marketId: params.marketId || '',
        gameType: params.gameType || '',
      },
    })
);

// Get all bids (for admin)
export const getAllBidsAsync = createAsyncThunk(
  'bid/getAll',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/admin/bids',
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        userId: params.userId || '',
        marketId: params.marketId || '',
        gameType: params.gameType || '',
        status: params.status || '',
      },
    })
);


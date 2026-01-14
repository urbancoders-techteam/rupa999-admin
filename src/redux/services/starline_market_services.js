import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all starline markets (for admin)
export const getAllStarlineMarketsAsync = createAsyncThunk(
  'starlineMarket/getAll',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/starline-markets/admin',
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
      },
    })
);

// Get starline market by ID
export const getStarlineMarketByIdAsync = createAsyncThunk(
  'starlineMarket/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-markets/${id}`,
      method: 'get',
    })
);

// Create starline market
export const createStarlineMarketAsync = createAsyncThunk(
  'starlineMarket/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/starline-markets',
      method: 'post',
      data,
    })
);

// Update starline market
export const updateStarlineMarketAsync = createAsyncThunk(
  'starlineMarket/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-markets/${id}`,
      method: 'patch',
      data,
    })
);

// Delete starline market
export const deleteStarlineMarketAsync = createAsyncThunk(
  'starlineMarket/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-markets/${id}`,
      method: 'delete',
    })
);

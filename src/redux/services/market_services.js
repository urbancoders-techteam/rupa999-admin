import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all markets (for admin)
export const getAllMarketsAsync = createAsyncThunk(
  'market/getAll',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/markets/admin',
      method: 'get',
      params,
    })
);

// Get market by ID
export const getMarketByIdAsync = createAsyncThunk(
  'market/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/markets/${id}`,
      method: 'get',
    })
);

// Create market
export const createMarketAsync = createAsyncThunk(
  'market/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/markets',
      method: 'post',
      data,
    })
);

// Update market
export const updateMarketAsync = createAsyncThunk(
  'market/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/markets/${id}`,
      method: 'patch',
      data,
    })
);

// Delete market
export const deleteMarketAsync = createAsyncThunk(
  'market/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/markets/${id}`,
      method: 'delete',
    })
);


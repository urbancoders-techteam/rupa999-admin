import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all starline game type rates
export const getAllStarlineGameTypeRatesAsync = createAsyncThunk(
  'starlineGameTypeRate/getAll',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/starline-game-type-rates',
      method: 'get',
      params,
    })
);

// Get starline game type rate by ID
export const getStarlineGameTypeRateByIdAsync = createAsyncThunk(
  'starlineGameTypeRate/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-game-type-rates/${id}`,
      method: 'get',
    })
);

// Create starline game type rate
export const createStarlineGameTypeRateAsync = createAsyncThunk(
  'starlineGameTypeRate/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/starline-game-type-rates',
      method: 'post',
      data,
    })
);

// Update starline game type rate
export const updateStarlineGameTypeRateAsync = createAsyncThunk(
  'starlineGameTypeRate/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-game-type-rates/${id}`,
      method: 'patch',
      data,
    })
);

// Bulk update starline game type rates
export const bulkUpdateStarlineGameTypeRatesAsync = createAsyncThunk(
  'starlineGameTypeRate/bulkUpdate',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/starline-game-type-rates/bulk-update',
      method: 'post',
      data,
    })
);

// Delete starline game type rate
export const deleteStarlineGameTypeRateAsync = createAsyncThunk(
  'starlineGameTypeRate/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-game-type-rates/${id}`,
      method: 'delete',
    })
);

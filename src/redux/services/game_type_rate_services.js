import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all game type rates
export const getAllGameTypeRatesAsync = createAsyncThunk(
  'gameTypeRate/getAll',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/game-type-rates',
      method: 'get',
      params,
    })
);

// Get game type rate by ID
export const getGameTypeRateByIdAsync = createAsyncThunk(
  'gameTypeRate/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/game-type-rates/${id}`,
      method: 'get',
    })
);

// Create game type rate
export const createGameTypeRateAsync = createAsyncThunk(
  'gameTypeRate/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/game-type-rates',
      method: 'post',
      data,
    })
);

// Update game type rate
export const updateGameTypeRateAsync = createAsyncThunk(
  'gameTypeRate/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/game-type-rates/${id}`,
      method: 'patch',
      data,
    })
);

// Bulk update game type rates
export const bulkUpdateGameTypeRatesAsync = createAsyncThunk(
  'gameTypeRate/bulkUpdate',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/game-type-rates/bulk-update',
      method: 'post',
      data,
    })
);

// Delete game type rate
export const deleteGameTypeRateAsync = createAsyncThunk(
  'gameTypeRate/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/game-type-rates/${id}`,
      method: 'delete',
    })
);


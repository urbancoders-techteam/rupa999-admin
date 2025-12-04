import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all market results
export const getAllMarketResultsAsync = createAsyncThunk(
  'marketResult/getAll',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/market-results',
      method: 'get',
      params,
    })
);

// Get market result by ID
export const getMarketResultByIdAsync = createAsyncThunk(
  'marketResult/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/market-results/${id}`,
      method: 'get',
    })
);

// Create market result
export const createMarketResultAsync = createAsyncThunk(
  'marketResult/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/market-results',
      method: 'post',
      data,
    })
);

// Update market result
export const updateMarketResultAsync = createAsyncThunk(
  'marketResult/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/market-results/${id}`,
      method: 'patch',
      data,
    })
);

// Delete market result
export const deleteMarketResultAsync = createAsyncThunk(
  'marketResult/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/market-results/${id}`,
      method: 'delete',
    })
);

// Revert market result
export const revertMarketResultAsync = createAsyncThunk(
  'marketResult/revert',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/market-results/${id}/revert`,
      method: 'post',
    })
);

// Get market results by market and game type
export const getMarketResultsByMarketAndGameTypeAsync = createAsyncThunk(
  'marketResult/getByMarketAndGameType',
  async ({ marketsId, gameType }, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/market-results/byMarketAndGameType',
      method: 'get',
      params: {
        marketsId,
        gameType,
      },
    })
);


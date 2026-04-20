import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all starline market results
export const getAllStarlineMarketResultsAsync = createAsyncThunk(
  'starlineMarketResult/getAll',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/starline-market-results',
      method: 'get',
      params,
    })
);

// Get starline market result by ID
export const getStarlineMarketResultByIdAsync = createAsyncThunk(
  'starlineMarketResult/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-market-results/${id}`,
      method: 'get',
    })
);

// Create starline market result
export const createStarlineMarketResultAsync = createAsyncThunk(
  'starlineMarketResult/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/starline-market-results',
      method: 'post',
      data,
    })
);

// Update starline market result
export const updateStarlineMarketResultAsync = createAsyncThunk(
  'starlineMarketResult/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-market-results/${id}`,
      method: 'patch',
      data,
    })
);

// Delete starline market result
export const deleteStarlineMarketResultAsync = createAsyncThunk(
  'starlineMarketResult/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-market-results/${id}`,
      method: 'delete',
    })
);

// Revert starline market result
export const revertStarlineMarketResultAsync = createAsyncThunk(
  'starlineMarketResult/revert',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/starline-market-results/${id}/revert`,
      method: 'post',
    })
);

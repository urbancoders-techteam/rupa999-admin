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

// // Get market results by date and market
// export const getMarketResultsByFiltersAsync = createAsyncThunk(
//   'marketResult/getByFilters',
//   async (params, toolkit) =>
//     AxiosClient({
//       toolkit,
//       url: '/market-results/filter',
//       method: 'get',
//       params,
//     })
// );


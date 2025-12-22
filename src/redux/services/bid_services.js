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

// Get bid data result
export const getBidDataResultAsync = createAsyncThunk(
  'bid/getDataResult',
  async (params = {}, toolkit) => {
    // Map 'market' to 'marketId' for API
    const apiParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      marketId: params.market || params.marketId,
      gameType: params.gameType,
      sortBy: params.sortBy,
      date: params.date,
      session: params.session,
    };

    // Remove undefined values
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === undefined || apiParams[key] === null || apiParams[key] === '') {
        delete apiParams[key];
      }
    });

    return AxiosClient({
      toolkit,
      url: '/bids/data-result',
      method: 'get',
      params: apiParams,
    });
  }
);

// Get profit bids
export const getProfitBidsAsync = createAsyncThunk(
  'bid/getProfitBids',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/bids/profit-bids',
      method: 'get',
      params: {
        period: params.period || 'today',
        ...params,
      },
    })
);

// Get yearly profit bids
export const getYearlyProfitBidsAsync = createAsyncThunk(
  'bid/getYearlyProfitBids',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/bids/yearly-profit-bids',
      method: 'get',
      params: {
        year: params.year || undefined,
        ...params,
      },
    })
);

// Get bid records by digit and type
export const getBidRecordsByDigitAndTypeAsync = createAsyncThunk(
  'bid/getBidRecordsByDigitAndType',
  async (params = {}, toolkit) => {
    const { id, ...queryParams } = params;
    const apiParams = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      marketId: queryParams.marketId,
      date: queryParams.date,
    };

    // Remove undefined values
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === undefined || apiParams[key] === null || apiParams[key] === '') {
        delete apiParams[key];
      }
    });

    return AxiosClient({
      toolkit,
      url: `/bids/data-result/${id}/records`,
      method: 'get',
      params: apiParams,
    });
  }
);


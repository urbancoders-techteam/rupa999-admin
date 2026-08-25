import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get the marquee message
export const getMarqueeMessageAsync = createAsyncThunk(
  'marqueeMessage/get',
  async (_, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/marquee-message',
      method: 'get',
    })
);

// Create or update the marquee message
export const updateMarqueeMessageAsync = createAsyncThunk(
  'marqueeMessage/update',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/marquee-message',
      method: 'post',
      data,
    })
);

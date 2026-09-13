import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get WhatsApp group settings
export const getWhatsappGroupAsync = createAsyncThunk(
  'whatsappGroup/get',
  async (_, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/whatsapp-group',
      method: 'get',
    })
);

// Create or update WhatsApp group settings
export const updateWhatsappGroupAsync = createAsyncThunk(
  'whatsappGroup/update',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/whatsapp-group',
      method: 'post',
      data,
    })
);

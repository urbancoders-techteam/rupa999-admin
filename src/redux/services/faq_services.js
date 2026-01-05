import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';

// Get all FAQs
export const getAllFaqsAsync = createAsyncThunk(
  'faq/getAll',
  async (params = {}, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/faqs',
      method: 'get',
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        isActive: params.isActive,
      },
    })
);

// Get FAQ by ID
export const getFaqByIdAsync = createAsyncThunk(
  'faq/getById',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/faqs/${id}`,
      method: 'get',
    })
);

// Create FAQ
export const createFaqAsync = createAsyncThunk(
  'faq/create',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/faqs',
      method: 'post',
      data,
    })
);

// Update FAQ
export const updateFaqAsync = createAsyncThunk(
  'faq/update',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/faqs/${id}`,
      method: 'put',
      data,
    })
);

// Delete FAQ
export const deleteFaqAsync = createAsyncThunk(
  'faq/delete',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/faqs/${id}`,
      method: 'delete',
    })
);



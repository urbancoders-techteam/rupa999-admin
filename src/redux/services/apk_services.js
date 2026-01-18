import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '../../utils/axios';
import { HOST_API_KEY } from '../../config-global';

// Upload APK
export const uploadApkAsync = createAsyncThunk(
  'apk/upload',
  async (file, toolkit) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    
    return fetch(`${HOST_API_KEY}/apk/upload`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Upload failed');
        }
        return toolkit.fulfillWithValue(data);
      })
      .catch((error) => toolkit.rejectWithValue(error.message || 'Upload failed'));
  }
);

// Get APK info
export const getApkInfoAsync = createAsyncThunk(
  'apk/getInfo',
  async (_, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/apk/info',
      method: 'get',
    })
);

// Get all APKs
export const getAllApksAsync = createAsyncThunk(
  'apk/getAll',
  async (_, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/apk/list',
      method: 'get',
    })
);

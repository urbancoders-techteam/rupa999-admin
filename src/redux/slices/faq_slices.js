import { createSlice } from '@reduxjs/toolkit';
import {
  getAllFAQsAsync,
  getFAQByIdAsync,
  createFAQAsync,
  updateFAQAsync,
  deleteFAQAsync,
} from '../services/faq_services';

const initialState = {
  faqList: [],
  currentFAQ: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    clearFAQError: (state) => {
      state.error = null;
    },
    clearCurrentFAQ: (state) => {
      state.currentFAQ = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all FAQs
      .addCase(getAllFAQsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFAQsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.faqList = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllFAQsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch FAQs';
      })

      // Get FAQ by ID
      .addCase(getFAQByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFAQByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFAQ = action.payload?.data || null;
      })
      .addCase(getFAQByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch FAQ';
      })

      // Create FAQ
      .addCase(createFAQAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFAQAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.faqList.unshift(action.payload.data);
        }
      })
      .addCase(createFAQAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create FAQ';
      })

      // Update FAQ
      .addCase(updateFAQAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFAQAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          const updated = action.payload.data;
          state.faqList = state.faqList.map((faq) =>
            faq._id === updated._id ? updated : faq
          );
          if (state.currentFAQ?._id === updated._id) {
            state.currentFAQ = updated;
          }
        }
      })
      .addCase(updateFAQAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update FAQ';
      })

      // Delete FAQ
      .addCase(deleteFAQAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFAQAsync.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.faqList = state.faqList.filter((faq) => faq._id !== deletedId);
        if (state.currentFAQ?._id === deletedId) {
          state.currentFAQ = null;
        }
      })
      .addCase(deleteFAQAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete FAQ';
      });
  },
});

export const { clearFAQError, clearCurrentFAQ } = faqSlice.actions;
export default faqSlice.reducer;


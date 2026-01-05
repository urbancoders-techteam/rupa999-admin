import { createSlice } from '@reduxjs/toolkit';
import {
  createFaqAsync,
  deleteFaqAsync,
  getAllFaqsAsync,
  getFaqByIdAsync,
  updateFaqAsync,
} from '../services/faq_services';

const initialState = {
  faqList: [],
  currentFaq: null,
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
    clearFaqError: (state) => {
      state.error = null;
    },
    clearCurrentFaq: (state) => {
      state.currentFaq = null;
    },
  },
  extraReducers: (builder) => {
    // Get all FAQs
    builder
      .addCase(getAllFaqsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFaqsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.faqList = action.payload?.data || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllFaqsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch FAQs';
      });

    // Get FAQ by ID
    builder
      .addCase(getFaqByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFaqByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFaq = action.payload?.data || null;
      })
      .addCase(getFaqByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch FAQ';
      });

    // Create FAQ
    builder
      .addCase(createFaqAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFaqAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally add to list
        if (action.payload?.data) {
          state.faqList.unshift(action.payload.data);
        }
      })
      .addCase(createFaqAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create FAQ';
      });

    // Update FAQ
    builder
      .addCase(updateFaqAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFaqAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update in list
        const updatedFaq = action.payload?.data;
        if (updatedFaq) {
          const index = state.faqList.findIndex((f) => f._id === updatedFaq._id);
          if (index !== -1) {
            state.faqList[index] = updatedFaq;
          }
          if (state.currentFaq?._id === updatedFaq._id) {
            state.currentFaq = updatedFaq;
          }
        }
      })
      .addCase(updateFaqAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update FAQ';
      });

    // Delete FAQ
    builder
      .addCase(deleteFaqAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFaqAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from list if deleted
        const deletedId = action.meta.arg;
        state.faqList = state.faqList.filter((f) => f._id !== deletedId);
        if (state.currentFaq?._id === deletedId) {
          state.currentFaq = null;
        }
      })
      .addCase(deleteFaqAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete FAQ';
      });
  },
});

export const { clearFaqError, clearCurrentFaq } = faqSlice.actions;
export default faqSlice.reducer;



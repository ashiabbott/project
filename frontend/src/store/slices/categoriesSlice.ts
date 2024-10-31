// src/store/slices/categoriesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import axiosInstance from '../../api/axiosConfig';
import { addNotification } from './notificationSlice';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Category[]>('/categories');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch categories'
    );
  }
});

// Async thunk to add a new category
export const addCategory = createAsyncThunk<
  Category,
  Partial<Category>,
  { rejectValue: string }
>('categories/addCategory', async (categoryData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<Category>(
      '/categories',
      categoryData
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to add category'
    );
  }
});

// Async thunk to update a category
export const updateCategory = createAsyncThunk<
  Category,
  Partial<Category> & Pick<Category, 'id'>,
  { rejectValue: string }
>('categories/updateCategory', async (categoryData, { rejectWithValue }) => {
  try {
    const { id, ...patch } = categoryData;
    const response = await axiosInstance.put<Category>(
      `/categories/${id}`,
      patch
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update category'
    );
  }
});

// Async thunk to delete a category
export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('categories/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/categories/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete category'
    );
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Synchronous actions can be added here if needed
  },
  extraReducers: builder => {
    // Handle fetchCategories
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(
        fetchCategories.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch categories';
          // Optionally dispatch a notification
        }
      );

    // Handle addCategory
    builder
      .addCase(addCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categories.push(action.payload);
          // Optionally dispatch a success notification
        }
      )
      .addCase(
        addCategory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to add category';
          // Optionally dispatch an error notification
        }
      );

    // Handle updateCategory
    builder
      .addCase(updateCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            cat => cat.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        }
      )
      .addCase(
        updateCategory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update category';
        }
      );

    // Handle deleteCategory
    builder
      .addCase(deleteCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.categories = state.categories.filter(
            cat => cat.id !== action.payload
          );
        }
      )
      .addCase(
        deleteCategory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to delete category';
        }
      );
  },
});

export default categoriesSlice.reducer;

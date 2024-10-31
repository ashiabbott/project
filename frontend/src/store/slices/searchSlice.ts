import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  results: any[];
  history: string[];
  savedSearches: { id: string; name: string; query: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  history: [],
  savedSearches: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<string>) => {
      if (!state.history.includes(action.payload)) {
        state.history.unshift(action.payload);
        if (state.history.length > 10) {
          state.history.pop();
        }
      }
    },
    clearHistory: state => {
      state.history = [];
    },
    saveSearch: (
      state,
      action: PayloadAction<{ name: string; query: string }>
    ) => {
      const id = new Date().toISOString();
      state.savedSearches.push({ id, ...action.payload });
    },
    executeSavedSearch: (state, action: PayloadAction<string>) => {
      const savedSearch = state.savedSearches.find(
        s => s.id === action.payload
      );
      if (savedSearch) {
        state.results = []; // Clear previous results
        state.loading = true;
        // You might dispatch an async search action here
      }
    },
    deleteSavedSearch: (state, action: PayloadAction<string>) => {
      state.savedSearches = state.savedSearches.filter(
        s => s.id !== action.payload
      );
    },
  },
  extraReducers: builder => {
    // Handle async actions like searchAll
  },
});

export const {
  addToHistory,
  clearHistory,
  saveSearch,
  executeSavedSearch,
  deleteSavedSearch,
} = searchSlice.actions;

export default searchSlice.reducer;

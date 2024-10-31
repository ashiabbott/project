import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatbotState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatbotState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async (message: string, { getState }) => {
    const { chatbot } = getState() as { chatbot: ChatbotState };
    const response = await api.post('/chatbot', {
      message,
      context: chatbot.messages,
    });
    return response.data;
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    resetChat: state => {
      state.messages = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendMessage.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.messages.push({ sender: 'user', text: action.meta.arg });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push({ sender: 'bot', text: action.payload.message });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { resetChat } = chatbotSlice.actions;
export default chatbotSlice.reducer;

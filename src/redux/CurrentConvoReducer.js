import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = '';

const CurrentConversationSlice = createSlice({
  name: 'currentConversation',
  initialState: initialState,
  reducers: {
    updateCurrentConversation: (state, action) => action.payload,
  },
});

export const {updateCurrentConversation} = CurrentConversationSlice.actions;
export default CurrentConversationSlice.reducer;

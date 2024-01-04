import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
const initialState = {};
const TypingDataSlice = createSlice({
  name: 'typingData',
  initialState: initialState,
  reducers: {
    startTyping: (state = {}, action) => {
      const {channelSid, participant} = action.payload;
      const existedUsers = state[channelSid] ?? [];
      existedUsers.push(participant);
      state[channelSid] = [...new Set(existedUsers)];
    },
    endTyping: (state = {}, action) => {
      const {channelSid, participant} = action.payload;
      const filteredUsers = (state[channelSid] ?? []).filter(
        user => user !== participant,
      );
      state[channelSid] = filteredUsers;
      // return Object.assign({}, state, {[channelSid]: filteredUsers});
    },
  },
});

export const {startTyping, endTyping} = TypingDataSlice.actions;
export default TypingDataSlice.reducer;

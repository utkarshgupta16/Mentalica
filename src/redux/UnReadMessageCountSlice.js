import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {};

const UnReadMessageCountSlice = createSlice({
  name: 'unreadMessage',
  initialState: initialState,
  reducers: {
    resetUnreadMessage: () => initialState,
    updateUnreadMessages: (state, action) => {
      const {channelSid, unreadCount, lastMessage} = action.payload;
      let oldData = state[channelSid] ?? {};
      if (unreadCount === 0 || unreadCount) {
        oldData = {
          ...oldData,
          unreadCount,
        };
      }

      return Object.assign({}, state, {
        [channelSid]: {...oldData, lastMessage},
      });
    },
    resetCount: (state, action) => {
      const {channelSid} = action.payload;
      let oldData = state[channelSid] ?? {};
      return Object.assign({}, state, {
        [channelSid]: {...oldData, unreadCount: 0},
      });
    },
  },
});

export const {resetUnreadMessage, resetCount, updateUnreadMessages} =
  UnReadMessageCountSlice.actions;
export default UnReadMessageCountSlice.reducer;

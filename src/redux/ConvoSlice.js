import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {endPoints} from '../utils/config';
import {conversationsMap} from './coversation-objects';

const initialState = [];
let originalConversations = [];
const convoSorter = (a, b) => b.lastMessageTime - a.lastMessageTime;

const ConversationsSlice = createSlice({
  name: 'conversations',
  initialState: initialState,
  reducers: {
    resetConversations: () => initialState,
    upsertConversation: (state, action) => {
      const {
        sid,
        friendlyName,
        dateUpdated,
        notificationLevel,
        lastReadMessageIndex,
        createdAt,
        updatedAt,
        attributes,
        lastMessageTime,
      } = action.payload;
      const filteredClone = state.filter(
        conversation => conversation.sid !== action.payload.sid,
      );

      //   conversationsMap.set(action.payload.sid, action.payload);

      originalConversations = [
        ...filteredClone,
        {
          sid,
          friendlyName,
          dateUpdated,
          notificationLevel,
          lastReadMessageIndex,
          createdAt,
          updatedAt,
          attributes,
          lastMessageTime,
        },
      ].sort(convoSorter);

      return originalConversations;
    },
    updateConversation: (state, action) => {
      const stateCopy = [...state];
      const target = stateCopy.find(
        convo => convo.sid === action.payload.channelSid,
      );

      if (target) {
        Object.assign(target, {
          ...action.payload.parameters,
        });
      }

      return stateCopy;
    },
    removeConversation: (state, action) => {
      const stateCopy = [...state];
      if (conversationsMap.has(action.payload)) {
        conversationsMap.delete(action.payload);
      }
      originalConversations = stateCopy.filter(
        convo => convo.sid !== action.payload,
      );
      return originalConversations;
    },
    filterConversations: (state, action) => {
      const searchString = action.payload;
      const filteredConversations = originalConversations.filter(convo => {
        return convo.friendlyName
          ? convo.friendlyName
              .toLowerCase()
              .includes(searchString.toLowerCase())
          : false;
      });

      return filteredConversations;
    },
  },
});

export const {
  upsertConversation,
  updateConversation,
  removeConversation,
  filterConversations,
  resetConversations,
} = ConversationsSlice.actions;
export default ConversationsSlice.reducer;

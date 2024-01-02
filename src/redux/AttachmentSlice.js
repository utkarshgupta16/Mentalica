import {createSlice} from '@reduxjs/toolkit';

const initialState = {};

const AttachmentsSlice = createSlice({
  name: 'attachments',
  initialState: initialState,
  reducers: {
    addAttachment: (state, action) => {
      const {channelSid, messageSid, mediaSid, attachment} = action.payload;
      state[channelSid] = state[channelSid] ?? {};
      state[channelSid][messageSid] = state[channelSid][messageSid] ?? {};
      state[channelSid][messageSid][mediaSid] = attachment;
    },
    removeAttachment: (state, action) => {
      const data = {...state};
      const {channelSid, messageSid, mediaSid} = action.payload;
      delete data[channelSid][messageSid][mediaSid];
    },
    clearAttachments: (state, action) => {
      const {channelSid, messageSid} = action.payload;
      return {
        ...state,
        [channelSid]: {
          ...(state[channelSid] || {}),
          [messageSid]: {},
        },
      };
    },
  },
});

export const {addAttachment, removeAttachment, clearAttachments} =
  AttachmentsSlice.actions;
export default AttachmentsSlice.reducer;

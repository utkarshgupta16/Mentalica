import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {endPoints} from '../utils/config';

const initialState = {
  participants: {},
};

const reduxifyParticipant = participant => ({
  sid: participant?.sid,
  attributes: participant?.attributes,
  identity: participant?.identity,
  type: participant?.type,
  lastReadMessageIndex: participant?.lastReadMessageIndex,
});

const ParticipantsSlice = createSlice({
  name: 'participants',
  initialState: initialState,
  reducers: {
    updateParticipant: (state, action) => {
      const {participants = [], sid} = action.payload;
      return Object.assign({}, state, {
        [sid]: participants,
      });
    },
    updateAfterRemoveParticipant: (state, action) => {
      return action.payload;
    },
    setParticipant: (state, action) => {
      if (action?.payload?.identity) {
        state.participants[action?.payload.identity] = action?.payload;
      }
    },
  },
});

export const {updateParticipant, updateAfterRemoveParticipant, setParticipant} =
  ParticipantsSlice.actions;
export default ParticipantsSlice.reducer;

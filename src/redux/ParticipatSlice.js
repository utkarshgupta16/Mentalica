import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {endPoints} from '../utils/config';

const initialState = {};

const ParticipantsSlice = createSlice({
  name: 'participants',
  initialState: initialState,
  reducers: {
    updateAfterRemoveParticipant: (state, action) => {
      return action.payload;
    },
    setParticipant: (state, action) => {
      if (action?.payload?.identity) {
        state[action?.payload.identity] = action?.payload;
      }
    },
    setAllParticipant: (state, action) => {
      state = action?.payload;
    },
  },
});

export const {updateAfterRemoveParticipant, setParticipant, setAllParticipant} =
  ParticipantsSlice.actions;
export default ParticipantsSlice.reducer;

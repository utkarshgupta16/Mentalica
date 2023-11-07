import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  attributes: {},
};
const HomeSlice = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {
    setAttributes: (state, action) => {
      state.attributes = action.payload;
    },
  },
});

export const {setAttributes} = HomeSlice.actions;
export default HomeSlice.reducer;

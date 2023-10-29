import {createSlice} from '@reduxjs/toolkit';

const initialState = {isLoggedIn: false};
const Authslice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login: state => {
      state.isLoggedIn = true;
    },
    logout: state => {
      state.isLoggedIn = false;
    },
  },
});

export const {login, logout} = Authslice.actions;
export default Authslice.reducer;

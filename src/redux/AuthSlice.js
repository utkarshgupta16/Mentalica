import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loginFrom: null,
};
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
    loginClient: (state, action) => {
      state.loginFrom = action.payload;
    },
  },
});

export const {login, logout, loginClient} = Authslice.actions;
export default Authslice.reducer;

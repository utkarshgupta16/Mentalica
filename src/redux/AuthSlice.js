import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {endPoints} from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PATIENT} from '../utils/Strings';
// import { USER_NAME, PASSWORD } from '@env';

export const singUpSlice = createAsyncThunk('auth/singUpSlice', async data => {
  let {type, ...restData} = data || {};
  if (!type) {
    return;
  }
  // let token = await AsyncStorage.getItem('token');
  var config = {
    method: 'post',
    url: endPoints.signUpUserProfile, // single endpoint used for both mentor and patient
    headers: {
      Authorization: `signup`,
      'Content-Type': 'application/json',
    },
    data: restData,
  };
  return axios(config)
    .then(async response => {
      const {data, status} = response;
      if (status === 200) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Server Error!'));
      }
    })
    .catch(err => {
      console.log('err', err);
      return Promise.reject(new Error(err));
    });
});

const initialState = {
  isLoggedIn: false,
  loginFrom: null,
  email: '',
  type: '',
  userToken: {},

};
const Authslice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.email = action.payload.email;
      state.userToken = action.payload.userToken;
    },
    getType: (state, action) => {
      state.type = action.payload;
    },

    logout: (state, payload) => initialState,

    loginClient: (state, action) => {
      state.loginFrom = action.payload;
    },
  },
});

export const {login, logout, loginClient, getType} = Authslice.actions;
export default Authslice.reducer;

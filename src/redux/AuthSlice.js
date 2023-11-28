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
    url:
      type === PATIENT
        ? endPoints.singUpPatientProfile
        : endPoints.singUpMentorProfile,
    headers: {
      // Authorization: `Bearer ${token}`,
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
  jwtToken: '',
};
const Authslice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.email = action.payload;
    },
    getType: (state, action) => {
      state.type = action.payload;
    },
    getAccessToken: (state, action) => {
      state.jwtToken = action.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
    },
    loginClient: (state, action) => {
      state.loginFrom = action.payload;
    },
  },
});

export const {login, logout, loginClient, getType, getAccessToken} =
  Authslice.actions;
export default Authslice.reducer;

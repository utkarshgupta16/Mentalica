import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {endPoints} from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PATIENT} from '../utils/Strings';
export const getAllMentorList = createAsyncThunk(
  'home/getAllMentorList',
  async () => {
    var config = {
      method: 'get',
      url: endPoints.getAllMentorList,
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const {data, status} = (await axios(config)) || {};
      if (status === 200) {
        return Promise.resolve(data);
      } else {
        return Promise.reject(new Error('Server Error!'));
      }
    } catch (err) {
      console.log('err', err);
      return Promise.reject(new Error(err));
    }
  },
);

export const getTwilloTokenSlice = createAsyncThunk(
  'home/getTwilloTokenSlice',
  async roomId => {
    var config = {
      method: 'get',
      url: `${endPoints.getTwilloToken}?roomId=${roomId}&userName=testing`,
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const {data, status} = (await axios(config)) || {};
      if (status === 200) {
        return Promise.resolve(data);
      } else {
        return Promise.reject(new Error('Server Error!'));
      }
    } catch (err) {
      console.log('err', err);
      return Promise.reject(new Error(err));
    }
  },
);

export const bookAppointmentSlice = createAsyncThunk(
  'home/bookAppointmentSlice',
  async bookData => {
    // let token = await AsyncStorage.getItem('token');
    var config = {
      method: 'post',
      url: endPoints.bookAppointment,
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: bookData,
    };
    return axios(config)
      .then(async response => {
        const {data, status} = response;
        if (status === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error('Server Error!'));
        }
      })
      .catch(err => {
        console.log('err', err);
        return Promise.reject(new Error(err));
      });
  },
);

export const getProfileSlice = createAsyncThunk(
  'home/getProfileSlice',
  async ({email, type}) => {
    // let token = await AsyncStorage.getItem('token');
    var config = {
      method: 'post',
      url:
        type == PATIENT
          ? endPoints.getPatientProfile
          : endPoints.getMentorProfile,
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {emailId: email},
    };
    return axios(config)
      .then(async response => {
        const {data, status} = response;
        if (status === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error('Server Error!'));
        }
      })
      .catch(err => {
        console.log('err', err);
        return Promise.reject(new Error(err));
      });
  },
);

export const getScheduledAppointmentsSlice = createAsyncThunk(
  'home/getScheduledAppointmentsSlice',
  async ({email, fieldName = 'mentorEmailId'}) => {
    // let token = await AsyncStorage.getItem('token');
    console.log('getScheduledAppointmentsSlice==============', {
      [fieldName]: email,
    });
    var config = {
      method: 'post',
      url: endPoints.getScheduledAppointments,
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {[fieldName]: email},
    };
    return axios(config)
      .then(async response => {
        const {data, status} = response;
        console.log('patientEmailId', response);
        if (status === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error('Server Error!'));
        }
      })
      .catch(err => {
        console.log('err', err);
        return Promise.reject(new Error(err));
      });
  },
);

export const getBooksSlots = createAsyncThunk(
  'home/getBooksSlots',
  async ({email}) => {
    // let token = await AsyncStorage.getItem('token');
    var config = {
      method: 'post',
      url: endPoints.getScheduledAppointments,
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {mentorEmailId: email},
    };
    return axios(config)
      .then(async response => {
        const {data, status} = response;
        if (status === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error('Server Error!'));
        }
      })
      .catch(err => {
        console.log('err', err);
        return Promise.reject(new Error(err));
      });
  },
);

const initialState = {
  attributes: {},
  profileData: {},
  isProfileLoading: false,
  scheduledAppointmentsData: [],
  isScheduleLoading: false,
  type: '',
};
const HomeSlice = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {
    setAttributes: (state, action) => {
      state.attributes = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getProfileSlice.pending, state => {
      state.isProfileLoading = true;
    });
    builder.addCase(getProfileSlice.fulfilled, (state, action) => {
      state.isProfileLoading = false;
      state.profileData = action.payload;
    });
    builder.addCase(getProfileSlice.rejected, (state, action) => {
      state.isProfileLoading = false;
      state.profileData = {};
    });
    builder.addCase(getScheduledAppointmentsSlice.pending, state => {
      state.isScheduleLoading = true;
    });
    builder.addCase(
      getScheduledAppointmentsSlice.fulfilled,
      (state, action) => {
        state.isScheduleLoading = false;
        state.scheduledAppointmentsData = action.payload;
      },
    );
    builder.addCase(getScheduledAppointmentsSlice.rejected, (state, action) => {
      state.isScheduleLoading = false;
      state.scheduledAppointmentsData = [];
    });
  },
});

export const {setAttributes} = HomeSlice.actions;
export default HomeSlice.reducer;
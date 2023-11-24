import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {endPoints} from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PATIENT} from '../utils/Strings';
import {FIREBASE_SERVER_KEY} from '@env';
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
  async ({roomId, userName}) => {
    var config = {
      method: 'get',
      url: `${endPoints.getTwilloToken}?roomId=${roomId}&userName=${userName}`,
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

export const editProfileSlice = createAsyncThunk(
  'home/editProfileSlice',
  async updateData => {
    // let token = await AsyncStorage.getItem('token');
    var config = {
      method: 'post',
      url: endPoints.editProfile,
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: updateData,
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

export const sendNotificationSlice = createAsyncThunk(
  'home/sendNotificationSlice',
  async ({fcmToken, data}) => {
    var config = {
      method: 'post',
      url: endPoints.sendNotification,
      headers: {
        Authorization: `key=${FIREBASE_SERVER_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        to: fcmToken,
        data,
      },
    };
    console.log('sendNotificationSlice=========');
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
    if (!type) {
      return;
    }
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
    if (!email) {
      return;
    }
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
    if (!email) {
      return;
    }
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
  isEditProfileLoading: false,
  type: '',
  theme: false,
};
const HomeSlice = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {
    setAttributes: (state, action) => {
      state.attributes = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getProfileSlice.pending, state => {
      state.isProfileLoading = true;
    });
    builder.addCase(getProfileSlice.fulfilled, (state, action) => {
      state.isProfileLoading = false;
      state.profileData = action.payload?.Items[0];
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
    builder.addCase(editProfileSlice.pending, state => {
      state.isEditProfileLoading = true;
    });
    builder.addCase(editProfileSlice.fulfilled, (state, action) => {
      state.isEditProfileLoading = false;
      state.profileData = {
        ...state.profileData,
        ...action.payload?.Attributes,
      };
    });
    builder.addCase(editProfileSlice.rejected, (state, action) => {
      state.isEditProfileLoading = false;
      state.profileData = state.profileData?.Items[0];
    });
  },
});

export const {setAttributes, setTheme} = HomeSlice.actions;
export default HomeSlice.reducer;

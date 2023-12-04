import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {endPoints} from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PATIENT} from '../utils/Strings';
import {FIREBASE_SERVER_KEY} from '@env';

const headerApi = getState => {
  const {userToken: {jwtToken} = {}} = getState().auth;
  return {
    Authorization: `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
  };
};

export const getAllMentorList = createAsyncThunk(
  'home/getAllMentorList',
  async (data, {getState}) => {
    var config = {
      method: 'get',
      url: endPoints.getAllMentorList,
      headers: headerApi(getState),
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

export const getMentorAllSlots = createAsyncThunk(
  'home/getMentorAllSlots',
  async (data, {getState}) => {
    var config = {
      method: 'post',
      url: endPoints.getMentorAvailableSlots,
      headers: headerApi(getState),
      data: data,
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

export const getAllArticlesList = createAsyncThunk(
  'home/getAllArticlesList',
  async (data, {getState}) => {
    var config = {
      method: 'get',
      url: endPoints.getArticleList,
      headers: headerApi(getState),
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
  async ({roomId, userName}, {getState}) => {
    var config = {
      method: 'get',
      url: `${endPoints.getTwilloToken}?roomId=${roomId}&userName=${userName}`,
      headers: headerApi(getState),
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
  async (updateData, {getState}) => {
    // let token = await AsyncStorage.getItem('token');
    var config = {
      method: 'post',
      url: endPoints.editProfile,
      headers: headerApi(getState),
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
  async (bookData, {getState}) => {
    // let token = await AsyncStorage.getItem('token');
    var config = {
      method: 'post',
      url: endPoints.bookAppointment,
      headers: headerApi(getState),
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
  async ({email, type}, {getState}) => {
    if (!type) {
      return;
    }
    // let token = await AsyncStorage.getItem('token');
    var config = {
      method: 'get',
      url: endPoints.getProfile,
      headers: headerApi(getState),
      // data: {emailId: email},
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
  async (data, {getState}) => {
    // let token = await AsyncStorage.getItem('token');
    // if (!email) {
    //   return;
    // }
    var config = {
      method: 'post',
      url: endPoints.getScheduledAppointments,
      headers: headerApi(getState),
      data: data,
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
  async ({email}, {getState}) => {
    if (!email) {
      return;
    }
    // let token = await AsyncStorage.getItem('token');
    var config = {
      method: 'post',
      url: endPoints.getScheduledAppointments,
      headers: headerApi(getState),
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

export const {setAttributes} = HomeSlice.actions;
export default HomeSlice.reducer;

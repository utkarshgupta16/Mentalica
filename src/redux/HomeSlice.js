import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {endPoints} from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PATIENT} from '../utils/Strings';
import {FIREBASE_SERVER_KEY} from '@env';
import {apiMiddleware} from './service';

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
    return apiMiddleware(config);
  },
);

export const getTwilloChatTokenSlice = createAsyncThunk(
  'home/getTwilloChatTokenSlice',
  async (email, {getState}) => {
    const {email: username} = getState().auth;
    var config = {
      method: 'get',
      url: `${endPoints.getTwillioChatAPI}${email || username}`,
      headers: headerApi(getState),
    };
    return apiMiddleware(config);
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

export const deleteConversationSlice = createAsyncThunk(
  'home/deleteConversationSlice',
  async (conversationId, {getState}) => {
    var config = {
      method: 'delete',
      url: endPoints.deleteConversation,
      headers: headerApi(getState),
      data: {conversationId: 'CH23f21958836c4c7e8f8b85a8c38bb379'},
    };
    return apiMiddleware(config);
  },
);

export const updateConversationSlice = createAsyncThunk(
  'home/updateConversationSlice',
  async (data, {getState}) => {
    var config = {
      method: 'post',
      url: endPoints.updateConversation,
      headers: headerApi(getState),
      data: data,
    };
    return apiMiddleware(config);
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
    return apiMiddleware(config);
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

    return apiMiddleware(config);
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
    return apiMiddleware(config);
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
    return apiMiddleware(config);
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
    return apiMiddleware(config);
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
  channels: [],
  chatToken: '',
  isChatTokenLoading: false,
};
const HomeSlice = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {
    setAttributes: (state, action) => {
      state.attributes = action.payload;
    },
    updateChannels: (state, action) => {
      const {
        isUpdate = false,
        isUpdateCount = false,
        newMessage = {},
        channels = [],
      } = action.payload;
      let newChannels = channels;
      if (isUpdate) {
        newChannels = [...state.channels];
        newChannels =
          newChannels.map(channel =>
            channel.id === newMessage?.channelId
              ? {
                  ...channel,
                  lastMessageTime: newMessage?.dateCreated,
                  lastMessageText: newMessage?.body,
                  unreadCount:
                    newMessage.unreadCount || newMessage.unreadCount === 0
                      ? newMessage.unreadCount
                      : channel?.unreadCount,
                }
              : channel,
          ) || [];
      }
      if (isUpdateCount) {
        newChannels = [...state.channels];
        newChannels = newChannels.map(el => {
          if (el.id === newMessage?.channelId) {
            return {
              ...el,
              isOnline:
                newMessage?.isOnline === undefined
                  ? el.isOnline
                  : newMessage?.isOnline,
              unreadCount: 0,
            };
          }
          return el;
        });
      }
      state.channels = newChannels;
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
    builder.addCase(getTwilloChatTokenSlice.pending, state => {
      state.isChatTokenLoading = true;
    });
    builder.addCase(getTwilloChatTokenSlice.fulfilled, (state, action) => {
      state.isChatTokenLoading = false;
      state.chatToken = action?.payload?.accessToken;
    });
    builder.addCase(getTwilloChatTokenSlice.rejected, (state, action) => {
      state.isChatTokenLoading = false;
      state.chatToken = '';
    });
  },
});

export const {setAttributes, updateChannels} = HomeSlice.actions;
export default HomeSlice.reducer;

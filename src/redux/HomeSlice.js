import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {endPoints} from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PATIENT} from '../utils/Strings';
import {FIREBASE_SERVER_KEY} from '@env';
import {Auth} from 'aws-amplify';
import {apiMiddleware} from './service';

const headerApi = (getState, token) => {
  const {userToken: {jwtToken} = {}} = getState().auth;
  // Auth.currentUserCredentials;
  return {
    Authorization: `Bearer ${token || jwtToken}`,
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

export const uploadProfilePhoto = createAsyncThunk(
  'home/uploadProfilePhoto',

  async ({formdata, url}, {getState}) => {
    if (!url) return;
    var requestOptions = {
      method: 'PUT',
      headers: headerApi(getState),
      body: formdata,
    };
    return fetch(url, requestOptions)
      .then(response => {
        if (response.status == 200) {
          return response.text();
        }
        return Promise.reject(response);
      })
      .then(result => {
        let responseResult = result && JSON.parse(result);
        return Promise.resolve(responseResult);
      })
      .catch(err => {
        console.error(err);
      });
  },
);

export const getTwilloChatTokenSlice = createAsyncThunk(
  'home/getTwilloChatTokenSlice',
  async ({email, token}, {getState}) => {
    const {email: username} = getState().auth;
    var config = {
      method: 'get',
      url: `${endPoints.getTwillioChatAPI}${email || username}`,
      headers: headerApi(getState, token),
    };
    return apiMiddleware(config);
  },
);

export const uploadImageToServerSlice = createAsyncThunk(
  'home/uploadImageToServerSlice',
  async ({signedUrl, data}) => {
    try {
      const {status} = await fetch(signedUrl, {
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });

      if (status === 200) {
        return Promise.resolve();
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
  async ({uniqueId}, {getState}) => {
    var config = {
      method: 'get',
      url: `${endPoints.getMentorAvailableSlots}${uniqueId}`,
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

export const getAllArticles = createAsyncThunk(
  'home/getAllArticles',
  async (data, {getState}) => {
    var config = {
      method: 'get',
      url: endPoints.getArticleList,
      headers: headerApi(getState),
    };
    try {
      const {data, status} = (await axios(config)) || {};
      console.log('getArticleList', data);
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

export const getSlotsSlice = createAsyncThunk(
  'home/getSlotsSlice',
  async (date, {getState}) => {
    var config = {
      method: 'get',
      url: `${endPoints.getSlots}${date}`,
      headers: headerApi(getState),
    };
    return apiMiddleware(config);
  },
);

export const getUrlToUploadImage = createAsyncThunk(
  'home/getUrlToUploadImage',
  async (date, {getState}) => {
    var config = {
      method: 'get',
      url: endPoints.getUrlToUploadImage,
      headers: headerApi(getState),
    };
    return apiMiddleware(config);
  },
);

export const getUrlOfProfile = createAsyncThunk(
  'home/getUrlOfProfile',
  async (data, {getState}) => {
    var config = {
      method: 'post',
      url: endPoints.getProfileUrl,
      headers: headerApi(getState),
      data: data,
    };
    return apiMiddleware(config);
  },
);

export const updateSlotsSlice = createAsyncThunk(
  'home/updateSlotsSlice',
  async (data, {getState}) => {
    var config = {
      method: 'post',
      url: endPoints.updateSlots,
      headers: headerApi(getState),
      data: data,
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
let timestamp = Date.now();
const initialState = {
  attributes: {},
  profileData: {},
  isProfileLoading: false,
  scheduledAppointmentsData: [],
  isScheduleLoading: false,
  isEditProfileLoading: false,
  type: '',
  darkMode: false,
  isArticleDataLoading: false,
  articleData: [],

  isMentorsDataLoading: false,
  mentorsData: [],
  channels: [],
  chatToken: '',
  isChatTokenLoading: false,
  rangeDate: {
    startDate: timestamp,
    endDate: timestamp,
  },
  slots: [],
  slotsData: [],
  isSlotsLoading: false,
  threeDaysSlots: [],
  threeDaysSlotLoading: false,
  currentLanguage: 'en',
  urlForImageUpload: '',
  loadingUploadUrl: false,
  selectedProfileImagePath: '',
  profileImageUrl: '',
  loadingProfileImageUrl: false,
  isImageLoading: false,
};
const HomeSlice = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {
    setAttributes: (state, action) => {
      state.attributes = action.payload;
    },
    changeTheme: (state, action) => {
      state.darkMode = action.payload;
    },
    languageChange: (state, action) => {
      state.currentLanguage = action.payload;
    },

    updateOnLogout: (state, action) => initialState,
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
    setSelectedProfileImagePath: (state, action) => {
      state.selectedProfileImagePath = action.payload;
    },
    setRangeDate: (state, action) => {
      state.rangeDate = action.payload;
    },

    addSlots: (state, action) => {
      state.slots = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getUrlOfProfile.pending, state => {
      state.loadingProfileImageUrl = true;
    });
    builder.addCase(getUrlOfProfile.fulfilled, (state, action) => {
      state.loadingProfileImageUrl = false;
      state.profileImageUrl = action.payload?.url;
    });
    builder.addCase(getUrlOfProfile.rejected, (state, action) => {
      state.loadingProfileImageUrl = false;
    });

    builder.addCase(getUrlToUploadImage.pending, state => {
      state.loadingUploadUrl = true;
    });
    builder.addCase(getUrlToUploadImage.fulfilled, (state, action) => {
      state.loadingUploadUrl = false;
      state.urlForImageUpload = action.payload?.url;
    });
    builder.addCase(getUrlToUploadImage.rejected, (state, action) => {
      state.loadingUploadUrl = false;
    });
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

    builder.addCase(getMentorAllSlots.pending, state => {
      state.threeDaysSlotLoading = true;
    });
    builder.addCase(getMentorAllSlots.fulfilled, (state, action) => {
      state.threeDaysSlotLoading = false;
      state.threeDaysSlots = action.payload?.Items;
    });
    builder.addCase(getMentorAllSlots.rejected, (state, action) => {
      state.threeDaysSlotLoading = false;
      state.threeDaysSlots = [];
    });

    builder.addCase(getSlotsSlice.pending, state => {
      state.isSlotsLoading = true;
    });
    builder.addCase(getSlotsSlice.fulfilled, (state, action) => {
      state.isSlotsLoading = false;
      state.slots = action.payload?.Items[0]?.slots;
    });
    builder.addCase(getSlotsSlice.rejected, (state, action) => {
      state.isSlotsLoading = false;
      state.slots = [];
    });

    builder.addCase(getAllArticles.pending, state => {
      state.isArticleDataLoading = true;
    });

    builder.addCase(getAllArticles.fulfilled, (state, action) => {
      state.isArticleDataLoading = false;
      state.articleData = action.payload;
    });

    builder.addCase(getAllArticles.rejected, (state, action) => {
      state.isArticleDataLoading = false;
      state.articleData = [];
    });

    builder.addCase(getAllMentorList.pending, (state, action) => {
      state.isMentorsDataLoading = true;
    });
    builder.addCase(getAllMentorList.fulfilled, (state, action) => {
      state.isMentorsDataLoading = false;
      state.mentorsData = action.payload.Items;
    });
    builder.addCase(getAllMentorList.rejected, (state, action) => {
      state.isMentorsDataLoading = false;
    });

    builder.addCase(getScheduledAppointmentsSlice.pending, state => {
      state.isScheduleLoading = true;
      state.scheduledAppointmentsData = state.scheduledAppointmentsData;
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

    builder.addCase(uploadImageToServerSlice.pending, state => {
      state.isImageLoading = true;
    });
    builder.addCase(uploadImageToServerSlice.fulfilled, (state, action) => {
      state.isImageLoading = false;
    });
    builder.addCase(uploadImageToServerSlice.rejected, (state, action) => {
      state.isImageLoading = false;
    });
  },
});

export const {
  setAttributes,
  updateChannels,
  changeTheme,
  updateOnLogout,
  setRangeDate,
  addSlots,
  languageChange,
  setSelectedProfileImagePath,
} = HomeSlice.actions;
export default HomeSlice.reducer;

// import {configureStore} from '@reduxjs/toolkit';

// import authReducer from './AuthSlice';
// import homeReducer from './HomeSlice';
// import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     home: homeReducer,
//   },
// });

// export default store;

import {configureStore} from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import homeReducer from './HomeSlice';
import participatReducer from './ParticipatSlice';
import ConvoSlice from './ConvoSlice';
import TypingDataSlice from './TypingDataSlice';
import CurrentConvoReducer from './CurrentConvoReducer';
import UnReadMessageCountSlice from './UnReadMessageCountSlice';
import AttachmentSlice from './AttachmentSlice';
import logger from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import Reactotron from '../../ReactotronConfig.js';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const reducers = combineReducers({
  auth: authReducer,
  home: homeReducer,
  participants: participatReducer,
  conversations: ConvoSlice,
  typingData: TypingDataSlice,
  unreadMessage: UnReadMessageCountSlice,
  currentConversation: CurrentConvoReducer,
  attachments: AttachmentSlice,
});

const persistConfig = {
  key: 'root',
  // devTools: process.env.NODE_ENV !== 'production',
  version: 1,
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

let configureStoreObj = {
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
};

if (__DEV__) {
  configureStoreObj = {
    ...configureStoreObj,
    enhancers: [Reactotron.createEnhancer()],
  };
}
export const store = configureStore(configureStoreObj);

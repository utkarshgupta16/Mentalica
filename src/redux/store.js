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
  participants:participatReducer
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
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
};

if (__DEV__) {
  configureStoreObj = {
    ...configureStoreObj,
    enhancers: [Reactotron.createEnhancer()],
  };
}
export const store = configureStore(configureStoreObj);

import {configureStore} from '@reduxjs/toolkit';

import authReducer from './AuthSlice';
import homeReducer from './HomeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
  },
});

export default store;

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import MentorSignUp from './SignUp';
import {FORGOT_PASSWORD, LOGIN, MENTOR_SIGN_UP} from '../utils/route';
import ForgotPassword from './ForgotPassword';
import SignUp from './signUp/SignUp.js';

const Auth = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Auth.Navigator initialRouteName={LOGIN}>
      <Auth.Screen
        name={LOGIN}
        component={Login}
        options={{header: () => false}}
      />
      <Auth.Screen
        name={FORGOT_PASSWORD}
        component={ForgotPassword}
        // options={{header: () => false}}
      />
      <Auth.Screen
        name={MENTOR_SIGN_UP}
        component={SignUp}
        options={{header: () => false}}
      />
    </Auth.Navigator>
  );
}

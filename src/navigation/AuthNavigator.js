import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import MentorSignUp from './SignUp';
import {LOGIN, MENTOR_SIGN_UP} from '../utils/route';

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
        name={MENTOR_SIGN_UP}
        component={MentorSignUp}
        options={{header: () => false}}
      />
    </Auth.Navigator>
  );
}

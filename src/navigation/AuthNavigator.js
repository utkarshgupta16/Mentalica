import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login'
import AskClient from './AskClient';
import PatientSignUp from './signUp/PatientSignUp';
import MentorSignUp from './signUp/MentorSignUp';

const Auth = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Auth.Navigator initialRouteName="AskClient">
      <Auth.Screen
        name="Login"
        component={Login}
        options={{header: () => false}}
      />
      <Auth.Screen
        name="PatientSignUp"
        component={PatientSignUp}
        options={{header: () => false}}
      />
      <Auth.Screen
        name="MentorSignUp"
        component={MentorSignUp}
        options={{header: () => false}}
      />
    </Auth.Navigator>
  );
}

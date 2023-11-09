import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Login from './Login';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeNavigator from './HomeNavigator';
import AskClient from './AskClient';
import {useSelector} from 'react-redux';
import PatientSignUp from './signUp/PatientSignUp';
import MentorSignUp from './signUp/MentorSignUp';
import AuthNavigator from './AuthNavigator';
import {Text} from 'react-native';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  console.log('isLoggedIn', isLoggedIn);
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="SplashScreen">
      <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainRoute"
          component={isLoggedIn ? HomeNavigator : AuthNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
     
    </NavigationContainer>
  );
};

export default MainNavigator;

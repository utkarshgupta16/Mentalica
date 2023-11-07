import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Login from './Login';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeNavigator from './HomeNavigator';
import AskClient from './AskClient';
import {useSelector} from 'react-redux';
import SignUp from './SignUp';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator 
      // initialRouteName='MainRoute'
      >
        <Stack.Screen
          name="AskClient"
          component={AskClient}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainRoute"
          component={isLoggedIn ? HomeNavigator : Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Login from './AuthNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeNavigator from './HomeNavigator';
import AskClient from './AskClient';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const isLoggedIn = false;

  return (
    <NavigationContainer>
      <Stack.Navigator>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;

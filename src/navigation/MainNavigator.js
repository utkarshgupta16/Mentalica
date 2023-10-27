import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeNavigator from './HomeNavigator';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const isLoggedIn = true;

  return (
    <NavigationContainer>
      <Stack.Navigator>
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

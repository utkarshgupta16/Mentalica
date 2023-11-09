import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeNavigator from './HomeNavigator';
import {useSelector} from 'react-redux';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  console.log('isLoggedIn', isLoggedIn);
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

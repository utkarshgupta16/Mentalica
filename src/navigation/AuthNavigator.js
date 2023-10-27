import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import Login from '../Auth/Login';
import Login from '../auth/Login';

const Auth = createNativeStackNavigator();

const AuthNavigator = () => {
  //   return <Text>Hello World!</Text>;
  return (
    <Auth.Navigator>
      <Auth.Screen
        name="Login"
        component={Login}
        //options={{Header: () => false}}
        options={{headerShown: false}}
      />
    </Auth.Navigator>
  );
};

export default AuthNavigator;

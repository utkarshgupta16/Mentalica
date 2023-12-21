import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import MentorSignUp from './SignUp';
import {
  ADD_SLOTS,
  ADD_SLOTS_SCREEN,
  ADD_SLOTS_SIGNUP_SCREEN,
  FORGOT_PASSWORD,
  LOGIN,
  MENTOR_SIGN_UP,
} from '../utils/route';
import ForgotPassword from './ForgotPassword';
import SignUp from './signUp/SignUp.js';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import Colors from '../customs/Colors';
import {Text, TouchableOpacity} from 'react-native';
import AddSlotsMentor from './signUp/AddSlotsMentor';

const Auth = createNativeStackNavigator();

export default function AuthNavigator() {
  const {darkMode} = useSelector(state => state.home);
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
        options={({navigation}) => ({
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row'}}>
              <MaterialIcons
                name="arrow-back-ios"
                size={16}
                color={darkMode ? Colors.white : Colors.grey}
              />
              <Text style={{color: darkMode ? '#fff' : '#000'}}>Login</Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        })}
      />

      <Auth.Screen
        name={MENTOR_SIGN_UP}
        component={SignUp}
        options={({navigation}) => ({
          title: '',
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row'}}>
              <MaterialIcons
                name="arrow-back-ios"
                size={16}
                color={darkMode ? Colors.white : Colors.grey}
              />
              <Text style={{color: darkMode ? '#fff' : '#000'}}>Login</Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: true,
        })}
      />
      <Auth.Screen
        name={ADD_SLOTS_SIGNUP_SCREEN}
        component={AddSlotsMentor}
        options={({navigation}) => ({
          headerShadowVisible: false,

          title: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row'}}>
              <MaterialIcons
                name="arrow-back-ios"
                size={16}
                color={darkMode ? Colors.white : Colors.black}
              />
              {/* <Text style={{color: darkMode ? '#fff' : '#000'}}>Signup</Text> */}
            </TouchableOpacity>
          ),
        })}
      />
    </Auth.Navigator>
  );
}

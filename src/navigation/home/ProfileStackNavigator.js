import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../customs/Colors';
import {TouchableOpacity, Text, Platform} from 'react-native';
import {heightPercentageToDP as hp} from '../../utils/Responsive';
import {PROFILE} from '../../utils/route';
import Profile from './Profile';
import EditProfile from './EditProfile';
const {createNativeStackNavigator} = require('@react-navigation/native-stack');
const Stack = createNativeStackNavigator();
const ProfileStackNavigator = () => {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName={PROFILE}>
      <Stack.Screen
        name={PROFILE}
        component={Profile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="EditProfilePatient"
        component={EditProfile}
        options={({navigation}) => ({
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row'}}>
              <MaterialIcons
                name="arrow-back-ios"
                size={16}
                color={Colors.grey}
              />
              <Text>Edit Profile</Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        })}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default ProfileStackNavigator;

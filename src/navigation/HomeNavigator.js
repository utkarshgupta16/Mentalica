import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './home/Home';
import Messages from './home/Messages';
import Profile from './home/Profile';
import {useSelector} from 'react-redux';
import Stats from './home/Stats';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserIcon from '../icons/user.svg';
// import {MaterialIcons} from '@expo/vector-icons';
import {
  HOME,
  INVOICING,
  MENTOR,
  MESSAGES,
  PROFILE,
  STATS,
} from '../utils/Strings';
import Invoicing from '../components/mentorScreens/invoicing/Invoicing';
import PatientStats from '../components/patientScreens/patientStats/PatientStats';
import Colors from '../customs/Colors';
import MentorDashboard from '../components/mentorScreens/mentorDashboard/MentorDashboard';
import PatientDashboard from '../components/patientScreens/patientDashboard/PatientDashboard';

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  const {type} = useSelector(state => state.auth);

  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarActiveTintColor: Colors.darkPaleMintColor,
        tabBarInactiveTintColor: Colors.darkPaleMintColor,
      }}>
      {type === MENTOR ? (
        <Tab.Screen
          name={HOME}
          component={MentorDashboard}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name={HOME}
          component={PatientDashboard}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
      )}
      {type === MENTOR ? (
        <Tab.Screen
          name={INVOICING}
          component={Invoicing}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="analytics" size={26} color={color} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name={STATS}
          component={PatientStats}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="analytics" size={25} color={color} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name={MESSAGES}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="message" size={25} color={color} />
          ),
        }}
        component={Messages}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name={'person'} size={30} color={color} />
          ),
        }}
        name={PROFILE}
        component={Profile}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;

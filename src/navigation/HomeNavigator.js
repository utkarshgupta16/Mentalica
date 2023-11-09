import React from 'react';
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
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  const {t} = useTranslation();
  const {loginFrom} = useSelector(state => state.auth);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.accentColor,
      }}
      initialRouteName={HOME}>
      <Tab.Screen
        name={t(HOME)}
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      {loginFrom === MENTOR ? (
        <Tab.Screen
          name={t(INVOICING)}
          component={Invoicing}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name={t(STATS)}
          component={PatientStats}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name={t(MESSAGES)}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="message" size={size} color={color} />
          ),
        }}
        component={Messages}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => <UserIcon size={size} color={color} />,
        }}
        name={t(PROFILE)}
        component={Profile}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;

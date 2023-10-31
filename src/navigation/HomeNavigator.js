import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './home/Home';
import Invoicing from './home/Invoicing';
import Messages from './home/Messages';
import Profile from './home/Profile';
import {useSelector} from 'react-redux';
import Stats from './home/Stats';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {MaterialIcons} from '@expo/vector-icons';
import {
  HOME,
  INVOICING,
  MENTOR,
  MESSAGES,
  PROFILE,
  STATS,
} from '../utils/Strings';

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  const {loginFrom} = useSelector(state => state.auth);

  return (
    <Tab.Navigator initialRouteName={HOME}>
      <Tab.Screen
        name={HOME}
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      {loginFrom === MENTOR ? (
        <Tab.Screen name={INVOICING} component={Invoicing} />
      ) : (
        <Tab.Screen name={STATS} component={Stats} />
      )}
      <Tab.Screen name={MESSAGES} component={Messages} />
      <Tab.Screen name={PROFILE} component={Profile} />
    </Tab.Navigator>
  );
};

export default HomeNavigator;

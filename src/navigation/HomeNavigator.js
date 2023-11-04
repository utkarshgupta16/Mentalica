import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './home/Home';
import Invoicing from './home/Invoicing';
import Messages from './home/Messages';
import Profile from './home/Profile';
import {useSelector} from 'react-redux';
import Stats from './home/Stats';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserIcon from '../icons/user.svg';
// import {MaterialIcons} from '@expo/vector-icons';
import {MENTOR} from '../utils/strings';
import {HOME, INVOICING, MESSAGES, PROFILE, STATS} from '../utils/route';
import Colors from '../customs/Colors';

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  const {loginFrom} = useSelector(state => state.auth);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.accentColor,
      }}
      initialRouteName={HOME}>
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
      <Tab.Screen
        name={MESSAGES}
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
        name={PROFILE}
        component={Profile}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;

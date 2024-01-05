import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Home from './home/Home';
// import Messages from './home/Messages';
// import Profile from './home/Profile';
import {useSelector} from 'react-redux';
// import Stats from './home/Stats';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserIcon from '../icons/user.svg';
import convertLang, {MENTOR} from '../utils/Strings';
import Invoicing from '../components/mentorScreens/invoicing/Invoicing';
import PatientStats from '../components/patientScreens/patientStats/PatientStats';
import Colors from '../customs/Colors';
import {useTranslation} from 'react-i18next';
import MentorDashboard from '../components/mentorScreens/mentorDashboard/MentorDashboard';
import PatientDashboard from '../components/patientScreens/patientDashboard/PatientDashboard';
import AVChatScreen from './home/AVChatScreen';
import {Text, Platform, Pressable} from 'react-native';
import {heightPercentageToDP as hp} from '../utils/Responsive';
import {
  MESSAGES_TAB_ROUTE,
  PROFILE_TAB_ROUTE,
  CHATS_SCREENS,
  CHAT_ROOM_SCREEN,
  CHATS_SCREEN,
} from '../utils/route';
import ProfileStackNavigator from './home/ProfileStackNavigator';
import MessagesStackNavigator from './home/MessagesStackNavigator';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
const {createNativeStackNavigator} = require('@react-navigation/native-stack');

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const resetSubmitStackOnTabPress = ({navigation, route}) => ({
  tabPress: e => {
    const state = navigation.getState();

    if (state) {
      const nonTargetTabs = state.routes.filter(r => r.key !== e.target);

      nonTargetTabs.forEach(tab => {
        const tabName = tab?.name;
        const stackKey = tab?.state?.key;

        if (stackKey && tabName === MESSAGES_TAB_ROUTE) {
          navigation.dispatch({
            // ...StackActions.popToTop(),
            target: stackKey,
          });
        }
      });
    }
  },
});

const renderTabTitle = (isFocused, tabName) => {
  const color = isFocused ? 'teal' : '#89B9AD';
  const title = isFocused ? (
    <Text
      style={{
        color,
        fontSize: 12,
        fontWeight: '700',
      }}>
      {tabName}
    </Text>
  ) : (
    <Text
      style={{
        color,
        fontSize: 12,
        fontWeight: '400',
      }}>
      {tabName}
    </Text>
  );
  return title;
};

const videoCallAV = navigation => {
  return (
    <Stack.Screen
      name="AVChatScreen"
      component={AVChatScreen}
      options={{
        title: '',
        headerLeft: () => {
          return (
            <Pressable onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back-ios" size={16} color={'black'} />
            </Pressable>
          );
        },
      }}
    />
  );
};

const MentorDashboardStack = ({navigation}) => {
  return (
    // <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="MentorDashboard"
        component={MentorDashboard}
        options={{headerShown: false}}
      />
      {videoCallAV(navigation)}
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const PatientDashboardStack = ({navigation}) => {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="PatientDashboard">
      <Stack.Screen
        name="PatientDashboard"
        component={PatientDashboard}
        options={{headerShown: false}}
      />
      {videoCallAV(navigation)}
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const childRouteName = navigation => {
  const {index, routes = []} = navigation.getState();
  const {
    state: {index: childIndex = undefined, routes: childRoutes = []} = {},
  } = routes[index];
  let childName = '';
  if (childIndex) {
    const {name} = childRoutes[childIndex];
    childName = name;
  }
  return childName;
};

const HomeNavigator = () => {
  const {t} = useTranslation();
  const {HOME, INVOICING, PROFILE, STATS, INVOICE, MESSAGES} = convertLang(t);
  const {loginFrom} = useSelector(state => state.auth);
  const {type} = useSelector(state => state.auth);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        unmountOnBlur: true,
        headerShown: false,
        tabBarStyle:
          Platform.OS === 'android'
            ? {
                height: hp(7),
                paddingBottom: hp(1),
              }
            : null,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: 'teal',
        tabBarInactiveTintColor: '#89B9AD',
      })}>
      {type === MENTOR ? (
        <Tab.Screen
          name={HOME}
          component={MentorDashboardStack}
          options={({navigation}) => {
            return {
              tabBarIcon: ({color, size}) => (
                <MaterialIcons name="home" size={size} color={color} />
              ),
              tabBarLabel: ({focused}) => {
                return renderTabTitle(focused, HOME);
              },
              tabBarStyle: {
                display:
                  childRouteName(navigation) === 'AVChatScreen'
                    ? 'none'
                    : 'flex',
              },
            };
          }}
        />
      ) : (
        <Tab.Screen
          name={HOME}
          component={PatientDashboardStack}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
            tabBarLabel: ({focused}) => {
              return renderTabTitle(focused, HOME);
            },
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
            tabBarLabel: ({focused}) => {
              return renderTabTitle(focused, INVOICE);
            },
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
            tabBarLabel: ({focused}) => {
              return renderTabTitle(focused, STATS);
            },
          }}
        />
      )}
      <Tab.Screen
        name={MESSAGES_TAB_ROUTE}
        options={({navigation}) => {
          return {
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="message" size={25} color={color} />
            ),
            tabBarLabel: ({focused}) => {
              return renderTabTitle(focused, 'Messages');
            },
            tabBarStyle: {
              display:
                childRouteName(navigation) === CHAT_ROOM_SCREEN ||
                childRouteName(navigation) === 'DocViewer'
                  ? 'none'
                  : 'flex',
            },
          };
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(MESSAGES_TAB_ROUTE);
          },
        })}
        component={MessagesStackNavigator}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name={'person'} size={30} color={color} />
          ),
          tabBarLabel: ({focused}) => {
            return renderTabTitle(focused, PROFILE);
          },
        }}
        name={PROFILE_TAB_ROUTE}
        component={ProfileStackNavigator}
      />
    </Tab.Navigator>
  );
};

const getRouteName = route => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName?.includes(CHATS_SCREEN)) {
    return 'none';
  }
  return 'flex';
};

export default HomeNavigator;

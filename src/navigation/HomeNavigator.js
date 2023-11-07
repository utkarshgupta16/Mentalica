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
import {getCurrentUserInfo} from '../AWS/AWSConfiguration';
import MentorDashboard from '../components/mentorScreens/mentorDashboard/MentorDashboard';
import PatientDashboard from '../components/patientScreens/patientDashboard/PatientDashboard';
import {ActivityIndicator, View} from 'react-native';
import {Text} from 'react-native-svg';

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  const {loginFrom} = useSelector(state => state.auth);

  const [currentUserInfo, setCurrentUserInfo] = useState({str: ''});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const currentUserInfo = await getCurrentUserInfo();
      setLoading(false);
      setCurrentUserInfo({str: currentUserInfo?.attributes['custom:type']});
    })();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}>
        <Text>
          <ActivityIndicator size="large" color="#0000ff" />;
        </Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.accentColor,
      }}>
      {currentUserInfo.str === MENTOR ? (
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
      {currentUserInfo.str === MENTOR ? (
        <Tab.Screen
          name={INVOICING}
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
          name={STATS}
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

import React from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {MENTOR} from '../../utils/Strings';
import MentorDashboard from '../../components/mentorScreens/mentorDashboard/MentorDashboard';
import PatientDashboard from '../../components/patientScreens/patientDashboard/PatientDashboard';
import AVChatScreen from './AVChatScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const MentorDashboardStack = () => {
  return (
    // <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="MentorDashboard"
        component={MentorDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AVChatScreen"
        component={AVChatScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const PatientDashboardStack = () => {
  return (
    // <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="PatientDashboard"
        component={PatientDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AVChatScreen"
        component={AVChatScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const Home = () => {
  const {loginFrom} = useSelector(state => state.auth);
  return (
    <View style={{flex: 1}}>
      {loginFrom === MENTOR ? (
        <MentorDashboardStack />
      ) : (
        <PatientDashboardStack />
      )}
    </View>
  );
};

export default Home;

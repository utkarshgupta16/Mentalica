import React from 'react';
import {useSelector} from 'react-redux';
import MentorDashboard from '../components/mentorScreens/mentorDashboard/MentorDashboard';
import PatientDashboard from '../components/patientScreens/patientDashboard/PatientDashboard';
import {HOME, MENTOR} from '../utils/Strings';
const {createNativeStackNavigator} = require('@react-navigation/native-stack');

const Stack = createNativeStackNavigator();
export default function HomeStackNavigator() {
  const {loginFrom} = useSelector(state => state.auth);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={HOME}
        component={
          loginFrom === MENTOR ? <MentorDashboard /> : <PatientDashboard />
        }
        options={{
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
}

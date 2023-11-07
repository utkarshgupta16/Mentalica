import React from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {MENTOR} from '../../utils/Strings';
import MentorDashboard from '../../components/mentorScreens/mentorDashboard/MentorDashboard';
import PatientDashboard from '../../components/patientScreens/patientDashboard/PatientDashboard';

const Home = () => {
  const {loginFrom} = useSelector(state => state.auth);
  return (
    <View style={{flex: 1}}>
      {loginFrom === MENTOR ? <MentorDashboard /> : <PatientDashboard />}
    </View>
  );
};

export default Home;

import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {styles} from './patientDashboardStyle';
import PatientDashboardTabs from '../../PatientDashboardTabs';
import {
  ALL,
  APPOINMENTS,
  ARTICLES,
  MENTORS_LIST,
  SAVED,
} from '../../../utils/Strings';
import MentorsList from '../../mentorScreens/MentorsList';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileSlice} from '../../../redux/HomeSlice';
import {articlesData} from '../../../utils/default';
import TabComponent from './TabComponent';
import AppointmentList from './AppointmentList';
import AllTabComponent from './AllTabComponent';

const PatientDashboard = ({navigation}) => {
  const components = {
    [ALL]: <AllTabComponent />,
    [APPOINMENTS]: <AppointmentList navigation={navigation} />,
    [ARTICLES]: (
      <Text
        style={{
          textAlign: 'center',
        }}>
        {' '}
        No data found
      </Text>
    ),
    [SAVED]: (
      <Text
        style={{
          textAlign: 'center',
        }}>
        {' '}
        No data found
      </Text>
    ),
    [MENTORS_LIST]: <MentorsList />,
  };
  const {email, type} = useSelector(state => state.auth);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINMENTS});
  const [mentorName, setMentorName] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await dispatch(getProfileSlice({email, type: type}));
      setMentorName(res?.payload?.Items[0]?.firstName);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Hello {mentorName}</Text>
      {/* <Text style={styles.dateText}>4th April overview</Text> */}
      {/* Tabs */}
      <TabComponent selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {components[selectedTab.tabStr]}
    </View>
  );
};

export default PatientDashboard;

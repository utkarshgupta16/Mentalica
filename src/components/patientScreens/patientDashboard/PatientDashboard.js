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
import convertLang from '../../../utils/Strings';
import MentorsList from '../../mentorScreens/MentorsList';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileSlice} from '../../../redux/HomeSlice';
import {articlesData} from '../../../utils/default';
import TabComponent from './TabComponent';
import AppointmentList from './AppointmentList';
import AllTabComponent from './AllTabComponent';
import {useTranslation} from 'react-i18next';
import ContactsScreen from '../../../screens/ContactScreen';

const PatientDashboard = ({navigation}) => {

  const {t} = useTranslation();
  const {
    ALL,
    APPOINTMENTS,
    ARTICLES,
    HELLO,
    MENTORS_LIST,
    NO_DATA_FOUND,
    SAVED,
  } = convertLang(t);
  const components = {
    [ALL]: <AllTabComponent />,
    [APPOINTMENTS]: <AppointmentList navigation={navigation} />,
    [ARTICLES]: (
      <Text
        style={{
          textAlign: 'center',
        }}>
        {NO_DATA_FOUND}
      </Text>
    ),
    [SAVED]: (
      <Text
        style={{
          textAlign: 'center',
        }}>
        {NO_DATA_FOUND}
      </Text>
    ),
    [MENTORS_LIST]: <MentorsList navigation={navigation} />,
  };
  const {email, type} = useSelector(state => state.auth);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINTMENTS});
  const [patientName, setPatientName] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const res = await dispatch(getProfileSlice({email, type: type}));
      setPatientName(res?.payload?.Items[0]?.firstName);
    })();
  }, [email, type]);

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>
        {HELLO} {patientName}
      </Text>
      {/* <Text style={styles.dateText}>4th April overview</Text> */}
      {/* Tabs */}
      <TabComponent selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {components[selectedTab.tabStr]}
    </View>
  );
};

export default PatientDashboard;

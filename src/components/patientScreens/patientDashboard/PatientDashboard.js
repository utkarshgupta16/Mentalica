import Text from '../../wrapperComponent/TextWrapper.js';
import View from '../../wrapperComponent/ViewWrapper.js';
import React, {useEffect, useState} from 'react';
import {styles} from './patientDashboardStyle';
import convertLang from '../../../utils/Strings';
import MentorsList from '../../mentorScreens/MentorsList';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileSlice} from '../../../redux/HomeSlice';

import TabComponent from './TabComponent';
import AppointmentList from './AppointmentList';
import AllTabComponent from './AllTabComponent';
import {useTranslation} from 'react-i18next';
import ArticlesList from './ArticlesList.js';

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

  const {userToken} = useSelector(state => state.home);

  const components = {
    [ALL]: <AllTabComponent />,
    [APPOINTMENTS]: <AppointmentList navigation={navigation} />,
    [ARTICLES]: <ArticlesList navigation={navigation} />,

    [SAVED]: (
      <Text
        style={{
          textAlign: 'center',
        }}>
        {NO_DATA_FOUND}
      </Text>
    ),
    [MENTORS_LIST]: <MentorsList />,
  };
  const {email, type} = useSelector(state => state.auth);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINTMENTS});
  const [patientName, setPatientName] = useState('');

  const {jwtToken} = useSelector(state => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const res = await dispatch(
        getProfileSlice({email, type: type, jwtToken}),
      );
      setPatientName(res?.payload?.Items[0]?.firstName);
    })();
  }, [email, type, dispatch, jwtToken]);

  const {darkMode} = useSelector(state => state.home);

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 9,
          borderWidth: darkMode ? 1 : 0,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          borderColor: 'gray',
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 3,
        }}>
        <Image
          source={{uri: item.image}}
          style={{
            width: '30%',
            height: 100,
            resizeMode: 'cover',
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        />

        <View
          style={{
            width: '69%',
            paddingHorizontal: 10,
            justifyContent: 'center',
            backgroundColor: Colors.paleMintColor,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: '700'}}>{item.title}</Text>
          <Text style={{marginTop: 10}}>{item.author}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>
        {HELLO}, {patientName}
      </Text>
      {/* <Text style={styles.dateText}>4th April overview</Text> */}
      {/* Tabs */}
      <TabComponent selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {components[selectedTab.tabStr]}
    </View>
  );
};

export default PatientDashboard;

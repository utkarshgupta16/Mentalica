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
import {Auth} from 'aws-amplify';

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

  const [isShadowVisible, setIsShadowVisible] = useState(false);

  const handleShadowVisible = isShadowVisible => {
    setIsShadowVisible(isShadowVisible);
  };

  const components = {
    [ALL]: <AllTabComponent handleShadowVisible={handleShadowVisible} />,
    [APPOINTMENTS]: (
      <AppointmentList
        handleShadowVisible={handleShadowVisible}
        navigation={navigation}
      />
    ),
    [ARTICLES]: (
      <ArticlesList
        handleShadowVisible={handleShadowVisible}
        navigation={navigation}
      />
    ),

    [SAVED]: (
      <Text
        style={{
          textAlign: 'center',
        }}>
        {NO_DATA_FOUND}
      </Text>
    ),
    [MENTORS_LIST]: <MentorsList handleShadowVisible={handleShadowVisible} />,
  };
  const {email, type} = useSelector(state => state.auth);
  const {darkMode, profileData = {}} = useSelector(state => state.home);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINTMENTS});

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (Object.keys(profileData).length == 0) {
        await dispatch(getProfileSlice({email, type: type}));
      }
    })();
  }, [profileData]);

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>
        {HELLO}, {profileData?.firstName}
      </Text>
      <TabComponent
        isShadowVisible={isShadowVisible}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {components[selectedTab.tabStr]}
    </View>
  );
};

export default PatientDashboard;

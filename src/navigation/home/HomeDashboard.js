import React, {useEffect, useState} from 'react';
import {styles} from './homeDashboardStyle';
import convertLang, {MENTOR} from '../../utils/Strings';
import View from '../../components/wrapperComponent/ViewWrapper';
import Text from '../../components/wrapperComponent/TextWrapper';
import MentorsList from '../../components/mentorScreens/MentorsList';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileSlice} from '../../redux/HomeSlice';
import TabComponent from './TabComponent';
import AppointmentList from './AppointmentList';
import AllTabComponent from './AllTabComponent';
import {useTranslation} from 'react-i18next';
import ArticlesList from './ArticlesList.js';
import {View as ViewComponent} from 'react-native';
import {TabContentLoading} from '../../components/SkeletonContentLoading';
import Colors from '../../customs/Colors';

const tabsWidth = {
  0: 50,
  1: 100,
  2: 70,
  3: 60,
  4: 80,
};
const HomeDashboard = ({navigation}) => {
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
  const [isMe, setProfileMe] = useState(false);

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
      <View style={styles.notDataFoundContainer}>
        <Text style={styles.notDataFound}>{NO_DATA_FOUND}</Text>
      </View>
    ),
    [MENTORS_LIST]: (
      <MentorsList
        handleShadowVisible={handleShadowVisible}
        navigation={navigation}
      />
    ),
  };
  const {email, type} = useSelector(state => state.auth);
  const {darkMode, profileData = {}} = useSelector(state => state.home);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINTMENTS});

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (Object.keys(profileData).length === 0) {
        try {
          setProfileMe(true);
          await dispatch(getProfileSlice({email, type: type}));
          setProfileMe(false);
        } catch (er) {
          setProfileMe(false);
        }
      }
    })();
  }, [email, type, dispatch]);

  return (
    <View style={styles.container}>
      <>
        {isMe ? (
          <ViewComponent style={{flexDirection: 'row', marginVertical: 10}}>
            <TabContentLoading height={20} length={2} tabsWidth={tabsWidth} />
          </ViewComponent>
        ) : (
          <Text style={styles.helloText}>
            {HELLO}, {profileData?.firstName}
          </Text>
        )}

        {type === MENTOR ? null : isMe ? (
          <ViewComponent style={styles.loadingText}>
            <TabContentLoading rx={15} length={5} tabsWidth={tabsWidth} />
          </ViewComponent>
        ) : (
          <TabComponent
            isShadowVisible={isShadowVisible}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}
        {components[selectedTab.tabStr]}
      </>
    </View>
  );
};

export default HomeDashboard;

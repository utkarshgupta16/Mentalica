import {FlatList, Image} from 'react-native';
import Text from '../../wrapperComponent/TextWrapper.js';
import View from '../../wrapperComponent/ViewWrapper.js';
import React, {useEffect, useState} from 'react';
import {styles} from './patientDashboardStyle';
import PatientDashboardTabs from '../../PatientDashboardTabs';
import convertLang from '../../../utils/Strings';
import MentorsList from '../../mentorScreens/MentorsList';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileSlice} from '../../../redux/HomeSlice';
import Colors from '../../../customs/Colors';
import {articlesData} from '../../../utils/default';
import TabComponent from './TabComponent';
import AppointmentList from './AppointmentList';
import AllTabComponent from './AllTabComponent';
import {useTranslation} from 'react-i18next';

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
  }, [email, type]);

  const {darkMode} = useSelector(state => state.home);

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>
        {HELLO}, {patientName}
      </Text>
      {/* <Text style={styles.dateText}>4th April overview</Text> */}
      {/* Tabs */}
      {
        <View style={styles.tabs}>
          <PatientDashboardTabs
            selectedTab={selectedTab}
            title={ALL}
            tab={ALL}
            onPress={() => {
              setSelectedTab({tabStr: ALL});
            }}
          />
          <PatientDashboardTabs
            selectedTab={selectedTab}
            title={APPOINTMENTS}
            tab={APPOINTMENTS}
            onPress={() => {
              setSelectedTab({tabStr: APPOINTMENTS});
            }}
          />
          <PatientDashboardTabs
            selectedTab={selectedTab}
            title={ARTICLES}
            tab={ARTICLES}
            onPress={() => {
              setSelectedTab({tabStr: ARTICLES});
            }}
          />
          <PatientDashboardTabs
            selectedTab={selectedTab}
            tab={SAVED}
            title={SAVED}
            onPress={() => {
              setSelectedTab({tabStr: SAVED});
            }}
          />
          <PatientDashboardTabs
            selectedTab={selectedTab}
            tab={MENTORS_LIST}
            title={MENTORS_LIST}
            onPress={() => {
              setSelectedTab({tabStr: MENTORS_LIST});
            }}
          />
        </View>
      }
      {/*  Next Appointments */}
      {selectedTab.tabStr === 'All' ? (
        <View style={styles.belowTabsContainer}>
          <Text style={styles.headingText}>Next Appointments</Text>
          <View style={styles.nextAppointmentCont}>
            <View style={styles.leftCont}>
              <Text
                style={{
                  marginBottom: 9,
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: Colors.white,
                }}>
                Tomorrow
              </Text>
              <Text
                style={{fontWeight: 'bold', fontSize: 14, color: Colors.white}}>
                10:00
              </Text>
            </View>
            <View style={styles.rightCont}>
              <Text style={{marginBottom: 9, fontWeight: '400', fontSize: 16}}>
                Raqual Almeida
              </Text>
              <View style={styles.rightContVideoCall}>
                <Text style={{fontWeight: 'bold'}}>Video call</Text>
                <Text style={{fontWeight: 'bold'}}>50 min</Text>
              </View>
            </View>
          </View>
          {/* Recommended Articles */}
          <Text style={styles.headingText}>Recommended articles</Text>
          <View style={styles.recommendedArticlesCont}>
            <FlatList
              data={articlesData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      ) : null}
      {selectedTab.tabStr === APPOINTMENTS ? (
        <AppointmentList navigation={navigation} darkMode={darkMode} />
      ) : null}
      {selectedTab.tabStr == ARTICLES ? (
        <Text
          style={{
            textAlign: 'center',
          }}>
          {' '}
          No data found
        </Text>
      ) : null}
      {selectedTab.tabStr === SAVED ? (
        <Text
          style={{
            textAlign: 'center',
          }}>
          {' '}
          No data found
        </Text>
      ) : null}
      {selectedTab.tabStr === MENTORS_LIST ? (
        <MentorsList jwtToken={jwtToken} />
      ) : null}
      {/* <TabComponent selectedTab={selectedTab} setSelectedTab={setSelectedTab} /> */}
      {/* {components[selectedTab.tabStr]} */}
    </View>
  );
};

const renderItem = ({item}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 9,
        borderWidth: 0.5,
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
export default PatientDashboard;

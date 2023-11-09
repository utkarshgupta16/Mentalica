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
import AppoinmentsList from './AppointmentList';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileSlice} from '../../../redux/HomeSlice';

const PatientDashboard = ({navigation}) => {
  const {email, type} = useSelector(state => state.auth);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINMENTS});
  const [mentorName, setMentorName] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await dispatch(getProfileSlice({email, type: type}));
      console.log('res from patient =============================', res);
      setMentorName(res?.payload?.Items[0]?.firstName);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Hello {mentorName}</Text>
      {/* <Text style={styles.dateText}>4th April overview</Text> */}
      {/* Tabs */}
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
          title={APPOINMENTS}
          tab={APPOINMENTS}
          onPress={() => {
            setSelectedTab({tabStr: APPOINMENTS});
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
      {/*  Next Appointments */}
      {selectedTab.tabStr == 'All' ? (
        <View style={styles.belowTabsContainer}>
          <Text style={styles.headingText}>Next Appointments</Text>
          <View style={styles.nextAppointmentCont}>
            <View style={styles.leftCont}>
              <Text style={{marginBottom: 9, fontWeight: 'bold', fontSize: 14}}>
                Tomorrow
              </Text>
              <Text style={{fontWeight: 'bold', fontSize: 14}}>10:00</Text>
            </View>
            <View style={styles.rightCont}>
              <Text style={{marginBottom: 9, fontWeight: 'bold', fontSize: 16}}>
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
      {selectedTab.tabStr == APPOINMENTS ? (
        <AppoinmentsList navigation={navigation} />
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
      {selectedTab.tabStr == SAVED ? (
        <Text
          style={{
            textAlign: 'center',
          }}>
          {' '}
          No data found
        </Text>
      ) : null}
      {selectedTab.tabStr == MENTORS_LIST ? <MentorsList /> : null}
    </View>
  );
};

const renderItem = ({item}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 9,
        // borderWidth: 1,
        borderColor: 'gray',
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
          backgroundColor: '#F5F7F8',
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

const articlesData = [
  {
    id: 1,
    title: 'The healing power of nature',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
  {
    id: 2,
    title: 'Celabrating the small wins',
    author: 'Sara Fawler',
    image:
      'https://thumbs.dreamstime.com/z/single-green-leafe-peeple-tree-background-white-single-green-leafe-peeple-tree-184432850.jpg',
  },
  {
    id: 3,
    title: 'How loneliness can affect your brain',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
  {
    id: 4,
    title: 'The healing power of nature',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
  {
    id: 5,
    title: 'Celabrating the small wins',
    author: 'Sara Fawler',
    image:
      'https://thumbs.dreamstime.com/z/single-green-leafe-peeple-tree-background-white-single-green-leafe-peeple-tree-184432850.jpg',
  },
  {
    id: 6,
    title: 'How loneliness can affect your brain',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
];

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
import {ALL, APPOINMENTS, ARTICLES, SAVED} from '../../../utils/Strings';
import axios from 'axios';
import Colors from '../../../customs/Colors';
import {
  checkMultiple,
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {AppContext} from '../../../../App';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';
import AppoinmentsList from './AppointmentList';

const url =
  'https://aefc-2401-4900-1c82-5450-b098-152c-8a6e-6483.ngrok-free.app';

const PatientDashboard = ({navigation}) => {
  const {props, setProps} = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINMENTS});

  const [appointmentList, setAppointmentList] = useState({});
  console.log('PappointmentList------------------------------');
  console.log(appointmentList);

  useEffect(() => {
    axios
      .post(
        'https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getAppointmentList',
        {
          patientId: '3f409087-25b9-4772-9207-0ddeeaeb4c60',
        },
      )
      .then(response => {
        console.log('rep', response.data);

        const appointments = response.data;

        const formattedAppointments = {};
        appointments.forEach(appointment => {
          const date = appointment.startTime.split('T')[0]; // Extract date from startTime
          if (!formattedAppointments[date]) {
            formattedAppointments[date] = [];
          }
          formattedAppointments[date].push({
            start: appointment.startTime,
            end: appointment.endTime,
            ...appointment,
            // Other appointment data
          });
        });
        console.log('rep MOD', formattedAppointments);
        setAppointmentList(formattedAppointments);
      })
      .catch(error => {
        console.log('error appi lit', error);
      });
  }, []);

  const _checkPermissions = callback => {
    console.log('ran-----------');
    const iosPermissions = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    const androidPermissions = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ];
    checkMultiple(
      Platform.OS === 'ios' ? iosPermissions : androidPermissions,
    ).then(statuses => {
      console.log('insdie then');
      const [CAMERA, AUDIO] =
        Platform.OS === 'ios' ? iosPermissions : androidPermissions;
      if (
        statuses[CAMERA] === RESULTS.UNAVAILABLE ||
        statuses[AUDIO] === RESULTS.UNAVAILABLE
      ) {
        console.log('inside if');
        Alert.alert(
          'Error',
          'Hardware to support video calls is not available',
        );
      } else if (
        statuses[CAMERA] === RESULTS.BLOCKED ||
        statuses[AUDIO] === RESULTS.BLOCKED
      ) {
        console.log('inside selse if');
        Alert.alert(
          'Error',
          'Permission to access hardware was blocked, please grant manually',
        );
      } else {
        console.log('inside selse');
        if (
          statuses[CAMERA] === RESULTS.DENIED &&
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          console.log('inside denied');
          requestMultiple(
            Platform.OS === 'ios' ? iosPermissions : androidPermissions,
          ).then(newStatuses => {
            if (
              newStatuses[CAMERA] === RESULTS.GRANTED &&
              newStatuses[AUDIO] === RESULTS.GRANTED
            ) {
              console.log('will run callback1');
              callback && callback();
            } else {
              console.log('not will run callback');
              Alert.alert('Error', 'One of the permissions was not granted');
            }
          });
        } else if (
          statuses[CAMERA] === RESULTS.DENIED ||
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          console.log('dined else if');
          request(statuses[CAMERA] === RESULTS.DENIED ? CAMERA : AUDIO).then(
            result => {
              if (result === RESULTS.GRANTED) {
                callback && callback();
              } else {
                Alert.alert('Error', 'Permission not granted');
              }
            },
          );
        } else if (
          statuses[CAMERA] === RESULTS.GRANTED ||
          statuses[AUDIO] === RESULTS.GRANTED
        ) {
          console.log('will run callback elllse if');
          callback && callback();
        }
      }
    });
  };

  const videoCallAction = data => {
    console.log('data rooomdid---------------------------', data.roomId);
    _checkPermissions(() => {
      axios
        .get(
          `https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getTwilloToken?roomId=${data.roomId}&userName=${data.patientId}`,
        )
        .then(response => {
          console.log('reP-------------------', response.data);
          const token = response.data.token ?? response.data;

          setProps({
            ...props,
            token,
            userName: data.patientId,
            roomName: data.roomId,
          });

          navigation.navigate('AVChatScreen');
        })
        .catch(err => {
          console.log('err----------------------', err);
        });
    });
  };

  // const openAVScreen = () => {
  //   navigation.navigate('AVChatScreen');
  // };

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.helloText}>Hello Andre,</Text>
  //     <Text style={styles.dateText}>4th April overview</Text>
  //     <View style={styles.tabs}>
  //       <Agenda
  //         scrollEnabled
  //         showOnlySelectedDayItems
  //         // showClosingKnob={true}
  //         items={appointmentList}
  //         style={{ width: 100, height: 200}}
  //         renderEmptyData={() => (
  //           <View
  //             style={{
  //               // flex: 1,
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //             }}>
  //             <Text style={{color: 'black'}}>No schedule</Text>
  //           </View>
  //         )}
  //         renderItem={(item, isFirst) => {
  //           console.log('item-------------------');
  //           console.log(item);
  //           return (
  //             <TouchableOpacity
  //               onPress={() => {
  //                 Alert.alert(
  //                   `You'll be joined to this video call`,
  //                   `Are you sure you want to join?`,
  //                   [
  //                     {
  //                       onPress: () => videoCallAction(item),
  //                       text: 'Yes',
  //                     },
  //                     {
  //                       onPress: () => null,
  //                       text: 'No',
  //                     },
  //                   ],
  //                 );
  //               }}>
  //               <View style={styles.itemContainer}>
  //                 <View style={styles.timeColumn}>
  //                   <Text style={styles.timeText}>
  //                     {moment(item.start).format('LT')}
  //                   </Text>
  //                   <Text style={[styles.timeText]}>-</Text>
  //                   <Text style={styles.timeText}>
  //                     {moment(item.end).format('LT')}
  //                   </Text>
  //                 </View>

  //                 <View style={styles.appointmentDetails}>
  //                   {/* <Text>{'Scheduled Appointment'}</Text> */}
  //                   <Text>{item.roomId}</Text>
  //                 </View>
  //               </View>
  //             </TouchableOpacity>
  //           );
  //         }}
  //       />
  //     </View>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Hello Andre,</Text>
      <Text style={styles.dateText}>4th April overview</Text>
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
        <View style={{width: '100%', height: '100%'}}>
          {/* <AppoinmentsList /> */}
          <Agenda
            // selected="2022-12-01"
            scrollEnabled
            // style={{width: 100, height: 400}}
            showOnlySelectedDayItems
            // showClosingKnob={true}
            items={appointmentList}
            renderEmptyData={() => (
              <View
                style={{
                  // flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'black'}}>No schedule</Text>
              </View>
            )}
            renderItem={(item, isFirst) => {
              console.log('item-------------------');
              console.log(item);
              return (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      `You'll be joined to this video call`,
                      `Are you sure you want to join?`,
                      [
                        {
                          onPress: () => videoCallAction(item),
                          text: 'Yes',
                        },
                        {
                          onPress: () => null,
                          text: 'No',
                        },
                      ],
                    );
                  }}>
                  <View style={styles.itemContainer}>
                    <View style={styles.timeColumn}>
                      <Text style={styles.timeText}>
                        {moment(item.start).format('LT')}
                      </Text>
                      <Text style={[styles.timeText]}>-</Text>
                      <Text style={styles.timeText}>
                        {moment(item.end).format('LT')}
                      </Text>
                    </View>

                    <View style={styles.appointmentDetails}>
                      {/* <Text>{'Scheduled Appointment'}</Text> */}
                      <Text>{item.roomId}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          {/* <FlatList
            data={appointmentList}
            renderItem={({item, index}) => {
              const {startTime, endTime, roomId} = item;

              return (
                <View key={index}>
                  {'timeSlot == item.startTime' ? (
                    <View style={styles.bookedPointmentSlot}>
                      <View>
                        <Text
                          style={{
                            fontWeight: '600',
                            fontSize: 15,
                            marginBottom: 10,
                            color: Colors.black,
                          }}
                          key={index}>
                          {item.roomId}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              `You'll be joined to this video call`,
                              `Are you sure you want to join?`,
                              [
                                {
                                  onPress: () => videoCallAction(item),
                                  text: 'Yes',
                                },
                                {
                                  onPress: () => null,
                                  text: 'No',
                                },
                              ],
                            );
                          }}>
                          <Text>Video call</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            }}
          /> */}
        </View>
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
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
      }}>
      <Image
        source={{uri: item.image}}
        style={{
          width: '30%',
          height: 100,
          resizeMode: 'cover',
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
        }}
      />

      <View
        style={{
          width: '69%',
          paddingHorizontal: 10,
          justifyContent: 'center',
          backgroundColor: '#F5F7F8',
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
      'https://cdn.pixabay.com/photo/2020/01/08/08/43/baloon-4749597_1280.png',
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
      'https://cdn.pixabay.com/photo/2020/01/08/08/43/baloon-4749597_1280.png',
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

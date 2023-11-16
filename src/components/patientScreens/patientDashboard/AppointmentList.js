import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {styles} from './patientDashboardStyle';
import {useDispatch, useSelector} from 'react-redux';
import {
  getScheduledAppointmentsSlice,
  getTwilloTokenSlice,
} from '../../../redux/HomeSlice';
import axios from 'axios';
import Colors from '../../../customs/Colors';
import {
  checkMultiple,
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {
  ALL,
  APPOINMENTS,
  ARTICLES,
  MENTOR,
  MENTORS_LIST,
  SAVED,
} from '../../../utils/Strings';
import {AppContext} from '../../../../App';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';
const AppoinmentsList = ({navigation}) => {
  const {props, setProps} = useContext(AppContext);
  const [appointmentList, setAppointmentList] = useState({});
  const {scheduledAppointmentsData = []} = useSelector(state => state.home);
  const {email, type = ''} = useSelector(state => state.auth);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const setDateTime = time => {
    const [hours, minutes] = time.split(':');
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  };

  useEffect(() => {
    (async () => {
      let res = await dispatch(
        getScheduledAppointmentsSlice({email, fieldName: 'patientEmailId'}),
      );
      const appointments = res.payload;
      const newDate = new Date();
      const formattedAppointments = {};
      appointments.forEach(appointment => {
        const date =
          newDate.getFullYear() +
          '-' +
          `${newDate.getMonth() + 1}` +
          '-' +
          `0${newDate.getDate()}`; //appointment.startTime.split('T')[0]; // Extract date from startTime
        if (!formattedAppointments[date]) {
          formattedAppointments[date] = [];
        }

        formattedAppointments[date].push({
          start: setDateTime(appointment.slots[0].startTime),
          end: setDateTime(appointment.slots[0].endTime),
          ...appointment,
          // Other appointment data
        });
      });
      setAppointmentList(formattedAppointments);
    })();
  }, []);

  const _checkPermissions = callback => {
    const iosPermissions = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    const androidPermissions = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ];
    checkMultiple(
      Platform.OS === 'ios' ? iosPermissions : androidPermissions,
    ).then(statuses => {
      const [CAMERA, AUDIO] =
        Platform.OS === 'ios' ? iosPermissions : androidPermissions;
      if (
        statuses[CAMERA] === RESULTS.UNAVAILABLE ||
        statuses[AUDIO] === RESULTS.UNAVAILABLE
      ) {
        Alert.alert(
          'Error',
          'Hardware to support video calls is not available',
        );
      } else if (
        statuses[CAMERA] === RESULTS.BLOCKED ||
        statuses[AUDIO] === RESULTS.BLOCKED
      ) {
        Alert.alert(
          'Error',
          'Permission to access hardware was blocked, please grant manually',
        );
      } else {
        if (
          statuses[CAMERA] === RESULTS.DENIED &&
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          requestMultiple(
            Platform.OS === 'ios' ? iosPermissions : androidPermissions,
          ).then(newStatuses => {
            if (
              newStatuses[CAMERA] === RESULTS.GRANTED &&
              newStatuses[AUDIO] === RESULTS.GRANTED
            ) {
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
          callback && callback();
        }
      }
    });
  };
  const videoCallAction = data => {
    _checkPermissions(() => {
      axios
        .get(
          `https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getTwilloToken?roomId=${data?.roomId}&userName=${data?.patient_email_Id}`,
        )
        .then(response => {
          const token = response.data.token ?? response.data;
          setProps({
            ...props,
            token,
            userName: data?.patient_email_Id,
            roomName: data?.roomId,
          });

          navigation.navigate('AVChatScreen');
        })
        .catch(err => {
          console.log('err----------------------', err);
        });
    });
  };

  return (
    <View style={styles.container}>
      <Agenda
        theme={{
          selectedDayBackgroundColor: Colors.darkPaleMintColor,
          selectedDayTextColor: Colors.white,
          todayTextColor: Colors.darkPaleMintColor,
        }}
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
        renderItem={item => {
          let name = type === MENTOR ? item?.patientName : item?.mentorName;
          let {endTime} = (item.slots && item.slots[0]) || {};
          let currentTime = new Date().getTime();
          const [hours, minutes] = endTime.split(':');
          const now = new Date();
          now.setHours(hours, minutes, 0, 0);
          let endDateTime = now.getTime();
          let checkExpired = new Date(endDateTime) > new Date(currentTime);
          return (
            <TouchableOpacity
              style={{opacity: checkExpired ? 1 : 0.5}}
              onPress={() => {
                if (checkExpired) {
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
                } else {
                  Alert.alert('Meeting Link Expired', ``, [
                    {
                      onPress: () => null,
                      text: 'OK',
                    },
                  ]);
                }
              }}>
              <View style={styles.itemContainer}>
                <View style={styles.timeColumn}>
                  <Text style={styles.timeText}>
                    {moment(item?.start).format('LT')}
                  </Text>
                  <Text style={[styles.timeText]}>-</Text>
                  <Text style={styles.timeText}>
                    {moment(item?.end).format('LT')}
                  </Text>
                </View>

                <View style={styles.appointmentDetails}>
                  {/* <Text>{'Scheduled Appointment'}</Text> */}
                  <Text
                    style={{fontSize: 15, fontWeight: '500', color: '#33A3DC'}}>
                    {name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default AppoinmentsList;

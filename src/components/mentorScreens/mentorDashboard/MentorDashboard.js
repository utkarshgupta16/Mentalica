import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';
import {styles} from './MentorDashboardStyle';
import axios from 'axios';
import {AppContext, setProps, props} from '../../../../App';
import {
  checkMultiple,
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Colors from '../../../customs/Colors';
import {
  Agenda,
  DateData,
  AgendaEntry,
  AgendaSchedule,
} from 'react-native-calendars';
import Timetable from 'react-native-calendar-timetable';
import AppointmentList from './AppointmentList';
import EventCalendar from 'react-native-events-calendar';
import AxiosMethods from '../../../redux/axiosService/AxiosMethods';
import { useDispatch } from 'react-redux';

let {width} = Dimensions.get('window');

const url = 'https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com';

const events = [
  {
    start: '2023-11-11 00:30:00',
    end: '2023-11-11 02:30:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 01:30:00',
    end: '2023-11-11 02:20:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 04:10:00',
    end: '2023-11-11 04:40:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 01:05:00',
    end: '2023-11-11 01:45:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 14:30:00',
    end: '2023-11-11 16:30:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 01:20:00',
    end: '2023-11-11 02:20:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 04:10:00',
    end: '2023-11-11 04:40:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 00:45:00',
    end: '2023-11-11 01:45:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 11:30:00',
    end: '2023-11-11 12:30:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 01:30:00',
    end: '2023-11-11 02:00:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 03:10:00',
    end: '2023-11-11 03:40:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
  {
    start: '2023-11-11 00:10:00',
    end: '2023-11-11 01:45:00',
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032',
  },
];

function YourComponent({style, item, dayIndex, daysTotal}) {
  return (
    <View
      style={{
        ...style, // apply calculated styles, be careful not to override these accidentally (unless you know what you are doing)
        backgroundColor: 'red',
        borderRadius: 10,
        elevation: 5,
      }}>
      <Text>{item.title}</Text>
      <Text>
        {dayIndex} of {daysTotal}
      </Text>
    </View>
  );
}

const MentorDashboard = ({navigation}) => {
  const dispatch = useDispatch();
  const {props, setProps} = useContext(AppContext);
  // console.log('setprops---------------------', setProps);
  const [isSelectDate, setIsSelectDate] = useState(null);
  const [selectDate, setSelectDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [appointmentList, setAppointmentList] = useState({});
  console.log('appointmentList------------------------------');
  console.log(appointmentList);

  useEffect(() => {
    let payload = {};

    payload = {
      mentorId: 'c1d9286b-1758-4c5c-b1b1-539c6f6cf9fc',
    };

    const data = {
      url: 'https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getAppointmentList',
      method: 'post',
      string: 'post/getAppointmentList',
    };

    // dispatch(postMethod())

    // AxiosMethods.postMethod(data)(payload)
    //   .then(resp => {
    //     console.log('resp', resp);
    //   })
    //   .catch(err => {
    //     console.log('err', err);
    //   });

    axios
      .post(
        'https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getAppointmentList',
        payload,
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

        setAppointmentList(formattedAppointments);
      })
      .catch(error => {
        console.log('error appi lit', error);
      });
  }, []);

  const generateWeekData = () => {
    const weekData = [];
    const startOfWeek = moment().startOf('D');

    for (let i = 0; i < 30; i++) {
      weekData.push({id: i, date: startOfWeek.clone().add(i, 'days')});
    }
    return weekData;
  };
  const weekData = generateWeekData();

  const handleItemPress = item => {
    setIsSelectDate(item.id === isSelectDate ? null : item.id);
    setSelectDate(item.date === isSelectDate ? null : item.date);
  };

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
          // `${url}/getTwilloToken?roomId=${data.roomId}`,
          `https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getTwilloToken?roomId=${data.roomId}&userName=${data.mentorId}`,
        )
        .then(response => {
          console.log('reM-------------------', response.data);
          const token = response.data.token ?? response.data;

          setProps({
            ...props,
            token,
            userName: data.mentorId,
            roomName: data.roomId,
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
      <Text style={styles.helloText}>Hello Raquel,</Text>
      <Agenda
        // selected="2022-12-01"
        scrollEnabled
        showOnlySelectedDayItems
        showClosingKnob={true}
        items={appointmentList}
        renderEmptyData={() => (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'black'}}>No schedule</Text>
          </View>
        )}
        renderItem={(item, isFirst) => {
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
                {/* <View style={{alignSelf: 'flex-start'}}> */}
                <View style={styles.timeColumn}>
                  <Text style={styles.timeText}>
                    {moment(item.start).format('LT')}
                  </Text>
                  <Text style={[styles.timeText]}>-</Text>
                  <Text style={styles.timeText}>
                    {moment(item.end).format('LT')}
                  </Text>
                </View>
                {/* </View> */}
                <View style={styles.appointmentDetails}>
                  {/* <Text>{'Scheduled Appointment'}</Text> */}
                  <Text>{item.roomId}</Text>
                  {/* Render other appointment data */}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default MentorDashboard;

const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
];

const bookedSlots = [
  {name: 'John Doe', start: '09:00', duration: 2},
  {name: 'Alice Smith', start: '01:00', duration: 1},
  {name: 'Roshan J', start: '02:00', duration: 1},
  {name: 'Kaushiki P', start: '04:00', duration: 1},
  // Add more booked slots as needed
];

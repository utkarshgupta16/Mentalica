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
// import AppointmentList from './AppointmentList';
import EventCalendar from 'react-native-events-calendar';
import AxiosMethods from '../../../redux/axiosService/AxiosMethods';
import {useDispatch, useSelector} from 'react-redux';
import {getScheduledAppointmentsSlice} from '../../../redux/HomeSlice';

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
  const {email} = useSelector(state => state.auth);
  const {props, setProps} = useContext(AppContext);
  // console.log('setprops---------------------', setProps);
  const [isSelectDate, setIsSelectDate] = useState(null);
  const [selectDate, setSelectDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [appointmentList, setAppointmentList] = useState({});
  console.log('appointmentList------------------------------');
  console.log(appointmentList);

  const setDateTime = time => {
    const [hours, minutes] = time.split(':');
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
    return isoString;
  };

  const getCombineDate = (timeStr, dateStr) => {
    const dateString = dateStr;

    // Time string in the format "hh:mm a" (12-hour format with AM/PM)
    const timeString = timeStr;

    // Split the time string into hours, minutes, and AM/PM
    const [time, ampm] = timeString.split(' ');
    const [hours, minutes] = time.split(':');

    // Convert hours to 24-hour format
    let hours24 = parseInt(hours, 10);
    if (ampm === 'PM' && hours24 < 12) {
      hours24 += 12;
    } else if (ampm === 'AM' && hours24 === 12) {
      hours24 = 0;
    }

    // Combine the date and time strings
    const combinedString = `${dateString}T${hours24}:${minutes}:00`;

    // Create a Date object using the combined string
    return new Date(combinedString);
  };

  useEffect(() => {
    (async () => {
      let res = await dispatch(getScheduledAppointmentsSlice({email}));
      const appointments = res.payload;

      console.log('-------------------appointments');
      console.log('email--------------', email);
      console.log(JSON.stringify(appointments));
      // const appointments = [
      //   {
      //     startTime: '2023-11-03T16:50:00Z',
      //     patientId: '3f409087-25b9-4772-9207-0ddeeaeb4c60',
      //     endTime: '2023-11-03T17:40:00Z',
      //     mentorId: 'c1d9286b-1758-4c5c-b1b1-539c6f6cf9fc',
      //     roomId: '5574617c-655b-4d7e-ab5a-256705b1a8a7',
      //     unique_id:
      //       '1698970580193_3f409087-25b9-4772-9207-0ddeeaeb4c60_c1d9286b-1758-4c5c-b1b1-539c6f6cf9fc',
      //     enable: true,
      //   },
      //   {
      //     startTime: '2023-11-03T15:40:00Z',
      //     patientId: '3f409087-25b9-4772-9207-0ddeeaeb4c60',
      //     endTime: '2023-11-03T16:40:00Z',
      //     mentorId: 'c1d9286b-1758-4c5c-b1b1-539c6f6cf9fc',
      //     roomId: '75876dcd-ec56-45a7-bea7-9b3460d96875',
      //     unique_id:
      //       '1698970563936_3f409087-25b9-4772-9207-0ddeeaeb4c60_c1d9286b-1758-4c5c-b1b1-539c6f6cf9fc',
      //     enable: true,
      //   },
      // ];
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
      console.log('-------------------formattedAppointments');
      console.log(formattedAppointments);
      setAppointmentList(formattedAppointments);
    })();

    // axios
    //   .post(
    //     'https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getAppointmentList',
    //     payload,
    //   )
    //   .then(response => {
    //     console.log('rep', response.data);

    //     const appointments = response.data;

    //     const formattedAppointments = {};
    //     appointments.forEach(appointment => {
    //       const date = appointment.startTime.split('T')[0]; // Extract date from startTime
    //       if (!formattedAppointments[date]) {
    //         formattedAppointments[date] = [];
    //       }
    //       formattedAppointments[date].push({
    //         start: appointment.startTime,
    //         end: appointment.endTime,
    //         ...appointment,
    //         // Other appointment data
    //       });
    //     });

    //     setAppointmentList(formattedAppointments);
    //   })
    //   .catch(error => {
    //     console.log('error appi lit', error);
    //   });
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

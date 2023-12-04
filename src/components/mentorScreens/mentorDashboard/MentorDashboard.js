import {
  Text,
  View,
  FlatList,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
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
import Colors from '../../../customs/Colors';
import {Agenda} from 'react-native-calendars';
import Timetable from 'react-native-calendar-timetable';
// import AppointmentList from './AppointmentList';
import EventCalendar from 'react-native-events-calendar';
import AxiosMethods from '../../../redux/axiosService/AxiosMethods';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  getProfileSlice,
  getScheduledAppointmentsSlice,
  getTwilloTokenSlice,
} from '../../../redux/HomeSlice';
import convertLang, {MENTOR} from '../../../utils/Strings';
import {useIsFocused} from '@react-navigation/native';
import {_checkPermissions} from '../../../utils/utils';
import ScreenLoading from '../../ScreenLoading';
import {useTranslation} from 'react-i18next';
import {AV_CHAT_SCREEN} from '../../../utils/route';
import ContactsScreen from '../../../screens/ContactScreen';

const MentorDashboard = ({navigation}) => {
  const {t} = useTranslation();
  const {
    ARE_YOU_JOIN,
    HELLO,
    MENTOR_EMAIL_ID,
    NO,
    RELOAD,
    YES,
    YOU_JOINED_CALL,
  } = (t && convertLang(t)) || {};
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [refreshing, onRefresh] = useState(false);
  const {email, type} = useSelector(state => state.auth);
  const {props, setProps} = useContext(AppContext);
  // console.log('setprops---------------------', setProps);
  const [isSelectDate, setIsSelectDate] = useState(null);
  const [selectDate, setSelectDate] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [mentorName, setMentorName] = useState('');

  const [appointmentList, setAppointmentList] = useState({});
  const setDateTime = time => {
    const [hours, minutes] = time.split(':');
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  };

  useEffect(() => {
    (async () => {
      const res = await dispatch(getProfileSlice({email, type}));
      setMentorName(res?.payload?.Items[0]?.firstName);
    })();
  }, []);

  const updateData = async () => {
    let res = await dispatch(
      getScheduledAppointmentsSlice({date: moment().format('YYYY-MM-DD')}),
    );
    const appointments = res.payload;
    const newDate = new Date();
    const formattedAppointments = {};
    appointments.forEach(appointment => {
      const date =
        newDate?.getFullYear() +
        '-' +
        `${newDate?.getMonth() + 1}` +
        '-' +
        `${
          newDate?.getDate() < 10
            ? `0${newDate?.getDate()}`
            : newDate?.getDate()
        }`; //appointment.startTime.split('T')[0]; // Extract date from startTime
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
  };
  useEffect(() => {
    (async () => {
      updateData();
    })();
  }, [dispatch, email, isFocus]);

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

  const videoCallAction = data => {
    _checkPermissions(async () => {
      try {
        const {payload = {}} = await dispatch(
          getTwilloTokenSlice({
            roomId: data?.roomId,
            userName: data?.mentor_email_id,
          }),
        );
        const token = payload?.accessToken;
        setProps({
          ...props,
          token,
          userName: data?.mentor_email_id,
          roomName: data?.roomId,
        });
        token && navigation.navigate(AV_CHAT_SCREEN);
      } catch (err) {
        console.log('err----------------------', err);
      }
      // axios
      //   .get(
      //     // `${url}/getTwilloToken?roomId=${data.roomId}`,
      //     `https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getTwilloToken?roomId=${data?.roomId}&userName=${data?.mentor_email_id}`,
      //   )
      //   .then(response => {
      //     const token = response.data.token ?? response.data;
      //     setProps({
      //       ...props,
      //       token,
      //       userName: data?.mentor_email_id, //data.mentorId,
      //       roomName: data?.roomId,
      //     });
      //     navigation.navigate('AVChatScreen');
      //   })
      //   .catch(err => {});
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>
        {HELLO} {mentorName && mentorName}
      </Text>
      {isLoading ? <ScreenLoading /> : null}
      <Agenda
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              onRefresh(true);
              await updateData();
              onRefresh(false);
            }}
          />
        }
        scrollEnabled
        showOnlySelectedDayItems
        showClosingKnob={true}
        items={appointmentList}
        renderEmptyData={() => (
          <Pressable
            onPress={async () => {
              setLoading(true);
              await updateData();
              setLoading(false);
            }}
            style={styles.reloadButton}>
            <Text style={styles.reloadText}>{RELOAD}</Text>
            <AIcon name="refresh" size={35} color={Colors.blueDarkColor} />
          </Pressable>
        )}
        renderItem={item => {
          let name = type == MENTOR ? item?.patientName : item?.mentorName;
          return (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(YOU_JOINED_CALL, ARE_YOU_JOIN, [
                  {
                    onPress: () => videoCallAction(item),
                    text: YES,
                  },
                  {
                    onPress: () => null,
                    text: NO,
                  },
                ]);
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
                  <Text style={styles.mentorTextStyle}>{name}</Text>
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

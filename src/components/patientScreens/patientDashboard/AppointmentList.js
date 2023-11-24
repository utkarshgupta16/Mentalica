import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  // Text,
  // View,
  TouchableOpacity,
  Alert,
  RefreshControl,
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
import convertLang, {MENTOR} from '../../../utils/Strings';
import {AppContext} from '../../../../App';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import {_checkPermissions} from '../../../utils/utils';
import ScreenLoading from '../../ScreenLoading';
import {useTranslation} from 'react-i18next';
import {AV_CHAT_SCREEN} from '../../../utils/route';
import Text from "../../../components/TextWrapper"
import View from "../../../components/ViewWrapper"
const AppoinmentsList = ({navigation}) => {
  const {t} = useTranslation();
  const {
    ALL,
    APPOINTMENTS,
    ARE_YOU_JOIN,
    ARTICLES,
    LINK_EXPIRED,
    MENTORS_LIST,
    NO,
    PATIENT_EMAIL_ID,
    RELOAD,
    SAVED,
    YES,
    YOU_JOINED_CALL,
    OKAY,
  } = convertLang(t);
  const {props, setProps} = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINTMENTS});
  const [appointmentList, setAppointmentList] = useState({});
  const [refreshing, onRefresh] = useState(false);
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

  const updateData = async () => {
    try {
      let res = await dispatch(
        getScheduledAppointmentsSlice({email, fieldName: PATIENT_EMAIL_ID}),
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
          `${
            newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate()
          }`; //appointment.startTime.split('T')[0]; // Extract date from startTime
        if (!formattedAppointments[date]) {
          formattedAppointments[date] = [];
        }

        formattedAppointments[date].push({
          start: setDateTime(appointment.slots[0].startTime),
          end: setDateTime(appointment.slots[0].endTime),
          ...appointment,
        });
      });
      setAppointmentList(formattedAppointments);
    } catch (err) {}
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await updateData();
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  const videoCallAction = data => {
    _checkPermissions(async () => {
      try {
        const {payload = {}} = await dispatch(
          getTwilloTokenSlice({
            roomId: data?.roomId,
            userName: data?.patient_email_Id,
          }),
        );
        const token = payload?.token;
        setProps({
          ...props,
          token,
          userName: data?.patient_email_Id,
          roomName: data?.roomId,
        });
        navigation.navigate(AV_CHAT_SCREEN);
      } catch (err) {
        console.log('err----------------------', err);
      }
      // axios
      //   .get(
      //     `https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getTwilloToken?roomId=${data?.roomId}&userName=${data?.patient_email_Id}`,
      //   )
      //   .then(response => {
      //     const token = response.data.token ?? response.data;
      //     setProps({
      //       ...props,
      //       token,
      //       userName: data?.patient_email_Id,
      //       roomName: data?.roomId,
      //     });

      //     navigation.navigate('AVChatScreen');
      //   })
      //   .catch(err => {
      //     console.log('err----------------------', err);
      //   });
    }, t);
  };

  return (
    <View style={styles.container}>
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
          let {endTime} = (item.slots && item.slots[0]) || {};
          const [hours, minutes] = endTime.split(':');
          const now = new Date();
          now.setHours(hours, minutes, 0, 0);
          let endDateTime = now.getTime();
          let checkExpired = true;
          return (
            <TouchableOpacity
              style={{opacity: checkExpired ? 1 : 0.5}}
              onPress={() => {
                if (checkExpired) {
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
                } else {
                  Alert.alert(LINK_EXPIRED, ``, [
                    {
                      onPress: () => null,
                      text: OKAY,
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
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: '#33A3DC',
                    }}>
                    {name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      {/* <FlatList
        data={scheduledAppointmentsData}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                backgroundColor: 'green',
                borderRadius: 8,
                padding: 10,
                flex: 1,
                marginBottom: 10,
                position: 'relative',
              }}>
              {isLoading ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    top: 0,
                    right: 0,
                  }}>
                  <ActivityIndicator color={'white'} size="large" />
                </View>
              ) : null}
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Mentor Email : {item?.mentor_email_id}
              </Text>
              <Text
                style={{paddingTop: 10, color: 'white', fontWeight: 'bold'}}>
                Meeting Time :{' '}
                {item?.slots[0].startTime + '-' + item?.slots[0].endTime}
              </Text>
              <Pressable
                style={{marginTop: 10}}
                onPress={async () => {
                  setLoading(true);
                  const res = await dispatch(getTwilloTokenSlice(item.roomId));
                  setLoading(false);
                  console.log('roomId================', res);
                }}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
                  Join
                </Text>
              </Pressable>
            </View>
          );
        }}
      />
       */}
    </View>
  );
};

export default React.memo(AppoinmentsList);

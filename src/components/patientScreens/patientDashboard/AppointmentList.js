/* eslint-disable react-native/no-inline-styles */
import {Pressable, TouchableOpacity, Alert, RefreshControl} from 'react-native';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {agendaTheme, styles} from './patientDashboardStyle';
import {useDispatch, useSelector} from 'react-redux';
import {
  getScheduledAppointmentsSlice,
  getTwilloTokenSlice,
} from '../../../redux/HomeSlice';
import Colors from '../../../customs/Colors';
import convertLang, {MENTOR} from '../../../utils/Strings';
import {AppContext} from '../../../../App';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import {dateFormatYY_MM_DD, _checkPermissions} from '../../../utils/utils';
import ScreenLoading from '../../ScreenLoading';
import {useTranslation} from 'react-i18next';
import {AV_CHAT_SCREEN} from '../../../utils/route';
import {useIsFocused} from '@react-navigation/native';
import View from '../../wrapperComponent/ViewWrapper';
import Text from '../../wrapperComponent/TextWrapper';

const RenderAgenda = ({
  darkMode,
  onRefresh,
  updateData,
  refreshing,
  selectedDay,
  onDayPress,
  appointmentList,
  renderEmptyData,
  keyExtractor,
  renderItem,
}) => {
  return (
    <Agenda
      // hideExtraDays={true}
      // hideKnob={true}
      theme={agendaTheme(darkMode).theme}
      // selected="2024-01-04"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            updateData(selectedDay, true);
          }}
        />
      }
      // key={darkMode}
      scrollEnabled
      // showOnlySelectedDayItems
      // getItemLayout={getItemLayout}
      onDayPress={onDayPress}
      items={appointmentList}
      initialNumToRender={5}
      keyExtractor={keyExtractor}
      renderEmptyData={renderEmptyData}
      renderItem={renderItem}
    />
  );
};

const RenderAgendaMemo = memo(RenderAgenda);

const AppoinmentsList = ({navigation, handleShadowVisible}) => {
  const {t} = useTranslation();
  const {
    APPOINTMENTS,
    ARE_YOU_JOIN,
    LINK_EXPIRED,
    NO,
    RELOAD,
    YES,
    YOU_JOINED_CALL,
    OKAY,
  } = convertLang(t);
  const {props, setProps} = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINTMENTS});
  const [refreshing, onRefresh] = useState(false);
  const [selectedDay, setDay] = useState(new Date());
  const {scheduledAppointmentsData = []} = useSelector(state => state.home);
  const {email, type = ''} = useSelector(state => state.auth);
  const [isLoading, setLoading] = useState(false);
  const agendaLoad = useRef(true);
  const dispatch = useDispatch();
  const {
    userToken: {jwtToken},
  } = useSelector(state => state.auth);

  const {darkMode} = useSelector(state => state.home);
  const isFocus = useIsFocused();

  const setDateTime = time => {
    const [hours, minutes] = time.split(':');
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  };

  const formatDataCalender = useCallback(
    ({appointments = [], formattedAppointments, newDate}) => {
      if (appointments.length) {
        appointments &&
          appointments.forEach(appointment => {
            const date = dateFormatYY_MM_DD(newDate); //appointment.startTime.split('T')[0]; // Extract date from startTime
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
      }
      return formattedAppointments;
    },
    [],
  );

  const formatSheduleAppointmentData = (appointments, selectedDay) => {
    const newDate = new Date(selectedDay);
    const formattedAppointments = {};
    return formatDataCalender({
      appointments,
      formattedAppointments,
      newDate,
    });
  };

  const updateData = useCallback(
    async (date, isRefresh) => {
      try {
        if (isRefresh) {
          onRefresh(true);
        } else {
          setLoading(true);
        }
        await dispatch(
          getScheduledAppointmentsSlice({
            date: moment(date).format('YYYY-MM-DD'),
          }),
        );
        // const appointments = res.payload;
        // const newDate = new Date(date);
        // let formattedAppointments = {};
        // formattedAppointments = formatDataCalender({
        //   appointments,
        //   formattedAppointments,
        //   newDate,
        // });
        if (isRefresh) {
          onRefresh(false);
        } else {
          setLoading(false);
        }
        // setAppointmentList(formattedAppointments);
      } catch (err) {
        if (isRefresh) {
          onRefresh(false);
        } else {
          setLoading(false);
        }
      }
    },
    [dispatch],
  );

  const formatedData = formatSheduleAppointmentData(
    scheduledAppointmentsData,
    selectedDay,
  );

  const [appointmentList, setAppointmentList] = useState(formatedData);
  const handleOnScroll = event => {
    handleShadowVisible(true);
  };

  // const updateData = async () => {
  //   let res = await dispatch(
  //     getScheduledAppointmentsSlice({
  //       email,
  //       fieldName: PATIENT_EMAIL_ID,
  //     }),
  //   );
  //   const appointments = res.payload;
  //   const formattedAppointments = formatSheduleAppointmentData(appointments);
  //   setAppointmentList(formattedAppointments);
  // };

  // const updateData = async () => {
  //   try {
  //     let res = await dispatch(
  //       getScheduledAppointmentsSlice({
  //         email,
  //         fieldName: PATIENT_EMAIL_ID,
  //         jwtToken,
  //       }),
  //     );
  //     const appointments = res.payload;
  //     const newDate = new Date();
  //     const formattedAppointments = {};
  //     appointments.forEach(appointment => {
  //       const date =
  //         newDate.getFullYear() +
  //         '-' +
  //         `${newDate.getMonth() + 1}` +
  //         '-' +
  //         `${
  //           newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate()
  //         }`; //appointment.startTime.split('T')[0]; // Extract date from startTime
  //       if (!formattedAppointments[date]) {
  //         formattedAppointments[date] = [];
  //       }

  //       formattedAppointments[date].push({
  //         start: setDateTime(appointment.slots[0].startTime),
  //         end: setDateTime(appointment.slots[0].endTime),
  //         ...appointment,
  //       });
  //     });
  //     setAppointmentList(formattedAppointments);
  //   } catch (err) {}
  // };

  const updateDataMount = useCallback(async () => {
    try {
      if (scheduledAppointmentsData.length === 0) {
        await updateData(new Date());
      }
    } catch (err) {}
  }, [updateData]);

  useEffect(() => {
    updateDataMount();
  }, [updateDataMount]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setLoading(true);
  //       await updateData();
  //       setLoading(false);
  //     } catch (err) {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

  const videoCallAction = data => {
    _checkPermissions(async () => {
      try {
        const {payload = {}} = await dispatch(
          getTwilloTokenSlice({
            jwtToken,
            roomId: data?.roomId,
            userName: data?.patientEmailId,
          }),
        );
        const token = payload?.accessToken;
        setProps({
          ...props,
          token,
          userName: data?.patientEmailId,
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

  const getItemLayout = (data, index) => ({
    length: 80,
    offset: 80 * index,
    index,
  });

  const renderItem = item => {
    let name = type === MENTOR ? item?.patientName : item?.mentorName;
    let {endTime} = (item.slots && item.slots[0]) || {};
    const [hours, minutes] = endTime.split(':');
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    let endDateTime = now.getTime();
    let checkExpired = true;
    if (isLoading) {
      return null;
    }
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
        <View
          style={{
            shadowColor: darkMode ? '#fff' : 'gray',
            ...styles.appointmentAgenda,
          }}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeText}>
              {moment(item?.start).format('LT')}
            </Text>
            <Text style={styles.timeText}>-</Text>
            <Text style={styles.timeText}>
              {moment(item?.end).format('LT')}
            </Text>
          </View>

          <View style={styles.appointmentDetails}>
            <Text style={styles.agendaText}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onDayPress = ({dateString}) => {
    setDay(dateString);
    updateData(dateString);
  };

  const renderEmptyData = () => {
    if (isLoading) {
      return null;
    }
    return (
      <Pressable
        onPress={() => {
          updateData(selectedDay);
        }}
        style={styles.reloadButton}>
        <Text style={styles.reloadText}>{RELOAD}</Text>
        <AIcon name="refresh" size={35} color={Colors.blueDarkColor} />
      </Pressable>
    );
  };

  const keyExtractor = (item, index) => index;

  return (
    <View style={styles.container}>
      {isLoading ? <ScreenLoading /> : null}
      <RenderAgendaMemo
        darkMode={darkMode}
        onRefresh={onRefresh}
        updateData={updateData}
        refreshing={refreshing}
        selectedDay={selectedDay}
        onDayPress={onDayPress}
        appointmentList={formatedData}
        renderEmptyData={renderEmptyData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      {/* <Agenda
        theme={agendaTheme(darkMode).theme}
        // selected="2024-01-04"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              onRefresh(true);
              await updateData(selectedDay);
              onRefresh(false);
            }}
          />
        }
        // key={darkMode}
        scrollEnabled
        showOnlySelectedDayItems
        getItemLayout={getItemLayout}
        onDayPress={onDayPress}
        items={appointmentList}
        initialNumToRender={5}
        keyExtractor={keyExtractor}
        renderEmptyData={renderEmptyData}
        renderItem={renderItem}
      /> */}
    </View>
  );
};

export default React.memo(AppoinmentsList);

/* eslint-disable react-hooks/exhaustive-deps */
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
import {agendaTheme, styles} from './homeDashboardStyle';
import {useDispatch, useSelector} from 'react-redux';
import {
  getScheduledAppointmentsSlice,
  getTwilloTokenSlice,
  setSelectedDayIndex,
} from '../../redux/HomeSlice';
import Colors from '../../customs/Colors';
import convertLang, {MENTOR} from '../../utils/Strings';
import {AppContext} from '../../../App';
import {Agenda, Calendar} from 'react-native-calendars';
import moment from 'moment';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import {dateFormatYY_MM_DD, _checkPermissions} from '../../utils/utils';
import {useTranslation} from 'react-i18next';
import {AV_CHAT_SCREEN} from '../../utils/route';
import {useIsFocused} from '@react-navigation/native';
import View from '../../components/wrapperComponent/ViewWrapper';
import Text from '../../components/wrapperComponent/TextWrapper';
import {HomeContentLoading} from '../../components/SkeletonContentLoading';
import CustomCalendar from '../../components/CustomCalendar';
const AppoinmentsList = ({navigation, handleShadowVisible}) => {
  const {t} = useTranslation();
  const {ARE_YOU_JOIN, LINK_EXPIRED, NO, RELOAD, YES, YOU_JOINED_CALL, OKAY} =
    convertLang(t);
  const today = new Date();
  const {props, setProps} = useContext(AppContext);
  const [selectedDay, setDay] = useState(new Date());
  // const [selectedDayIndex, setDayIndex] = useState(today.getDate());
  const {scheduledAppointmentsData = [], selectedDayIndex} = useSelector(
    state => state.home,
  );
  const {type = ''} = useSelector(state => state.auth);
  const [isLoading, setLoading] = useState({
    tabLoading: false,
    refreshing: false,
    initialLoading: false,
  });

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
    async (date, type) => {
      try {
        setLoading({...isLoading, [type]: true});
        await dispatch(
          getScheduledAppointmentsSlice({
            date: moment(new Date(date)).format('YYYY-MM-DD'),
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
        setLoading({...isLoading, [type]: false});
        // setAppointmentList(formattedAppointments);
      } catch (err) {
        setLoading({...isLoading, [type]: false});
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
        await updateData(new Date(), 'initialLoading');
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
            userName:
              type === MENTOR ? data?.mentorEmailId : data?.patientEmailId,
          }),
        );
        const token = payload?.accessToken;
        setProps({
          ...props,
          token,
          userName:
            type === MENTOR ? data?.mentorEmailId : data?.patientEmailId,
          roomName: data?.roomId,
        });
        navigation.navigate(AV_CHAT_SCREEN);
      } catch (err) {
        console.log('err----------------------', err);
      }
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
        <View
          style={{
            shadowColor: darkMode ? Colors.white : 'gray',
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
    updateData(dateString, 'tabLoading');
  };

  const renderEmptyData = () => {
    if (
      isLoading.initialLoading ||
      isLoading.refreshing ||
      isLoading.tabLoading
    ) {
      return null;
    }
    return (
      <Pressable
        onPress={() => {
          updateData(selectedDay, 'tabLoading');
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
      {isLoading.initialLoading || isLoading.tabLoading ? (
        <HomeContentLoading isLoading={isLoading} />
      ) : null}
      {/* <Calendar
        markedDates={{
          '2023-06-25': {selected: true, marked: true},
          '2023-06-24': {marked: true},
          '2023-06-26': {
            marked: true,
            dotColor: 'red',
            activeOpacity: 0,
          },
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: '#00adf5',
          monthTextColor: '#00adf5',
          indicatorColor: 'blue',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      /> */}
      <CustomCalendar
        selectedDayIndex={selectedDayIndex}
        selectedDay={selectedDay}
        onPress={(day, index) => {
          onDayPress({dateString: day});
          // setDayIndex(index);
          dispatch(setSelectedDayIndex(index));
          console.log('onPress', day);
        }}
        data={scheduledAppointmentsData || []}
        type={type}
        videoCallAction={videoCallAction}
        darkMode={darkMode}
        isLoading={isLoading}
        updateData={updateData}
      />
      {/* <Agenda
        // hideList={true}
        key={selectedDayIndex}
        theme={agendaTheme(darkMode).theme}
        // selected="2024-01-04"
        refreshControl={
          <RefreshControl
            refreshing={isLoading.refreshing}
            onRefresh={() => {
              updateData(selectedDay, 'refreshing');
            }}
          />
        }
        // hideKnob={true}
        // key={darkMode}
        scrollEnabled
        showOnlySelectedDayItems
        getItemLayout={getItemLayout}
        onDayPress={onDayPress}
        items={formatedData}
        initialNumToRender={5}
        keyExtractor={keyExtractor}
        renderEmptyData={renderEmptyData}
        renderItem={renderItem}
      /> */}
    </View>
  );
};

export default React.memo(AppoinmentsList);

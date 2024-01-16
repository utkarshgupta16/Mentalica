import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  heightPercentageToDP as hp,
  screenHeight,
  screenWidth,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {DatePickerModal} from 'react-native-paper-dates';
import {slotsData} from '../../utils/default';
import {useTranslation} from 'react-i18next';
import Colors from '../../customs/Colors';
import moment, {months, monthsShort} from 'moment';
import {
  editProfileSlice,
  setRangeDate,
  addSlots,
  updateSlotsSlice,
  getSlotsSlice,
} from '../../redux/HomeSlice';
import {useDispatch, useSelector} from 'react-redux';
import ScreenLoading from '../../components/ScreenLoading';
import {ADD_SLOTS, APPLY, FROM, PATIENT, TO} from '../../utils/Strings';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import backArrow from '../../icons/backArrowS.png';
import {populate} from 'dotenv';
import convertLang from '../../utils/Strings';

const AddSlotsMentor = ({navigation, route}) => {
  const {t} = useTranslation();
  const {SELECTED_DATE, DATE_FROM, TO, SELECT_TIME} = convertLang(t);

  const isProfile = route?.params?.isProfile || false;
  const timestamp = Date.now();
  const {
    slots = [],
    rangeDate = {
      startDate: timestamp,
      endDate: timestamp,
    },
  } = useSelector(state => state.home);

  const getSlots = async () => {
    try {
      const date =
        Platform.OS == 'ios'
          ? new Date(rangeDate.startDate)
          : new Date(dateObj?.from);
      const zDate = String(date.toString());
      const responce = await dispatch(getSlotsSlice(zDate));
    } catch (err) {
      console.log('Error to get slots by date', err);
    }
  };

  useEffect(() => {
    isProfile && getSlots();
  }, [dateObj]);

  let slots1 = [];
  if (!isProfile) {
    slots1 =
      (slots &&
        slots.length &&
        slots?.map(val => `${val?.startTime}-${val?.endTime}`)) ||
      [];
  } else {
    slots1 =
      (slots &&
        slots.length &&
        slots?.map(val => `${val?.startTime}-${val?.endTime}`)) ||
      [];
  }

  const type = PATIENT;

  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const [selectedSlot, setSlots] = useState([...slots1]);
  const [slotsDataState, setSlotsData] = useState(slotsData);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedDeleteIndex, setDelete] = useState(undefined);
  const [isUpdated, setUpdated] = useState(false);
  const [showCalendarModal, setCalendarModal] = useState(false);
  const [showCalendarModalAndroid, setCalendarModalAndroid] = useState(false);

  const [dateObj, setDateObj] = useState({from: timestamp, to: timestamp});

  const [time, setTime] = useState({
    startTime: `${
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : new Date().getHours()
    }:${
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : new Date().getMinutes()
    }`,
    endTime: '',
  });

  const onDateSelect = (event, selectedDate, key) => {
    const copy = {...dateObj};
    copy[key] = event.nativeEvent.timestamp;
    dispatch(setRangeDate({...rangeDate, [key]: event.nativeEvent.timestamp}));
  };

  const firstDay = new Date(moment().subtract(30, 'd'));

  const onChangeDate = (text, field) => {
    let hours = parseInt(JSON.stringify(text).slice(12, 14)) - 6;
    let minutes = parseInt(JSON.stringify(text).slice(15, 17)) - 30;
    let hoursNew = hours;

    if (minutes < 0) {
      hours = hours - 1;
      minutes = 60 + minutes;
    }
    if (hours < 0) {
      hours = 24 + hours;
    }

    if (field == 'endTime') {
      let [h, m] = time.startTime.split(':');
      let diffM = minutes - m;
      if (diffM >= 49) {
        Alert.alert(
          'Exceeding Meeting limit',
          'You can schedule meeting maximum 50 min',
          [{text: 'OK', onPress: () => null}],
        );
        setShowStartTime(false);
        setShowEndTime(false);
        return;
      }
    }
    if (hours > 12) {
      hours = hours - 12;
      let time1 = {
        ...time,
        [field]: `${hours < 10 ? `0${hours}` : hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }`,
      };
      setTime(time1);
      if (Platform.OS == 'android') {
        addDateTime(field, {
          [field]: `${hoursNew < 10 ? `0${hoursNew}` : hoursNew}:${
            minutes < 10 ? `0${minutes}` : minutes
          }`,
        });
      }
    } else {
      const h = hours + 12;
      let time2 = {
        ...time,
        [field]: `${h}:${minutes < 10 ? `0${minutes}` : minutes}`,
      };
      setTime(time2);
      if (Platform.OS == 'android') {
        addDateTime(field, time2);
      }
    }
  };

  const addDateTime = (field, timeObj) => {
    const selectedTime = timeObj ? timeObj : time;
    let isExit = false;
    for (let val of slots) {
      if (field == 'startTime') {
        const selectedStartTime = time['startTime'];
        let {endTime} = val || {};
        let [endH, endM] = endTime.split(':');
        let [hoursS, minutesS] = selectedStartTime?.split(':');
        if (hoursS <= endH && minutesS < endM) {
          Alert.alert('Meeting Collapse', 'Try another time', [
            {text: 'OK', onPress: () => null},
          ]);
          isExit = true;
          break;
        }
      } else if (field == 'endTime') {
        const selectedTime = time['endTime'];
        let {endTime} = val || {};
        let [endH, endM] = endTime.split(':');
        let [hours, minutes] = selectedTime.split(':');
        if (hours <= endH && minutes < endM) {
          Alert.alert('Meeting Collapse', 'Try another time', [
            {text: 'OK', onPress: () => null},
          ]);
          isExit = true;
          break;
        }
      }
    }

    if (isExit) {
      return;
    }
    if (field === 'startTime') {
      if (Platform.OS === 'ios') {
        setShowStartTime(false);
        setShowEndTime(true);
      }
    } else {
      let time1 = `${selectedTime?.startTime}-${selectedTime?.endTime}`;
      if (Platform.OS === 'ios') {
        setShowEndTime(false);
      }
      dispatch(addSlots([...slots, selectedTime]));
      setSlotsData([
        ...slotsDataState,
        {
          value: `${selectedTime?.startTime}-${selectedTime?.endTime}`,
          label: `${selectedTime?.startTime}-${selectedTime?.endTime}`,
        },
      ]);
      let selectedSlotData = [...selectedSlot];
      selectedSlotData.push(time1);
      setSlots(selectedSlotData);

      if (isProfile && !isUpdated) {
        setUpdated(true);
      }
    }
  };

  const dateRenderItem = ({field, isVisible}) => {
    let date = new Date();
    if (field === 'endTime') {
      let timeArr = time['startTime']?.split(':');
      date.setHours(timeArr[0]);
      date.setMinutes(timeArr[1]);
    }

    return (
      <DateTimePickerModal
        // date={new Date()}
        date={
          Platform.OS === 'ios'
            ? new Date()
            : field === 'startTime'
            ? new Date()
            : date
        }
        // minuteInterval={30}
        mode="time"
        is24Hour={false}
        locale="en-US"
        // timePickerModeAndroid={'clock'}
        minimumDate={field === 'startTime' ? new Date() : date}
        is24hourSource="locale"
        onChange={date => onChangeDate(date, field)}
        isVisible={isVisible}
        onConfirm={dateVal => {
          if (Platform.OS === 'android') {
            if (field === 'startTime') {
              setShowStartTime(false);
              setShowEndTime(true);
            }
            if (field === 'endTime') {
              setShowEndTime(false);
            }
            onChangeDate(dateVal, field);
          }
        }}
        customConfirmButtonIOS={props => (
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: Colors.blueDarkColor,
              margin: 10,
              borderRadius: 4,
            }}
            onPress={() => addDateTime(field)}>
            <View>
              <Text
                style={{
                  color: Colors.white,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                {`Add ${field === 'startTime' ? 'Start Time' : 'End Time'}`}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        customCancelButtonIOS={() => (
          <TouchableOpacity onPress={() => addDateTime(field)}>
            <View>
              <Text>{'Add Date & Time'}</Text>
            </View>
          </TouchableOpacity>
        )}
        onCancel={() => {
          setShowEndTime(false);
          setShowStartTime(false);
        }}
      />
    );
  };

  useEffect(() => {
    setSlotsData(slotsData);
  }, []);

  const onDismiss = React.useCallback(() => {
    setCalendarModalAndroid(false);
  }, [setCalendarModalAndroid]);

  const onConfirm = React.useCallback(
    ({startDate, endDate}) => {
      getSlots();
      if (new Date(startDate) > new Date(endDate)) {
        Alert.alert('Invalid Date Range', 'Please enter a valid date range.');
        return;
      }
      setDateObj({
        from: Number(moment(startDate).format('x')),
        to: Number(moment(endDate).format('x')),
      });
      setCalendarModalAndroid(false);
    },
    [showCalendarModalAndroid],
  );

  const handleDateRange = () => {
    setTimeout(() => {
      if (Platform.OS === 'ios') {
        setCalendarModal(true);
      } else {
        setCalendarModalAndroid(true);
      }
    }, 500);
  };

  const applyCalendarRange = () => {
    setCalendarModal(false);

    {
      isProfile && getSlots();
    }
  };

  return (
    <View style={styles.parentContainer}>
      {isLoading ? <ScreenLoading /> : null}
      <Pressable onPress={handleDateRange} style={styles.dateRange}>
        <View>
          {Platform.OS === 'ios' ? (
            <Text>
              {new Date(rangeDate.endDate)?.getDate() >
              new Date(rangeDate.startDate)?.getDate()
                ? `${DATE_FROM} ${new Date(
                    rangeDate.startDate,
                  ).getDate()} ${TO} ${new Date(rangeDate.endDate).getDate()}`
                : `${SELECTED_DATE} ${new Date(
                    rangeDate.startDate,
                  ).getDate()} ${months(
                    new Date(rangeDate.startDate).getMonth(),
                  )} `}
            </Text>
          ) : (
            <Text>
              {new Date(dateObj?.to)?.getDate() >
              new Date(dateObj?.from)?.getDate()
                ? `${DATE_FROM} ${new Date(
                    dateObj?.from,
                  )?.getDate()} ${TO} ${new Date(dateObj?.to)?.getDate()}`
                : `${SELECTED_DATE} ${new Date(
                    dateObj?.from,
                  )?.getDate()} ${months(
                    new Date(dateObj?.from)?.getMonth(),
                  )} `}
            </Text>
          )}
        </View>
        <MaterialIcons name="event" size={22} />
      </Pressable>

      <Pressable
        onPress={() => {
          setShowStartTime(true);
        }}
        style={styles.dateRange}>
        <View>
          {slots.length ? (
            <Text>{`${slots.length} ${
              slots.length == 1
                ? 'An item has been selected'
                : 'items have been selected'
            }`}</Text>
          ) : (
            <Text>{SELECT_TIME}</Text>
          )}
        </View>
        <MaterialIcons name="access-time" size={22} />
      </Pressable>
      {/* {showStartTime ? dateRenderItem({field: 'startTime'}) : null}
      {showEndTime ? dateRenderItem({field: 'endTime'}) : null} */}
      {showStartTime
        ? dateRenderItem({field: 'startTime', isVisible: showStartTime})
        : null}
      {showEndTime
        ? dateRenderItem({field: 'endTime', isVisible: showEndTime})
        : null}
      {slots && slots?.length && !isOpen ? (
        <FlatList
          columnWrapperStyle={{flexWrap: 'wrap'}}
          scrollEventThrottle={1900}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          data={slots}
          style={{
            paddingTop: 10,
          }}
          numColumns={3}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => {
            let [startH, startM] = item?.startTime.split(':');
            let [endH, endM] = item?.endTime.split(':');
            let AM_PM = startH >= 12 ? 'PM' : 'AM';
            let AM_PM_END = endH >= 12 ? 'PM' : 'AM';
            let startTime = `${startH > 12 ? startH - 12 : startH}:${startM}`;
            let endTime = `${endH > 12 ? endH - 12 : endH}:${endM}`;
            //  let endTime = `${
            //   endH > 12 ? endH - 12 : endH
            // }:${endM} ${AM_PM_END}`;
            return (
              <Pressable
                onPress={() => {
                  if (
                    selectedDeleteIndex != null ||
                    selectedDeleteIndex != undefined
                  ) {
                    setDelete(null);
                  } else {
                    setDelete(index);
                  }
                }}
                key={index}
                style={{
                  paddingTop: 5,
                  opacity: 1,
                  // flexDirection: 'row',
                  position: 'relative',
                  alignItems: 'flex-end',
                }}>
                <View
                  style={{
                    marginRight: 10,
                    borderRadius: 13,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    backgroundColor: 'gray',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                    }}>
                    {`${startTime}-${endTime}`}
                  </Text>
                </View>
                {selectedDeleteIndex === index ? (
                  <Pressable
                    onPress={() => {
                      // selectedSlot
                      let slotsData = [...slots];
                      let selectedSlotData = [...selectedSlot];
                      let time = `${slotsData[index]?.startTime}-${slotsData[index]?.endTime}`;
                      const slotIndex = selectedSlotData.indexOf(time);
                      slotsData.splice(index, 1);
                      selectedSlotData.splice(slotIndex, 1);
                      setSlots([...selectedSlotData]);
                      dispatch(addSlots([...slotsData]));
                      setDelete(null);
                      if (!isUpdated) {
                        setUpdated(true);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      top: -5,
                      right: 2,
                      zIndex: 1000,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      borderWidth: 1,
                      // alignItems: 'flex-end',
                    }}>
                    <MaterialIcons name="close" size={18} />
                  </Pressable>
                ) : null}
              </Pressable>
            );
          }}
        />
      ) : (
        // </View>
        <View
          style={{
            flex: 1,
          }}
        />
      )}
      {isProfile && isUpdated ? (
        <Pressable
          onPress={async () => {
            try {
              setLoading(true);
              const dateObjNew = {
                startDate: dateObj.from,
                endDate: dateObj.to,
              };
              const rangeDateValue =
                Platform.OS === 'android' ? dateObjNew : rangeDate;
              const rangeDateData = {
                startDate: new Date(rangeDateValue.startDate),
                endDate: new Date(rangeDateValue.endDate),
                slots: slots,
              };
              await dispatch(updateSlotsSlice({rangeDate: rangeDateData}));
              setLoading(false);
              Alert.alert('Success ', 'Your changes were saved', [
                {text: 'OK', onPress: () => setUpdated(false)},
              ]);
            } catch (err) {
              setLoading(false);
            }
          }}
          style={{
            justifyContent: 'center',
            paddingVertical: 5,
            borderRadius: 6,
            marginBottom: hp(2),
            backgroundColor: Colors.darkPaleMintColor,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Save
          </Text>
        </Pressable>
      ) : null}

      <Modal
        isVisible={showCalendarModal}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.calendarModalContainer}>
          <View style={styles.calendarSubContainer}>
            <Text style={styles.calendarTitleText}>{FROM}</Text>
            <RNDateTimePicker
              testID="dateTimePicker"
              // value={new Date(dateObj?.from)}
              value={new Date(rangeDate.startDate)}
              mode="date"
              display={'inline'}
              minimumDate={firstDay}
              // is24Hour={true}
              // showTime={{ use12Hours: true, format: "HH:mm a" }}
              onChange={(event, selectedDate) =>
                onDateSelect(event, selectedDate, 'startDate')
              }
              // style={{height: hp(34), marginBottom: hp(-2)}}
            />
            <Text style={styles.calendarTitleText}>{TO}</Text>
            <RNDateTimePicker
              minimumDate={new Date(rangeDate.startDate)}
              testID="dateTimePicker"
              value={new Date(rangeDate.endDate)}
              // maximumDate={new Date()}
              mode={'date'}
              display={'inline'}
              // is24Hour={true}
              // showTime={{ use12Hours: true, format: "HH:mm a" }}
              onChange={(event, selectedDate) =>
                onDateSelect(event, selectedDate, 'endDate')
              }
              // style={{height: hp(34)}}
            />
          </View>
          <Pressable onPress={applyCalendarRange}>
            <View style={styles.actionSheetBtnContainer}>
              <Text style={styles.actionSheetBtnText}>{APPLY}</Text>
            </View>
          </Pressable>
        </View>
      </Modal>
      <DatePickerModal
        locale="en-GB"
        mode="range"
        visible={showCalendarModalAndroid}
        onDismiss={onDismiss}
        dates={new Date()}
        onConfirm={onConfirm}
        inputFormat="DD/MM/YYYY"
        saveLabel="Apply" // optional
        label="Select range" // optional
        startLabel="From" // optional
        endLabel="To" // optional
      />
    </View>
  );
};
export default AddSlotsMentor;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    paddingHorizontal: wp(3),
    backgroundColor: '#FFFFFFCC',
    borderRadius: 10,
  },
  todaySlotsText: {
    color: Colors.black,
    fontSize: 21,
    fontWeight: 'bold',
  },
  container: {
    // marginBottom: 10,
    borderRadius: 8,
  },
  calendarModalContainer: {
    paddingHorizontal: wp(3),
    marginBottom: hp(2),
  },
  dateRange: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    width: '100%',
    marginBottom: 10,
  },
  dateRangeCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  calendarSubContainer: {
    backgroundColor: Colors.paleMintColor,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginTop: hp(5),
  },
  calendarTitleText: {
    color: Colors.blueDarkColor,
    fontSize: 24,
    fontWeight: '600',
    marginLeft: wp(1),
    marginTop: hp(2),
  },
  actionSheetBtnContainer: {
    height: hp(7),
    backgroundColor: Colors.darkPaleMintColor,
    marginTop: hp(1),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSheetBtnText: {fontSize: 20, color: Colors.white, fontWeight: '500'},
  backArrowIcon: {
    tintColor: Colors.black,
    height: 22,
    width: 22,
    marginLeft: 5,
    marginRight: 10,
  },
});

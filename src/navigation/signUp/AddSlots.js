import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Button,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  heightPercentageToDP as hp,
  screenHeight,
  screenWidth,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Close from '../../icons/icon_close.svg';
import {slotsData} from '../../utils/default';
import {useTranslation} from 'react-i18next';
import Colors from '../../customs/Colors';
import moment from 'moment';
import {editProfileSlice} from '../../redux/HomeSlice';
import {useDispatch} from 'react-redux';
import ScreenLoading from '../../components/ScreenLoading';
import {PATIENT} from '../../utils/Strings';

const AddSlot = ({
  close,
  state,
  addSlots,
  slots = [],
  setState,
  isProfile = false,
  email_id,
  type,
}) => {
  const {t} = useTranslation();
  let slots1 =
    (slots &&
      slots.length &&
      slots?.map(val => `${val?.startTime}-${val?.endTime}`)) ||
    [];
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const [selectedSlot, setSlots] = useState([...slots1]);
  const [slotsDataState, setSlotsData] = useState(slotsData);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedDeleteIndex, setDelete] = useState(undefined);
  const [isUpdated, setUpdated] = useState(false);
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
    notset: false,
  });

  const onChangeDate = (text, field) => {
    let hours = parseInt(JSON.stringify(text).slice(12, 14)) - 6;
    let minutes = parseInt(JSON.stringify(text).slice(15, 17)) - 30;

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
      setTime({
        ...time,
        [field]: `${hours < 10 ? `0${hours}` : hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }`,
      });
    } else {
      const h = hours + 12;
      setTime({
        ...time,
        [field]: `${h}:${minutes < 10 ? `0${minutes}` : minutes}`,
      });
    }
  };

  // let filterData = slotsData.filter(val => {
  //   if (!slots1.includes(val?.value)) {
  //     return true;
  //   }
  //   return false;
  // });
  const addDateTime = field => {
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
    if (field == 'startTime') {
      setShowStartTime(false);
      setShowEndTime(true);
    } else {
      let time1 = `${time?.startTime}-${time?.endTime}`;
      setShowEndTime(false);
      addSlots([...slots, time]);
      setSlotsData([
        ...slotsDataState,
        {
          value: `${time?.startTime}-${time?.endTime}`,
          label: `${time?.startTime}-${time?.endTime}`,
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

  const dateRenderItem = ({field}) => {
    let date = new Date();
    if (field == 'endTime') {
      let timeArr = time['startTime']?.split(':');
      date.setHours(timeArr[0]);
      date.setMinutes(timeArr[1]);
    }
    return (
      <DateTimePickerModal
        date={new Date()}
        // minuteInterval={30}
        // mode="datetime"
        mode="time"
        is24Hour={false}
        locale="en-US"
        minimumDate={field == 'startTime' ? new Date() : date}
        is24hourSource="locale"
        onChange={date => onChangeDate(date, field)}
        isVisible={true}
        onConfirm={dateVal => {
          if (Platform.OS === 'android') {
            addDateTime(field);
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
                {`Add ${field == 'startTime' ? 'Start Time' : 'End Time'}`}
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

  return (
    <View
      style={{
        borderRadius: 10,
      }}>
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={true}
        style={{borderRadius: 10, position: 'relative'}}
        onBackdropPress={() => {
          close && close();
        }}
        onBackButtonPress={() => {
          close && close();
        }}
        onRequestClose={() => close && close()}>
        <View
          style={{
            flex: 0.5,
            paddingHorizontal: wp(3),
            backgroundColor: '#FFFFFFCC',
            borderRadius: 10,
            backgroundColor: 'white',
          }}>
          {isLoading ? <ScreenLoading /> : null}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <View />
            <Text
              style={{
                textAlign: 'center',
                color: '#33A3DC',
                fontSize: 18,
                fontWeight: 'bold',
                marginVertical: 10,
              }}>
              Today's Slots
            </Text>
            <Pressable
              onPress={() => {
                close && close();
              }}
              style={{
                paddingLeft: wp(2),
              }}>
              <MaterialIcons name="close" size={25} />
            </Pressable>
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              zIndex: 1000,
              flex: 1,
            }}>
            <DropDownPicker
              listMode="SCROLLVIEW"
              autoScroll={true}
              zIndex={2000}
              open={isOpen}
              setOpen={setOpen}
              value={selectedSlot}
              onSelectItem={val => {
                let labels = val.map(i => i?.value);
                let slotsArray = [];
                labels.map(val => {
                  let [startTime, endTime] = val?.split('-');
                  let updateState = {
                    startTime: startTime?.includes(':')
                      ? startTime
                      : `${startTime}:00`,
                    endTime: endTime?.includes(':')
                      ? endTime
                      : `${state?.endTime}:00`,
                  };
                  slotsArray.push(updateState);
                });
                let data = [...slotsArray];
                addSlots(data);
                setSlots(labels);
              }}
              items={slotsDataState}
              placeholder={'Select Slot'}
              dropDownContainerStyle={{borderColor: Colors.blueDarkColor}}
              style={{
                marginBottom: 10,
                backgroundColor: Colors.paleMintColor,
                borderColor: Colors.blueDarkColor,
              }}
              containerStyle={{
                flex: 1,
              }}
              multiple={true}
            />
          </View> */}
          <Pressable
            onPress={setShowStartTime}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: 'lightgray',
              // backgroundColor: Colors.blueDarkColor,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 7,
            }}>
            <View>
              {slots.length ? (
                <Text>{`${slots.length} ${
                  slots.length == 1
                    ? 'An item has been selected'
                    : 'items have been selected'
                }`}</Text>
              ) : (
                <Text>Select Time</Text>
              )}
            </View>
            <MaterialIcons name="access-time" size={22} />
          </Pressable>
          {showStartTime ? dateRenderItem({field: 'startTime'}) : null}
          {showEndTime ? dateRenderItem({field: 'endTime'}) : null}
          {/* <View style={{alignItems: 'center'}}>
            <Pressable
              onPress={() => {
                let [startTime, endTime] = selectedSlot?.split('-');
                let updateState = {
                  startTime: startTime?.includes(':')
                    ? startTime
                    : `${startTime}:00`,
                  endTime: endTime?.includes(':')
                    ? endTime
                    : `${state?.endTime}:00`,
                };
                let data = [...slots, updateState];
                addSlots(data);
                setSlots('');
              }}
              disabled={!selectedSlot}
              style={{
                backgroundColor: 'green',
                marginTop: 10,
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderColor: 'white',
                opacity: selectedSlot ? 1 : 0.5,
              }}>
              <Text style={{color: 'white'}}>Add</Text>
            </Pressable>
          </View> */}

          {slots && slots.length && !isOpen ? (
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
                let startTime = `${
                  startH > 12 ? startH - 12 : startH
                }:${startM} ${AM_PM}`;
                let endTime = `${
                  endH > 12 ? endH - 12 : endH
                }:${endM} ${AM_PM}`;
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
                          addSlots([...slotsData]);
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
                return (
                  <View
                    style={{
                      borderRadius: 4,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginLeft: 5,
                      borderWidth: 1,
                      borderColor: 'gray',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      borderColor: '#33A3DC',
                    }}>
                    <View style={{}}>
                      <Text style={{paddingBottom: 5}}>
                        Start Time{` : ${item?.startTime}`}
                      </Text>
                      <Text>End Time {`  : ${item?.endTime}`}</Text>
                    </View>
                    <Pressable
                      style={{}}
                      // onPress={() => {
                      //   let keyIndex = `${item.startTime}-${item.endTime}`;
                      //   let selectedSlotNew = [...selectedSlot];
                      //   let selectedIndexKey =
                      //     selectedSlotNew.indexOf(keyIndex);
                      //   let data = [...slots];
                      //   data.splice(index, 1);
                      //   selectedSlotNew.splice(selectedIndexKey, 1);
                      //   addSlots(data);
                      //   setSlots(selectedSlotNew);
                      // }}
                    >
                      <Text
                        style={{
                          color: '#33A3DC',
                          fontSize: 15,
                          fontWeight: '500',
                        }}>
                        {`${new Date().getFullYear()}-${
                          new Date().getMonth() + 1
                        }-${new Date().getDate()}`}
                      </Text>
                    </Pressable>
                  </View>
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
                  const resp = await dispatch(
                    editProfileSlice({
                      emailId: email_id,
                      type: type == PATIENT ? 'patient' : 'mentor',
                      slots,
                    }),
                  );
                  setLoading(false);
                  close && close();
                } catch (err) {
                  setLoading(false);
                }
              }}
              style={{
                paddingBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Colors.blueDarkColor,
                  fontSize: 17,
                  fontWeight: 'bold',
                }}>
                Save
              </Text>
            </Pressable>
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

export default AddSlot;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  calendarModalContainer: {
    // width: screenWidth,
    // alignSelf: 'center',
    paddingHorizontal: wp(3),
    marginBottom: hp(2),
  },
});

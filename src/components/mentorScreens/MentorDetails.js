/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import Colors from '../../customs/Colors';
// import ArrowRight from '../icons/rightArrow.svg';
import Close from '../../icons/icon_close.svg';
import Modal from 'react-native-modal';
import convertLang, {PATIENT, MENTOR} from '../../utils/Strings';

import {
  heightPercentageToDP as hp,
  screenHeight,
  screenWidth,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';
import {useDispatch, useSelector} from 'react-redux';
import {
  bookAppointmentSlice,
  getMentorAllSlots,
  sendNotificationSlice,
} from '../../redux/HomeSlice';
import ScreenLoading from '../ScreenLoading';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const MentorDetails = ({showDetails, close, selectedMentorData}) => {
  const {t} = useTranslation();
  const {
    DAY_AFTER_TOMORROW,
    TODAY,
    TOMORROW,
    AVAILABLE_SLOTS,
    NO_SLOTS_AVAILABLE_TO_BOOK,
    SCHEDULE_APPOINTMENT,
  } = t && convertLang(t);
  const {email} = useSelector(state => state.auth);
  const {profileData, threeDaysSlots = []} = useSelector(state => state.home);
  const [selectedSlot, setSlot] = useState('');
  const [bookSlots, setBookSlots] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState({dayStr: TODAY});
  const dispatch = useDispatch();
  const [state, setState] = useState({
    mentorEmailId: selectedMentorData?.email_id,
    patientEmailId: email,
    startTime: '',
    endTime: '',
    mentorName: `${selectedMentorData?.firstName} ${selectedMentorData?.lastName}`,
    patientName:
      profileData && `${profileData?.firstName} ${profileData?.lastName}`,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const {payload} = await dispatch(
        getMentorAllSlots({uniqueId: selectedMentorData?.uniqueId}),
      );

      if (payload.Items.length) {
        setBookSlots(payload.Items[0]?.slots);
      }
      setLoading(false);
      // handleSelectday(TODAY);
    })();
  }, [dispatch, selectedMentorData?.uniqueId]);

  const handleSelectday = useCallback(
    day => {
      if (day === TODAY) {
        setSelectedDay({dayStr: TODAY});
        setBookSlots(threeDaysSlots[0]?.slots);
      } else if (day === TOMORROW) {
        setSelectedDay({dayStr: TOMORROW});
        setBookSlots(threeDaysSlots[1]?.slots);
      } else if (day === DAY_AFTER_TOMORROW) {
        setSelectedDay({dayStr: DAY_AFTER_TOMORROW});
        setBookSlots(threeDaysSlots[2]?.slots);
      }
    },
    [threeDaysSlots, TODAY, TOMORROW, DAY_AFTER_TOMORROW],
  );

  const slotsDaysTab = day => {
    return (
      <Pressable onPress={() => handleSelectday(day)}>
        <View
          style={{
            backgroundColor:
              selectedDay.dayStr === day
                ? Colors.darkPaleMintColor
                : Colors.transparent,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 4,
          }}>
          <Text
            style={{
              color: selectedDay.dayStr === day ? Colors.white : Colors.black,
              fontWeight: selectedDay.dayStr === day ? '700' : '500',
              fontSize: selectedDay.dayStr === day ? 16 : 15,
            }}>
            {day}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      {showDetails ? (
        <Modal
          onBackButtonPress={() => close && close()}
          onRequestClose={() => close && close()}
          animationIn={'slideInRight'}
          animationOut={'slideOutRight'}
          backdropColor={'#00000029'}
          backdropOpacity={1}
          isVisible={true}
          animationInTiming={700}
          animationOutTiming={600}
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            width: screenWidth * 0.9,
            height: screenHeight,
            margin: 0,
            paddingVertical: hp(5),
            paddingHorizontal: wp(4),
            backgroundColor: 'white',
          }}>
          {isLoading ? <ScreenLoading /> : null}
          <Pressable onPress={() => close && close()}>
            <Close
              height={25}
              width={25}
              color={'black'}
              style={{marginLeft: -3}}
            />
          </Pressable>
          <View
            style={{
              borderBottomWidth: 1,
              paddingBottom: 5,
              borderColor: 'lightgray',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 17,
                fontWeight: '600',
                color: 'gray',
              }}>
              {AVAILABLE_SLOTS}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            {slotsDaysTab(TODAY)}
            {slotsDaysTab(TOMORROW)}
            {slotsDaysTab(DAY_AFTER_TOMORROW)}
          </View>
          {bookSlots && bookSlots.length ? (
            <FlatList
              columnWrapperStyle={{flexWrap: 'wrap'}}
              scrollEventThrottle={1900}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={bookSlots}
              numColumns={2}
              // horizontal
              // showsHorizontalScrollIndicator={false}
              style={{marginTop: 15, flexDirection: 'row', flexWrap: 'wrap'}}
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => {
                let slot = `${item?.startTime}-${item?.endTime}`;
                let check = bookSlots && bookSlots?.includes(slot);
                let [startH, startM] = item?.startTime.split(':');
                let [endH, endM] = item?.endTime.split(':');
                let AM_PM = startH >= 12 ? 'PM' : 'AM';
                let startTime = `${
                  startH > 12 ? startH - 12 : startH
                }:${startM} ${AM_PM}`;
                let endTime = `${
                  endH > 12 ? endH - 12 : endH
                }:${endM} ${AM_PM}`;
                let shwSlot = `${startTime}-${endTime}`;
                return (
                  <TouchableOpacity
                    key={index}
                    disabled={check}
                    style={{paddingTop: 5, opacity: check ? 0.5 : 1}}
                    onPress={() => {
                      // Extract the time from the "10:30" string
                      //   const startDateTime = setDateTime(item?.startTime);
                      //   const endDateTime = setDateTime(item?.endTime);
                      setSlot(slot);
                      setState({
                        ...state,
                        startTime: item?.startTime,
                        endTime: item?.endTime,
                      });
                    }}>
                    <View
                      style={{
                        marginRight: 10,
                        borderRadius: 13,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        backgroundColor:
                          slot === selectedSlot
                            ? Colors.darkPaleMintColor
                            : 'gray',
                        marginBottom: 10,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                        }}>
                        {shwSlot || ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>{NO_SLOTS_AVAILABLE_TO_BOOK}</Text>
            </View>
          )}
          {selectedSlot ? (
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Are you sure wants to schedule appointment!',
                  `Booking Slot : ${selectedSlot}`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                    },
                    {
                      text: 'Schedule',
                      onPress: async () => {
                        try {
                          setLoading(true);
                          const {patientEmailId, patientName, ...payload} =
                            state;
                          await dispatch(
                            bookAppointmentSlice({
                              ...payload,
                              mentorEmailId: selectedMentorData.emailId,
                              mentorName: selectedMentorData.firstName,
                              date: moment().format('YYYY-MM-DD'),
                            }),
                          );
                          close && close();
                          setLoading(false);
                          selectedMentorData?.fcmToken &&
                            dispatch(
                              sendNotificationSlice({
                                fcmToken: selectedMentorData?.fcmToken,
                                data: {
                                  title: `Meeting scheduled with patient: ${state?.patientName}`,
                                  body: `Scheduled today at : ${selectedSlot}`,
                                },
                              }),
                            );
                        } catch (err) {
                          setLoading(false);
                        }
                      },
                    },
                  ],
                );
              }}
              style={{
                backgroundColor: Colors.darkPaleMintColor,
                paddingVertical: 8,
                borderRadius: 4,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                {SCHEDULE_APPOINTMENT}
              </Text>
            </Pressable>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
};

export default MentorDetails;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  crossButton: {
    marginBottom: 20,
  },
  slotContainer: {
    marginRight: 10,
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  slotText: {
    color: 'black',
  },
  backgroundGreen: {
    backgroundColor: Colors.parrotGreen,
  },
  backgroundSaffron: {
    backgroundColor: Colors.saffron,
  },
  bookSlotContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDarkBlue,
  },
  icon: {
    padding: 5,
    paddingRight: 20,
  },
  dayCont: {
    borderWidth: 1,
    borderColor: Colors.grayishBlue,
    padding: 12,
    borderRadius: 6,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

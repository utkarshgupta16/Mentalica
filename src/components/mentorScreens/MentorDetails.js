import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../customs/Colors';
// import ArrowRight from '../icons/rightArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Close from '../../icons/icon_close.svg';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  screenHeight,
  screenWidth,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';
import {useDispatch, useSelector} from 'react-redux';
import {
  bookAppointmentSlice,
  getBooksSlots,
  getMentorAllSlots,
  getScheduledAppointmentsSlice,
  sendNotificationSlice,
} from '../../redux/HomeSlice';
import ScreenLoading from '../ScreenLoading';
import moment from 'moment';
const MentorDetails = ({showDetails, close, selectedMentorData}) => {
  const {email} = useSelector(state => state.auth);
  const {profileData} = useSelector(state => state.home);
  const [selectedSlot, setSlot] = useState('');
  const [bookSlots, setBookSlots] = useState([]);
  const [isLoading, setLoading] = useState(false);
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

  // useEffect(() => {
  //   (async () => {
  //     setLoading(true);
  //     let {payload = []} = await dispatch(
  //       getBooksSlots({email: selectedMentorData?.email_id}),
  //     );
  //     let data =
  //       payload &&
  //       payload.map(val => {
  //         const {startTime, endTime} = (val?.slots && val?.slots[0]) || {};
  //         return `${startTime}-${endTime}`;
  //       });
  //     setBookSlots(data);
  //     setLoading(false);
  //   })();
  // }, [dispatch, selectedMentorData?.email_id]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let {payload = []} = await dispatch(
        getMentorAllSlots({uniqueId: selectedMentorData?.uniqueId}),
      );
      setBookSlots(payload);
      setLoading(false);
    })();
  }, [dispatch, selectedMentorData?.email_id]);

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
              Today's Available Slots
            </Text>
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
                      const currentDate = new Date();

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
                          slot == selectedSlot ? 'green' : 'gray',
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
              <Text>{`No Slots Available to Book`}</Text>
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
                          const resp = await dispatch(
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
                backgroundColor: 'green',
                paddingVertical: 8,
                borderRadius: 4,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Schedule Appointment
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDarkBlue,
  },
  icon: {
    padding: 5,
    paddingRight: 20,
  },
});

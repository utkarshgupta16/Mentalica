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
  getScheduledAppointmentsSlice,
} from '../../redux/HomeSlice';
const MentorDetails = ({showDetails, close, selectedMentorData}) => {
  const {email} = useSelector(state => state.auth);
  const {profileData: {Items = []} = {}} = useSelector(state => state.home);
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
      Items &&
      Items.length &&
      Items[0] &&
      `${Items[0]?.firstName} ${Items[0]?.lastName}`,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      let {payload = []} = await dispatch(
        getBooksSlots({email: selectedMentorData?.email_id}),
      );
      let data =
        payload &&
        payload.map(val => {
          const {startTime, endTime} = (val?.slots && val?.slots[0]) || {};
          return `${startTime}-${endTime}`;
        });
      setBookSlots(data);
      setLoading(false);
    })();
  }, []);

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
          {isLoading ? (
            <View
              style={{
                backgroundColor: '#00000082',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                left: 0,
                bottom: 0,
                top: 0,
                right: 0,
              }}>
              <ActivityIndicator color={'green'} size="large" />
            </View>
          ) : null}

          <Pressable onPress={() => close && close()}>
            <Close
              height={25}
              width={25}
              color={'black'}
              style={{marginLeft: -3}}
            />
          </Pressable>
          <Text style={{textAlign: 'center', fontSize: 18, marginVertical: 10}}>
            Email : {selectedMentorData?.email_id}
          </Text>
          <Text style={{textAlign: 'center', fontSize: 18, marginVertical: 10}}>
            Full Name :{' '}
            {`${selectedMentorData?.firstName} ${selectedMentorData?.lastName}`}
          </Text>

          {selectedMentorData?.slots && selectedMentorData?.slots.length ? (
            <FlatList
              data={selectedMentorData?.slots}
              // horizontal
              columnWrapperStyle={{flexWrap: 'wrap'}}
              scrollEventThrottle={1900}
              numColumns={3}
              style={{marginTop: 15}}
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => {
                let slot = `${item?.startTime}-${item?.endTime}`;
                let check = bookSlots && bookSlots?.includes(slot);
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
                        {slot}
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
              }}
            />
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
                          const resp = await dispatch(
                            bookAppointmentSlice(state),
                          );
                          console.log('bookAppointmentSlice', resp);
                          close && close();
                          setLoading(false);
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
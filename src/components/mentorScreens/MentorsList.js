import {
  Text,
  Image,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  screenHeight,
  screenWidth,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';
import {useDispatch} from 'react-redux';
import {getAllMentorList} from '../../redux/HomeSlice';
import Close from '../../icons/icon_close.svg';
import Modal from 'react-native-modal';
import MentorDetails from './MentorDetails';
const green = '#464E2E';
const offWhite = '#F5F7F8';
const lightGray = '#F1EFEF';
const lightRed = '#E76161';
const greenText = '#618264';
const lightBlack = '#45474B';

const MentorsList = () => {
  const [showAppointmentBtn, setShowAppointmentBtn] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [allMentors, setAllMentors] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [selectedMentorData, setMentor] = useState({slots: []});
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const {payload} = await dispatch(getAllMentorList());
        console.log('setAllMentors', payload?.Items);
        setAllMentors(payload.Items);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
      // console.log('getAllMentorList', payload.Items);
    })();
  }, []);

  const renderExperties = ({data, label}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.expertiesText}>{`${label} :`}</Text>
        {data && data.length ? (
          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View
                  key={index}
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
                      fontSize: 14,
                      fontWeight: '500',
                      textAlign: 'center',
                    }}>
                    {item?.charAt(0).toUpperCase() + item?.slice(1)}
                  </Text>
                </View>
              );
            }}
          />
        ) : null}
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    const expertiseArr = item?.expertise?.split(',') || [];
    const languageArr = item?.language?.split(',') || [];
    return (
      <Pressable
        key={index}
        onPress={() => {
          setMentor(item);
          setShowDetails(!showDetails);
        }}
        style={styles.flatListContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.imageAndNameCont}>
            <Image
              source={require('../../icons/doctor.jpg')}
              style={styles.profilePic}
            />
            {/* <Image style={styles.profilePic} source={{uri: item.imageUrl}} /> */}
            <View>
              <Text style={styles.mentorNameTxt} numberOfLines={1}>
                {`${item?.firstName} ${item?.lastName}`}
              </Text>
              <Text style={styles.experienceText}>
                {item?.experience}+ years of experience
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text>starts @</Text>
                <Text style={styles.feesTxt}>₹{item?.fees} for 50 mins</Text>
              </View>
            </View>
          </View>
          {renderExperties({data: expertiseArr, label: 'Experties'})}
          {renderExperties({data: languageArr, label: 'Speaks'})}
        </View>
        {/* <View style={styles.bookBtnCont}>
          {showAppointmentBtn ? (
            <Pressable onPress={() => setShowAppointmentBtn(false)}>
              <View style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Select and book slot</Text>
              </View>
            </Pressable>
          ) : (
            <View style={styles.slotListCont}>
              <Text style={{fontSize: 15}}>Available slots: </Text>
              <View style={styles.slotList}>
                <FlatList
                  data={item?.slots}
                  renderItem={renderSlotsItem}
                  keyExtractor={key => key}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
          )}
        </View> */}
      </Pressable>
    );
  };

  const renderSlotsItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setShowAppointmentBtn(true);
          setModalVisible(true);
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
            {item?.startTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         flex: 1,
  //       }}>
  //       <Text>
  //         <ActivityIndicator size={'large'} color="#0000ff" />
  //       </Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <FlatList
        data={allMentors}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      />
      {showDetails ? (
        <MentorDetails
          showDetails={showDetails}
          close={() => setShowDetails(false)}
          selectedMentorData={selectedMentorData}
        />
      ) : null}
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
          <ActivityIndicator color={'green'} size="large" />
        </View>
      ) : null}
    </View>
  );
};

const renderExpertiesItem = ({item}) => {
  return (
    <View
      style={{
        marginRight: 10,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: '#F0F0F0',
        marginBottom: 10,
      }}>
      <Text
        style={{
          color: lightBlack,
        }}>
        {item}
      </Text>
    </View>
  );
};

const renderLaunguageItem = ({item}) => {
  return (
    <Text style={{marginRight: 10, color: lightBlack, marginBottom: 10}}>
      {item}
    </Text>
  );
};

const renderSessionModeItem = ({item}) => {
  return (
    <Text style={{marginRight: 10, fontWeight: '600', color: lightBlack}}>
      {item}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '82%',
  },
  flatListContainer: {
    borderWidth: 1,
    borderColor: '#D8D9DA',
    borderRadius: 7,
    marginHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
  },
  cardContainer: {
    padding: 10,
  },
  imageAndNameCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 130,
    borderWidth: 1,
    borderColor: '#D8D9DA',
    borderRadius: 5,
    marginRight: 10,
    resizeMode: 'cover',
  },
  mentorNameTxt: {
    fontSize: 19,
    fontWeight: '500',
    color: greenText,
    marginBottom: 10,
    width: wp(50),
  },
  experienceText: {
    fontSize: 14,
    color: lightBlack,
  },
  feesTxt: {
    color: 'black',
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 14,
  },

  expertiesCont: {
    flexDirection: 'row',
    width: '75%',
    marginBottom: hp(1),
  },
  expertiesText: {
    marginRight: 10,
    fontWeight: '500',
    fontSize: 15,
    color: 'black',
  },
  languageCont: {
    flexDirection: 'row',
    width: '78%',
    marginBottom: hp(1),
  },
  launguageText: {
    marginRight: 10,
    marginTop: 10,
    fontWeight: '500',
    fontSize: 15,
  },
  sessionCont: {
    flexDirection: 'row',
    width: '78%',
    marginBottom: hp(1),
  },
  sessionText: {
    marginRight: 10,
  },
  bookBtnCont: {
    padding: 10,
    paddingVertical: 20,
    backgroundColor: lightGray,
    alignItems: 'center',
  },
  bookBtn: {
    height: 40,
    width: wp(50),
    paddingHorizontal: 17,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: green,
    shadowColor: 'black',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  bookBtnText: {
    color: 'white',
    fontWeight: '700',
  },
  bookongTimeText: {
    color: lightRed,
  },
  slotListCont: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  slotList: {
    marginLeft: 10,
    width: wp(50),
    paddingTop: hp(1.5),
  },
});

export default MentorsList;

const data = [
  {
    id: 1,
    name: 'Trisha Trivedi',
    experience: 2,
    fees: 1500,
    experties: [
      'Depression',
      'Anxiety',
      'Relationship',
      'Stress',
      'Addiction',
      'Loss of Motivation',
      'Genral well-being',
    ],
    launguage: ['English', 'Hindi', 'Marathi'],
    sessionMode: ['Videos', 'Voice', 'Chat'],
    imageUrl:
      'https://png.pngtree.com/png-vector/20220523/ourmid/pngtree-female-employee-working-at-the-company-png-image_4719739.png',
  },
  {
    id: 2,
    name: 'Kaushiki Pandey',
    experience: 2,
    fees: 1500,
    experties: [
      'Depression',
      'Anxiety',
      'Relationship',
      'Stress',
      'Addiction',
      'Loss of Motivation',
      'Genral well-being',
    ],
    launguage: ['English', 'Hindi', 'Gujrati'],
    sessionMode: ['Videos', 'Voice', 'Chat'],
    imageUrl:
      'https://png.pngtree.com/png-vector/20220901/ourmid/pngtree-company-employee-avatar-icon-wearing-a-suit-png-image_6133899.png',
  },
  {
    id: 3,
    name: 'Roshan Jambhulkar',
    experience: 2,
    fees: 1800,
    experties: [
      'Depression',
      'Anxiety',
      'Relationship',
      'Stress',
      'Addiction',
      'Loss of Motivation',
      'Genral well-being',
    ],
    launguage: ['English', 'Hindi', 'Marathi'],
    sessionMode: ['Videos', 'Voice', 'Chat'],
    imageUrl:
      'https://png.pngtree.com/png-vector/20220901/ourmid/pngtree-company-employee-avatar-icon-wearing-a-suit-png-image_6133899.png',
  },
];

const slots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:30 '];

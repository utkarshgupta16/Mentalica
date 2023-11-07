import {
  Text,
  Image,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';
import {getMethod} from '../../redux/axiosService/AxiosMethods';
import {Amplify, Auth} from 'aws-amplify';
import Modal from 'react-native-modal';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const green = '#464E2E';
const offWhite = '#F5F7F8';
const lightGray = '#F1EFEF';
const lightRed = '#E76161';
const greenText = '#618264';
const lightBlack = '#45474B';

const MentorsList = () => {
  const [showAppointmentBtn, setShowAppointmentBtn] = useState(true);
  const [allMentors, setAllMentors] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const getMentorsList = await getMethod(
          'https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getMentorList',
        );
        setAllMentors(getMentorsList);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    })();
  }, []);

  const renderItem = ({item}) => {
    console.log(item);
    return (
      <View style={styles.flatListContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.imageAndNameCont}>
            <Image
              style={styles.profilePic}
              source={{
                uri: 'https://png.pngtree.com/png-vector/20220901/ourmid/pngtree-company-employee-avatar-icon-wearing-a-suit-png-image_6133899.png',
              }}
            />
            <View>
              <Text style={styles.mentorNameTxt}>
                {item.Attributes.find(attr => attr.Name === 'custom:firstName')
                  .Value || ''}{' '}
                {item.Attributes.find(attr => attr.Name === 'custom:lastName')
                  .Value || ''}
              </Text>
              <Text style={styles.experienceText}>
                {item?.Attributes?.find(
                  attr => attr.Name === 'custom:experience',
                )?.Value || ''}
                + years of experience
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text>starts @</Text>
                <Text style={styles.feesTxt}>
                  ₹
                  {item?.Attributes?.find(attr => attr.Name === 'custom:fees')
                    ?.Value || ''}{' '}
                  for 50 mins
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.expertiesCont}>
            <Text style={styles.expertiesText}>
              Experties:{' '}
              {item?.Attributes?.find(attr => attr.Name === 'custom:expertise')
                ?.Value || ''}{' '}
            </Text>
            <View>
              <FlatList
                data={item.experties}
                renderItem={renderExpertiesItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                nestedScrollEnabled={true}
              />
            </View>
          </View>

          <View style={styles.languageCont}>
            <Text style={styles.launguageText}>Speaks:</Text>
            <View>
              {/* <FlatList
                data={item.launguage}
                renderItem={renderLaunguageItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              /> */}
              <Text>
                {item?.Attributes?.find(attr => attr.Name === 'custom:language')
                  ?.Value || ''}{' '}
              </Text>
            </View>
          </View>

          <View style={styles.sessionCont}>
            <Text style={styles.sessionText}>Session Mode:</Text>
            <View>
              <Text style={{fontWeight: '600'}}>Video, Voice, Chat</Text>
              {/* <FlatList
                data={item.sessionMode}
                renderItem={renderSessionModeItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              /> */}
            </View>
          </View>
        </View>
        <View style={styles.bookBtnCont}>
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
                  data={slots}
                  renderItem={renderSlotsItem}
                  keyExtractor={key => key}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const keyExtractor = item => item.Username;

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
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={allMentors}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
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
  },
  languageCont: {
    flexDirection: 'row',
    width: '78%',
    marginBottom: hp(1),
  },
  launguageText: {
    marginRight: 10,
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



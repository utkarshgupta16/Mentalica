import {
  Text,
  Image,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';

const green = '#464E2E';
const offWhite = '#F5F7F8';
const lightGray = '#F1EFEF';
const lightRed = '#E76161';
const greenText = '#618264';
const lightBlack = '#45474B';

const MentorsList = () => {
  const [showAppointmentBtn, setShowAppointmentBtn] = useState(true);
  // const [allMentors, setAllMentors] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.flatListContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.imageAndNameCont}>
            <Image style={styles.profilePic} source={{uri: item.imageUrl}} />
            <View>
              <Text style={styles.mentorNameTxt}>
                Name:{' '}
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
                <Text style={styles.feesTxt}>₹{item.fees} for 50 mins</Text>
              </View>
            </View>
          </View>
          <View style={styles.expertiesCont}>
            <Text style={styles.expertiesText}>
              Experties:{item.experience}
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
              <FlatList
                data={item.launguage}
                renderItem={renderLaunguageItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              />
            </View>
          </View>

          <View style={styles.sessionCont}>
            <Text style={styles.sessionText}>Speaks:</Text>
            <View>
              <FlatList
                data={item.sessionMode}
                renderItem={renderSessionModeItem}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              />
            </View>
          </View>
        </View>
        <View style={styles.bookBtnCont}>
          {showAppointmentBtn ? (
            <Pressable onPress={() => setShowAppointmentBtn(false)}>
              <View style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>
                  Show slots for appointment
                </Text>
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

  // const renderItem = ({item}) => (
  //   <View>
  //     <Text>Username: {item.Username}</Text>
  //     <Text>custom:type: {item['custom:type']}</Text>
  //     <Text>custom:expertise: {item['custom:expertise']}</Text>
  //     {/* Add more Text components for other attributes as needed */}
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <FlatList
        data={mentorsData}
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
  },
  expertiesText: {
    marginRight: 10,
  },
  languageCont: {
    flexDirection: 'row',
    width: '78%',
  },
  launguageText: {
    marginRight: 10,
  },
  sessionCont: {
    flexDirection: 'row',
    width: '78%',
  },
  sessionText: {
    marginRight: 10,
  },
  bookBtnCont: {
    padding: 10,
    paddingVertical: 20,
    backgroundColor: lightGray,
  },
  bookBtn: {
    height: 40,
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
  },
  slotList: {
    marginLeft: 10,

    width: wp(50),
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

const slots = ['1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8'];

const mentorsData = [
  {
    Username: '183fa4d3-f545-466d-b935-8d30bf4e6eb1',
    Attributes: [
      {
        Name: 'custom:type',
        Value: 'Mentor',
      },
      {
        Name: 'custom:expertise',
        Value: 'danger',
      },
      {
        Name: 'sub',
        Value: '183fa4d3-f545-466d-b935-8d30bf4e6eb1',
      },
      {
        Name: 'email_verified',
        Value: 'false',
      },
      {
        Name: 'custom:firstName',
        Value: 'Wf',
      },
      {
        Name: 'custom:temporaryCity',
        Value: 'Sfdjn',
      },
      {
        Name: 'custom:phoneNumber',
        Value: 'E',
      },
      {
        Name: 'custom:lastName',
        Value: 'Wfe',
      },
      {
        Name: 'email',
        Value: 'Tribhuwan6@gmail.com',
      },
      {
        Name: 'custom:city',
        Value: 'Feed',
      },
    ],
  },
  {
    Username: '21a5e85f-b32a-4a86-a474-ef5800ef12e2',
    Attributes: [
      {
        Name: 'custom:type',
        Value: 'Mentor',
      },
      {
        Name: 'sub',
        Value: '21a5e85f-b32a-4a86-a474-ef5800ef12e2',
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'custom:temporaryCity',
        Value: 'Singapore',
      },
      {
        Name: 'custom:lastName',
        Value: 'Jambhuilkar',
      },
      {
        Name: 'custom:city',
        Value: 'California',
      },
      {
        Name: 'custom:expertise',
        Value: 'danger',
      },
      {
        Name: 'custom:firstName',
        Value: 'roshan',
      },
      {
        Name: 'custom:phoneNumber',
        Value: '1234567890',
      },
      {
        Name: 'email',
        Value: 'Jambhulkar.roshan@thinksys.com',
      },
    ],
  },
  {
    Username: '2451a9aa-1afa-491c-a73a-f080615dbf8d',
    Attributes: [
      {
        Name: 'custom:type',
        Value: 'Mentor',
      },
      {
        Name: 'custom:expertise',
        Value: 'loneliness',
      },
      {
        Name: 'sub',
        Value: '2451a9aa-1afa-491c-a73a-f080615dbf8d',
      },
      {
        Name: 'email_verified',
        Value: 'false',
      },
      {
        Name: 'custom:firstName',
        Value: 'Fslkmfw',
      },
      {
        Name: 'custom:temporaryCity',
        Value: 'Sfafx',
      },
      {
        Name: 'custom:phoneNumber',
        Value: 'Wef',
      },
      {
        Name: 'custom:lastName',
        Value: 'Few',
      },
      {
        Name: 'email',
        Value: 'tribhuwan5@gmail.com',
      },
      {
        Name: 'custom:city',
        Value: 'Fe',
      },
    ],
  },
  {
    Username: '44b4c32c-00f8-4187-b291-0dee38b03064',
    Attributes: [
      {
        Name: 'custom:type',
        Value: 'Mentor',
      },
      {
        Name: 'custom:expertise',
        Value: 'danger',
      },
      {
        Name: 'sub',
        Value: '44b4c32c-00f8-4187-b291-0dee38b03064',
      },
      {
        Name: 'email_verified',
        Value: 'false',
      },
      {
        Name: 'custom:firstName',
        Value: 'Tribhuwan',
      },
      {
        Name: 'custom:temporaryCity',
        Value: 'Gurgaon',
      },
      {
        Name: 'custom:phoneNumber',
        Value: '9999999999',
      },
      {
        Name: 'custom:lastName',
        Value: 'Bhandari',
      },
      {
        Name: 'email',
        Value: 'Bhandari.tribhuwan@thinksys.com',
      },
      {
        Name: 'custom:city',
        Value: 'Nainital',
      },
    ],
  },
  {
    Username: '93ea068e-314e-4142-97dc-3295d9ca0830',
    Attributes: [
      {
        Name: 'custom:type',
        Value: 'Mentor',
      },
      {
        Name: 'custom:expertise',
        Value: 'loneliness',
      },
      {
        Name: 'sub',
        Value: '93ea068e-314e-4142-97dc-3295d9ca0830',
      },
      {
        Name: 'email_verified',
        Value: 'false',
      },
      {
        Name: 'custom:firstName',
        Value: 'Fslkmfw',
      },
      {
        Name: 'custom:temporaryCity',
        Value: 'Sfafx',
      },
      {
        Name: 'custom:phoneNumber',
        Value: 'Wef',
      },
      {
        Name: 'custom:lastName',
        Value: 'Few',
      },
      {
        Name: 'email',
        Value: 'tribhuwan4@gmail.com',
      },
      {
        Name: 'custom:city',
        Value: 'Fe',
      },
    ],
  },
  {
    Username: 'ae77c3d0-f93e-4237-8900-11c04d430473',
    Attributes: [
      {
        Name: 'custom:type',
        Value: 'Mentor',
      },
      {
        Name: 'custom:expertise',
        Value: 'loneliness',
      },
      {
        Name: 'sub',
        Value: 'ae77c3d0-f93e-4237-8900-11c04d430473',
      },
      {
        Name: 'email_verified',
        Value: 'false',
      },
      {
        Name: 'custom:firstName',
        Value: 'Sf',
      },
      {
        Name: 'custom:temporaryCity',
        Value: 'Sf',
      },
      {
        Name: 'custom:phoneNumber',
        Value: 'F',
      },
      {
        Name: 'custom:lastName',
        Value: 'Fs',
      },
      {
        Name: 'email',
        Value: 'Tribhuwan7@gmail.com',
      },
      {
        Name: 'custom:city',
        Value: 'Sfs',
      },
    ],
  },
];

import {
  // Text,
  Image,
  // View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import View from '../wrapperComponent/ViewWrapper.js';
import Text from '../wrapperComponent/TextWrapper.js';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  screenHeight,
  screenWidth,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';
import {useDispatch, useSelector} from 'react-redux';
import {getAllMentorList, getTwilloChatTokenSlice} from '../../redux/HomeSlice';
import Close from '../../icons/icon_close.svg';
import Modal from 'react-native-modal';
import MentorDetails from './MentorDetails';
import Colors from '../../customs/Colors';
import ScreenLoading from '../ScreenLoading';
import RenderHorizontalData from './RenderHorizontalData.js';
import {Client, User} from '@twilio/conversations';
import {CHAT_ROOM_SCREEN, MESSAGES_TAB_ROUTE} from '../../utils/route';
import {TwilioService} from '../../screens/Twillio/ConversationService';
import {updateCurrentConversation} from '../../redux/CurrentConvoReducer';
import {useTranslation} from 'react-i18next';
import convertLang from '../../utils/Strings.js';
const green = '#464E2E';
const lightGray = '#F1EFEF';
const lightRed = '#E76161';
const lightBlack = '#45474B';

const MentorsList = ({navigation, handleShadowVisible}) => {
  const [showAppointmentBtn, setShowAppointmentBtn] = useState(true);
  const {email: username} = useSelector(state => state.auth);
  const profileData = useSelector(state => state.home.profileData);
  const [isLoading, setLoading] = useState(true);
  const [allMentors, setAllMentors] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [selectedMentorData, setMentor] = useState({slots: []});
  const [showDetails, setShowDetails] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const {t} = useTranslation();
  const {
    CHAT,
    EXPERTIES,
    SPEAKS,
    YEARS_OF_EXPERIENCE,
    FOR,
    MINS_STARTS,
    STARTS,
    MINS,
  } = t && convertLang(t);

  const {
    isMentorsDataLoading,
    mentorsData = {},
    darkMode,
  } = useSelector(state => state.home);

  useEffect(() => {
    dispatch(getAllMentorList());
  }, [dispatch]);

  const getTokenNew = async username => {
    let {payload} = await dispatch(getTwilloChatTokenSlice({email: username}));
    return payload?.accessToken;
  };

  const handleOnScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 0) {
      handleShadowVisible(true);
    } else {
      handleShadowVisible(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllMentorList());
    setRefreshing(false);
  };

  const addConversation = (client, mentorData) => {
    const channelName = `${mentorData?.emailId}-${username}`;
    client
      .getUser(mentorData?.emailId)
      .then(res => {
        client
          .createConversation({
            friendlyName: channelName,
            uniqueName: channelName,
            attributes: {
              participants: [
                {
                  profileId: profileData?.uniqueId,
                  identity: username,
                  username: `${profileData?.firstName} ${profileData?.lastName}`,
                },
                {
                  profileId: mentorData?.uniqueId,
                  identity: mentorData?.emailId,
                  username: `${mentorData?.firstName} ${mentorData?.lastName}`,
                },
              ],
            },
          })
          .then(async channel => {
            channel.join().then(async () => {
              await channel.setAllMessagesUnread();
              channel.add(mentorData?.emailId).then(() => {
                setLoading(false);
                dispatch(updateCurrentConversation(channel?.sid));
                navigation.navigate(MESSAGES_TAB_ROUTE, {
                  screen: CHAT_ROOM_SCREEN,
                  params: {
                    channelId: channel?.sid,
                    identity: username,
                    otherUser: {
                      username: `${mentorData?.firstName} ${mentorData?.lastName}`,
                    },
                  },
                });
              });
            });
          })
          .catch(error => {
            console.log(error);
            setLoading(false);
          });
      })
      .catch(err => {
        setLoading(false);
        console.log('Error=============', err);
      });
  };

  const createNewConversation = async mentorData => {
    setLoading(true);
    getTokenNew(username)
      .then(token => TwilioService.getInstance().getChatClient(token))
      .then(async client => {
        try {
          const channelResult = await client.getConversationByUniqueName(
            `${mentorData?.emailId}-${username}`,
          );
          if (channelResult?.status === 'joined') {
            navigation.navigate(MESSAGES_TAB_ROUTE, {
              screen: CHAT_ROOM_SCREEN,
              params: {
                channelId: channelResult.sid,
                identity: username,
                otherUser: {
                  username: `${mentorData?.firstName} ${mentorData?.lastName}`,
                },
              },
            });
          }
        } catch (error) {
          // const error = new Error(err);
          if (error.message === 'Not Found') {
            addConversation(client, mentorData);
          }
        }
      });

    return;
  };

  const renderExperties = ({data, label}) => {
    return (
      <View isCard style={{flexDirection: 'row', flex: 1}}>
        <Text style={styles.expertiesText}>{`${label} :`}</Text>
        {data && data.length ? (
          <FlatList
            data={data}
            style={{flex: 1}}
            horizontal
            // numColumns={3}
            // columnWrapperStyle={{flexWrap: 'wrap'}}
            // scrollEventThrottle={1900}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View
                  slideHorizontal
                  key={index}
                  style={{
                    marginRight: 10,
                    borderRadius: 13,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    backgroundColor: Colors.saffron,
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
      <View key={index} style={styles.flatListContainer}>
        <View
          isCard
          style={{
            marginTop: 2,
            padding: 10,
            borderRadius: 8,
            shadowColor: darkMode ? 'white' : 'gray',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.87,
            shadowRadius: 4,
            elevation: 3,
            backgroundColor: '#fff',
          }}>
          <Pressable
            onPress={async () => {
              setMentor(item);
              setShowDetails(!showDetails);
            }}
            style={styles.imageAndNameCont}>
            <Image
              source={require('../../icons/doctor.jpg')}
              style={styles.profilePic}
            />
            {/* <Image style={styles.profilePic} source={{uri: item.imageUrl}} /> */}
            <View isCard>
              <Text style={styles.mentorNameTxt} numberOfLines={1}>
                {`${t(item?.firstName)} ${t(item?.lastName)}`}
              </Text>
              <Text style={styles.experienceText}>
                {item?.experience}+ {YEARS_OF_EXPERIENCE}
              </Text>
              <View isCard={true} style={{flexDirection: 'row'}}>
                <Text>
                  {STARTS} @ ₹{item?.fees} {FOR} 50 {MINS}
                </Text>
              </View>
            </View>
          </Pressable>
          {renderExperties({data: expertiseArr, label: EXPERTIES})}
          {renderExperties({data: languageArr, label: SPEAKS})}
          <Pressable
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => createNewConversation(item)}>
            <Image
              source={require('../../icons/chat.png')}
              style={{width: 30, height: 30, objectFit: 'contain'}}
            />
            <Text style={{paddingLeft: 10, fontWeight: 'bold'}}>{CHAT}</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mentorsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        onScroll={handleOnScroll}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
      {showDetails ? (
        <MentorDetails
          showDetails={showDetails}
          close={() => setShowDetails(false)}
          selectedMentorData={selectedMentorData}
        />
      ) : null}
      {isMentorsDataLoading ? <ScreenLoading /> : null}
    </View>
  );
};

// const renderExpertiesItem = ({item}) => {
//   return (
//     <View
//       style={{
//         marginRight: 10,
//         borderRadius: 8,
//         paddingHorizontal: 8,
//         backgroundColor: '#F0F0F0',
//         marginBottom: 10,
//       }}>
//       <Text
//         style={{
//           color: lightBlack,
//         }}>
//         {item}
//       </Text>
//     </View>
//   );
// };

// const renderLaunguageItem = ({item}) => {
//   return (
//     <Text style={{marginRight: 10, color: lightBlack, marginBottom: 10}}>
//       {item}
//     </Text>
//   );
// };

// const renderSessionModeItem = ({item}) => {
//   return (
//     <Text style={{marginRight: 10, fontWeight: '600', color: lightBlack}}>
//       {item}
//     </Text>
//   );
// };

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  flatListContainer: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  cardContainer: {
    padding: 10,
    borderRadius: 8,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.57,
    shadowRadius: 4.65,
    elevation: 3,
    backgroundColor: '#fff',
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
    color: Colors.darkPaleMintColor,
    marginBottom: 10,
    width: wp(58),
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

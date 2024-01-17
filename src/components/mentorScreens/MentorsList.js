import {
  // Text,
  Image,
  View as ViewComponent,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
  TextInput,
  Dimensions,
} from 'react-native';
import View from '../wrapperComponent/ViewWrapper.js';
import Text from '../wrapperComponent/TextWrapper.js';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';
import debounce from 'lodash.debounce';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllMentorList,
  getMentorSearchData,
  getTwilloChatTokenSlice,
} from '../../redux/HomeSlice';
import Close from '../../icons/icon_close.svg';
import Modal from 'react-native-modal';
import MentorDetails from './MentorDetails';
import Colors from '../../customs/Colors';
import {CHAT_ROOM_SCREEN, MESSAGES_TAB_ROUTE} from '../../utils/route';
import {TwilioService} from '../../screens/Twillio/ConversationService';
import {updateCurrentConversation} from '../../redux/CurrentConvoReducer';
import {useTranslation} from 'react-i18next';
import convertLang from '../../utils/Strings.js';
import {FacebookContentLoading} from '../SkeletonContentLoading';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {darkModeColor, profileURL} from '../../utils/utils.js';
import {doctorURI} from '../../icons/index.js';
const dropdownSearchItems = {
  name: 'Enter name..',
  experties: 'Enter experties..',
  experience: 'Enter experience..',
};
const MentorsList = ({navigation, handleShadowVisible}) => {
  const {
    isMentorsDataLoadingSearch,
    mentorsData = [],
    darkMode,
  } = useSelector(state => state.home);
  const {email: username} = useSelector(state => state.auth);
  const profileData = useSelector(state => state.home.profileData);
  const [isMentorsDataLoading, setLoading] = useState(false);
  const [selectedMentorData, setMentor] = useState({slots: []});
  const [showDetails, setShowDetails] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [onUpdateImage, setOnUpdateImage] = useState(Math.random());
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState({});
  const [dropdownitems, setDropdownItems] = useState('name');
  const [showSearchBar, setSearchBar] = useState(false);
  const [showDropdown, setDropdown] = useState(false);
  const startValue = useRef(
    new Animated.Value(Dimensions.get('window').width),
  ).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const {t} = useTranslation();
  const {CHAT, EXPERTIES, SPEAKS, YEARS_OF_EXPERIENCE, FOR, STARTS, MINS} =
    t && convertLang(t);

  useEffect(() => {
    (async () => {
      if (mentorsData.length === 0) {
        try {
          setLoading(true);
          await dispatch(getAllMentorList());
          setOnUpdateImage(Math.random());
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      }
    })();
  }, [dispatch]);

  const getTokenNew = async username => {
    let {payload} = await dispatch(getTwilloChatTokenSlice({email: username}));
    return payload?.accessToken;
  };

  const handleOnScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 0) {
      handleShadowVisible && handleShadowVisible(true);
    } else {
      handleShadowVisible && handleShadowVisible(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllMentorList());
    setRefreshing(false);
    setOnUpdateImage(Math.random());
  };

  const handleDropDownItemSelected = item => {
    setDropdownItems(item);
    setDropdown(false);
    if (Object.keys(searchText).length) {
      debouncedSearch('');
      setSearchText({});
    }
  };

  const debouncedSearch = () => {
    debounce(searchTerm => {
      dispatch(
        getMentorSearchData({
          searchText:
            dropdownitems === 'experties'
              ? searchTerm.toLowerCase()
              : searchTerm,
          type: dropdownitems,
        }),
      );
    }, 500);
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
    const shadowColor = darkModeColor(darkMode);
    const uniqueId = item?.uniqueId;
    return (
      <View key={index} style={styles.flatListContainer}>
        <View isCard style={[styles.flatListContainerSub, {shadowColor}]}>
          <Pressable
            onPress={async () => {
              setMentor(item);
              setShowDetails(!showDetails);
            }}
            style={styles.imageAndNameCont}>
            <Image
              source={
                uniqueId
                  ? {
                      cache: 'reload',
                      // uri: profileURL(uniqueId) + '?time=' + index,
                      uri: profileURL(uniqueId) + '?' + onUpdateImage,
                    }
                  : doctorURI
              }
              style={styles.profilePic}
            />
            {/* <Image style={styles.profilePic} source={{uri: item.imageUrl}} /> */}
            <View isCard style={{width: '60%'}}>
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
            <MaterialIcons name="chat" size={22} />
            <Text style={{paddingLeft: 10, fontWeight: 'bold'}}>{CHAT}</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchIconCont}>
        {/* {showSearchBar ? null : ( */}
        <Animated.View
          style={{
            paddingLeft: 20,
            paddingVertical: 5,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: opacityValue,
            position: 'absolute',
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat',
              fontSize: 20,
              fontWeight: 'bold',
              color: Colors.black,
              paddingBottom: 5,
            }}>
            Mentors
          </Text>
        </Animated.View>
        {/* )} */}
        <>
          <Animated.View
            style={{
              transform: [
                {
                  translateX: startValue,
                },
              ],
              flex: 1,
              height: 43,
            }}>
            <TextInput
              placeholder={dropdownSearchItems[dropdownitems]}
              onChangeText={text => {
                setSearchText({...searchText, [dropdownitems]: text});
                debouncedSearch(text);
              }}
              value={searchText[dropdownitems]}
              style={styles.searchBar}
            />
          </Animated.View>
          {showSearchBar ? (
            <Pressable onPress={() => setDropdown(!showDropdown)}>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={35}
                color={Colors.darkPaleMintColor}
                style={styles.icon}
              />
            </Pressable>
          ) : null}
        </>
        {showDropdown && showSearchBar ? (
          <View style={styles.selectSearch}>
            <View style={{backgroundColor: 'white', paddingHorizontal: 17}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={['name', 'experties', 'experience']}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index}
                renderItem={({item, index}) => {
                  return (
                    <Pressable
                      onPress={() => handleDropDownItemSelected(item)}
                      style={styles.selectSearchItem}>
                      <Text
                        style={{
                          color: dropdownitems === item ? 'white' : Colors.dune,
                        }}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                      {dropdownitems === item ? (
                        <View style={{paddingLeft: 10}}>
                          <MaterialIcons
                            name={'check'}
                            size={16}
                            color={Colors.emerald}
                          />
                        </View>
                      ) : null}
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        ) : null}
        <Pressable
          style={{padding: 2}}
          onPress={() => {
            setSearchBar(pre => {
              if (pre) {
                Animated.timing(opacityValue, {
                  toValue: 1,
                  duration: 800,
                  useNativeDriver: true,
                }).start(() => {});
                Animated.timing(startValue, {
                  toValue: Dimensions.get('window').width,
                  duration: 1000,
                  useNativeDriver: true,
                }).start(() => {});
              } else {
                Animated.timing(opacityValue, {
                  toValue: 0,
                  duration: 800,
                  useNativeDriver: true,
                }).start(() => {});
                Animated.timing(startValue, {
                  toValue: 10,
                  duration: 1000,
                  useNativeDriver: true,
                }).start(() => {});
              }
              return !pre;
            });
          }}>
          <MaterialIcons
            name="search"
            size={30}
            color={Colors.darkPaleMintColor}
            style={styles.icon}
          />
        </Pressable>
      </View>
      {isMentorsDataLoadingSearch || isMentorsDataLoading ? (
        <FacebookContentLoading length={5} style={{top: 60}} />
      ) : null}
      <FlatList
        data={mentorsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        onScroll={handleOnScroll}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={() => {
          return (
            <ViewComponent
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>No Data Found</Text>
            </ViewComponent>
          );
        }}
      />
      {showDetails ? (
        <MentorDetails
          showDetails={showDetails}
          close={() => setShowDetails(false)}
          selectedMentorData={selectedMentorData}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
  flatListContainer: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  flatListContainerSub: {
    marginTop: 2,
    padding: 10,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.87,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.white,
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
    color: Colors.lightBlack,
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
  bookBtnText: {
    color: 'white',
    fontWeight: '700',
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
  searchIconCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    paddingVertical: 10,
    paddingRight: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: Colors.dustyGray,
    paddingLeft: 10,
    marginRight: 10,
    flex: 1,
    // width: wp(75),
    // height: hp(4),
    borderRadius: 8,
  },
  selectSearch: {
    position: 'absolute',
    top: 45,
    bottom: 0,
    // left: 0,
    right: 40,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
    zIndex: 100,
    elevation: 2,
    height: 100,
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  selectSearchItem: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MentorsList;

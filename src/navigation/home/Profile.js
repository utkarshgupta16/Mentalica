import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  I18nManager,
  FlatList,
  Switch,
  Platform,
} from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Text from '../../components/wrapperComponent/TextWrapper.js';
import View from '../../components/wrapperComponent/ViewWrapper.js';
import Colors from '../../customs/Colors';
import Issue from '../../components/Issue';
import ProfileDetailsItem from '../../components/ProfileDetailsItem';
import {useDispatch, useSelector} from 'react-redux';
import convertLang from '../../utils/Strings';
import {logout} from '../../redux/AuthSlice';
import {screenWidth, widthPercentageToDP} from '../../utils/Responsive';
import {signOut} from '../../AWS/AWSConfiguration';
import ScreenLoading from '../../components/ScreenLoading';
import {connectActionSheet} from '@expo/react-native-action-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import {
  PAYMENT_DETAIL_ITEM_MENTOR,
  PAYMENT_DETAIL_ITEM_PATIENT,
  // PROFILE_DETAILS,
  LANG_OPTION,
} from '../../utils/default';
import {useTranslation} from 'react-i18next';
import i18n from '../../utils/i18n';
import RNRestart from 'react-native-restart';
import DropDownPicker from 'react-native-dropdown-picker';
import AddSlotsComponent from '../signUp/AddSlots';
import {resetConversations} from '../../redux/ConvoSlice';
import {resetUnreadMessage} from '../../redux/UnReadMessageCountSlice';
import {
  changeTheme,
  getUrlToUploadImage,
  languageChange,
  updateOnLogout,
} from '../../redux/HomeSlice';
import {Auth} from 'aws-amplify';
import {decode} from 'base-64';
import RNFS from 'react-native-fs';
import {ADD_SLOTS_PROFILE_SCREEN} from '../../utils/route.js';
import {changeLanguage} from 'i18next';
import {PREVIEW_URL} from '@env';
import axios from 'axios';
import {profileURL} from '../../utils/utils.js';
const Profile = ({navigation, showActionSheetWithOptions}) => {
  const {t} = useTranslation();
  const {
    ACCOUNT_DETAILS,
    ARE_YOU_LOGOUT,
    ENGLISH,
    HEBREW,
    I_AM_SPECIALIST,
    I_WANT,
    LOGOUT,
    NO_CANCEL,
    PAYMENT,
    SELECT_LANG,
    YES,
    RESTART_APP,
    CHANGE_LANG,
    OKAY,
    DARK_MODE,
    CHANGE_PASSWORD,
    CONTACT_DETAILS,
    EMAIL_ADD,
    PHONE_NO,
    OK,
    PATIENT,
    MENTOR,
    TODAYS_SLOTS,
  } = convertLang(t);
  const dispatch = useDispatch();
  const {loginFrom, email, type} = useSelector(state => state.auth);
  const {
    darkMode,
    currentLanguage,
    urlForImageUpload,
    selectedProfileImagePath,
  } = useSelector(state => state.home);
  const {
    profileData = {},
    isProfileLoading,
    profileImageUrl,
  } = useSelector(state => state.home);
  const [imageLoading, setOnLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slotState, setSlotState] = useState({startTime: '', endTime: ''});
  const [isOpen, setIsOpen] = useState(false);
  const [showSlots, setShowSlots] = useState(false);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const [selectedLanguage, setLanguage] = useState(
    i18n.language === 'he' ? HEBREW : ENGLISH,
  );

  const langOptions = LANG_OPTION;
  const {
    feel = '',
    email_id = '',
    firstName = '',
    lastName = '',
    expertise = '',
    uniqueId,
  } = profileData || {};
  const [slots, addSlots] = useState(profileData ? profileData.slots : []);
  const isProfile = true;
  const DUMMY_ISSUES =
    type === PATIENT ? [feel] : expertise ? expertise?.split(',') : [];

  const profileDetailsItems = [
    {
      label: 'Edit profile',
      screen: 'EditProfilePatient',
      props: profileData || {},
      onPress: () => {
        navigation.navigate('EditProfilePatient', {data: profileData});
      },
    },

    {
      label: 'Contact details',
      screen: '',
      props: profileData || {},
      onPress: () => {
        Alert.alert(
          CONTACT_DETAILS,
          `${PHONE_NO} : ${profileData?.phoneNumber}    
            ${EMAIL_ADD}: ${profileData?.emailId}`,
          [{text: OK, onPress: () => null}],
        );
      },
    },
    {
      label: 'Change Password',
      screen: '',
      props: profileData || {},
      onPress: () => {
        navigation.navigate('changePassword');
      },
    },
  ];
  if (type === 'Mentor') {
    profileDetailsItems.push({
      label: "Today's Slots",
      screen: '',
      props: profileData || {},
      onPress: () => navigation.navigate(ADD_SLOTS_PROFILE_SCREEN, {isProfile}),
    });
  }
  const paymentDetailsItemsPatient = PAYMENT_DETAIL_ITEM_PATIENT;
  const paymentDetailsItemsMentor = PAYMENT_DETAIL_ITEM_MENTOR;
  console.log('profileDetailsItems', profileDetailsItems, type);
  const toggleSwitch = () => {
    // setIsSwitchEnabled(previousState => !previousState);
    dispatch(changeTheme(!darkMode));
  };

  const logoutPressHandler = () => {
    Alert.alert(LOGOUT, ARE_YOU_LOGOUT, [
      {
        text: NO_CANCEL,
        onPress: () => null,
      },
      {
        text: `${YES}, ${LOGOUT}`,
        onPress: async () => {
          signOut();
          dispatch(logout());
          dispatch(resetConversations());
          dispatch(resetUnreadMessage());
          dispatch(updateOnLogout());
        },
      },
    ]);
  };

  const handleUploadImage = async () => {
    // launchImageLibrary({
    //   mediaType: 'photo',
    //   maxWidth: 150,
    //   maxHeight: 150,
    //   includeBase64: true,
    // }).then(result => {
    //   dispatch(getUrlToUploadImage()).then(({payload}) => {
    //     uploadImageToServer(result?.assets[0], payload.url);
    //   });
    // });
    const options = ['Take Photo', 'Choose From Library', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          ImagePicker.openCamera({
            width: 300,
            height: 400,
            mediaType: 'photo',
            cropping: true,
            compressImageQuality: 0.7,
          })
            .then(async image => {
              dispatch(getUrlToUploadImage()).then(({payload}) => {
                uploadImageToServer(image, payload.url);
              });
            })
            .catch(err => {});
        } else if (buttonIndex === 1) {
          ImagePicker.openPicker({
            mediaType: 'photo',
            compressImageQuality: 0.7,
            showsSelectedCount: true,
            maxFiles: 1,
            cropping: true,
            forceJpg: true,
          })
            .then(async image => {
              dispatch(getUrlToUploadImage()).then(({payload}) => {
                uploadImageToServer(image, payload.url);
              });
            })
            .catch(error => {});
        }
      },
    );
  };

  const decodeBase64 = async data => {
    try {
      const decodedData = await decode(data);
      const bytes = await new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        bytes[i] = decodedData.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (e) {
      // crashlyticsLogger(e,'screen:fileUtils.ts function:decodeBase64 lineno-31');
      // analyticsLogger("error", { 'desc': "Error while decoding" });
      console.log('Error while decoding:', e);
    }
  };

  const uploadImageToServer = async (data, signedUrl) => {
    if (signedUrl) {
      setOnLoadingImage(true);
      const fileData = await RNFS.readFile(data?.path, 'base64');
      const _data = await decodeBase64(fileData);

      try {
        await fetch(signedUrl, {
          method: 'PUT',
          body: _data,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });
        setOnLoadingImage(false);
      } catch (e) {
        setOnLoadingImage(false);

        console.log('Error while fetching', e);
      }
    }
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: darkMode ? '#000' : '#fff'}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.topPartContainer}>
        <View style={styles.profileDetailsContainer}>
          <Pressable onPress={handleUploadImage}>
            <View style={styles.imageContainer}>
              {imageLoading ? (
                <ActivityIndicator size={'small'} color="green" />
              ) : (
                <Image
                  source={
                    uniqueId
                      ? {
                          cache: 'reload',
                          uri: profileURL(uniqueId),
                        }
                      : loginFrom === PATIENT
                      ? require('../../icons/patient.jpg')
                      : require('../../icons/doctor.jpg')
                  }
                  style={styles.image}
                />
              )}
            </View>
          </Pressable>
          <View style={styles.details}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                ...styles.nameText,
                width: screenWidth - 100,
              }}>
              {(firstName + ' ' + lastName).length > 10
                ? (firstName + ' ' + lastName).substring(0, 21 - 3) + '...'
                : firstName + ' ' + lastName}
            </Text>
          </View>
        </View>

        <View style={styles.issuesContainer}>
          <Text style={styles.issuesTitleText}>
            {loginFrom === MENTOR ? I_AM_SPECIALIST : I_WANT}
          </Text>
          <View style={styles.allIssues}>
            <FlatList
              data={DUMMY_ISSUES}
              renderItem={({item}) => <Issue key={item} title={item} />}
              keyExtractor={item => item}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <View style={styles.switchContaimer}>
          <Text style={styles.accDetailsTitle}>{DARK_MODE}</Text>
          <Switch onValueChange={toggleSwitch} value={darkMode} />
        </View>
        <View style={styles.profDetailsCont}>
          <Text style={styles.accDetailsTitle}>{ACCOUNT_DETAILS}</Text>
          {profileDetailsItems.map(item => (
            <ProfileDetailsItem
              navigation={navigation}
              key={item?.label}
              title={item?.label}
              screen={item?.screen}
              data={item?.props}
              onPress={item.onPress}
            />
          ))}
        </View>
        <View style={styles.paymentDetailsCont}>
          <Text style={styles.accDetailsTitle}>{PAYMENT}</Text>
          {(loginFrom === MENTOR
            ? paymentDetailsItemsMentor
            : paymentDetailsItemsPatient
          ).map(item => (
            <ProfileDetailsItem key={item} title={item} />
          ))}
        </View>
        {showSlots ? (
          <AddSlotsComponent
            isProfile={true}
            email_id={email_id}
            type={type}
            setState={setSlotState}
            state={slotState}
            addSlots={addSlots}
            slots={slots}
            close={() => setShowSlots(false)}
          />
        ) : null}
        <DropDownPicker
          dropDownDirection="TOP"
          listMode="SCROLLVIEW"
          autoScroll={true}
          zIndex={3000}
          open={isOpen}
          setOpen={setIsOpen}
          value={t(selectedLanguage)}
          setValue={props => {
            Alert.alert(CHANGE_LANG, RESTART_APP, [
              {
                text: NO_CANCEL,
                onPress: () => null,
              },
              {
                text: OKAY,
                onPress: () => {
                  i18n
                    .changeLanguage(i18n.language === 'he' ? 'en' : 'he')
                    .then(() => {
                      I18nManager.allowRTL(i18n.language === 'he');
                      I18nManager.forceRTL(i18n.language === 'he');
                      setLanguage(props());
                      dispatch(languageChange(i18n.language));
                      // RNRestart.Restart();
                      setTimeout(() => {
                        RNRestart.Restart();
                      }, 5);
                    })
                    .catch(err => {
                      console.log(
                        'something went wrong while applying RTL',
                        err,
                      );
                    });
                },
              },
            ]);
          }}
          dropDownContainerStyle={{
            backgroundColor: Colors.white,
            borderWidth: 1,
            alignSelf: 'center',
            width: widthPercentageToDP(36),
          }}
          items={langOptions}
          placeholder={SELECT_LANG}
          containerStyle={{borderBottomColor: 'gray'}}
          style={styles.dropdown}
        />

        <Pressable onPress={logoutPressHandler} style={styles.logoutContainer}>
          <Text style={styles.logoutTitle}>{LOGOUT}</Text>
        </Pressable>
      </View>
      {isProfileLoading ? <ScreenLoading /> : null}

      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>
            <ActivityIndicator size={'large'} />
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default connectActionSheet(Profile);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: Colors.white,
  },
  topPartContainer: {
    backgroundColor: Colors.white,
    paddingTop: 15,
    borderBottomWidth: 0.2,
  },
  imageContainer: {
    // borderWidth: 1,
    // borderColor: Colors.grayishBlue,
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  image: {
    width: 56,
    height: 56,
  },
  details: {
    // justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.darkPaleMintColor,
  },
  emailText: {
    fontWeight: '500',
    color: Colors.grayishBlue,
  },
  issuesContainer: {
    marginHorizontal: 15,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    marginBottom: 36,
  },
  issuesTitleText: {
    fontWeight: '600',
    fontSize: 15,
    color: Colors.grayishBlue,
    marginBottom: 20,
  },
  allIssues: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContainer: {
    paddingHorizontal: 32,
    paddingTop: 16,
    backgroundColor: Colors.white,
  },
  profDetailsCont: {
    marginBottom: 24,
  },
  paymentDetailsCont: {},
  accDetailsTitle: {
    fontSize: 18,
    color: Colors.dune,
    fontWeight: '600',
    marginBottom: 14,
  },
  logoutContainer: {
    marginVertical: 24,
  },
  logoutTitle: {
    color: Colors.darkPaleMintColor,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    // textDecorationLine: 'underline',
  },
  dropdown: {
    // backgroundColor: Colors.paleMintColor,
    // borderWidth: 1,
    alignSelf: 'center',
    borderColor: Colors.white,
    width: widthPercentageToDP(27),
    paddingHorizontal: 10,
  },
  switchContaimer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

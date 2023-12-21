import React, {useState} from 'react';
import {
  // Text,
  // View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  I18nManager,
  FlatList,
  Switch,
} from 'react-native';
import Text from '../../components/wrapperComponent/TextWrapper.js';
import View from '../../components/wrapperComponent/ViewWrapper.js';
import Colors from '../../customs/Colors';
import Issue from '../../components/Issue';
import ProfileDetailsItem from '../../components/ProfileDetailsItem';
import {useDispatch, useSelector} from 'react-redux';
import convertLang, {PATIENT, MENTOR} from '../../utils/Strings';
import {logout} from '../../redux/AuthSlice';
import {screenWidth, widthPercentageToDP} from '../../utils/Responsive';
import {signOut} from '../../AWS/AWSConfiguration';
import ScreenLoading from '../../components/ScreenLoading';
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
import {changeTheme, updateOnLogout} from '../../redux/HomeSlice';
import {Auth} from 'aws-amplify';
import {
  ADD_SLOTS_PROFILE_SCREEN,
  ADD_SLOTS_SCREEN,
  PROFILE_TAB_ROUTE,
} from '../../utils/route.js';
const Profile = ({navigation}) => {
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
  } = convertLang(t);
  const dispatch = useDispatch();
  const {loginFrom, email, type} = useSelector(state => state.auth);
  const {darkMode} = useSelector(state => state.home);
  const {profileData = {}, isProfileLoading} = useSelector(state => state.home);
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
          'Contact Details',
          `Phone Number : ${profileData?.phoneNumber}  
       Email Id : ${profileData?.email_id}`,
          [{text: 'OK', onPress: () => null}],
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
  if (type === MENTOR) {
    profileDetailsItems.push({
      label: "Today's Slots",
      screen: '',
      props: profileData || {},
      onPress: () => navigation.navigate(ADD_SLOTS_PROFILE_SCREEN, {isProfile}),
    });
  }
  const paymentDetailsItemsPatient = PAYMENT_DETAIL_ITEM_PATIENT;
  const paymentDetailsItemsMentor = PAYMENT_DETAIL_ITEM_MENTOR;

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
          dispatch(updateOnLogout());
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.topPartContainer}>
        <View style={styles.profileDetailsContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={
                loginFrom === PATIENT
                  ? require('../../icons/patient.jpg')
                  : require('../../icons/doctor.jpg')
              }
              style={styles.image}
            />
          </View>
          <View style={styles.details}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                ...styles.nameText,
                width: screenWidth - 100,
                // borderWidth: 1,
              }}>
              {/* {firstName + ' ' + lastName} */}
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
            {/* {DUMMY_ISSUES.map(issue => (
              <Issue key={issue} title={issue} />
            ))} */}
            <FlatList
              data={DUMMY_ISSUES}
              renderItem={({item}) => <Issue key={item} title={item} />}
              keyExtractor={item => item}
              horizontal={true} // Set to true for horizontal rendering
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <View style={styles.switchContaimer}>
          <Text style={styles.accDetailsTitle}>Dark mode</Text>
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

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topPartContainer: {
    backgroundColor: Colors.white,
    paddingTop: 15,
    borderBottomWidth: 0.2,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: Colors.grayishBlue,
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
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
    paddingHorizontal: 32,
  },
  profileDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    marginBottom: 36,
  },
  issuesTitleText: {
    fontWeight: '500',
    fontSize: 14,
    color: Colors.grayishBlue,
    marginBottom: 20,
  },
  allIssues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    backgroundColor: Colors.paleMintColor,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: Colors.darkPaleMintColor,
    width: widthPercentageToDP(36),
    paddingHorizontal: 10,
  },
  switchContaimer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

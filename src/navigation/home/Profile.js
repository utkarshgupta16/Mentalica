import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import Colors from '../../customs/Colors';
import Issue from '../../components/Issue';
import ProfileDetailsItem from '../../components/ProfileDetailsItem';
import {useDispatch, useSelector} from 'react-redux';
import convertLang from '../../utils/Strings';
import {logout} from '../../redux/AuthSlice';
import {screenWidth, widthPercentageToDP} from '../../utils/Responsive';
import {signOut} from '../../AWS/AWSConfiguration';
import ScreenLoading from '../../components/ScreenLoading';
import {
  PAYMENT_DETAIL_ITEM_MENTOR,
  PAYMENT_DETAIL_ITEM_PATIENT,
  PROFILE_DETAILS,
  LANG_OPTION,
} from '../../utils/default';
import {useTranslation} from 'react-i18next';
import i18n from '../../utils/i18n';
import RNRestart from 'react-native-restart';
import DropDownPicker from 'react-native-dropdown-picker';

const Profile = () => {
  const {t} = useTranslation();
  const {
    ACCOUNT_DETAILS,
    ARE_YOU_LOGOUT,
    ENGLISH,
    HEBREW,
    I_AM_SPECIALIST,
    I_WANT,
    LOGOUT,
    MENTOR,
    NO_CANCEL,
    PATIENT,
    PAYMENT,
    SELECT_LANG,
    YES,
    RESTART_APP,
    CHANGE_LANG,
  } = convertLang(t);
  const dispatch = useDispatch();
  const {loginFrom, email, type} = useSelector(state => state.auth);
  const {profileData = {}, isProfileLoading} = useSelector(state => state.home);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
  } = (profileData.Items && profileData?.Items[0]) || {};
  const DUMMY_ISSUES =
    type == PATIENT ? [feel] : expertise ? expertise?.split(',') : [];
  const profileDetailsItems = PROFILE_DETAILS;
  const paymentDetailsItemsPatient = PAYMENT_DETAIL_ITEM_PATIENT;
  const paymentDetailsItemsMentor = PAYMENT_DETAIL_ITEM_MENTOR;

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
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text>
          <ActivityIndicator size={'large'} />
        </Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.topPartContainer}>
        <View style={styles.profileDetailsContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={
                loginFrom == PATIENT
                  ? require('../../icons/patient.jpg')
                  : require('../../icons/doctor.jpg')
              }
              style={styles.image}
            />
          </View>
          <View style={styles.details}>
            <Text style={{...styles.nameText, width: screenWidth - 100}}>
              {firstName + ' ' + lastName}
            </Text>
            <Text style={styles.emailText}>{email_id}</Text>
          </View>
        </View>
        <View style={styles.issuesContainer}>
          <Text style={styles.issuesTitleText}>
            {loginFrom === MENTOR ? I_AM_SPECIALIST : I_WANT}
          </Text>
          <View style={styles.allIssues}>
            {DUMMY_ISSUES.map(issue => (
              <Issue key={issue} title={issue} />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <View style={styles.profDetailsCont}>
          <Text style={styles.accDetailsTitle}>{ACCOUNT_DETAILS}</Text>
          {profileDetailsItems.map(item => (
            <ProfileDetailsItem key={item} title={item} />
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
                text: 'OK',
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
            borderWidth: 0,
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
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  topPartContainer: {
    backgroundColor: Colors.white,
    paddingTop: 15,
  },
  imageContainer: {
    borderWidth: 1,
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
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.dune,
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
    color: Colors.black,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  dropdown: {
    backgroundColor: Colors.paleMintColor,
    borderWidth: 0,
    alignSelf: 'center',
    width: widthPercentageToDP(36),
  },
});

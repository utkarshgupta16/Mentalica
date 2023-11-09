import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import Colors from '../../customs/Colors';
import Issue from '../../components/Issue';
import ProfileDetailsItem from '../../components/ProfileDetailsItem';
import {useDispatch, useSelector} from 'react-redux';
import {MENTOR, PATIENT} from '../../utils/Strings';
import {logout} from '../../redux/AuthSlice';
// import ArrowRight from '../../icons/rightArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getCurrentUserInfo, signOut} from '../../AWS/AWSConfiguration';
import {getProfileSlice} from '../../redux/HomeSlice';
import {screenWidth} from '../../utils/Responsive';

const Profile = () => {
  const dispatch = useDispatch();
  const {loginFrom, email, type} = useSelector(state => state.auth);
  const {profileData = {}, isProfileLoading} = useSelector(state => state.home);
  const [loading, setLoading] = useState(false);
  const {
    feel = '',
    email_id = '',
    firstName = '',
    lastName = '',
  } = (profileData.Items && profileData?.Items[0]) || {};

  const DUMMY_ISSUES = feel
    ? feel?.split(',')
    : ['depression', 'anxiety', 'student life', 'loneliness'];
  const profileDetailsItems = ['Edit profile', 'Contact details', 'Password'];
  const paymentDetailsItemsPatient = [
    'Edit payment information',
    'Payment methods',
    'Payment history',
  ];
  const paymentDetailsItemsMentor = [
    'Edit fiscal information',
    'Banking information',
  ];

  const logoutPressHandler = () => {
    signOut();
    dispatch(logout());
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
            {loginFrom === MENTOR ? "I'm a specialist in" : 'I want to address'}
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
          <Text style={styles.accDetailsTitle}>Account Details</Text>
          {profileDetailsItems.map(item => (
            <ProfileDetailsItem key={item} title={item} />
          ))}
        </View>
        <View style={styles.paymentDetailsCont}>
          <Text style={styles.accDetailsTitle}>Payment</Text>
          {(loginFrom === MENTOR
            ? paymentDetailsItemsMentor
            : paymentDetailsItemsPatient
          ).map(item => (
            <ProfileDetailsItem key={item} title={item} />
          ))}
        </View>

        <Pressable onPress={logoutPressHandler} style={styles.logoutContainer}>
          <Text style={styles.logoutTitle}>Log out</Text>
        </Pressable>
      </View>
      {isProfileLoading ? (
        <View
          style={{position: 'absolute', left: 0, bottom: 0, right: 0, top: 0}}>
          <ActivityIndicator size={'large'} color="green" />
        </View>
      ) : null}
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
    paddingTop: 6,
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
    paddingHorizontal: 32,
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
});

import React from 'react';
import {Text, View, StyleSheet, ScrollView, Pressable} from 'react-native';
import Colors from '../../customs/Colors';
import Issue from '../../components/Issue';
import ProfileDetailsItem from '../../components/ProfileDetailsItem';
import {useDispatch, useSelector} from 'react-redux';
import {MENTOR} from '../../utils/Strings';
import {logout} from '../../redux/AuthSlice';
// import ArrowRight from '../../icons/rightArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  const dispatch = useDispatch();
  const {loginFrom} = useSelector(state => state.auth);

  const DUMMY_ISSUES = ['depression', 'anxiety', 'student life', 'loneliness'];
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
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.topPartContainer}>
        <View style={styles.profileDetailsContainer}>
          <View style={styles.imageContainer}></View>
          <View style={styles.details}>
            <Text style={styles.nameText}>Utkarsh Gupta</Text>
            <Text style={styles.emailText}>Ugupta178@gmail.com</Text>
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
  },
  details: {
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 24,
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

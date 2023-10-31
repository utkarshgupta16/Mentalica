import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../customs/Colors';
// import ArrowRight from '../icons/rightArrow.svg';

const ProfileDetailsItem = ({title}) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>{title}</Text>
      {/* <ArrowRight /> */}
    </View>
  );
};

export default ProfileDetailsItem;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDarkBlue,
  },
});

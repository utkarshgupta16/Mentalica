import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Colors from './Colors';
import backArrow from '../icons/backArrowS.png';
// import BackArrow from '../icons/leftArrow.svg';

const CustomHeader = ({showBackArrow, title, navigation}) => {
  return (
    <View style={styles.mainContainer}>
      {showBackArrow ? (
        <Pressable onPress={navigation.goBack}>
          <Image source={backArrow} style={styles.backArrowIcon} />
        </Pressable>
      ) : null}
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

export default CustomHeader;
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.darkPaleMintColor,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  backArrowIcon: {
    height: 24,
    width: 24,
    marginRight: '37%',
  },
  titleText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
    // flex: 1,
    // textAlign: 'center',
  },
});

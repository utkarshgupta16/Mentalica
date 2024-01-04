/* eslint-disable react-native/no-inline-styles */
import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Colors from '../customs/Colors';
import {useSelector} from 'react-redux';
import Text from '../components/wrapperComponent/TextWrapper.js';

export default function PatientDashboardTabs({
  onPress,
  title,
  selectedTab,
  tab,
  darkMode,
}) {
  const selectedColor =
    selectedTab.tabStr === tab ? 'white' : darkMode ? 'white' : 'black';
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.containerStyle,
          {
            backgroundColor:
              selectedTab.tabStr === tab
                ? Colors.darkPaleMintColor
                : 'transparent',
          },
        ]}>
        <Text customColor={selectedColor} tab style={styles.tabText}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabText: {
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Roboto Black',
  },
  containerStyle: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 50,
    // flex: 1
  },
});

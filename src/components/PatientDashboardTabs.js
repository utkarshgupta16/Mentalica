import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Colors from '../customs/Colors';

export default function PatientDashboardTabs({
  onPress,
  title,
  selectedTab,
  tab,
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor:
            selectedTab.tabStr == tab ? Colors.darkPaleMintColor : null,
          paddingHorizontal: 6,
          paddingVertical: 5,
          borderRadius: 50,
          // flex: 1
        }}>
        <Text
          style={[
            styles.tabText,
            {color: selectedTab.tabStr == tab ? Colors.white : Colors.black},
          ]}>
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
  },
});

import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';

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
          backgroundColor: selectedTab.tabStr == tab ? '#DDE6ED' : null,
          paddingHorizontal: 6,
          paddingVertical: 5,
          borderRadius: 50,
        }}>
        <Text style={styles.tabText}>{title}</Text>
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
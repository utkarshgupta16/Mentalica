import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

export default function PatientDashboardTabs({
  onPress,
  title,
  selectedTab,
  tab,
}) {
  const {t} = useTranslation();
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor: selectedTab.tabStr == tab ? '#DDE6ED' : null,
          paddingHorizontal: 6,
          paddingVertical: 5,
          borderRadius: 50,
          // flex: 1
        }}>
        <Text style={styles.tabText}>{t(title)}</Text>
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

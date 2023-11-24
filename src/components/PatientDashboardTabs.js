import { Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Colors from '../customs/Colors';
import View from "../components/ViewWrapper"
import Text from "../components/TextWrapper"

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
          backgroundColor: selectedTab?.tabStr == tab ? Colors.lightDark : null,
          paddingHorizontal: 6,
          paddingVertical: 5,
          borderRadius: 50,
          // flex: 1
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

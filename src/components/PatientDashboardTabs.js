import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Colors from '../customs/Colors';
import {useSelector} from 'react-redux';

export default function PatientDashboardTabs({
  onPress,
  title,
  selectedTab,
  tab,
}) {
  const {darkMode} = useSelector(state => state.home);

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor:
            selectedTab.tabStr == tab ? Colors.darkPaleMintColor : null,
          paddingHorizontal: 9,
          paddingVertical: 6,
          borderRadius: 50,
          // flex: 1
        }}>
        <Text
          style={[
            styles.tabText,
            {
              color: darkMode ? 'white' : 'black',
            },
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
    fontFamily: 'Roboto Black',
  },
});

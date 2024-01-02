import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Colors from '../customs/Colors';
import {useSelector} from 'react-redux';
// import View from '../components/wrapperComponent/ViewWrapper.js';
import Text from '../components/wrapperComponent/TextWrapper.js';

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
          paddingHorizontal: 6,
          paddingVertical: 6,
          borderRadius: 50,
          // flex: 1
        }}>
        <Text tab style={styles.tabText}>
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

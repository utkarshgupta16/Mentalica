import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Colors from '../customs/Colors';
// import ArrowRight from '../icons/rightArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const ProfileDetailsItem = ({title}) => {
  const {t} = useTranslation();
  return (
    <Pressable style={styles.mainContainer}>
      <Text style={styles.title}>{t(title)}</Text>
      <MaterialIcons
        name="arrow-forward-ios"
        size={16}
        color={Colors.grayishBlue}
        style={styles.icon}
      />
    </Pressable>
  );
};

export default ProfileDetailsItem;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDarkBlue,
  },
  icon: {
    padding: 5,
    paddingRight: 20,
  },
});

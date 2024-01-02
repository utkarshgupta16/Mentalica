import React from 'react';
import {Alert, Pressable, StyleSheet} from 'react-native';
import Text from './wrapperComponent/TextWrapper.js';
import Colors from '../customs/Colors';
// import ArrowRight from '../icons/rightArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {EN} from '../utils/Strings.js';

const ProfileDetailsItem = ({title, screen, navigation, data, onPress}) => {
  const {t} = useTranslation();
  const {currentLanguage} = useSelector(state => state.home);

  return (
    <Pressable style={styles.mainContainer} onPress={onPress}>
      <Text style={styles.title}>{t(title)}</Text>
      {currentLanguage == EN ? (
        <MaterialIcons
          name="arrow-forward-ios"
          size={16}
          color={Colors.grayishBlue}
          style={styles.icon}
        />
      ) : (
        <MaterialIcons
          name="arrow-back-ios"
          size={16}
          color={Colors.grayishBlue}
          style={styles.icon}
        />
      )}
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

  },
});

import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Colors from './Colors';
import backArrow from '../icons/backArrowS.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import convertLang, {EN} from '../utils/Strings';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
// import BackArrow from '../icons/leftArrow.svg';

const CustomHeader = ({showBackArrow, title, navigation, isShadowVisible}) => {
  const {t} = useTranslation();
  const {ENTER, CREATE_ACCOUNT} = convertLang(t);
  const {currentLanguage} = useSelector(state => state.home);

  return (
    <View style={styles.mainContainer}>
      {currentLanguage == 'en' ? (
        <Pressable onPress={navigation.goBack}>
          <Image source={backArrow} style={styles.backArrowIcon} />
        </Pressable>
      ) : (
        <Pressable onPress={navigation.goBack}>
          <MaterialIcons
            name="arrow-forword"
            size={30}
            color={Colors.black}
            style={styles.icon}
          />
        </Pressable>
      )}

      {isShadowVisible && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            paddingBottom: 10,
            // shadowColor: 'black',
            // shadowOffset: isShadowVisible && {
            //   width: 0,
            //   height: 2,
            // },
            // shadowOpacity: isShadowVisible ? 1 : 0,
            // shadowRadius: isShadowVisible ? 3 : 0,
            // elevation: isShadowVisible ? 4 : 0,
          }}>
          <Text style={styles.createAccountTxt}>{CREATE_ACCOUNT}</Text>
          <MaterialIcons
            name="person-add"
            size={30}
            color={Colors.black}
            style={styles.icon}
          />
        </View>
      )}
    </View>
  );
};

export default CustomHeader;
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  backArrowIcon: {
    height: 24,
    width: 24,
    marginRight: '-10%',
    marginLeft: '16%',
    tintColor: '#000',
  },
  titleText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
    // flex: 1,
    // textAlign: 'center',
  },
  createAccountTxt: {
    fontSize: 25,
    color: Colors.black,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginTop: 10,
  },
  icon: {
    marginTop: 10,
    marginHorizontal: 5,
  },
});

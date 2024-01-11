import React from 'react';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../customs/Colors';
import View from './wrapperComponent/ViewWrapper';
import Text from './wrapperComponent/TextWrapper';
import {darkModeColor} from '../utils/utils';
const Icon = ({color, size, name, style}) => {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
};

const Header = ({
  setEdit,
  fadeAnim,
  handleUploadImage,
  hideRight,
  isBack,
  label,
  navigation,
  labelStyle,
  borderBottomColor,
  darkMode,
}) => {
  return (
    <View style={{...styles.containerStyle, borderBottomColor}}>
      <Animated.View style={{opacity: fadeAnim}}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={async () => {
            if (isBack) {
              navigation.goBack();
            } else {
              setEdit && setEdit(false);
            }
          }}>
          {Icon({
            name: 'arrow-back-ios',
            size: 15,
            style: {padding: 2, paddingRight: 5},
            color: isBack ? darkModeColor(darkMode) : Colors.white,
          })}
          <Text customColor={labelStyle.color} style={labelStyle}>
            {label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      {hideRight ? null : (
        <Animated.View style={{opacity: fadeAnim}}>
          <TouchableOpacity
            // style={{padding: 1}}
            onPress={async () => {
              handleUploadImage && handleUploadImage();
            }}>
            {Icon({
              name: 'edit',
              size: 26,
              style: {padding: 5, paddingRight: 5},
              color: isBack ? Colors.black : Colors.white,
            })}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
});

import React from 'react';
import {Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Colors from '../../customs/Colors';

export const TextWrapper = props => {
  const {style, warning, signUpbutton, button, tab, customColor, ...restProps} =
    props || {};
  const colors = useTheme().colors;
  const color =
    customColor ||
    (warning
      ? 'red'
      : button
      ? 'white'
      : signUpbutton
      ? Colors.darkPaleMintColor
      : colors.text);
  const fontFamily = tab ? 'Roboto Black' : 'Montserrat';
  return (
    <Text
      style={{
        ...style,
        color,
        fontFamily,
      }}
      {...restProps}>
      {props?.children}
    </Text>
  );
};

export default TextWrapper;

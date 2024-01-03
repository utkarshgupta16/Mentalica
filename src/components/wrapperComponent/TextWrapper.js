import {Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Colors from '../../customs/Colors';

export const TextWrapper = props => {
  const {style, warning, signUpbutton, button, tab, customColor} = props || {};
  const colors = useTheme().colors;

  return (
    <Text
      style={{
        ...style,
        color:
          customColor ||
          (warning
            ? 'red'
            : button
            ? 'white'
            : signUpbutton
            ? Colors.darkPaleMintColor
            : colors.text),
        fontFamily: tab ? 'Roboto Black' : 'Montserrat',
      }}>
      {props?.children}
    </Text>
  );
};

export default TextWrapper;

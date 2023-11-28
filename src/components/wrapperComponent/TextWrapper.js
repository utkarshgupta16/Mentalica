import {Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
export const TextWrapper = props => {
  const {style} = props || {};
  const colors = useTheme().colors;
  return (
    <Text style={{...style, color: colors.text, fontFamily: 'Montserrat'}}>
      {props?.children}
    </Text>
  );
};

export default TextWrapper;

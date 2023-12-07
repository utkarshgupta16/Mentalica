import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Colors from '../../customs/Colors';
export const ViewWrapper = props => {
  const {style, isCard = false, slideHorizontal} = props || {};
  const colors = useTheme().colors;

  const {darkMode} = useSelector(state => state.home);

  return (
    <View
      style={{
        ...style,
        backgroundColor: isCard
          ? colors.card
          : darkMode && slideHorizontal
          ? Colors.darkPaleMintColor
          : darkMode
          ? colors.background
          : style?.backgroundColor,
      }}>
      {props?.children}
    </View>
  );
};

export default ViewWrapper;

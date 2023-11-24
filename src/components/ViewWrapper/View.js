import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
export const ViewWrapper = props => {
  const {style, isCard = false} = props || {};
  const colors = useTheme().colors;
  return (
    <View
      style={{
        ...style,
        backgroundColor: isCard ? colors.card : colors.background,
      }}>
      {props?.children}
    </View>
  );
};

export default ViewWrapper;

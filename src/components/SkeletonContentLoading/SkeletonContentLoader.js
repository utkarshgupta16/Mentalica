import {StyleSheet, View} from 'react-native';
import React from 'react';
import ContentLoader, {Circle, Rect} from 'react-content-loader/native';
import {heightPercentageToDP as hp} from '../../utils/Responsive';
import Colors from '../../customs/Colors';

const SkeletonContentLoader = ({index, fromInspection}) => {
  const width = fromInspection ? '100%' : '96%';
  const borderBottomWidth = fromInspection ? 1 : index === 1 ? 0 : 1;
  return (
    <View
      style={[
        styles.container,
        {
          width,
          borderBottomWidth,
        },
      ]}>
      <ContentLoader
        speed={2}
        width={400}
        height={40}
        viewBox="0 0 400 40"
        backgroundColor={Colors.primaryColor}
        foregroundColor={Colors.secondaryColor}>
        <Rect x="44" y="23" rx="3" ry="3" width="244" height="14" />
        <Rect x="44" y="4" rx="3" ry="3" width="147" height="14" />
        <Circle cx="20" cy="20" r="15" />
      </ContentLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(1),
    alignSelf: 'flex-end',
    borderColor: Colors.silver,
  },
});

export default SkeletonContentLoader;

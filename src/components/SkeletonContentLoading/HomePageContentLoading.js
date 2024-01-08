import React from 'react';
import {Dimensions, View} from 'react-native';
import SkeletonContentLoader from './SkeletonContentLoader';
import ContentLoader, {
  Circle,
  Rect,
  Facebook,
} from 'react-content-loader/native';
import Colors from '../../customs/Colors';
import {heightPercentageToDP as hp} from '../../utils/Responsive';
import styles from './SkeletonLoadingStyle';
const {width: windowWidth} = Dimensions.get('window');

const singleItemTabsWidth = {
  0: windowWidth - 40,
  1: windowWidth - 70,
  2: windowWidth - 120,
  3: windowWidth - 150,
};

const generateArray = length => Array.from(Array(length).keys());

export const SkeletonContentLoaderIterate = ({length}) => {
  const contentArray = generateArray(length);
  return contentArray.map((item, index) => {
    return <SkeletonContentLoader key={index} />;
  });
};

const singleItemLoading = index => {
  return (
    <View key={index} style={{marginTop: hp(1.5)}}>
      <View style={styles.singleItemLoadingStyle}>
        <TabContentLoading height={20} length={2} />
      </View>
      <TabContentLoading
        containerWidth={windowWidth}
        containerHeight={30}
        height={14}
        length={4}
        ry={15}
        tabsWidth={singleItemTabsWidth}
      />
    </View>
  );
};

export const ArticleContentLoader = () => {
  const contentArray = generateArray(4);
  const paddingHorizontal = 10;
  return (
    <View style={[styles.container, {paddingHorizontal}]}>
      {contentArray.map((val, index) => {
        return singleItemLoading(index);
      })}
    </View>
  );
};

export const FacebookContentLoading = ({length}) => {
  const contentArray = generateArray(length);
  const paddingHorizontal = 10;
  return (
    <View style={[styles.container, {paddingHorizontal}]}>
      {contentArray.map((item, index) => {
        return <Facebook key={index} />;
      })}
    </View>
  );
};

export const CircleContentLoading = ({length}) => {
  const contentArray = generateArray(length);
  return (
    <>
      {contentArray.map((item, index) => {
        return (
          <ContentLoader
            key={index}
            width={40}
            height={36}
            primaryColor={Colors.primaryColor}
            secondaryColor={Colors.secondaryColor}>
            <Circle cx="20" cy="20" r="15" />
          </ContentLoader>
        );
      })}
    </>
  );
};

export const TabContentLoading = ({
  length,
  containerWidth = 40,
  containerHeight = 36,
  width = 40,
  height = 30,
  tabsWidth,
  rx = 0,
  ry = 0,
}) => {
  const contentArray = generateArray(length);
  return (
    <>
      {contentArray.map((item, index) => {
        return (
          <ContentLoader
            key={index}
            width={(tabsWidth && tabsWidth[index] + 10) || containerWidth}
            height={containerHeight}
            primaryColor={Colors.primaryColor}
            secondaryColor={Colors.secondaryColor}>
            <Rect
              x={0}
              y={0}
              rx={rx}
              ry={ry}
              height={height}
              width={(tabsWidth && tabsWidth[index]) || width}
            />
          </ContentLoader>
        );
      })}
    </>
  );
};

export const HomeContentLoading = ({isLoading}) => {
  const top = isLoading.initialLoading ? 0 : 100;
  const contentArray = generateArray(9);
  const marginBottom = 0;
  return (
    <View style={[styles.container, {top}]}>
      {isLoading.initialLoading ? (
        <>
          <View style={[styles.circleContainer, {marginBottom}]}>
            <TabContentLoading length={7} />
          </View>
          <View style={styles.circleContainer}>
            <CircleContentLoading length={7} />
          </View>
        </>
      ) : null}
      {contentArray.map((item, index) => {
        return <SkeletonContentLoader key={item} index={index} />;
      })}
    </View>
  );
};

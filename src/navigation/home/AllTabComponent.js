/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {styles} from './homeDashboardStyle';
import {FlatList, Image, StyleSheet} from 'react-native';
import View from '../../components/wrapperComponent/ViewWrapper.js';
import Text from '../../components/wrapperComponent/TextWrapper.js';
import {articlesData} from '../../utils/default';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import convertLang from '../../utils/Strings';
import Colors from '../../customs/Colors';

const AllTabComponent = ({handleShadowVisible}) => {
  const {t} = useTranslation();
  const {
    RAQUAL_ALMEIDA,
    VIDEO_CALL,
    RECOMMENDED_ARTICLES,
    NEXT_AAPPOINTMENTS,
    MINS,
    TOMORROW,
  } = t && convertLang(t);

  const {darkMode} = useSelector(state => state.home);
  const renderItem = ({item}) => {
    return (
      <View
        style={{
          shadowColor: darkMode ? Colors.white : 'gray',
          borderColor: darkMode ? Colors.white : Colors.transparent,
          ...styles.allTabComponentStyle,
        }}>
        <Image source={{uri: item.image}} style={styles.allTabImage} />

        <View isCard={true} style={styles.allSubView}>
          <Text style={{fontSize: 16, fontWeight: '700', color: Colors.dune}}>
            {t(item?.title)}
          </Text>
          <Text style={{marginTop: 10, color: Colors.dune}}>
            {t(item?.author)}
          </Text>
        </View>
      </View>
    );
  };

  const handleOnScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 0) {
      handleShadowVisible(true);
    } else {
      handleShadowVisible(false);
    }
  };

  return (
    <>
      <View style={styles.belowTabsContainer}>
        <Text style={styles.headingText}>{NEXT_AAPPOINTMENTS}</Text>
        <View style={styles.nextAppointmentCont}>
          <View isCard={true} style={styles.leftCont}>
            <Text style={{marginBottom: 9, fontWeight: 'bold', fontSize: 14}}>
              {TOMORROW}
            </Text>
            <Text style={{fontWeight: 'bold', fontSize: 14}}>10:00</Text>
          </View>
          <View isCard={true} style={styles.rightCont}>
            <Text style={{marginBottom: 9, fontWeight: 'bold', fontSize: 16}}>
              {RAQUAL_ALMEIDA}
            </Text>
            <View isCard={true} style={styles.rightContVideoCall}>
              <Text style={{fontWeight: 'bold'}}>{VIDEO_CALL}</Text>
              <Text style={{fontWeight: 'bold'}}>50 {MINS}</Text>
            </View>
          </View>
        </View>
        {/* Recommended Articles */}
        <Text style={styles.headingText}>{RECOMMENDED_ARTICLES}</Text>
        <View style={styles.recommendedArticlesCont}>
          <FlatList
            data={articlesData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            onScroll={handleOnScroll}
          />
        </View>
      </View>
    </>
  );
};

export default React.memo(AllTabComponent);

import React from 'react';
import {styles} from './patientDashboardStyle';
import {FlatList, Image} from 'react-native';
import View from '../../wrapperComponent/ViewWrapper.js';
import Text from '../../wrapperComponent/TextWrapper.js';
import {articlesData} from '../../../utils/default';
import {useSelector} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useTranslation} from 'react-i18next';
import convertLang from '../../../utils/Strings';

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
          flexDirection: 'row',
          flex: 1,
          marginVertical: 9,
          shadowColor: darkMode ? 'white' : 'gray',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.87,
          shadowRadius: 4,
          elevation: 4,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          // borderWidth: darkMode ? 1 : 0,
          borderColor: darkMode ? '#fff' : null,
        }}>
        <Image
          source={{uri: item.image}}
          style={{
            width: '25%',
            height: 100,
            resizeMode: 'cover',
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        />

        <View
          isCard={true}
          style={{
            width: '75%',

            paddingVertical: 10,
            paddingHorizontal: 10,
            justifyContent: 'center',
            backgroundColor: '#F5F7F8',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: '700'}}>
            {t(item?.title)}
          </Text>
          <Text style={{marginTop: 10}}>{t(item?.author)}</Text>
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



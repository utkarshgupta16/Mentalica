import React from 'react';
import {styles} from './patientDashboardStyle';
import {FlatList,
  //  Text,
   View as View1,
  Image} from 'react-native';
import {articlesData} from '../../../utils/default';
import Text from '../../../components/TextWrapper';
import View from '../../../components/ViewWrapper';
const AllTabComponent = () => {
  return (
    <>
      <View style={styles.belowTabsContainer}>
        <Text style={styles.headingText}>Next Appointments</Text>
        <View isCard style={styles.nextAppointmentCont}>
          <View  style={styles.leftCont}>
            <Text style={{marginBottom: 9, fontWeight: 'bold', fontSize: 14}}>
              Tomorrow
            </Text>
            <Text style={{fontWeight: 'bold', fontSize: 14}}>10:00</Text>
          </View>
          <View style={styles.rightCont}>
            <Text style={{marginBottom: 9, fontWeight: 'bold', fontSize: 16}}>
              Raqual Almeida
            </Text>
            <View style={styles.rightContVideoCall}>
              <Text style={{fontWeight: 'bold'}}>Video call</Text>
              <Text style={{fontWeight: 'bold'}}>50 min</Text>
            </View>
          </View>
        </View>
        {/* Recommended Articles */}
        <Text style={styles.headingText}>Recommended articles</Text>
        <View  style={styles.recommendedArticlesCont}>
          <FlatList
            data={articlesData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
};

export default React.memo(AllTabComponent);

const renderItem = ({item}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 9,
        // borderWidth: 1,
        // borderColor: 'gray',
      }}>
      {/* <Image
        source={{uri: item.image}}
        style={{
          width: '30%',
          height: 100,
          resizeMode: 'cover',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      /> */}

      <View
        isCard={true}
        style={{
          width: '90%',
          paddingVertical: 10,
          paddingHorizontal: 10,
          justifyContent: 'center',
          backgroundColor: '#F5F7F8',
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}>
        <Text style={{fontSize: 16, fontWeight: '700'}}>{item?.title}</Text>
        <Text style={{marginTop: 10}}>{item?.author}</Text>
      </View>
    </View>
  );
};

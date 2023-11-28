import {View, Text} from 'react-native';
import React from 'react';
// import styles from './MentorsList';
import {FlatList} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';

const RenderHorizontalData = ({data, label, styles}) => {
  const {darkMode} = useSelector(state => state.home);

  return (
    <View style={{flexDirection: 'row', flex: 1}}>
      <Text
        style={[
          styles?.expertiesText,
          {color: darkMode ? 'white' : 'black', marginRight: 15},
        ]}>{`${label} :`}</Text>
      {data && data.length ? (
        <FlatList
          data={data}
          style={{flex: 0.8}}
          numColumns={3}
          columnWrapperStyle={{flexWrap: 'wrap'}}
          scrollEventThrottle={1900}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <View
                key={index}
                style={{
                  marginRight: 10,
                  borderRadius: 13,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  backgroundColor: '#eab676',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 14,
                    fontWeight: '300',
                    textAlign: 'center',
                  }}>
                  {item?.charAt(0).toUpperCase() + item?.slice(1)}
                </Text>
              </View>
            );
          }}
        />
      ) : null}
    </View>
  );
};

export default RenderHorizontalData;

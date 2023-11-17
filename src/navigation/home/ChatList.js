import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import React, {useCallback} from 'react';

const USER_ICON = require('../../assets/images/user-icon.webp');

const ChatList = ({navigation}) => {
  const renderItem = useCallback(({item}) => {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('Chats', {name: item.name, image: item.image});
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            alignItems: 'center',
            marginTop: 15,
          }}>
          <Image
            source={item?.image ? item.image : USER_ICON}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderWidth: 0.5,
              borderColor: 'gray',
            }}
          />
          <Text style={{marginLeft: 20}}>{item?.name}</Text>
        </View>
      </Pressable>
    );
  }, []);

  return (
    <TouchableOpacity
    //   onPress={() => {
    //     navigation.navigate('Chats');
    //   }}
    >
      <View>
        <FlatList data={chatListData} renderItem={renderItem} />
      </View>
    </TouchableOpacity>
  );
};

export default ChatList;

const styles = StyleSheet.create({});

const chatListData = [
  {
    name: 'Roshan',
    image: require('../../assets/images/roshan-profile.png'),
  },
  {
    name: 'Utkarsh',
    image: require('../../assets/images/utkarsh-pro.png'),
  },
  {
    name: 'Kaushiki',
  },
];

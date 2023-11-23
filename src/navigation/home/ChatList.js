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
import {CHATS_SCREEN} from '../../utils/route';
import Colors from '../../customs/Colors';

const USER_ICON = require('../../assets/images/user-icon.webp');

const ChatList = ({navigation}) => {
  const renderItem = useCallback(({item}) => {
    return (
      <Pressable
        style={{
          borderBottomWidth: 1,
          borderBottomColor: 'lightgray',
          paddingBottom: 10,
        }}
        onPress={() => {
          navigation.navigate(CHATS_SCREEN, {
            name: item.name,
            image: item.image,
          });
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            alignItems: 'center',
            marginTop: 10,
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
          <Text style={{marginLeft: 20, fontWeight: '500', fontSize: 16}}>
            {item?.name}
          </Text>
        </View>
      </Pressable>
    );
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: Colors.paleMintColor}}>
      <FlatList data={chatListData} renderItem={renderItem} />
    </View>
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

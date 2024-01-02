import {Text, Image, StyleSheet, Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {createChatRoom, createUserChatRoom} from '../../graphql/mutations';
import {CHATS_SCREEN, MESSAGES_TAB_ROUTE} from '../../utils/route';
import {getCommonChatRoomWithUser} from '../../services/chatRoomService';

dayjs.extend(relativeTime);

const ContactListItem = ({user}) => {
  const navigation = useNavigation();

  const onPress = async () => {
    // const existingChatRoom = await getCommonChatRoomWithUser(user.id);
    // console.log('newChatRoom==============', JSON.stringify(existingChatRoom));

    // if (existingChatRoom) {
    //   //   navigation.navigate('Chat', {id: existingChatRoom.chatRoom.id});
    //   navigation.navigate(MESSAGES_TAB_ROUTE, {
    //     screen: CHATS_SCREEN,
    //     params: {id: existingChatRoom.chatRoom.id, name: 'Sonu'},
    //   });
    //   return;
    // }

    // Create a new Chatroom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, {input: {}}),
    );
    if (!newChatRoomData.data?.createChatRoom) {
      console.log('Error creating the chat error');
    }

    const newChatRoom = newChatRoomData.data?.createChatRoom;
    // // Add the clicked user to the ChatRoom

    let resp1 = await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: {chatRoomId: newChatRoom.id, userId: user.id},
      }),
    );

    // Add the auth user to the ChatRoom
    const authUser = await Auth.currentAuthenticatedUser();

    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: {chatRoomId: newChatRoom.id, userId: authUser.attributes.sub},
      }),
    );
    navigation.navigate(MESSAGES_TAB_ROUTE, {
      screen: CHATS_SCREEN,
      params: {id:  newChatRoom.id,name:"Sonu"},
    });
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {user?.image ? (
        <Image source={{uri: user?.image}} style={styles.image} />
      ) : (
        <View style={styles.image} />
      )}

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {user?.name}
        </Text>

        <Text numberOfLines={2} style={styles.subTitle}>
          {user?.status}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
  },
  subTitle: {
    color: 'gray',
  },
});

export default ContactListItem;

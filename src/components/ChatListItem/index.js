import {Text, View, Image, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useEffect, useState} from 'react';
import {Auth, API, graphqlOperation} from 'aws-amplify';
import {onUpdateChatRoom} from '../../graphql/subscriptions';
import {CHATS_SCREEN, MESSAGES_TAB_ROUTE} from '../../utils/route';
import {createUser} from '../../graphql/mutations';

dayjs.extend(relativeTime);

const ChatListItem = ({chat}) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [chatRoom, setChatRoom] = useState({...chat});
console.log("chat",chat)
  useEffect(() => {
    const fetchUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      // Loop through chat.users.items and find a user that is not us (Authenticated user)
      const userItem =
        chatRoom?.users &&
        chatRoom?.users?.items?.find(
          item => item?.user?.id !== authUser.attributes.sub,
        );
      setUser(userItem?.user);
    };

    fetchUser();
  }, [chat]);

  // fetch Chat Room
  // useEffect(() => {
  //   const subscription = API.graphql(
  //     graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chat.id } } })
  //   ).subscribe({
  //     next: ({ value }) => {
  //       setChatRoom((cr) => ({
  //         ...(cr || {}),
  //         ...value.data.onUpdateChatRoom,
  //       }));
  //     },
  //     error: (err) => console.warn(err),
  //   });
  //   return () => subscription.unsubscribe();
  // }, [chat?.id]);


  return (
    <Pressable
      onPress={async () => {
        navigation.navigate(MESSAGES_TAB_ROUTE, {
          screen: CHATS_SCREEN,
          params: {id: chatRoom?.id, name: user?.name},
        });
      }}
      style={styles.container}>
      {user?.image ? (
        <Image source={{uri: user?.image}} style={styles.image} />
      ) : null}

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {chat?.name || user?.name}
          </Text>

          {chat?.LastMessage && (
            <Text style={styles.subTitle}>
              {dayjs(chat?.LastMessage?.createdAt).fromNow(true)}
            </Text>
          )}
        </View>

        <Text numberOfLines={2} style={styles.subTitle}>
          {chat?.LastMessage?.text}
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
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
  },
  subTitle: {
    color: 'gray',
  },
});

export default ChatListItem;

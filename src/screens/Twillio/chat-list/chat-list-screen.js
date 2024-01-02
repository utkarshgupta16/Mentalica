import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {colors} from '../colors';
import {TwilioService} from '../ConversationService';
import {ChatListLoader} from './components/chat-list-loader';
import {ChatListEmpty} from './components/chat-list-empty';
import {ChatListItem} from './components/chat-list-item';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteConversationSlice,
  getTwilloChatTokenSlice,
  updateChannels,
} from '../../../redux/HomeSlice';
import {CHAT_ROOM_SCREEN} from '../../../utils/route';
import {setAllParticipant} from '../../../redux/ParticipatSlice';
import {getOtherParticipant} from '../../../utils/utils';
import {updateCurrentConversation} from '../../../redux/CurrentConvoReducer';
const ChatListScreens = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  let {chatToken} = useSelector(state => state.home);
  const {email: username} = useSelector(state => state.auth);
  const typingData = useSelector(state => state?.typingData);
  const channels = useSelector(state => state?.conversations) ?? [];
  const unreadMessage = useSelector(state => state?.unreadMessage) ?? {};
  const participantObj = useSelector(state => state?.participants);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // const getSubscribedChannels = useCallback(
  //   client => {
  //     setLoading(true);
  //     return client.getSubscribedConversations().then(async convs => {
  //       let chats = [...convs.items];
  //       let newChannels = [];
  //       for await (let channel of chats) {
  //         const lastMessage = await channel.getMessages(
  //           1,
  //           channel.lastMessage?.index || 0,
  //         );
  //         const unreadCount = await channel.getUnreadMessagesCount();
  //         const lastMessageText = lastMessage.items[0]?.body || 'Media message';
  //         let obj = TwilioService.getInstance().parseChannel(channel);
  //         newChannels.push({...obj, unreadCount, lastMessageText});
  //       }
  //       dispatch(updateChannels({channels: newChannels, isUpdate: false}));
  //     });
  //   },
  //   [dispatch],
  // );

  const getTokenNew = useCallback(
    async userName => {
      try {
        let {payload} = await dispatch(getTwilloChatTokenSlice(userName));
        return payload?.accessToken;
      } catch (err) {
        console.log('Error%%%%%%%%%%%% New ', err);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    TwilioService.getInstance()
      .getChatClient()
      // .then(() => TwilioService.getInstance()?.addTokenListener(getTokenNew))
      // .then(setChannelEvents)
      // .then(getSubscribedChannels)
      .catch(err => {})
      .finally(() => setLoading(false));
  }, [chatToken, getTokenNew]);

  // let sortedChannels = useMemo(() => {
  //   let channelsNew = [...channels];
  //   channelsNew = channelsNew.sort(
  //     (channelA, channelB) =>
  //       channelB?.lastMessageTime - channelA?.lastMessageTime,
  //   );
  //   return channelsNew;
  // }, [channels]);

  return (
    <View style={styles.screen}>
      {loading ? (
        <ChatListLoader />
      ) : (
        <FlatList
          data={channels}
          username={username}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => {
            let otherUser = getOtherParticipant(
              item?.attributes?.participants,
              username,
            );
            return (
              <ChatListItem
                channel={item}
                typingInfo={typingData[item.sid] || []}
                participantStatus={participantObj}
                otherUser={otherUser}
                username={username}
                unreadCount={unreadMessage[item.sid]?.unreadCount || 0}
                lastMessage={unreadMessage[item.sid]?.lastMessage || ''}
                onLongPress={() => {
                  Alert.alert(
                    'Delete conversation!',
                    'Are you sure to delete this conversation',
                    [
                      {text: 'No', onPress: () => null},
                      {
                        text: 'Yes',
                        onPress: async () => {
                          setLoading(true);
                          let {meta: {arg: sid} = {}} = await dispatch(
                            deleteConversationSlice(item?.sid),
                          );
                          // let participantsObjNew = {...participantsObj};
                          // delete participantsObjNew[sid];
                          // dispatch(
                          //   updateAfterRemoveParticipant(participantsObjNew),
                          // );
                          // let newChannels =
                          //   channels.filter(channel => {
                          //     if (channel?.id === sid) {
                          //       return false;
                          //     }
                          //     return true;
                          //   }) || [];
                          // dispatch(updateChannels(newChannels));
                          setLoading(false);
                        },
                      },
                    ],
                  );
                }}
                onPress={() => {
                  navigation.navigate(CHAT_ROOM_SCREEN, {
                    channelId: item?.sid,
                    identity: username,
                    otherUser,
                  });
                  dispatch(updateCurrentConversation(item?.sid));
                }}
              />
            );
          }}
          ListEmptyComponent={<ChatListEmpty />}
        />
      )}
    </View>
  );
};

export default ChatListScreens;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.snow,
  },
  addButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.white,
  },
});

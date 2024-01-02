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
import {
  updateParticipant,
  setParticipant,
  setAllParticipant,
} from '../../../redux/ParticipatSlice';
const ChatListScreens = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  let {channels = [], chatToken} = useSelector(state => state.home);
  // const [channels, updateChannels] = useState([]);
  const conversationList = useRef([]);
  const client = useRef();
  const {email: username} = useSelector(state => state.auth);
  let isTyping = useRef(false);
  const {participants: participantObj} = useSelector(
    state => state?.participants,
  );
  const channelPaginator = useRef();
  const [message, showMessage] = useState({message: ''});
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

  const setChannelEvents = useCallback(
    client => {
      client.on('messageAdded', async message => {
        // let selectedChannel =
        //   channels.filter(
        //     channel => channel?.id === message?.conversation?.sid,
        //   ) || [];
        // let newChannels = [...channels];
        // newChannels =
        //   newChannels.map(channel =>
        //     channel.id === message?.conversation?.sid
        //       ? {
        //           ...channel,
        //           lastMessageTime: new Date(message?.dateCreated).getTime(),
        //           lastMessageText: message?.body,
        //         }
        //       : channel,
        //   ) || [];
        // message?.conversation?.getUnreadMessagesCount().then(countƒ => {
        //   console.log("lastMessageText",countƒ)
        // });
        const newMessage = {
          channelId: message?.conversation?.sid,
          dateCreated: new Date(message?.dateCreated).getTime(),
          body: message?.body,
          unreadCount:
            message.author === username
              ? undefined
              : await message?.conversation?.getUnreadMessagesCount(),
        };
        dispatch(updateChannels({newMessage, isUpdate: true}));
      });
      return client;
    },
    [dispatch, username],
  );

  // const setChannelEvents = useCallback(
  //   client => {
  //     client.on('messageAdded', messageItem => {
  //       let selectedChannel = null;
  //       updateChannels(prevChannels =>
  //         prevChannels.map(channel => {
  //           let check = channel.id === messageItem?.conversation?.sid;
  //           // if (check) {
  //           //   selectedChannel = channel;
  //           // }
  //           return check
  //             ? {
  //                 ...channel,
  //                 lastMessageTime: new Date(messageItem?.dateCreated).getTime(),
  //                 lastMessageText: messageItem?.body,
  //               }
  //             : channel;
  //         }),
  //       );
  //       // if (messageItem?.author === username && selectedChannel) {
  //       //   messageItem?.conversation?.updateAttributes({
  //       //     lastMessageText: messageItem?.body,
  //       //     participants: selectedChannel?.attributes?.participants || [],
  //       //   });
  //       // }
  //     });
  //     return client;
  //   },
  //   [username],
  // );

  // const setChannelEvents = useCallback(client => {
  //   client.on('messageAdded', messageItem => {
  //     // newChannels =
  //     //   newChannels.map(channel =>
  //     //     channel.id === messageItem?.conversation?.sid
  //     //       ? {
  //     //           ...channel,
  //     //           lastMessageTime: new Date(messageItem?.dateCreated).getTime(),
  //     //           lastMessageText: messageItem?.body,
  //     //         }
  //     //       : channel,
  //     //   ) || [];

  //     // dispatch(updateChannels(newChannels));
  //     updateChannels(prevChannels =>
  //       prevChannels.map(channel =>
  //         channel.id === messageItem?.conversation?.sid
  //           ? {
  //               ...channel,
  //               lastMessageTime: new Date(messageItem?.dateCreated).getTime(),
  //               lastMessageText: messageItem?.body,
  //             }
  //           : channel,
  //       ),
  //     );
  //   });
  //   return client;
  // }, []);

  const updateUserOnlineOffline = useCallback(
    client => {
      client.on('updated', function ({user}) {
        const {notifiable, identity, isOnline} = user || {};
        // {user}
        // notifiable
        // entityName
        // identity
        // online
        // let newChannels = channels.map(val => {
        //   if (val.id == channel.sid) {
        //     return {
        //       ...val,
        //       isOnline: user.isOnline,
        //     };
        //   }
        //   return val;
        // });
        dispatch(
          setParticipant({
            notifiable,
            identity,
            isOnline,
          }),
        );
      });
    },
    [dispatch],
  );

  const getSubscribedChannels = useCallback(
    client => {
      setLoading(true);
      return client.getSubscribedConversations().then(async convs => {
        let chats = [...convs.items];
        let newChannels = [];
        let participantsIdentity = {};
        for await (const channel of chats) {
          const lastMessage = await channel.getMessages(
            1,
            channel.lastMessage?.index || 0,
          );
          const participants = await channel?.getParticipants();
          const participant =
            participants.filter(val => val?.state?.identity !== username) || [];
          let result = participant.length && (await participant[0].getUser());
          participantsIdentity[result.identity] = {
            ...participantsIdentity,
            isOnline: result?.isOnline,
            identity: result.identity,
          };
          let obj = {
            id: channel?.sid,
            name: channel?.friendlyName,
            isOnline: result?.isOnline || false,
            // lastMessageText: channel?.attributes?.lastMessageText || '',
            attributes: channel?.attributes,
            createdAt: new Date(channel?.dateCreated).getTime(),
            updatedAt: new Date(channel?.dateUpdated).getTime(),
            lastMessageTime: new Date(
              channel?.lastMessage?.dateCreated ??
                channel?.dateUpdated ??
                channel?.dateCreated,
            ).getTime(),
            unreadCount: await channel.getUnreadMessagesCount(),
            lastMessageText: lastMessage.items[0]?.body,
          };
          newChannels.push(obj);
        }
        // updateChannels([...newChannels]);
        dispatch(updateChannels({channels: newChannels, isUpdate: false}));
        dispatch(setAllParticipant(participantsIdentity));
        // console.log('conversationList', newChannels);
        // chats.forEach(async (chat, index) => {
        //   const lastMessage = await chat.getMessages(
        //     1,
        //     chat.lastMessage?.index || 0,
        //   );
        //   console.log('lastMessage', lastMessage.items[0]?.body);
        //   let obj = {
        //     // chat: chat,
        //     unreadCount: await chat.getUnreadMessagesCount(),
        //     lastMessage: lastMessage.items[0]?.body,
        //   };

        //   conversationList.current[index] = obj;
        //   data.push(obj);
        // });
      });
      // return client?.getSubscribedConversations().then(paginator => {
      //   channelPaginator.current = paginator;
      //   // // updateConversationData(channelPaginator.current.items);
      //   const newChannels = TwilioService.getInstance().parseChannels(
      //     channelPaginator.current.items,
      //   );
      //   // dispatch(updateChannels(newChannels));
      //   updateChannels([...newChannels]);
      // });
    },
    [dispatch, username],
  );

  // console.log('conversationList', conversationList);

  // const getSubscribedChannels = useCallback(
  //   client => {
  //     console.log('newChannels=======', client);

  //     client.getSubscribedChannels().then(paginator => {
  //       channelPaginator.current = paginator;
  //       const newChannels = TwilioService.getInstance().parseChannels(
  //         channelPaginator.current.items,
  //       );

  //       dispatch(updateChannels(newChannels));
  //     });

  //     return client;
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

  const reduxifyParticipant = participant => {
    return {
      sid: participant?.sid,
      attributes: participant?.attributes,
      identity: participant?.identity,
      type: participant?.type,
      lastReadMessageIndex: participant?.lastReadMessageIndex,
    };
  };
  // console.log('TwilioService', TwilioService.chatClient);
  useEffect(
    () => {
      // getTokenNew(username)
      //   .then(
      //     token => token && TwilioService.getInstance().getChatClient(token),
      //   )
      //   .then(() => TwilioService.getInstance()?.addTokenListener(getTokenNew))
      chatToken &&
        TwilioService.getInstance()
          .getChatClient(chatToken)
          .then(() =>
            TwilioService.getInstance()?.addTokenListener(getTokenNew),
          )
          .then(setChannelEvents)
          .then(getSubscribedChannels)
          .catch(err => showMessage({message: err.message, type: 'danger'}))
          .finally(() => setLoading(false));
      return () => TwilioService?.getInstance()?.clientShutdown();
    },
    [chatToken, setChannelEvents, getTokenNew, getSubscribedChannels],
    // [username, setChannelEvents, getSubscribedChannels, getTokenNew]
  );

  useEffect(() => {
    let mainClient = null;
    // getTokenNew(username)
    //   .then(token => token && TwilioService.getInstance().getChatClient(token))
    TwilioService.getInstance()
      .getChatClient(chatToken)
      .then(client => {
        // mainClient = client;
        client &&
          client.on('conversationJoined', conversation => {
            conversation?.getParticipants().then(participants => {
              participants.forEach(participant => {
                if (username !== participant?.state?.identity) {
                  participant.getUser().then(result => {
                    // const {state: {identity} = {}} = result || {};
                    // if (participantObj[identity] === undefined) {
                    //   dispatch(
                    //     setParticipant({
                    //       identity,
                    //       isOnline: result.isOnline,
                    //     }),
                    //   );
                    // }
                    updateUserOnlineOffline(result);
                  });
                }
              });
            });
          });
        // console.log('typingEnded############ new', client.participant);
        // const user = client.user;
        // client.on('userUpdated', function ({user, updateReasons = []}) {
        //   const checkIsOnline = updateReasons?.indexOf('reachabilityOnline');
        //   if (checkIsOnline >= 0) {
        //     const {notifiable, identity, isOnline} = user || {};
        //     dispatch(
        //       setParticipant({
        //         notifiable,
        //         identity,
        //         isOnline,
        //       }),
        //     );
        //   }
        // });
      });

    // client.on('tokenAboutToExpire', () => {
    //   console.log('About to expire');
    //   getTokenNew().then(TwilioService.chatClient.updateToken);
    // });
    // client.on('tokenExpired', () => {
    //   console.log('tokenExpired');
    //   client.removeAllListeners();
    //   getTokenNew().then(TwilioService.chatClient.updateToken);
    // });
    // client.on('connectionStateChanged', state =>
    //   setState(twilioStatus[state]),
    // );

    // client.on('conversationLeft', conversation => {
    // conversation.on('typingEnded', async participant => {
    //   console.warn('typingEnded############ new');
    // });
    // });
    // }

    // return () => {
    //   mainClient && mainClient?.removeAllListeners();
    // };
  }, [
    chatToken,
    username,
    // getTokenNew,
    updateUserOnlineOffline,
    dispatch,
    participantObj,
  ]);

  let sortedChannels = useMemo(() => {
    let channelsNew = [...channels];
    channelsNew = channelsNew.sort(
      (channelA, channelB) =>
        channelB?.lastMessageTime - channelA?.lastMessageTime,
    );
    return channelsNew;
  }, [channels]);

  return (
    <View style={styles.screen}>
      {loading ? (
        <ChatListLoader />
      ) : (
        <FlatList
          data={sortedChannels}
          username={username}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => {
            let participants = item?.attributes?.participants || [];
            let otherUser =
              (participants.length &&
                participants.filter(val => {
                  if (val?.identity !== username) {
                    return true;
                  }
                  return false;
                })) ||
              [];
            otherUser = (otherUser && otherUser.length && otherUser[0]) || {};
            return (
              <ChatListItem
                channel={item}
                participants={participantObj}
                otherUser={otherUser}
                username={username}
                isTyping={isTyping?.current}
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
                            deleteConversationSlice(item?.id),
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
                onPress={() =>
                  navigation.navigate(CHAT_ROOM_SCREEN, {
                    channelId: item?.id,
                    identity: username,
                    otherUser,
                  })
                }
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

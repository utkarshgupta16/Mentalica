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
  Pressable,
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
  updateConversationSlice,
} from '../../../redux/HomeSlice';
import {ChatCreateScreen} from '../CreateChannel';
import {CHAT_ROOM_SCREEN} from '../../../utils/route';
import {Client, Conversation} from '@twilio/conversations';
import {
  updateAfterRemoveParticipant,
  updateParticipant,
  setParticipant,
} from '../../../redux/ParticipatSlice';
import {twilioStatus} from '../../../utils/utils';

const ChatListScreens = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [checkConnection, setState] = useState('');
  let {channels = []} = useSelector(state => state.home);
  const token = useSelector(state => state.home.chatToken);
  const {email: username} = useSelector(state => state.auth);
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

  const setChannelEvents = useCallback(client => {
    client.on('messageAdded', message => {
      let selectedChannel =
        channels.filter(
          channel => channel?.id === message?.conversation?.sid,
        ) || [];
      let newChannels = [...channels];
      newChannels =
        newChannels.map(channel =>
          channel.id === message?.conversation?.sid
            ? {
                ...channel,
                lastMessageTime: new Date(message?.dateCreated).getTime(),
                lastMessageText: message?.body,
              }
            : channel,
        ) || [];

      dispatch(updateChannels(newChannels));
      if (message?.author == username && selectedChannel.length) {
        message?.conversation?.updateAttributes({
          lastMessageText: message?.body,
          participants: selectedChannel[0]?.attributes?.participants || [],
        });
      }
    });
    return client;
  }, []);

  const updateUserOnlineOffline = client => {
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
  };

  const updateConversationData = conversations => {
    new Promise.all(
      conversations.map(channel => {
        return channel?.getParticipants().then(participants => {
          let participantObj = null;
          participants.forEach(participant => {
            if (username != participant?.state?.identity) {
              participantObj = participant.getUser().then(result => {
                updateUserOnlineOffline(result, channel);
                return {
                  sid: channel?.sid,
                  friendlyName: channel?.friendlyName,
                  attributes: channel?.attributes,
                  dateCreated: channel?.dateCreated,
                  dateUpdated: channel?.dateUpdated,
                  isOnline: result?.isOnline,
                };
              });
            }
          });
          return participantObj;
        });
      }),
    ).then(response => {
      new Promise.all(response).then(results => {
        const newChannels = TwilioService.getInstance().parseChannels(results);
        dispatch(updateChannels(newChannels));
        setLoading(false);
      });
    });
  };

  const getSubscribedChannels = useCallback(client => {
    setLoading(true);
    return client?.getSubscribedConversations().then(paginator => {
      channelPaginator.current = paginator;
      // updateConversationData(channelPaginator.current.items);
      const newChannels = TwilioService.getInstance().parseChannels(
        channelPaginator.current.items,
      );
      dispatch(updateChannels(newChannels));
    });
  }, []);

  const getTokenNew = async username => {
    try {
      let {payload} = await dispatch(getTwilloChatTokenSlice(username));
      return payload?.accessToken;
    } catch (err) {
      console.log('Error%%%%%%%%%%%% New ', err);
    }
  };

  const reduxifyParticipant = participant => {
    return {
      sid: participant?.sid,
      attributes: participant?.attributes,
      identity: participant?.identity,
      type: participant?.type,
      lastReadMessageIndex: participant?.lastReadMessageIndex,
    };
  };

  const updateParticipants = async conversation => {
    const result = await conversation?.getParticipants();
    let participants = (result && result.map(reduxifyParticipant)) || [];
    dispatch(updateParticipant({participants, sid: conversation.sid}));
  };

  useEffect(() => {
    // const client = TwilioService.chatClient;
    // console.log('About to expire', client);
    // if (client && Object.keys(client).length) {
    getTokenNew(username)
      .then(token => token && TwilioService.getInstance().getChatClient(token))
      .then(client => {
        client.on('conversationJoined', conversation => {
          conversation?.getParticipants().then(participants => {
            participants.forEach(participant => {
              if (username != participant?.state?.identity) {
                participant.getUser().then(result => {
                  updateUserOnlineOffline(result);
                });
              }
            });
          });
        });
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
    // const user = client.user;
    // user.on('updated', function (event) {
    //   console.warn('typingEnded############ new');
    // });
    // client.on('conversationLeft', conversation => {
    // conversation.on('typingEnded', async participant => {
    //   console.warn('typingEnded############ new');
    // });
    // });
    // }

    // return () => {
    //   client && Object.keys(client).length && client?.removeAllListeners();
    // };
  }, []);

  useEffect(() => {
    getTokenNew(username)
      .then(token => token && TwilioService.getInstance().getChatClient(token))
      .then(() => TwilioService.getInstance()?.addTokenListener(getTokenNew))

      .then(setChannelEvents)
      .then(getSubscribedChannels)
      .catch(err => showMessage({message: err.message, type: 'danger'}))
      .finally(() => setLoading(false));
    return () => TwilioService?.getInstance()?.clientShutdown();
  }, [username, setChannelEvents, getSubscribedChannels]);

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
            let participants = item?.attributes?.participants || [];
            let otherUser =
              (participants.length &&
                participants.filter(val => {
                  if (val?.identity != username) {
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
                          let newChannels =
                            channels.filter(channel => {
                              if (channel?.id === sid) {
                                return false;
                              }
                              return true;
                            }) || [];
                          dispatch(updateChannels(newChannels));
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

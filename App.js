import React, {useCallback, useEffect, useRef, useState} from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/utils/i18n';
import reactotron from 'reactotron-react-native';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {fcmService} from './src/utils/fcmServices';
import {localNotificationService} from './src/utils/localPushNotification';
import PushNotification from 'react-native-push-notification';
import {androidPlatform} from './src/utils/config';
import {getTwilloChatTokenSlice, updateChannels} from './src/redux/HomeSlice';
import {useDispatch, useSelector} from 'react-redux';
import {TwilioService} from './src/screens/Twillio/ConversationService';
import {setAllParticipant, setParticipant} from './src/redux/ParticipatSlice';
import {
  upsertConversation,
  removeConversation,
  updateConversation,
} from './src/redux/ConvoSlice';
import {
  conversationsMap,
  mediaMap,
  messagesMap,
} from './src/redux/coversation-objects';
import {endTyping, startTyping} from './src/redux/TypingDataSlice';
import {updateUnreadMessages} from './src/redux/UnReadMessageCountSlice';
import {updateCurrentConversation} from './src/redux/CurrentConvoReducer';
import Colors from './src/customs/Colors';
import {Auth} from 'aws-amplify';
import {updateToken} from './src/redux/AuthSlice';
import jwtDecode from 'jwt-decode';
import BackgroundTimer from 'react-native-background-timer';

export const AppContext = React.createContext(initialState);

const LOCAL_NOTIFICATION_CHANNEL_ID = 'high_priority_alerts';
let notificationIDs = 0;
const initialState = {
  isAudioEnabled: true,
  status: 'disconnected',
  participants: new Map(),
  videoTracks: new Map(),
  userName: '',
  roomName: '',
  token: '',
  isVideoEnabled: true,
};

function onNotification(notify) {
  const options = {
    playSound: true,
  };
  if (androidPlatform) {
    if (Platform.Version > 25) {
      PushNotification.getChannels(channelIDs => {
        if (
          channelIDs &&
          channelIDs.length > 0 &&
          channelIDs.includes(LOCAL_NOTIFICATION_CHANNEL_ID)
        ) {
          notificationIDs += 1;
          localNotificationService.showNotification(
            notificationIDs,
            notify.notification?.title
              ? notify.notification?.title
              : notify?.data?.title,
            notify.notification?.body
              ? notify.notification?.body
              : notify?.data?.body,
            notify?.data,
            options,
            LOCAL_NOTIFICATION_CHANNEL_ID,
          );
        } else {
          PushNotification.createChannel(
            {
              channelId: LOCAL_NOTIFICATION_CHANNEL_ID, // (required)
              channelName: 'Mentalica Application', // (required)
              importance: 3,
            },
            created => {
              notificationIDs += 1;
              if (created) {
                localNotificationService.showNotification(
                  notificationIDs,
                  notify.notification?.title
                    ? notify.notification?.title
                    : notify?.data?.title,
                  notify.notification?.body
                    ? notify.notification?.body
                    : notify?.data?.body,
                  notify?.data,
                  options,
                  LOCAL_NOTIFICATION_CHANNEL_ID,
                );
              }
            },
          );
        }
      });
    } else {
      notificationIDs += 1;
      localNotificationService.showNotification(
        notificationIDs,
        notify.notification?.title
          ? notify.notification?.title
          : notify?.data?.title,
        notify.notification?.body
          ? notify.notification?.body
          : notify?.data?.body,
        notify?.data,
        options,
      );
    }
  } else {
    localNotificationService.showNotification(
      0,
      notify.notification?.title
        ? notify.notification?.title
        : notify?.data?.title,
      notify.notification?.body
        ? notify.notification?.body
        : notify?.data?.body,
      notify?.data,
      options,
    );
  }
}

function onOpenNotification(data) {}

function onRegister(token) {}

const registerNotification = () => {
  fcmService.register(onRegister, onNotification, onOpenNotification);
  localNotificationService.configure(onOpenNotification);
};

const App = () => {
  const [props, setProps] = useState(initialState);
  const {email, isLoggedIn, userToken} = useSelector(state => state.auth);
  const currentConvoSid = useSelector(state => state.currentConversation);
  const mainClient = useRef();
  const sidRef = useRef('');
  sidRef.current = currentConvoSid;
  const dispatch = useDispatch();

  const {darkMode} = useSelector(state => state.home);

  useEffect(() => {
    if (androidPlatform) {
      const requestPushNotificationPermission = async () => {
        try {
          if (Platform.Version > 32) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
              {
                title: 'Push Notification Permission',
                message: 'This app requires access for push notification.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              Platform.OS === 'android' && registerNotification();
            } else {
              console.log('please allow notification permission from settings');
            }
          } else {
            Platform.OS === 'android' && registerNotification();
          }
        } catch (err) {
          console.error('errror --> ', err);
          return false;
        }
      };
      Platform.OS === 'android' && requestPushNotificationPermission();
    } else {
      Platform.OS === 'android' && fcmService.registerAppWithFCM();
      Platform.OS === 'android' &&
        fcmService.register(onRegister, onNotification, onOpenNotification);
      Platform.OS === 'android' &&
        localNotificationService.configure(onOpenNotification);
    }
    return () => {
      Platform.OS === 'android' && fcmService.unRegister();
      Platform.OS === 'android' && localNotificationService.unregister();
    };
  }, []);

  const getTokenNew = useCallback(
    async (userName, token) => {
      if ((userName || email) && isLoggedIn) {
        try {
          let {payload} = await dispatch(
            getTwilloChatTokenSlice({email: userName || email, token}),
          );
          return payload?.accessToken;
        } catch (err) {
          console.log('Error%%%%%%%%%%%% New ', err);
        }
      }
    },
    [dispatch, isLoggedIn, email],
  );

  const updateIsOnlineStatus = useCallback(
    props => {
      dispatch(setParticipant(props));
    },
    [dispatch],
  );

  const updateUserOnlineOffline = useCallback(
    client => {
      client.on('updated', function ({user}) {
        const {notifiable, identity, isOnline} = user || {};
        updateIsOnlineStatus({
          notifiable,
          identity,
          isOnline,
        });
      });
    },
    [updateIsOnlineStatus],
  );

  const conversationJoinedM = useCallback(
    conversation => {
      conversation?.getParticipants().then(participants => {
        participants.forEach(participant => {
          if (email !== participant?.state?.identity) {
            participant.getUser().then(result => {
              updateUserOnlineOffline(result);
            });
          }
        });
      });
    },
    [email, updateUserOnlineOffline],
  );

  const removeMessageListener = useCallback(message => {
    if (messagesMap.has(message?.sid)) {
      messagesMap.delete(message?.sid);
      if (message?.attachedMedia) {
        message?.attachedMedia.forEach(media => {
          if (mediaMap.has(media?.sid)) {
            mediaMap.delete(media?.sid);
          }
        });
      }
    }
  }, []);

  const updateTypingIndicator = useCallback(
    (participant, sid, callback) => {
      const {identity} = participant || {};
      if (identity === email) {
        return;
      }
      dispatch(
        callback({
          channelSid: sid,
          participant: identity || '',
        }),
      );
    },
    [email, dispatch],
  );

  const upsertConversationData = useCallback(
    conversation => {
      let obj = TwilioService.getInstance().parseChannel(conversation);
      dispatch(upsertConversation(obj));
    },
    [dispatch],
  );

  const loadUnreadMessagesCount = useCallback(
    async (convo, lastMessage) => {
      let unreadCount = 0;
      try {
        unreadCount =
          (await convo.getUnreadMessagesCount()) ??
          (await convo.getMessagesCount());
      } catch (e) {
        console.error('getUnreadMessagesCount threw an error', e);
      }
      dispatch(
        updateUnreadMessages({channelSid: convo.sid, unreadCount, lastMessage}),
      );
    },
    [dispatch],
  );

  const updateUnReadCountMessage = useCallback(
    async (conversation, messageBody) => {
      let message = messageBody ? messageBody?.body : '';

      if (conversation?.sid === sidRef?.current && messageBody) {
        await conversation.advanceLastReadMessageIndex(messageBody.index);
      }
      let lastMessageTime = messageBody?.lastMessageTime;
      if (!messageBody) {
        const lastMessage = await conversation.getMessages(
          1,
          conversation?.lastMessage?.index || 0,
        );
        const lastMessageText = lastMessage.items[0]?.body || 'Media message';
        message = lastMessageText;
        lastMessageTime = new Date(
          lastMessage?.items[0]?.dateCreated,
        ).getTime();
        const participantData = (await conversation?.getParticipants()) || [];
        const participant =
          participantData.filter(val => val?.state?.identity !== email) || [];
        let {isOnline, identity, notifiable} =
          (participant.length && (await participant[0].getUser())) || {};
        updateIsOnlineStatus({
          notifiable,
          identity,
          isOnline,
        });
      }

      await loadUnreadMessagesCount(conversation, message);
      lastMessageTime &&
        (await dispatch(
          updateConversation({
            channelSid: conversation.sid,
            parameters: {lastMessageTime},
          }),
        ));
    },
    [loadUnreadMessagesCount, sidRef, email, updateIsOnlineStatus, dispatch],
  );

  useEffect(() => {
    if (isLoggedIn) {
      getTokenNew(email)
        ?.then(
          chatToken =>
            chatToken && TwilioService.getInstance().getChatClient(chatToken),
        )
        // .then(() => TwilioService.getInstance()?.addTokenListener(updateTokenM))
        ?.then(client => {
          mainClient.current = client;

          client.on('conversationJoined', async conversation => {
            updateUnReadCountMessage(conversation);
            conversationJoinedM(conversation);
            upsertConversationData(conversation);
            conversation.on('typingStarted', participant => {
              updateTypingIndicator(
                participant,
                conversation?.sid,
                startTyping,
              );
            });
            conversation.on('typingEnded', async participant => {
              updateTypingIndicator(participant, conversation?.sid, endTyping);
            });
          });

          client.on('messageAdded', async message => {
            updateUnReadCountMessage(message.conversation, {
              body: message.body,
              author: message.author,
              index: message.index,
              lastMessageTime: new Date(message?.dateCreated).getTime(),
            });
          });

          client.on('conversationRemoved', async conversation => {
            dispatch(updateCurrentConversation(''));
            dispatch(removeConversation(conversation.sid));
          });

          client.on('messageRemoved', removeMessageListener);

          // client.user.on('updated', async user => {});
        });
    }

    return () => {
      isLoggedIn &&
        mainClient?.current &&
        mainClient?.current?.removeAllListeners();
      isLoggedIn &&
        TwilioService.chatClient &&
        TwilioService?.getInstance()?.clientShutdown();
    };
  }, [
    // conversationJoinedM,
    email,
    getTokenNew,
    dispatch,
    // getSubscribedChannels,
    removeMessageListener,
    isLoggedIn,
    updateTypingIndicator,
    updateUnReadCountMessage,
    upsertConversationData,
    conversationJoinedM,
  ]);

  const updateTokenBackground = useCallback(() => {
    BackgroundTimer.runBackgroundTimer(async () => {
      try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        const currentSession = await Auth.currentSession();
        cognitoUser.refreshSession(
          currentSession?.refreshToken,
          (error, session) => {
            const {idToken, refreshToken} = session;

            dispatch(
              updateToken({
                userToken: {
                  jwtToken: idToken?.jwtToken,
                  refreshToken: refreshToken?.token,
                },
              }),
            );

            getTokenNew(email, idToken?.jwtToken)?.then(
              token =>
                token && TwilioService.getInstance().getChatClient(token),
            );
            // do whatever you want to do now :)
          },
        );
      } catch (e) {
        console.log('Unable to refresh Token', e);
      }
      //code that will be called every 23 58 min
    }, 1000 * 3600 * 23 + 1000 * 60 * 58);
  }, [dispatch, email, getTokenNew]);

  const isTokenExpired = useCallback(token => {
    if (!token) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp) {
      return decodedToken.exp < currentTime;
    } else {
      return true;
    }
  }, []);

  const updateTokenM = useCallback(async () => {
    if (!isTokenExpired(userToken?.jwtToken)) {
      getTokenNew(email)?.then(
        chatToken =>
          chatToken && TwilioService.getInstance().getChatClient(chatToken),
      );
      return;
    }
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const currentSession = await Auth.currentSession();
    cognitoUser.refreshSession(
      currentSession?.refreshToken,
      (error, session) => {
        const {idToken, refreshToken, accessToken} = session;
        dispatch(
          updateToken({
            userToken: {
              jwtToken: idToken?.jwtToken,
              refreshToken: refreshToken?.token,
            },
          }),
        );
        getTokenNew(email, idToken?.jwtToken)?.then(
          chatToken =>
            chatToken && TwilioService.getInstance().getChatClient(chatToken),
        );
        // do whatever you want to do now :)
      },
    );
  }, [dispatch, isTokenExpired, getTokenNew, email, userToken]);

  useEffect(() => {
    updateTokenBackground();
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [updateTokenBackground]);

  if (__DEV__) {
    const yeOldeConsoleLog = console.log;
    console.log = (...args) => {
      yeOldeConsoleLog(...args);
      reactotron.display({
        name: 'CONSOLE.LOG',
        value: args,
        preview:
          args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
      });
    };
  }

  return (
    <AppContext.Provider value={{props, setProps}}>
      <I18nextProvider i18n={i18n}>
        <StatusBar
          backgroundColor={darkMode ? Colors.black : Colors.white} // Set the background color
          barStyle={darkMode ? 'light-content' : 'dark-content'} // Set the text color (light content for white text)
        />
        <SafeAreaView
          style={[styles.safeAreaViewStyle, darkMode && styles.backgroundBlack]}
        />
        <MainNavigator style={styles.mainNavigator} />
      </I18nextProvider>
    </AppContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 0,
    // borderWidth: 1,
  },
  backgroundBlack: {
    backgroundColor: Colors.black,
  },
});

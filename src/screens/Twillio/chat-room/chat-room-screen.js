/* eslint-disable no-new */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {TwilioService} from '../ConversationService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RenderCustomView from './RenderCustomView';
import RenderMessageVideo from './RenderMessageVideo';
import RenderFooter from './RenderFooter';
import RenderSend from './RenderSend';
import RenderBubble from './RenderBubble';
import RenderActions from './RenderActions';
import RenderMessageImage from './RenderMessageImage';
import styles from './RenderChatMessageStyle';
import Colors from '../../../customs/Colors';
import {whatsAppBackgroundURI} from '../../../assets/images';
import {
  createFormData,
  initialMediaData,
  removeMessage,
} from '../../../utils/utils';
import {colors} from '../colors';
import {useDispatch, useSelector} from 'react-redux';
import {messagesMap} from '../../../redux/coversation-objects';
import ScreenLoading from '../../../components/ScreenLoading';
import {resetCount} from '../../../redux/UnReadMessageCountSlice';
import {updateCurrentConversation} from '../../../redux/CurrentConvoReducer';
import {clearAttachments} from '../../../redux/AttachmentSlice';

const ChatRoomScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {channelId, identity, otherUser = {}} = route.params;
  const typingData = useSelector(state => state?.typingData);
  let [messages, setMessages] = useState([]);
  let [medias, selectedMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingEarlier, setLoadingEarlier] = useState(false);
  const [selectedMessages, setToDeleteMessage] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const chatClientChannel = useRef();
  const participantRef = useRef();
  const totalMessageCount = useRef(0);
  const chatMessagesPaginator = useRef();
  const [message, showMessage] = useState({message: ''});
  const textInputRef = useRef();
  const [focusIndex, setFocusIndex] = useState(
    messages && messages.length ? messages[messages?.length - 1].index : -1,
  );
  // const updateUnReadCount = useCallback(
  //   channelID => {
  //     dispatch(
  //       updateChannels({
  //         newMessage: {channelId: channelID},
  //         isUpdateCount: true,
  //       }),
  //     );
  //   },
  //   [dispatch],
  // );

  const updateUnReadCount = useCallback(
    channelID => {
      dispatch(
        resetCount({
          channelSid: channelID,
        }),
      );
    },
    [dispatch],
  );

  const updateMessageWithURL = newMessages => {
    return new Promise.all(
      newMessages.map(async (val, index) => {
        if (val.type === 'media' && val?.attachedMedia?.length) {
          let image = {};
          const {contentType, filename} = val?.attachedMedia[0] || {};
          let mediaType = contentType?.split('/')[0];
          let fileType = mediaType === 'application' ? 'document' : mediaType;
          image = {
            [fileType]: filename,
            fileType,
            filename: filename,
          };
          return {
            ...val,
            ...image,
          };
        }
        return val;
      }),
    );
  };

  const messageListener = useCallback(
    message => {
      const newMessage = TwilioService.getInstance().parseMessage(message);
      const {giftedId} = message.attributes;
      // if (giftedId) {
      try {
        // setIsSending(true);
        updateMessageWithURL([newMessage]).then(updatedMessage => {
          const newMessage1 = updatedMessage[0] || {};
          if (!messagesMap.has(newMessage1.sid)) {
            messagesMap.set(newMessage1.sid, newMessage1);
          }
          setMessages(prevMessages => {
            if (prevMessages.some(({_id}) => _id === giftedId)) {
              return prevMessages.map(m =>
                m._id === giftedId
                  ? {
                      ...newMessage1,
                      attachedMedia: m?.attachedMedia,
                      isLocal: m?.isLocal,
                    }
                  : m,
              );
            }
            return [newMessage1, ...prevMessages];
          });
          chatClientChannel.current.setAllMessagesRead();
          if (message?.author === identity) {
            clearAttachments(message?.conversation?.sid, '-1');
          }
        });
      } catch (err) {}

      // }
    },
    [identity],
  );

  const setChannelEvents = useCallback(
    channel => {
      chatClientChannel.current = channel;
      chatClientChannel.current.on('messageAdded', messageListener);
      return chatClientChannel.current;
    },
    [messageListener],
  );

  useEffect(() => {
    // updateMessageAttribute({messages, identity});
    // chatClientChannel?.current?.setAllMessagesRead();
    updateUnReadCount(channelId);
  }, [channelId, updateUnReadCount]);

  const updateMessages = useCallback((paginator, isInitial) => {
    chatMessagesPaginator.current = paginator;
    const newMessages = TwilioService.getInstance().parseMessages(
      paginator?.items,
    );
    try {
      setIsSending(true);
      updateMessageWithURL(newMessages).then(dataMessage => {
        if (isInitial) {
          setMessages(dataMessage);
        } else {
          if (dataMessage && dataMessage.length) {
            setMessages(prev => [...prev, ...dataMessage]);
          }
        }
        setIsSending(false);
      });
    } catch (err) {
      setIsSending(false);
    }
  }, []);

  const updateParticipantListner = useCallback(
    async ({participant, updateReasons}) => {
      if (participant?.identity !== identity) {
        setMessages(prev => {
          return prev.map(message => {
            if (
              participant?.lastReadMessageIndex &&
              participant?.lastReadMessageIndex >= message?.index
            ) {
              message = {
                ...message,
                received: 1,
              };
              return message;
            }
            return message;
          });
        });
        // setLastReadMessageIndex(participant?.lastReadMessageIndex);
      }
    },
    [identity],
  );

  useEffect(() => {
    TwilioService.getInstance()
      .getChatClient()
      .then(async client => {
        let channel = await client?.getConversationBySid(channelId);
        client.on('participantUpdated', updateParticipantListner);
        if (channel) {
          channel.getMessagesCount().then(result => {
            totalMessageCount.current = result;
          });
          channel.getParticipants().then(participants => {
            participantRef.current = participants;
          });
          channel.setAllMessagesRead().then(() => {});
        }
        return channel;
      })
      .then(channel => {
        chatClientChannel.current = channel;
        return setChannelEvents(channel);
      })
      .then(currentChannel => {
        return currentChannel?.getMessages();
      })
      .then(paginator => {
        updateMessages(paginator, true);
      })
      .catch(err => showMessage({message: err.message, type: 'danger'}))
      .finally(() => {
        setLoading(false);
      });
    return () => {
      if (chatClientChannel?.current) {
        chatClientChannel?.current?.removeListener(
          'messageAdded',
          messageListener,
        );
        chatClientChannel?.current?.removeListener(
          'participantUpdated',
          updateParticipantListner,
        );
      }
      dispatch(updateCurrentConversation(''));
    };
  }, [
    channelId,
    setChannelEvents,
    chatClientChannel,
    updateMessages,
    identity,
    messageListener,
    updateParticipantListner,
    dispatch,
  ]);

  const onSend = useCallback(async (newMessages = [], mediasNew = []) => {
    const attributes = {giftedId: newMessages[0]._id};
    const lastMessageIndex = chatClientChannel?.current?.lastMessage?.index;

    const prepareMessageRef = chatClientChannel?.current?.prepareMessage();

    newMessages[0]?.text && prepareMessageRef?.setBody(newMessages[0]?.text);

    prepareMessageRef?.setAttributes(attributes);
    if (mediasNew?.length) {
      for (let i = 0; i < mediasNew.length; i++) {
        let image = mediasNew[i];
        let mediasData = createFormData(image);
        prepareMessageRef?.addMedia(mediasData);
      }
      let images =
        initialMediaData({mediasNew, newMessages, lastMessageIndex}) || [];
      setMessages(prevMessages => GiftedChat.append(prevMessages, images));
    }
    // mediasNew.length && setIsSending(true);
    selectedMedia([]);
    const messageIndex = await prepareMessageRef.build().send();
    // mediasNew.length && setIsSending(false);
    try {
      chatClientChannel?.current?.advanceLastReadMessageIndex(
        messageIndex ?? 0,
      );
    } catch (e) {
      // mediasNew.length && setIsSending(false);
      throw e;
    }
    // else if (newMessages && newMessages.length) {
    //   // let newMessagesObj = {
    //   //   ...newMessages[0],
    //   //   index: lastMessageIndex + 1,
    //   //   sent: true,
    //   // };
    //   // setMessages(prevMessages =>
    //   //   GiftedChat.append(prevMessages, [newMessagesObj]),
    //   // );
    //   chatClientChannel.current
    //     ?.sendMessage(newMessages[0].text, attributes)
    //     .then(currentIndex => {
    //       chatClientChannel?.current?.advanceLastReadMessageIndex(
    //         currentIndex ?? 0,
    //       );
    //       chatClientChannel.current.setAllMessagesRead();
    //     });
    // }
  }, []);

  const typingInfo = useMemo(
    () => typingData[channelId] ?? [],
    [channelId, typingData],
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => null,
      headerLeft: () => (
        <TouchableOpacity
          onPress={async () => {
            navigation.goBack();
          }}
          style={{flexDirection: 'row'}}>
          <MaterialIcons
            name="arrow-back-ios"
            size={16}
            color={colors.black}
            style={{padding: 2, paddingRight: 5}}
          />
          <View>
            <Text style={styles.headerChatRoomStyle}>
              {otherUser?.username}
            </Text>
            {typingInfo.length ? (
              <Text
                style={{
                  fontSize: 14,
                  paddingVertical: 3,
                  color: Colors.purple,
                }}>
                {'Typing...'}
              </Text>
            ) : (
              <View style={{paddingVertical: 11}} />
            )}
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => {
        if (selectedMessages.length === 0) {
          return null;
        }
        return (
          <TouchableOpacity
            onPress={async () => {
              Alert.alert('Are you sure want to delete? ', `you are deleting`, [
                {
                  text: 'Yes',
                  onPress: async () => {
                    const selectedMessagesArr = selectedMessages.map(
                      val => val?._id,
                    );
                    try {
                      setIsSending(true);
                      await removeMessage({selectedMessages}).then(() => {
                        setMessages(previousMessage =>
                          previousMessage.filter(messageItem => {
                            return !selectedMessagesArr.includes(
                              messageItem?._id,
                            );
                          }),
                        );
                        setToDeleteMessage([]);
                      });
                      setIsSending(false);
                    } catch (err) {
                      setIsSending(false);
                    }
                  },
                },
                {
                  text: 'No',
                  onPress: () => null,
                },
              ]);
            }}
            style={{flexDirection: 'row'}}>
            <MaterialIcons
              name="delete"
              size={26}
              color={'gray'}
              style={{padding: 2, paddingRight: 5}}
            />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, otherUser?.username, selectedMessages, typingInfo]);

  const renderActions = props => (
    <RenderActions actionsProps={props} selectedMedia={selectedMedia} />
  );
  const renderBubble = props => (
    <RenderBubble
      channelParticipants={participantRef.current}
      bubbleProps={props}
      identity={identity}
    />
  );

  const renderMessageVideo = ({currentMessage}) => (
    <RenderMessageVideo
      navigation={navigation}
      currentMessage={currentMessage}
      selectedMessages={selectedMessages}
    />
  );
  const renderMessageImage = props => (
    <RenderMessageImage
      props={props}
      selectedMessages={selectedMessages}
      // onDownloadAttachments={onDownloadAttachments}
      // conversationAttachments={conversationAttachments}
      channelId={channelId}
    />
  );
  const renderCustomView = ({currentMessage}) => (
    <RenderCustomView
      selectedMessages={selectedMessages}
      currentMessage={currentMessage}
      navigation={navigation}
      channelId={channelId}
      // onDownloadAttachments={onDownloadAttachments}
      // conversationAttachments={conversationAttachments}
    />
  );
  const renderFooter = () => (
    <RenderFooter
      medias={medias}
      selectedMedia={selectedMedia}
      navigation={navigation}
    />
  );
  const renderSend = props => (
    <RenderSend
      medias={medias}
      textInputRef={textInputRef}
      onSend={onSend}
      navigation={navigation}
      sendProps={props}
    />
  );

  const selectMessageToDeleteM = currentMessage => {
    setToDeleteMessage(prev => {
      const {_id} = currentMessage || {};
      const newMessages = [...prev];
      const filterData = newMessages.filter(
        messageItem => messageItem._id !== _id,
      );
      if (filterData.length === newMessages.length) {
        newMessages.push(currentMessage);
        return [...newMessages];
      } else {
        return [...filterData];
      }
    });
  };

  const onLoadEarlierMessage = () => {
    if (
      totalMessageCount &&
      messages.length &&
      totalMessageCount.current > messages.length
    ) {
      try {
        let indexNewestMessage = messages[messages.length - 1].index - 1;
        setLoadingEarlier(true);
        chatClientChannel.current
          .getMessages(30, indexNewestMessage)
          .then(paginator => {
            if (paginator.items.length) {
              updateMessages(paginator);
            }
            setLoadingEarlier(false);
          });
      } catch (err) {
        setLoadingEarlier(false);
      }
    }
  };

  const handleFocus = () => {
    // Hand over focus to message bubbles once there is at least one
    if (messages && messages.length && focusIndex < 0) {
      setFocusIndex(messages[messages.length - 1].index);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const newFocusValue = message.index + (e.key === 'ArrowUp' ? -1 : 1);
    }
  };

  const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToTop = 80;
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  };

  const throttle = (func, delay) => {
    let prev = 0;
    return (...args) => {
      let now = new Date().getTime();
      if (now - prev > delay) {
        prev = now;
        return func(...args);
      }
    };
  };

  const throttleChange = useMemo(
    () =>
      throttle(() => {
        chatClientChannel?.current?.typing();
        if (
          chatClientChannel?.current?.lastReadMessageIndex !==
          chatClientChannel?.current?.lastMessage?.index
        ) {
          chatClientChannel?.current?.setAllMessagesRead();
        }
      }, 500),
    [chatClientChannel],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ImageBackground
        source={whatsAppBackgroundURI}
        style={{flex: 1, justifyContent: 'center'}}>
        {message ? <Text>{message?.message}</Text> : null}
        {isSending ? <ScreenLoading /> : null}
        {loading ? (
          <ActivityIndicator size={'large'} color={Colors.blueDarkColor} />
        ) : (
          <GiftedChat
            messagesContainerStyle={{paddingBottom: 10}}
            containerStyle={{paddingVertical: 5}}
            onPress={async (args, currentMessage) => {
              const isMe = currentMessage?.user?._id === identity;
              isMe && selectMessageToDeleteM(currentMessage);
            }}
            // listViewProps={{
            //   scrollEventThrottle: 1000,
            //   onScroll: ({nativeEvent}) => {
            //     if (isCloseToTop(nativeEvent)) {
            //       if (!ScrollDebounce.current) {
            //         ScrollDebounce.current = true;
            //         onLoadEarlierMessage();
            //         console.log('messageContainerRef');
            //         setTimeout(() => {
            //           ScrollDebounce.current = false;
            //         }, 500);
            //       }
            //     }
            //   },
            // }}
            onLoadEarlier={onLoadEarlierMessage}
            loadEarlier={
              totalMessageCount?.current > messages?.length ? true : false
            }
            isLoadingEarlier={isLoadingEarlier}
            textInputRef={textInputRef}
            messages={messages}
            renderMessageImage={renderMessageImage}
            renderMessageVideo={renderMessageVideo}
            renderCustomView={renderCustomView}
            renderFooter={renderFooter}
            alwaysShowSend={true}
            quickReplyStyle={{borderRadius: 2}}
            // onSend={messages => onSend(messages)}
            renderSend={renderSend}
            renderActions={renderActions}
            renderBubble={renderBubble}
            isTyping={true}
            scrollToBottom={true}
            scrollToBottomStyle={{backgroundColor: Colors.white}}
            scrollToBottomComponent={() => {
              return (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={32}
                  color={'gray'}
                />
              );
            }}
            user={{
              _id: identity,
            }}
            textInputProps={{
              onChange: () => {
                throttleChange();
              },
            }}
            timeTextStyle={{
              left: {color: Colors.blueDarkColor},
              right: {color: Colors.blueDarkColor},
            }}
            // renderMessage={props => (
            //   <RenderMessage
            //     props={props}
            //     identity={identity}
            //     selectedMessages={selectedMessages}
            //     selectMessageToDeleteM={selectMessageToDeleteM}
            //     navigation={navigation}
            //     setToDeleteMessage={setToDeleteMessage}
            //   />
            // )}
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ChatRoomScreen;

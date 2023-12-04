import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {colors} from '../colors';
import {TwilioService} from '../ConversationService';
import {Conversation, Client} from '@twilio/conversations';
import {useDispatch, useSelector} from 'react-redux';
import {getTwilloChatTokenSlice} from '../../../redux/HomeSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export function ChatRoomScreen({route, navigation}) {
  const dispatch = useDispatch();
  const {email: username} = useSelector(state => state.auth);
  const {channelId, identity, otherUser = {}} = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTypingValue, setTyping] = useState(false);
  const chatClientChannel = useRef();
  const chatMessagesPaginator = useRef();
  const [message, showMessage] = useState({message: ''});
  // const conversation = useRef();
  const setChannelEvents = useCallback(channel => {
    chatClientChannel.current = channel;
    chatClientChannel.current.on('messageAdded', message => {
      const newMessage = TwilioService.getInstance().parseMessage(message);
      const {giftedId} = message.attributes;
      if (giftedId) {
        setMessages(prevMessages => {
          if (prevMessages.some(({_id}) => _id === giftedId)) {
            return prevMessages.map(m => (m._id === giftedId ? newMessage : m));
          }
          return [newMessage, ...prevMessages];
        });
      }
    });
    return chatClientChannel.current;
  }, []);

  useEffect(() => {
    TwilioService.getInstance()
      .getChatClient()
      .then(async client => {
        let channel = await client.getConversationBySid(channelId);
        return channel;
      })
      .then(channel => {
        chatClientChannel.current = channel;
        return setChannelEvents(channel);
      })
      .then(currentChannel => {
        return currentChannel.getMessages();
      })
      .then(paginator => {
        chatMessagesPaginator.current = paginator;
        const newMessages = TwilioService.getInstance().parseMessages(
          paginator.items,
        );
        setMessages(newMessages);
      })
      .catch(err => showMessage({message: err.message, type: 'danger'}))
      .finally(() => setLoading(false));
    // return () => {
    //   if (
    //     chatClientChannel?.current &&
    //     chatClientChannel?.current?.removeListener
    //   ) {
    //     chatClientChannel?.current?.removeListener('messageAdded', val => {
    //       // console.log('chatClientChannel?.current?.removeListener', val);
    //     });
    //   }
    // };
  }, [channelId, setChannelEvents, chatClientChannel]);

  // useEffect(() => {
  //   chatClientChannel.current?.on('typingStarted', user => {
  //     if (user.conversation.sid === channelId) {
  //       console.log('typing..', user.conversation.sid, channelId);
  //       setTyping(true);
  //     }
  //   });
  //   chatClientChannel.current?.on('typingEnded', user => {
  //     console.log('typing end..', user.conversation.sid, channelId);
  //     if (user.conversation.sid === channelId) {
  //       setTyping(false);
  //     }
  //   });
  //   return () => {
  //     chatClientChannel?.current?.removeListener('typingStarted', () => {});
  //     chatClientChannel?.current?.removeListener('typingEnded', () => {});
  //   };
  // }, [chatClientChannel,channelId]);

  const onSend = useCallback((newMessages = []) => {
    const attributes = {giftedId: newMessages[0]._id};
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
    chatClientChannel.current?.sendMessage(newMessages[0].text, attributes);
  }, []);

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
            color={'gray'}
            style={{padding: 2, paddingRight: 5}}
          />
          <Text>{otherUser?.username}</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require('../../../assets/images/watsapp-background.png')}
        style={{flex: 1, justifyContent: 'center'}}>
        {message ? <Text>{message.message}</Text> : null}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <GiftedChat
            messages={messages}
            renderAvatarOnTop
            onSend={messages => onSend(messages)}
            isTyping={isTypingValue}
            user={{_id: identity}}
            textInputProps={{
              onFocus: () => {
                // chatClientChannel?.current?.typing();
              },
            }}
          />
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: 'tealff',
    flex: 1,
  },
  messageContainer: {
    backgroundColor: colors.snow,
  },
});

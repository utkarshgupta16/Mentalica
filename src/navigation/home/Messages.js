import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {useTranslation} from 'react-i18next';
import {View, Text, ImageBackground} from 'react-native';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar:
            'https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci83OTI3ZjVkMTg5MDQ1ZTFjOWRlZjNjMGZlOGQ4NmM0Yj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.DpLiE4p83L1FXZVvfjqYOlfZO3FhjQ4x2ZntSxR2S9o',
        },
      },
      {
        _id: 2,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 3,
          name: 'React Native',
          avatar:
            'https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci83OTI3ZjVkMTg5MDQ1ZTFjOWRlZjNjMGZlOGQ4NmM0Yj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.DpLiE4p83L1FXZVvfjqYOlfZO3FhjQ4x2ZntSxR2S9o',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'tealff'}}>
      <ImageBackground
        source={require('../../assets/images/watsapp-background.png')}
        style={{flex: 1, justifyContent: 'center'}}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default Messages;

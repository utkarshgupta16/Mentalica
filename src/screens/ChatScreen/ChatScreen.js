import {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Message from '../../components/Message';
import InputBox from '../../components/InputBox';
import {API, graphqlOperation} from 'aws-amplify';
// import {generateClient} from '@aws-amplify/api';
import {
  getChatRoom,
  listMessages,
  messagesByChatroomID,
  listMessagesByChatRoom,
} from '../../graphql/queries';
// import {listMessagesByChatRoom} from './ChatScreenQueries';
import {
  onCreateAttachment,
  onCreateMessage,
  onUpdateChatRoom,
  onUpdateChatRoom1,
  onUpdateMessage,
  onUpdateUser,
} from '../../graphql/subscriptions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../customs/Colors';
import {useSelector} from 'react-redux';
import {updateMessage} from '../../graphql/mutations';

// import {Feather} from '@expo/vector-icons';

const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setTyping] = useState(false);
  const {attributes} = useSelector(state => state.home);
  const route = useRoute();
  const [otherStatus, setOnline] = useState(route?.params?.otherStatus);
  const navigation = useNavigation();
  const chatroomID = route?.params?.id;
  const otherUserId = route?.params?.otherUserId;
  const userItemCurrent = route?.params?.userItemCurrent;

  // fetch Chat Room
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, {id: chatroomID})).then(result =>
      setChatRoom(result.data?.getChatRoom),
    );

    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {filter: {id: {eq: chatroomID}}}),
    ).subscribe({
      next: ({value}) => {
        setChatRoom(cr => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: err => console.warn(err),
    });

    return () => subscription.unsubscribe();
  }, [chatroomID]);

  const readMessage = async messages => {
    let messagesFiltered =
      messages.filter(
        val => val.status === 'DELIVERED' && val.userID != attributes.sub,
      ) || [];
    if (messagesFiltered.length) {
      for (let message of messagesFiltered) {
        const newMessage1 = {
          id: message.id,
          status: 'READ',
        };
        const newMessageData1 = await API.graphql(
          graphqlOperation(updateMessage, {input: newMessage1}),
        );
      }
    }
  };

  const fetchMessage = () => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID,
        sortDirection: 'DESC',
      }),
    ).then(result => {
      setMessages(result.data?.listMessagesByChatRoom?.items);
      readMessage(result.data?.listMessagesByChatRoom?.items);
    });
  };
  //   // fetch Messages
  useEffect(() => {
    fetchMessage();
    // Subscribe to new messages
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, {
        filter: {chatroomID: {eq: chatroomID}},
      }),
    ).subscribe({
      next: ({value}) => {
        setMessages(m => [value.data.onCreateMessage, ...m]);
      },
      error: err => console.warn(err),
    });

    const subscription1 = API.graphql(
      graphqlOperation(onUpdateMessage),
    ).subscribe({
      next: ({value}) => {
        // let data=messages.filter(val=>)
        fetchMessage();
      },
      error: err => console.warn(err),
    });

    const subscription3 = API.graphql(
      graphqlOperation(onUpdateUser, {
        filter: {id: {eq: otherUserId}},
      }),
    ).subscribe({
      next: ({value}) => {
        // console.log('fetchMessage#########', value);
        // fetchMessage();
        setOnline(value.data.onUpdateUser.status);
      },
      error: err => console.warn(err),
    });

    const subscriptionTyping = API.graphql(
      graphqlOperation(onUpdateChatRoom1, {
        filter: {id: {eq: chatroomID}},
      }),
    ).subscribe({
      next: ({value}) => {
        // console.log('fetchMessage#########', JSON.stringify(value.data.onUpdateChatRoom.LastMessage));
        // fetchMessage();
        setTyping(
          value.data?.onUpdateChatRoom?.lastTypingAt == 1 ? true : false,
        );
      },
      error: err => console.warn(err),
    });

    // Subscribe to new attachments
    // const subscriptionAttachments = API.graphql(
    //   graphqlOperation(onCreateAttachment, {
    //     filter: { chatroomID: { eq: chatroomID } },
    //   })
    // ).subscribe({
    //   next: ({ value }) => {
    //     const newAttachment = value.data.onCreateAttachment;
    //     setMessages((existingMessages) => {
    //       const messageToUpdate = existingMessages.find(
    //         (em) => em.id === newAttachment.messageID
    //       );
    //       if (!messageToUpdate) {
    //         return existingMessages;
    //       }
    //       if (!messageToUpdate?.Attachments?.items) {
    //         messageToUpdate.Attachments.items = [];
    //       }
    //       messageToUpdate.Attachments.items.push(newAttachment);

    //       return existingMessages.map((m) =>
    //         m.id === messageToUpdate.id ? messageToUpdate : m
    //       );
    //     });
    //   },
    //   error: (err) => console.warn(err),
    // });

    return () => {
      subscription.unsubscribe();
      subscription1.unsubscribe();
      subscription3.unsubscribe();
      subscriptionTyping.unsubscribe();
      // subscriptionAttachments.unsubscribe();
    };
  }, [chatroomID]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.name,
      headerLeft: () => {
        return (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios"
              size={16}
              color={Colors.grey}
            />
            {otherStatus == 'online' ? (
              <Text style={{color: 'blue', fontWeight: '600', paddingRight: 5}}>
                Online
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      },
      //   headerRight: () => (
      //     <Pressable
      //       onPress={() => navigation.navigate('Group Info', {id: chatroomID})}>
      //       <Text>Go</Text>
      //     </Pressable>
      //   ),
    });
  }, [route.params?.name, chatroomID, otherStatus]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }
  // const updateMessage = async data => {
  //   let result = await API.graphql(
  //     graphqlOperation(listMessagesByChatRoom, {
  //       chatroomID,
  //       sortDirection: 'DESC',
  //     }),
  //   );
  //   setMessages([...result.data?.listMessagesByChatRoom?.items]);
  // };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 90}
      style={styles.bg}>
      <ImageBackground
        source={require('../../assets/images/watsapp-background.png')}
        style={styles.bg}>
        <FlatList
          keyExtractor={(item, index) => index}
          data={messages || []}
          renderItem={({item, index}) => (
            <Message
              isMe={item.userID === attributes.sub}
              key={index}
              message={item}
            />
          )}
          style={styles.list}
          inverted
        />
        <InputBox chatroom={chatRoom} isTyping={isTyping} userItemCurrent={userItemCurrent}/>
       
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});

export default ChatScreen;

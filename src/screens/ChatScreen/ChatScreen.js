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
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Message from '../../components/Message';
import InputBox from '../../components/InputBox';
import {API, graphqlOperation,PubSub} from 'aws-amplify';
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
} from '../../graphql/subscriptions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../customs/Colors';

// import {Feather} from '@expo/vector-icons';

const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const chatroomID = route?.params?.id;
  // console.log("chatroomID",chatroomID)
  // fetch Chat Room
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, {id: chatroomID})).then(result =>
      setChatRoom(result.data?.getChatRoom),
    );
    // const subscription = API.graphql(
    //   graphqlOperation(onUpdateChatRoom, {
    //     filter: {id: {eq: chatroomID}},
    //   }),
    // ).subscribe({
    //   next: ({value}) => {
    //     setChatRoom(cr => ({
    //       ...(cr || {}),
    //       ...value.data.onUpdateChatRoom,
    //     }));
    //   },
    //   error: err => console.warn(err),
    // });

    // return () => subscription.unsubscribe();
  }, [chatroomID]);

  //   // fetch Messages
  useEffect(() => {
    // New
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID,
        sortDirection: 'DESC',
      }),
    ).then(result => {
      setMessages(result.data?.listMessagesByChatRoom?.items);
    });
    console.log('chatroomID', chatroomID);

    // Subscribe to new messages
    // const subscription = API.graphql(
    //   graphqlOperation(onCreateMessage),
    // ).subscribe({
    //   next: value => {
    //     console.log('onCreateMessage%%%%%%%%%%% ', value);
    //   },
    //   error: err => console.warn(err),
    // });

    // const subscription = client.graphql({query: onCreateMessage}).subscribe({
    //   next: ({data}) => console.log('onCreateMessage$$$$$$$$$', data),
    //   error: error => console.warn(error),
    // });
    // Subscribe to new attachments
    // const subscriptionAttachments = API.graphql(
    //   graphqlOperation(onCreateAttachment, {
    //     filter: {chatroomID: {eq: chatroomID}},
    //   }),
    // ).subscribe({
    //   next: ({value}) => {
    //     const newAttachment = value.data.onCreateAttachment;
    //     setMessages(existingMessages => {
    //       const messageToUpdate = existingMessages.find(
    //         em => em.id === newAttachment.messageID,
    //       );
    //       if (!messageToUpdate) {
    //         return existingMessages;
    //       }
    //       if (!messageToUpdate?.Attachments?.items) {
    //         messageToUpdate.Attachments.items = [];
    //       }
    //       messageToUpdate.Attachments.items.push(newAttachment);

    //       return existingMessages.map(m =>
    //         m.id === messageToUpdate.id ? messageToUpdate : m,
    //       );
    //     });
    //   },
    //   error: err => console.warn(err),
    // });

    return () => {
      // subscription?.unsubscribe();
      //   subscriptionAttachments.unsubscribe();
    };
  }, [chatroomID]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.name,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={16} color={Colors.grey} />
        </TouchableOpacity>
      ),
      //   headerRight: () => (
      //     <Pressable
      //       onPress={() => navigation.navigate('Group Info', {id: chatroomID})}>
      //       <Text>Go</Text>
      //     </Pressable>
      //   ),
    });
  }, [route.params?.name, chatroomID]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }
  const updateMessage = async data => {
    let result = await API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID,
        sortDirection: 'DESC',
      }),
    );
    setMessages([...result.data?.listMessagesByChatRoom?.items]);
  };

  return (
    <SafeAreaView
      key={messages.length}
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
            <Message index={index} key={index} message={item} />
          )}
          style={styles.list}
          inverted
        />
        <InputBox chatroom={chatRoom} updateMessage={updateMessage} />
      </ImageBackground>
    </SafeAreaView>
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

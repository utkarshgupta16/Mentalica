import {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  Text,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {API, graphqlOperation, Auth, Storage, DataStore} from 'aws-amplify';
import {
  createMessage,
  updateChatRoom,
  createAttachment,
  updateUser,
} from '../../graphql/mutations';
// import * as ImagePicker from "expo-image-picker";

import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {Message} from '../../models';
import {onUpdateChatRoom, onUpdateUser} from '../../graphql/subscriptions';
import {useSelector} from 'react-redux';

const InputBox = ({chatroom, isTyping, userItemCurrent}) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [progresses, setProgresses] = useState({});
  const {attributes} = useSelector(state => state.home);
  const onSend = async () => {
    const authUser = await Auth.currentAuthenticatedUser();

    const newMessage = {
      chatroomID: chatroom?.id,
      text,
      userID: authUser.attributes.sub,
      status: 'DELIVERED',
    };

    // const newMessage = await DataStore.save(
    //   new Message({
    //     text, // <- this messages should be encrypted
    //     userID: authUser.attributes.sub,
    //     chatroomID: chatroom?.id,
    //     status:"SENT"
    //   })
    // );
    const newMessageData = await API.graphql(
      graphqlOperation(createMessage, {input: newMessage}),
    );

    setText('');
    // updateMessage &&
    //   newMessageData &&
    //   updateMessage(newMessageData?.data?.createMessage);

    // create attachments
    // await Promise.all(
    //   files.map(file =>
    //     addAttachment(file, newMessageData.data.createMessage.id),
    //   ),
    // );
    // setFiles([]);

    // set the new message as LastMessage of the ChatRoom
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatroom._version,
          chatRoomLastMessageId: newMessageData?.data?.createMessage.id,
          id: chatroom?.id,
        },
      }),
    );
  };

  const addAttachment = async (file, messageID) => {
    const types = {
      image: 'IMAGE',
      video: 'VIDEO',
    };

    const newAttachment = {
      storageKey: await uploadFile(file.uri),
      type: types[file.type],
      width: file.width,
      height: file.height,
      duration: file.duration,
      messageID,
      chatroomID: chatroom.id,
    };
    return API.graphql(
      graphqlOperation(createAttachment, {input: newAttachment}),
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   quality: 1,
    //   allowsMultipleSelection: true,
    // });
    // if (!result.cancelled) {
    //   if (result.selected) {
    //     setFiles(result.selected);
    //   } else {
    //     setFiles([result]);
    //   }
    // }
  };

  const uploadFile = async fileUri => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const key = `${uuidv4()}.png`;

      await Storage.put(key, blob, {
        contentType: 'image/png', // contentType is optional
        progressCallback: progress => {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setProgresses(p => ({
            ...p,
            [fileUri]: progress.loaded / progress.total,
          }));
        },
      });
      return key;
    } catch (err) {
      console.log('Error uploading file:', err);
    }
  };

  const onFocus = async () => {
    console.log('newMessage onFocus');
    if (attributes.sub == userItemCurrent) {
      const newMessage = {
        id: chatroom?.id,
        lastTypingAt: 1,
      };
      const newMessageData = await API.graphql(
        graphqlOperation(updateChatRoom, {input: newMessage}),
      );
    }
  };
  const onBlur = async () => {
    if (attributes.sub == userItemCurrent) {
      const newMessage = {
        id: chatroom?.id,
        lastTypingAt: 2,
      };
      const newMessageData = await API.graphql(
        graphqlOperation(updateChatRoom, {input: newMessage}),
      );
    }
  };
  console.log(
    'attributes.sub != userItemCurrent',
    attributes.sub != userItemCurrent,
  );
  return (
    <>
      {files.length > 0 ? (
        <View style={styles.attachmentsContainer}>
          <FlatList
            data={files}
            horizontal
            renderItem={({item}) => (
              <>
                <Image
                  source={{uri: item.uri}}
                  style={styles.selectedImage}
                  resizeMode="contain"
                />

                {progresses[item.uri] && (
                  <View
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      backgroundColor: '#8c8c8cAA',
                      padding: 5,
                      borderRadius: 50,
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      {(progresses[item.uri] * 100).toFixed(0)} %
                    </Text>
                  </View>
                )}

                {/* <MaterialIcons
                  name="highlight-remove"
                  onPress={() =>
                    setFiles((existingFiles) =>
                      existingFiles.filter((file) => file !== item)
                    )
                  }
                  size={20}
                  color="gray"
                  style={styles.removeSelectedImage}
                /> */}
              </>
            )}
          />
        </View>
      ) : null}

      <View
        style={{
          backgroundColor: 'whitesmoke',
          paddingHorizontal: 10,
          paddingBottom: isTyping && attributes.sub != userItemCurrent ? 0 : 10,
        }}>
        <View style={styles.container}>
          <TextInput
            value={text}
            onChangeText={setText}
            style={styles.input}
            placeholder="Type your message..."
            onFocus={onFocus}
            onBlur={onBlur}
            onSubmitEditing={Keyboard.dismiss}
          />
          {/* Icon */}
          <MaterialIcons
            onPress={onSend}
            style={styles.send}
            name="send"
            size={14}
            color="white"
          />
        </View>
        {isTyping && attributes.sub != userItemCurrent ? (
          <Text
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              color: '#9090e4',
            }}>
            Typing Message....
          </Text>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 7,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    borderColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: 'royalblue',
    padding: 7,
    borderRadius: 15,
    overflow: 'hidden',
  },

  attachmentsContainer: {
    alignItems: 'flex-end',
  },
  selectedImage: {
    height: 100,
    width: 200,
    margin: 5,
  },
  removeSelectedImage: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default InputBox;

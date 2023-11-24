import {
  FlatList,
  Text,
  View,
  Pressable,
  SafeAreaView,
  Image,
} from 'react-native';
import ChatListItem from '../../components/ChatListItem';
import {API, graphqlOperation, Auth} from 'aws-amplify';
// import {listChatRooms} from '../../graphql/queries';
import {listChatRooms} from './queries';
// import {listChatRooms} from "../../services/chatRoomService"
import {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {listUsers} from '../../graphql/queries';
import {getCommonChatRoomWithUser} from '../../services/chatRoomService';
import {CHATS_SCREEN, MESSAGES_TAB_ROUTE} from '../../utils/route';
import {
  createChatRoom,
  createUserChatRoom,
  updateUser,
} from '../../graphql/mutations';
import ScreenLoading from '../../components/ScreenLoading';
import {useIsFocused} from '@react-navigation/native';
import {
  onCreateMessage,
  onUpdateUserChatRoom,
} from '../../graphql/subscriptions';
import {useSelector} from 'react-redux';

const ChatsScreen = ({navigation}) => {
  const [chatRooms, setChatRooms] = useState([]);
  const {attributes} = useSelector(state => state.home);
  const [loading, setLoading] = useState(false);
  const [roomChatLoading, setRoomChatLoading] = useState(false);
  const [isOpen, setOpenDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [newChats, setNewChats] = useState({});
  const [selectedUser, selectUserToChat] = useState({});
  const isFocus = useIsFocused();

  const fetchChatRooms = async (isLoading = true) => {
    isLoading && setLoading(true);
    const authUser = await Auth.currentAuthenticatedUser();
    const response = await API.graphql(
      graphqlOperation(listChatRooms, {id: authUser?.attributes?.sub}),
    );
    const sortedRooms =
      response?.data?.getUser?.ChatRooms?.items.sort(
        (r1, r2) =>
          new Date(r2?.chatRoom?.updatedAt) - new Date(r1?.chatRoom?.updatedAt),
      ) || [];
    // const sortedRooms = response?.data?.getUser?.ChatRooms?.items.sort(
    //   (r1, r2) =>
    //     new Date(r2.chatRoom.updatedAt) - new Date(r1.chatRoom.updatedAt),
    // );
    setChatRooms([...sortedRooms]);
    isLoading && setLoading(false);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    (async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      API.graphql(graphqlOperation(listUsers)).then(result => {
        let arr =
          result.data?.listUsers?.items &&
          result.data?.listUsers?.items.map(val => {
            return {
              ...val,
              value: val?.name,
              label: val?.name,
            };
          });
        arr = arr.filter(val => authUser.attributes.sub != val.id);
        setUsers(arr);
      });
    })();
  }, []);

  const onPress = async user => {
    selectUserToChat(user);
    setOpenDropdown(!isOpen);
    const existingChatRoom = await getCommonChatRoomWithUser(user.id);
    if (existingChatRoom) {
      navigation.navigate(MESSAGES_TAB_ROUTE, {
        screen: CHATS_SCREEN,
        params: {
          id: existingChatRoom.chatRoom.id,
          name: user?.name,
        },
      });
      return;
    }
    // Create a new Chatroom
    try {
      setRoomChatLoading(true);
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, {input: {}}),
      );
      if (!newChatRoomData.data?.createChatRoom) {
        console.log('Error creating the chat error');
      }

      const newChatRoom = newChatRoomData.data?.createChatRoom;
      // // Add the clicked user to the ChatRoom

      let resp1 = await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: {chatRoomId: newChatRoom.id, userId: user.id},
        }),
      );

      // Add the auth user to the ChatRoom
      const authUser = await Auth.currentAuthenticatedUser();
      await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: {chatRoomId: newChatRoom.id, userId: authUser.attributes.sub},
        }),
      );
      navigation.navigate(MESSAGES_TAB_ROUTE, {
        screen: CHATS_SCREEN,
        params: {id: newChatRoom.id, name: user?.name},
      });
      setRoomChatLoading(false);
    } catch (err) {
      setRoomChatLoading(false);
    }
  };

  const updateMessage = id => {
    setNewChats({...newChats, [id]: []});
  };

  useEffect(() => {
    let subscriptionArr = [];
    for (let room of chatRooms) {
      const subscription = API.graphql(
        graphqlOperation(onCreateMessage, {
          filter: {chatroomID: {eq: room?.chatRoom?.id},userID:{ne:attributes.sub}},
        }),
      ).subscribe({
        next: ({value}) => {
          // console.log('chatRoom======', value);
          if (value.data.onCreateMessage.userID != attributes.sub) {
            let data =
              (newChats &&
                Object.keys(newChats).length &&
                newChats[room?.chatRoom?.id]) ||
              [];
            data.push(value?.data?.onCreateMessage?.text);
            setNewChats({...newChats, [room?.chatRoom?.id]: data});
            fetchChatRooms(false);
          }
        },
        error: err => console.warn(err),
      });
      subscriptionArr.push(subscription);
    }
    if (chatRooms && chatRooms[0]?.chatRoom?.id) {
      return () => {
        for (let room of subscriptionArr) {
          room.unsubscribe();
        }
        // subscriptionAttachments.unsubscribe();
      };
    }
  }, [chatRooms, newChats]);

  useEffect(() => {
    (async () => {
      const newMessage1 = {
        id: attributes.sub,
        lastOnlineAt: new Date().valueOf(),
        status: 'online',
      };
      const newMessageData1 = await API.graphql(
        graphqlOperation(updateUser, {input: newMessage1}),
      );
      console.log('newMessage', newMessageData1);
    })();

    return async () => {
      const newMessage1 = {
        id: attributes.sub,
        lastOnlineAt: new Date().valueOf(),
        status: 'offline',
      };
      const newMessageData1 = await API.graphql(
        graphqlOperation(updateUser, {input: newMessage1}),
      );
    };
  }, []);
  // console.log("chatRooms",JSON.stringify(chatRooms))

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      {roomChatLoading ? <ScreenLoading /> : null}
      <View style={{marginHorizontal: 10, marginTop: 10, zIndex: 2000}}>
        <DropDownPicker
          listMode="SCROLLVIEW"
          autoScroll={true}
          // zIndex={3000}
          open={isOpen}
          onPress={() => {
            setOpenDropdown(!isOpen);
          }}
          value={selectedUser?.name}
          renderListItem={({item}) => {
            let selected = selectedUser?.name === item.name;
            return (
              <Pressable
                onPress={() => onPress(item)}
                style={{
                  paddingVertical: 8,
                  paddingLeft: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgray',
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: selected ? 'green' : 'white',
                }}>
                {item?.image ? (
                  <Image
                    source={{uri: item?.image}}
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 15,
                      marginRight: 5,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 15,
                      marginRight: 5,
                      borderWidth: 1,
                      borderColor: 'lightgray',
                    }}
                  />
                )}
                <Text
                  style={{paddingLeft: 7, color: selected ? 'white' : 'black'}}>
                  {item?.name}
                </Text>
              </Pressable>
            );
          }}
          items={users}
          // setItems={setGenderItems}
          placeholder={'select'}
          containerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
          }}
          style={{flex: 1}}
          dropDownContainerStyle={{
            alignSelf: 'center',
          }}
        />
      </View>
      {chatRooms?.length ? (
        <FlatList
          data={chatRooms}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => {
            let userItem =
              item.chatRoom?.users &&
              item.chatRoom?.users?.items?.find(
                item => item?.user?.id !== attributes.sub,
              );
              let userItemCurrent =
              item.chatRoom?.users &&
              item.chatRoom?.users?.items?.find(
                item => item?.user?.id == attributes.sub,
              );
            return (
              <ChatListItem
                newChats={
                  (newChats &&
                    Object.keys(newChats).length &&
                    newChats[item?.chatRoom?.id]) ||
                  []
                }
                updateMessage={updateMessage}
                key={index}
                roomId={item.chatRoom.id}
                userItemCurrent={userItemCurrent.user.id}
                chat={item.chatRoom}
                user={userItem.user}
              />
            );
          }}
          style={{backgroundColor: 'white', marginTop: 50}}
          refreshing={loading}
          onRefresh={fetchChatRooms}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default ChatsScreen;

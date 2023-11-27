import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../customs/Colors';
import {TouchableOpacity, Text, Platform} from 'react-native';
import {
  CHATS_ROOM_SCREEN_TWILLIO,
  CHATS_SCREEN,
  CHATS_SCREENS,
  CHATS_SCREEN_TWILLIO,
  CREATE_CHAT_SCREEN_TWILLIO,
  MESSAGES,
  MESSAGES_TAB_ROUTE,
} from '../../utils/route';
import ChatList from './ChatList';
import Messages from '../../screens/ChatScreen/ChatScreen';
import ChatsScreen from '../../screens/ChatsScreen/ChatsScreen';
import ContactsScreen from '../../screens/ContactScreen';
import {ChatListScreen} from '../../screens/Twillio/chat-list-screen';
import { ChatRoomScreen } from '../../screens/Twillio/chat-room-screen';
import { ChatCreateScreen } from '../../screens/Twillio/chat-create-screen';

// import Messages from './Messages';
const {createNativeStackNavigator} = require('@react-navigation/native-stack');
const Stack = createNativeStackNavigator();

const MessagesStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={CHATS_SCREEN_TWILLIO}>
      {/* <Stack.Screen
        name={CHATS_SCREENS}
        // component={ChatList}
        component={ChatsScreen}
        // options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name={CHATS_SCREEN_TWILLIO}
        component={ChatListScreen}
        options={({navigation}) => ({
          title: 'Chat List',
          // headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name={CHATS_ROOM_SCREEN_TWILLIO}
        component={ChatRoomScreen}
        options={({navigation}) => ({
          title: '',
          headerShadowVisible: false,
        })}
      />
        <Stack.Screen
        name={CREATE_CHAT_SCREEN_TWILLIO}
        component={ChatCreateScreen}
        options={({navigation}) => ({
          title: '',
          headerShadowVisible: false,
        })}
      />

      <Stack.Screen
        name={CHATS_SCREEN}
        component={Messages}
        options={({navigation}) => ({
          title: '',
          headerShadowVisible: false,
        })}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default MessagesStackNavigator;

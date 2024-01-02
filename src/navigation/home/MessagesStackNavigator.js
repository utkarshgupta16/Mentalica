import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../customs/Colors';
import {TouchableOpacity, Text, Platform} from 'react-native';
import {CHATS_SCREEN, CHAT_ROOM_SCREEN, MESSAGES} from '../../utils/route';
import ChatListScreen from '../../screens/Twillio/chat-list/chat-list-screen';
import ChatRoomScreen from '../../screens/Twillio/chat-room/chat-room-screen';
import VideoPlayer from '../../components/VideoPlayer';
import DocViewer from '../../components/DocViewer';
import Messages from './Messages';
const {createNativeStackNavigator} = require('@react-navigation/native-stack');
const Stack = createNativeStackNavigator();

const MessagesStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={MESSAGES}>
      <Stack.Screen
        name={MESSAGES}
        component={ChatListScreen}
        options={{title: 'Chat Conversation'}}
      />

      <Stack.Screen
        name={CHAT_ROOM_SCREEN}
        component={ChatRoomScreen}
        options={{title: ''}}
      />

      <Stack.Screen
        name={CHATS_SCREEN}
        component={Messages}
        options={({navigation}) => ({
          title: '',
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name={'VideoPlayer'}
        component={VideoPlayer}
        options={({navigation}) => ({
          title: '',
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name={'DocViewer'}
        component={DocViewer}
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

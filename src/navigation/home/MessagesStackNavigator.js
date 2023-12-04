import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../customs/Colors';
import {TouchableOpacity, Text, Platform} from 'react-native';
import {CHATS_SCREEN, CHAT_ROOM_SCREEN, MESSAGES} from '../../utils/route';
import ChatListScreen from '../../screens/Twillio/chat-list/chat-list-screen';
import {ChatRoomScreen} from '../../screens/Twillio/chat-room/chat-room-screen';
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
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row'}}>
              <MaterialIcons
                name="arrow-back-ios"
                size={16}
                color={Colors.grey}
              />
              <Text>Messages</Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        })}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default MessagesStackNavigator;

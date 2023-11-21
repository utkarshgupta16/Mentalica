import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../customs/Colors';
import {TouchableOpacity, Text, Platform} from 'react-native';
import {
  CHATS_SCREEN,
  CHATS_SCREENS,
  MESSAGES,
  MESSAGES_TAB_ROUTE,
} from '../../utils/route';
import ChatList from './ChatList';
import Messages from '../../screens/ChatScreen/ChatScreen';
import ChatsScreen from '../../screens/ChatsScreen/ChatsScreen';
import ContactsScreen from '../../screens/ContactScreen';

// import Messages from './Messages';
const {createNativeStackNavigator} = require('@react-navigation/native-stack');
const Stack = createNativeStackNavigator();

const MessagesStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={CHATS_SCREENS}>
      <Stack.Screen
        name={CHATS_SCREENS}
        // component={ChatList}
        component={ChatsScreen}
        // options={{headerShown: false}}
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

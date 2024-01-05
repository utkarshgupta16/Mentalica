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
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {EN} from '../../utils/Strings';
const {createNativeStackNavigator} = require('@react-navigation/native-stack');
const Stack = createNativeStackNavigator();

const MessagesStackNavigator = ({navigation, route}) => {
  const {darkMode, currentLanguage} = useSelector(state => state.home);

  return (
    <Stack.Navigator initialRouteName={MESSAGES}>
      <Stack.Screen
        name={MESSAGES}
        component={ChatListScreen}
        options={({navigation}) => ({
          title: 'Conversation List',
          headerLeft: null,
          headerShadowVisible: true,
        })}
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
              {currentLanguage == EN ? (
                <MaterialIcons
                  name="arrow-back-ios"
                  size={16}
                  color={darkMode ? Colors.white : Colors.grey}
                />
              ) : (
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={16}
                  color={darkMode ? Colors.white : Colors.grey}
                />
              )}
              <Text style={{color: darkMode ? Colors.white : Colors.grey}}>
                Messages
              </Text>
            </TouchableOpacity>
          ),
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

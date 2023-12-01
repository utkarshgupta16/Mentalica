import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../customs/Colors';
import {TouchableOpacity, Text, Platform} from 'react-native';
import {CHATS_SCREEN, MESSAGES} from '../../utils/route';
import ChatList from './ChatList';
import Messages from './Messages';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
const {createNativeStackNavigator} = require('@react-navigation/native-stack');
const Stack = createNativeStackNavigator();

const MessagesStackNavigator = ({navigation, route}) => {
  const {darkMode} = useSelector(state => state.home);

  return (
    <Stack.Navigator initialRouteName={MESSAGES}>
      <Stack.Screen
        name={MESSAGES}
        component={ChatList}
        options={({navigation}) => ({
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row'}}>
              <MaterialIcons
                name="arrow-back-ios"
                size={16}
                color={darkMode ? Colors.white : Colors.grey}
              />
              {/* <Text>Messages</Text> */}
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        })}
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
                color={darkMode ? Colors.white : Colors.grey}
              />
              <Text style={{color: darkMode ? Colors.white : Colors.grey}}>
                Messages
              </Text>
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

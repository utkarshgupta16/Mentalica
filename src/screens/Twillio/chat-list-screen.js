import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
// import { showMessage } from 'react-native-flash-message';

import {colors} from './colors';
import {TwilioService} from './twilio-service';
import {getToken} from './getToken';
// import { useApp } from '../../app-context';

import {ChatListLoader} from './components/chat-list-loader';
import {ChatListEmpty} from './components/chat-list-empty';
import {ChatListItem} from './components/chat-list-item';
import {useDispatch, useSelector} from 'react-redux';
import {getTwilloChatTokenSlice, updateChannels} from '../../redux/HomeSlice';
import {CREATE_CHAT_SCREEN_TWILLIO} from '../../utils/route';
import { Client } from 'twilio-chat';

export function ChatListScreen({navigation, route}) {
  const {channels = [], profileData} = useSelector(state => state.home);
  const {userToken: {jwtToken} = {}} = useSelector(state => state.auth);

  const username = profileData.email_id;
  const [loading, setLoading] = useState(true);
  const [message, showMessage] = useState({});
  const channelPaginator = useRef();
  const dispatch = useDispatch();
  const setChannelEvents = useCallback(
    client => {
      client.on('messageAdded', message => {
        dispatch(
          updateChannels(prevChannels =>
            prevChannels.map(channel =>
              channel.id === message.channel.sid
                ? {...channel, lastMessageTime: message.dateCreated}
                : channel,
            ),
          ),
        );
      });
      return client;
    },
    [updateChannels],
  );

  const getSubscribedChannels = useCallback(
    client =>
      client.getSubscribedChannels().then(paginator => {
        channelPaginator.current = paginator;
        const newChannels = TwilioService.getInstance().parseChannels(
          channelPaginator.current.items,
        );
        dispatch(updateChannels(newChannels));
      }),
    [updateChannels],
  );
  useEffect(() => {
    getToken(username,jwtToken)
      .then(token =>{
        Client.create(token).then((client) => {
          console.log("TwilioService",client)
          // TwilioService.chatClient = client;
          // return TwilioService.chatClient;
        });
      })
      // .then(() => TwilioService.getInstance().addTokenListener(getToken,jwtToken,username))
      // .then(setChannelEvents)
      // .then(getSubscribedChannels)
      // .catch(err => {
      //   console.log("showMessage",err)
      //   showMessage({message: err.message, type: 'danger'})
      // })
      // .finally(() => setLoading(false));

    return () => TwilioService.getInstance().clientShutdown();
  }, [username, setChannelEvents, getSubscribedChannels]);

  const sortedChannels = useMemo(
    () =>
      channels.sort(
        (channelA, channelB) =>
          channelB.lastMessageTime - channelA.lastMessageTime,
      ),
    [channels],
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate(CREATE_CHAT_SCREEN_TWILLIO)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      {message ? <Text>{message?.message}</Text> : null}
      {loading ? (
        <ChatListLoader />
      ) : (
        <FlatList
          data={sortedChannels}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ChatListItem
              channel={item}
              onPress={() => {
                // navigation.navigate(routes.ChatRoom.name, {
                //   channelId: item.id,
                //   identity: username,
                // });
              }}
            />
          )}
          ListEmptyComponent={<ChatListEmpty />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.snow,
  },
  addButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
    color: 'red',
  },
});

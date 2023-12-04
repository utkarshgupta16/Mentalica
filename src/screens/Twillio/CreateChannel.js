import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Client} from '@twilio/conversations';
import {colors} from './colors';
import {TwilioService} from './ConversationService';
import {getTwilloChatTokenSlice, updateChannels} from '../../redux/HomeSlice';
import {useDispatch, useSelector} from 'react-redux';
export function ChatCreateScreen() {
  const dispatch = useDispatch();
  const {email: username} = useSelector(state => state.auth);
  const [channelName, setChannelName] = useState('');
  const [loading, setLoading] = useState(false);
  const {channels = []} = useSelector(state => state.home);
  const [message, showMessage] = useState({message: ''});
  const onAddChannel = channel => {
    const newChannel = TwilioService.getInstance().parseChannel(channel);
    // dispatch(updateChannels(channels.concat(newChannel)));
  };

  const getTokenNew = async username => {
    let {payload} = await dispatch(getTwilloChatTokenSlice(username));
    // console.log('getTokenNew', payload);
    return payload?.accessToken;
  };
  const onCreateOrJoin = async () => {
    // setLoading(true);
    // let token = await getTokenNew(username);
    // const client = new Client(token);
    // console.log('onCreateOrJoin==============', token);

    // client.on('initialized', () => {
    //   client
    //     .getConversationBySid('CHb14a0247529647d595920b6716556e11')
    //     .then(channel => {
    //       console.log('getConversationByUniqueName==============', channel);
    //     })
    //     .catch(errr => {
    //       console.log('getConversationByUniqueName==============', errr);
    //     });
    // });
    // console.log(
    //   'initialized success==============',
    //   TwilioService.chatClient?.updateToken,
    // );
    TwilioService.getInstance()
      .getChatClient(TwilioService.chatClient?.updateToken)
      .then(client => {
        // client.getParticipants(result => {
        //   console.log('initialized errror==============', result);
        // });
      });

    //   .then(onAddChannel)
    //   .catch(() =>

    // client.on('initFailed', ({error}) => {
    //   console.log('initialized errror==============', error);
    // });
    // client
    //   .createConversation({
    //     uniqueName: channelName,
    //     friendlyName: channelName,
    //   })
    //   .then(channel => {
    //     onAddChannel(channel);
    //     channel.join();
    //   });
    //   //   )
    //   .then(() => showMessage({message: 'You have joined.'}))
    //   .catch(err => showMessage({message: err.message, type: 'danger'}))
    //   .finally(() => setLoading(false));
  };

  return (
    <View style={styles.screen}>
      {message ? <Text>{message?.message}</Text> : null}
      <TextInput
        value={channelName}
        onChangeText={setChannelName}
        style={styles.input}
        placeholder="Channel Name"
        placeholderTextColor={colors.ghost}
      />
      <TouchableOpacity style={styles.button} onPress={onCreateOrJoin}>
        <Text style={styles.buttonText}>Create Or Join</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whisper,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  input: {
    width: 280,
    height: 50,
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.eclipse,
    marginTop: 32,
    marginBottom: 16,
  },
  button: {
    width: 280,
    height: 50,
    backgroundColor: colors.malibu,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: colors.white,
  },
});

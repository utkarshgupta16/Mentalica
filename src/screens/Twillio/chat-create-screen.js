import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colors} from './colors';
// import { showMessage } from 'react-native-flash-message';
import {TwilioService} from './twilio-service';
// import { LoadingOverlay } from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {updateChannels} from '../../redux/HomeSlice';

export function ChatCreateScreen() {
  const [channelName, setChannelName] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {channels = []} = useSelector(state => state.home);
  const [message, showMessage] = useState({});
  const onAddChannel = channel => {
    // const newChannel = TwilioService.getInstance().parseChannel(channel);
    // dispatch(updateChannels(channels.concat(newChannel)));
  };

  const onCreateOrJoin = () => {
    setLoading(true);
    TwilioService.getInstance()
      .getChatClient()
      .then(client => {
        console.log("getChannelByUniqueName",client)
        return client
          .getChannelByUniqueName(channelName)
          .then(channel =>
            channel.channelState.status !== 'joined' ? channel.join() : channel,
          )
          .then(onAddChannel)
          .catch(() =>
            client
              .createChannel({
                uniqueName: channelName,
                friendlyName: channelName,
              })
              .then(channel => {
                onAddChannel(channel);
                channel.join();
              }),
          );
      })
      .then(() => showMessage({message: 'You have joined.'}))
      .catch(err => showMessage({message: err.message, type: 'danger'}))
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.screen}>
      {/* <Image style={styles.logo} source={images.message} /> */}
      <Text>{message.message}</Text>
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
      {/* {loading && <LoadingOverlay />} */}
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

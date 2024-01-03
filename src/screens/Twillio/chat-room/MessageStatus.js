/* eslint-disable react/react-in-jsx-scope */
import {useEffect, useState} from 'react';
import {getMessageStatus} from '../../../utils/utils';
import {MessageStatus as MessageStatusType} from '../../../utils/conatant';
import {StyleSheet, Text, View} from 'react-native';

const MessageStatus = props => {
  const [status, setStatus] = useState({});

  useEffect(() => {
    getMessageStatus(
      props?.message,
      props?.channelParticipants,
      props?.identity,
    ).then(receipt => {
      setStatus(receipt);
    });
  }, [props.channelParticipants, props.message, props?.identity]);

  return (
    <>
      {props.message?.user?._id === props?.identity ? (
        <View style={styles.tickView}>
          {!!status[MessageStatusType.Sent] && (
            <Text style={[styles.sent]}>✓✓</Text>
          )}
          {!!status[MessageStatusType.Received] && (
            <Text style={[styles.tick]}>✓✓</Text>
          )}
          {!!status[MessageStatusType.Pending] && (
            <Text style={[styles.tick]}>✓</Text>
          )}
        </View>
      ) : null}
    </>
  );
};

export {MessageStatus};

const styles = StyleSheet.create({
  tick: {
    fontSize: 10,
    backgroundColor: 'transparent',
    color: '#33A3DC',
  },
  sent: {
    fontSize: 10,
    backgroundColor: 'transparent',
    color: 'gray',
  },
  tickView: {
    flexDirection: 'row',
    marginRight: 10,
  },
});

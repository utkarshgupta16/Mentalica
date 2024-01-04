import React from 'react';
import {Bubble} from 'react-native-gifted-chat';
import {StyleSheet} from 'react-native';
import Colors from '../../../customs/Colors';
import {MessageStatus} from './MessageStatus';
const RenderMessageVideo = ({bubbleProps, channelParticipants, identity}) => {
  return (
    <Bubble
      {...bubbleProps}
      tickStyle={{color: Colors.blueDarkColor}}
      renderTicks={currentMessage => {
        return (
          <MessageStatus
            message={currentMessage}
            channelParticipants={channelParticipants}
            identity={identity}
          />
        );
      }}
      textStyle={styles.textStyle}
      wrapperStyle={styles.wrapperStyle}
    />
  );
};

export default RenderMessageVideo;

const styles = StyleSheet.create({
  textStyle: {
    left: {color: Colors.dune, fontSize: 17, fontWeight: '400'},
    right: {color: Colors.dune, fontSize: 17, fontWeight: '400'},
  },
  wrapperStyle: {
    left: {
      backgroundColor: 'white',
    },
    right: {
      backgroundColor: Colors.whatsappColor,
    },
  },
});

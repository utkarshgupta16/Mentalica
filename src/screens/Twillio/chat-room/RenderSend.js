import React, {memo} from 'react';
import {Send} from 'react-native-gifted-chat';
import {TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './RenderChatMessageStyle';
const RenderMessageVideo = ({sendProps, textInputRef, medias, onSend}) => {
  const {user = {}, text = ''} = sendProps || {};
  return (
    <Send {...sendProps}>
      <TouchableOpacity
        onPress={() => {
          let obj = {user, _id: Date.now()};
          if (text) {
            obj = {
              ...obj,
              text: text,
            };
          }
          onSend([obj], medias);
          textInputRef?.current?.clear();
        }}>
        <MaterialIcons
          name="send"
          size={30}
          color={'#33A3DC'}
          style={styles.renderSendImage}
        />
      </TouchableOpacity>
    </Send>
  );
};

export default memo(RenderMessageVideo);

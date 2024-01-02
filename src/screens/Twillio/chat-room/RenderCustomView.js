import React, { memo } from 'react';
import {Pressable, Platform, Linking, Image, Alert, Text} from 'react-native';
import styles from './RenderChatMessageStyle';
import {openFile, removeMessage} from '../../../utils/utils';
import {Message} from '@twilio/conversations';
const fileExtImage = {
  pdf: 'https://png.pngtree.com/png-clipart/20220612/original/pngtree-pdf-file-icon-png-png-image_7965915.png',
};
const RenderCustomView = ({navigation, currentMessage, selectedMessages}) => {
  const {document, fileType, filename = '', _id} = currentMessage || {};
  if (fileType === 'document') {
    const url_filename = filename ? filename : document;
    const extension = url_filename && url_filename.split('.').pop();
    const isSelected = selectedMessages.some(el => el._id === _id);
    return (
      <Pressable
        onPress={() => {
          if (document?.includes('twilio')) {
            if (Platform.OS === 'android') {
              Linking.openURL(document);
            } else {
              navigation.navigate('DocViewer', {
                documents: document,
              });
            }
          } else {
            openFile(document);
          }
        }}
        style={{...styles.customViewPressStyle, opacity: isSelected ? 0.5 : 1}}>
        {fileExtImage[extension] ? (
          <Image
            source={{uri: fileExtImage[extension]}}
            style={styles.customImageStyle}
          />
        ) : null}
      </Pressable>
    );
  }
  return null;
};

export default memo(RenderCustomView);

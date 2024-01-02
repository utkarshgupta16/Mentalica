import React, {memo} from 'react';
import {
  Pressable,
  Platform,
  Linking,
  Image,
  Alert,
  Text,
  View,
} from 'react-native';
import styles from './RenderChatMessageStyle';
import {openFile} from '../../../utils/utils';
import {Message} from '@twilio/conversations';
import MessageMedia from './MessageMedia';
const fileExtImage = {
  pdf: 'https://png.pngtree.com/png-clipart/20220612/original/pngtree-pdf-file-icon-png-png-image_7965915.png',
};
const RenderCustomView = ({
  navigation,
  currentMessage,
  selectedMessages,
  onDownloadAttachments,
  conversationAttachments,
}) => {
  const {
    document,
    fileType,
    filename = '',
    _id,
    text,
    attachedMedia = [],
  } = currentMessage || {};
  if (fileType === 'document') {
    const url_filename = filename ? filename : document;
    const extension = url_filename && url_filename.split('.').pop();
    // const isSelected = selectedMessages.some(el => el._id === _id);
    const messageFiles = [];
    attachedMedia.forEach(file => {
      messageFiles.push(file);
    });
    return (
      <View>
        <Text>{text}</Text>
        <MessageMedia
          navigation={navigation}
          extension={extension}
          key={_id}
          attachments={
            conversationAttachments && conversationAttachments?.[_id]
          }
          onDownload={async () => await onDownloadAttachments(currentMessage)}
          files={messageFiles}
          sending={currentMessage?.index === -1}
          onOpen={(mediaSid, image, file) => {
            if (conversationAttachments?.[_id][mediaSid]?.includes('twilio')) {
              if (Platform.OS === 'android') {
                Linking.openURL(conversationAttachments?.[_id][mediaSid]);
              } else {
                navigation.navigate('DocViewer', {
                  documents: conversationAttachments?.[_id][mediaSid],
                });
              }
            } else {
              openFile(document);
            }
          }}
        />
      </View>
    );
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
        style={styles.customViewPressStyle}>
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

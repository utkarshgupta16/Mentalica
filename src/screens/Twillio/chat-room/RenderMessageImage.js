import React, {memo} from 'react';
import {MessageImage} from 'react-native-gifted-chat';
import MessageMedia from './MessageMedia';
import {View, Text} from 'react-native';
const RenderMessageImage = ({
  props,
  selectedMessages = [],
  conversationAttachments,
  onDownloadAttachments,
}) => {
  const {lightboxProps, ...restProps} = props;
  const {_id, attachedMedia = []} = props.currentMessage || {};
  const messageImages = [];
  const messageFiles = [];
  attachedMedia.forEach(file => {
    const {contentType} = file;
    if (contentType?.includes('image')) {
      messageImages.push(file);
      return;
    }
    messageFiles.push(file);
  });
  const isSelected = selectedMessages.some(el => el._id === _id);

  return (
    <View>
      <MessageMedia
        key={_id}
        attachments={conversationAttachments && conversationAttachments?.[_id]}
        onDownload={async () =>
          await onDownloadAttachments(props.currentMessage)
        }
        images={messageImages}
        files={messageFiles}
        sending={props.currentMessage.index === -1}
        onOpen={(mediaSid, image, file) => {
          //   if (file) {
          //     onFileOpen(conversationAttachments?.[_id][mediaSid], file);
          //     return;
          //   }
          if (image) {
            // navigation.navigate('PreviewImage', {
            //   channelId,
            //   images: messageImages.map(val => val.sid),
            //   _id: props.currentMessage._id,
            // });
            // setImagePreview({
            //   message: props.currentMessage,
            //   file: conversationAttachments?.[_id][mediaSid],
            //   sid: mediaSid,
            // });
          }
        }}
      />
    </View>
  );
  return (
    <MessageImage
      {...restProps}
      lightboxProps={{
        ...lightboxProps,
        style: {opacity: isSelected ? 0.6 : 1},
      }}
    />
  );
};

export default memo(RenderMessageImage);
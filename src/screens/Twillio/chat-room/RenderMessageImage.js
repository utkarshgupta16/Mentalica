import React, {memo} from 'react';
import {MessageImage} from 'react-native-gifted-chat';
import MessageMedia from './MessageMedia';
import {View, Text} from 'react-native';
const RenderMessageImage = ({
  props,
  selectedMessages = [],
  // conversationAttachments,
  // onDownloadAttachments,
  channelId,
}) => {
  const {lightboxProps, ...restProps} = props;
  const {_id, attachedMedia = []} = props.currentMessage || {};
  const messageImages = [];
  attachedMedia.forEach(file => {
    const {contentType} = file;
    if (contentType?.includes('image')) {
      messageImages.push(file);
      return;
    }
  });
  const isSelected = selectedMessages.some(el => el._id === _id);

  return (
    <View>
      <MessageMedia
        key={_id}
        message={props.currentMessage}
        channelId={channelId}
        // attachments={conversationAttachments && conversationAttachments?.[_id]}
        // onDownload={async () =>
        //   await onDownloadAttachments(props.currentMessage)
        // }
        images={messageImages}
        sending={props.currentMessage.index === -1}
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

import React, {memo} from 'react';
import {MessageImage} from 'react-native-gifted-chat';

const RenderMessageImage = ({props, selectedMessages = []}) => {
  const {lightboxProps, ...restProps} = props;
  const {_id} = props.currentMessage || {};

  const isSelected = selectedMessages.some(el => el._id === _id);
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

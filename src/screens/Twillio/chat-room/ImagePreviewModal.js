import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Lightbox from 'react-native-lightbox-v2';
const styles = StyleSheet.create({
  container: {},
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    // margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
});
export function MessageImage({
  containerStyle,
  lightboxProps = {},
  imageProps = {},
  imageStyle,
  currentMessage,
}) {
  if (currentMessage == null) {
    return null;
  }
  return (
    <View style={[styles.container, containerStyle]}>
      <Lightbox
        activeProps={{
          style: styles.imageActive,
        }}
        {...lightboxProps}>
        <Image
          {...imageProps}
          style={[styles.image, imageStyle]}
          source={{uri: currentMessage.image}}
        />
      </Lightbox>
    </View>
  );
}

export default MessageImage;

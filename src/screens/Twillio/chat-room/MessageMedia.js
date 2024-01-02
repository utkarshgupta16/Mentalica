import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import MessageImage from './ImagePreviewModal';
const fileExtImage = {
  pdf: 'https://png.pngtree.com/png-clipart/20220612/original/pngtree-pdf-file-icon-png-png-image_7965915.png',
};
const MessageMedia = ({
  onDownload,
  onOpen,
  images = [],
  files = [],
  sending,
  attachments,
  extension,
}) => {
  const [isMediaLoaded, setMediaLoaded] = useState(false);
  useEffect(() => {
    onDownload().then(() => {
      setMediaLoaded(true);
    });
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    return () => {
      abortController.abort();
    };
  }, []);
  return (
    <>
      <View>
        {images.length
          ? images.map(img => {
              return (
                <Pressable
                  onPress={() => {
                    isMediaLoaded &&
                      onOpen(img.sid, attachments[img?.sid], null);
                  }}
                  key={img?.sid}
                  style={styles.image}>
                  {sending || !isMediaLoaded ? (
                    <View style={styles.loadingStyle}>
                      <ActivityIndicator size={'large'} color="#8e44ad" />
                    </View>
                  ) : null}
                  {/* //   URL.createObjectURL(attachments[img.sid]), */}
                  {isMediaLoaded && attachments && attachments[img?.sid] ? (
                    <MessageImage
                      currentMessage={{
                        image: attachments[img?.sid],
                      }}
                      // key={img?.sid}
                    />
                  ) : null}
                </Pressable>
              );
            })
          : null}
      </View>

      {files.map(file => (
        <Pressable
          key={file.sid}
          onPress={() => {
            isMediaLoaded && onOpen(file.sid, undefined, file);
          }}>
          {fileExtImage[extension] ? (
            <Image
              source={{uri: fileExtImage[extension]}}
              style={styles.customImageStyle}
            />
          ) : null}
        </Pressable>
      ))}
    </>
  );
};

export default MessageMedia;

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 160,
    height: 105,
    borderRadius: 13,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
  customImageStyle: {width: 160, height: 150, objectFit: 'contain'},
  loadingStyle: {
    zIndex: 7,
    position: 'absolute',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

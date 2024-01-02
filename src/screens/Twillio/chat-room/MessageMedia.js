import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addAttachment} from '../../../redux/AttachmentSlice';
import {getSdkMediaObject} from '../../../redux/coversation-objects';
import {getBlobFile, openFile} from '../../../utils/utils';
import MessageImage from './ImagePreviewModal';
const fileExtImage = {
  pdf: 'https://png.pngtree.com/png-clipart/20220612/original/pngtree-pdf-file-icon-png-png-image_7965915.png',
};
const MessageMedia = ({
  // onDownload,
  // onOpen,
  images = [],
  files = [],
  sending,
  // attachments,
  extension,
  channelId,
  message,
  navigation,
}) => {
  const [isMediaLoaded, setMediaLoaded] = useState(false);
  const dispatch = useDispatch();
  const conversationAttachments =
    useSelector(state => state.attachments[channelId]) || {};
  const onDownloadAttachments = async () => {
    const attachedMedia = message?.isLocal
      ? message.attachedMedia
      : message.attachedMedia?.map(getSdkMediaObject);
    if (message.index === -1) {
      return undefined;
    }
    if (!attachedMedia?.length) {
      return new Error('No media attached ');
    }

    for (const media of attachedMedia) {
      let blob = '';
      if (!media?.isLocal) {
        blob = await getBlobFile(media);
      } else {
        blob = media?.url;
      }
      dispatch(
        addAttachment({
          channelSid: channelId,
          messageSid: message._id,
          mediaSid: media.sid,
          attachment: blob,
        }),
      );
    }
    return;
  };

  useEffect(() => {
    onDownloadAttachments().then(() => {
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
                <View key={img?.sid} style={styles.image}>
                  {sending || !isMediaLoaded ? (
                    <View style={styles.loadingStyle}>
                      <ActivityIndicator size={'large'} color="#8e44ad" />
                    </View>
                  ) : null}
                  {/* //   URL.createObjectURL(attachments[img.sid]), */}
                  {/* {isMediaLoaded && attachments && attachments[img?.sid] ? (
                    <MessageImage
                      currentMessage={{
                        image: conversationAttachments?.[message._id][img?.sid],
                      }}
                      // key={img?.sid}
                    />
                  ) : null} */}
                  {isMediaLoaded &&
                  conversationAttachments &&
                  conversationAttachments?.[message._id][img?.sid] ? (
                    <MessageImage
                      currentMessage={{
                        image: conversationAttachments?.[message._id][img?.sid],
                      }}
                      // key={img?.sid}
                    />
                  ) : null}
                </View>
              );
            })
          : null}
      </View>

      {files.map(file => (
        <Pressable
          key={file.sid}
          onPress={() => {
            // isMediaLoaded && onOpen(file.sid, undefined, file);
            if (
              conversationAttachments?.[message._id][file.sid]?.includes(
                'twilio',
              )
            ) {
              if (Platform.OS === 'android') {
                Linking.openURL(
                  conversationAttachments?.[message._id][file.sid],
                );
              } else {
                navigation.navigate('DocViewer', {
                  documents: conversationAttachments?.[message._id][file.sid],
                });
              }
            } else {
              openFile(document);
            }
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

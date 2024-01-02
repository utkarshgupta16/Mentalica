import {
  checkMultiple,
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';
import convertLang from './Strings';
import moment from 'moment';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {Message} from '@twilio/conversations';
export const iosPlatform = Platform.OS === 'ios';
export const androidPlatform = Platform.OS === 'android';
let docImage =
  'https://png.pngtree.com/png-clipart/20220612/original/pngtree-pdf-file-icon-png-png-image_7965915.png';
export const _checkPermissions = (callback, useTranslation) => {
  const {
    ERROR,
    HARDWARE_SUPPORT,
    ONE_GRANTED,
    PERMISSIONS_ACCESS,
    PERMISSIONS_GRANTED,
  } = convertLang(useTranslation);
  const iosPermissions = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
  const androidPermissions = [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
  ];
  checkMultiple(iosPlatform ? iosPermissions : androidPermissions).then(
    statuses => {
      const [CAMERA, AUDIO] = iosPlatform ? iosPermissions : androidPermissions;
      if (
        statuses[CAMERA] === RESULTS.UNAVAILABLE ||
        statuses[AUDIO] === RESULTS.UNAVAILABLE
      ) {
        Alert.alert(ERROR, HARDWARE_SUPPORT);
      } else if (
        statuses[CAMERA] === RESULTS.BLOCKED ||
        statuses[AUDIO] === RESULTS.BLOCKED
      ) {
        Alert.alert(ERROR, PERMISSIONS_ACCESS);
      } else {
        if (
          statuses[CAMERA] === RESULTS.DENIED &&
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          requestMultiple(
            iosPlatform ? iosPermissions : androidPermissions,
          ).then(newStatuses => {
            if (
              newStatuses[CAMERA] === RESULTS.GRANTED &&
              newStatuses[AUDIO] === RESULTS.GRANTED
            ) {
              callback && callback();
            } else {
              Alert.alert(ERROR, ONE_GRANTED);
            }
          });
        } else if (
          statuses[CAMERA] === RESULTS.DENIED ||
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          request(statuses[CAMERA] === RESULTS.DENIED ? CAMERA : AUDIO).then(
            result => {
              if (result === RESULTS.GRANTED) {
                callback && callback();
              } else {
                Alert.alert(ERROR, PERMISSIONS_GRANTED);
              }
            },
          );
        } else if (
          statuses[CAMERA] === RESULTS.GRANTED ||
          statuses[AUDIO] === RESULTS.GRANTED
        ) {
          callback && callback();
        }
      }
    },
  );
};

export const twilioStatus = {
  connecting: 'Connecting to Twilio…',
  connected: 'You are connected.',
  disconnecting: 'Disconnecting from Twilio…',
  disconnected: 'Disconnected',
  denied: 'Failed to connect.',
};

export const dateFormat = lastMessageTime => {
  let tomorrow = moment().add(1, 'day').endOf('day');
  let yesterday = moment().subtract(1, 'day').endOf('day');
  let date = moment(lastMessageTime);
  if (date.isSame(new Date(), 'day')) {
    return moment(date).fromNow();
  }
  if (date.isSame(tomorrow, 'day')) {
    return 'Tomorrow';
  }
  if (date.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }
  return '';
};

export const openFile = path => {
  // let uri = path;
  // if (Platform.OS === 'ios') {
  //   uri = uri.replace('file://', '');
  // }
  FileViewer.open(path)
    .then(() => {
      console.log('Success');
    })
    .catch(_err => {
      console.log(_err);
    });
};

const formatContentType = file => {
  return file && file.split('/')[0];
};
export const createFormData = image => {
  const formdata = new FormData();
  let type = image?.mime;
  let mediaType = formatContentType(type);
  if (mediaType === 'application') {
    mediaType = 'document';
  }
  let file = {
    uri:
      mediaType === 'video' || mediaType === 'document'
        ? image?.path
        : Platform.OS === 'ios'
        ? `file:///${image.path}`
        : image.path,
    type: image?.mime,
    name: image?.filename || image?.path.split('/').pop(),
  };
  formdata.append(
    mediaType === 'video'
      ? 'video'
      : mediaType === 'document'
      ? 'resource'
      : 'files',
    file,
    image?.filename || image?.path.split('/').pop(),
  );
  return formdata;
};

export const initialMediaData = ({
  mediasNew,
  newMessages,
  lastMessageIndex,
}) => {
  let images =
    mediasNew.map((val, index) => {
      let type = val.mime;
      let mediaType = type && type?.split('/')[0];
      if (mediaType === 'application') {
        mediaType = 'document';
      }
      const newMessage = {
        _id: newMessages[0]._id + index + 1,
        text: index === 0 ? newMessages[0]?.text : null,
        createdAt: new Date(),
        user: newMessages[0].user,
        fileType: mediaType,
        docImage: mediaType === 'document' ? docImage : '',
        [mediaType]: val?.path,
        received: true,
        index: lastMessageIndex + index + 1,
      };
      return newMessage;
    }) || [];

  return images;
};

export const removeMessage = async ({
  index,
  conversation,
  links,
  _id,
  services,
  configuration,
  setMessages,
}) => {
  Alert.alert('Are you sure want to delete? ', `you are deleting`, [
    {
      text: 'Yes',
      onPress: async () => {
        const messageInstance = new Message(
          index,
          {sid: _id},
          conversation,
          links,
          configuration,
          services,
        );
        try {
          await messageInstance?.remove();
          setMessages(previousMessage =>
            previousMessage.filter(messageItem => {
              return messageItem?._id !== _id;
            }),
          );
        } catch (err) {}
      },
    },
    {
      text: 'No',
      onPress: () => null,
    },
  ]);
};

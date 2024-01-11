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
import {Message} from '@twilio/conversations';
import {MessageStatus} from './conatant';
import {
  getSdkMessageObject,
  mediaMap,
  messagesMap,
} from '../redux/coversation-objects';
import {PREVIEW_URL} from '@env';
import Colors from '../customs/Colors';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';

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
  let mediaType = '';
  const attachedMedia = mediasNew.map((val, index) => {
    if (index === 0) {
      let type = val.mime;
      mediaType = type && type?.split('/')[0];
    }
    return {
      sid: `${index + 1}_attachedMedia`,
      url: val?.path,
      isLocal: true,
      contentType: val.mime,
    };
  });

  // let images =
  //   mediasNew.map((val, index) => {
  //     let type = val.mime;
  //     let mediaType = type && type?.split('/')[0];
  //     if (mediaType === 'application') {
  //       mediaType = 'document';
  //     }
  const newMessage = {
    _id: newMessages[0]._id,
    text: newMessages[0]?.text,
    createdAt: new Date(),
    user: newMessages[0].user,
    fileType: mediaType,
    docImage: mediaType === 'document' ? docImage : '',
    [mediaType]: mediaType,
    // sent: true,
    index: lastMessageIndex + 1,
    attachedMedia,
    isLocal: true,
  };
  // return newMessage;
  // }) || [];

  return [newMessage];
};

// const getSdkMessageObject = message => {
//   const {index, _id, conversation, links, configuration, services} =
//     message || {};

//   const messageInstance = new Message(
//     index,
//     {sid: _id},
//     conversation,
//     links,
//     configuration,
//     services,
//   );

//   return messageInstance;
// };

export const removeMessage = async ({selectedMessages}) => {
  for (let message of selectedMessages) {
    getSdkMessageObject({_id: message?._id})
      ?.remove()
      .then(() => {
        if (messagesMap.has(message?._id)) {
          messagesMap.delete(message?._id);
        }
        if (message?.attachedMedia) {
          message?.attachedMedia.forEach(media => {
            if (mediaMap.has(media?._id)) {
              mediaMap.delete(media?.sid);
            }
          });
        }
      });
  }
};

export const getMessageStatus = async (
  message,
  channelParticipants,
  identity,
) => {
  const statuses = {
    [MessageStatus.Sent]: 0,
    [MessageStatus.Received]: 0,
    [MessageStatus.Failed]: 0,
    [MessageStatus.Pending]: 0,
  };
  if (!message || !channelParticipants) {
    return statuses;
  }

  if (message.index === -1) {
    return Promise.resolve({
      ...statuses,
      [MessageStatus.Pending]: 1,
    });
  }

  channelParticipants.forEach(participant => {
    if (participant?.identity === identity || participant?.type !== 'chat') {
      return;
    }

    if (
      participant?.lastReadMessageIndex &&
      participant?.lastReadMessageIndex >= message?.index
    ) {
      statuses[MessageStatus.Received] += 1;
    } else if (participant?.lastReadMessageIndex !== -1) {
      statuses[MessageStatus.Sent] += 1;
    }
  });

  if (message?.aggregatedDeliveryReceipt) {
    const sdkMessage = getSdkMessageObject({_id: message?._id});
    const receipts = await sdkMessage?.getDetailedDeliveryReceipts(); // paginated backend query every time

    receipts.forEach(receipt => {
      if (receipt.status === 'read') {
        statuses[MessageStatus.Received] += 1;
      }

      if (receipt.status === 'delivered') {
        statuses[MessageStatus.Sent] += 1;
      }

      if (receipt.status === 'failed' || receipt.status === 'undelivered') {
        statuses[MessageStatus.Failed] += 1;
      }

      if (receipt.status === 'sent' || receipt.status === 'queued') {
        statuses[MessageStatus.Pending] += 1;
      }
    });
  }

  return statuses;
};

export const getMessages = async conversation =>
  await conversation.getMessages(30);

export const getOtherParticipant = (participants = [], currentParticipant) => {
  let otherParticipant = {};
  participants.forEach(participant => {
    if (participant?.identity !== currentParticipant) {
      otherParticipant = participant;
    }
  });
  return otherParticipant;
};

export const getBlobFile = async media => {
  try {
    const url = await getFileUrl(media);
    const response = await fetch(url);
    // return response && response?.blob();
    return response.url;
  } catch (e) {
    throw e;
  }
};

export const getFileUrl = async media => {
  return await media?.getContentTemporaryUrl().then();
};

// export const imageSaveInCacheIOS = async (images = []) => {
//   let results = [];
//   if (images && images.length) {
//     for (let image of images) {
//       const path = image?.path;
//       let fileName = image?.sourceURL
//         ? image?.filename
//         : image?.path?.split('/').pop();
//       let ext = fileName && fileName?.split('.').pop();
//       try {
//         await CameraRoll.save(path, {
//           type: 'photo',
//           album: 'mentalica',
//         })
//           .then(res => {
//             let data = {
//               filename: fileName,
//               uri: res,
//               mime: `image/${ext}`,
//             };
//             results.push(data);
//           })
//           .catch(err => {
//             console.log('err CameraRoll', err);
//           });
//       } catch (err) {
//         console.log('Error in filewrite', err);
//       }
//     }
//   }
//   return results;
// };

export const monthsShorts = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const profileURL = profileId => `${PREVIEW_URL}/${profileId}/userpic`;

export const darkModeColor = isDarkMode => {
  if (isDarkMode) {
    return Colors.white;
  }
  return Colors.black;
};

export const dateFormatYY_MM_DD = date => {
  const newDate = date || new Date();
  return (
    newDate.getFullYear() +
    '-' +
    `0${newDate.getMonth() + 1}` +
    '-' +
    `0${newDate.getDate() < 10 ? `${newDate.getDate()}` : newDate.getDate()}`
  );
};

export const doubleDigitConverter = val => {
  return val > 10 ? val : `0${val}`;
};

export const currentDayMonthYear = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  return {currentYear, currentMonth, currentDay, today};
};

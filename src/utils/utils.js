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
export const iosPlatform = Platform.OS === 'ios';
export const androidPlatform = Platform.OS === 'android';

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
  let date=moment(lastMessageTime)
  if (date.isSame(new Date(), 'day')) {
    return moment(date).fromNow()
  }
  if (date.isSame(tomorrow, 'day')) {
    return 'Tomorrow';
  }
  if (date.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }
  return '';
};

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
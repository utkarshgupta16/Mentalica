import {
    checkMultiple,
    request,
    requestMultiple,
    PERMISSIONS,
    RESULTS,
  } from 'react-native-permissions';
  
export const _checkPermissions = callback => {
    const iosPermissions = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    const androidPermissions = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ];
    checkMultiple(
      Platform.OS === 'ios' ? iosPermissions : androidPermissions,
    ).then(statuses => {
      const [CAMERA, AUDIO] =
        Platform.OS === 'ios' ? iosPermissions : androidPermissions;
      if (
        statuses[CAMERA] === RESULTS.UNAVAILABLE ||
        statuses[AUDIO] === RESULTS.UNAVAILABLE
      ) {
        Alert.alert(
          'Error',
          'Hardware to support video calls is not available',
        );
      } else if (
        statuses[CAMERA] === RESULTS.BLOCKED ||
        statuses[AUDIO] === RESULTS.BLOCKED
      ) {
        Alert.alert(
          'Error',
          'Permission to access hardware was blocked, please grant manually',
        );
      } else {
        if (
          statuses[CAMERA] === RESULTS.DENIED &&
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          requestMultiple(
            Platform.OS === 'ios' ? iosPermissions : androidPermissions,
          ).then(newStatuses => {
            if (
              newStatuses[CAMERA] === RESULTS.GRANTED &&
              newStatuses[AUDIO] === RESULTS.GRANTED
            ) {
              callback && callback();
            } else {
              Alert.alert('Error', 'One of the permissions was not granted');
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
                Alert.alert('Error', 'Permission not granted');
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
    });
  };
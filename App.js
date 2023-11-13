import React, {useEffect, useState} from 'react';
import reactotron from 'reactotron-react-native';
import MainNavigator from './src/navigation/MainNavigator';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/utils/i18n';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import {fcmService} from './src/utils/fcmServices';
import {localNotificationService} from './src/utils/localPushNotification';
import PushNotification from 'react-native-push-notification';
import {androidPlatform} from './src/utils/config';
export const AppContext = React.createContext(initialState);

const LOCAL_NOTIFICATION_CHANNEL_ID = 'high_priority_alerts';
let notificationIDs = 0;
const initialState = {
  isAudioEnabled: true,
  status: 'disconnected',
  participants: new Map(),
  videoTracks: new Map(),
  userName: '',
  roomName: '',
  token: '',
  isVideoEnabled: true,
};

function onNotification(notify) {
  const options = {
    playSound: true,
  };
  if (androidPlatform) {
    if (Platform.Version > 25) {
      PushNotification.getChannels(channelIDs => {
        if (
          channelIDs &&
          channelIDs.length > 0 &&
          channelIDs.includes(LOCAL_NOTIFICATION_CHANNEL_ID)
        ) {
          notificationIDs += 1;
          localNotificationService.showNotification(
            notificationIDs,
            notify.notification.title,
            notify.notification.body,
            notify.data,
            options,
            LOCAL_NOTIFICATION_CHANNEL_ID,
          );
        } else {
          PushNotification.createChannel(
            {
              channelId: LOCAL_NOTIFICATION_CHANNEL_ID, // (required)
              channelName: 'Mentalica Application', // (required)
              importance: 3,
            },
            created => {
              notificationIDs += 1;
              if (created) {
                localNotificationService.showNotification(
                  notificationIDs,
                  notify.notification.title,
                  notify.notification.body,
                  notify.data,
                  options,
                  LOCAL_NOTIFICATION_CHANNEL_ID,
                );
              }
            },
          );
        }
      });
    } else {
      notificationIDs += 1;
      localNotificationService.showNotification(
        notificationIDs,
        notify.notification.title,
        notify.notification.body,
        notify.data,
        options,
      );
    }
  } else {
    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify.data,
      options,
    );
  }
}

function onOpenNotification(data) {
}

function onRegister(token) {}

const registerNotification = () => {
  fcmService.register(onRegister, onNotification, onOpenNotification);
  localNotificationService.configure(onOpenNotification);
};

const App = () => {
  const [props, setProps] = useState(initialState);

  useEffect(() => {
    if (androidPlatform) {
      const requestPushNotificationPermission = async () => {
        try {
          if (Platform.Version > 32) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
              {
                title: 'Push Notification Permission',
                message: 'This app requires access for push notification.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // registerNotification();
            } else {
              console.log('please allow notification permission from settings');
            }
          } else {
            // registerNotification();
          }
        } catch (err) {
          console.error('errror --> ', err);
          return false;
        }
      };
      // requestPushNotificationPermission();
    } else {
      // fcmService.registerAppWithFCM();
      // fcmService.register(onRegister, onNotification, onOpenNotification);
      // localNotificationService.configure(onOpenNotification);
    }
    return () => {
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);

  if (__DEV__) {
    const yeOldeConsoleLog = console.log;
    console.log = (...args) => {
      yeOldeConsoleLog(...args);
      reactotron.display({
        name: 'CONSOLE.LOG',
        value: args,
        preview:
          args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
      });
    };
  }
  return (
    <AppContext.Provider value={{props, setProps}}>
      <I18nextProvider i18n={i18n}>
        <SafeAreaView style={styles.safeAreaViewStyle} />
        <MainNavigator style={styles.mainNavigator} />
      </I18nextProvider>
    </AppContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 0,
  },
});

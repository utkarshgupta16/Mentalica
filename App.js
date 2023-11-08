import React, {useEffect} from 'react';
import reactotron from 'reactotron-react-native';
import {Provider} from 'react-redux';
import MainNavigator from './src/navigation/MainNavigator';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import store from './src/redux/store';
import {fcmService} from './src/utils/fcmServices';
import {localNotificationService} from './src/utils/localPushNotification';
import PushNotification from 'react-native-push-notification';
import {androidPlatform} from './src/utils/config';

const LOCAL_NOTIFICATION_CHANNEL_ID = 'high_priority_alerts';
let notificationIDs = 0;

function onNotification(notify) {
  const options = {
    playSound: true,
  };
  console.log('1');
  if (androidPlatform) {
    console.log('2');
    if (Platform.Version > 25) {
      console.log('3');
      PushNotification.getChannels(channelIDs => {
        if (
          channelIDs &&
          channelIDs.length > 0 &&
          channelIDs.includes(LOCAL_NOTIFICATION_CHANNEL_ID)
        ) {
          console.log('4');
          notificationIDs += 1;
          localNotificationService.showNotification(
            notificationIDs,
            notify.notification.title,
            notify.notification.body,
            notify.data,
            options,
            LOCAL_NOTIFICATION_CHANNEL_ID,
          );
          console.log('5');
        } else {
          console.log('6');
          PushNotification.createChannel(
            {
              channelId: LOCAL_NOTIFICATION_CHANNEL_ID, // (required)
              channelName: 'Mentalica Application', // (required)
              importance: 3,
            },
            created => {
              console.log('7');
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
                console.log('8');
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
  console.log('Handle notification by fcmService (onOpenNotification)', data);
}
function onOpenNotifications(data) {
  console.log(
    'Handle notification by localNotificationService (onOpenNotification)',
    data,
  );
}
function onRegister(token) {}

const registerNotification = () => {
  fcmService.register(onRegister, onNotification, onOpenNotification);
  localNotificationService.configure(onOpenNotifications);
};

const App = () => {
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
              registerNotification();
            } else {
              console.log('please allow notification permission from settings');
            }
          } else {
            registerNotification();
          }
        } catch (err) {
          console.error('errror --> ', err);
          return false;
        }
      };
      requestPushNotificationPermission();
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
    <Provider store={store}>
      <SafeAreaView style={styles.safeAreaViewStyle} />
      <MainNavigator style={styles.mainNavigator} />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 0,
  },
});

/* eslint-disable @typescript-eslint/no-unused-vars */
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {iosPlatform} from './config';

class FCMService {
  register(onRegister, onNotification, onOpenNotification) {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  }

  async registerAppWithFCM() {
    if (iosPlatform) {
      (await messaging) && messaging().setAutoInitEnabled(true);
    }
  }

  checkPermission(onRegister) {
    messaging &&
      messaging()
        .hasPermission()
        .then(enabled => {
          if (enabled) {
            // User has permissions
            this.getToken(onRegister);
          } else {
            // User doesn't have permission
            this.requestPermission(onRegister);
          }
        })
        .catch(error => {
          console.log('[FCMService] Permission rejected ', error);
        });
  }

  async getToken(onRegister) {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("fcmToken===============",fcmToken)
    if (!fcmToken) {
      try {
        fcmToken = await messaging().getToken();
        if (fcmToken) {
          onRegister(fcmToken);
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      } catch (e) {
        console.log('error-->', e);
      }
    }
  }

  requestPermission(onRegister) {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.log('[FCMService] Request Permission rejected ', error);
      });
  }

  deleteToken() {
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('[FCMService] Delete token error', error);
      });
  }

  createNotificationListeners(onRegister, onNotification, onOpenNotification) {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });
    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
    // Foreground state messages
    //@ts-ignore
    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        onNotification(remoteMessage);
      }
    });
    // Triggered when there is a new token
    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken);
    });
  }

  unRegister() {
    //@ts-ignore
    this.messageListener();
  }
}

export const fcmService = new FCMService();

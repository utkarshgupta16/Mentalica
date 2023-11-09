/* eslint-disable @typescript-eslint/no-unused-vars */
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {iosPlatform} from './config';

class FCMService {
  register(
    onRegister: (token: string) => void,
    onNotification: (message: any) => void,
    onOpenNotification: (data: any) => void,
  ): void {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  }

  async registerAppWithFCM(): Promise<void> {
    if (iosPlatform) {
      await messaging().setAutoInitEnabled(true);
    }
  }

  checkPermission(onRegister: (token: string) => void): void {
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
      .catch((error: any) => {
        console.log('[FCMService] Permission rejected ', error);
      });
  }

  async getToken(onRegister: (token: string) => void): Promise<void> {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('fcmTokem is --> ', fcmToken);
    if (!fcmToken) {
      try {
        fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log('created fcmToken is --> ', fcmToken);
          onRegister(fcmToken);
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      } catch (e) {
        console.log('error-->', e);
      }
    }
  }

  requestPermission(onRegister: (token: string) => void): void {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.log('[FCMService] Request Permission rejected ', error);
      });
  }

  deleteToken(): void {
    console.log('[FCMService] deleteToken');
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('[FCMService] Delete token error', error);
      });
  }

  createNotificationListeners(
    onRegister: (token: string) => void,
    onNotification: (message: any) => void,
    onOpenNotification: (data: any) => void,
  ): void {
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
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
    // Foreground state messages
    //@ts-ignore
    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log('[FCMService] A new FCM message arrived!', remoteMessage);
      if (remoteMessage) {
        onNotification(remoteMessage);
      }
    });
    // Triggered when there is a new token
    messaging().onTokenRefresh(fcmToken => {
      console.log('[FCMService] New token refresh: ', fcmToken);
      onRegister(fcmToken);
    });
  }

  unRegister(): void {
    //@ts-ignore
    this.messageListener();
  }
}

export const fcmService = new FCMService();

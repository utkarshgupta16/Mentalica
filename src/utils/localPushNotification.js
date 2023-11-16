import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {iosPlatform} from './config';

class LocalNotificationService {
  configure = onOpenNotification => {
    PushNotification.configure({
      onRegister(token) {
        console.log('[LocalNotificationService] onRegister:', token);
      },
      onNotification(notification) {
        // on click notification in android
        console.log('[LocalNotificationService] onNotification:', notification);
        if (!notification?.data) {
          return;
        }

        notification.userInteraction = true;
        // on click notification in android
        onOpenNotification(iosPlatform ? notification.data : notification.data);
        if (iosPlatform) {
          // (required) Called when a remote is received or opened, or local notification
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      // IOS ONLY (optional): default: all — Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
       * (optional) default: true
       * — Specified if permissions (ios) and token (android and ios) will requested or not,
       * — if not, you must call PushNotificationsHandler.requestPermissions() later
       * — if you are not using remote notification or do not have Firebase installed,:
       * requestPermissions: iosPlatform
       */
      requestPermissions: true,
    });
    PushNotification.setApplicationIconBadgeNumber(0);
  };

  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = (
    id,
    title,
    message,
    data = {},
    options = {},
    channelID,
  ) => {
    PushNotification.localNotification({
      foreground: true,
      /* Android Only Properties */
      ...this.buildAndroidNotification(
        id,
        title,
        message,
        data,
        options,
        channelID,
      ),
      /* iOS and Android properties */
      ...this.buildIOSNotification(id, title, message, data, options),
      /* iOS and Android properties */
      title: title || '',
      message: message || '',
      //@ts-ignore
      userInteraction: false, // BOOLEAN: If the notification was opened by the user
    });
  };

  buildAndroidNotification = (
    id,
    title,
    message,
    data = {},
    options = {},
    channelID,
  ) => ({
    id,
    autoCancel: true,
    bigText: message || '',
    subText: title || '',
    //@ts-ignore
    vibrate: options.vibrate || true,
    //@ts-ignore
    vibration: options.vibration || 300,
    //@ts-ignore
    priority: options.priority || 'high',
    //@ts-ignore
    importance: options.importance || 'high', // (optional) set notification importance, default: high,
    data,
    channelId: channelID, // (required) channelId
  });

  buildIOSNotification = (id, title, message, data = {}, options = {}) => ({
    //@ts-ignore
    alertAction: options.alertAction || 'view',
    //@ts-ignore
    category: options.category || '',
  });

  scheduleNotification(data) {
    PushNotification.localNotificationSchedule(data);
  }
}

export const localNotificationService = new LocalNotificationService();

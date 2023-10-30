import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
// import StorageProvider from '../../framework/src/StorageProvider';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // User has permission
          this.getToken(onRegister);
        } else {
          // User doesn't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {});
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(async fcmToken => {
        if (fcmToken) {
          // await StorageProvider.set('USER_FCM_TOKEN', fcmToken);
          onRegister(fcmToken);
        }
      })
      .catch(error => {});
  };

  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {});
  };

  deleteToken = () => {
    //@ts-ignore
    messaging.deleteToken().catch(error => {});
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        if (!remoteMessage.data) {
          onOpenNotification(notification);
          return;
        }
        //@ts-ignore
        notification.userInteraction = true;
        onOpenNotification(
          Platform.OS === 'ios' ? remoteMessage.data.item : remoteMessage,
        );
        // this.removeDeliveredNotification(notification.notificationId)
      }
    });

    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          if (!remoteMessage.data) {
            onOpenNotification(notification);
            return;
          }
          //@ts-ignore
          notification.userInteraction = true;
          onOpenNotification(
            Platform.OS === 'ios' ? remoteMessage.data.item : remoteMessage,
          );
          //this.removeDeliveredNotification(notification.notificationId)
        }
      });

    // Foreground state messages
    messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage;
        } else {
          notification = remoteMessage;
        }
        notification['title'] = remoteMessage.notification.title;
        notification['message'] = remoteMessage.notification.body;
        onNotification(notification);
      }
    });

    // Triggered when have new token
    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken);
    });
  };

  // unRegister = () => {
  //     this.messageListener();
  // }
}

export const fcmService = new FCMService();

import {Alert} from 'react-native';
import Toast from 'react-native-simple-toast';
//--------------------------- Message Provider Start -----------------------
class messageFunctionsProviders {
  toast(message, position) {
    if (position == 'center') {
      Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);
    } else if (position == 'top') {
      Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
    } else if (position == 'bottom') {
      Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);
    } else if (position == 'long') {
      Toast.showWithGravity(message, Toast.LONG, Toast.CENTER);
    }
  }

  later(title, message, callbackOk, callbackCancel, callbackLater) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Ask me later',
          onPress: () => {console.log('')},
        },
        {
          text: 'Cancel',
          onPress: () => {console.log('')},
        },
        {
          text: 'OK',
          onPress: () => {console.log('')},
        },
      ],
      {cancelable: false},
    );
  }
  loginFirst() {
    Alert.alert(
      'Information',
      '',

      [
        {
          text: "Ok",
          onPress: () => {
			console.log('navigation', 'props');
          },
        },
      ],
      {cancelable: false},
    );
  }
}
export const msgProvider = new messageFunctionsProviders();

//--------------------------- Message Provider End -----------------------

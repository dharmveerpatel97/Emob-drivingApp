/**
 * @format
 */
import 'react-native-gesture-handler'
import {AppRegistry, ToastAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

const Call= async (data) => {
    if (data.state === 'extra_state_ringing') {
        ToastAndroid.showWithGravity("Ringing ", Toast.LONG, Toast.BOTTOM)
        invokeApp({data:{number:data.number}});
    }
    else if (data.state === 'extra_state_offhook') {
        ToastAndroid.showWithGravity("Call Started", Toast.LONG, Toast.BOTTOM)
    }
    else if (data.state === 'extra_state_idle') {
        ToastAndroid.showWithGravity("Call Ended", Toast.LONG, Toast.BOTTOM)
    }
}

AppRegistry.registerHeadlessTask('Call', () =>Call )
AppRegistry.registerComponent(appName, () => App);



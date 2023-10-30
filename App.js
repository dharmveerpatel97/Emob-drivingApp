import React from 'react';
import {View, Text, LogBox, DeviceEventEmitter} from 'react-native';
import Navigation from './Source/navigation';
import {store} from './Source/Redux/store';
import {Provider} from 'react-redux';
import {useEffect} from 'react';
import {initMap, initMapGL} from './Source/utils/initMap';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

LogBox.ignoreLogs([
  'Warning: ...',
  'Encountered two children',
  'VirtualizedLists should never be nested inside plain ScrollViews',
  'Got a component with the name',
  'Each child in a list should have a unique ',
]); // Ignore log notification by message
// LogBox.ignoreAllLogs(true);//Ignore all log notifications

initMapGL();
initMap();
const App = ({navigation}) => {
  useEffect(() => {
    DeviceEventEmitter.addListener('appInvoked', data => {
      const {number} = data;
      navigation.navigate('NumberPopupScreen', {number: number});
    });
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </GestureHandlerRootView>
  );
};
export default App;

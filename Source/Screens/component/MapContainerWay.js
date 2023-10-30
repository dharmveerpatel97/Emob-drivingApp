import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MapHeaderWay from './MapHeaderWay';
import {color} from '../../utils/color';
import {DrawerActions} from '@react-navigation/native';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const MapContainer = props => {
  return (
    <SafeAreaView style={styles.page}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor={color.black_BG}
      />
      <MapHeaderWay
        onPress={() => {
          console.log('DrawerActions.openDrawer',props.navigation)
          props.navigation.goback();
        }}
      />
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    
    backgroundColor: '#001A0F',
  },
});
export default MapContainer;

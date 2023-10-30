import {
  Image, 
  TouchableOpacity, 
  NativeModules,
} from 'react-native';
import {useEffect} from 'react';
import {getCurrentLocation} from '../../utils/commonFunction';

const RedirectionButton = ({rideDetails, navigation = {}}) => {
  const {SDKNAvigationModule} = NativeModules;
  useEffect(() => {
    console.log('navigation', navigation);
  }, []);

  const onInit = async () => {
    const {latitude, longitude, heading} = await getCurrentLocation();
    SDKNAvigationModule.NavigateMe(
      latitude,
      longitude,
      rideDetails?.destination?.latitude,
      rideDetails?.destination?.longitude,
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onInit();
      }}
      activeOpacity={0.8}
      style={{
        width: 38,
        height: 38,
        borderRadius: 38 / 2,
        backgroundColor: '#363B45',
        justifyContent: 'center',
      }}>
      <Image
        style={{width: 20, height: 20, alignSelf: 'center'}}
        source={require('../../Assests/image/direction_1.png')}
      />
    </TouchableOpacity>
  );
};
export default RedirectionButton;

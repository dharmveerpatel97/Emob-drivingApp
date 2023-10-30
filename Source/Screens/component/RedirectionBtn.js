import {Image, TouchableOpacity, NativeModules} from 'react-native';
import {getCurrentLocation} from '../../utils/commonFunction';

const RedirectionBtn = ({rideDetails}) => {
  const {SDKNAvigationModule} = NativeModules;
  const onInit = async () => {
    const {latitude, longitude} = await getCurrentLocation();
    console.log('latitude--',latitude)
    console.log('longitude--',longitude)
    console.log('rideDetails?.source?.latitude--',rideDetails?.source?.latitude)
    console.log('rideDetails?.source?.longitude--',rideDetails?.source?.longitude)
    SDKNAvigationModule.NavigateMe(
      latitude,
      longitude,
      rideDetails?.source?.latitude,
      rideDetails?.source?.longitude,
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
export default RedirectionBtn;

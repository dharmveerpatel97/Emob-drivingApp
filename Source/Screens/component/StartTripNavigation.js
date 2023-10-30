import {
  View,
  Dimensions,
  Text,
  Modal,
  StyleSheet,
  Image,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
import {color} from '../../utils/color';
import {BOLD, REGULAR} from '../../utils/fonts';
import CircularCustomProfile from './CircularCustomProfile';
import PickupDropLocation from './PickupDropLocations';
import Seperator from '../customComp/Seperator';
import CustomTripButton from '../customComp/CustomTripButton';
import {t} from 'i18next';
import RedirectionButton from './RedirectionButton';
import CustomToastProvider from '../customComp/CustomToastProvider';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
import {useEffect, useRef, useState} from 'react';
import {distanceMatrix} from '../../Redux/rideSlice';

import {
  showFloatingBubble,
  hideFloatingBubble,
  requestPermission,
  checkPermission,
  initialize,
} from 'react-native-floating-bubble';
import {getCurrentLocation} from '../../utils/commonFunction';
import {redirectToMap, resetStack} from '../../utils/commonFunction';
import {urls} from '../../utils/config';
import { useTranslation } from 'react-i18next';
 

const StartTripNavigation = ({
  isTripStarted,
  onStartTripNavigation,
  rideDetails,
  isnonpassngerTrip,
}) => {
  const {t} = useTranslation();

  const [Sdistance, setSdistance] = useState(0);
  const [Stime, setStime] = useState(0);

  const matrix = async () => {
    const {latitude, longitude} = await getCurrentLocation();

    let accessToken = '';
    await StorageProvider.getObject('accessToken').then(responce => {
      accessToken = responce.accesstoken;
      console.log('res', responce.accesstoken);
    });
    console.log('ride req current ', latitude, longitude);
    console.log(
      'ride req source',
      rideDetails.source.latitude,
      rideDetails.source.longitude,
    );
    let apiUrl = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/distance?source=${rideDetails.source.longitude},${rideDetails.source.latitude}&destination=${rideDetails.destination.longitude},${rideDetails.destination.latitude}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    };
    fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data, '-------response---------');
        setSdistance(Math.round(data.results.distances / 1000));
        setStime(Math.round(data.results.durations / 60));
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isTripStarted) {
      matrix();
    }
  }, [isTripStarted]);

  const onInit = () => {};

  return (
    <Modal transparent visible={isTripStarted}>
      <View style={styles.container}>
        <CustomToastProvider />
        <View style={styles.innerContainer}>
          <View style={{marginHorizontal: 16}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <View style={{flexDirection: 'row'}}>
                <CircularCustomProfile rideDetails={rideDetails} />
                <View style={{justifyContent: 'center', marginStart: 5}}>
                  <Text
                    style={{fontSize: 16, fontFamily: BOLD, color: '#ffffff'}}>
                    {/* Vikram Khanna */}
                    {rideDetails?.passenger?.name
                      ? rideDetails?.passenger?.name
                      : ' Passenger'}
                  </Text>

                  {isnonpassngerTrip ? (
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                      <View style={{flexDirection: 'row', marginEnd: 10}}>
                        <Image
                          style={{width: 14, height: 14, marginEnd: 5}}
                          source={require('../../Assests/image/time.png')}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontfamily: REGULAR,
                            color: '#ffffff',
                          }}>
                          {Stime}
                          {t(' startTrip_min')}
                        </Text>
                      </View>

                      <View style={{flexDirection: 'row'}}>
                        <Image
                          style={{width: 14, height: 14, marginEnd: 5}}
                          source={require('../../Assests/image/distance.png')}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontfamily: REGULAR,
                            color: '#ffffff',
                          }}>
                          {Sdistance}
                          {t('startTrip_Km')}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
              {/* <RedirectionButton redirectToMap={()=>{
                redirectToMap(rideDetails?.source?.latitude,rideDetails?.source?.Longitude,rideDetails?.destination?.latitude,rideDetails?.destination?.Longitude)
              }}/> */}
            </View>

            <Seperator />
            <PickupDropLocation pickupLocation={rideDetails} />

            <CustomTripButton
              onPress={() => {
                onInit();
                onStartTripNavigation();
              }}
              buttonTitle={t('START TRIP NAVIGATION')}
              backgroundColor={'#00AF66'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',

    backgroundColor: '#001A0F80',
  },
  innerContainer: {
    width: width - 20,
    marginHorizontal: 16,
    paddingBottom: 25,
    backgroundColor: '#10281C',
    alignSelf: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: 30,
  },
});
export default StartTripNavigation;

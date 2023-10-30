import {
  View,
  Dimensions,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {BOLD, REGULAR} from '../../utils/fonts';
import CircularCustomProfile from './CircularCustomProfile';
import color from '../../utils/color';
import PickupDropLocation from './PickupDropLocations';
import Seperator from '../customComp/Seperator';
import RideEstAndTypes from './RideEstAndTypes';
import RejectButton from '../customComp/mapboxbuttons/RejectButton';
import AcceptButton from '../customComp/mapboxbuttons/AcceptButton';
import IgnoreButton from '../customComp/mapboxbuttons/IgnoreButton';
import StorageProvider from '../../Session/StorageProvider';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import {rejectRide, distanceMatrix} from '../../Redux/rideSlice';
import RedirectionButton from './RedirectionButton';
import {redirectToMap} from '../../utils/commonFunction';
import CustomToastProvider from '../customComp/CustomToastProvider';
import {getCurrentLocation} from '../../utils/commonFunction';
import {urls} from '../../utils/config';
import {useTranslation} from 'react-i18next';


const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const BookingRequest = ({
  isNewBookingRequest,
  onAccept,
  onReject,
  rideDetails,
  navigation = {},
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const intervalTimer = useRef(null);
  const [count, setCount] = useState(30);
  const [Sdistance, setSdistance] = useState(0);
  const [Dtime, setDtime] = useState(0);
  const [Stime, setStime] = useState(0);

  const matrix = async () => {
    const {latitude, longitude, heading} = await getCurrentLocation();
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
    let apiUrl = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/distance?source=${longitude},${latitude}&destination=${rideDetails.source.longitude},${rideDetails.source.latitude}`;

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
        if (data) {
          setSdistance(Math.round(data.results.distances / 1000));
          setStime(Math.round(data.results.durations / 60));
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const startCountDown = () => {
    var a = 30;
    intervalTimer.current = setInterval(() => {
      a = a - 1;
      console.log('timer', a);
      setCount(a);
      if (a == 0) {
        dispatch(rejectRide());
        clearInterval(intervalTimer.current);
      }
    }, 1000);
  };

  useEffect(() => {
    if (isNewBookingRequest) {
      matrix();
      let sorceDis = {
        source: rideDetails.source,
        destination: rideDetails.destination,
      };
      console.log('ride req destination', rideDetails);
      dispatch(distanceMatrix(sorceDis));
      startCountDown();
    }
  }, [isNewBookingRequest]);

  return (
    <Modal transparent visible={isNewBookingRequest}>
      <View style={styles.container}>
        <CustomToastProvider />
        <View style={styles.innerContainer}>
          <View style={{marginHorizontal: 16}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <CircularCustomProfile rideDetails={rideDetails} />
                <View style={{justifyContent: 'center', marginStart: 5}}>
                  <Text
                    style={{fontSize: 16, fontFamily: BOLD, color: '#ffffff'}}>
                    {rideDetails?.passenger?.name}
                  </Text>
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
                        {Stime+' '}
                        {t('booking_min')}
                        {/* {rideDetails?.durations ? rideDetails?.durations :0 } */}
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
                        {Sdistance+' '}
                        {t('booking_Km')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <RedirectionButton rideDetails={rideDetails} />
            </View>

            <PickupDropLocation  droptime={rideDetails.durations} starttime={Stime} pickupLocation={rideDetails} />

            <Seperator />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                marginHorizontal: 20,
              }}>
              <RideEstAndTypes
                title={t('Trip_Est_Amount')}
                subtTitle={'₹ ' + rideDetails?.estimatedFare}
                iconType={'EstRide'}
              />

              {/* <RideEstAndTypes
                title={'Ride Type'}
                subtTitle={rideDetails?.rideType}
                iconType={'RideType'}
              /> */}

              <RideEstAndTypes
                title={t('RideText')}
                subtTitle={
                  rideDetails?.distances
                    ? rideDetails?.distances + ' km'
                    : 0 + ' ' + t('Trip_Km')
                }
                iconType={''}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <RejectButton
                onPress={() => {
                  clearInterval(intervalTimer.current);
                  onReject();
                }}
              />
              <AcceptButton
                requestAcceptTimer={count}
                onPress={() => {
                  onAccept();
                  clearInterval(intervalTimer.current);
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                dispatch(rejectRide());
                clearInterval(intervalTimer.current);
              }}
              style={{
                width: width - 50,
                marginTop: 20,
                height: 50,
                borderRadius: 10,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#00AF66',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: BOLD,
                  color: '#fff',
                  alignSelf: 'center',
                }}>
                {t('booking_ignore')}
              </Text>
            </TouchableOpacity>
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
    backgroundColor: '#10281C',
    alignSelf: 'center',
    borderRadius: 10,
    paddingVertical: 25,
    position: 'absolute',
    bottom: height * 0.03,
  },
});
export default BookingRequest;

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Header,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Text,
  Modal,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import RestApiClient from '../../network/RestApiClient';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomPressable from '../customComp/CustomPressable';
import RideEstAndTypes from '../component/RideEstAndTypes';
import {color} from '../../utils/color';
import {mobW, mobH} from '../../utils/config';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import StorageProvider from '../../Session/StorageProvider';
import {getCurrentLocation, resetStack} from '../../utils/commonFunction';
import {urls} from '../../utils/config';
import Loader from '../../rn-swipe-button/src/components/Loader/Loader';
import { useTranslation } from 'react-i18next';

import {getRideDetailsByRideIDForNon} from '../../Redux/rideSlice';
const NewTrip = ({
  isnewtrip,
  onClose,
  Onsuccess,
  details,
  currentlocpoint,
  navigation = {},
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [Sdistance, setSdistance] = useState(0);
  const [sprice, setsprice] = useState(0);
  const [stime, setstime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const CreateRide = async () => {
    const {latitude, longitude, heading} = await getCurrentLocation();

    let body = {
      source: {
        latitude: latitude,
        longitude: longitude,
        address: details?.surceLoc,
      },
      destination: {
        latitude: details?.destinapoints.latitude,
        longitude: details?.destinapoints.longitude,
        address: details?.destinaLoc,
      },
      rideType: 'exclusive',
      noOfPassengers: 2,
      rideSchedule: 0,
      vehicleType: 'EV 3 wheeler',
      paymentType: 'upi',
    };
    console.log(JSON.stringify(body), 'body');

    StorageProvider.getObject('accessToken')
      .then(response => {
        RestApiClient(
          'POST',
          JSON.stringify(body),
          'rms/ride/non-app/create',
          'DMS',
          response.accesstoken,
        )
          .then(response => {
            console.log(response, '-------response ---------non-app/create');
            if (response?.requestId) {
              dispatch(getRideDetailsByRideIDForNon(response?.requestId)).then(
                response => {
                  Onsuccess();
                },
              );
            } else {
            }
          })
          .catch(error => {
            console.log('API ERROR' + error);
          });
      })
      .catch(error => {
        Alert.alert('Error', 'Token not found');
      });
  };

  const matrix = async () => {
    setIsLoading(true);
    const {latitude, longitude, heading} = await getCurrentLocation();

    let accessToken = '';
    await StorageProvider.getObject('accessToken').then(responce => {
      accessToken = responce.accesstoken;
      console.log('res', responce.accesstoken);
    });

    let apiUrl = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/distance?source=${longitude},${latitude}&destination=${details?.destinapoints.longitude},${details?.destinapoints.latitude}`;

    console.log("MEgha matrix",apiUrl)
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
        console.log(data);
        if (data) {
          setSdistance(Math.round(data?.results.distances / 1000));
          estimatefare(
            data?.results.distances,
            data?.results.durations,
            accessToken,
          );
          setstime(data?.results.durations);
          StorageProvider.saveItem(
            'droptiming',
            data?.results.durations.toString(),
          );
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const estimatefare = async (distamce, time, token) => {
    let apiUrl = `${urls.DMS_BASE_URL}rfms/v1/fare/estimated?distance=${distamce}&time=${time}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data) {
          setsprice(data[0]?.exclusiveFare);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (isnewtrip) {
      matrix();
    }
  }, [isnewtrip]);

  return (
    <Modal transparent visible={isnewtrip}>
      <View style={styles.container}>
        <Loader visible={isLoading} />
        <View
          style={{
            marginTop: (mobH - 450) / 2,
            height: 450,
            backgroundColor: '#10281C',
            marginHorizontal: 20,
            borderRadius: 10,
            alignItems: 'center',
          }}>
          <Text style={styles.headerTitle}>{t('mapbox_New_Trip')}</Text>
          <View style={styles.topContainer}>
            <View style={styles.imgContainer}>
              <Image
                source={require('../../Assests/image/distance.png')}
                style={{resizeMode: 'contain', height: 16, width: 16}}
              />

              <View style={styles.dotedIcons} />
              <Image
                source={require('../../Assests/image/dis_away.png')}
                style={{resizeMode: 'contain', height: 16, width: 16}}
              />
            </View>
            <View>
              <View
                style={[
                  styles.inputContainer,
                  {flexDirection: 'row', marginBottom: 10, opacity: 0.8},
                ]}>
                <Text
                  style={{
                    width: '90%',
                    flexShrink: 1,
                    flexWrap: 'wrap',
                    fontSize: 16,
                    fontFamily: 'Roboto-Medium',
                    color: color.white,
                    height: 20,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  }}>
                  {details?.surceLoc}
                </Text>
                <Image
                  source={require('../../Assests/image/gps.png')}
                  style={{
                    height: 20,
                    width: 20,
                    position: 'absolute',
                    right: 20,
                  }}
                />
              </View>
              <View
                style={[
                  styles.inputContainer,
                  {borderWidth: 1, borderColor: color.Border_color},
                ]}>
                <Text
                  style={{
                    width: '90%',
                    flexShrink: 1,
                    flexWrap: 'wrap',
                    fontSize: 16,
                    fontFamily: 'Roboto-Medium',
                    color: color.white,
                    height: 20,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  }}>
                  {details?.destinaLoc}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#020202',
              marginVertical: 20,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '70%',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: REGULAR,
                  color: '#ACACAC',
                  textAlign: 'left',
                }}>
                {t('Trip_Est_Amount')}
              </Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Image
                  style={{
                    width: 14,
                    height: 15,
                    resizeMode: 'contain',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                  source={require('../../Assests/image/estprice.png')}
                />
                <Text
                  style={{
                    fontsize: 14,
                    fontFamily: BOLD,
                    color: color.white,
                    marginStart: 5,
                  }}>
                  {sprice ? ' ₹' + sprice : '₹ ' + 0}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: REGULAR,
                  color: '#ACACAC',
                  textAlign: 'left',
                }}>
                {t('RideText')}
              </Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Image
                  style={{
                    width: 14,
                    height: 15,
                    resizeMode: 'contain',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                  source={require('../../Assests/image/ridelocation.png')}
                />
                <Text
                  style={{
                    fontsize: 14,
                    fontFamily: BOLD,
                    color: color.white,
                    marginStart: 5,
                  }}>
                  {Sdistance ? Sdistance + ' km' : 0 + ' km'}
                </Text>
              </View>
            </View>
          </View>

          <CustomPressable
            text={t('btn_CONTINUE')}
            marginTop={30}
            btnWidth={mobW - 70}
            route={''}
            navigation={navigation}
            onPress={() => {
              CreateRide();
            }}
            ErrorMessage={''}
            position={'relative'}
            bottom={0}
          />
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={{
              alignSelf: 'center',
              marginTop: 10,
              width: mobW - 100,
              backgroundColor: '#10281C',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
            }}>
            <Text
              style={{
                fontFamily: BOLD,
                fontSize: 18,
                color: color.white,
              }}>
              {t('btn_Cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NewTrip;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#001A0F80',
  },

  headerTitle: {
    width: '100%',
    color: color.white,
    fontSize: 20,
    fontFamily: BOLD,
    justifyContent: 'flex-start',
    marginTop: 20,
    textAlign: 'left',
    paddingLeft: 20,
  },
  dotedIcons: {
    borderStyle: 'dotted',
    height: 50,
    borderLeftWidth: 1,
    borderColor: '#10281C',
  },

  topContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    padding: 10,
    flexDirection: 'row',
  },
  imgContainer: {
    marginEnd: 10,
    alignItems: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.black_medum_50,
    borderRadius: 10,
    height: 50,
    marginBottom: 5,
    padding: Platform.OS == 'android' ? 0 : 12,
    width: '100%',
  },
});

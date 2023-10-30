import {View, Dimensions, Text, Modal, StyleSheet, Image} from 'react-native';
import {BOLD, REGULAR} from '../../utils/fonts';
import CircularCustomProfile from './CircularCustomProfile';
import {color} from '../../utils/color';
import Seperator from '../customComp/Seperator';
import {t} from 'i18next';
import RedirectionButton from './RedirectionButton';
import SwipeButton from '../../rn-swipe-button';
import CustomToastProvider from '../customComp/CustomToastProvider';
import moment from 'moment';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
import {useEffect, useRef, useState} from 'react';
import {getCurrentLocation} from '../../utils/commonFunction';
import {useTranslation} from 'react-i18next';
import {urls} from '../../utils/config';
const EndTripNavigation = ({
  isTripEnded,
  onEndTripPressed,
  rideDetails,
  navigation = {},
}) => {
  const {t} = useTranslation();
  const rideIcon = require('../../Assests/image/estprice.png');
  const [Sdistance, setSdistance] = useState(0);
  const [Stime, setStime] = useState(0);
  const [Dtime, setDtime] = useState(rideDetails?.createdAt);

  function formatUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return moment(date).format('h:mm A');
  }

  const matrix = async () => {
    const {latitude, longitude, heading} = await getCurrentLocation();

    let accessToken = '';
    await StorageProvider.getObject('accessToken').then(responce => {
      accessToken = responce.accesstoken;
    });

    console.log('ride req current ', latitude, longitude);
    console.log(
      'ride req source',
      rideDetails.source.latitude,
      rideDetails.source.longitude,
    );
    let apiUrl = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/distance?source=${longitude},${latitude}&destination=${rideDetails.destination.longitude},${rideDetails.destination.latitude}`;

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
        console.log(data, '-------response---------end');

        setSdistance(Math.round(data?.results?.distances / 1000));
        setStime(Math.round(data?.results?.durations / 60));
        let drop1 =
          parseFloat(data?.results.durations.toString()) +
          rideDetails.createdAt;
        console.log(
          data,
          '-------response---------end11',
          drop1,
          data.results.durations,
        );
        const date = new Date(drop1 * 1000);
        let dropdate = moment(date).format('h:mm A');
        setDtime(dropdate);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (isTripEnded) {
      matrix();
    }
  }, [isTripEnded]);

  const CheckoutButton = () => {
    return (
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: '#ffffff60',
          borderWidth: 0,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  };

  return (
    // <Modal transparent visible={isTripEnded}>
    <View style={styles.container}>
      <CustomToastProvider />
      <View style={styles.innerContainer}>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <CircularCustomProfile rideDetails={rideDetails} />
              <View style={{justifyContent: 'center', marginStart: 5}}>
                <Text
                  style={{fontSize: 16, fontFamily: BOLD, color: '#ffffff'}}>
                  {rideDetails?.passenger?.name
                    ? rideDetails?.passenger?.name
                    : t(' Passenger')}
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
                      {t('Trip_min')}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', marginEnd: 10}}>
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
                      {t('Trip_Km')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <RedirectionButton rideDetails={rideDetails} />
          </View>

          <Seperator />
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
                marginBottom: 8,
              }}>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Image
                  style={{
                    width: 16,
                    height: 16,
                    alignSelf: 'flex-start',
                    marginTop: 3,
                    resizeMode: 'contain',
                  }}
                  source={require('../../Assests/image/distance.png')}
                />
                <View style={{marginStart: 10, width: '70%'}}>
                  <Text
                    style={{
                      fontsize: 12,
                      fontFamily: REGULAR,
                      color: '#ACACAC',
                    }}>
                    {t('Trip_Pickup_Location')}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontsize: 16,
                      fontFamily: BOLD,
                      color: '#ffffff',
                      marginTop: 5,
                    }}>
                    {rideDetails?.source?.address}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'flex-end',
                    marginTop: 10,
                    position: 'absolute',
                    right: 10,
                  }}>
                  <Text
                    style={{
                      fontsize: 12,
                      opacity: 0.6,
                      fontFamily: REGULAR,
                      color: color.white,
                      width: '100%',
                    }}>
                    {formatUnixTimestamp(rideDetails?.createdAt)}
                  </Text>
                </View>
              </View>

              <Text
                style={{fontsize: 12, fontFamily: REGULAR, color: '#ACACAC'}}>
                {' '}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Image
                  style={{
                    width: 16,
                    height: 16,
                    alignSelf: 'flex-start',
                    marginTop: 3,
                    resizeMode: 'contain',
                  }}
                  source={require('../../Assests/image/dis_away.png')}
                />
                <View style={{marginStart: 10, width: '70%'}}>
                  <Text
                    style={{
                      fontsize: 12,
                      fontFamily: REGULAR,
                      color: '#ACACAC',
                    }}>
                    {t('Trip_Drop_Location')}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontsize: 16,
                      fontFamily: BOLD,
                      color: '#ffffff',
                      marginTop: 5,
                    }}>
                    {rideDetails?.destination?.address}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'flex-end',
                    marginTop: 10,
                    position: 'absolute',
                    right: 10,
                  }}>
                  <Text
                    style={{
                      fontsize: 12,
                      opacity: 0.6,
                      fontFamily: REGULAR,
                      color: color.white,
                      width: '100%',
                    }}>
                    {' '}
                    {Dtime}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontsize: 12,
                  fontFamily: REGULAR,
                  color: '#ACACAC',
                }}></Text>
            </View>
          </View>
          {/* <View style={{flexDirection: 'row',marginTop: 15,marginHorizontal:25
              }}>
            <Text style={{fontSize:14, fontFamily:BOLD, color:color.white}}>{'Est. Amount'}</Text>
            <View style={{flexDirection:'row',marginLeft:20,marginTop:2}}>
                <Image style={{width:14,height:15,resizeMode:"contain"}} source={require('../../Assests/image/estprice.png')}/>
            <Text style={{fontsize:14, fontFamily:BOLD, color:color.white, marginStart:5}}>{'₹ ' + rideDetails?.estimatedFare}</Text>
            </View>

</View> */}
          <Seperator />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
              marginBottom: 8,
            }}>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <Image
                style={{
                  width: 15,marginLeft:5,
                  height: 15,
                  alignSelf: 'flex-start',
                  marginTop: 3,
                  resizeMode: 'contain',
                }}
                source={require('../../Assests/image/estprice.png')}
              />
              <View style={{marginStart: 15, width: '70%'}}>
                <Text
                  numberOfLines={1}
                  style={{fontsize: 16, fontFamily: BOLD, color: '#ffffff'}}>
                  {t('Trip_Est_Amount')}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                 
                  position: 'absolute',
                  right: 10,
                }}>
                <Text
                  style={{
                    fontsize: 12,
                    opacity: 0.6,
                    fontFamily: REGULAR,
                    color: color.white,
                    width: '100%',
                  }}>
                  {'₹ ' + rideDetails?.estimatedFare}
                </Text>
              </View>
            </View>

            <Text style={{fontsize: 12, fontFamily: REGULAR, color: '#ACACAC'}}>
              {' '}
            </Text>
          </View>

          <SwipeButton
            containerStyles={{
              borderRadius: 5,
              color: '#fff',
              backgroundColor: '#00AF66',
              height: 55,
              marginTop: 10,
              paddingRight: 30,
            }}
            onSwipeFail={() => console.log('')}
            onSwipeStart={() => console.log('Swipe started!')}
            onSwipeSuccess={() => onEndTripPressed()}
            railBackgroundColor="#00AF66"
            railStyles={{borderRadius: 5}}
            thumbIconComponent={CheckoutButton}
            gradientColor={['#CB0017', '#CB0017']}
            railFillBackgroundColor={'#699CF340'}
            thumbIconStyles={{borderRadius: 5}}
            titleColor={'#fff'}
            thumbIconWidth={45}
            height={45}
            title={t('Trip_End_Ride')}
          />
        </View>
      </View>
    </View>
    // </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#10281C',
    alignSelf: 'center',
  },
  innerContainer: {
    width: width - 20,
    marginTop: -10,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
export default EndTripNavigation;

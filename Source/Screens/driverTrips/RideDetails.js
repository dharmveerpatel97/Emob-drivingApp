import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Header from '../customComp/Header';
import {mobH, mobW} from '../../utils/config';
import {color} from '../../utils/color';
import {BOLD, REGULAR, MEDIUM} from '../../utils/fonts';
import StarRating from 'react-native-star-rating-widget';
import MapplsGL from 'mappls-map-react-native';
import MapPath from '../../locationManaget/MapPath';
import {useTranslation} from 'react-i18next';
import {getRideHistoryDetails} from '../../Redux/rideSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import Loader from '../customComp/Loader';
import moment from 'moment';
import MapPathSource from '../../locationManaget/MapPathSource';
import { getPriceWithSymbol } from '../../utils/commonFunction';
export default function RideDetails({navigation, route}) {
  let cameraRef = useRef(null);
  const {t} = useTranslation();
  const [centerCordinates, setCenterCordinates] = useState([75.8577, 22.7196]);
  const [precenterCordinates, setPreCenterCordinates] = useState([
    75.8577, 22.7196,
  ]);

  function formatUnixTimestamp(timestamp,format) {
    if(timestamp)
    {
    const date = new Date(timestamp * 1000);
    return moment(date).format(format);
    }
    else return ''
  }

  const setCenterCoOrdi = data => {
    setCenterCordinates(data);
  if (cameraRef !== null) {
      cameraRef.current.fitBounds(
        [rideHistoryDetails?.source.longitude, rideHistoryDetails?.source.latitude],
        [rideHistoryDetails?.destination.longitude, rideHistoryDetails?.destination.latitude],
        [50, 50, 255, 50],
        1000
        );
      }

  };
  const rideId = route?.params?.rideId;
  const dispatch = useDispatch();
  const {rideHistoryDetails, rideLoading} = useSelector(state => state.ride);
  console.log('rideHistoryDetails', rideHistoryDetails);


  useEffect(() => {
    dispatch(getRideHistoryDetails(rideId));
  }, [rideId]);


  return (
    <SafeAreaView style={styles.container}>
      <Loader isFetching={rideLoading} />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        scrollEnabled={true}>
        <Header
          navigation={navigation}
          HeaderName={t('rideDetailsTitle')}
          rightIcon={true}
          titlePosition="center"
        />
        {rideHistoryDetails && (
          <View style={{paddingHorizontal: mobW * 0.04}}>
            <View style={styles.mapBox}>
              <MapplsGL.MapView
                animated={'trans'}
                animationMode="moveTo"
                mapplsStyle={'standard_night'}
                tintColor="#001A0F"
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
                // styleURL={MapplsGL.StyleURL.Dark}
                didLoadedMapmyIndiaMapsStyles={data => {
                  color: '#001A0F';
                }}>
                <MapplsGL.Camera
                  style={{backgroundColor: '#001A0F'}}
                  animationMode="moveTo"
                  ref={cameraRef}
                  minZoomLevel={8}
                  maxZoomLevel={23}
                  zoomLevel={12}
                  centerCoordinate={centerCordinates}
                />

                {/* <MapplsGL.UserLocation
                  animated={true}
                  visible={true}
                  onUpdate={location => {
                    // onUpdate(location);
                  }}
                /> */}

                {/* {ride.isOnRideStatus && ( */}
                <MapPath
                  destination={`${rideHistoryDetails?.destination.longitude},${rideHistoryDetails?.destination.latitude}`}
                  source={`${rideHistoryDetails?.source.longitude},${rideHistoryDetails?.source.latitude}`}
                  setCenterCordinates={setCenterCoOrdi}
                  showpath={true}
                  centerCordinates={`${rideHistoryDetails?.source.longitude},${rideHistoryDetails?.source.latitude}`}
                  centerNoString={[
                    rideHistoryDetails?.source.longitude,
                    rideHistoryDetails?.source.latitude,
                  ]}
                />

                {/* )} */}
              </MapplsGL.MapView>
            </View>

            <View style={styles.timeContainer}>
              <Text style={styles.timeTxt}>
                {/* Today ,3:35 PM */}
              {formatUnixTimestamp(rideHistoryDetails.updatedAt,'ddd, h:mm A')}

                
              </Text>
              <Text style={styles.priceTxt}>{getPriceWithSymbol(rideHistoryDetails?.finalFare)}</Text>
            </View>

            {/*============= place and time box======================== */}
            <View style={styles.placeBox}>
              <Text
                style={{
                  fontSize: mobW * 0.038,
                  color: color.white,
                  fontFamily: BOLD,
                }}>
                {t('rideDetailsTrip')}
              </Text>
              <View style={{flexDirection: 'row',marginTop:20}}>
                <View style={{justifyContent: 'center', height: mobW * 0.2}}>
                  <Image
                    style={styles.rideIcons}
                    source={require('../../Assests/image/start_icon.png')}
                  />
                  <View style={styles.dotedIcons} />
                  <Image
                    style={styles.rideIcons}
                    source={require('../../Assests/image/end_icon.png')}
                  />
                </View>
                <View style={styles.secondBox}>
                  <View style={styles.startRideTimeBox}>
                    <Text style={styles.startPointTxt} numberOfLines={1}>
                      {rideHistoryDetails?.source?.address}
                    </Text>
                    <View style={{justifyContent:'flex-end',alignSelf:'flex-end',width:'20%'}}>
                    <Text
                      style={styles.startPointTimeTxt}
                      numberOfLines={1}>{formatUnixTimestamp(rideHistoryDetails.startTime,'h:mm A')}</Text>
                      </View>
                  </View>
                  <View style={styles.startRideTimeBox}>
                    <Text style={styles.startPointTxt} numberOfLines={1}>
                      {rideHistoryDetails?.destination?.address}
                    </Text>
                    <View style={{justifyContent:'flex-end',alignSelf:'flex-end',width:'20%'}}>
                   
                    <Text
                      style={styles.startPointTimeTxt}
                      numberOfLines={1}>{formatUnixTimestamp(rideHistoryDetails.endTime,'h:mm A')}</Text>
                      </View>
                  </View>
                </View>
              </View>
            </View>

            {/*=========== user profile box=========== */}

            <>
              <View
                style={{
                  marginTop: 30,
                  borderBottomWidth: 1,
                  borderBottomColor: color.riderDiveder,
                  paddingBottom: mobH * 0.021,
                }}>
                <Text style={styles.reviewTxt}>{t('rideDetailsReview')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {rideHistoryDetails.passengerProfileUrl && (
                      <Image
                        source={
                          rideHistoryDetails.passengerProfileUrl != ''
                            ? {uri: rideHistoryDetails.passengerProfileUrl}
                            : require('../../Assests/image/user_avtar.png')
                        }
                        style={
                          rideHistoryDetails.passengerProfileUrl != ''
                            ? {
                                height: mobW * 0.18,
                                width: mobW * 0.18,
                                borderRadius: (mobW * 0.18) / 2,
                                resizeMode: 'contain',
                              }
                            : {
                                height: mobW * 0.18,
                                width: mobW * 0.18,
                                resizeMode: 'contain',
                              }
                        }
                      />
                    )}
                     { rideHistoryDetails?.passenger ?

                    <View style={{marginLeft: mobW * 0.03}}>
                      <Text style={styles.nameTxt}>
                        {rideHistoryDetails?.passenger?.name}
                      </Text>
                    
                      <Text style={styles.customerTxt}>
                        {t('rideDetailsCus')}
                      </Text> 
                      </View> 
                      :
                      <Text style={styles.customerTxt}>
                      {'Non-App Passenger'}
                    </Text>
         }
                  </View>
                  <View>
                    <Text style={[styles.customerTxt, {textAlign: 'right'}]}>
                    {formatUnixTimestamp(rideHistoryDetails.updatedAt,'DD/MM/yyyy')}

                    
                    </Text>
                    <Text style={[styles.customerTxt, {textAlign: 'right'}]}>
                    {formatUnixTimestamp(rideHistoryDetails.updatedAt,'h:mm A')}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.customerTxt,
                    {color: '#ffffff', marginTop: 10},
                  ]}>
                    {
                      (rideHistoryDetails.radingDescription) ? rideHistoryDetails.radingDescription: null 
                    }
                  
                </Text>
              </View>
              {/* ratting==== */}

             { rideHistoryDetails?.passenger &&(
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Text
                  style={{
                    fontSize: mobW * 0.038,
                    color: color.white,
                    fontFamily: BOLD,
                  }}>
                  {t('rideDetailsTripeRating')}
                </Text>
                <StarRating
                  starSize={22}
                  style={{marginTop: 2}}
                  color={'#F4CC25'}
                  emptyColor={'#ffffff'}
                  rating={ (rideHistoryDetails.passengerRating) ? rideHistoryDetails.passengerRating :0}
                  onChange={rating => {}}
                />
              </View>
             )}
            </>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10281C',
    paddingTop: mobH * 0.047,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: mobH * 0.08,
  },
  mapBox: {
    width: '100%',
    height: mobH * 0.3,
    borderWidth: 1,
    borderColor: color.riderDiveder,
    borderRadius: 5,
    marginTop: mobH * 0.02,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: mobH * 0.02,
  },
  timeTxt: {
    fontSize: mobW * 0.038,
    color: color.white,
    fontFamily: BOLD,
  },
  priceTxt: {
    fontSize: mobW * 0.034,
    color: color.white,
    fontFamily: MEDIUM,
  },
  placeBox: {
    marginTop: mobH * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: color.riderDiveder,
    paddingBottom: mobH * 0.021,
  },
  rideIcons: {
    height: mobW * 0.06,
    width: mobW * 0.06,
    resizeMode:"contain"
  },
  dotedIcons: {
    borderStyle: 'dotted',
    height: mobW * 0.087,
    borderLeftWidth: 2,
    borderColor: color.white,
    marginLeft: mobW * 0.0256,
  },
 
  secondBox: {
    justifyContent: 'space-between',
    height: mobW * 0.20,width:'90%',
    paddingVertical: mobW * 0.02,
    marginLeft: mobW * 0.03,
  },
  startPointTxt: {
    color: '#fff',width:'75%',
    fontSize: mobW * 0.034,
    fontFamily: MEDIUM,
    fontWeight: '600',
    marginRight: 13,
  },
  startRideTimeBox: {
    flexDirection: 'row',marginTop:-5,
    width: mobW * 0.85,
  },
  startPointTimeTxt: {
    color: color.white_50,
    fontSize: mobW * 0.034,alignSelf:'flex-end',
    fontFamily: REGULAR,
    fontWeight: '400',
  },
  reviewTxt: {
    fontSize: mobW * 0.038,
    color: color.white,
    fontFamily: BOLD,
  },
  nameTxt: {
    fontSize: mobW * 0.036,
    color: color.white,
    fontFamily: BOLD,
  },

  userImage: {
    height: mobW * 0.18,
    width: mobW * 0.18,
  },
  customerTxt: {
    fontSize: mobW * 0.034,
    color: color.white_50,
    fontFamily: MEDIUM,
    marginTop: 7,
  },
});

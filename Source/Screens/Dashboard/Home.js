import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable, 
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
  StatusBar,
  ScrollView,
  RefreshControl,
  PermissionsAndroid,
} from 'react-native';
import Pie from 'react-native-pie';
import React, {useEffect, useState} from 'react';
import navigationImage from '../../Assests/image/navimg.png';
import arrowRight from '../../Assests/image/arrowRight.png';
import supportImage from '../../Assests/image/supportN.png';
import {color} from '../../utils/color';
import rupee from '../../Assests/image/rupp.png';
import auto from '../../Assests/image/auto.png';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {
  resetStack,
  mobW,
  mobH,
  locationPermission,
  getCurrentLocation,
  formatDate,
  formattedRegistrationNumber,
} from '../../utils/commonFunction';

import {DrawerActions, useFocusEffect} from '@react-navigation/native';
import StorageProvider from '../../Session/StorageProvider';
import {useCallback} from 'react';
import CustomPressable from '../customComp/CustomPressable';
import {useSelector, useDispatch} from 'react-redux';
import {fcmService} from '../../FCM_notification/FCMService';
import {useTranslation} from 'react-i18next';
import {
  appLatLong,
  getDriverAllocation,
  getUserProfile,
  onDutyOffDuty,
  addSOCPercentage,
  setFCMToken,
  getDriverProfileInfo,
} from '../../Redux/appSlice';
import {
  distanceMatrix,
  getDriverEarning,
  getDriverTodayEarning,
  getDriverRideStatus,
  getRideDetailsByRideID,
  getRideHistory,
  resetRideStates,
} from '../../Redux/rideSlice';
import DeviceInfo from 'react-native-device-info';
import {localNotificationService} from '../../FCM_notification/LocalNotificationService';
import LocationPermissionModal from '../component/LocationPermissionModal';

import socketPro from '../../network/Socket';
import {reAssignEV, refundRequest} from '../../Redux/evSlice';
import RentalEVStyle from '../../styles/RentalEVStyle';
import AlertModal from '../component/AlertModal';
import Loader from '../customComp/Loader';
import HomeInServiceBox from '../component/HomeComp/HomeInServiceBox';
import HomeInServicReqBox from '../component/HomeComp/HomeInServicReqBox';
import HomeEvReqBox from '../component/HomeComp/HomeEvReqBox';
global.userdata = null;
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];
export default function Home({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const app = useSelector(state => state.app);
  // console.log('home app 1', app);

  const [selectedId, setSelectedId] = useState(null); 
  const [backPressCount, setBackPressCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const ride = useSelector(state => state.ride);
  const [isLoading, setIsLoading] = useState(false);
  const [loaderType, setLoaderType] = useState(null);
  const [Socpercentage, setSocpercentage] = useState(0);

  const [Visibility, SetVisibility] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefundConfirmModelOpen, setIsRefundConfirmModelOpen] =
    useState(false);
  const [isRefundSuccesModelOpen, setIsRefundSuccesModalOpen] = useState(false);
  const [socval, setsocval] = useState(0);
  const [selcolor, setselcolor] = useState(color.yellow);
  console.log('home ride', ride);

  useEffect(() => {
    StorageProvider.getItem('socpertage')
      .then(res => {
        setsocval(res ? parseFloat(res).toFixed(2) : 0);
        if (parseInt(res) < 20) {
          setselcolor(color.red);
        } else if (parseInt(res) > 20 && parseInt(res) < 70) {
          setselcolor(color.yellow);
        } else if (parseInt(res) > 70) {
          setselcolor(color.acceptGreenColor);
        }
      })
      .catch(() => {});
  });

  const capitalizeFirstCharacter = str => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        if (backPressCount === 0) {
          setBackPressCount(1 + backPressCount);
          setTimeout(() => setBackPressCount(0), 2000);
          ToastAndroid.show(t('exitApp'), ToastAndroid.SHORT);
        } else if (backPressCount === 1) {
          BackHandler.exitApp();
        }
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => subscription.remove();
    }, [backPressCount]),
  );

  let notificationMessageId;

  useEffect(() => {
    setupNotification();
    let socket = socketPro.getWSInstance();
    console.log('socket coonect home', socket);
    if (!socket) {
      socketPro.createWSConnections(app?.accessToken);
      addWebSocketMethods();
    } else {
      if (app?.driverDetail?.allottedVehicleDetail) {
        const message = {type: 'subscribeVehicleSOC'};
        socketPro.sendMessage(message);
      }
    }

    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getDriverAllocation());
      dispatch(getRideHistory());
      dispatch(getDriverEarning());
      dispatch(getDriverTodayEarning());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    createWebSocketConnection();
  }, [app?.driverAllocationStatus?.status]);

  const createWebSocketConnection = () => {
    let socket = socketPro.getWSInstance();
    console.log('socket coonect home', socket);
    if (app?.driverAllocationStatus?.status === 'accepting') {
      if (!socket) {
        socketPro.createWSConnections(app?.accessToken);
        addWebSocketMethods();
      }
    }
  };

  const addWebSocketMethods = () => {
    socketPro.register(
      event => onOpen(event),
      evt => onMessage(evt),
      evt => onClose(evt),
      err => onError(err),
    );
  };

  const onOpen = evt => {
    console.log('websocket CONNECTED');
    if (app?.driverDetail?.allottedVehicleDetail) {
      const message = {type: 'subscribeVehicleSOC'};
      socketPro.sendMessage(message);
    }
  };

  const onClose = evt => {
    console.log('websocket DISCONNECTED');
    dispatch(getDriverBookingStatus()).then(rideStatus => {
      if (rideStatus?.payload?.isRideExist) {
        socketPro.createWSConnections(app?.accessToken);
      }
    });
  };

  let showlowlevel = true;
  const onMessage = async evt => {
    console.log('websocket onMessage evt', evt);
    let jsonData = JSON.parse(new TextDecoder().decode(evt?.data));
    console.log('websocket onMessage jsonData', jsonData);
    console.log('ride status ddd', jsonData?.data?.rideStatus);

    if (jsonData?.type === 'vehicleLocation') {
      if (jsonData?.data?.rideStatus === 'cancelled') {
        dispatch(resetRideStates());
        // socketPro.closeWSConnection()
        dispatch(getDriverTodayEarning());
        resetStack('mapbox', navigation);

        return;
      }

      if (jsonData?.data?.location) {
        await StorageProvider.setObject(
          'vehicleLastLocation',
          jsonData?.data?.location,
        );
      }
    }
    if (jsonData?.type === 'rideCancelled') {
      dispatch(resetRideStates());
      // socketPro.closeWSConnection()
      dispatch(getDriverTodayEarning());
      resetStack('mapbox', navigation);
      return;
    }
    if (jsonData?.type === 'vehicleSOC') {
      setsocval(jsonData?.data?.batteryLevel);
      StorageProvider.saveItem('socpertage', jsonData?.data?.batteryLevel + '');
      if (jsonData?.data?.batteryLevel < 20) {
        if (showlowlevel === true) {
          showlowlevel = false;
          ToastAndroid.show(
            'Vehicle Battery is below 20% please visit nearest charging station',
            ToastAndroid.SHORT,
          );
        }
      }
      const socbattery = jsonData?.data?.batteryLevel;

      if (socbattery < 20) {
        setselcolor(color.red);
      } else if (socbattery > 20 && socbattery < 70) {
        setselcolor(color.yellow);
      } else if (socbattery > 70) {
        setselcolor(color.acceptGreenColor);
      }
    }
  };

  const onError = evt => {
    console.log('websocket onError', evt);
  };

  const setupNotification = () => {
    console.log('setupNotification');
    try {
      fcmService.register(
        token => onRegister(token),
        notify => onNotification(notify),
        notify => onOpenNotification(notify),
      );
      localNotificationService.configure(notify => {
        onOpenNotification(notify);
      });
    } catch (error) {
      console.log('error: sad' + error);
    }
  };

  const onNotification = async notify => {
    console.log('onNotificationSplash', notify);
    localNotificationService.cancelAllLocalNotifications();
    let uniquedNotifId = Math.floor(Math.random() * 1000 + 1);
    const options = {
      soundName: 'notify_ring.wav',
      playSound: true,
    };
    if (notify.title) {
      if (notificationMessageId != notify.messageId) {
        localNotificationService.showNotification(
          uniquedNotifId,
          notify.title,
          notify.message,
          notify,
          options,
        );
        notificationMessageId = notify.messageId;
      }
      // console.log("dummy noti",localNotificationService.removeDeliveredNotificationByID())
      if (notify?.data) {
        if (notify?.data?.notificationTopic == 'rideCancelled') {
          dispatch(resetRideStates());
          dispatch(getDriverTodayEarning());
        }

        if (
          notify?.data?.notificationTopic == 'vehicleReturn' ||
          notify?.data?.notificationTopic == 'rentalOrderPayment' ||
          notify?.data?.notificationTopic == 'rentalComplete'
        ) {
          getDriverProfile();
        }
      }
    }
  };

  let prev_requestId = '';
  const onOpenNotification = async notify => {
    console.log('notify', notify);
    console.log('---ride.rideDetails----', ride.rideDetails);
    if (notify?.data) {
      if (notify?.data?.notificationTopic == 'rideCancelled') {
        dispatch(resetRideStates());
        dispatch(getDriverTodayEarning());
      } else if (notify?.data?.notificationTopic == 'rideRequestDriver') {
        dispatch(getDriverRideStatus()).then(rideStatus => {
          if (!rideStatus?.payload?.isRideExist) {
            dispatch(getRideDetailsByRideID(notify?.data?.rideRequestId)).then(
              response => {
                console.log();
                let sorceDis = {
                  source: response?.payload?.source,
                  destination: response?.payload?.destination,
                };
                dispatch(distanceMatrix(sorceDis));
              },
            );
          }
        });
      } else if (notify?.data?.notificationTopic == 'vehicleAssigned') {
        navigation.navigate('WaytoOperationHub');
      }
    }
  };

  const onRegister = async token => {
    console.log('onRegister', token);
    addFcmToken(token);
  };
  const getRideDetailssssss = rideRequestId => {
    dispatch(getRideDetailsByRideID(rideRequestId)).then(response => {
      console.log();
      let sorceDis = {
        source: response?.payload?.source,
        destination: response?.payload?.destination,
      };
      dispatch(distanceMatrix(sorceDis));
    });
  };
  useEffect(() => {
    getUserProfileInfo1();
  }, []);

  const getUserProfileInfo1 = async () => {
    setIsLoading(true);
    dispatch(getUserProfile())
      .then(res => {
        console.log('getUserProfile', res.payload);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        ToastAndroid.show(t('errorOccured'), ToastAndroid.SHORT);
      });
  };

  const btnDutyStatus = async status => {
    StorageProvider.saveItem('ShowNonpassengerRide', 'false');
    if (status === 'OFF') {
      resetStack('mapbox', navigation);
      return false;
    }
    setIsFetching(true);
    dispatch(onDutyOffDuty(status))
      .then(response => {
        setIsFetching(false);
        if (response?.payload?.message == 'Success') {
          dispatch(getDriverAllocation());

          getLiveLocation();
          if (status == 'ON') {
            setTimeout(() => {
              resetStack('mapbox', navigation);
            }, 400);
          }
        }
      })
      .catch(error => {
        console.log('btnDutyStatus error', error);
        setIsFetching(false);
      });
  };

 

  const addFcmToken = async fcmToken => {
    StorageProvider.saveItem('fcmToken', fcmToken);
    let isNotificationAdded = await StorageProvider.getItem(
      'isNotificationAdded',
    );
    console.log('isNotificationAdded', isNotificationAdded);
    if (fcmToken && isNotificationAdded != 'true') {
      dispatch(setFCMToken({fcmToken: fcmToken}));
    }
  };

  useEffect(() => {
    getLiveLocation();
    // const interval = setInterval(() => {
    //   console.log('megha3')
    //   getLiveLocation();
    // }, 4000);
    // return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   // const subscription = AppState.addEventListener('change', handleAppStateChange);
  //   // return () => {
  //   //   subscription.remove();
  //   // };
  // }, []);

  let hadlebackgoundlocation = 0;

  const handleAppStateChange = async nextAppState => {
    console.log('APP STATE CHANGE HANDLED', nextAppState);
    if (nextAppState === 'active' && hadlebackgoundlocation == 0) {
      nextAppState == 'background'
        ? (hadlebackgoundlocation = 0)
        : (hadlebackgoundlocation = 1);
      getLiveLocation();
    }
  };

  const [isOpenLocationModal, setOpenLocationModal] = useState(false);
  useEffect(() => {
    // if (Platform.OS == 'android' && DeviceInfo.getApiLevelSync() >= 33) {
    //   notperm();
    // }
  }, []);

  const notperm = async () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION)
      .then(granted => {
        console.log(granted, '12345');
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('granted');
        } else {
          console.log('notgranted');
        }
        // return reject('Location Permission denied');
      })
      .catch(error => {
        console.log('Ask Location permission error: ', error);
        //return reject(error);
      });
  };

  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied == 'granted') {
      const {latitude, longitude, heading} = await getCurrentLocation();
      console.log('latitude longitude success', longitude, latitude);
      // addLatLong1(latitude, longitude);
    } else {
      console.log('isLocPermissionDenied  error');
    }
  };

  // const addLatLong1 = (latitude, longitude) => {
  //   let body = {latitude, longitude};
  //   console.log('app.driverAllocationStatus', app.driverAllocationStatus);
  //   if (app?.driverAllocationStatus?.status === 'accepting') {
  //     dispatch(appLatLong(body)).then(response1 => {
  //       console.log('add Lat Long success', response1);
  //     });
  //   }
  // };

  const Item = ({item, onPress, borderColor, backgroundColor, textColor}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[modalStyles.touchOpacity, backgroundColor, borderColor]}>
      <Text style={[modalStyles.title, textColor]}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const borderColor = item.id === selectedId ? '#10281C' : '#6F74F9';
    const backgroundColor = item.id === selectedId ? '#10281C' : '#10281C';
    const color = item.id === selectedId ? '#fff' : '#6F74F9';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        borderColor={{borderColor}}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  const onpressOpenSetting = () => {
    hadlebackgoundlocation = 0;
  };

  //========================================EV====================
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      getDriverProfile();
    }, []),
  );

  const getDriverProfile = async (callingType = '') => {
    if (callingType === 'pageRefresh') {
      setIsRefreshing(true);
    }
    dispatch(getDriverProfileInfo())
      .then(async res => {
        console.log('====================================');
        console.log('diver profile', res);
        console.log('====================================');
        setUserInfo(res?.payload);
        userdata = res?.payload;
        if (!res?.payload?.rentalOrderDetails) {
          setTimeout(() => {
            onDuty();
          }, 5000);
        }
        if (res?.payload?.rentalOrderDetails?.status === 'assigned') {
          navigation.navigate('WaytoOperationHub');
        }

        if (res?.payload?.allottedVehicleDetail) {
          const message = {type: 'subscribeVehicleSOC'};
          socketPro.sendMessage(message);
        }

        setIsRefreshing(false);
        setIsLoading(false);
        await StorageProvider.setObject('userInfo', res?.payload);
      })
      .catch(() => {
        setIsRefreshing(false);
        setIsLoading(false);
      });
  };

  const onDuty = () => {
    SetVisibility(true);
    setTimeout(() => {
      SetVisibility(false);
    }, 15000);
  };

  const btnRefundRequest = () => {
    setLoaderType('btnRefundRequest');
    dispatch(refundRequest(userInfo?.rentalOrderDetails?.id))
      .then(res => {
        console.log('btnRefundRequest result', res);
        setIsRefundConfirmModelOpen(false);
        setIsRefundSuccesModalOpen(true);
        getDriverProfile();
        setLoaderType(null);
      })
      .catch(error => {
        setLoaderType(null);
        console.log('btnRefundRequest error', error);
      });
  };

  const btnreassignEv = () => {
    setLoaderType('btnreassignEv');
    dispatch(reAssignEV(userInfo?.rentalOrderDetails?.id))
      .then(res => {
        console.log('btnreassignEv result', res);
        getDriverProfile();
        setLoaderType(null);
      })
      .catch(error => {
        setLoaderType(null);
        console.log('btnreassignEv error', error);
      });
  };

  // =====================================EV====================
  return (
    <SafeAreaView style={styles.container}>
      <LocationPermissionModal
        onpressOpenSetting={onpressOpenSetting}
        isOpenLocationModal={isOpenLocationModal}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              getDriverProfile('pageRefresh');
            }}
          />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.08}}
        scrollEnabled={true}>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor={color.black_BG}
        />
        <Loader visible={isLoading} />
        {/* header */}
        <View style={styles.topContainer}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Pressable
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <Image
                style={{
                  width: mobW * 0.18,
                  height: mobW * 0.18,
                }}
                source={require('../../Assests/image/blueBars.png')}
              />
            </Pressable>

            <View style={styles.topContainer_text}>
              <Text style={styles.innerText} numberOfLines={1}>
                {' '}
                {t('hello')}, {userInfo?.firstName}!
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  marginLeft: 5,
                  opacity: 0.7,
                  fontFamily: REGULAR,
                }}>
                {t('hometag')}...
              </Text>
            </View>
            <View style={{flex: 1,marginTop:15}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Notification');
                }}
                style={{
                  right: 10,
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                }}>
                <Image
                  style={{width: mobW * 0.12, height: mobW * 0.12}}
                  source={require('../../Assests/image/notification_white.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* end header */}

        {/* refund and return box */}
        { (userInfo?.rentalOrderDetails?.status === 'earlyReturned' ||
          userInfo?.rentalOrderDetails?.status === 'refundInitiated') && (
          <HomeInServicReqBox
            rentalOrderStatus={userInfo?.rentalOrderDetails?.status}
            requestVehicleButton={()=>btnreassignEv()}
            amountReturnButton={()=>setIsRefundConfirmModelOpen(true)}
            loaderType={loaderType}
          />
        )}
        {/* end refund and return box */}

        {userInfo?.rentalOrderDetails?.status == 'inService' && (
          <HomeInServiceBox/>
        )}

        {/* Not have rental order box */}
        { !userInfo?.rentalOrderDetails && (
        <HomeEvReqBox
          btnEvRequest={()=>navigation.navigate('Operationhub')}
        />
        )}
        {/*End Not have rental order box */}

        {/* rental order related box */}
        { (
          (userInfo?.rentalOrderDetails?.status == 'ordered' ||
          userInfo?.rentalOrderDetails?.status == 'reserved') &&
          <HomeInServicReqBox
            rentalPlanName={userInfo?.rentalOrderDetails?.rentalPlanName}
            rentalPlanAmount={userInfo?.rentalOrderDetails?.amount}
            rentalPlanStartDate={userInfo?.rentalOrderDetails?.startTime}
            rentalPlanEndDate={userInfo?.rentalOrderDetails?.endTime}
            rentalPlanStartTime={userInfo?.rentalOrderDetails?.startTime}
            rentalPlanEndTime={userInfo?.rentalOrderDetails?.endTime}
            rentalPlanStatus={userInfo?.rentalOrderDetails?.status}
          />
        )}
        {/*End  rental order related box */}

        {/* Earning and mytrip box */}
        {(userInfo?.rentalOrderDetails?.status === 'earlyReturned' ||
          userInfo?.rentalOrderDetails?.status === 'refundInitiated' ||
          userInfo?.rentalOrderDetails?.status === 'inService' ||
          !userInfo?.rentalOrderDetails) && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 16,
              marginTop: 20,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('MyTrips');
              }}
              style={styles.ThirdContainer_child}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:'space-between',
                  marginHorizontal:'10%',
                  alignItems: 'center'
                }}>
                   <Image
                    style={{
                      width: 44,
                      resizeMode: 'contain',
                      height: 44,
                      backgroundColor: '#001A0F',
                      borderRadius: 40,
                    }}
                    source={navigationImage}
                  />
                   <Image
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: '#001A0F',
                      borderRadius: 40,
                    }}
                    source={arrowRight}
                  />
              </View>
              <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '75%',
                    marginLeft: '10%',
                  }}>
                 
                  <Text
                    style={{
                      color: color.white,
                      fontSize: 12,
                      opacity: 0.7,
                      marginTop: 5,
                    }}>
                    {t('home_my_trip')}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: BOLD,
                      fontSize: 24,
                    }}>
                    {ride?.rideHistory?.totalCount
                      ? ride?.rideHistory?.totalCount
                      : 0}
                  </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('MyTrips');
              }}
              style={styles.ThirdContainer_child}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:'space-between',
                  marginHorizontal:'10%',
                  alignItems: 'center'
                }}>
                   <Image
                    style={{
                      width: 44,
                      resizeMode: 'contain',
                      height: 44,
                      backgroundColor: '#001A0F',
                      borderRadius: 40,
                    }}
                    source={rupee}
                  />
                   <Image
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: '#001A0F',
                      borderRadius: 40,
                    }}
                    source={arrowRight}
                  />
              </View>
              <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '75%',
                    marginLeft: '10%',
                  }}>
                 
                  <Text
                    style={{
                      color: color.white,
                      fontSize: 12,
                      opacity: 0.7,
                      marginTop: 5,
                    }}>
                 {t('home_my_earning')}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: BOLD,
                      fontSize: 24,
                    }}>
                     {'₹ '}
                    {ride?.driverTotalEarning == 0
                      ? '0'
                      : ride?.driverTotalEarning.toFixed(2)}
                  </Text>
                </View>
            </TouchableOpacity>
          </View>
        )}
        {/*End Earning and mytrip box */}

        {/* Vehicle box */}
        {userInfo?.allottedVehicleDetail &&
          userInfo?.rentalOrderDetails?.status == 'inService' && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('MyEV');
              }}
              style={{
                marginTop: 15,
                marginHorizontal: mobW*0.044,
                borderRadius: 10,
                borderColor: color.purpleborder,
                borderWidth: 1,
                backgroundColor: '#10281C',
                paddingVertical: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '25%'}}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                    source={auto}
                  />
                </View>
                <View style={{paddingLeft: 10, width: '60%'}}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: color.white_50,
                    }}>
                    {t('home_vehicleBOx_Vehicle_box')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      // fontWeight: 'bold',
                      color: 'white',
                    }}>
                    {formattedRegistrationNumber(
                      userInfo?.allottedVehicleDetail?.regNumber,
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    width: '15%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: '#001A0F',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      borderRadius: 40,
                      position: 'absolute',
                      right: 10,
                    }}
                    source={arrowRight}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        {userInfo?.allottedVehicleDetail &&
          userInfo?.rentalOrderDetails?.status == 'inService' && (
            <View
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 16,
                marginHorizontal: mobW*0.044,
                height: 80,
                borderRadius: 10,
                borderColor:color.purpleborder,
                borderWidth: 1,
                backgroundColor: '#10281C',
              }}>
              <View style={{flexDirection: 'row', marginLeft: 30}}>
                <View style={styles.sectionWrapper}>
                  <Pie
                    radius={25}
                    innerRadius={20}
                    sections={[
                      {
                        percentage: socval,
                        color: selcolor,
                      },
                    ]}
                    backgroundColor="#000000"
                  />

                  <View style={styles.gauge}>
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                      }}
                      source={require('../../Assests/image/car-battery.png')}
                    />
                  </View>
                </View>

                <View style={{marginLeft: 30}}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: color.white_50,
                    }}>
                    {t('home_vehicleBOx_Battery_Left')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      // fontWeight: 'bold',
                      color: 'white',
                    }}>
                    {socval}
                    {'%'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        {/*End Veehicle box */}

        {/* help and support box */}
        {
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Support');
            }}
            style={{
              marginVertical: 15,
              marginHorizontal: mobW*0.044,
              borderRadius: 10,
              borderColor: color.purpleborder,
              borderWidth: 1,
              backgroundColor: '#10281C',
              paddingVertical: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: '25%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    backgroundColor: color.black_BG,
                    height: 40,
                    width: 40,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    source={supportImage}
                  />
                </View>
              </View>
              <View style={{width: '60%', paddingLeft: 5}}>
                <Text
                  style={{
                    fontSize: 21,
                    color: 'white',
                  }}>
                  {' '}
                  {t('home_help_support')}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    // fontWeight: 'bold',
                    color: color.white_50,
                  }}>
                  {' '}
                  {t('home_click_here')}
                </Text>
              </View>
              <View
                style={{
                  width: '15%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#001A0F',
                    borderRadius: 40,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    position: 'absolute',
                    right: 10,
                  }}
                  source={arrowRight}
                />
              </View>
            </View>
          </TouchableOpacity>
        }
        {/*End help and support box */}
 
      </ScrollView>
      <AlertModal
        isSuccessAlert={false}
        loading={loaderType == 'btnRefundRequest' ? true : false}
        isVisible={isRefundConfirmModelOpen}
        alertMsg={`${t('home_Refund_generated')} ${
          userInfo?.rentalOrderDetails?.amount
            ? userInfo?.rentalOrderDetails?.amount
            : 0
        }. ${t('home_Refund_confirm')}`}
        alertTitle={t('home_Request_Refund')}
        yesButtonText={t('Yes')}
        noButtonText={t('No')}
        noButton={() => {
          setIsRefundConfirmModelOpen(false);
        }}
        yesButton={() => {
          btnRefundRequest();
        }}
      />
      <AlertModal
        isSuccessAlert={true}
        isVisible={isRefundSuccesModelOpen}
        alertMsg={t('home_Refund_confirm1')}
        alertTitle={t('home_Refund_confirm1_title')}
        yesButtonText={t('Yes')}
        yesButton={() => {
          setIsRefundSuccesModalOpen(false);
        }}
      />

      {userInfo?.rentalOrderDetails?.status === 'inService' ? (
        <View style={styles.bottomContainer}>
          <View
            style={{
              height: mobH * 0.08,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#10281C',
              justifyContent: 'center',
              paddingHorizontal: 30,
              borderTopEndRadius: 20,
              borderTopStartRadius: 20,
            }}>
            {app?.driverAllocationStatus?.status == 'accepting' ? (
              <CustomPressable
                text={t('OFF DUTY')}
                marginTop={0}
                btnWidth={200}
                backgroundColor="#CB0017"
                isGradient={false}
                route={'Verify'}
                isLoading={isFetching}
                onPress={() => {
                  btnDutyStatus('OFF');
                }}
                position={'relative'}
                bottom={0}
              />
            ) : (
              <CustomPressable
                text={t('ON DUTY')}
                marginTop={0}
                btnWidth={200}
                route={'Verify'}
                isLoading={isFetching}
                onPress={() => {
                  btnDutyStatus('ON');
                }}
                position={'relative'}
                bottom={0}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={styles.bottomContainer}>
          {Visibility ? (
            <View
              style={{
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity>
                <Image
                  style={{width: 300, height: 70, resizeMode: 'contain'}}
                  source={require('../../Assests/image/rentev.png')}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={{
              height: mobH * 0.08,
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
              borderTopEndRadius: 20,
              borderTopStartRadius: 20,
            }}>
            <CustomPressable
              text={t('ON DUTY')}
              marginTop={0}
              btnWidth={200}
              route={''}
              isGradient={false}
              backgroundColor="#10281C"
              onPress={() => {
                SetVisibility(true);
                setTimeout(() => {
                  SetVisibility(false);
                }, 5000);
              }}
              position={'relative'}
              bottom={0}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listTitle1: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 25,
    marginVertical: 10,
    color: color.white,
    paddingHorizontal: 20,
    fontSize: 14,
    fontFamily: REGULAR,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    right: 0,
    borderRadius: 10,
  },
  modalView: {
    position: 'absolute',
    width: '85%',
    backgroundColor: '#10281C',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: color.black_BG,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems:'center',
    marginVertical: 10,
    marginHorizontal: mobW*0.02,
    marginTop: mobH * 0.056,
  },
  topContainer_text: {
    display: 'flex',
    justifyContent: 'center',
  },
  innerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  SecondContainer: {
    backgroundColor: '#69A0F3',
    height: 160,
    borderRadius: 10,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
  },
  btn: {
    margin: 10,
    width: Dimensions.get('screen').width,
  },
  SecondContainerHeading: {
    fontSize: 22,
    color: 'white',
    marginStart: 20,
  },
  SecondContainerText: {
    fontSize: 14,
    width: 205,
    height: 35,
    color: 'white',
    marginStart: 20,
  },
  autoStyling: {
    width: 127.82,
    height: 122.2,
    position: 'absolute',
    bottom: 0,
    right: 10,
    marginEnd: 10,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 50,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginStart: 20,
    marginTop: 20,
  },
  StartBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#69A0F3',
    width: 200,
    height: 50,
  },
  ThirdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  ThirdContainer_child: {
    width: '47%',
    height: 130,
    borderRadius: 10,
    borderColor: color.purpleborder,
    borderWidth: 1,
    justifyContent: 'space-evenly',
    backgroundColor: '#10281C',
  },
  ForthContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    height: 80,
    borderRadius: 10,
    borderColor: color.purpleborder,
    borderWidth: 1,
    backgroundColor: '#10281C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  FifthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    height: 80,
    borderRadius: 10,
    borderColor: '#10281C',
    borderWidth: 2,
    backgroundColor: '#10281C',
  },
  sectionWrapper: {
    justifyContent: 'center',
    width: '25%',
    alignItems: 'center',
  },
  gauge: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const modalStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
    borderWidth: 1,
  },

  modal: {
    backgroundColor: '#10281C',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 80,
  },
  firstContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imgContainer: {
    backgroundColor: '#10281C',
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 20,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  secondContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  touchOpacity: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    margin: 10,
  },
  title: {
    fontSize: 20,
  },
});

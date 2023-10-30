import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  AppState,
  Text,
  DeviceEventEmitter,
  Linking,
  TouchableOpacity,ToastAndroid,
  Image,PermissionsAndroid,
  Platform,
} from 'react-native';
import {fcmService} from '../../FCM_notification/FCMService';
import {localNotificationService} from '../../FCM_notification/LocalNotificationService';
// import Loader from '../../rn-swipe-button/src/components/Loader/Loader';
import {resetStack} from '../../utils/commonFunction';
import Toast from 'react-native-toast-message';
import {color} from '../../utils/color';
import BottomSheetLayout from '../component/BottomSheetLayout';
import PushNotification from 'react-native-push-notification';
// import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import BottomSheet from 'react-native-simple-bottom-sheet';
import ArrivedStartTrip from '../component/ArrivedStartTrip';
import PickupDrop from '../AddNewTrip/PickupDrop';
import NewTrip from '../AddNewTrip/NewTrip';
import ArrivedStartTrip1 from '../component/ArrivedStartTrip1';
import NonPassengerride from '../component/NonPassengerride';
import TripStartOtpModal from '../component/TripStartOtpModal';
import StartTripNavigation from '../component/StartTripNavigation';
import EndTripNavigation from '../component/EndTripNavigation';
import MapplsGL from 'mappls-map-react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import MapPath from '../../locationManaget/MapPath';
import MapPathSource from '../../locationManaget/MapPathSource';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import MapContainer from '../component/MapContainer';
import FinalFare from '../component/FinalFare';
import PaymentSuccessModal from '../component/PaymentSuccessModal';
import RatingModal from '../component/RatingModal';
import {point} from '@turf/helpers';
import StorageProvider from '../../Session/StorageProvider';
import BackgroundTimer from 'react-native-background-timer';
import {
  arrivedTripApi,
  tripOtvVerify,
  startTripNavigation,
  endTripNavigation,
  endNONPassTripNavigation,
  ratePassenger,
  markPayment,
  openTriptOtpModal,
  closePaymentSuccesModal,
  getDriverTodayEarning,
  getRideDetailsByRideID,
  distanceMatrix,
  getDriverBookingStatus,
  setVehicleLocation,
  resetRideStates, 
  getDriverRideStatus,
} from '../../Redux/rideSlice';
import {useSelector, useDispatch} from 'react-redux';
import BottomSheets, {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {
  appLatLong,
  getDriverAllocation,
  onDutyOffDuty,setFCMToken
} from '../../Redux/appSlice';

import startIcon from '../../Assests/image/current_loc_pin.png';
import {
  getCurrentLocation,
  locationPermission,locationPermissionNotification,
  redirectToMap,
} from '../../utils/commonFunction';
import {useFocusEffect} from '@react-navigation/native';
import {TextDecoder, TextEncoder} from 'text-encoding';
import socketPro from '../../network/Socket';
import {
  checkPermission,
  hideFloatingBubble, 
  requestPermission, 
} from 'react-native-floating-bubble'; 
import Loader from '../customComp/Loader';
import { useTranslation } from 'react-i18next';

import DeviceInfo from 'react-native-device-info';
const layerStyles = {
  iconStartPosition: {
    iconImage: startIcon,
    iconAllowOverlap: true,
    iconSize: 0.4,
    iconAnchor: 'bottom',
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
};

global.vehicleLastLocation = null;
global.isEndDriveModalOpen = false;
global.liveLocationCo = {
  latitude: 28.5498,
  longitude: 77.2607,
};
const MapboxExample = ({navigation}) => {

  const {t} = useTranslation();
  
  const [errormesssage, seterrormesssage] = useState('');
  const [, updateState] = React.useState();
  const ride = useSelector(state => state.ride);
  const app = useSelector(state => state.app);
  const dispatch = useDispatch();
  const [bottomSheetIndex, setBottomSheetIndex] = useState(1);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [ispickupdrop, setispickupdrop] = useState(false);
  const [isnewtrip, setisnewtrip] = useState(false);
  // const [showlowlevel, setshowlowlevel] = useState(true);
  const [newtripdetails, setnewtripdetails] = useState({
    surceLoc: '',
    destinaLoc: '',
    destinapoints: {},
  });

  const [centerCordinates, setCenterCordinates] = useState([77.2607, 28.5498]);

  const [pathupdate, setpathupdate] = useState(false);
   
  const [Socpercentages, setSocpercentages] = useState({socdata:0});
  const [currentLatLog, setCurrentLatLong] = useState([75.8577, 22.7196]);
  const [isLoading, setIsLoading] = useState(false);
 
  const [showAddNewtripBtn, setshowAddNewtripBtn] = useState(true);

  let cameraRef = useRef(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['30%', '45%'], []);

  const onUpdate = (latitude, longitude) => {
    console.log(
      'current location== onUpdate',
      latitude.toFixed(2),
      longitude.toFixed(2),
    );
    console.log(
      'current location== liveLocationCo',
      liveLocationCo.latitude.toFixed(2),
      liveLocationCo.longitude.toFixed(2),
    );

    if (
      liveLocationCo?.latitude.toFixed(2) !== latitude.toFixed(2) &&
      liveLocationCo?.longitude.toFixed(2) !== longitude.toFixed(2)
    ) {
      let latJson = {latitude, longitude};
      liveLocationCo = latJson;
      console.log('current location== onUpdate inside if', liveLocationCo);
      if (cameraRef !== null) {
        console.log('camera ref');
        if (cameraRef.current) {
          cameraRef.current.moveTo([longitude, latitude]);
          cameraRef.current.zoomTo(15, 1000);
          setCurrentLatLong([longitude, latitude]);
          setCenterCordinates([longitude, latitude]);
        }
      }
    }
  };

  const setCenterCoOrdi = data => {
    setCenterCordinates(data);
    if (cameraRef !== null) {
      cameraRef.current.fitBounds(
        [
          ride?.rideDetails?.source.longitude,
          ride?.rideDetails?.source.latitude,
        ],
        [
          ride?.rideDetails?.destination.longitude,
          ride?.rideDetails?.destination.latitude,
        ],
        [50, 50, 255, 50],
        1000,
      );
    }
  };



  const btnDutyStatus = async status => {
    setIsLoading(true);
    dispatch(onDutyOffDuty(status))
      .then(response => {
        if (response?.payload?.message == 'Success') {
          dispatch(getDriverAllocation());
        }
        setTimeout(() => {
          console.log('btnDutyStatus success', response);
          setIsLoading(false);

          if (status == 'OFF') {
            if (navigation.canGoBack() === true) {
              navigation.goBack(null);
            } else {
              navigation.navigate('Home');
            }

            ///megha 30 june
            // let socket = socketPro.getWSInstance();
            // if (socket) {
            //   socketPro.closeWSConnection();
            // }
          }
        }, 1500);
      })
      .catch(error => {
        console.log('btnDutyStatus error', error);
        setIsLoading(false);
      });
  };

  const btnArrivedTripApi = () => {
    console.log('drivr ride ', ride);
    // return false
    dispatch(arrivedTripApi()).then(response => {
      if (response?.payload?.message == 'Success') {
        dispatch(getRideDetailsByRideID(ride?.rideDetails?.id)).then(
          response => {
            let sorceDis = {
              source: response?.payload?.source,
              destination: response?.payload?.destination,
            };
            dispatch(distanceMatrix(sorceDis));
          },
        );
      }
    });
  };

  const handleValueFromChild = (value1, val2, val3) => {
    setispickupdrop(false);
    const newvalue = {surceLoc: value1, destinaLoc: val2, destinapoints: val3};
  
    if(val3?.latitude)
    {
    setnewtripdetails(newvalue);
    setisnewtrip(true);
    }
  };

  const rateButton = rating => {
    dispatch(ratePassenger(rating)).then(response => {
      console.log('2222', response);
    });

    // dispatch(ratePassenger(rating,ride?.rideDetails?.id)).then(async () => {
    //   StorageProvider.saveItem('isInBetweenRide', 'no');
    // });
  };

  const btnTripOtvVerify = otp => {
    dispatch(tripOtvVerify(otp)).then(response => {
      if (response?.payload?.message == 'Success') {
        dispatch(getRideDetailsByRideID(ride?.rideDetails?.id)).then(
          response => {
            let sorceDis = {
              source: response?.payload?.source,
              destination: response?.payload?.destination,
            };
            dispatch(distanceMatrix(sorceDis));
          },
        );
      } else {
        seterrormesssage(response?.error?.message)
      }
    });
  };


  const btnEndTripNavigation = async () => {
    setshowAddNewtripBtn(true);

    const message = {
      type: 'vehicleLocation',
      data: {
        rideRequestId: ride?.rideDetails?.id,
      },
    };
    socketPro.sendMessage(message);

    let lastLocation = await StorageProvider.getObject('vehicleLastLocation');
    let body;

    if (lastLocation != null) {
      body = lastLocation;
    } else {
      body = {
        latitude: liveLocationCo?.latitude,
        longitude: liveLocationCo?.longitude,
      };
    }

    setTimeout(() => {
      dispatch(
        ride?.rideDetails?.passenger
          ? endTripNavigation(body)
          : endNONPassTripNavigation(body),
      ).then(response => {
        if (response?.payload?.totalDue || response?.payload?.totalDue == 0) {
          console.log(
            'ride?.rideRequestIdride?.rideRequestId',
            ride?.rideRequestId,
          );

          dispatch(getRideDetailsByRideID(ride?.rideDetails?.id)).then(
            response => {
              let sorceDis = {
                source: response?.payload?.source,
                destination: response?.payload?.destination,
              };
              dispatch(distanceMatrix(sorceDis));
            },
          );
        }
      });
    }, 400);
  };

  const startTripNavigation1 = () => {
    checkPermission()
      .then(value => {
        console.log('Permission received', value);
        if (!value) {
          takePermissionForOverTheApp();
        } else {
          onInit();
          setshowAddNewtripBtn(false);
          let sorceDis = {
            source: ride?.rideDetails?.source,
            destination: ride?.rideDetails?.destination,
          };
          dispatch(startTripNavigation(sorceDis));
          setTimeout(() => {
            redirectToMap(
              ride?.rideDetails?.source?.latitude,
              ride?.rideDetails?.source?.longitude,
              ride?.rideDetails?.destination?.latitude,
              ride?.rideDetails?.destination?.longitude,
            );
          }, 400);
        }
      })
      .catch(() => {
        takePermissionForOverTheApp();
      });
  };

  const forceUpdate = React.useCallback(() => updateState({}), []);

  const setfirstloc = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied == 'granted') {
      const {latitude, longitude, heading} = await getCurrentLocation();
      setCenterCordinates([longitude, latitude]);
      setpathupdate(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setpathupdate(false);
      setfirstloc();
      dispatch(getDriverTodayEarning());
      getLiveLocation();
      const interval = setInterval(() => {
        getLiveLocation();
      }, 4000);
      return () => clearInterval(interval);
    }, []),
  );


  useEffect(() => {
    setupNotification();
  }, []);

  useEffect(() => {
    // if (Platform.OS == 'android' && DeviceInfo.getApiLevelSync() >= 33) {
    //     notperm();
    // }
  }, []);


  useEffect(() => {
    if (Platform.OS == 'android') {
     
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then((granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("granted ACCESS_COARSE_LOCATION");
          }else{
            console.log("notgranted");
          }
         
      }).catch((error) => {
          console.log('Ask Location permission error: ', error);
         
      });
    }
   
  }, []);


  
 const notperm = async() =>
 {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION,
  ).then((granted) => {
    console.log(granted ,"12345")
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("granted");
      }else{
        console.log("notgranted");
      }
      // return reject('Location Permission denied');
  }).catch((error) => {
      console.log('Ask Location permission error: ', error);
      //return reject(error);
  });
 }


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

  let notificationMessageId;
  
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

        if (notify?.data?.notificationTopic == 'vehicleReturn' || notify?.data?.notificationTopic == 'rentalOrderPayment' || notify?.data?.notificationTopic == 'rentalComplete')  {
          getDriverProfile();
        } 
      }
    }
  };

  let prev_requestId = '';
  
  const onOpenNotification = async notify => {
  
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


  
  useFocusEffect(
    useCallback(() => {
      const interval1 = setInterval(() => {
        dispatch(onDutyOffDuty('ON'))
        .then(response => {
          if (response?.payload?.message == 'Success') {
            dispatch(getDriverAllocation());
          }
        })
        .catch(error => {
          console.log('btnDutyStatus error', error);
        });
  
      }, 300000);
      return () => clearInterval(interval1);
     
    }, []),
  );


  const getLiveLocation = async () => {
    setIsLoadingMap(false);
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied == 'granted') {
      const {latitude, longitude, heading} = await getCurrentLocation();
      onUpdate(latitude, longitude);
      console.log('latitude longitude success', longitude, latitude);
      addLatLong1(latitude, longitude);
    } else {
      console.log('isLocPermissionDenied  error');
    }
  };

  const addLatLong1 = (latitude, longitude) => {

    console.log("addLatLong1 Api call");
    console.log("addLatLong1 Api call driverAllocationStatu",app?.driverAllocationStatus?.status);
    let body = {latitude, longitude};
    setCurrentLatLong([longitude, latitude]);
    console.log('app.driverAllocationStatus', app.driverAllocationStatus);

    if (app?.driverAllocationStatus?.status === 'accepting') {
      dispatch(appLatLong(body)).then(response1 => {
        console.log('add Lat Long success', response1);
      });
    }
  };


  useFocusEffect(
    useCallback(() => {
      if (app?.driverDetail?.allottedVehicleDetail) {
        let socket = socketPro.getWSInstance();
        if (!socket) {
          socketPro.createWSConnections(app?.accessToken);
          addWebSocketMethods();
        } else {
          const message = {type: 'subscribeVehicleSOC'};
          socketPro.sendMessage(message);
        }
      }  
      
    }, []),
  );
 
  useEffect(() => {
    StorageProvider.setObject('vehicleLastLocation', null);
    const interval = BackgroundTimer.setInterval(() => {
      let socket = socketPro.getWSInstance();
      console.log('web socket coonect home socket', socket);
      dispatch(getDriverBookingStatus())
        .then(rideStatus => {
          if (rideStatus?.payload?.isRideExist) {
            const message = {
              type: 'vehicleLocation',
              data: {
                rideRequestId: rideStatus?.payload?.rideDetails?.id,
              },
            };

            if (!socket) {
              socketPro.createWSConnections(app?.accessToken);
              addWebSocketMethods();
              setTimeout(() => {
                socketPro.sendMessage(message);
              }, 400);
            } else {
              socketPro.sendMessage(message);
            }
          }
        })
        .catch(error => {
          console.log('websocket hello rideStatus', error);
        });
    }, 4000);
    return () => BackgroundTimer.clearInterval(interval);
  }, []);

  const btnSendSocketMessage = () => {
    console.log('websocket btnSendSocketMessage', btnSendSocketMessage);
    let message = {
      type: 'routeNavigation',
      data: {
        routes: [
          {
            legs: [
              {
                steps: [
                  {
                    weight: 29.2,
                    distance: 124.6,
                    duration: 19.5,
                    geometry: '}jgmDkqrvMBZBl@Bb@FhAFbA',
                    intersections: [
                      {
                        location: [77.268862, 28.551034],
                        classes: null,
                        bearings: [260],
                        entry: [true],
                        in: 0,
                        out: 0,
                        lanes: null,
                      },
                    ],
                    DrivingSide: '',
                    name: '',
                    mode: 'driving',
                    maneuver: {
                      location: [77.268862, 28.551034],
                      bearingBefore: 0,
                      bearingAfter: 0,
                      modifier: 'left',
                      type: 'depart',
                    },
                  },
                ],
                summary: 'Grand Trunk Road, OD 110466',
                weight: 7247.5,
                distance: 120703.1,
                duration: 8633.6,
              },
            ],
            weightName: '',
            geometry:
              '}jgmDkqrvMsZhJrc@|Xao@ef@k~AldAil@{u@slB|`AwzBcaEg~Ai|GJgoHmv@q|Dbk@}tGagE_yCmcBqaDel@qeD~hDdNpbK_kBtsEywBx{C_{DpvC_W~tIybN}\\gnB|NkkA``Cg`B`zCqjPdtF_lAjgA}_AlpNmuB|z@wqCr|@ar@|lCjg@cIgpEukCoiFcUmyBzzAaqBbTta@',
            weight: 7247.5,
            distance: 120703.1,
            duration: 8633.6,
          },
        ],
        waypoints: [
          {
            hint: 'ZUfPgpRHz4ITAAAAGwAAAIYAAADRAAAAZBsnQeIOXUEjy41CmdLdQgcAAAALAAAAMwAAAKIAAAD1AAAAfgebBHqnswHAB5sEPKazAQYAPxC8sh7J',
            name: '',
            distance: 35.828882,
            location: [77.268862, 28.551034],
          },
          {
            hint: 'JBMSgSYTEoEFAAAAHQAAAHMAAAAAAAAAfwpQQOhDeEF3cH9CAAAAAAUAAAAdAAAAcwAAAAAAAAD1AAAAn_ClBMgmrwHA8KUEoCavAQEAbwO8sh7J',
            name: '',
            distance: 5.489303,
            location: [77.983903, 28.255944],
          },
        ],
        code: 'Ok',
        Server: 'DE-5102',
      },
    };

    let socket = socketPro.getWSInstance();
    if (socket) {
      socketPro.sendMessage(message);
    } else {
      dispatch(getDriverBookingStatus()).then(rideStatus => {
        if (rideStatus?.payload?.isRideExist) {
          socketPro.createWSConnections(app?.accessToken);
          socketPro.sendMessage(message);
        }
      });
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
    console.log('websocket onMessage jsonData mapbox', jsonData);
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
      console.log("soc percentage mapbox",jsonData?.data?.batteryLevel)

      StorageProvider.saveItem('socpertage',jsonData?.data?.batteryLevel + "");

      if(jsonData?.data?.batteryLevel < 20)
      {
        if(showlowlevel === true){
          showlowlevel = false;
          ToastAndroid.show(t('mapbox_low_charging'), ToastAndroid.SHORT);
        }
     }
    }
  };

  const onError = evt => {
    console.log('websocket onError', evt);
  };

  const onInit = type => {
    
  }; 


  useEffect(() => {
    const subscriptionPress = DeviceEventEmitter.addListener(
      'floating-bubble-press',
      function (e) {
        console.log('AppState.currentState', AppState.currentState);
        if (AppState.currentState == 'active') {
          redirectToMap(
            ride?.rideDetails?.source?.latitude,
            ride?.rideDetails?.source?.longitude,
            ride?.rideDetails?.destination?.latitude,
            ride?.rideDetails?.destination?.longitude,
          );
        }
        if (AppState.currentState == 'background') {
          Linking.openURL('driverapp://mapbox');
        }
      },
    );
    const subscriptionRemove = DeviceEventEmitter.addListener(
      'floating-bubble-remove',
      function (e) {
        console.log('floating-bubble Remove Bubble');
        isEndDriveModalOpen = false;
      },
    );
    return () => {
      subscriptionPress.remove();
      subscriptionRemove.remove();
    };
  }, []);

  // check bubble permissions============================================
  const takePermissionForOverTheApp = () => {
   
  };

  const getAlertBooking = (id) => {
    console.log('drivr ride ', id);
  // return false
    dispatch(getRideDetailsByRideID(id)).then(
      response => {
       console.log('===ride details===', response);
      }).catch((err)=>{
        console.log('===ride details error===', response);
      });
    
};
  return (
    <MapContainer navigation={navigation}>
      <Loader visible={isLoadingMap} />
      {
        <MapplsGL.MapView
          animated={'trans'}
          animationMode="moveTo"
          tintColor="#001A0F"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 0.8,
          }}
          mapplsStyle={'standard_night'}
          didLoadedMapmyIndiaMapsStyles={data => {
            color: '#001A0F';
          }}>
          <MapplsGL.Camera
            style={{backgroundColor: '#001A0F'}}
            animationMode="moveTo"
            ref={cameraRef}
            minZoomLevel={4}
            maxZoomLevel={100}
            zoomLevel={12}
            centerCoordinate={centerCordinates}
          />

          <MapplsGL.ShapeSource id="origin1" shape={point(currentLatLog)}>
            <MapplsGL.SymbolLayer
              id="originSymbolLocationSymbols"
              style={layerStyles.iconStartPosition}
            />
          </MapplsGL.ShapeSource>
          
          {ride?.isShowPath && pathupdate && (
            <MapPath
              showpath={pathupdate}
              destination={`${ride?.rideDetails?.destination.longitude},${ride?.rideDetails?.destination.latitude}`}
              source={`${centerCordinates[0]},${centerCordinates[1]}`}
              setCenterCordinates={setCenterCoOrdi}
              centerCordinates={`${centerCordinates[0]},${centerCordinates[1]}`}
              centerNoString={[centerCordinates[0], centerCordinates[1]]}
            />
          )}
          {ride?.isSourcePath && pathupdate && (
            <MapPathSource
              destination={`${ride?.rideDetails?.source.longitude},${ride?.rideDetails?.source.latitude}`}
              source={`${centerCordinates[0]},${centerCordinates[1]}`}
              setCenterCordinates={setCenterCoOrdi}
              showpath={pathupdate}
              centerCordinates={`${centerCordinates[0]},${centerCordinates[1]}`}
              centerNoString={[centerCordinates[0], centerCordinates[1]]}
            />
          )}
        </MapplsGL.MapView>
      }

      {showAddNewtripBtn && !ride.isTripEnded ? (
        <TouchableOpacity
          onPress={() => {
            setispickupdrop(true);
          }}
          style={{
            height: 48,
            position: 'absolute',
            bottom: 220,
            backgroundColor: '#10281C',
            width: 160,
            marginHorizontal: 20,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Image
            source={require('../../Assests/image/plus.png')}
            style={{height: 15, width: 15, marginLeft: 5}}
          />
          <Text
            style={{
              color: '#ffffff',
              fontSize: 16,
              marginHorizontal: 10,
              fontWeight: '800',
              fontFamily: BOLD,
            }}>
            {t('mapbox_Add_New_Trip')}
          </Text>
        </TouchableOpacity>
      ) : null}

      {ride?.IsnewNonPassRide && (
        <NonPassengerride
          rideDetails={ride?.rideDetails}
          isnonpassengerride={ride.IsnewNonPassRide}
        />
      )}

      {/* Payment page */}
      <FinalFare
        rideDetails={ride?.rideDetails}
        totalFare={
          ride?.rideDetails.finalFare ? ride?.rideDetails.finalFare : 0
        }
        showFinalFare={ride.isShowFinalFare}
        onSwipeSuccess={() => {
          dispatch(markPayment());
        }}
      />

      {/*============== end trip navigation ========== */}

      {ride.isTripEnded && (
        <BottomSheets
          index={bottomSheetIndex}
          backgroundStyle={{backgroundColor: '#10281C'}}
          handleIndicatorStyle={{
            width: 135,
            borderRadius: 5,
            backgroundColor: color.black_BG,
          }}
          style={{backgroundColor: '#10281C'}}
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}>
          <EndTripNavigation
            navigation={navigation}
            rideDetails={ride?.rideDetails}
            onEndTripPressed={() => {
              btnEndTripNavigation();
            }}
            isTripEnded={ride.isTripEnded}
          />
        </BottomSheets>
      )}

      {/*============== on duty off duty modal ========== */}
       {!ride.startTripModal && !ride.isTripEnded && !ride.arrivedStartTrip1 ? (
        <BottomSheet
          isOpen={showAddNewtripBtn}
          sliderMinHeight={60}
          onOpen={() => {
            setshowAddNewtripBtn(true);
          }}
          onClose={() => {
            setshowAddNewtripBtn(false);
          }}
          wrapperStyle={{backgroundColor: '#10281C', paddingBottom: 10}}
          lineStyle={{backgroundColor: '#10281C'}}>
          <BottomSheetLayout
            isLoading={isLoading}
            percentage={Socpercentages}
            status={app?.driverAllocationStatus?.status}
            onOffDutyPressed={() => {
              app?.driverAllocationStatus?.status == 'accepting'
                ? btnDutyStatus('OFF')
                : btnDutyStatus('ON');
            }}
          />
        </BottomSheet>
      ) : null}     

      {/*Payment success modal modal */}
      <PaymentSuccessModal
        totalFare={ride?.rideDetails.finalFare}
        rideDetails={ride?.rideDetails}
        isPaymentDone={ride.isPaymentDone}
        onClosePaymentSuccess={() => {
          ride?.rideDetails.passenger
            ? null
            : StorageProvider.saveItem('isInBetweenRide', 'no');
          dispatch(closePaymentSuccesModal());
          dispatch(getDriverTodayEarning());
          resetStack('mapbox', navigation);
          setIsLoadingMap(true);
        }}
      />
      {/*Payment success modal modal */}

      <RatingModal
        rideDetails={ride.rideDetails}
        isRatingModalOpen={ride.isRatingModalOpen}
        onRatingModalOpenClose={rating => {
          rateButton(rating);
        }}
      />

      {/*STEP:3 After Cliking on Arrived-Start-Trip, Driver need to Enter the OTP from the passenger */}
      <TripStartOtpModal
        rideDetails={ride?.rideDetails}
        errorMess={errormesssage}
        isTripArrivedForOtp={ride.isStartTripOtpRequest}
        onStartNowPressed={otp => {
          btnTripOtvVerify(otp);
        }}
        onchnage={otp => {
          seterrormesssage('');
        }}
      />

      {/* STEP:2 After Accepting Booking Request, Driver will got the options to call/Message/Cancel trip and can Start the trip */}

      {ride.startTripModal && (
        <BottomSheet
          isOpen={true}
          sliderMinHeight={280}
          onOpen={() => {
            setshowAddNewtripBtn(true);
          }}
          onClose={() => {
            setshowAddNewtripBtn(false);
          }}
          wrapperStyle={{
            backgroundColor: '#10281C',
            paddingBottom: 20,
            zIndex: 999,
          }}
          lineStyle={{backgroundColor: '#10281C'}}>
          <ArrivedStartTrip
            rideDetails={ride.rideDetails}
            navigation={navigation}
            onArrivedStartTripPressed={() => {
              btnArrivedTripApi();
            }}
            isStartTrip={ride.startTripModal}
          />
        </BottomSheet>
      )}

      {/* STEP:3================== */}
      {/* <ArrivedStartTrip1
        rideDetails={ride.rideDetails}
        navigation={navigation}
        onArrivedStartTripPressed={() => {
          dispatch(openTriptOtpModal());
        }}
        isStartTrip={ride.arrivedStartTrip1}
      /> */}

      {ride.arrivedStartTrip1 && (
        <BottomSheet
          isOpen={true}
          sliderMinHeight={280}
          onOpen={() => {
            setshowAddNewtripBtn(true);
          }}
          onClose={() => {
            setshowAddNewtripBtn(false);
          }}
          wrapperStyle={{
            backgroundColor: '#10281C',
            paddingBottom: 20,
            zIndex: 999,
          }}
          lineStyle={{backgroundColor: '#10281C'}}>
          <ArrivedStartTrip1
            rideDetails={ride.rideDetails}
            navigation={navigation}
            onArrivedStartTripPressed={() => {
              dispatch(openTriptOtpModal());
            }}
            isStartTrip={ride.arrivedStartTrip1}
          />
        </BottomSheet>
      )}

      {/* STEP:4 Start Trip Navigation... */}
      <StartTripNavigation
        rideDetails={ride?.rideDetails}
        onStartTripNavigation={() => {
          startTripNavigation1();
        }}
        isnonpassngerTrip={ride.IsnewNonPassRide}
        isTripStarted={ride.isTripStarted}
      />
      <PickupDrop
        ispickupdrop={ispickupdrop}
        onClose={() => {
          setispickupdrop(false);
        }}
        Onsuccess={handleValueFromChild}
        currentlocpoint={centerCordinates}
      />

      <NewTrip
        isnewtrip={isnewtrip}
        onClose={() => {
          setisnewtrip(false);
        }}
        Onsuccess={() => {
          setisnewtrip(false);
        }}
        currentlocpoint={centerCordinates}
        details={newtripdetails}
      />
    </MapContainer>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: color.black_BG,
  },
  container: {
    // height: "100%",
    width: '100%',
    backgroundColor: color.black_BG,
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    width: 60,
    backgroundColor: 'transparent',
    height: 70,
  },
  map: {
    flex: 1,
  },
  textContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 2,
    paddingVertical: 5,
    flex: 1,
    color: '#fff',
    backgroundColor: '#10281C',
    fontWeight: 'bold',
  },
  icon: {
    paddingTop: 10,
  },

  toggleTouchableContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    backgroundColor: '#6E7CFA',
    borderRadius: 10,
  },
});

export default MapboxExample;

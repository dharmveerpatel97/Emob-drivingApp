import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  ImageBackground,
  PermissionsAndroid,
  StatusBar,
  Alert,
  DeviceEventEmitter,
  AppState,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import React, {useEffect} from 'react';
import StorageProvider from '../../Session/StorageProvider';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {locationPermission, mobH, mobW, resetStack} from '../../utils/commonFunction';
import i18n from '../../language/i18n';
import {
  setToken,
  setLanguage,
  getDriverAllocation,
  getDriverProfileInfo,
} from '../../Redux/appSlice';
import {useDispatch, useSelector} from 'react-redux';
import {
  showFloatingBubble,
  hideFloatingBubble,
  requestPermission,
  checkPermission,
  initialize,
} from 'react-native-floating-bubble';
import {useRef} from 'react';
import {useState} from 'react';
import LocationPermissionModal from '../component/LocationPermissionModal';
import {
  distanceMatrix,
  getDriverRideStatus,
  openArrivedStartTrip1,
  openPaymentModal,
  openStartnavigationModal,openNonpassengerNavigationModel,
  setStartTripModalTrue,
  getDriverEarning,
  getDriverTodayEarning
} from '../../Redux/rideSlice';
import { color } from '../../utils/color';

global.navigateRouteName = 'Home';
const Splash = ({navigation, props}) => {
  const app = useSelector(state => state.app);
  console.log('app', app);
  const dispatch = useDispatch();
  const [isOpenLocationModal, setisOpenLocationModal] = useState(false);

  const checkOverTheAppPermission = () => {
    checkPermission()
      .then(value => {
        console.log('Permission received', value);
        if (!value) {
          takePermissionForOverTheApp();
        }
      })
      .catch(() => {
        takePermissionForOverTheApp();
      });
  };

  useEffect(() => {
    // if (Platform.OS == 'android' && DeviceInfo.getApiLevelSync() >= 33) {
    //     notperm();
    // }
  }, []);


 const notperm = async() =>{
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


  const takePermissionForOverTheApp = () => {
    Alert.alert(
      'Permission require?',
      'The app want to access the over the app permissions',
      [
        {
          text: 'NO',
        },
        {
          text: 'YES',
          onPress: () => {
            openSeetingForOverTheApp();
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const openSeetingForOverTheApp = () => {
    requestPermission()
      .then(() => console.log('Permission received'))
      .catch(() => console.log('Failed to get permission'));
  };
  
  useEffect(() => {
    StorageProvider.removeItem('isNotificationAdded');
    StorageProvider.getItem('language').then(res => {
      i18n.changeLanguage(res);
    });
    StorageProvider.getObject('accessToken')
      .then(res => {
        console.log('accessToken', res);
        if (res) {
          dispatch(setToken(res.accesstoken));
          setTimeout(() => {
            dispatch(getDriverAllocation());
          }, 1000);
        }
        setTimeout(() => {
          if (res) {
            getUserProfileInfo(res);
          } else {
            navigation.navigate('Choose Language');
          }
        }, 1500);
      })
      .catch(error => {
        navigation.navigate('Choose Language');
      });
  }, []);

  const getUserProfileInfo = async auth => {
    const language = await StorageProvider.getItem('language');
    await StorageProvider.saveItem('isInBetweenRide', 'no');
    dispatch(getDriverProfileInfo())
      .then(res => { 
        let response = res?.payload
        if(response){
            StorageProvider.saveItem('RentalId',response?.rentalOrderDetails? response?.rentalOrderDetails?.id :"");
          if (response?.message == 'unable to process the request') {
            navigation.navigate('signup', {value: '+918817046783'});
          } else {
            if (response?.drivingLicence && response?.policeVerification) {
              if (
                response?.drivingLicence?.status === 'verified' &&
                response?.policeVerification?.status == 'verified'
              ) {
                checkRideStatus(auth);
              } else {
                resetStack('UnverifiedDrawer', navigation);
              }
            } else {
              navigation.navigate('KYC Documents');
            }
          }
        } else {
          navigation.navigate('Choose Language');
        }
      })
      .catch(error => {
        navigation.navigate('Choose Language');
      });
  };


  const checkRideStatus = res => {
    dispatch(getDriverEarning());
    dispatch(getDriverTodayEarning());
    dispatch(getDriverRideStatus())
      .then(response => {
        console.log('getDriverRideStatus response', response);
        if (response?.payload?.isRideExist) {
          let sorceDis = {
            source: response?.payload?.rideDetails?.source,
            destination: response?.payload?.rideDetails.destination,
          };
          dispatch(distanceMatrix(sorceDis))
            .then(() => { 
              switch (response?.payload?.rideDetails?.status) {
                 case 'assigned':
                  {
                    dispatch(setStartTripModalTrue());
                  }
                  break;
                case 'arrived':
                  {
                    dispatch(openArrivedStartTrip1());
                  }
                  break;
                case 'in_progress':
                  {
                    {
                      response?.payload?.rideDetails?.passenger ?  dispatch(openStartnavigationModal()) 
                          : dispatch(openNonpassengerNavigationModel());
                    }
                  }
                  break;
                case 'ended_and_unpaid':
                  {
                    dispatch(openPaymentModal());
                  }
                  break;
                case 'completed':
                  {
                    resetStack('Home', navigation);
                  }
                  break;
                default:
                  resetStack('Home', navigation);
              }
              navigateRouteName = 'mapbox';
              resetStack('Home', navigation);
            })
            .catch(error => {
              console.log('distanceMatrix error', error);
            });
        } else {
          resetStack('Home', navigation);
         // navigationSwitch();
        }
      })
      .catch(err => {
        resetStack('Home', navigation);
        console.log('getDriverRideStatus error', err);
      });
  };
  

  const navigationSwitch=()=>{
    dispatch(getDriverAllocation()).then((res)=>{
      if(res.payload.status==='accepting'){
        navigateRouteName = 'mapbox';
        resetStack('Home', navigation);
      }else{
        resetStack('Home', navigation);
      }
    }).catch(err => {
      resetStack('Home', navigation);
    })
  }
 
  return (
    <SafeAreaView
      style={{
        backgroundColor: color.black_BG,
        alignItems: 'center',
        flex: 1,
      }}>
      <LocationPermissionModal isOpenLocationModal={isOpenLocationModal} />
      <View style={styles.topContainer}>
        <Image
          source={require('../../Assests/image/Otp/delhimetro/delhimetro.png')}
          style={styles.logo}
        />
      </View>

      <View style={{position: 'absolute',width:'100%',height:80,bottom: 80}}>
        <Image
          style={styles.autoImage}
          source={require('../../Assests/image/logo_prod.png')}
        />
     </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  splash_heading_container: {
    color: 'white',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    width: Dimensions.get('screen').width,
    height: '50%',
    justifyContent: 'flex-end',marginTop:40,
    alignItems: 'center',
  },
  logo: {
    justifyContent: 'center',
    marginTop: 30,
    width: '50%',resizeMode:'contain',
    height: 98,
  },
  mainHeading: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textpart: {
    color: 'white',
    fontSize: 18,
    textAlign: 'justify',
    paddingTop: 10,
    lineHeight: 30,
    paddingHorizontal: 30,
  },
  bottomContainer: {
    position: 'absolute',
    marginTop: 5,
    bottom: 5,
    height: '60%',
    justifyContent: 'flex-end',
  },
  autoImage: {
     width: '50%',
    height: 50,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});

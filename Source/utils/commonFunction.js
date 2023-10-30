import {CommonActions} from '@react-navigation/native';
import moment from 'moment';
import { Dimensions, Linking,PermissionsAndroid, Platform  } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import RazorpayCheckout from 'react-native-razorpay';
export const mobH = Dimensions.get('screen').height;
export const mobW = Dimensions.get('screen').width;

export function resetStack(routeName, navigation, params) {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: routeName}],
    }),
  );
}


export const isValidPhoneNumber = (number) => {
  const reg = /^[0]?[789]\d{9}$/;
  if (reg.test(number) === false) {
    return false; 
  }
  else
  {
    return true;
  }
};


export const getDateFormat = (date, format) => {
  let formated_date = '';
  if (format == 'DD-MM-YYYY') {
    formated_date = (
      (date.getDate().toString().length <= 1
        ? '0' + date.getDate()
        : date.getDate()) +
      '-' +
      ((date.getMonth() + 1).toString().length <= 1
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      date.getFullYear()
    ).toString();
  } else if (format == 'YYYY-MM-DD') {
    formated_date = (
      date.getFullYear() +
      '-' +
      ((date.getMonth() + 1).toString().length <= 1
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      (date.getDate().toString().length <= 1
        ? '0' + date.getDate()
        : date.getDate())
    ).toString();
  }
  return formated_date;
};

export const redirectToMap = (sourceLat,sourceLong,destinationLat,destinationLong)=>{
// const url = `https://www.google.com/maps/dir/?api=1&origin=${sourceLat},${sourceLong}&destination=${destinationLat},${destinationLong}`;
const url = `https://www.google.com/maps/dir/?api=1&origin=&destination=${destinationLat},${destinationLong}`;
Linking.openURL(url);
}

export const getPriceWithSymbol=(price)=>{
  return `₹ ${price.toFixed(2)}`
}
export const getDistanceInKm=(distance)=>{
  let dis = 0

  if(distance){
    dis = (distance/1000).toFixed(2);
  }
  return `${dis} km`
}

export const formattedRegistrationNumber = (str) => {
    if(str)
    {
      return  `${str.slice(0, 2)} ${str.slice(2, 4)} ${str.slice(4, 6)} ${str.slice(6)}`;
    }
    else
    return str
}


export const formatDate=(timestamp, format)=>{
  
  if(timestamp.toString().length > 10)
  {
    const date = new Date(timestamp);
    return moment(date).format(format);
  }
  else
  {
  const date = new Date(timestamp * 1000);
  return moment(date).format(format);
  }
}

export const getTimeInMin=(time)=>{
  let timeInMeter =  0;
  if(time){
    timeInMeter = (time / 60).toFixed(3)
  }
  return `${timeInMeter} Min`
}

export const startPayment = (Payamount,desc) => {
  const options = {
    key: 'YOUR_RAZORPAY_API_KEY',
    amount: Payamount * 100,
    name: 'Payment',
    description: desc,
    image: 'https://your-image-url.png',
    handler: (response) => {
      console.log('Payment Success:', response);
      // Handle payment success here
    },
    prefill: {
      email: 'test@example.com',
      contact: '1234567890',
    },
    theme: { color: '#F37254' },
  };

  RazorpayCheckout.open(options);
};

export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
  Geolocation.getCurrentPosition(
      position => {
          const cords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              heading: position?.coords?.heading,
          };
          console
          resolve(cords);
      },
      error => {
          reject(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
  )
})

export const locationPermission = () => new Promise(async (resolve, reject) => {
  if (Platform.OS === 'ios') {
      try {
          const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
          if (permissionStatus === 'granted') {
              return resolve("granted");
          }
          reject('Permission not granted');
      } catch (error) {
          return reject(error);
      }
  }else{
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve("granted");
        }else{
          resolve("notgranted");
        }
        // return reject('Location Permission denied');
    }).catch((error) => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
    });
  }

});



export const locationPermissionNotification = () => new Promise(async (resolve, reject) => {
  if (Platform.OS === 'ios') {
     
  }
  else{
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    ).then((granted) => {
      console.log(granted)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve("granted");
        }else{
          resolve("notgranted");
        }
        // return reject('Location Permission denied');
    }).catch((error) => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
    });
  }

});

 
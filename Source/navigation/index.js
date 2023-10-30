import React, {useEffect, useState} from 'react';
import {Modal, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import BookingRequest from '../Screens/component/BookingRequest';
import ScreenNavigation from './navigation';
import {
  rejectRide,
  AcceptRide,
  RejectRide,
  getRideDetailsByRideID,
  setRideDetails,
  distanceMatrix,
} from '../Redux/rideSlice';
import {methods, urls} from '../utils/config';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {resetStack} from '../utils/commonFunction';
import {navigate} from './NavigateTo';
import CustomToastProvider from '../Screens/customComp/CustomToastProvider';
export default ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {}, []);
  const ride = useSelector(state => state.ride);
  const app = useSelector(state => state.app);

  const acceptByDriverRide = () => {
    if (ride?.rideRequestId) {
      dispatch(AcceptRide({rideID: ride?.rideRequestId})).then(async obj => {
        await StorageProvider.saveItem('isInBetweenRide', 'yes');
        dispatch(getRideDetailsByRideID(ride?.rideRequestId)).then((response)=>{
          console.log()
          let sorceDis = {
            source:response?.payload?.source,
            destination:response?.payload?.destination
          }
          dispatch(distanceMatrix(sorceDis));
        });
        console.log(
          'getRideDetailsByRideID====================================',
          obj,
        );
        if (obj.payload.message == 'Success') {
          navigate('mapbox');
        }
      }).catch(function (err) {
        setTimeout(() => {
          dispatch(rejectRide())
        }, 400);
      });
    }
  };

  const rejectByDriverRide = () => {
    if (ride?.rideRequestId) {
      dispatch(RejectRide({rideID: ride?.rideRequestId})).then(obj => {
        dispatch(setRideDetails());
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScreenNavigation />
      <CustomToastProvider />
      <BookingRequest
        // navigation={navigation}
        rideDetails={ride?.rideDetails}
        isNewBookingRequest={ride.rideModel}
        

        onAccept={() => {
          acceptByDriverRide();
        }}
        onReject={() => {
          rejectByDriverRide();
        }}
      />
      {/* <Connection isConnected={isConnected} /> */}
    </View>
  );
};

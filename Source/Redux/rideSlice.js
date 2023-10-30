import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {endPoints, methods, urlReqType, urls} from '../utils/config';
import RestApiRedux from '../network/RestApiRedux';
import Toast from 'react-native-toast-message';
import {getDistanceInKm, getTimeInMin} from '../utils/commonFunction';

export const AcceptRide = createAsyncThunk(
  'rides/AcceptRide',
  async ({rideID}, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('statestate', state);
    let endpoint = `rms/ride/${rideID}/accept`;
    return RestApiRedux(
      methods.PUT,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);

export const RejectRide = createAsyncThunk(
  'rides/RejectRide',
  async ({rideID}, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('statestate', state);
    let endpoint = `rms/ride/${rideID}/reject`;
    return RestApiRedux(
      methods.PUT,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);

export const cancelRide = createAsyncThunk(
  'rides/cancelRide',
  async (rideId, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('statestate', state);
    let body = {
      reason: 'not happy',
    };
    let endpoint = `rms/ride/${rideId}/cancel`;
    console.log('endpoint', endpoint);
    return RestApiRedux(
      methods.PUT,
      JSON.stringify(body),
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);



export const getRideDetailsByRideIDForNon = createAsyncThunk(
  'rides/getRideDetailsByRideIDForNon',
  async (rideID, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('rideID getRideDetailsByRideIDForNon', rideID);
    let endpoint = `rms/ride/${rideID}`;
    return RestApiRedux(
      methods.GET,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);



export const getRideDetailsByRideID = createAsyncThunk(
  'rides/getRideDetailsByRideID',
  async (rideID, thunkAPI) => {
    const state = thunkAPI.getState();
    let endpoint = `rms/ride/${rideID}`;
    return RestApiRedux(
      methods.GET,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);

export const arrivedTripApi = createAsyncThunk(
  'rides/arrivedTripApi',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('rideID arrivedTripApi', state.ride.rideDetails.id);
    let endpoint = `rms/ride/${state.ride.rideDetails.id}/arrived`;
    return RestApiRedux(
      methods.PUT,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);

export const tripOtvVerify = createAsyncThunk(
  'rides/tripOtvVerify',
  async (rideOtp, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('rideID tripOtvVerify', rideOtp);
    let endpoint = `rms/ride/${state.ride.rideDetails.id}/start-ride`;
    let body = {
      otp: rideOtp,
    };
    return RestApiRedux(
      methods.PUT,
      JSON.stringify(body),
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);

export const startTripNavigation = createAsyncThunk(
  'rides/startTripNavigation',
  async (body, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('rideID startTripNavigation', state);
    let url = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/navigate?source=${body.source.longitude},${body.source.latitude}&destination=${body.destination.longitude},${body.destination.latitude}`;
    return RestApiRedux(
      methods.GET,
      {},
      '',
      urlReqType.DMS,
      state.app.accessToken,
      url,
    );
  },
);

export const distanceMatrix = createAsyncThunk(
  'rides/distanceMatrix',
  async (sourceDesti, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('distanceMatrix ', sourceDesti);
    let url = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/distance?source=${sourceDesti.source.longitude},${sourceDesti.source.latitude}&destination=${sourceDesti.destination.longitude},${sourceDesti.destination.latitude}`;
    console.log('urlurlurl', url);
    return RestApiRedux(
      methods.GET,
      {},
      '',
      urlReqType.DMS,
      state.app.accessToken,
      url,
    );
  },
);

export const endTripNavigation = createAsyncThunk(
  'rides/endTripNavigation',
  async (body, thunkAPI) => {
    console.log('endRide req body', body);
    const state = thunkAPI.getState();
    console.log('rideID endTripNavigation', state.ride.rideDetails.otp);
    let endpoint = `rms/ride/${state.ride.rideDetails.id}/end`;
    return RestApiRedux(
      methods.PUT,
      JSON.stringify(body),
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);


export const endNONPassTripNavigation = createAsyncThunk(
  'rides/endNONPassTripNavigation',
  async (body, thunkAPI) => {
    console.log('endRide req body nonpass' , body);
    const state = thunkAPI.getState();
    console.log('rideID endNONPassTripNavigation', state.ride.rideDetails.otp);
    let endpoint = `rms/ride/${state.ride.rideDetails.id}/non-app/end`;
    return RestApiRedux(
      methods.PUT,
      JSON.stringify(body),
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);


export const ratePassenger = createAsyncThunk(
  'rides/ratePassenger',
  async (rating, thunkAPI) => {
    const state = thunkAPI.getState();
    let res = await StorageProvider.getObject('accessToken');
    let endpoint = `rms/ride/${state.ride.rideDetails.id}/rate-passenger`;
    let body = {
      rating: rating,
    };
    return RestApiRedux(
      methods.PUT,
      JSON.stringify(body),
      endpoint,
      urlReqType.DMS,
      res.accesstoken,
    );
  },
);

export const markPayment = createAsyncThunk(
  'rides/markPayment',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('rideID markPayment', state.ride.rideDetails);
    
    let endpoint =  state.ride.rideDetails.passenger ?  `rms/ride/${state.ride.rideDetails.id}/payment` : `rms/ride/${state.ride.rideDetails.id}/non-app/payment`;
    let body = {
      type: 'upi',
      amount: state?.ride?.totalDue,
    };
    return RestApiRedux(
      methods.POST,
      JSON.stringify(body),
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);

export const getRideHistory = createAsyncThunk(
  'rides/getRideHistory',
  async (_, thunkAPI) => {
    thunkAPI.dispatch(loadingStartStop(true));
    console.log('getRideHistory called');
    console.log('thunkAPI--', thunkAPI);
    const state = thunkAPI.getState();
    let endpoint = `rms/ride/history?pgIndex=0&pgSize=5000`;
    return RestApiRedux(
      methods.GET,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);

export const getRideHistoryDetails = createAsyncThunk(
  'rides/getRideHistoryDetails',
  async (rideID, thunkAPI) => {
    thunkAPI.dispatch(loadingStartStop(true));
    const state = thunkAPI.getState();
    console.log('rideID getRideHistoryDetails', rideID);
    let endpoint = `rms/ride/${rideID}`;
    return RestApiRedux(
      methods.GET,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);

export const getDriverEarning = createAsyncThunk(
  'rides/getDriverEarning',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    return RestApiRedux(
      methods.GET,
      {},
      endPoints.GET_DRIVER_TOTAL_EARNING,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);


function toTimestamp(){
  const currentDate = new Date();
  const exactDate= currentDate.toLocaleDateString();
  const date1 = new Date(exactDate).getTime();
   return  date1/1000;
}

export const getDriverTodayEarning = createAsyncThunk(
  'rides/getDriverTodayEarning',
  async (date, thunkAPI) => {
    const state = thunkAPI.getState();
    let endpoint = `rms/ride/time-range/?startTime=${toTimestamp()}`;
    return RestApiRedux(
      methods.GET,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);


export const RejectVehicle = createAsyncThunk(
  'rides/RejectVehicle',
  async (driverID, thunkAPI) => {
    console.log('driverIDdriverID',driverID)
    const state = thunkAPI.getState();
    console.log('statestate', state.app);
    let endpoint = `evrms/plans/evstatus/${driverID}/rejected`;
    return RestApiRedux(
      methods.PUT,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);

export const AcceptVehicle = createAsyncThunk(
  'rides/AcceptVehicle',
  async (driverID, thunkAPI) => {
   const state = thunkAPI.getState();
    console.log('statestate', state.app);
    let endpoint = `evrms/plans/evstatus/${driverID}/accepted`;

    console.log("acccptride11222",endpoint);
    return RestApiRedux(
      methods.PUT,
      {},
      endpoint,
      urlReqType.DMS,
      state.app.accessToken,
    );
  },
);



export const getDriverRideStatus = createAsyncThunk(
  'rides/getDriverRideStatus',
  async (_, thunkAPI) => {
    let res = await StorageProvider.getObject('accessToken');
    return RestApiRedux(
      methods.GET,
      {},
      endPoints.GET_DRIVER_RIDE_STATUS,
      urlReqType.DMS,
      res.accesstoken,
    );
  },
);

export const getDriverBookingStatus = createAsyncThunk(
  'rides/getDriverBookingStatus',
  async (_, thunkAPI) => {
    let res = await StorageProvider.getObject('accessToken');
    return RestApiRedux(
      methods.GET,
      {},
      endPoints.GET_DRIVER_RIDE_STATUS,
      urlReqType.DMS,
      res.accesstoken,
    );
  },
);

const initialState = {
  rideDetails: {},
  rideHistoryDetails: null,
  rideHistory: {},
  rideRequestId: '',
  value: 0,
  rideModel: false,
  startTripModal: false,
  isOnRideStatus: false,
  isLoading: false,
  isPaymentDone: false,
  isRatingModalOpen: false,
  isTripEnded: false,
  isTripStarted: false,
  IsnewNonPassRide:false,
  isShowPath: false,
  isSourcePath:false,
  isStartTripOtpRequest: false,
  isShowFinalFare: false,
  arrivedStartTrip1: false,
  bottomSheetIndex: 1,
  totalDue: 0,
  checkInRideState: false,
  rideLoading: false,
  driverTotalEarning: 0,
  driverTodayEarning:0,
  vehicleLocation: {},
};

export const rideSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    resetRideStates: () => initialState,
    addRequestRideId: (state, action) => {
      state.rideRequestId = action.payload;
    },


    loadingStartStop: (state, action) => {
      state.rideLoading = action.payload;
    },
    setLanguage: (state, action) => {
      state.languages = action.payload;
    },
    setStartTripModalTrue: (state, action) => {
      state.startTripModal = true;
      state.isSourcePath = true;
      state.isShowPath = false;
    },
    rejectRide: state => {
      state.rideModel = false;
    },
    openArrivedStartTrip1: state => {
      state.arrivedStartTrip1 = true;
      state.isSourcePath = true;
      state.isShowPath = false;
    },
    openTriptOtpModal: state => {
      state.arrivedStartTrip1 = false;
      state.isStartTripOtpRequest = true;
    },
    openPaymentModal: state => {
      state.isShowFinalFare = true;
    },
    openStartnavigationModal: state => {
      state.isTripEnded = true;
      state.isShowPath = true;
      state.isSourcePath = false;
     // state.isTripStarted = true;
    },
    openNonpassengerNavigationModel: state=>{
    //  state.isTripStarted = true;
     // state.IsnewNonPassRide= true;
     state.isTripEnded = true;
     state.isSourcePath = false;
     state.isShowPath = true;
    },
    closePaymentSuccesModal: state => {
      state.isPaymentDone = false;
      {state.rideDetails?.passenger ? state.isRatingModalOpen = true : state.isRatingModalOpen = false }
      
    },
    setRideDetails: state => {
      state.rideDetails.status = {};
    },
    setVehicleLocation: (state, action) => {
      state.vehicleLocation = action.payload;
    },
    setRideDetails: state => {
      state.rideDetails.status = {};
    },
    setVehicleLocation: (state, action) => {
      state.vehicleLocation = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(AcceptRide.fulfilled, (state, action) => {
        console.log('AcceptRide.fulfilled', action);
        if (action?.payload?.message == 'Success') {
          state.rideModel = false;
          state.isRatingModalOpen = false;
          state.isSourcePath= true;
          state.startTripModal = true;
        }
      })
      .addCase(AcceptRide.rejected, (state, action) => {
        console.log('AcceptRide.rejected', action);
        state.isRatingModalOpen = false;
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
        // state.rideModel = false;
      }) //reject request=========================================
      .addCase(RejectRide.fulfilled, (state, action) => {
        console.log('RejectRide action payload', action);
        if (action?.payload?.message == 'Success') {
          state.rideModel = false;
          state.isRatingModalOpen = false;
        }
      })
      .addCase(RejectRide.rejected, (state, action) => {
        console.log('RejectRide reject payload', action);
        state.rideModel = false;
        state.isRatingModalOpen = false;
      })
      //get ride details======================================
      .addCase(getRideDetailsByRideID.fulfilled, (state, action) => {
        console.log('getRideDetailsByRideID success', action);
        state.rideDetails = action?.payload;
        state.rideRequestId = action?.payload?.id;
        if (action?.payload?.status === 'unassigned') {
          state.rideModel = true;
        }
      })
      .addCase(getRideDetailsByRideID.rejected, (state, action) => {
        console.log('getRideDetailsByRideID reject', action);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      })

      .addCase(getRideDetailsByRideIDForNon.fulfilled, (state, action) => {
        console.log('getRideDetailsByRideIDForNon success', action);
        state.rideDetails = action?.payload;
        state.rideRequestId = action?.payload?.id;
      //  state.IsnewNonPassRide = true;
         state.isShowPath = true;
         state.isTripEnded= true
       // state.isTripStarted = true;
        if (action?.payload?.status === 'unassigned') {
          state.rideModel = true;
        }
      })
      .addCase(getRideDetailsByRideIDForNon.rejected, (state, action) => {
        console.log('getRideDetailsByRideIDForNon reject', action);
      })

      .addCase(arrivedTripApi.fulfilled, (state, action) => {
        if (action?.payload?.message == 'Success') {
          (state.arrivedStartTrip1 = true),
            (state.bottomSheetIndex = 2),
            (state.rideModel = false);
          state.startTripModal = false;
          state.isSourcePath = true;
          state.isShowPath = false;
        }
        console.log('arrivedTripApi success ', action);
      })
      .addCase(arrivedTripApi.rejected, (state, action) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
        console.log('arrivedTripApi reject', action);
      })
      .addCase(tripOtvVerify.fulfilled, (state, action) => {
        if (action?.payload?.message == 'Success') {
          (state.isStartTripOtpRequest = false),(state.isShowPath = true),(state.isSourcePath = false) ,(state.isTripEnded = true);
        }
        console.log('tripOtvVerify success ', action);
      })
      .addCase(tripOtvVerify.rejected, (state, action) => {
        console.log('tripOtvVerify reject', action);
        state.isSourcePath = false
        // Toast.show({
        //   type: 'error',
        //   text1: 'Error',
        //   text2: action?.error?.message,
        // }, Toast.LONG); 
      })
      .addCase(startTripNavigation.fulfilled, (state, action) => {
        console.log('startTripNavigation fulfilled', action);
        if (action?.payload?.code == 'Ok') {
          state.isTripStarted = false;
          state.IsnewNonPassRide=false;
          state.isShowPath = true;
          state.bottomSheetIndex = 2;
          state.isTripEnded = true;
        }
      })
      .addCase(startTripNavigation.rejected, (state, action) => {
        console.log('startTripNavigation reject', action);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      })  
      .addCase(endTripNavigation.fulfilled, (state, action) => {
        if (action?.payload?.totalDue || action?.payload?.totalDue <= 0) {
          state.isTripEnded = false;
          state.bottomSheetIndex = 2;
          state.isShowPath = false;
          state.isShowFinalFare = true;
          state.totalDue = action?.payload?.totalDue;
        }
        console.log('endTripNavigation success', action);
      })
      .addCase(endTripNavigation.rejected, (state, action) => {
        console.log('endTripNavigation reject', action);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      })
      .addCase(endNONPassTripNavigation.fulfilled, (state, action) => {
        if (action?.payload?.totalDue || action?.payload?.totalDue <= 0) {
          state.isTripEnded = false;
          state.bottomSheetIndex = 2;
          state.isShowPath = false;
          state.isShowFinalFare = true;
          state.totalDue = action?.payload?.totalDue;
        }
        console.log('endNONPassTripNavigation success', action);
      })
      .addCase(endNONPassTripNavigation.rejected, (state, action) => {
        console.log('endNONPassTripNavigation reject', action);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      }) 
      .addCase(ratePassenger.fulfilled, (state, action) => {
        if (action?.payload?.message == 'Success') {
          state.isRatingModalOpen = false;
          state.bottomSheetIndex = 1;
        }
        console.log('endNONPassTripNavigation success', action);
      }) 
      .addCase(ratePassenger.rejected, (state, action) => {
        console.log('ratePassenger reject', action);
        state.isRatingModalOpen = false;
        state.bottomSheetIndex = 1;
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      })
      .addCase(markPayment.fulfilled, (state, action) => {
        if (action?.payload?.message == 'Success') {
          state.isShowFinalFare = false;
         // state.isRatingModalOpen = true;

         state.isPaymentDone = true;
        }
        console.log('markPayment success ', action);
      })
      .addCase(markPayment.rejected, (state, action) => {
        console.log('markPayment reject', action);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      })
      .addCase(cancelRide.fulfilled, (state, action) => {
        if (action?.payload?.message == 'Success') {
          state.startTripModal = false;
          state.arrivedStartTrip1 = false;
        }
        console.log('cancel ride success ', action);
      })
      .addCase(cancelRide.rejected, (state, action) => {
        console.log('cancel ride reject', action);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      })
      .addCase(getRideHistory.fulfilled, (state, action) => {
        console.log('getRideHistory fullfilled', action);
        if(action?.payload){
          state.rideHistory=action?.payload;
          console.log('getRideHistory fullfilled actions', action?.payload);
          state.rideLoading=false;
        } else {
          state.rideLoading = false;
          state.rideHistory = [];
        }
      })
      .addCase(getRideHistory.rejected, (state, action) => {
        console.log('getRideHistory rejected', action);
        state.rideLoading = false;
      })
      .addCase(getRideHistoryDetails.fulfilled, (state, action) => {
        console.log('getRideHistoryDetails fullfilled', action);
        if (action?.payload) {
          state.rideHistoryDetails = action?.payload;
          state.rideLoading = false;
        }
      })
      .addCase(getRideHistoryDetails.rejected, (state, action) => {
        console.log('getRideHistoryDetails rejected', action);
        state.rideLoading = false;
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      })
      .addCase(getDriverEarning.fulfilled, (state, action) => {
        console.log('getDriverEarning fullfilled', action);
        if (action?.payload) {
          state.driverTotalEarning = action?.payload?.totalEarning;
        }
      })
      .addCase(getDriverEarning.rejected, (state, action) => {
        console.log('getDriverEarning rejected', action);
      })
      .addCase(getDriverTodayEarning.fulfilled, (state, action) => {
        console.log('getDriverTodayEarning fullfilled', action);
        if (action?.payload) {
          console.log('getDriverTodayEarning fullfilled', action?.payload?.totalRevenue);
          state.driverTodayEarning = action?.payload?.totalRevenue;
        }
      })
      .addCase(getDriverTodayEarning.rejected, (state, action) => {
        console.log('getDriverTodayEarning rejected', action);
      })
      .addCase(distanceMatrix.fulfilled, (state, action) => {
        console.log('distanceMatrix fullfilled', action);
        let ride = state.rideDetails
        if(action?.payload){
          
          if(action?.payload?.results.distances && action?.payload?.results.durations){
            ride.distances  = Math.round(action?.payload?.results.distances[0][0]/1000)
            ride.durations  = Math.round(action?.payload?.results.durations[0][0]/60)
          }else{
            ride.distances  = getDistanceInKm(null)
            ride.durations  = getTimeInMin(null)
          } 
          state.rideDetails = ride
        }
      })
      .addCase(distanceMatrix.rejected, (state, action) => {
        console.log('distanceMatrix rejected', action);
      }) 
      .addCase(AcceptVehicle.fulfilled, (state, action) => {
        console.log('AcceptVehicle success1123')
        if (action?.payload?.isRideExist) {
             state.rideDetails = action?.payload?.rideDetails;
        }
      })
      .addCase(AcceptVehicle.rejected, (state, action) => {
        console.log('AcceptVehicle reject1123', action);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      })
      .addCase(RejectVehicle.fulfilled, (state, action) => {
        if (action?.payload?.isRideExist) {
                     state.rideDetails = action?.payload?.rideDetails;
        }
      })
      .addCase(RejectVehicle.rejected, (state, action) => {
        console.log('RejectVehicle', action);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action?.error?.message,
        });
      })
      .addCase(getDriverRideStatus.fulfilled, (state, action) => {
        if (action?.payload?.isRideExist) {
                     state.rideDetails = action?.payload?.rideDetails;
        }
      })
      .addCase(getDriverBookingStatus.fulfilled, (state, action) => {
        console.log('getDriverBookingStatus', action);
      });
      
  },
});

// Action creators are generated for each case reducer function
export const {
  closeRideModal,
  rejectRide,
  addRequestRideId,
  openTriptOtpModal,
  closePaymentSuccesModal,
  loadingStartStop,
  setRideDetails,
  resetRideStates,
  openArrivedStartTrip1,
  setStartTripModalTrue,
  openStartnavigationModal,
  openNonpassengerNavigationModel,
  openPaymentModal,
  setVehicleLocation,
} = rideSlice.actions;

export default rideSlice.reducer;

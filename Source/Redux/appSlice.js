import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {endPoints, methods, urlReqType} from '../utils/config';
import StorageProvider from '../Session/StorageProvider';
import RestApiRedux from '../network/RestApiRedux';
import { useNavigation } from '@react-navigation/native';

export const setFCMToken = createAsyncThunk('app/setFCMToken', async ({fcmToken},thunkAPI) => {
  const state = thunkAPI.getState();
  let body ={
    fcmToken:fcmToken
  }
  return RestApiRedux(methods.POST,JSON.stringify(body),endPoints.ADD_FCMTOKEN,urlReqType.DMS,state.app.accessToken)
});
export const deleteFCMToken = createAsyncThunk('app/deleteFCMToken', async ({fcmToken},thunkAPI) => {
  const state = thunkAPI.getState();
  let body ={
    fcmToken:fcmToken
  }
  return RestApiRedux(methods.POST,JSON.stringify(body),endPoints.DELETE_FCMTOKEN,urlReqType.DMS,state.app.accessToken)
});

export const appLogOut = createAsyncThunk('app/appLogOut', async (_,thunkAPI) => {
  const state = thunkAPI.getState();
  let fcmToken = await StorageProvider.getItem('fcmToken');
  console.log("delete fcm token",fcmToken)
  let body = {fcmToken: fcmToken};
  return RestApiRedux(methods.POST,JSON.stringify(body),endPoints.LOGOUT,urlReqType.DMS,state.app.accessToken)
});

export const userActivateDeactivate = createAsyncThunk('app/userActivateDeactivate', async (status,thunkAPI) => {
  const state = thunkAPI.getState();
  let userInfo =  await StorageProvider.getObject('userInfo');
  let driverID = userInfo.userId;
  let endPoint = `driverManagement/driver/${driverID}/profile-status?enable=${status}`;
  return RestApiRedux(methods.PUT,{},endPoint,urlReqType.DMS,state.app.accessToken)
});


export const getDriverProfileInfo = createAsyncThunk('app/getDriverProfileInfo', async () => {
  let res =  await StorageProvider.getObject('accessToken');
 
  if(res) return  RestApiClient('GET','','driverManagement/driver/driver/profile','DMS',res.accesstoken)
});

export const GetOperatorHUbDetails = createAsyncThunk('app/GetOperatorHUbDetails', async (operationHubID) => {
  let res =  await StorageProvider.getObject('accessToken');
  let endPoint = `evims/v1/hub/${operationHubID}`
  if(res) return  RestApiClient('GET','',endPoint,urlReqType.DMS,res.accesstoken)
});

export const appLatLong = createAsyncThunk('app/appLatLong', async (body,thunkAPI) => {
  const state = thunkAPI.getState();
  return RestApiRedux(
    methods.POST,
    JSON.stringify(body),
    endPoints.ADD_LAT_LONG,
    urlReqType.DMS,
    state.app.accessToken,
  );
});

export const getDriverAllocation = createAsyncThunk('app/getDriverAllocation', async (body) => {
  let res =  await StorageProvider.getObject('accessToken');
  let endPoints = "/rms/allocation"
  if (res) return RestApiRedux(methods.GET,JSON.stringify(body),endPoints,urlReqType.DMS,res.accesstoken)
});

export const onDutyOffDuty = createAsyncThunk('app/onDutyOffDuty', async (status,thunkAPI) => {
  let endPoint ;
  if(status=='ON'){
    endPoint  =  endPoints.ON_DUTY_END_POINT
  }else{
    endPoint  =  endPoints.PUSH_DUTY_END_POINT
  }
  const state = thunkAPI.getState();
  let body = {reason: 'Too high to drive'};
  return RestApiRedux(methods.POST,JSON.stringify(body),endPoint,urlReqType.DMS,state.app.accessToken)
});

export const getUserProfile = createAsyncThunk('app/getUserProfile', async () => {
  let res =  await StorageProvider.getObject('accessToken');
  if(res){
    return RestApiRedux(methods.GET,'',endPoints.GET_USER_PROFILE,urlReqType.IAM,res?.accesstoken)
  }
});

export const getState = createAsyncThunk('app/getState', async () => {
  let res =  await StorageProvider.getObject('accessToken');
  if(res){
    return RestApiRedux(methods.GET,'',endPoints.GET_STATE_LIST,urlReqType.DMS,res?.accesstoken)
  }
});
export const getCityByState = createAsyncThunk('app/getState', async (stateid) => {
  let res =  await StorageProvider.getObject('accessToken');
  let endPoint = `appsupport/v1/city?stateId=${stateid}`;
  if(res){
    return RestApiRedux(methods.GET,'',endPoint,urlReqType.DMS,res?.accesstoken)
  }
});

export const getNotificationPre = createAsyncThunk('app/getNotificationPre', async () => {
  let res =  await StorageProvider.getObject('accessToken');
  let endPoint = `notification/notification-preference/`;
  if(res){
    return RestApiRedux(methods.GET,'',endPoint,urlReqType.DMS,res?.accesstoken)
  }
});

export const updateNotificationPre = createAsyncThunk('app/updateNotificationPre', async (body) => {
  let res =  await StorageProvider.getObject('accessToken');
  let endPoint = `notification/notification-preference/`;
  if(res){
    return RestApiRedux(methods.PUT,JSON.stringify(body),endPoint,urlReqType.DMS,res?.accesstoken)
  }
});

export const getTermAndCondi = createAsyncThunk('app/getTermAndCondi', async (end_flag) => {
  let res =  await StorageProvider.getObject('accessToken');
  let endPoint = `appsupport/v1/${end_flag}`;
  if(res){
    return RestApiRedux(methods.GET,'',endPoint,urlReqType.DMS,res?.accesstoken)
  }
});


// myplans========
export const getPreviousRentalPlan = createAsyncThunk('app/getPreviousRentalPlan', async () => {
  let res =  await StorageProvider.getObject('accessToken');
  if(res){
    let endPoint = `evrms/plans/evorder/${res?.userId}/history`;
    return RestApiRedux(methods.GET,'',endPoint,urlReqType.DMS,res?.accesstoken)
  }
});


const initialState = {
    accessToken: null,  
    languages: 'en',
    socPercentage:0,
    fcmToken:"",
    isLoading: false,
    driverAllocationStatus:{},
    currLat:null,
    currLong:null,
    userDocVerificationStatus:false,
    driverProfileInfo:{},
    driverDetail:{},
    OperatorHubDetails:{}
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetAppStates: () => initialState,
    setToken: (state,action) => {
        state.accessToken= action.payload
    },
    setLanguage: (state,action) => {
        state.languages= action.payload
    },
    setIsLoading: (state,action) => {
      state.isLoading= action.payload
    },
    
    setgetDriverAllocation:{
      
    },
  
    addSOCPercentage: (state,action) => {
    state.socPercentage = action.payload
    },
    
    setCurrentLatLong: (state,action) => {
      if(state.currLat!==action.payload.latitude){
        state.currLat= action.payload.latitude;
      }
      if(state.currLong!==action.payload.longitude){
        state.currLong= action.payload.longitude;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(setFCMToken.fulfilled,(state, action) => {
        StorageProvider.saveItem('isNotificationAdded','true')
        if(action?.payload?.message=='Success') {
          console.log('fcm add success ',action)
        }
      })
      .addCase(setFCMToken.rejected, (state, action) => {
        console.log('fcm reject ',action)
        // Toast.show({
        //   type: 'error',
        //   text1: 'Error',
        //   text2:action?.error?.message
        // });
      }) 
      .addCase(appLogOut.fulfilled, (state, action) => {
        if(action?.payload?.message=='Success') {
          const navigate = useNavigation();
          // console.log('navigate',navigate)
          // props.navigation.navigate('Choose Language');
          // StorageProvider.clear();
          console.log('Log out');
        }
      })
      .addCase(appLogOut.rejected, (state, action) => {
        console.log('logout error reject ',action)
      }) 
      
      .addCase(deleteFCMToken.fulfilled, (state, action) => {
        console.log('deleteFCMToken success ',action)
        if(action?.payload?.message=='Success') {
           
        }
      })
      .addCase(deleteFCMToken.rejected, (state, action) => {
        console.log('deleteFCMToken ',action)
      }) //get allocation status================================
      .addCase(getDriverAllocation.fulfilled, (state, action) => {
        state.driverAllocationStatus = action?.payload
        console.log('getDriverAllocation success ',action)
      })
      .addCase(getDriverAllocation.rejected, (state, action) => {
        console.log('getDriverAllocation rejected',action)
      }) 


      .addCase(onDutyOffDuty.fulfilled, (state, action) => {
        console.log('onDutyOffDuty success ',action)
      })
      .addCase(onDutyOffDuty.rejected, (state, action) => {
        console.log('onDutyOffDuty rejected',action)
      }) 
      .addCase(getDriverProfileInfo.fulfilled, (state, action) => {
        if(action.payload){
          state.driverDetail = action.payload
        }  
      })
      
      .addCase(getDriverProfileInfo.rejected, (state, action) => {
        console.log('getDriverProfileInfo rejected',action)
      }) 

      .addCase(GetOperatorHUbDetails.fulfilled, (state, action) => {
        if(action.payload){
           state.OperatorHubDetails = action.payload
           console.log('GetOperatorHUbDetails driverdetails ',state.OperatorHubDetails)
        }
        console.log('GetOperatorHUbDetails success ',action)
      })


      .addCase(GetOperatorHUbDetails.rejected, (state, action) => {
        console.log('GetOperatorHUbDetails rejected',action)
      })  
      .addCase(getUserProfile.fulfilled, (state, action) => {
        console.log('getUserProfile success ',action)
        if(action.payload) {
          state.driverProfileInfo=action.payload;
          StorageProvider.setObject('userInfo', action.payload);
        }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        console.log('getUserProfile rejected',action)
      }) 
      .addCase(getPreviousRentalPlan.fulfilled, (state, action) => {
        console.log('getPreviousRentalPlan success ',action)
        if(action.payload) {
          
        }
      })
      .addCase(getPreviousRentalPlan.rejected, (state, action) => {
        console.log('getPreviousRentalPlan rejected',action)
      }) 
  },
})

// Action creators are generated for each case reducer function
export const { setToken,setLanguage ,setCurrentLatLong,resetAppStates,addSOCPercentage} = appSlice.actions
export default appSlice.reducer
import { Dimensions } from 'react-native';

export const mobH = Dimensions.get('screen').height;
export const mobW = Dimensions.get('screen').width;
export const endPoints={
    LOGOUT:"notification/fcm-token/logout",
    // home and mapbox================================================
    PUSH_DUTY_END_POINT:'rms/allocation/pause',
    ON_DUTY_END_POINT:'rms/allocation/resume',
    GET_USER_PROFILE:'user/profile',
    
    GET_STATE_LIST:'appsupport/v1/state',
    //driver my account and profiles=========================================
    GET_DRIVER_PROFILE_SELF:'driverManagement/driver/driver/profile',
    EDIT_DRIVER_PROFILE_AND_ADDRESS:'driverManagement/driver/driver/profile/',
    EDIT_DRIVER_KYC_DETAILS:'driverManagement/driver/assets',
    // otp=======================
    VALIDATE_OTP:'auth/validateOtp',
    SUPPROT_SEND:'appsupport/v1/message/driver',
    GENERATE_OTP:'auth/generateOtp',
    //rides=======================
    GET_DRIVER_RIDE_STATUS:'rms/ride/driver-ride/',
    //notification=========
    ADD_FCMTOKEN: `notification/fcm-token/add-token`,
    DELETE_FCMTOKEN: `notification/fcm-token/logout`,
    ADD_LAT_LONG: `driverManagement/driver/location`,
    SUPPROT_SEND:'appsupport/v1/message/driver',
    // ride===
    GET_DRIVER_TOTAL_EARNING:"rms/ride/total/earning",
    GET_DRIVER_Today_EARNING:"rms/ride/time-range",
    Near_By_Operator:'evims/v1/hub/nearby',
    Rental_Plans:'evrms/plans/evrental',
    Create_Rental_order:'evrms/plans/evorder',

}

export const methods={
    PUT:'PUT',
    POST:'POST',
    GET:'GET',
}
export const urlReqType={
    DMS:'DMS',
    IAM:'IAM', 
}

 
export const urls={
    
   BASE_URL : "https://dmrc.iam.emob.miraie.in/api/identity/v1/", /// for production
    CLIENT_ID :  "64a6e66af7d55244db84bf8c",  // for production
    DMS_BASE_URL : "https://emob.miraie.in/", /// for production

    // BASE_URL : "https://dmrc.iam.emobility-dev.lifestyleindia.net/api/identity/v1/",
    // DMS_BASE_URL : "http://k8s-neuro-ingressd-68355dad55-1868134886.ap-south-1.elb.amazonaws.com/", //FOR  dev //with current location
    // CLIENT_ID :  "63a98a639cf7ae3a810cb676",
    //  DMS_BASE_URL : "https://api.emobility-qa.lifestyleindia.net/",  //for QA without current location 
    
}
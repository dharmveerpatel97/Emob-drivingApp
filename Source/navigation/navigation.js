import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../Screens/onboarding/Splash';
import Login from '../Screens/onboarding/Login';
import Otp from '../Screens/onboarding/Otp';
import Signup from '../Screens/onboarding/Signup';
import Profile from '../Screens/onboarding/Profile';
import ChooseLang from '../Screens/onboarding/ChooseLang';
import AddressDetails from '../Screens/Dashboard/AddressDetails';
import DocumentUpload from '../Screens/Dashboard/DocumentUpload';
import ImageView from '../Screens/component/ImageView';
import MyDrawer from './Navigations'; 
import HavingTrouble from '../Screens/OperationHub/HavingTrouble';
import EvPayment from '../Screens/OperationHub/EvPayment';
import Returnev_review from '../Screens/MyPlansandMyEV/Returnev_review';
import Scan from '../Screens/MyPlansandMyEV/Scan';
import ChooseBookingSlot from '../Screens/OperationHub/ChooseBookingSlot';
import MyAccount from '../Screens/driverProfile/MyAccount';
import SubmitReview from '../Screens/MyPlansandMyEV/SubmitReview';
import Driversuccessful from '../Screens/driverProfile/Driversuccessful';
import Notification from '../Screens/Dashboard/Notification';
import VerificationProcess from '../Screens/driverProfile/VerificationProcess';
import About from '../Screens/LegalScreen/About';
import EditDriverProfile from '../Screens/driverProfile/EditDriverProfile';
import Myplans from '../Screens/MyPlansandMyEV/Myplans';
import ReturnEv from '../Screens/MyPlansandMyEV/ReturnEv';
import UpgradPlan from '../Screens/MyPlansandMyEV/UpgradPlan';
import EditDriverAddress from '../Screens/driverProfile/EditDriverAddress';
import EditDriveKYCDocuments from '../Screens/driverProfile/EditDriveKYCDocuments';
import EditDriverBasicInfo from '../Screens/driverProfile/EditDriverBasicInfo';
import RideDetails from '../Screens/driverTrips/RideDetails';
import RequestConfirmation from '../Screens/Dashboard/RequestConfirmation';
import MapboxExample from '../Screens/Dashboard/Mapbox';
import {NavigationContainer} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {navigationRef} from './NavigateTo';
import Dashhh from '../Screens/Dashboard/Dashhh';
import Notificationpref from '../Screens/SettingScreen/Notificationpref';
import Deletemyac from '../Screens/SettingScreen/Deletemyac';
import Deletemyac1 from '../Screens/SettingScreen/Deletemyac1';
import Deletefailure from '../Screens/SettingScreen/Deletefailure';
import Dashboard from '../Screens/Dashboard/Dashboard';
import Operationhub from '../Screens/OperationHub/Operationhub';
import ExtendPlans from '../Screens/MyPlansandMyEV/ExtendPlans';
import Support  from '../Screens/HelpSupport/Support';
import Support1  from '../Screens/HelpSupport/Support1';
import UnverifiedDrawer from './UnverifiedDrawer';
import NumberPopupScreen from '../Screens/onboarding/NumberPopupScreen';

import NewTrip from '../Screens/AddNewTrip/NewTrip';
import PreviousPlanDetails from '../Screens/MyPlansandMyEV/PreviousPlanDetails';
import UpgradedPlans from '../Screens/MyPlansandMyEV/UpgradedPlans';
const Stack = createNativeStackNavigator();

const ScreenNavigation = () => {
  const {t} = useTranslation();
  const linking = {
    prefixes: ["driverapp://"], //prefixes can be anything depend on what you have wrote in intent filter
    config: {
      initialRouteName: "mapbox",  
      screens: {
        mapbox: {
          path: "mapbox",
        },
      }
    }
  }


  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator 
        initialRouteName="splash"
        screenOptions={{animationEnabled: false}}>
        <Stack.Screen
          name="splash"
          component={Splash}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="NumberPopupScreen"
          component={NumberPopupScreen}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="PreviousPlanDetails"
          component={PreviousPlanDetails}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="UpgradedPlans"
          component={UpgradedPlans}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="UpgradPlan"
          component={UpgradPlan}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="Home"
          component={MyDrawer}
          options={{headerShown: false, gestureEnabled: false}}
        /> 

        <Stack.Screen
          name="UnverifiedDrawer"
          component={UnverifiedDrawer}
          options={{headerShown: false, gestureEnabled: false}}
        />
  
  
  
        {/* <Stack.Screen
          name="Socket"
          component={Socket}
          options={{headerShown: false, gestureEnabled: false}}
        /> */}

        
        <Stack.Screen
          name="Dashhh"
          component={Dashhh}
          options={{headerShown: false}}
        />
        {/* </Stack.Navigator> */}
        <Stack.Screen
          name="signup"
          component={Signup}
          options={{headerShown: false, gestureEnabled: false}}
        />
         <Stack.Screen
          name="Support"
          component={Support}
          options={{headerShown: false, gestureEnabled: false}}
        />


        <Stack.Screen
          name="Verify"
          component={Otp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Choose Language"
          component={ChooseLang}
          options={{headerShown: false}}
        />
       
         <Stack.Screen
          name="Returnev_review"
          component={Returnev_review}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Scan"
          component={Scan}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="SubmitReview"
          component={SubmitReview}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="ExtendPlans"
          component={ExtendPlans}
          options={{headerShown: false}}
        />
        <Stack.Screen
        name="Address Details"
        component={AddressDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="KYC Documents"
        component={DocumentUpload}
        options={{headerShown: false,gestureEnabled:false}}
      />
       <Stack.Screen
        name="Driversuccessful"
        component={Driversuccessful}
        options={{headerShown: false,gestureEnabled:false}}
      />
      <Stack.Screen
        name="VerificationProcess"
        component={VerificationProcess}
        options={{headerShown: false,gestureEnabled:false}}
      />

      <Stack.Screen
        name="ImageView"
        component={ImageView}
        options={{headerShown: false}}
      />
       
        <Stack.Screen
          name="EvPayment"
          component={EvPayment}
          options={{headerShown: false}}
        />
           <Stack.Screen
          name="Myplans"
          component={Myplans}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="ReturnEv"
          component={ReturnEv}
          options={{headerShown: false}}
        />
        
        
      <Stack.Screen
        name="ChooseBookingSlot"
        component={ChooseBookingSlot}
        options={{headerShown: false}}
      />
    
        <Stack.Screen
        name="NewTrip"
        component={NewTrip}
        options={{headerShown: false}}
      />
      
       
      <Stack.Screen
        name="RideDetails"
        component={RideDetails}
        options={{headerShown: false,gestureEnabled:false}}
      />

       
      <Stack.Screen
        name="Logout"
        component={Otp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditDriverProfile"
        component={EditDriverProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditDriverAddress"
        component={EditDriverAddress}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditDriverBasicInfo"
        component={EditDriverBasicInfo}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="EditDriveKYCDocuments"
        component={EditDriveKYCDocuments}
        options={{headerShown: false}}
      />
      
       <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="myaccount"
        component={MyAccount}
        options={{
          title: t('My Account'),
          headerShown: true,
          headerTintColor: '#FFF',
          tabBarStyle: {
            display: 'hidden',
          },
          headerStyle: {
            backgroundColor: '#001A0F',
            shadowColor: 'transparent',
          },
        }}
      />
      <Stack.Screen
        name="Request Confirmation"
        component={RequestConfirmation}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="mapbox"
        component={MapboxExample}
        options={{headerShown: false}}
      /> */}
       <Stack.Screen
        name="About"
        component={About}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
     
       <Stack.Screen
        name="Notificationpref"
        component={Notificationpref}
        options={{headerShown: false}}
      />
        
      <Stack.Screen
        name="Operationhub"
        component={Operationhub}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="HavingTrouble"
        component={HavingTrouble}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="Support1"
        component={Support1}
        options={{headerShown: false}}
      />

      
        {/* <Stack.Screen
          name="BookNow"
          component={BookNow}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="Deletemyac"
          component={Deletemyac}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Deletemyac1"
          component={Deletemyac1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Deletefailure"
          component={Deletefailure}
          options={{headerShown: false}}
        />
       
     
        {/* <Stack.Screen
          name="WayHub"
          component={WayHub}
          options={{headerShown: false}}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default ScreenNavigation;

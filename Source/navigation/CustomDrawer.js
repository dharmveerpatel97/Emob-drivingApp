import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import RestApiClient from '../network/RestApiClient';
import {useDrawerStatus} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import StorageProvider from '../Session/StorageProvider';
import {useTranslation} from 'react-i18next';
import {mobH, mobW} from '../utils/config';

import {useSelector, useDispatch} from 'react-redux';
import {
  appLogOut,
  deleteFCMToken,
  onDutyOffDuty,
  reset,
  resetAppStates,
} from '../Redux/appSlice';
import {resetRideStates} from '../Redux/rideSlice';
import {DrawerActions} from '@react-navigation/native';
import socketPro from '../network/Socket';
import {BOLD, REGULAR, ITALIC} from '../utils/fonts';
import { color } from '../utils/color';
const CustomDrawer = props => {
  const app = useSelector(state => state.app);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigation();
  const gotoScreen = () => {
    navigate.navigate('myaccount');
  };

  const closingDrawer = () => {
    props.navigation.closeDrawer();
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getUserData();
    });
    return unsubscribe;
  }, [props.navigation]);

  const getUserData = async () => {
    await StorageProvider.getItem('userInfo').then(userInfo1 => {
      userInfo1 = JSON.parse(userInfo1);
      console.log('userinfo custom drawer', userInfo1);
      setUserInfo(userInfo1);
    });
  };

  const btnLogout = async () => {
    navigateRouteName = 'Home';

    if (app?.driverDetail?.allottedVehicleDetail) {
      const message = {type: 'unsubscribeVehicleSOC'};
      socketPro.sendMessage(message);
    }
    socketPro.closeWSConnection();

   
    app?.driverAllocationStatus?.status == 'accepting'
        ? dispatch(onDutyOffDuty('OFF')).then(response => {
            console.log('duty off at logout');
            callLogoutAPi();      
          })
        : 
      callLogoutAPi();
  };


  const callLogoutAPi = async() =>
  {
    let fcmToken = await StorageProvider.getItem('fcmToken');
    console.log("delete fcm token",fcmToken)
    let body = {fcmToken: fcmToken};

    StorageProvider.getObject('accessToken')
    .then(response => { 
    RestApiClient(
      'POST',
      JSON.stringify(body),
      'notification/fcm-token/logout',
      'DMS',
      response.accesstoken,
    )
      .then(response => {
       
        console.log(response, '-------response logout---------');
        if (response?.message == 'Success') {
         
          StorageProvider.clear();
          dispatch(resetAppStates());
          dispatch(resetRideStates());
          props.navigation.navigate('Login');
          console.log('logOut', 'logOut');
        }
       else 
         {
            ToastAndroid.show(response?.message, ToastAndroid.SHORT);
          }
      })
      .catch(error => {
        console.log('API ERROR logout' + error);
      });
    });
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: color.black_BG,
          width: '100%',
        }}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{backgroundColor: color.black_BG, width: 290}}>
          <View activeOpacity={1} style={styles.drawerProfileContainer}>
            <TouchableOpacity
              onPress={() => {
                closingDrawer();
              }}
              style={styles.closeIconContainer}>
              <Image
                source={require('../Assests/image/cross.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <View style={{width: '25%'}}>
              {app.driverDetail && (
                <Image
                  source={
                    app.driverDetail?.profilePicPath != ''
                      ? {uri: app.driverDetail?.profilePicPath}
                      : require('../Assests/image/user_avtar.png')
                  }
                  style={styles.profileIcon}
                />
              )}
            </View>
            <View style={styles.txtContainer}>
              <Text style={styles.userName} numberOfLines={1}>
                {app?.driverDetail?.firstName +
                  ' ' +
                  app?.driverDetail?.lastName}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {app?.driverDetail?.email}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.dispatch(DrawerActions.closeDrawer());
                  console.log('navigation---', props.navigation);
                  props.navigation.navigate('myaccount');
                }}
                style={styles.editProfileContainer}>
                <Text style={styles.editBtnTxt} numberOfLines={1}>
                  {t('drawer_Edit_Profile')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>
            <DrawerItemList {...props} />
            <DrawerItem
              icon={() => (
                <View
                  style={{
                    backgroundColor: '#10281C',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Image
                    style={{height: 16, width: 16, resizeMode: 'contain',tintColor:color.purpleborder}}
                    source={require('../Assests/image/power_off.png')}
                  />
                </View>
              )}
              label={t('drawer_logout')}
              labelStyle={{color: '#ffffff', fontSize: 14}}
              style={{
                borderRadius: 0,
                borderColor: '#ccc',
              }}
              onPress={() => {
                Alert.alert(
                  t('LOGOUT'),
                  t('logOutDetail'),
                  [
                    {
                      text: t('No'),
                    },
                    {
                      text: t('Yes'),
                      onPress: () => {
                        btnLogout();
                      },
                    },
                  ],
                  {
                    cancelable: false,
                  },
                );
              }}
            />
          </View>
        </DrawerContentScrollView>
      </View>
    </>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerProfileContainer: {
    padding: 20,
    borderBottomColor: '#10281C',
    borderBottomWidth: 2,
    backgroundColor: '#10281C',
   paddingTop:40,
    marginTop: -5,
    flexDirection: 'row',
    pat: mobH * 0.05,
  },
  closeIcon: {
    height: 16,
    width: 16,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    padding: 15,
    zIndex: 999,
  },
  profileIcon: {
    height: mobW * 0.18,
    width: mobW * 0.18,
    borderRadius: 40,
    marginTop: 3,
    borderColor: '#00AF66',
    borderWidth: 2,
    borderRadius: (mobW * 0.18) / 2,
  },
  txtContainer: {
    width: '65%',
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontFamily:BOLD
  },
  userEmail: {
    color: '#ffffff60',
    marginRight: 5,marginTop:3,
    fontSize: 14,fontFamily:REGULAR
  },
  editProfileContainer: {
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 6,width:80,
    marginRight: 17,
    marginTop: 10,
  },
  editBtnTxt: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
});

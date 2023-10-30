import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Alert
} from 'react-native';
import {BOLD, REGULAR, MEDIUM} from '../../utils/fonts';
import React, {useState, useEffect} from 'react';
import globalStyles from '../../styles/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import StorageProvider from '../../Session/StorageProvider';
import RestApiClient from '../../network/RestApiClient'; 
import Loader from '../customComp/Loader'
import { endPoints,methods,urlReqType } from '../../utils/config';
import {useTranslation} from 'react-i18next';
import {  useSelector } from 'react-redux';
import { color } from '../../utils/color';

const MyAccount = (props) => {
  const {t} = useTranslation();
  const ride = useSelector(state => state.ride);
  console.log('home ride', ride);
  const navigation = useNavigation();

  const logout =() => {
    Alert.alert(
      t('LOGOUT'),
      t('logoutConfirmMsg'), [{
          text: t('No'),
          // onPress: () => console.log('Cancel Pressed'),
      }, {
          text: t('Yes'),
          onPress: () =>{
            props.navigation.navigate('Login');
            StorageProvider.clear();
            console.log('Log out')}
          }], {
        cancelable: false
      }
    );
  }
 
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserProfileInfo();
    });
    return unsubscribe;
  }, []);

  const [userDetails, setUserDetails] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');

  
  const getUserProfileInfo = async () => {
    await StorageProvider.getObject('accessToken')
      .then(res => {
        if (res) {
          setTimeout(() => {
          setIsFetching(true)
          RestApiClient(
            methods.GET,
            '',
            endPoints.GET_DRIVER_PROFILE_SELF,
            urlReqType.DMS,
            res?.accesstoken,
          )
            .then(response => {
              setIsFetching(false)
              console.log('userprofile', response);
              setUserDetails(response);
              setProfilePicture(response?.profilePicPath)
            })
            .catch(error => {
              setIsFetching(false)
              ToastAndroid.show(t('errorOccured'), ToastAndroid.SHORT);
              console.log(error);
            });
          }, 400);
        }
      })
      .catch(err => {
        setIsFetching(false)
        ToastAndroid.show(t('errorOccured'), ToastAndroid.SHORT);
      });
  };

  const EarningBlock = (type, earning) => {
    return (
      <View style={styles.SecondsChild}>
        {
          <Image
            style={{width: 22, height: 22}}
            source={
              type == 'Ratings'
                ? require('../../Assests/image/star_1.png')
                : type == 'Total Earnings!'
                ? require('../../Assests/image/rupee_1.png')
                : require('../../Assests/image/right_tik_1.png')
            }
          />
        }
        <Text
          style={[
            styles.textColor,
            {fontSize: 18, fontWeight: '600', marginTop: 7},
          ]}>
          {type == 'Ratings'
            ? earning
            : type == 'Total Earnings!'
            ? '₹' + earning
            : earning}
        </Text>
        <Text style={[styles.textColor, {fontSize: 14,opacity:0.6}]}>{t(type)}</Text>
      </View>
    );
  };
  
  
  const navigationBlocks = type => {
    return (
      <TouchableOpacity
        onPress={() => {
          type == 'Profile'
            ? navigation.navigate('EditDriverProfile',{userDetails:userDetails})
            : type == 'Basic Details'
            ? navigation.navigate('EditDriverBasicInfo',{userDetails:userDetails})
            : type == 'Address Details'
            ? navigation.navigate('EditDriverAddress',{userDetails:userDetails})
            : navigation.navigate('EditDriveKYCDocuments',{userDetails:userDetails});
        }}
        style={styles.thirdContainer}>
        <View style={styles.thirdsChild}>
          <Text style={{fontSize: 16,opacity:0.6, color: 'white'}}>{t(type)+' '}</Text>
          <Image
            style={{width: 15, height: 15}}
            source={require('../../Assests/image/right_arrow.png')}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Loader isFetching={isFetching}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:20}}>

        <View style={styles.topContainer}>

        <View
            style={{
              height: 120,
              width: 120,
              borderRadius: 60,
              borderWidth: 2,
              borderColor: '#00AF66',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => {
            profilePicture != null ?
                navigation.navigate('ImageView', { path: profilePicture})
               : null
              }}
              activeOpacity={1}
              style={{
                height: 120,
                width: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: '#00AF66',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 112,
                  width: 112,
                  borderRadius: 112 / 2,
                  borderWidth: 2,
                  borderColor: '#00AF66',
                  alignSelf: 'center',
                  backgroundColor: '#00AF66',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={
                    profilePicture != ''
                      ? {uri: profilePicture}
                      : require('../../Assests/image/user_avtar.png')
                  }
                  style={
                    profilePicture != ''
                      ? {
                          height: 112,
                          width: 112,
                          borderRadius: 112 / 2,
                          resizeMode: 'contain',
                        }
                      : {height: 50, width: 50, resizeMode: 'contain'}
                  }
                />
              </View>
            </TouchableOpacity>
          </View>

 
          <View style={{marginVertical: 10, alignItems: 'center'}}>
            <Text
              style={[styles.textColor, {fontSize: 22, fontFamily: BOLD}]}>
              {userDetails?.firstName?.trim() +' '+userDetails?.lastName?.trim()}
            </Text>
            <Text style={[styles.textColor, {fontSize: 16,opacity:0.6,marginTop:5}]}>
              {userDetails?.email}
            </Text>
          </View>
        </View>

        <View style={styles.SecondContainer}>
          { console.log("hhhh",ride?.rideHistory?.totalCount)}
          {EarningBlock('Total Trips', ride?.rideHistory?.totalCount ?  ride?.rideHistory?.totalCount : 0)}
          {EarningBlock('Total Earnings!',ride?.driverTotalEarning.toFixed(2))}
          {EarningBlock('Ratings',userDetails?.avgRating?.toFixed(2))}
        </View>

        <View style={styles.thirdContainer}>
          <View style={styles.thirdsChild}>
            <Text style={{fontSize: 16,opacity:0.6, color: 'white'}}>{t("Phone")}</Text>
            <Text style={styles.textInput}>{userDetails?.mobile}</Text>
          </View>
          <View style={styles.thirdsChild}>
            <Text style={{fontSize: 16,opacity:0.6, color: 'white'}}>{t('Email')}</Text>
            <Text  style={styles.textInput}> {userDetails.email}</Text>
          </View>
          {/* <View style={styles.thirdsChild}>
            <Text style={{fontSize: 18, color: 'white'}}>{t("Language")}</Text>
            <Text style={{fontSize: 18, color: 'white'}}>{userDetails?.language}</Text>
          </View> */}
        </View>

        {navigationBlocks('Profile')}
        {navigationBlocks('Basic Details')}
        {navigationBlocks('Address Details')}
        {navigationBlocks('KYC Document')}

        {/* last container */}
        {/* <View style={styles.btnContainer}>
          <Pressable
            style={globalStyles.button}
            onPress={() => {
              logout()
            }}>
            <Text style={globalStyles.buttonText}>{t("LOGOUT")+' '}</Text>
          </Pressable>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor:'#001A0F',
    height: '100%',
    color: 'white',
    paddingHorizontal: 16,
  },
  textColor: {
    color: 'white',
  },
  topContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    marginTop: 10,
  },
  userImage: {
    width: 123,
    height: 125,
  },
  SecondContainer: {
    flexDirection: 'row',
    height: 105,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: color.black_medum,
    borderRadius: 10,
    borderColor: color.black_medum,
    marginTop: 20,
  },
  SecondsChild: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thirdContainer: {
    marginTop: 20,
    backgroundColor: color.black_medum,
    borderRadius: 10,
    borderColor: color.black_medum,
  },
  thirdsChild: {
    height: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 16,
    color: 'white',
  },
  btnContainer: {
    marginTop: 20,
  },
});

import React, { useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CustomPressable from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import { getDriverProfileInfo } from '../../Redux/appSlice';
import { useDispatch } from 'react-redux';
import {useTranslation} from 'react-i18next';
import Loader from '../customComp/Loader';
import LinearGradient from 'react-native-linear-gradient';

export default function ReturnEv({navigation}) {
  const {t} = useTranslation();
  const [dropaddress, setdropaddress] = useState('C 17, SMA, Jahangirpuri Industrial Area, Jahangirpuri, Delhi, 110033');
  const [loading, setIsLoading] = useState(true);
  const [rentalOrderDetails, setRentalOrderDetails] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      getUserProfileInfo();
    });
    return unsubscribe;
  }, [navigation]);

  const dispatch = useDispatch();
  const getUserProfileInfo = async () => {
    dispatch(getDriverProfileInfo()).then(async res => {
      setRentalOrderDetails(res?.payload?.rentalOrderDetails)
      console.log('rentalOrderDetails--',res?.payload?.rentalOrderDetails);
    }).catch(err => {
      console.log('error',err);
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <View style={styles.headerBox}>
        <View style={styles.headerSubBox}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="arrowleft" color={color.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.headerTitle}>{t('Return EV')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row'}} />
        </View>

        <View style={styles.listcontainer}>
          <Text
            style={{
              color: color.white,
              textAlign: 'left',
              paddingLeft: 20,
              marginVertical: 15,
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
            }}>
            {'Bronze - Monthly (₹4,999)'}
          </Text>
          <Text
            style={[
              styles.listTitle,
              {justifyContent: 'flex-start', paddingHorizontal: 10},
            ]}>
            {t('EV Drop off Details')}
          </Text>
          <Text
            style={{
              color: color.white,
              justifyContent: 'flex-start',
              paddingLeft: 20,
              marginTop: 10,
              fontFamily: 'Roboto-Bold',
              fontSize: 16,
            }}>
            {t('DL - 7S EA 0110')}
          </Text>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{flexDirection: 'row', paddingLeft: 20}}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../Assests/image/calendar.png')}
              />
              <Text style={[styles.listTitle, {justifyContent: 'flex-start'}]}>
                {t('2 December 2023')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                right: 0,
                position: 'absolute',
                marginRight: 20,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../Assests/image/mytrips.png')}
              />
              <Text style={[styles.listTitle, {justifyContent: 'flex-end'}]}>
                {t('01:00 PM')}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', margin: 20}}>
            <Image
              style={{
                height: mobW * 0.045,
                marginTop: 5,
                resizeMode: 'contain',
                width: mobW * 0.045,
              }}
              source={require('../../Assests/image/dis_away.png')}
            />
            <Text style={[styles.listTitle, {lineHeight: 20}]}>
              {' '}
              {dropaddress}{' '}
            </Text>
          </View>
          <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={['#00AF66', '#00AF66']}
          style={{borderRadius:10,marginHorizontal:20,marginBottom:20}}
         
         >
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              position: 'relative',
              bottom: 0,
              marginVertical: 10,
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'space-between',
              width:'80%'
            }}
            onPress={() => {
              navigation.navigate('WayHub', {
                btnname: 'SCAN QR',
                screenname: 'ReturnEv',
              });
            }}>
                      
              <View/>
            <Text style={{fontSize:18,fontWeight:'700'}}>
            {t('Way to Operation Hub')}
            </Text>
            <View style={{borderRadius:30/2,padding:6,backgroundColor:"#001A0F50"}}>

            <Image
              style={{width: 17, height: 17,tintColor:'#ffffff'}}
              source={require('../../Assests/image/direction_1.png')}
            />
            </View>
          </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      <CustomPressable
        text={t('myPlans_EXTEND_PLAN')}
        marginTop={20}
        btnWidth={mobW - 60}
        route={''}
        isGradient={true}
        backgroundColor="#10281C"
        onPress={() => {
          navigation.navigate('ExtendPlans');
        }}
        position={'absolute'}
        bottom={120}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 50,
          width: mobW,
          paddingHorizontal: 30,
        }}>
        <TouchableOpacity
          style={{
            height: 50,
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#00AF66',
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.navigate('Scan');
          }}>
          <Text
            style={{
              fontSize: 20,
              alignSelf: 'center',
              color: '#ffffff',
              fontFamily: 'Roboto-Bold',
            }}>
            {' '}{t('Scan QR')}{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: color.black_BG, flex: 1, paddingVertical: 20},
  headerBox: {paddingTop: mobH * 0.032},
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
  },
  listbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 60,
    marginTop: 5,
  },
  listcontainer: {
    backgroundColor: '#10281C',
    marginHorizontal: 15,
    borderRadius: 14,
    marginTop: 30,
  },
  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginLeft: -20,
  },
  listTitle: {
    color: color.white,
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
});

const modalStyles = StyleSheet.create({
  touchOpacity: {
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 20,
    width: mobW - 80,
    height: '90%',
  },
  container1: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
    borderWidth: 1,
  },

  innerContainer: {
    backgroundColor: '#10281C',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    height: '65%',
    marginVertical: '30%',
  },

  innerContainer1: {
    backgroundColor: color.black_BG,
    height: mobH,
  },
  title_head: {
    fontSize: 24,
    marginTop: 20,
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    marginTop: 5,
    fontFamily: 'Roboto-Regular',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title2: {
    fontSize: 18,
    marginTop: -5,
    fontFamily: 'Roboto-Regular',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title1: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginVertical: 30,
    marginHorizontal: 26,
    lineHeight: 20,
    justifyContent: 'center',
    textAlign: 'center',
  },
  titlelist: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    paddingLeft: 10,
  },
});

const Scanstyles = {
  scrollViewStyle: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  cardView: {
    width: mobW - 32,
    height: mobH - 350,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
  },
};

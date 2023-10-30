import React,{useEffect, useRef, useState,useCallback}  from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import {color} from '../../utils/color';
import {BOLD, MEDIUM, REGULAR} from '../../utils/fonts';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
import { useFocusEffect } from '@react-navigation/native';
import StorageProvider from '../../Session/StorageProvider';
import {useSelector, useDispatch} from 'react-redux';
import { mobW, urls } from '../../utils/config';
import {useTranslation} from 'react-i18next';

import {

  getDriverTodayEarning,
 
} from '../../Redux/rideSlice';

const topStatusBarHeight = Platform.OS=='android'? StatusBar.currentHeight+2 : height * 0.040
const MapHeader = ({onPress}) => {
  
  const ride = useSelector(state => state.ride);
  const dispatch = useDispatch();
  const {t} = useTranslation();


 
  return (
    <View style={styles.mapHeaderContainer}>
      {ride.isTripEnded ? 
      <TouchableOpacity/>  :
      <TouchableOpacity
        onPress={() => {
          onPress();
        }}
        style={styles.toggleTouchableContainer}>
        <Image
          style={{
            width: mobW * 0.2,
            height: mobW * 0.2,
          }}
          source={require('../../Assests/image/blueBars.png')}
        />
      </TouchableOpacity>
}


      <View>
        <View style={{flexDirection: 'row'}}>
          <Image
            style={{width: 12, height: 12, resizeMode: 'contain'}}
            source={require('../../Assests/image/rupee.png')}
          />
          <Text style={styles.price}>
             {ride?.driverTodayEarning ? ride?.driverTodayEarning.toFixed(2) : 0.00}
          </Text>
        </View>
        <Text style={styles.totalEarningText}>{t("MapHeader_Earning")}</Text>
      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  mapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: topStatusBarHeight,
    zIndex: 999,
    backgroundColor: '#001A0F20',
    padding: 6,
    width: '100%',
  },
  toggleTouchableContainer: {
   marginTop:-15
  },
  toggleImage: {
    width: 15,
    height: 19,
    alignSelf: 'center',
  },
  price: {
    fontFamily: BOLD,
    fontSize: 24,
    color: color.white,
    alignSelf: 'flex-end',
    textAlign:'right',
  },
  totalEarningText: {
    fontFamily: MEDIUM,
    fontSize: 15,
    color: color.greySubHeading,
  },
});
export default MapHeader;

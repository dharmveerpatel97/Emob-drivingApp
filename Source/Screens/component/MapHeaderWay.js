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
import { useSelector } from 'react-redux';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
import { useFocusEffect } from '@react-navigation/native';
import StorageProvider from '../../Session/StorageProvider';
import { urls } from '../../utils/config';
const topStatusBarHeight = Platform.OS=='android'? StatusBar.currentHeight+2 : height * 0.040
const MapHeader = ({onPress}) => {
  const ride = useSelector(state => state.ride);
 
  
  return (
    <View style={styles.mapHeaderContainer}>
    
    
      <TouchableOpacity
        onPress={() => {
          onPress();
        }}
        style={styles.toggleTouchableContainer}>
        <Image
          source={require('../../Assests/image/back.png')}
          style={styles.toggleImage}
        />
      </TouchableOpacity>




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
    width: 40,
    height: 40,
    justifyContent: 'center',
    backgroundColor:'#10281C',
    borderRadius: 30,
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

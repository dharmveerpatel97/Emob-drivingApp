import React from 'react';
import {View, StyleSheet, Image, Text,TouchableOpacity,Linking} from 'react-native';
import {color} from '../../../utils/color';
import {REGULAR} from '../../../utils/fonts';
import { cancelRide } from '../../../Redux/rideSlice';
import { useDispatch } from 'react-redux';
import StorageProvider from '../../../Session/StorageProvider';
const CircularButton = ({source, backgroundColor, title,rideDetails,type=''}) => {
  const dispatch = useDispatch();
    const onClick=()=>{
        if(type=='calls'){
           (rideDetails?.passenger?.phoneNo) && Linking.openURL(`tel:${rideDetails?.passenger?.phoneNo}`)
        }
        if(type=='cancel'){
          console.log('rideDetails',rideDetails)
          dispatch(cancelRide(rideDetails.id)).then(async()=>{
            await StorageProvider.saveItem('isInBetweenRide','no')
          });
        }
    }
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={()=>{onClick()}} style={{justifyContent: 'center'}}>
      <View style={[{backgroundColor: backgroundColor}, styles.conatiner]}>
        <Image
          source={source}
          style={{width: 21, height: 21, alignSelf: 'center'}}
        />
      </View>
      <Text
        style={{
          alignSelf: 'center',
          fontFamily: REGULAR,
          color: color.greySubHeading,
          fontSize: 14,
          marginTop: 5,
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  conatiner: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
export default CircularButton;

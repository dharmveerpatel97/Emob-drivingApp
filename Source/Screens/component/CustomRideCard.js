import {View, Text, Image, StyleSheet,TouchableOpacity} from 'react-native';
import React from 'react';
import {color} from '../../utils/color'; 
import { mobW,mobH } from '../../utils/config'; 
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import { getPriceWithSymbol } from '../../utils/commonFunction';
export default function CustomRideCard({data,navigation,rideData,cancelButton=Function}) {

  function formatUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return moment(date).format('ddd, h:mm A');
  }
  const {t} = useTranslation();


  return (
    <TouchableOpacity key={rideData.id} onPress={()=>{
      navigation.navigate('RideDetails',{rideId:rideData.id})
    }}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View style={{justifyContent: 'center', height: mobW * 0.25}}>
            <Image
              style={styles.rideIcons}
              source={require('../../Assests/image/start_icon.png')}
            />
            <View style={styles.dotedIcons} />
            <Image
              style={styles.rideIcons}
              source={require('../../Assests/image/end_icon.png')}
            />
          </View>
          <View style={styles.secondBox}>
            <Text style={styles.startPointTxt} numberOfLines={1}>
              {rideData?.source?.address}
            </Text>
            <Text numberOfLines={1} style={styles.startPointTxt}>
              {rideData?.destination?.address}
            </Text>
          </View>
        </View>
        <View style={styles.devider} />

        {/* {(data.type === 'current'  &&  rideData.status=='assigned' &&  rideData.status=='arrived') && ( */}
        {data.type === 'current' &&
          <View style={styles.bottomData}>
            <Text style={styles.currentRideRupee}> {getPriceWithSymbol(rideData?.finalFare)}</Text>
            <TouchableOpacity onPress={()=>{cancelButton(rideData.id)}} activeOpacity={0.6} style={styles.cancelButton}>
              <Text style={styles.cancelButtonTxt}>{t("RideCard_Cancel")}</Text>
            </TouchableOpacity>
          </View>
          }
        {/* )} */}
        {(data.type === 'complete' || data.type === 'cancelled') && (
          <View
            style={styles.completeCancelBox}>
            <Text
              style={styles.completeCancelleftBottom}>
              {/* Yesterday, 7:29 AM */}
            
              {formatUnixTimestamp(rideData?.updatedAt)}
               
            </Text>
            <View
              style={styles.completeCancelRightBottom}>
              <Text
                style={styles.completeCancelleftBottom}>
                {getPriceWithSymbol(rideData?.finalFare)}
              </Text>
              <Image
                source={require('../../Assests/image/right_arrow.png')}
                tintColor="#fff"
                style={{
                  height: mobW * 0.03,
                  width: mobW * 0.03,
                  marginLeft: 20,
                }}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#10281C',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: color.Blue_light,
    paddingHorizontal: mobW * 0.03,
    paddingVertical: mobW * 0.03,
    marginTop: 20,
  },
  rideIcons: {
    height: mobW * 0.07,
    width: mobW * 0.07,
    resizeMode:"contain"
  },
  dotedIcons: {
    borderStyle: 'dotted',
    height: mobW * 0.077,
    borderLeftWidth: 2,
    borderColor: color.white,
    marginLeft: mobW * 0.0326,
  },
  secondBox: {
    justifyContent: 'space-between',
    height: mobW * 0.21,width:'90%',
    paddingTop: mobW * 0.02,
    marginLeft: mobW * 0.03,
  },
  startPointTxt: {
    color: '#fff',
    fontSize: mobW * 0.034,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: color.black_medum_50,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  cancelButtonTxt: {
    color: color.red,
    fontWeight: '600',
    fontSize: mobW * 0.036,
  },
  currentRideRupee: {
    color: color.white,
    fontWeight: '600',
    fontSize: mobW * 0.036,
  },
  bottomData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  devider: {
    height: 1.5,
    width: '100%',
    backgroundColor: color.riderDiveder,
  },
  completeCancelBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: mobW * 0.05,
  },
  completeCancelleftBottom: {
    color: '#fff',
    fontSize: mobW * 0.03,
  },
  completeCancelRightBottom: {
   
                paddingHorizontal: 10,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
  },
});

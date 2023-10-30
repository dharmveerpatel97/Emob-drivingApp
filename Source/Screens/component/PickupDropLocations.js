import {Image, Text, View} from 'react-native';
import {BOLD, REGULAR} from '../../utils/fonts';
import React, {useEffect, useState} from 'react';
import {t} from 'i18next';
import {color} from '../../utils/color';
import moment from 'moment';
const PickupDropLocation = ({pickupLocation, droptime, starttime}) => {
  function formatUnixTimestamp(timestamp) {
    console.log('starttime', starttime);
    const date = new Date((starttime * 60 + timestamp) * 1000);
    return moment(date).format('h:mm A');
  }
  function formatUnixTimestampdrop(timestamp) {
    console.log('starttime droptime', starttime, droptime);
    const date = new Date((droptime * 60 + starttime * 60 + timestamp) * 1000);
    return moment(date).format('h:mm A');
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
          marginBottom: 8,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '8%'}}>
            <Image
              style={{
                width: 16,
                height: 16,
                alignSelf: 'flex-start',
                marginTop: 3,
                resizeMode: 'contain',
              }}
              source={require('../../Assests/image/distance.png')}
            />
          </View>
          <View style={{width: '75%'}}>
            <Text style={{fontsize: 12, fontFamily: REGULAR, color: '#ACACAC'}}>
              {t('Pickup Location')}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontsize: 16,
                fontFamily: BOLD,
                color: '#ffffff',
                marginTop: 5,
              }}>
              {pickupLocation?.source?.address}
            </Text>
          </View>
          <View style={{alignItems: 'flex-end', width: '17%'}}>
            <Text
              style={{
                fontsize: 12,
                opacity: 0.6,
                textAlign: 'right',
                fontFamily: REGULAR,
                color: color.white,
                width: '100%',
              }}>
              {formatUnixTimestamp(pickupLocation?.createdAt)}
            </Text>
          </View>
        </View>

        <Text style={{fontsize: 12, fontFamily: REGULAR, color: '#ACACAC'}}>
          {' '}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '8%'}}>
            <Image
              style={{
                width: 18,
                height: 18,
                alignSelf: 'flex-start',
                marginTop: 3,
                resizeMode: 'contain',
              }}
              source={require('../../Assests/image/dis_away.png')}
            />
          </View>
          <View style={{width: '75%'}}>
            <Text
              style={{
                fontsize: 12,
                fontFamily: REGULAR,
                color: color.white_50,
              }}>
              {t('Drop Location')}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontsize: 16,
                fontFamily: BOLD,
                color: color.white,
                marginTop: 5,
              }}>
              {pickupLocation?.destination?.address}
            </Text>
          </View>
          <View style={{alignItems: 'flex-end', width: '17%'}}>
            <Text
              style={{
                fontsize: 12,
                opacity: 0.6,
                textAlign: 'right',
                fontFamily: REGULAR,
                color: color.white,
                width: '100%',
              }}>
              {formatUnixTimestampdrop(pickupLocation?.createdAt)}
            </Text>
          </View>
        </View>

        <Text
          style={{fontsize: 12, fontFamily: REGULAR, color: '#ACACAC'}}></Text>
      </View>
    </View>
  );
};
export default PickupDropLocation;

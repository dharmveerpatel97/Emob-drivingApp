import {Text, StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {formatDate, mobH, mobW} from '../../../utils/commonFunction';
import {color} from '../../../utils/color';
import {BOLD, REGULAR} from '../../../utils/fonts';
export default function HomeInServicReqBox({
  rentalPlanName,
  rentalPlanAmount,
  rentalPlanStartTime,
  rentalPlanEndTime,
  rentalPlanStartDate,
  rentalPlanEndDate,
  rentalPlanStatus,
}) {
  const {t} = useTranslation();
  const capitalizeFirstCharacter = str => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  return (
    <View>
      <View
        style={{
          backgroundColor: color.purpleborder,
          marginHorizontal: mobW*0.044,
          marginBottom:15,
          borderRadius: 10,
        }}>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Text
            style={{
              color: color.white,
              textAlign: 'left',
              fontWeight: '800',
              paddingLeft: 20,
              fontSize: 16,
              fontFamily: BOLD,
            }}>
            {capitalizeFirstCharacter(rentalPlanName)}
            {' ('}
            {'₹'}
            {rentalPlanAmount}
            {'/-'}
            {')'}
          </Text>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5}}>
          <Text
            style={{
              color: color.white,
              width: '50%',
              fontWeight: '700',
              justifyContent: 'flex-start',
              paddingTop: 10,
              paddingLeft: 20,
              fontSize: 13,
              fontFamily: BOLD,
            }}>
            {t('home_EV_Pick_Up')}
          </Text>
          <Text
            style={{
              color: color.white,
              fontWeight: '700',
              width: '50%',
              position: 'absolute',
              right: 20,
              justifyContent: 'flex-start',
              paddingTop: 10,
              paddingLeft: 20,
              fontSize: 13,
              fontFamily: BOLD,
            }}>
            {t('home_Plan_Expiry')}
          </Text>
          {/* } */}
        </View>

        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View style={{flexDirection: 'row', paddingLeft: 20, width: '50%'}}>
            <Image
              style={{
                width: 15,
                height: 15,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              source={require('../../../Assests/image/calendar_w.png')}
            />
            <Text
              style={{
                color: color.white,
                justifyContent: 'flex-start',
                opacity: 0.7,
                marginHorizontal: 5,
                fontSize: 12,
                fontFamily: REGULAR,
              }}>
              {formatDate(rentalPlanStartDate, 'DD MMM YYYY')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '50%',
            }}>
            <Image
              style={{
                width: 15,
                height: 15,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              source={require('../../../Assests/image/calendar_w.png')}
            />

            <Text
              style={{
                color: color.white,
                fontFamily: REGULAR,
                justifyContent: 'flex-end',
                marginHorizontal: 5,
                opacity: 0.7,
                fontSize: 12,
              }}>
              {formatDate(rentalPlanEndDate, 'DD MMM YYYY')}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 15}}>
          <View style={{flexDirection: 'row', paddingLeft: 20, width: '50%'}}>
            <Image
              style={{
                width: 15,
                height: 15,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              source={require('../../../Assests/image/clock_w.png')}
            />
            <Text
              style={{
                color: color.white,
                justifyContent: 'flex-start',

                marginHorizontal: 5,
                fontSize: 12,
                opacity: 0.7,
                fontFamily: REGULAR,
              }}>
              {formatDate(rentalPlanStartTime, 'h:mm A')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '50%',
            }}>
            <Image
              style={{
                width: 15,
                height: 15,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              source={require('../../../Assests/image/clock_w.png')}
            />

            <Text
              style={{
                color: color.white,
                fontFamily: REGULAR,
                justifyContent: 'flex-end',
                marginHorizontal: 5,
                opacity: 0.7,
                fontSize: 12,
              }}>
              {formatDate(rentalPlanEndTime, 'h:mm A')}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          // navigation.navigate('WaytoOperationHub');
        }}>
        <View
          style={{
            borderWidth: 1.5,
            borderColor: color.purpleborder,
            borderRadius: 10,
            backgroundColor: color.black_medum,
            marginHorizontal: mobW*0.044,
            marginTop: 10,
            marginBottom: 10,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{
                width: 130,
                height: 80,
                resizeMode: 'cover',
                marginTop: 25,
                marginBottom: 10,
              }}
              source={require('../../../Assests/image/wait_ev_app.png')}
            />
          </View>
          {rentalPlanStatus == 'ordered' ? (
            <Text style={styles.listTitle1}>
              {' '}
              {t('home_rentalOrderBox_des')}
            </Text>
          ) : (
            <Text style={styles.listTitle1}>
              {' '}
              {t('home_rentalOrderBox_des1')}
            </Text>
          )}

          <Text style={styles.listTitle1}>
            {t('home_rentalOrderBox_Thank_You')}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  listTitle1: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 25,
    marginVertical: 10,
    color: color.white,
    paddingHorizontal: 20,
    fontSize: 14,
    fontFamily: REGULAR,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    right: 0,
    borderRadius: 10,
  },
  modalView: {
    position: 'absolute',
    width: '85%',
    backgroundColor: '#10281C',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

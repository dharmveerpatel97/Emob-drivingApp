import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {mobW} from '../../../utils/commonFunction';
import {color} from '../../../utils/color';
export default function HomeEvReqBox({btnEvRequest}) {
  const {t} = useTranslation();
  return (
    <View
      style={{
        justifyContent: 'center',
        borderRadius: 15,
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <ImageBackground
      imageStyle={{borderRadius:10}}
        style={{width: mobW * 0.92, height: 260, resizeMode: 'contain'}}
        source={require('../../../Assests/image/banner_dash.png')}>
        <View
          style={{
            flexDirection: 'column',
            marginHorizontal: 20,
            marginVertical: 25,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: color.white,
              fontFamily: 'Roboto-Bold',
            }}>
            {t('home_notEvBox_Request_Vehicle')}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: color.white,
              fontFamily: 'Roboto-Bold',
            }}>
            {t('home_notEvBox_start_earning')}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: color.white,
              marginTop: 10,
              lineHeight: 20,
              fontFamily: 'Roboto-Regular',
            }}>
            {t('home_notEvBox_des')}: {'\n'}1.{t('home_notEvBox_des1')} {'\n'}2.
            {t('home_notEvBox_des2')} {'\n'}3.
            {t('home_notEvBox_des3')}
          </Text>

          <TouchableOpacity
            style={{
              height: 50,
              marginTop: 20,
              marginBottom: 10,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}
            onPress={() => {
              btnEvRequest();
            }}>
            <Text style={{fontWeight: '700', color: '#00AF66', fontSize: 18}}>
              {t('home_VIEW_PLAN_TO_RENT_EV')}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({});

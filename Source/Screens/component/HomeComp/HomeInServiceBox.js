import {Text, StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {mobW} from '../../../utils/commonFunction';
import {color} from '../../../utils/color';
export default function HomeInServiceBox() {
  const {t} = useTranslation();
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 2}}
      colors={['#00AF66', '#000000']}
      width={mobW * 0.92}
      style={{alignSelf: 'center', borderRadius: 10}}>
      <View
        style={{
          flexDirection: 'column',
          marginHorizontal: 20,
          marginVertical: 25,
          flexDirection:'row',
          justifyContent:'space-between',

        }}>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: color.white,
              fontFamily: 'Roboto-Bold',
            }}>
            {t('Drive 25 trips,')}
            {'\n'}
            {t('Make 250 Extra')}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: color.white,
              marginTop: 10,
              lineHeight: 20,
              fontFamily: 'Roboto-Regular',
            }}>
            {t('inServiceBoxdes1')} {'\n'}
            {t('inServiceBoxdes2')} {'\n'}
            {t('inServiceBoxdes3')}
          </Text>
        </View>
        <Image source={require('../../../Assests/image/auto.png')} style={{height:mobW*0.30,width:mobW*0.30,resizeMode:'contain'}}/>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({});

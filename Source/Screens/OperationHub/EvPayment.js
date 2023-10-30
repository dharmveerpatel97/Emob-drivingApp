import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Header,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Text,
  FlatList,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import CustomPressable from '../customComp/CustomPressable';
import RentalEVStyle from '../../styles/RentalEVStyle';
import CustomBtn from '../customComp/customBtn';
import {color} from '../../utils/color';
import {mobW, mobH} from '../../utils/config';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import CustomTripButton from '../customComp/CustomTripButton';
import {useTranslation} from 'react-i18next';

const EvPayment = ({route, navigation}) => {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <View
        style={{
          justifyContent: 'center',
          marginTop: 200,
          alignItems: 'center',
        }}>
        {route.params.showmsg ? (
          <Image
            style={{width: 120, height: 120, resizeMode: 'contain'}}
            source={require('../../Assests/image/ev_pay_suc.png')}
          />
        ) : (
          <Image
            style={{width: 300, height: 230, resizeMode: 'contain'}}
            source={require('../../Assests/image/ev_pay_fail.png')}
          />
        )}
      </View>
      {route.params.showmsg ? (
        <Text style={styles.listTitle}>{t('Payment Successful')}</Text>
      ) : (
        <Text style={styles.listTitle}>{t('Payment Declined')}</Text>
      )}
      {route.params.showmsg ? (
        <Text style={styles.listTitle1}>
          {
            t('Thank you so much. Your payment has been received. Now you can collect your EV and Enjoy Rides.')
          }
        </Text>
      ) : (
        <Text style={styles.listTitle1}>
          {
            t('It looks like your bank is temporarily not accepting payment requests. Bank server unavailable. Please try again”.')
          }
        </Text>
      )}
      <View
        style={{
          borderColor: color.white,
          marginHorizontal: 20,
          marginVertical: 25,
          borderStyle: 'dotted',
          borderWidth: 1,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
        <Text style={[styles.listTitle2, {fontFamily: 'Roboto-Regular'}]}>
          {t('Payment ID :')}
        </Text>
        <Text style={[styles.listTitle2, {fontFamily: 'Roboto-Bold'}]}>
          {t('MI07RA52I')}
        </Text>
      </View>

      <CustomPressable
        text={route.params.showmsg ? route.params.rootname : 'Try Again'}
        marginTop={100}
        btnWidth={mobW - 100}
        route={''}
        isGradient={true}
        backgroundColor="#10281C"
        onPress={() => {
          route.params.showmsg
            ? navigation.navigate(route.params.rootmove)
            : navigation.goBack();
        }}
        position={'relative'}
        bottom={0}
      />
    </SafeAreaView>
  );
};

export default EvPayment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.black_BG,
    flex: 1,
    paddingVertical: 20,
  },

  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  listTitle: {
    width: '100%',
    textAlign: 'center',
    color: color.white,
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    height: 30,
    marginTop: 20,
  },
  listTitle1: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    height: 80,
    padding: 20,
    lineHeight: 20,
  },
  listTitle2: {
    textAlign: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: 14,
  },
});

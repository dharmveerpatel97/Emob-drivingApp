import {
  View,
  Dimensions,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import QrCodeGenerator from '../../utils/QrCodeGenerator';
import {color} from '../../utils/color';
import {BOLD, MEDIUM, REGULAR} from '../../utils/fonts';

import {useState} from 'react';
import {t} from 'i18next';
import CustomPressable from '../customComp/CustomPressable';
import SwipeButton from '../../rn-swipe-button';
import CustomToastProvider from '../customComp/CustomToastProvider';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const FinalFare = ({showFinalFare, onSwipeSuccess, totalFare, rideDetails}) => {
  const {t} = useTranslation();
  const [paymentType, setPaymentType] = useState('cashPayment');
  useEffect(() => {
    console.log('ooooooo', rideDetails);
  }, []);
  const CheckoutButton = () => {
    return (
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: '#fff',
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}></View>
    );
  };

  return (
    <Modal transparent visible={showFinalFare}>
      <View style={styles.container}>
        <CustomToastProvider />
        <View style={styles.innerContainer}>
          <View style={{marginHorizontal: 16}}>
            <View style={{alignSelf: 'center'}}>
              <Text
                style={{fontFamily: REGULAR, color: color.white, fontSize: 22}}>
                {t('finalFareTotlalFare')}
                <Text
                  style={{
                    fontFamily: BOLD,
                    fontWeight: '800',
                    color: color.white,
                    fontSize: 22,
                  }}>
                  {' '}
                  ₹ {totalFare.toFixed(2)}
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.5}
              disabled={true}
              onPress={() => {
                setPaymentType('cashPayment');
              }}
              style={{
                borderWidth: 1,
                borderColor: '#00AF66',
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                height: 50,
                marginTop: 30,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 16,
                  color: '#00AF66',
                  fontfamily: REGULAR,
                  marginStart: 10,
                }}>
                {t('finalFareCashPay')}
              </Text>
              <View
                activeOpacity={0.8}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'grey',
                  alignSelf: 'center',
                  marginEnd: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {paymentType === 'cashPayment' && (
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: '#00AF66',
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>

            {paymentType === 'personalPayment' && (
              <>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 33,
                    fontFamily: BOLD,
                    fontSize: 19,
                    color: color.white,
                  }}>
                  {t('finalFareScanPay')}
                </Text>
                <View
                  style={{
                    marginTop: 35,
                    width: 140,
                    height: 140,
                    alignSelf: 'center',
                    backgroundColor: '#0D1724',
                    borderRadius: 10,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: 135,
                      height: 135,
                      borderRadius: 10,
                      backgroundColor: '#fff',
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    <QrCodeGenerator value={'Hellooooo'} />
                  </View>
                </View>
              </>
            )}

            <SwipeButton
              containerStyles={{
                borderRadius: 5,
                color: '#fff',
                backgroundColor: '#00AF66',
                height: 55,
                marginTop: 37,
                paddingRight: 30,
              }}
              onSwipeFail={() => console.log('')}
              onSwipeStart={() => console.log('Swipe started!')}
              onSwipeSuccess={() => onSwipeSuccess()}
              railBackgroundColor="#00AF66"
              railStyles={{borderRadius: 5}}
              thumbIconComponent={CheckoutButton}
              gradientColor={['#00AF66', '#00AF66']}
              railFillBackgroundColor={'#699CF340'}
              thumbIconStyles={{borderRadius: 5}}
              titleColor={'#fff'}
              thumbIconWidth={45}
              height={45}
              text={'     ' + t('finalFarePayCollect') + '      '}
              title={t('finalFarePayCollect')}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#001A0F80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: width - 20,
    marginHorizontal: 16,
    backgroundColor: '#10281C',
    alignSelf: 'center',
    borderRadius: 10,
    paddingVertical: 15,
  },
});
export default FinalFare;

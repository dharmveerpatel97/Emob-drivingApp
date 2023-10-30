import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {color} from '../../utils/color';
import CustomPressable from '../customComp/CustomPressable';
import {BOLD, REGULAR} from '../../utils/fonts';
import {useTranslation} from 'react-i18next';
import RestApiClient from '../../network/RestApiClient';
import StorageProvider from '../../Session/StorageProvider';
import {resetStack} from '../../utils/commonFunction';
import {
  getDriverAllocation,
  getDriverProfileInfo,
  setToken,
} from '../../Redux/appSlice';
import {useDispatch} from 'react-redux';
import {endPoints, methods, urlReqType, urls} from '../../utils/config';
import axios from 'axios';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  distanceMatrix,
  getDriverRideStatus,
  openArrivedStartTrip1,
  openPaymentModal,
  openStartnavigationModal,
  setStartTripModalTrue,
} from '../../Redux/rideSlice';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const Otp = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNUmber] = useState(route.params.value);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [language, setLanguage] = useState('hn');
  const [autoFocus, setAutoFocus] = useState(true);
  let otpInputRef = useRef(null);

  const timeOutCallback = useCallback(
    () => setTimer(currTimer => currTimer - 1),
    [],
  );
  const [ErrorMessage, setErrorMessage] = useState('');
  const [otpsendmessage, setotpsendmessage] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setotpsendmessage(false);
    }, 3000);
    timer > 0 && setTimeout(timeOutCallback, 1000);
  }, [timer, timeOutCallback]);

  useEffect(() => {
    getLanguageValue();
  }, []);

  const getLanguageValue = async () => {
    let languageType = await StorageProvider.getItem('language');
    console.log('languageType---', languageType);
    setLanguage(languageType);
  };

  const resetTimer = function () {
    if (!timer) {
      setTimer(30);
    }
  };

  const resendOtp = async () => {
    setErrorMessage('');
    setAutoFocus(false);
    setOtp('');
    setResendLoader(true);
    await axios
      .post(urls.BASE_URL + endPoints.GENERATE_OTP, {
        mobile: mobileNumber,
        transactionType: 'OTPLogin',
        clientId: urls.CLIENT_ID,
      })
      .then(response => {
        setResendLoader(false);
        console.log(response, 'otp res');
        if (response.status === 200) {
          setotpsendmessage(true);
          setTimeout(() => {
            setotpsendmessage(false);
          }, 3000);
          setTimer(0);
          resetTimer();
          setAutoFocus(true);
        }
      })
      .catch(error => {
        setResendLoader(false);
        console.log(error);
      });
  };

  const verifyOtp = async () => {
    const body = {
      mobile: mobileNumber,
      transactionType: 'OTPLogin',
      otp: otp,
    };
    setIsLoading(true);

    if (otp !== undefined) {
      if (otp.length > 5) {
        setErrorMessage('');
        console.log('otpInputRef', otpInputRef);
        RestApiClient(
          methods.POST,
          JSON.stringify(body),
          endPoints.VALIDATE_OTP,
          urlReqType.IAM,
        )
          .then(response => {
            setIsLoading(false);
            if (response?.message) {
              setErrorMessage(t('**Invalid Otp'));
              console.log('popupmessage', response?.message);
            } else {
              console.log('popupmessage', response);

              if (response?.token) {
                StorageProvider.setObject('userdate', response).then(res => {
                  navigation.navigate('Profile', {value: mobileNumber});
                  getUserProfileInfo();
                });
              } else {
                StorageProvider.setObject('accessToken', response).then(res => {
                  dispatch(getDriverAllocation());
                  getUserProfileInfo();
                });
              }
            }
          })
          .catch(error => {
            setIsLoading(false);
            setErrorMessage(t('**Invalid Otp'));
            console.log('ERROR IN CATCH', error);
          });
      } else {
        setIsLoading(false);
        setErrorMessage(t('**Invalid Otp'));
      }
    } else {
      setIsLoading(false);
      setErrorMessage(t('**Invalid Otp'));
    }
  };

  const getUserProfileInfo = async () => {
    await StorageProvider.getObject('accessToken')
      .then(res => {
        if (res) {
          dispatch(setToken(res.accesstoken));
          console.log('res', res);
          dispatch(getDriverProfileInfo())
            .then(res => {
              let response = res?.payload;
              if (response) {
                if (response?.message == 'unable to process the request') {
                  navigation.navigate('signup', {value: '+918817046783'});
                } else {
                  if (
                    response?.drivingLicence &&
                    response?.policeVerification
                  ) {
                    if (
                      response?.drivingLicence?.status === 'verified' &&
                      response?.policeVerification?.status == 'verified'
                    ) {
                      checkRideStatus();
                    } else {
                      resetStack('UnverifiedDrawer', navigation);
                    }
                  } else {
                    navigation.navigate('KYC Documents');
                  }
                }
              } else {
                console.log('ERROR IN CATCH response', response);
              }
            })
            .catch(error => {
              console.log('ERROR IN CATCH', error);
            });
        }
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  const checkRideStatus = res => {
    dispatch(getDriverRideStatus())
      .then(response => {
        console.log('getDriverRideStatus response', response);
        if (response?.payload?.isRideExist) {
          let sorceDis = {
            source: response?.payload?.rideDetails?.source,
            destination: response?.payload?.rideDetails.destination,
          };
          dispatch(distanceMatrix(sorceDis))
            .then(() => {
              switch (response?.payload?.rideDetails?.status) {
                case 'assigned':
                  {
                    dispatch(setStartTripModalTrue());
                  }
                  break;
                case 'arrived':
                  {
                    dispatch(openArrivedStartTrip1());
                  }
                  break;
                case 'in_progress':
                  {
                    dispatch(openStartnavigationModal());
                  }
                  break;
                case 'ended_and_unpaid':
                  {
                    dispatch(openPaymentModal());
                  }
                  break;
                case 'completed':
                  {
                    resetStack('Home', navigation);
                  }
                  break;
                default:
                  resetStack('Home', navigation);
              }
              navigateRouteName = 'mapbox';
              resetStack('Home', navigation);
            })
            .catch(error => {
              console.log('distanceMatrix error', error);
            });
        } else {
          resetStack('Home', navigation);
        }
      })
      .catch(err => {
        resetStack('Home', navigation);
        console.log('getDriverRideStatus error', err);
      });
  };

  return (
    <SafeAreaView style={styles.constainer}>
      <KeyboardAwareScrollView>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80%',
          }}>
          <View style={{marginBottom: 30, marginTop: 100}}>
            <Image
              style={{width: 112, height: 112}}
              source={require('../../Assests/image/Otp/otpImg.png')}
            />
          </View>
          <View style={styles.headingContainer}>
            <Text style={styles.OtpHeading}>{t('OTP Verification')}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {language === 'hn' ? (
                <>
                  <Text style={styles.mobileNumber}>{mobileNumber}</Text>
                  <Text style={styles.otpSubheading}>
                    {t('OTP_will_be_sent_to')}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.otpSubheading}>
                    {t('OTP_will_be_sent_to') + ' '}
                  </Text>
                  <Text style={styles.mobileNumber}>{mobileNumber}</Text>
                </>
              )}

              <Pressable onPress={() => navigation.goBack()}>
                <Image
                  style={{width: 13, height: 14}}
                  source={require('../../Assests/image/edit_pencil.png')}
                />
              </Pressable>
            </View>
          </View>

          <Text style={[styles.otpSubheading, {margingTop: 50}]}>
            {ErrorMessage && (
              <Text style={{color: '#FE4A5E'}}>
                {'\n' + ErrorMessage}. <Text> {t('errorPleaseTryAgain')}</Text>
              </Text>
            )}
          </Text>

          <View style={styles.otpContainer}>
            <OTPInputView
              ref={otpInputRef}
              pinCount={6}
              style={{width: '88%', height: 100}}
              keyboardType={'phone-pad'}
              keyboardAppearance="dark"
              autoFocusOnLoad={autoFocus}
              codeInputFieldStyle={{
                width: 45,
                height: 45,
                borderWidth: 2,
                borderColor: ErrorMessage ? '#FE4A5E' : '#10281C',
                backgroundColor: color.black_BG,
                borderRadius: 8,
                fontSize: 20,
                color: '#fff',
              }}
              codeInputHighlightStyle={{borderColor: color.purpleborder}}
              code={otp}
              onCodeChanged={e => {
                setErrorMessage('');
                setotpsendmessage(false);
                setOtp(e);
              }}
            />

            {otpsendmessage ? (
              <Text style={{color: color.white, opacity: 0.7, fontSize: 14}}>
                {t('OTP sent Successfully')}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                marginTop: 10,
                marginBottom: 20,
              }}>
              {resendLoader && (
                <ActivityIndicator
                  style={{marginRight: 3}}
                  animating={true}
                  color={'#00AF66'}
                />
              )}
              <Text
                disabled={resendLoader}
                onPress={() => {
                  timer <= 0 ? resendOtp() : null;
                }}
                style={{
                  color: timer <= 0 ? '#00AF66' : '#c0c0c0',
                  fontFamily: REGULAR,
                  textDecorationLine: 'underline',
                }}>
                {t('click to Resend')}
              </Text>
              <Text style={{color: color.white, fontFamily: BOLD}}>
                {timer > 0 && '   '}
                {timer <= 0 ? null : timer + 's'}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 40,
            alignItems: 'center',
          }}>
          {otp.length > 5 ? (
            <CustomPressable
              text={t('OTP_VERIFY_OTP')}
              props={mobileNumber}
              btnWidth={Dimensions.get('screen').width / 1.2}
              route={'signup'}
              navigation={navigation}
              isLoading={isLoading}
              onPress={() => {
                verifyOtp();
              }}
              position={'relative'}
              bottom={30}
            />
          ) : (
            <TouchableOpacity
              disabled={true}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                height: 50,
                opacity: 0.4,
                width: Dimensions.get('screen').width / 1.2,
                backgroundColor: '#c0c0c0',
                position: 'relative',
                bottom: 0,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  color: '#ffffff',
                  fontFamily: BOLD,
                }}>
                {t('OTP_VERIFY_OTP')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    backgroundColor: '#10281C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    borderColor: 'red',
    btnWidth: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  OtpHeading: {
    color: '#fff',
    fontSize: 24,
    fontFamily: BOLD,
    margin: 14,
  },
  otpSubheading: {
    color: color.white_50,
    fontSize: 14,
    fontFamily: REGULAR,
  },
  mobileNumber: {
    color: '#ffff',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginRight: 10,
  },

  otpContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    marginTop: 50,
  },
  roundedTextInput: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 10,
    backgroundColor: '#10281C',
    color: '#fff',
    width: 50,
    height: 60,
    marginRight: 5,
    marginLeft: 5,
  },
  focusStyles: {
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: '#FE4A5E',
    backgroundColor: 'red',
    color: '#fff',
    width: 50,
    height: 60,
    marginRight: 5,
    marginLeft: 5,
  },
});

import {
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {responsive_factor} from '../../constant/auth';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {color} from '../../utils/color';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import CustomPressable from '../customComp/CustomPressable';
import {BOLD, REGULAR} from '../../utils/fonts';
import {useTranslation} from 'react-i18next';
import {endPoints, urls} from '../../utils/config';
import {isValidPhoneNumber} from '../../utils/commonFunction';

const Login = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [value, setValue] = useState('');
  const [ErrorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const phoneInput = useRef(undefined);
  const [Allow, setAllow] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        backPress,
      );
      return () => subscription.remove();
    }, []),
  );

  backPress = () => {
    BackHandler.exitApp();
    return true;
  };

  const generateOtp = async () => {
    setLoading(true);
    await axios
      .post(urls.BASE_URL + endPoints.GENERATE_OTP, {
        mobile: '+91' + value,
        transactionType: 'OTPLogin',
        clientId: urls.CLIENT_ID,
      })
      .then(response => {
        console.log(response, 'otp res');
        setLoading(false);
        if (response.status === 200) {
          console.log(response.data);
          navigation.navigate('Verify', {value: '+91' + value});
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS == 'ios' ? 'padding' : ''}>
        {/* <TouchableOpacity
            style={{marginHorizontal: 10}}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" color={'white'} size={30} />
          </TouchableOpacity> */}

        <ScrollView
          bounces={false}
          // containerStyle={{}}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'space-between',
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.toggleBtnView}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontFamily: BOLD,
                  marginVertical: 10,
                }}>
                {t('Login/Signup')}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  opacity: 0.7,
                  fontFamily: REGULAR,
                  marginTop: 10,
                }}>
                {t('We will send you 6 digit One Time Password')}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  opacity: 0.7,
                  fontFamily: REGULAR,
                  marginTop: 2,
                }}>
                {t('on this mobile number')}
              </Text>
            </View>

            <View style={styles.PhoneContainer}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: BOLD,
                  marginVertical: 6,
                  marginLeft: 2,
                }}>
                {t('Mobile No')}.*
              </Text>

              <View
                style={{
                  borderColor: color.purpleborder,
                  borderWidth: 1.5,
                  borderRadius: 14,
                  backgroundColor: color.Black_light,
                  // width: "100%",
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    width: '20%',
                    fontSize: 18,
                    fontFamily: REGULAR,
                    color: '#fff',
                  }}>
                  +91
                </Text>
                <TextInput
                  keyboardType="number-pad"
                  maxLength={10}
                  ref={phoneInput}
                  value={value}
                  onChangeText={text => {
                    setErrorMessage(t(''));
                    const hasSpecialCharacters =
                      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(text);
                    if (!hasSpecialCharacters) {
                      setValue(text);
                    }
                  }}
                  placeholder={t('Enter Number')}
                  placeholderTextColor={color.white_50}
                  style={{
                    width: '80%',
                    // backgroundColor: 'red',
                    fontSize: 18,
                    fontFamily: REGULAR,
                    color: '#fff',
                  }}
                />
              </View>
            </View>

            {ErrorMessage && ( 
              <Text style={{color: '#FE4A5E', marginLeft: 20}}>
                {ErrorMessage}
              </Text>
            )}
          </View>

          {/* </View> */}

          <View style={styles.btnContainer}>
            {value.length == 10 ? (
              <CustomPressable
                text={t('SEND CODE')}
                props={value}
                marginTop={200}
                btnWidth={Dimensions.get('screen').width / 1.1}
                route={'Verify'}
                navigation={navigation}
                isLoading={isLoading}
                onPress={() => {
                  if (isValidPhoneNumber(value)) {
                    setErrorMessage('');
                    generateOtp();
                  } else {
                    setErrorMessage(t('Invalid_mobile_number'));
                  }
                }}
                ErrorMessage={''}
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
                  borderRadius: 10,
                  alignSelf: 'center',
                  width: Dimensions.get('screen').width / 1.2,
                  backgroundColor: '#c0c0c0',
                  position: 'relative',
                  bottom: 20,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: '#ffffff',
                    fontFamily: BOLD,
                  }}>
                  {t('SEND CODE')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black_BG,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  toggleBtnView: {
    width: '100%',

    marginTop: 70,
    marginBottom: 36,
    // flexDirection: 'row',
    // backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 40,
    // borderColor: 'blue',
    // borderWidth: 2,
  },
  PhoneContainer: {
    width: '100%',
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 16,

    //  borderColor: 'blue',
    // borderWidth: 2,
  },
  phoneInput: {
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 2,

    padding: 16,
  },
  btn: {
    marginTop: 40,
    alignSelf: 'center',
  },
  btnContainer: {
    // marginBottom: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },

  signText: {
    color: '#00AF66',
    fontSize: 16,
    textAlign: 'center',
  },
  signUpBtn: {
    alignItems: 'center',
    justifyContent: 'center',

    padding: 10,
    borderRadius: 40,
  },
  signupText: {
    color: '#00AF66',
    fontSize: 16,
    textAlign: 'center',
  },
  formView: {
    flex: 1,
    marginVertical: responsive_factor * 10,
    justifyContent: 'space-between',
  },
  InputHeader: {
    color: 'white',
    fontSize: 16,
    marginVertical: 8,
  },
  inputfieldview: {
    justifyContent: 'center',
    margin: 20,
    // marginTop: 20
  },
  textinput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Platform.OS == 'ios' ? 14 : 6,
    borderWidth: 1.5,
    borderColor: '#00AF66',
    borderRadius: 10,

    backgroundColor: color.BackgroundColor,
  },
  forgetPassText: {
    color: '#00AF66',
    fontSize: 16,
    textAlign: 'right',
    marginTop: 14,
  },
  LoginBtnView: {
    marginTop: 50,
    marginHorizontal: 20,
    width: Dimensions.get('screen').width / 1.1,
    // borderRadius: 8,
    // padding: 10,
    // backgroundColor: 'blue',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 22,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 18,
    color: '#ffffff',
    // backgroundColor: 'transparent',
  },
});
